/* Product editor section navigation. Presentation only: never changes Decap's data. */
(function () {
  'use strict';

  var SECTIONS = [
    { id: 'basic', label: 'Основна информация', fields: ['title', 'urlSlug', 'category', 'subcategory', 'order', 'cardLabel'] },
    { id: 'descriptions', label: 'Описания', fields: ['catalogDescription', 'descriptionBlocks', 'attachments'] },
    { id: 'photos', label: 'Снимки', fields: ['image', 'images', 'modelDrawing'] },
    { id: 'specifications', label: 'Характеристики', fields: ['models'] },
    { id: 'settings', label: 'Настройки', fields: ['lockCollection', 'lockItems'] }
  ];
  var fieldSection = {};
  SECTIONS.forEach(function (section) {
    section.fields.forEach(function (field) { fieldSection[field] = section.id; });
  });
  var selected = 'basic';
  var nav = null;
  var activeFields = [];
  var scheduled = false;

  function isProductRoute() {
    // Decap uses /#/collections/products/entries/... and /#/collections/products/new.
    return /(?:^|\/)collections\/(?:products|products_en)(?:\/|$)/.test(location.hash.replace(/^#\/?/, ''));
  }

  function getFields() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-field-name]'));
    return nodes.filter(function (node) {
      var name = node.getAttribute('data-field-name');
      if (!Object.prototype.hasOwnProperty.call(fieldSection, name)) return false;
      // Exclude nested list controls: a nested model description is not the top-level description.
      if (node.parentElement && node.parentElement.closest('[data-field-name]')) return false;
      if (!node.isConnected) return false;
      return true;
    });
  }

  function clear() {
    activeFields.forEach(function (field) {
      field.classList.remove('tetra-section-field', 'tetra-section-hidden');
      field.style.removeProperty('--tetra-nav-offset');
    });
    activeFields = [];
    if (nav) { nav.remove(); nav = null; }
  }

  function makeNav() {
    nav = document.createElement('nav');
    nav.id = 'tetra-product-sections';
    nav.setAttribute('aria-label', 'Секции на продукта');
    var heading = document.createElement('div');
    heading.className = 'tetra-sections-heading';
    heading.textContent = 'Редактиране на продукт';
    nav.appendChild(heading);
    SECTIONS.forEach(function (section) {
      var button = document.createElement('button');
      button.type = 'button';
      button.dataset.section = section.id;
      button.textContent = section.label;
      button.addEventListener('click', function () {
        selected = section.id;
        apply();
      });
      nav.appendChild(button);
    });
    document.body.appendChild(nav);
  }

  function apply() {
    if (!isProductRoute()) { clear(); return; }
    var fields = getFields();
    // Do not modify the editor until the product form is mounted.
    if (!fields.length) { clear(); return; }
    if (!nav) makeNav();
    activeFields.forEach(function (field) {
      if (fields.indexOf(field) === -1) {
        field.classList.remove('tetra-section-field', 'tetra-section-hidden');
        field.style.removeProperty('--tetra-nav-offset');
      }
    });
    activeFields = fields;
    fields.forEach(function (field) {
      field.classList.add('tetra-section-field');
      field.classList.toggle('tetra-section-hidden', fieldSection[field.getAttribute('data-field-name')] !== selected);
    });
    Array.prototype.forEach.call(nav.querySelectorAll('button'), function (button) {
      var on = button.dataset.section === selected;
      button.classList.toggle('is-active', on);
      button.setAttribute('aria-current', on ? 'true' : 'false');
    });
    position();
  }

  function position() {
    if (!nav || !activeFields.length) return;
    // Measure the form's original column. The preview is left in Decap's own column.
    var rects = activeFields.filter(function (field) { return !field.classList.contains('tetra-section-hidden'); }).map(function (field) { return field.getBoundingClientRect(); });
    if (!rects.length) return;
    var left = Math.min.apply(null, rects.map(function (r) { return r.left; }));
    var right = Math.max.apply(null, rects.map(function (r) { return r.right; }));
    var width = right - left;
    if (!isFinite(width) || width < 250) return;
    var navWidth = Math.max(130, Math.min(210, Math.round(width * 0.25)));
    var top = Math.max(70, Math.min.apply(null, rects.map(function (r) { return r.top; })));
    // Keep menu visible even when the field list is scrolled.
    nav.style.left = Math.max(0, left) + 'px';
    nav.style.top = Math.min(top, 115) + 'px';
    nav.style.width = navWidth + 'px';
    nav.style.maxHeight = 'calc(100vh - ' + (Math.min(top, 115) + 16) + 'px)';
    activeFields.forEach(function (field) { field.style.setProperty('--tetra-nav-offset', navWidth + 12 + 'px'); });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () { scheduled = false; apply(); });
  }

  function start() {
    // Observe structural changes only; input changes and editor values are untouched.
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () { selected = 'basic'; schedule(); });
    window.addEventListener('resize', position);
    document.addEventListener('scroll', position, true);
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
