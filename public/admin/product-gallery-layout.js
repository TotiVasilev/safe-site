/* Tetraedar CMS: horizontal image list presentation only.
   Keeps Decap's native image picker and list reorder/remove controls intact. */
(function () {
  const LABEL = 'Допълнителни снимки — подредба отляво надясно';
  function enhance() {
    const labels = [...document.querySelectorAll('label, span, div')].filter(el =>
      el.children.length === 0 && el.textContent && el.textContent.trim() === LABEL);
    for (const label of labels) {
      let node = label;
      for (let i=0;i<6 && node;i++,node=node.parentElement) {
        // Find the closest ancestor containing both the label and the native list's Add button.
        if (!node.querySelector('button')) continue;
        const buttons=[...node.querySelectorAll('button')];
        if (!buttons.some(b => /add|добав|\+/i.test((b.textContent||'')+' '+(b.getAttribute('aria-label')||'')))) continue;
        node.classList.add('tetraedar-image-gallery');
        break;
      }
    }
  }
  const css=document.createElement('style');
  css.textContent=`
    /* The gallery layout is applied only to the additional-images field. */
    .tetraedar-image-gallery { min-width:0; }
    .tetraedar-image-gallery > div { min-width:0; }
    .tetraedar-image-gallery [data-testid="list-widget-list"] {
      display:flex !important; flex-direction:row !important; flex-wrap:nowrap !important;
      overflow-x:auto !important; gap:14px !important; padding:10px 3px 18px !important;
      align-items:stretch !important; scrollbar-width:thin;
    }
    .tetraedar-image-gallery [data-testid="list-widget-list"] > * {
      flex:0 0 240px !important; width:240px !important; min-width:240px !important;
      max-width:240px !important; margin:0 !important;
    }
    .tetraedar-image-gallery img { max-width:100%; object-fit:contain; }
    @media(max-width:700px) {
      .tetraedar-image-gallery [data-testid="list-widget-list"] > * {
        flex-basis:190px !important; width:190px !important; min-width:190px !important;
      }
    }
  `;
  document.head.appendChild(css);
  let pending=false;
  const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhance();});});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  enhance();
})();
