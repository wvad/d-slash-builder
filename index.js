'use strict';

const { readFileSync, writeFileSync } = require('node:fs');
const { Script } = require('node:vm');
const { inspect } = require('node:util');
const cssoMinify = require('csso').minify;
const uglifyMinify = require('uglify-js').minify;

function minifyHTML(filename) {
  const text = readFileSync(filename, 'utf8');
  const minified = text
    .split(/\n+/)
    .map(str => str.trim())
    .join('');
  writeFileSync(`docs/${filename}`, minified);
}

function minifyCSS(filename) {
  const outfile = `docs/${filename}`;
  try {
    const code = cssoMinify(readFileSync(filename, 'utf8')).css;
    writeFileSync(outfile, code);
  } catch (error) {
    try {
      writeFileSync(outfile, error.toString());
      return;
    } catch {
      // ignore errors
    }
    writeFileSync(outfile, '[ERROR] ' + Object.prototype.toString.call(error));
  }
}

function uglifyJS(script) {
  const { code, error } = uglifyMinify(script);
  if (error) throw error;
  return code;
}

function tryJSONparse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function closureCompiler(script) {
  const res = await fetch('https://closure-compiler.appspot.com/compile', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      "js_code": script,
      "compilation_level": 'SIMPLE_OPTIMIZATIONS',
      "output_format": 'json',
      "output_info": 'compiled_code',
      // formatting: "PRINT_INPUT_DELIMITER",
      "language_out": 'ECMASCRIPT_NEXT'
    })
  });
  if (!res.ok) {
    const text = await res.text();
    const json = tryJSONparse(text);
    throw new Error(json ? inspect(json, { colors: true, depth: null }) : text);
  }
  const text = await res.text();
  const json = tryJSONparse(text);
  if (!json) throw new Error(text);
  if (typeof json.compiledCode !== 'string') {
    throw new Error(inspect(json, { colors: true, depth: null }));
  }
  return json.compiledCode;
}

async function minifyJS(filename) {
  const script = `${readFileSync(filename)}`,
    outfile = `docs/${filename}`;
  new Script(script); // eslint-disable-line no-new
  let minified = uglifyJS(await closureCompiler(uglifyJS(await closureCompiler(uglifyJS(script)))));
  if (minified.endsWith(';')) minified = minified.slice(0, -1);
  console.log(Math.round(10000 - (minified.length * 10000) / script.length) / 100 + '% OFF');
  writeFileSync(outfile, minified);
}

minifyHTML('index.html');
minifyCSS('index.css');
minifyJS('main.js');
