(function () {
  "use strict";
  var names = ["categories", "subcategories", "products", "website", "privacy_policy"];
  var button;

  function target(hash) {
    var match = hash.match(/^#\/collections\/([^/]+)(.*)$/);
    if (!match) return null;
    var current = match[1];
    var base = current.endsWith("_en") ? current.slice(0, -3) : current;
    if (names.indexOf(base) < 0) return null;
    var english = current.endsWith("_en");
    return {
      english: english,
      hash: "#/collections/" + (english ? base : base + "_en") + match[2]
    };
  }

  function update() {
    var state = target(location.hash);
    if (!state) {
      if (button) button.hidden = true;
      return;
    }
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.style.cssText = "position:fixed;right:24px;bottom:24px;z-index:10000;padding:10px 16px;background:#172e4d;color:#fff;border:1px solid #fff;border-radius:6px;font:600 13px system-ui;box-shadow:0 3px 14px #0003;cursor:pointer";
      button.addEventListener("click", function () {
        var next = target(location.hash);
        if (next) location.hash = next.hash;
      });
      document.body.appendChild(button);
    }
    button.hidden = false;
    button.textContent = state.english ? "BG · Български" : "EN · English";
    button.title = "Switch content language";
  }

  window.addEventListener("hashchange", update);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", update);
  else update();
})();
