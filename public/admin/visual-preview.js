/* TETRAEDAR homepage preview for Decap CMS.
 * Creates React 19-compatible elements without loading a second React runtime.
 * The actual homepage is rendered in an iframe; content is passed by postMessage.
 */
(function () {
  'use strict';
  var ELEMENT = Symbol.for('react.transitional.element');
  function element(type, props) {
    return { $$typeof: ELEMENT, type: type, key: null, props: props || {}, _owner: null };
  }
  function plain(value) {
    return value && typeof value.toJS === 'function' ? value.toJS() : (value || {});
  }
  function Preview(props) {
    this.props = props;
    this.iframe = null;
    this.ready = false;
    this.values = {};
    this.onMessage = this.onMessage.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.setIframe = this.setIframe.bind(this);
  }
  Preview.prototype.isReactComponent = {};
  Preview.prototype.setIframe = function (node) {
    if (this.iframe !== node) this.ready = false;
    this.iframe = node;
  };
  Preview.prototype.componentDidMount = function () {
    window.addEventListener('message', this.onMessage);
    document.addEventListener('focusin', this.onFocus, true);
    this.send();
  };
  Preview.prototype.componentDidUpdate = function () { this.send(); };
  Preview.prototype.componentWillUnmount = function () {
    window.removeEventListener('message', this.onMessage);
    document.removeEventListener('focusin', this.onFocus, true);
  };
  Preview.prototype.onMessage = function (event) {
    if (event.origin !== window.location.origin || !this.iframe || event.source !== this.iframe.contentWindow) return;
    if (event.data && event.data.source === 'tetraedar-preview' && event.data.type === 'ready') {
      this.ready = true;
      this.send();
    }
  };
  Preview.prototype.send = function () {
    var entry = this.props.entry;
    this.values = entry && typeof entry.get === 'function' ? plain(entry.get('data')) : {};
    if (this.ready && this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage({ source: 'tetraedar-cms', type: 'update', values: this.values }, window.location.origin);
    }
  };
  Preview.prototype.onFocus = function (event) {
    var input = event.target;
    if (!input || !input.closest || !input.closest('input,textarea,select,[contenteditable="true"]')) return;
    var holder = input.closest('[data-field-name]');
    var field = holder && holder.getAttribute('data-field-name');
    if (!field) {
      var identifier = ((input.id || '') + ' ' + (input.name || '')).toLowerCase();
      field = Object.keys(this.values).sort(function (a,b) { return b.length - a.length; }).find(function (key) {
        return identifier.indexOf(key.toLowerCase()) !== -1;
      }) || null;
    }
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage({ source: 'tetraedar-cms', type: 'focus', field: field }, window.location.origin);
    }
  };
  Preview.prototype.render = function () {
    return element('div', {
      style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: '75vh', background: '#f3f5f8' },
      children: [
        element('div', {
          style: { padding: '10px 14px', background: '#fff', color: '#3d4d60', fontSize: '12px', borderBottom: '1px solid #ddd' },
          children: 'Преглед на началната страница - промените се виждат преди публикуване'
        }),
        element('iframe', {
          ref: this.setIframe,
          title: 'Преглед на началната страница',
          src: '/?cms_preview=1',
          style: { display: 'block', flex: '1 1 auto', width: '100%', minHeight: '70vh', border: '0', background: '#fff' }
        })
      ]
    });
  };
  var attempts = 0;
  function register() {
    if (window.CMS && typeof window.CMS.registerPreviewTemplate === 'function') {
      window.CMS.registerPreviewTemplate('homepage', Preview);
      return;
    }
    if (++attempts < 200) window.setTimeout(register, 100);
    else console.error('TETRAEDAR preview: Decap CMS did not load.');
  }
  register();
})();
