/* Homepage live preview bridge. Only active inside the CMS iframe. */
(function () {
  if (new URLSearchParams(location.search).get('cms_preview') !== '1') return;
  let original = null;
  const selectors = (key) => Array.from(document.querySelectorAll('[data-cms-field="' + key + '"]'));
  function renderPartners(partners) {
    if (!Array.isArray(partners)) return;
    selectors('partners').forEach(function (marquee) {
      const track = marquee.querySelector('.partners-track');
      if (!track) return;
      track.replaceChildren();
      if (!partners.length) return;
      for (let repeat = 0; repeat < 4; repeat++) partners.forEach(function (p) {
        const item = document.createElement('div'); item.className = 'partner-item flex h-28 w-64 shrink-0 items-center justify-center px-8';
        const inner = document.createElement('div'); inner.className = 'flex h-full w-full items-center justify-center rounded-2xl border border-black/10 bg-white';
        const target = p.url ? document.createElement('a') : document.createElement('div');
        if (p.url) { target.href = p.url; target.target = '_blank'; target.rel = 'noopener noreferrer'; }
        target.className = 'flex h-full w-full items-center justify-center';
        if (p.image) { const img = document.createElement('img'); img.src = p.image; img.alt = p.name || ''; img.className = 'h-16 w-40 object-contain'; target.appendChild(img); }
        else { const name = document.createElement('span'); name.className = 'text-lg font-medium tracking-tight text-black/40'; name.textContent = p.name || ''; target.appendChild(name); }
        inner.appendChild(target); item.appendChild(inner); track.appendChild(item);
      });
    });
  }
  function update(values) {
    if (!values || typeof values !== 'object') return;
    original = values;
    Object.keys(values).forEach(function (key) {
      if (key === 'partners') { renderPartners(values[key]); return; }
      selectors(key).forEach(function (el) {
        if (key === 'heroBackground') { el.style.backgroundImage = values[key] ? 'url(' + JSON.stringify(values[key]) + ')' : 'none'; return; }
        if (key === 'heroTitle') { el.textContent = String(values[key] || ''); el.style.whiteSpace = 'pre-line'; return; }
        if (typeof values[key] === 'string') el.textContent = values[key];
      });
      const hrefKey = {primaryLink:'primaryButton', secondaryLink:'secondaryButton',contactLink:'contactButton'}[key];
      if (hrefKey) selectors(hrefKey).forEach(function(el) { const a = el.closest('a'); if (a) a.href = values[key] || '#'; });
    });
  }
  let selected = [];
  function highlight(key) {
    selected.forEach(function (el) { el.style.outline = ''; el.style.outlineOffset = ''; }); selected = [];
    if (!key) return;
    selected = selectors(key);
    selected.forEach(function(el) { el.style.outline = '3px solid #3f7edb'; el.style.outlineOffset = '5px'; });
    const visible = selected.find(function(el) { return el.getClientRects().length && el.getBoundingClientRect().width; });
    if (visible) visible.scrollIntoView({behavior:'smooth',block:'center'});
  }
  window.addEventListener('message', function(event) {
    if (event.origin !== location.origin || !event.data || event.data.source !== 'tetraedar-cms') return;
    if (event.data.type === 'update') update(event.data.values);
    if (event.data.type === 'focus') highlight(event.data.field);
  });
  window.parent.postMessage({source:'tetraedar-preview',type:'ready'}, location.origin);
})();
