/* Tetraedar product gallery widget. Stores the original array of image path strings. */
(function () {
  'use strict';
  if (!window.CMS || !window.createClass || !window.h) {
    console.error('[Tetraedar gallery] Decap CMS widget API unavailable.');
    return;
  }
  var h = window.h;
  function list(value) {
    if (!value) return [];
    var values = typeof value.toJS === 'function' ? value.toJS() : value;
    return Array.isArray(values) ? values.filter(function (v) { return typeof v === 'string' && v.trim(); }) : [];
  }
  function imageUrl(path, getAsset) {
    if (!path) return '';
    if (typeof getAsset === 'function') {
      try {
        var asset = getAsset(path);
        if (asset) {
          if (typeof asset.toString === 'function') return asset.toString();
          if (asset.url) return asset.url;
        }
      } catch (e) { /* use public URL */ }
    }
    return path;
  }
  function button(label, title, action, className, disabled) {
    return h('button', {type:'button', title:title, 'aria-label':title,
      className:className || 'tg-button', disabled:!!disabled, onClick:action}, label);
  }
  var Gallery = window.createClass({
    getInitialState: function () { return {dragIndex:null, editingIndex:null, draft:'', addOpen:false}; },
    update: function (items) { this.props.onChange(items); },
    reorder: function (from, to) {
      var items=list(this.props.value);
      if (from===null || from<0 || to<0 || from>=items.length || to>=items.length || from===to) return;
      var moved=items.splice(from,1)[0]; items.splice(to,0,moved);
      this.update(items);
    },
    remove: function (index) {
      var items=list(this.props.value); items.splice(index,1); this.update(items);
      this.setState({editingIndex:null,addOpen:false});
    },
    savePath: function (index, path) {
      path=String(path||'').trim(); if (!path) return;
      var items=list(this.props.value);
      if (index===null) items.push(path); else items[index]=path;
      this.update(items); this.setState({editingIndex:null,draft:'',addOpen:false});
    },
    openPicker: function (index) {
      var self=this;
      // Decap media-library integration, where exposed by the current version.
      if (typeof this.props.onOpenMediaLibrary === 'function') {
        this.props.onOpenMediaLibrary({allowMultiple:false},function (selection) {
          var chosen=Array.isArray(selection)?selection[0]:selection;
          var path=typeof chosen==='string'?chosen:(chosen && (chosen.path||chosen.url||chosen.public_path));
          if (path) self.savePath(index,path);
        });
      } else {
        this.setState({editingIndex:index,draft:index===null?'':list(this.props.value)[index]||'',addOpen:index===null});
      }
    },
    render: function () {
      var self=this, items=list(this.props.value);
      var cards=items.map(function (path,index) {
        var editing=self.state.editingIndex===index;
        return h('div', {key:path+'-'+index,className:'tg-card'+(self.state.dragIndex===index?' tg-dragging':''),
          draggable:!editing,
          onDragStart:function (e) {e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(index));self.setState({dragIndex:index});},
          onDragOver:function(e){e.preventDefault();e.dataTransfer.dropEffect='move';},
          onDrop:function(e){e.preventDefault();var from=Number(e.dataTransfer.getData('text/plain'));self.reorder(from,index);self.setState({dragIndex:null});},
          onDragEnd:function(){self.setState({dragIndex:null});}},
          h('div',{className:'tg-card-top'},h('span',{className:'tg-number'},'#'+(index+1)),h('span',{className:'tg-handle',title:'Плъзнете за преместване'},'⠿')),
          h('div',{className:'tg-thumb'},h('img',{src:imageUrl(path,self.props.getAsset),alt:'Снимка '+(index+1),loading:'lazy',onError:function(e){e.currentTarget.style.opacity='.18';}})),
          h('div',{className:'tg-filename',title:path},path.split('/').pop()),
          editing ? h('div',{className:'tg-edit'},
            h('input',{type:'text',value:self.state.draft,placeholder:'/products/uploads/photo.jpg',onChange:function(e){self.setState({draft:e.target.value});}}),
            button('Запази','Запази пътя',function(){self.savePath(index,self.state.draft);}),
            button('Отказ','Отказ',function(){self.setState({editingIndex:null});})
          ) : h('div',{className:'tg-actions'},
            button('↤','Премести наляво',function(){self.reorder(index,index-1);},'tg-button',index===0),
            button('↦','Премести надясно',function(){self.reorder(index,index+1);},'tg-button',index===items.length-1),
            button('Смени','Замени снимката',function(){self.openPicker(index);}),
            button('✕','Премахни снимката',function(){self.remove(index);},'tg-button tg-danger'))
        );
      });
      cards.push(h('div',{key:'add',className:'tg-add-card'},
        h('div',{className:'tg-add-icon'},'+'),
        button('Добави снимка','Добави снимка',function(){self.openPicker(null);},'tg-add-button'),
        self.state.addOpen && self.state.editingIndex===null ? h('div',{className:'tg-edit'},
          h('input',{type:'text',value:self.state.draft,placeholder:'/products/uploads/photo.jpg',onChange:function(e){self.setState({draft:e.target.value});}}),
          button('Запази','Добави изображение',function(){self.savePath(null,self.state.draft);}),
          button('Отказ','Отказ',function(){self.setState({addOpen:false});})
        ) : null
      ));
      return h('div',{className:'tg-gallery',id:this.props.forID},
        h('p',{className:'tg-help'},'Снимките са подредени отляво надясно. Плъзнете картите или използвайте стрелките за промяна на реда.'),
        h('div',{className:'tg-strip'},cards),
        h('p',{className:'tg-count'},items.length+' допълнителни снимки')
      );
    }
  });
  window.CMS.registerWidget('tetraedar-gallery',Gallery);
})();
