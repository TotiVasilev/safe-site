
/* TETRAEDAR - Decap live homepage preview */
(function () {
  "use strict";

  // Use Decap's React runtime. Do not load another copy of React.
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

  function toPlain(value) {
    if (value && typeof value.toJS === "function") {
      return value.toJS();
    }

    return value && typeof value === "object" ? value : {};
  }

  function HomepagePreview(props) {
    this.props = props;
    this.frame = null;
    this.previewWindow = null;
    this.ready = false;
    this.activeField = null;

    this.attach = this.attach.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  HomepagePreview.prototype.isReactComponent = {};

  HomepagePreview.prototype.attach = function (frame) {
    if (this.frame === frame) return;

    if (this.previewWindow) {
      this.previewWindow.removeEventListener(
        "message",
        this.onMessage
      );
    }

    this.frame = frame;
    this.ready = false;
    this.previewWindow = frame
      ? frame.ownerDocument.defaultView
      : null;

    // Decap renders preview components in a separate iframe.
    // Listen in THAT window, not the main admin window.
    if (this.previewWindow) {
      this.previewWindow.addEventListener(
        "message",
        this.onMessage
      );
    }
  };

  HomepagePreview.prototype.componentDidMount = function () {
    document.addEventListener("focusin", this.onFocus, true);
    document.addEventListener("input", this.onInput, true);
    document.addEventListener("change", this.onInput, true);

    this.sync();
  };

  HomepagePreview.prototype.componentDidUpdate = function () {
    this.sync();
  };

  HomepagePreview.prototype.componentWillUnmount = function () {
    document.removeEventListener("focusin", this.onFocus, true);
    document.removeEventListener("input", this.onInput, true);
    document.removeEventListener("change", this.onInput, true);

    if (this.previewWindow) {
      this.previewWindow.removeEventListener(
        "message",
        this.onMessage
      );
    }

    this.previewWindow = null;
    this.frame = null;
    this.ready = false;
  };

  HomepagePreview.prototype.onLoad = function () {
    // The homepage bridge is loaded before the iframe load event.
    this.ready = true;
    this.sync();
  };

  HomepagePreview.prototype.onMessage = function (event) {
    if (!this.frame || !this.frame.contentWindow) return;

    if (event.source !== this.frame.contentWindow) return;
    if (event.origin !== location.origin) return;

    var message = event.data;

    if (
      message &&
      message.source === "tetraedar-preview" &&
      message.type === "ready"
    ) {
      this.ready = true;
      this.sync();
    }
  };

  HomepagePreview.prototype.values = function () {
    var entry = this.props.entry;

    if (!entry || typeof entry.get !== "function") {
      return {};
    }

    return toPlain(entry.get("data"));
  };

  HomepagePreview.prototype.post = function (type, payload) {
    if (!this.ready || !this.frame) return;
    if (!this.frame.contentWindow) return;

    this.frame.contentWindow.postMessage(
      Object.assign(
        {
          source: "tetraedar-cms",
          type: type
        },
        payload || {}
      ),
      location.origin
    );
  };

  HomepagePreview.prototype.sync = function () {
    this.post("update", {
      values: this.values()
    });

    if (this.activeField) {
      this.post("focus", {
        field: this.activeField
      });
    }
  };

  HomepagePreview.prototype.fieldFor = function (target) {
    if (!target || !target.closest) return null;

    if (
      !target.closest(
        'input, textarea, select, [contenteditable="true"]'
      )
    ) {
      return null;
    }

    var holder = target.closest("[data-field-name]");

    if (holder) {
      var fieldName = holder.getAttribute("data-field-name");

      if (fieldName) return fieldName;
    }

    var label = target.closest("label");

    var identifier = [
      target.name,
      target.id,
      label && label.getAttribute("for")
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

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
    var field = this.fieldFor(event.target);

    if (!field) return;

    this.activeField = field;

    this.post("focus", {
      field: field
    });
  };

  HomepagePreview.prototype.onInput = function (event) {
    var field = this.fieldFor(event.target);

    if (!field) return;

    this.activeField = field;

    var target = event.target;

    // Immediately preview typed values without waiting for Decap
    // to finish updating its internal draft.
    if (
      target.type !== "file" &&
      target.type !== "checkbox" &&
      field !== "partners"
    ) {
      var values = this.values();

      values[field] = target.value;

      this.post("update", {
        values: values
      });
    }

    this.post("focus", {
      field: field
    });

    var self = this;

    // Follow up with the actual Decap draft.
    Promise.resolve().then(function () {
      self.sync();
    });
  };

  HomepagePreview.prototype.render = function () {
    return element("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "78vh",
        background: "#f4f5f7"
      },
      children: [
        element("div", {
          style: {
            padding: "10px 14px",
            background: "#ffffff",
            borderBottom: "1px solid #dddddd",
            fontSize: "12px",
            color: "#334155"
          },
          children:
            "Начална страница - преглед на промените преди публикуване"
        }),

        element("iframe", {
          ref: this.attach,
          onLoad: this.onLoad,
          title: "Начална страница - преглед на живо",
          src: "/?cms_preview=1",
          style: {
            display: "block",
            width: "100%",
            flex: "1 1 auto",
            minHeight: "74vh",
            border: 0,
            background: "#ffffff"
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
    } else {
      console.error(
        "TETRAEDAR: Homepage preview registration failed."
      );
    }
  }

  register();
})();
