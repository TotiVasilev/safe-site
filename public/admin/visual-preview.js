
/* TETRAEDAR - Decap live homepage preview. No additional React runtime. */
(function () {
  'use strict';

  var REACT_ELEMENT = Symbol.for('react.transitional.element');

  function node(type, props) {
    return {
      $$typeof: REACT_ELEMENT,
      type: type,
      key: null,
      props: props || {},
      _owner: null
    };
  }

  function plain(value) {
    if (value && typeof value.toJS === 'function') return value.toJS();
    return value && typeof value === 'object' ? value : {};
  }

  function Preview(props) {
    this.props = props;
    this.frame = null;
    this.ready = false;
    this.field = null;

    this.onMessage = this.onMessage.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onInput = this.onInput.bind(this);
    this.attach = this.attach.bind(this);
  }

  Preview.prototype.isReactComponent = {};

  Preview.prototype.attach = function (frame) {
    if (frame !== this.frame) this.ready = false;
    this.frame = frame;
  };

  Preview.prototype.componentDidMount = function () {
    window.addEventListener('message', this.onMessage);
    document.addEventListener('focusin', this.onFocus, true);
    document.addEventListener('input', this.onInput, true);
    document.addEventListener('change', this.onInput, true);
    this.sync();
  };

  Preview.prototype.componentDidUpdate = function () {
    this.sync();
  };

  Preview.prototype.componentWillUnmount = function () {
    window.removeEventListener('message', this.onMessage);
    document.removeEventListener('focusin', this.onFocus, true);
    document.removeEventListener('input', this.onInput, true);
    document.removeEventListener('change', this.onInput, true);
  };

  Preview.prototype.onMessage = function (event) {
    if (
      !this.frame ||
      event.source !== this.frame.contentWindow ||
      event.origin !== location.origin
    ) return;

    if (
      event.data &&
      event.data.source === 'tetraedar-preview' &&
      event.data.type === 'ready'
    ) {
      this.ready = true;
      this.sync();
    }
  };

  Preview.prototype.values = function () {
    var entry = this.props.entry;

    return plain(
      entry && typeof entry.get === 'function'
        ? entry.get('data')
        : {}
    );
  };

  Preview.prototype.post = function (type, payload) {
    if (!this.ready || !this.frame || !this.frame.contentWindow) return;

    this.frame.contentWindow.postMessage(
      Object.assign(
        { source: 'tetraedar-cms', type: type },
        payload || {}
      ),
      location.origin
    );
  };

  Preview.prototype.sync = function () {
    this.post('update', { values: this.values() });

    if (this.field) {
      this.post('focus', { field: this.field });
    }
  };

  Preview.prototype.fieldFor = function (input) {
    if (
      !input ||
      !input.closest ||
      !input.closest('input, textarea, select, [contenteditable="true"]')
    ) return null;

    var holder = input.closest('[data-field-name]');

    if (holder) return holder.getAttribute('data-field-name');

    var label = input.closest('label');

    var name = [
      input.name,
      input.id,
      label && label.getAttribute('for')
    ].filter(Boolean).join(' ').toLowerCase();

    var fields = Object.keys(this.values()).sort(function (a, b) {
      return b.length - a.length;
    });

    for (var i = 0; i < fields.length; i++) {
      if (name.indexOf(fields[i].toLowerCase()) !== -1) {
        return fields[i];
      }
    }

    return null;
  };

  Preview.prototype.onFocus = function (event) {
    var field = this.fieldFor(event.target);
    if (!field) return;

    this.field = field;
    this.post('focus', { field: field });
  };

  Preview.prototype.onInput = function (event) {
    var field = this.fieldFor(event.target);
    if (!field) return;

    this.field = field;

    var target = event.target;
    var self = this;

    // Show typing immediately, then synchronize Decap's draft state.
    if (
      target.type !== 'file' &&
      target.type !== 'checkbox' &&
      field !== 'partners'
    ) {
      var next = this.values();
      next[field] = target.value;

      this.post('update', { values: next });
    }

    Promise.resolve().then(function () {
      self.sync();
    });
  };

  Preview.prototype.render = function () {
    return node('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '78vh',
        background: '#f4f5f7'
      },
      children: [
        node('div', {
          style: {
            background: '#fff',
            padding: '10px 14px',
            borderBottom: '1px solid #ddd',
            fontSize: '12px',
            color: '#334155'
          },
          children: 'Начална страница - промените се виждат тук преди публикуване'
        }),
        node('iframe', {
          ref: this.attach,
          title: 'Начална страница - преглед на живо',
          src: '/?cms_preview=1',
          style: {
            display: 'block',
            width: '100%',
            flex: '1 1 auto',
            minHeight: '74vh',
            border: 0,
            background: 'white'
          }
        })
      ]
    });
  };

  var tries = 0;

  function register() {
    if (
      window.CMS &&
      typeof window.CMS.registerPreviewTemplate === 'function'
    ) {
      window.CMS.registerPreviewTemplate('homepage', Preview);
    } else if (++tries < 300) {
      setTimeout(register, 100);
    } else {
      console.error('TETRAEDAR: Decap CMS preview registration failed');
    }
  }

  register();
})();
