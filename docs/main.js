"use strict";(()=>{function e(){return I(),q.value.length<1?(q.style.borderColor="red",A.style.display="",A.textContent="This is required"):32<q.value.length?(q.style.borderColor="red",A.style.display="",A.textContent="Too long"):/^[\w-]{1,32}$/.test(q.value)?(A.style.display="none",q.style.borderColor=""):(q.style.borderColor="red",A.style.display="",A.textContent="Only alphabet, number, hyphen and underbar")}function t(){var e=w(S.value);return I(),e<1?(S.style.borderColor="red",R.style.display="",R.textContent="This is required"):100<e?(S.style.borderColor="red",R.style.display="",R.textContent="Too long"):(R.style.display="none",S.style.borderColor="")}const{MIN_SAFE_INTEGER:u,MAX_SAFE_INTEGER:c,EPSILON:h}=Number,{abs:v,trunc:m}=Math,n=JSON.stringify,{freeze:g,assign:y}=Object,b=document.createElement.bind(document),r=document.getElementById.bind(document),x=Function.prototype.call.bind(Element.prototype.append),w=(({call:e})=>{const n=e.bind(""[Symbol.iterator]),r=e.bind(n("").next);return t=>{t=n(t);for(let e=0;;e++)if(r(t).done)return e}})(Function.prototype);var i,o,a,s,l,E,p,d,f=new TextEncoder,V=f.encode.bind(f);const F=g([,,,"String","Integer","Boolean","User","Channel","Role","Mentionable","Number","Attachment"].map((e,t)=>[e,t])),N=g({errorMessage:g({color:"#FFA700"}),commandOption:g({padding:"7px",paddingTop:"0px",border:"1px #222 solid",borderRadius:"5px",margin:"5px 0px",position:"relative"}),optionChoice:g({display:"felx",padding:"5px 7px",border:"1px #222 solid",borderRadius:"5px",margin:"5px 0px",position:"relative"}),checkbox:g({width:"24px",height:"24px",outline:"0",cursor:"pointer"}),checkboxDescription:g({marginLeft:".3em","user-select":"none","-moz-user-select":"none","-ms-user-select":"none","-khtml-user-select":"none","-webkit-user-select":"none","-webkit-touch-callout":"none"})}),C=(i=new WeakMap,f=class{constructor(){i.set(this,new Map)}on(e,t){const n=i.get(this),r=n.get(e);r?r.push(t):n.set(e,[t])}emit(e,...t){i.get(this).get(e)?.forEach(e=>e(...t))}},g(f.prototype),o=new WeakMap,class{constructor({title:e,parent:t}){if(new.target!==C)throw Error("new.target is invalid");const n={},r=(o.set(this,n),b("input")),i=(r.type="text",b("div"));x(t,i),t=b("h3"),i.append(t),t.textContent=e,i.append(n.input=r),i.append(n.errorMessage=b("div")),y(n.errorMessage.style,N.errorMessage)}get value(){return o.get(this).input.value}set value(e){o.get(this).input.value=e}on(...e){return o.get(this).input.addEventListener(...e)}showError(e){const t=o.get(this);t.input.style.borderColor="red",t.errorMessage.style.display="",t.errorMessage.textContent=e}hideError(){const e=o.get(this);e.input.style.borderColor="",e.errorMessage.style.display="none"}}),O=(g(C.prototype),a=new WeakMap,class{constructor({title:e,options:t,parent:n}){if(new.target!==O)throw Error("new.target is invalid");const r=b("select");a.set(this,r),t.forEach(e=>{const t=b("option");[t.textContent,t.value]=e,r.append(t)}),r.style.cursor="pointer",t=b("div"),x(n,t),n=b("h3"),t.append(n),n.textContent=e,t.append(r)}get value(){return a.get(this).value}set value(e){a.get(this).value=e}on(...e){return a.get(this).addEventListener(...e)}}),k=(g(O.prototype),s=new WeakMap,class{constructor({title:e,description:t,parent:n}){if(new.target!==k)throw Error("new.target is invalid");var r=b("div");x(n,r),n=b("h3"),r.append(n),n.textContent=e,e=b("div"),r.append(e);const i=b("input");s.set(this,i),e.append(i),e.style.cursor="pointer",e.addEventListener("click",e=>{e.target!==i&&i.click()}),i.type="checkbox",y(i.style,N.checkbox),(r=b("span")).textContent=t,y(r.style,N.checkboxDescription),e.append(r)}get value(){return s.get(this).checked}set value(e){s.get(this).checked=e}on(...e){return s.get(this).addEventListener(...e)}}),M=(g(k.prototype),l=new WeakMap,class{constructor({parent:e}){if(new.target!==M)throw Error("new.target is invalid");const t={},n=(l.set(this,t),b("div"));var r=b("div"),i={flex:"1",padding:"2px"};Object.assign(r.style,i),n.append(r);const o=b("h3");o.textContent="Name",o.style.margin="2px 0px",r.append(o),r.append(t.name=b("input")),t.name.type="text",r=b("div"),Object.assign(r.style,i),n.append(r),(i=b("h3")).textContent="Value",i.style.margin="2px 0px",r.append(i),r.append(t.value=b("input")),t.value.type="text",Object.assign(n.style,N.optionChoice),x(e,n)}get name(){return l.get(this).name.value}set name(e){l.get(this).name.value=e}get value(){return l.get(this).value.value}set value(e){l.get(this).value.value=e}}),T=(g(M.prototype),E=new WeakMap,class extends f{constructor({parent:e}){function t(){return s.value.length<1?s.showError("This is required"):32<s.value.length?s.showError("Too long"):/^[\w-]{1,32}$/.test(s.value)?void s.hideError():s.showError("Only alphabet, number, hyphen and underbar")}function n(){var e=w(l.value);return e<1?l.showError("This is required"):100<e?l.showError("Too long"):void l.hideError()}function r(i){let o="";i.on("input",()=>{if(!i.value)return o=i.value,void this.emit("changed");var e=Number(a.value);if([4,10].includes(e)){if((e=4===e)?"-"===i.value:/^(-|\.|-\.)$/.test(i.value))return o=i.value,void this.emit("changed");var t=i.value.endsWith("."),n=i.value,r=Number(n);switch(Number.isNaN(r)?"INVALID":r<u?"SMALL":c<r?"BIG":e&&h<v(m(r)-r)||e&&!/^-?\d+$/.test(n)?"TRUNC":"OK"){case"INVALID":return void(i.value=o);case"SMALL":i.value=u;break;case"BIG":i.value=c;break;case"TRUNC":i.value=m(i.value),t&&!e&&(i.value+=".");break;case"OK":break;default:throw Error("Invalid case")}o=i.value,this.emit("changed")}else i.value=o})}if(new.target!==T)throw Error("new.target is invalid");super();const i={},o=(E.set(this,i),i.container=b("div")),{type:a,name:s,description:l,minValue:p,maxValue:d}=(x(e,o),y(o.style,N.commandOption),this.type=new O({title:"Type",options:F,parent:o}),this.name=new C({title:"Name",parent:o}),this.description=new C({title:"Description",parent:o}),this.required=new k({title:"Required",description:"This command option is required",parent:o}),o.append(i.autocomplete=b("div")),this.autocomplete=new O({title:"Auto complete or Choices",options:[["OFF","false"],["ON - Auto complete","true"]],parent:i.autocomplete}),o.append(i.numOpt=b("div")),i.numOpt.style.display="none",this.minValue=new C({title:"Min value (optional)",parent:i.numOpt}),this.maxValue=new C({title:"Max value (optional)",parent:i.numOpt}),i.choices={},i.channelTypes=b("input"),(e=b("div")).innerHTML="&times;",e.className="red-button",o.append(e),e.addEventListener("click",()=>this.emit("deletionRequested")),this);a.on("input",()=>{var e=Number(a.value);this.numberRangeDisabled=![4,10].includes(e),this.autocompleteDisabled=![3,4,10].includes(e),this.emit("changed")}),s.on("blur",t),s.on("input",()=>{t(),this.emit("changed")}),l.on("blur",n),l.on("input",()=>{n(),this.emit("changed")}),r(p),r(d),this.required.on("input",()=>{this.emit("changed")}),this.autocomplete.on("input",()=>{this.emit("changed")}),g(this)}get numberRangeDisabled(){return"none"===E.get(this).numOpt.style.display}set numberRangeDisabled(e){E.get(this).numOpt.style.display=e?"none":""}get autocompleteDisabled(){return"none"===E.get(this).autocomplete.style.display}set autocompleteDisabled(e){E.get(this).autocomplete.style.display=e?"none":""}deleteSelf(){const e=E.get(this).container;e.parentNode?.removeChild(e),E.delete(this)}toJSON(){var e=Number(this.type.value);const t=[4,10].includes(e);var n=[3,4,10].includes(e);return{type:e,name:this.name.value,description:this.description.value,required:this.required.value||void 0,min_value:(()=>{if(t&&this.minValue.value){var e=Number(this.minValue.value);if(!Number.isNaN(e))return e}})(),max_value:(()=>{if(t&&this.maxValue.value){var e=Number(this.maxValue.value);if(!Number.isNaN(e))return e}})(),autocomplete:n&&"true"===this.autocomplete.value||void 0}}}),L=(g(T.prototype),p=new WeakMap,class extends f{constructor({parent:e}){super();const r=[],t=(p.set(this,r),b("div")),i=b("div"),o=b("span");o.textContent="Add command option",o.className="add-option",t.append(i),t.append(o),x(e,t),o.addEventListener("click",()=>{const t=new T({parent:i}),n=t.required;r.push(t),n.on("input",()=>{var e=r.indexOf(t);~e&&(n.value?r.slice(0,e).forEach(e=>e.required.value=!0):r.slice(e+1).forEach(e=>e.required.value=!1)),this.emit("changed")}),t.on("deletionRequested",()=>{var e=r.indexOf(t);~e&&r.splice(e,1),t.deleteSelf(),r.length<10&&(o.style.display=""),this.emit("changed")}),t.on("changed",()=>this.emit("changed")),9<r.length&&(o.style.display="none"),this.emit("changed")})}at(e){return p.get(this).at(e)}get length(){return p.get(this).length}*[Symbol.iterator](){for(const e of p.get(this))yield e}toJSON(){const e=p.get(this);if(e.length)return e.map(e=>e?.toJSON?.())}}),q=(g(L.prototype),Object.defineProperty(L,Symbol.species,{value:Array}),r("name")),S=r("description"),I=(d=r("out"),()=>{var e={name:q.value,description:S.value,options:D},t="const clientId = '', token = '';\n\nrequire('node:https').request(`https://discord.com/api/applications/${clientId}/commands`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`BOT ${token}`,"+`'Content-Length':${t=e=n(e),V(t).length}}},`+`r=>console.log('status:',r.statusCode)).end(${n(e)})`;return d.textContent=t}),A=(document.addEventListener("click",()=>{}),r("name-error")),R=(q.addEventListener("blur",e),q.addEventListener("input",e),r("description-error")),D=(S.addEventListener("blur",t),S.addEventListener("input",t),globalThis.commandJSONOptions=new L({parent:r("options")}));D.on("changed",I),I()})()