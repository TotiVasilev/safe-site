(function () {
  "use strict";
  var params = new URLSearchParams(window.location.search);
  var language = params.get("lang") === "en" ? "en" : "bg";
  window.TETRAEDAR_CMS_LANGUAGE = language;

  var originalConfirm = window.confirm.bind(window);
  window.confirm = function (message) {
    if (typeof message === "string" &&
        /a local backup was recovered for this entry/i.test(message)) {
      return false;
    }
    return originalConfirm(message);
  };

  function navigate(next) {
    if (next === language) return;
    var url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.location.assign(url.toString());
  }

  function mount() {
    if (document.getElementById("cms-language-switch")) return;
    var bar = document.createElement("div");
    bar.id = "cms-language-switch";
    bar.setAttribute("aria-label", "Content language");
    bar.style.cssText = "position:fixed;top:12px;right:20px;z-index:9999;display:flex;gap:2px;padding:4px;background:#fff;border:1px solid #d9dfe5;border-radius:7px;box-shadow:0 2px 8px #0002;font:600 13px system-ui";
    ["bg", "en"].forEach(function (code) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = code.toUpperCase();
      button.setAttribute("aria-pressed", String(language === code));
      button.style.cssText = "border:0;border-radius:4px;padding:7px 13px;cursor:pointer;font:inherit;background:" + (language === code ? "#2463a3;color:white" : "transparent;color:#344054");
      button.addEventListener("click", function () { navigate(code); });
      bar.appendChild(button);
    });
    document.body.appendChild(bar);
  }

  function hideUnusedPreviewLink() {
    var controls = document.querySelectorAll("a, button");
    for (var i = 0; i < controls.length; i++) {
      if (controls[i].textContent.trim() === "Check for Preview") {
        controls[i].style.display = "none";
      }
    }
  }

  function init() {
    if (!window.CMS || !window.TETRAEDAR_CMS_CONFIG) return;
    window.CMS.init({config: window.TETRAEDAR_CMS_CONFIG[language]});
    mount();
    hideUnusedPreviewLink();
    new MutationObserver(hideUnusedPreviewLink).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
