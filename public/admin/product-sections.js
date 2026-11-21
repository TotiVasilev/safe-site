/* TETRAEDAR product editor sections — presentation only; Decap fields stay mounted. */
(function () {
  'use strict';
  var sections = [
    {id:'basic',label:'Основна информация',fields:['title','urlSlug','category','subcategory','order']},
    {id:'descriptions',label:'Описания',fields:['cardLabel','catalogDescription','descriptionBlocks','attachments']},
    {id:'photos',label:'Снимки',fields:['image','images','modelDrawing']},
    {id:'specifications',label:'Характеристики',fields:['models']},
    {id:'settings',label:'Настройки',fields:['lockCollection','lockItems']}
  ];
  var labels = {
    title:['Име на продукта'],urlSlug:['URL адрес (Slug)'],category:['Категория'],
    subcategory:['Подкатегория (по избор)'],order:['Ред на показване'],
    cardLabel:['Кратък надпис над името'],catalogDescription:['Кратко описание за каталога'],
    descriptionBlocks:['Секции на подробното описание (по избор)'],
    attachments:['Кликаеми думи и прикачени файлове'],image:['Основна снимка'],
    images:['Допълнителни снимки'],modelDrawing:['Обща техническа схема за моделите (H, B, L)'],
    models:['Модели и технически характеристики'],lockCollection:['Специална страница с карти за ключалки'],
    lockItems:['Ключалки в специалната страница']
  };
  var fieldToSection = {}, labelToField = {};
  sections.forEach(function(s){s.fields.forEach(function(f){fieldToSection[f]=s.id; (labels[f]||[]).forEach(function(l){labelToField[normalize(l)]=f;});});});
  var selected='basic', nav=null, tracked=[], frame=null, scheduled=false, gutterNodes=[];
  function normalize(s){return String(s||'').replace(/\s*\(optional\)\s*/ig,'').replace(/\s+/g,' ').trim().toLocaleLowerCase();}
  function isProduct(){return /(?:^|\/)collections\/(?:products|products_en)\/(?:entries\/[^/]+|new)(?:\/|$)/.test(location.hash.replace(/^#\/?/,''));}
  function fieldFor(node){
    var name=node.getAttribute('data-field-name');
    if(name && fieldToSection[name]) return name;
    var candidates=node.querySelectorAll('label, [class*="FieldLabel"], [class*="fieldLabel"]');
    for(var i=0;i<candidates.length;i++){
      var label=candidates[i];
      if(label.closest('[aria-label$=" field"]')!==node) continue;
      var text=normalize(label.textContent).replace(/\s*\*$/,'');
      if(labelToField[text]) return labelToField[text];
    }
    return null;
  }
  function collect(){
    var found=[], used={};
    document.querySelectorAll('[aria-label$=" field"], [data-field-name]').forEach(function(node){
      if(node.closest('#tetra-product-sections')) return;
      if(node.parentElement && node.parentElement.closest('[aria-label$=" field"], [data-field-name]')) return;
      var field=fieldFor(node);
      if(!field || used[field]) return;
      used[field]=true; found.push({node:node,field:field});
    });
    return found;
  }
  function restoreGutters(){
    gutterNodes.forEach(function(x){x.node.style.scrollbarGutter=x.previous;});
    gutterNodes=[];
  }
  function reserveScrollGutter(){
    if(!frame) return;
    var next=[], node=frame;
    while(node && node.nodeType===1){
      var overflow=getComputedStyle(node).overflowY;
      if(/^(auto|scroll)$/.test(overflow)) next.push(node);
      node=node.parentElement;
    }
    if(!next.length) next=[document.documentElement];
    gutterNodes.forEach(function(x){if(next.indexOf(x.node)===-1)x.node.style.scrollbarGutter=x.previous;});
    gutterNodes=gutterNodes.filter(function(x){return next.indexOf(x.node)!==-1;});
    next.forEach(function(el){
      if(!gutterNodes.some(function(x){return x.node===el;}))gutterNodes.push({node:el,previous:el.style.scrollbarGutter});
      el.style.scrollbarGutter='stable';
    });
  }
  function cleanup(){
    tracked.forEach(function(x){x.node.classList.remove('tetra-section-field','tetra-section-hidden');});
    tracked=[];
    restoreGutters();
    if(frame){frame.classList.remove('tetra-section-form');frame.style.removeProperty('--tetra-nav-width');frame=null;}
    if(nav){nav.remove();nav=null;}
  }
  function createNav(){
    nav=document.createElement('nav');nav.id='tetra-product-sections';nav.setAttribute('aria-label','Секции на продукта');
    var title=document.createElement('div');title.className='tetra-sections-heading';title.textContent='Редактиране на продукт';nav.appendChild(title);
    sections.forEach(function(s){var b=document.createElement('button');b.type='button';b.textContent=s.label;b.dataset.section=s.id;b.addEventListener('click',function(){selected=s.id;apply();});nav.appendChild(b);});
  }
  function apply(){
    if(!isProduct()){cleanup();return;}
    var next=collect();
    if(next.length<3){cleanup();return;}
    var parent=next[0].node.parentElement;
    while(parent && !next.every(function(x){return parent.contains(x.node);})){parent=parent.parentElement;}
    if(!parent || parent===document.body || parent===document.documentElement){cleanup();return;}
    if(frame!==parent){cleanup();frame=parent;frame.classList.add('tetra-section-form');}
    if(!nav){createNav();frame.insertBefore(nav,frame.firstChild);}
    tracked.forEach(function(x){if(!next.some(function(y){return y.node===x.node;}))x.node.classList.remove('tetra-section-field','tetra-section-hidden');});
    tracked=next;
    next.forEach(function(x){x.node.classList.add('tetra-section-field');x.node.classList.toggle('tetra-section-hidden',fieldToSection[x.field]!==selected);});
    nav.querySelectorAll('button').forEach(function(b){var on=b.dataset.section===selected;b.classList.toggle('is-active',on);b.setAttribute('aria-current',on?'true':'false');});
    reserveScrollGutter();
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;apply();});}
  function start(){new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});window.addEventListener('hashchange',function(){selected='basic';schedule();});schedule();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
