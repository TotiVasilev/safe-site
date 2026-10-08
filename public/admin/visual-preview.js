/* Decap CMS custom homepage preview - uses the actual static homepage. */
(function () {
  function start() {
    if (!window.CMS || !window.React) { setTimeout(start, 100); return; }
    const React = window.React;
    function toPlain(value) {
      if (value && typeof value.toJS === 'function') return value.toJS();
      return value || {};
    }
    class HomepagePreview extends React.Component {
      constructor(props) { super(props); this.iframe = null; this.values = {}; this.ready = false; this.message = this.message.bind(this); this.focus = this.focus.bind(this); }
      componentDidMount() { window.addEventListener('message',this.message); document.addEventListener('focusin',this.focus,true); }
      componentWillUnmount() { window.removeEventListener('message',this.message); document.removeEventListener('focusin',this.focus,true); }
      componentDidUpdate() { this.send(); }
      message(event) {
        if (event.origin !== location.origin || event.source !== this.iframe?.contentWindow) return;
        if (event.data?.source === 'tetraedar-preview' && event.data.type === 'ready') { this.ready = true; this.send(); }
      }
      send() {
        this.values = toPlain(this.props.entry.get('data'));
        if (this.ready) this.iframe?.contentWindow?.postMessage({source:'tetraedar-cms',type:'update',values:this.values},location.origin);
      }
      focus(event) {
        const input = event.target;
        if (!input?.closest || !input.closest('input,textarea,select,[contenteditable]')) return;
        const data = input.closest('[data-field-name]');
        let field = data?.getAttribute('data-field-name') || null;
        if (!field) {
          const id = (input.id || '') + ' ' + (input.name || '');
          field = Object.keys(this.values).sort((a,b)=>b.length-a.length).find(k=>id.toLowerCase().includes(k.toLowerCase())) || null;
        }
        this.iframe?.contentWindow?.postMessage({source:'tetraedar-cms',type:'focus',field},location.origin);
      }
      render() {
        this.values = toPlain(this.props.entry.get('data'));
        return React.createElement('div',{style:{height:'100%',minHeight:'75vh',background:'#f3f5f8',display:'flex',flexDirection:'column'}},
          React.createElement('div',{style:{padding:'10px 14px',fontSize:12,color:'#3d4d60',background:'#fff',borderBottom:'1px solid #ddd'}},'Преглед на началната страница - промените се виждат преди публикуване'),
          React.createElement('iframe',{ref:el=>{this.iframe=el;},title:'Преглед на началната страница',src:'/?cms_preview=1',style:{width:'100%',flex:1,border:0,background:'#fff'}})
        );
      }
    }
    window.CMS.registerPreviewTemplate('homepage',HomepagePreview);
  }
  start();
})();
