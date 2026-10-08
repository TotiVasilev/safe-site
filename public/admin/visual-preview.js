
/* TETRAEDAR - Direct live homepage preview for Decap CMS */
(function () {
  "use strict";

  var ELEMENT = Symbol.for("react.transitional.element");

  function element(type, props) {
    return {
      $$typeof: ELEMENT,
      type: type,
      key: null,
      props: props || {},
      _owner: null
    };
  }

  function plain(value) {
    if (value && typeof value.toJS === "function") {
      return value.toJS();
    }
    return value && typeof value === "object" ? value : {};
  }

  function HomepagePreview(props) {
    this.props = props;
    this.frame = null;
    this.timer = null;
    this.activeField = null;
    this.lastValues = {};
    this.onLoad = this.onLoad.bind(this);
    this.attach = this.attach.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  HomepagePreview.prototype.isReactComponent = {};

  HomepagePreview.prototype.attach = function (frame) {
    this.frame = frame;
  };

  HomepagePreview.prototype.values = function () {
    var entry = this.props.entry;
    if (!entry || typeof entry.get !== "function") return {};
    return plain(entry.get("data"));
  };

  HomepagePreview.prototype.document = function () {
    try {
      return this.frame && this.frame.contentDocument;
    } catch (error) {
      return null;
    }
  };

  HomepagePreview.prototype.targets = function (field) {
    var doc = this.document();
    if (!doc) return [];

    return Array.from(doc.querySelectorAll("[data-cms-field]"))
      .filter(function (node) {
        return node.getAttribute("data-cms-field") === field;
      });
  };

  HomepagePreview.prototype.apply = function (values) {
    var self = this;
    var doc = this.document();

    if (!doc || !doc.querySelector("[data-cms-field]")) return;

    Object.keys(values).forEach(function (key) {
      var value = values[key];

      if (value == null || typeof value === "object") return;

      if (key === "heroBackground") {
        self.targets(key).forEach(function (node) {
          if (value) {
            node.style.backgroundImage =
              "url(" + JSON.stringify(String(value)) + ")";
          }
        });
        return;
      }

      var links = {
        primaryLink: "primaryButton",
        secondaryLink: "secondaryButton",
        contactLink: "contactButton"
      };

      if (links[key]) {
        self.targets(links[key]).forEach(function (node) {
          var anchor = node.closest("a");
          if (anchor) anchor.setAttribute("href", String(value));
        });
        return;
      }

      self.targets(key).forEach(function (node) {
        var text = String(value);

        if (node.textContent !== text) {
          node.textContent = text;
        }

        if (key === "heroTitle") {
          node.style.whiteSpace = "pre-line";
        }
      });
    });
  };

  HomepagePreview.prototype.highlight = function (field) {
    var doc = this.document();
    if (!doc) return;

    doc.querySelectorAll("[data-cms-field]").forEach(function (node) {
      node.style.outline = "";
      node.style.outlineOffset = "";
    });

    if (!field) return;

    var targets = this.targets(field);

    targets.forEach(function (node) {
      node.style.outline = "3px solid #3b82f6";
      node.style.outlineOffset = "4px";
    });

    var visible = targets.find(function (node) {
      var rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    if (visible) {
      visible.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  HomepagePreview.prototype.sync = function () {
    var values = this.values();

    this.lastValues = values;
    this.apply(values);
  };

  HomepagePreview.prototype.onLoad = function () {
    this.sync();
    this.highlight(this.activeField);
  };

  HomepagePreview.prototype.findField = function (target) {
    if (!target || !target.closest) return null;

    var holder = target.closest("[data-field-name]");

    if (holder) {
      var name = holder.getAttribute("data-field-name");
      if (name) return name;
    }

    var identifier = [
      target.name,
      target.id
    ].filter(Boolean).join(" ").toLowerCase();

    var keys = Object.keys(this.values()).sort(function (a, b) {
      return b.length - a.length;
    });

    for (var i = 0; i < keys.length; i++) {
      if (identifier.indexOf(keys[i].toLowerCase()) !== -1) {
        return keys[i];
      }
    }

    return null;
  };

  HomepagePreview.prototype.onFocus = function (event) {
    var field = this.findField(event.target);
    if (!field) return;

    this.activeField = field;
    this.highlight(field);
  };

  HomepagePreview.prototype.onInput = function (event) {
    var field = this.findField(event.target);

    if (field) {
      this.activeField = field;

      var values = Object.assign({}, this.values());

      if (
        event.target &&
        typeof event.target.value === "string" &&
        event.target.type !== "file"
      ) {
        values[field] = event.target.value;
      }

      this.apply(values);
      this.highlight(field);
    }

    var self = this;
    setTimeout(function () {
      self.sync();
    }, 150);
  };

  HomepagePreview.prototype.componentDidMount = function () {
    var self = this;

    // Decap's editor is in the outer admin document.
    window.top.document.addEventListener(
      "focusin", this.onFocus, true
    );

    window.top.document.addEventListener(
      "input", this.onInput, true
    );

    window.top.document.addEventListener(
      "change", this.onInput, true
    );

    // Keep the rendered homepage synchronized with Decap's draft.
    this.timer = setInterval(function () {
      self.sync();
    }, 300);

    this.sync();
  };

  HomepagePreview.prototype.componentDidUpdate = function () {
    this.sync();
  };

  HomepagePreview.prototype.componentWillUnmount = function () {
    if (this.timer) clearInterval(this.timer);

    try {
      window.top.document.removeEventListener(
        "focusin", this.onFocus, true
      );

      window.top.document.removeEventListener(
        "input", this.onInput, true
      );

      window.top.document.removeEventListener(
        "change", this.onInput, true
      );
    } catch (error) {
      // The editor can still be closed safely.
    }
  };

  HomepagePreview.prototype.render = function () {
    return element("div", {
      style: {
        height: "100%",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f5"
      },
      children: [
        element("div", {
          style: {
            padding: "10px 14px",
            fontSize: "12px",
            background: "#fff",
            borderBottom: "1px solid #ddd"
          },
          children:
            "Начална страница - преглед преди публикуване"
        }),
        element("iframe", {
          ref: this.attach,
          onLoad: this.onLoad,
          title: "Начална страница - преглед на живо",
          src: "/?cms_preview=1",
          style: {
            width: "100%",
            flex: "1 1 auto",
            minHeight: "75vh",
            border: 0,
            background: "#fff"
          }
        })
      ]
    });
  };

  var attempts = 0;

  function register() {
    if (
      window.CMS &&
      typeof window.CMS.registerPreviewTemplate === "function"
    ) {
      window.CMS.registerPreviewTemplate(
        "homepage",
        HomepagePreview
      );
      return;
    }

    if (++attempts < 300) {
      setTimeout(register, 100);
    }
  }

  register();
})();
