(() => {
  'use strict';

  // Static Functions
  const { MIN_SAFE_INTEGER, MAX_SAFE_INTEGER, EPSILON } = Number;
  const { abs, trunc } = Math;
  const { stringify } = JSON;
  const { freeze, assign } = Object;
  const createElement = document.createElement.bind(document);
  const getElementById = document.getElementById.bind(document);
  const appendElement = Function.prototype.call.bind(Element.prototype.append);
  const countString = (({ call }) => {
    const getStrItr = call.bind(''[Symbol.iterator]);
    const next = call.bind(getStrItr('').next);
    return str => {
      str = getStrItr(str);
      for (let n = 0; ; n++) if (next(str).done) return n;
    };
  })(Function.prototype);
  function validateNumber(text, intMode) {
    const val = Number(text);
    if (Number.isNaN(val)) return 'INVALID';
    if (val < MIN_SAFE_INTEGER) return 'SMALL';
    if (MAX_SAFE_INTEGER < val) return 'BIG';
    if (intMode && EPSILON < abs(trunc(val) - val)) {
      return 'TRUNC';
    }
    if (intMode && !/^-?\d+$/.test(text)) {
      return 'TRUNC';
    }
    return 'OK';
  }

  // Constants
  const OPTION_TYPE = freeze(
    [ // eslint-disable-line no-sparse-arrays
      /*NONE*/,
      /*"Sub command"*/,
      /*"Sub command group"*/,
      'String',
      'Integer',
      'Boolean',
      'User',
      'Channel',
      'Role',
      'Mentionable',
      'Number',
      'Attachment'
    ].map((v, i) => [v, i])
  );
  const CSS = freeze({
    errorMessage: freeze({
      color: '#FFA700'
    }),
    commandOption: freeze({
      padding: '7px',
      paddingTop: '0px',
      border: '1px #222 solid',
      borderRadius: '5px',
      margin: '5px 0px',
      position: 'relative'
    }),
    optionChoice: freeze({
      display: 'felx',
      padding: '5px 7px',
      border: '1px #222 solid',
      borderRadius: '5px',
      margin: '5px 0px',
      position: 'relative'
    }),
    checkbox: freeze({
      width: '24px',
      height: '24px',
      outline: '0',
      cursor: 'pointer'
    }),
    checkboxDescription: freeze({
      marginLeft: '.3em',
      'user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      '-khtml-user-select': 'none',
      '-webkit-user-select': 'none',
      '-webkit-touch-callout': 'none'
    })
  });

  // Classes
  const Events = (eventsMap =>
    class {
      constructor() {
        eventsMap.set(this, new Map());
      }
      on(event, handler) {
        const events = eventsMap.get(this);
        const handlers = events.get(event);
        if (handlers) handlers.push(handler);
        else events.set(event, [handler]);
      }
      emit(event, ...args) {
        eventsMap
          .get(this)
          .get(event)
          ?.forEach(f => f(...args));
      }
    })(new WeakMap());
  freeze(Events.prototype);

  const TextInput = (internalFieldsMap =>
    class {
      constructor({ title, parent }) {
        if (new.target !== TextInput) {
          throw new Error('new.target is invalid');
        }
        const internal = {};
        internalFieldsMap.set(this, internal);
        const input = createElement('input');
        input.type = 'text';
        const p = createElement('div');
        appendElement(parent, p);
        const titleElement = createElement('h3');
        p.append(titleElement);
        titleElement.textContent = title;
        p.append((internal.input = input));
        p.append((internal.errorMessage = createElement('div')));
        assign(internal.errorMessage.style, CSS.errorMessage);
      }
      get value() {
        return internalFieldsMap.get(this).input.value;
      }
      set value(value) {
        internalFieldsMap.get(this).input.value = value;
      }
      on(...args) {
        return internalFieldsMap.get(this).input.addEventListener(...args);
      }
      showError(text) {
        const internal = internalFieldsMap.get(this);
        internal.input.style.borderColor = 'red';
        internal.errorMessage.style.display = '';
        internal.errorMessage.textContent = text;
      }
      hideError() {
        const internal = internalFieldsMap.get(this);
        internal.input.style.borderColor = '';
        internal.errorMessage.style.display = 'none';
      }
    })(new WeakMap());
  freeze(TextInput.prototype);

  const SelectorInput = (inputElementMap =>
    class {
      constructor({ title, options, parent }) {
        if (new.target !== SelectorInput) {
          throw new Error('new.target is invalid');
        }
        const input = createElement('select');
        inputElementMap.set(this, input);
        options.forEach(value => {
          const option = createElement('option');
          [option.textContent, option.value] = value;
          input.append(option);
        });
        input.style.cursor = 'pointer';
        const p = createElement('div');
        appendElement(parent, p);
        const titleElement = createElement('h3');
        p.append(titleElement);
        titleElement.textContent = title;
        p.append(input);
      }
      get value() {
        return inputElementMap.get(this).value;
      }
      set value(value) {
        inputElementMap.get(this).value = value;
      }
      on(...args) {
        return inputElementMap.get(this).addEventListener(...args);
      }
    })(new WeakMap());
  freeze(SelectorInput.prototype);

  const CheckboxInput = (inputElementMap =>
    class {
      constructor({ title, description, parent }) {
        if (new.target !== CheckboxInput) {
          throw new Error('new.target is invalid');
        }
        const p = createElement('div');
        appendElement(parent, p);
        const titleElement = createElement('h3');
        p.append(titleElement);
        titleElement.textContent = title;
        const checkboxContainer = createElement('div');
        p.append(checkboxContainer);
        const input = createElement('input');
        inputElementMap.set(this, input);
        checkboxContainer.append(input);
        checkboxContainer.style.cursor = 'pointer';
        checkboxContainer.addEventListener('click', event => {
          if (event.target !== input) input.click();
        });
        input.type = 'checkbox';
        assign(input.style, CSS.checkbox);
        const descriptionElement = createElement('span');
        descriptionElement.textContent = description;
        assign(descriptionElement.style, CSS.checkboxDescription);
        checkboxContainer.append(descriptionElement);
      }
      get value() {
        return inputElementMap.get(this).checked;
      }
      set value(value) {
        inputElementMap.get(this).checked = value;
      }
      on(...args) {
        return inputElementMap.get(this).addEventListener(...args);
      }
    })(new WeakMap());
  freeze(CheckboxInput.prototype);

  const OptionChoice = (internalFieldsMap =>
    class {
      constructor({ parent }) {
        if (new.target !== OptionChoice) {
          throw new Error('new.target is invalid');
        }
        const internal = {};
        internalFieldsMap.set(this, internal);

        const p = createElement('div');
        const nc = createElement('div');
        const cCSS = {
          flex: '1',
          padding: '2px'
        };
        Object.assign(nc.style, cCSS);
        p.append(nc);
        const ncTitle = createElement('h3');
        ncTitle.textContent = 'Name';
        ncTitle.style.margin = '2px 0px';
        nc.append(ncTitle);
        nc.append((internal.name = createElement('input')));
        internal.name.type = 'text';
        const vc = createElement('div');
        Object.assign(vc.style, cCSS);
        p.append(vc);
        const vcTitle = createElement('h3');
        vcTitle.textContent = 'Value';
        vcTitle.style.margin = '2px 0px';
        vc.append(vcTitle);
        vc.append((internal.value = createElement('input')));
        internal.value.type = 'text';
        Object.assign(p.style, CSS.optionChoice);
        appendElement(parent, p);
      }
      get name() {
        return internalFieldsMap.get(this).name.value;
      }
      set name(value) {
        internalFieldsMap.get(this).name.value = value;
      }
      get value() {
        return internalFieldsMap.get(this).value.value;
      }
      set value(value) {
        internalFieldsMap.get(this).value.value = value;
      }
    })(new WeakMap());
  freeze(OptionChoice.prototype);

  const CommandOption = (internalFieldsMap =>
    class extends Events {
      constructor({ parent }) {
        if (new.target !== CommandOption) {
          throw new Error('new.target is invalid');
        }

        super();
        const internal = {};
        internalFieldsMap.set(this, internal);

        const container = (internal.container = createElement('div'));
        appendElement(parent, container);
        assign(container.style, CSS.commandOption);
        this.type = new SelectorInput({
          title: 'Type',
          options: OPTION_TYPE,
          parent: container
        });

        this.name = new TextInput({
          title: 'Name',
          parent: container
        });

        this.description = new TextInput({
          title: 'Description',
          parent: container
        });

        this.required = new CheckboxInput({
          title: 'Required',
          description: 'This command option is required',
          parent: container
        });

        container.append((internal.autocomplete = createElement('div')));
        this.autocomplete = new SelectorInput({
          title: 'Auto complete or Choices',
          options: [
            ['OFF', 'false'],
            ['ON - Auto complete', 'true']
            //["ON - Choices", "choices"]
          ],
          parent: internal.autocomplete
        });

        container.append((internal.numOpt = createElement('div')));
        internal.numOpt.style.display = 'none';
        this.minValue = new TextInput({
          title: 'Min value (optional)',
          parent: internal.numOpt
        });
        this.maxValue = new TextInput({
          title: 'Max value (optional)',
          parent: internal.numOpt
        });

        internal.choices = {};
        internal.channelTypes = createElement('input');

        const button = createElement('div');
        button.innerHTML = '&times;';
        button.className = 'red-button';
        container.append(button);
        button.addEventListener('click', () => this.emit('deletionRequested'));

        const { type, name, description, minValue, maxValue } = this;

        type.on('input', () => {
          const optionType = Number(type.value);
          this.numberRangeDisabled = ![4, 10].includes(optionType);
          this.autocompleteDisabled = ![3, 4, 10].includes(optionType);
          this.emit('changed');
        });
        function nameChecker() {
          if (name.value.length < 1) {
            name.showError('This is required');
            return;
          }
          if (32 < name.value.length) {
            name.showError('Too long');
            return;
          }
          if (!/^[\w-]{1,32}$/.test(name.value)) {
            name.showError('Only alphabet, number, hyphen and underbar');
            return;
          }
          name.hideError();
        }
        name.on('blur', nameChecker);
        name.on('input', () => {
          nameChecker();
          this.emit('changed');
        });
        function descriptionChecker() {
          const length = countString(description.value);
          if (length < 1) {
            description.showError('This is required');
            return;
          }
          if (100 < length) {
            description.showError('Too long');
            return;
          }
          description.hideError();
        }
        description.on('blur', descriptionChecker);
        description.on('input', () => {
          descriptionChecker();
          this.emit('changed');
        });

        function numHandler(element) {
          let tmp = '';
          element.on('input', () => {
            if (!element.value) {
              tmp = element.value;
              this.emit('changed');
              return;
            }
            const optionType = Number(type.value);
            if (![4, 10].includes(optionType)) {
              element.value = tmp;
              return;
            }
            const isInt = optionType === 4;
            if (isInt ? element.value === '-' : /^(-|\.|-\.)$/.test(element.value)) {
              tmp = element.value;
              this.emit('changed');
              return;
            }
            const sufdot = element.value.endsWith('.');
            switch (validateNumber(element.value, isInt)) {
              case 'INVALID':
                element.value = tmp;
                return;
              case 'SMALL':
                element.value = MIN_SAFE_INTEGER;
                break;
              case 'BIG':
                element.value = MAX_SAFE_INTEGER;
                break;
              case 'TRUNC':
                element.value = trunc(element.value);
                if (sufdot && !isInt) element.value += '.';
                break;
              case 'OK':
                break;
              default:
                throw new Error('Invalid case');
            }
            tmp = element.value;
            this.emit('changed');
          });
        }
        numHandler(minValue);
        numHandler(maxValue);

        this.required.on('input', () => {
          this.emit('changed');
        });

        this.autocomplete.on('input', () => {
          this.emit('changed');
        });

        freeze(this);
      }
      get numberRangeDisabled() {
        return internalFieldsMap.get(this).numOpt.style.display === 'none';
      }
      set numberRangeDisabled(value) {
        internalFieldsMap.get(this).numOpt.style.display = value ? 'none' : '';
      }
      get autocompleteDisabled() {
        return internalFieldsMap.get(this).autocomplete.style.display === 'none';
      }
      set autocompleteDisabled(value) {
        internalFieldsMap.get(this).autocomplete.style.display = value ? 'none' : '';
      }
      deleteSelf() {
        const { container } = internalFieldsMap.get(this);
        container.parentNode?.removeChild(container);
        internalFieldsMap.delete(this);
      }
      toJSON() {
        const type = Number(this.type.value);
        const isNum = [4, 10].includes(type);
        const isAutocompletable = [3, 4, 10].includes(type);
        return {
          type,
          name: this.name.value,
          description: this.description.value,
          required: this.required.value || undefined,
          "min_value": (() => {
            if (!isNum || !this.minValue.value) return undefined;
            const num = Number(this.minValue.value);
            if (Number.isNaN(num)) return undefined;
            return num;
          })(),
          "max_value": (() => {
            if (!isNum || !this.maxValue.value) return undefined;
            const num = Number(this.maxValue.value);
            if (Number.isNaN(num)) return undefined;
            return num;
          })(),
          autocomplete: (isAutocompletable && this.autocomplete.value === 'true') || undefined
        };
      }
    })(new WeakMap());
  freeze(CommandOption.prototype);

  const CommandOptionArray = (internalArrayMap =>
    class extends Events {
      constructor({ parent }) {
        super();

        const internal = [];
        internalArrayMap.set(this, internal);
        const container = createElement('div');
        const options = createElement('div');
        const addOptionButton = createElement('span');
        addOptionButton.textContent = 'Add command option';
        addOptionButton.className = 'add-option';
        container.append(options);
        container.append(addOptionButton);
        appendElement(parent, container);

        addOptionButton.addEventListener('click', () => {
          const option = new CommandOption({ parent: options });
          const { required } = option;
          internal.push(option);
          required.on('input', () => {
            const index = internal.indexOf(option);
            if (~index) {
              if (required.value) {
                internal.slice(0, index).forEach(o => (o.required.value = true));
              } else {
                internal.slice(index + 1).forEach(o => (o.required.value = false));
              }
            }
            this.emit('changed');
          });
          option.on('deletionRequested', () => {
            const index = internal.indexOf(option);
            if (~index) internal.splice(index, 1);
            option.deleteSelf();
            if (internal.length < 10) {
              addOptionButton.style.display = '';
            }
            this.emit('changed');
          });
          option.on('changed', () => this.emit('changed'));
          if (9 < internal.length) {
            addOptionButton.style.display = 'none';
          }
          this.emit('changed');
        });
      }
      at(index) {
        return internalArrayMap.get(this).at(index);
      }
      get length() {
        return internalArrayMap.get(this).length;
      }
      *[Symbol.iterator]() {
        for (const e of internalArrayMap.get(this)) yield e;
      }
      toJSON() {
        const internal = internalArrayMap.get(this);
        return internal.length ? internal.map(e => e?.toJSON?.()) : undefined;
      }
    })(new WeakMap());
  freeze(CommandOptionArray.prototype);
  Object.defineProperty(CommandOptionArray, Symbol.species, { value: Array });

  (() => {
    // Elements
    const commandName = getElementById('name');
    const commandDescription = getElementById('description');

    // Write JSON Data
    const flush = (
      out => () =>
        (out.textContent = stringify({
          name: commandName.value,
          description: commandDescription.value,
          options: commandJSONOptions
        }))
    )(getElementById('out'));

    // Main
    document.addEventListener('click', () => undefined);

    {
      const commandNameError = getElementById('name-error');
      const commandNameChecker = () => {
        flush();
        if (commandName.value.length < 1) {
          commandName.style.borderColor = 'red';
          commandNameError.style.display = '';
          commandNameError.textContent = 'This is required';
          return;
        }
        if (32 < commandName.value.length) {
          commandName.style.borderColor = 'red';
          commandNameError.style.display = '';
          commandNameError.textContent = 'Too long';
          return;
        }
        if (!/^[\w-]{1,32}$/.test(commandName.value)) {
          commandName.style.borderColor = 'red';
          commandNameError.style.display = '';
          commandNameError.textContent = 'Only alphabet, number, hyphen and underbar';
          return;
        }
        commandNameError.style.display = 'none';
        commandName.style.borderColor = '';
      };
      commandName.addEventListener('blur', commandNameChecker);
      commandName.addEventListener('input', commandNameChecker);
    }

    {
      const commandDescriptionError = getElementById('description-error');
      const commandDescriptionChecker = () => {
        const length = countString(commandDescription.value);
        flush();
        if (length < 1) {
          commandDescription.style.borderColor = 'red';
          commandDescriptionError.style.display = '';
          commandDescriptionError.textContent = 'This is required';
          return;
        }
        if (100 < length) {
          commandDescription.style.borderColor = 'red';
          commandDescriptionError.style.display = '';
          commandDescriptionError.textContent = 'Too long';
          return;
        }
        commandDescriptionError.style.display = 'none';
        commandDescription.style.borderColor = '';
      };
      commandDescription.addEventListener('blur', commandDescriptionChecker);
      commandDescription.addEventListener('input', commandDescriptionChecker);
    }

    const commandJSONOptions = (globalThis.commandJSONOptions = new CommandOptionArray({ parent: getElementById('options') }));
    commandJSONOptions.on('changed', flush);
    flush();
  })();
})();
