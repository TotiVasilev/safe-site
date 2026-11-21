/* Product editor only: preserve the initial vertical position of the left form.
   The preview column and other CMS collections are not touched. */
(function () {
  'use strict';
  var editor = null;
  var initialTop = null;
  var originalTranslate = '';
  var pending = false;
  function isProduct() {
    return /(?:^|\/)collections\/(?:products|products_en)\/(?:entries\/[^/]+|new)(?:\/|$)/.test(location.hash.replace(/^#\/?/, ''));
  }
  function clear() {
    if (editor) editor.style.translate = originalTranslate;
    editor = null;
    initialTop = null;
  }
  function update() {
    pending = false;
    if (!isProduct()) { clear(); return; }
    var form = document.querySelector('.tetra-section-form');
    var nav = document.getElementById('tetra-product-sections');
    if (!form || !nav || !form.contains(nav)) return;
    if (editor !== form) {
      clear();
      editor = form;
      originalTranslate = form.style.translate;
      // Capture the editor's initial position, before changing sections.
      initialTop = form.getBoundingClientRect().top;
    }
    // Measure unshifted position, then compensate for changes in Decap layout.
    editor.style.translate = originalTranslate;
    var currentTop = editor.getBoundingClientRect().top;
    var difference = initialTop - currentTop;
    if (Math.abs(difference) > 0.5) {
      editor.style.translate = '0 ' + difference.toFixed(2) + 'px';
    }
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { requestAnimationFrame(update); });
  }
  function start() {
    // The section buttons are inserted by product-sections.js.
    document.addEventListener('click', function (event) {
      if (event.target.closest('#tetra-product-sections button[data-section]')) schedule();
    }, true);
    window.addEventListener('hashchange', function () { clear(); schedule(); });
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
