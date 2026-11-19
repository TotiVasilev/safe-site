
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
    this.previewDevice = "desktop";
    this.previewWidth = 0;
    this.previewContainer = null;
    this.previewObserver = null;
    this.attachContainer = this.attachContainer.bind(this);
    this.setPreviewDevice = this.setPreviewDevice.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.attach = this.attach.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onPreviewNavigation = this.onPreviewNavigation.bind(this);
    this.previewDoc = null;
  }

  HomepagePreview.prototype.isReactComponent = {};

  HomepagePreview.prototype.attach = function (frame) {
    this.frame = frame;
  };

  HomepagePreview.prototype.attachContainer = function (node) {
    if (this.previewContainer === node) return;
    if (this.previewObserver) this.previewObserver.disconnect();
    this.previewContainer = node;
    this.previewObserver = null;
    if (!node) return;
    var self = this;
    function updateWidth() {
      var width = node.clientWidth;
      if (width > 0 && Math.abs(width - self.previewWidth) > 1) {
        self.previewWidth = width;
        self.updateViewport();
      }
    }
    if (typeof ResizeObserver !== "undefined") {
      this.previewObserver = new ResizeObserver(updateWidth);
      this.previewObserver.observe(node);
    }
    updateWidth();
  };

  HomepagePreview.prototype.setPreviewDevice = function (device) {
    this.previewDevice = device;
    this.updateViewport();
    if (this.previewContainer && this.previewContainer.parentNode) {
      var buttons = this.previewContainer.parentNode.querySelectorAll('[data-preview-device]');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.background = buttons[i].getAttribute('data-preview-device') === device ? '#dbeafe' : '#fff';
      }
    }
  };

  HomepagePreview.prototype.updateViewport = function () {
    var container = this.previewContainer;
    if (!container) return;
    var frame = container.querySelector('iframe');
    if (!frame) return;
    var width = this.previewDevice === 'mobile' ? 390 : 1280;
    var height = this.previewDevice === 'mobile' ? 844 : 900;
    var available = Math.max(1, (container.clientWidth || 600) - 24);
    var scale = Math.min(1, available / width);
    var holder = frame.parentNode;
    holder.style.width = Math.round(width * scale) + 'px';
    holder.style.height = Math.round(height * scale) + 'px';
    frame.style.width = width + 'px';
    frame.style.height = height + 'px';
    frame.style.transform = 'scale(' + scale + ')';
  };

  function previewToolbar(preview, title) {
    return element("div", {
      style: { padding: "10px 14px", fontSize: "12px", background: "#fff", borderBottom: "1px solid #ddd", display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" },
      children: [
        element("span", { children: title }),
        element("div", { style: { display: "flex", gap: "5px", marginRight: "58px" }, children: ["desktop", "mobile"].map(function (device) {
          return element("button", {
            type: "button",
            "data-preview-device": device,
            onClick: function () { preview.setPreviewDevice(device); },
            style: { padding: "5px 9px", cursor: "pointer", borderRadius: "5px", border: "1px solid #bbb", background: preview.previewDevice === device ? "#dbeafe" : "#fff" },
            children: device === "mobile" ? "Мобилна" : "Десктоп"
          });
        }) })
      ]
    });
  }

  function previewViewport(preview, src, title) {
    var width = preview.previewDevice === "mobile" ? 390 : 1280;
    var height = preview.previewDevice === "mobile" ? 844 : 900;
    var available = Math.max(1, (preview.previewWidth || 600) - 24);
    var scale = Math.min(1, available / width);
    return element("div", {
      ref: preview.attachContainer,
      style: { flex: "1 1 auto", minHeight: "75vh", overflow: "auto", padding: "12px", boxSizing: "border-box", background: "#e9ecef" },
      children: element("div", {
        style: { position: "relative", width: Math.round(width * scale) + "px", height: Math.round(height * scale) + "px", margin: "0 auto", background: "#fff", boxShadow: "0 2px 14px rgba(0,0,0,.12)" },
        children: element("iframe", {
          ref: preview.attach, onLoad: preview.onLoad, title: title, src: src, scrolling: "yes",
          style: { display: "block", width: width + "px", height: height + "px", border: 0, background: "#fff", transform: "scale(" + scale + ")", transformOrigin: "top left" }
        })
      })
    });
  }

  function previewMediaUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    return value.trim();
  }

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

    var mobileHero = doc.querySelector('[data-cms-field="mobileHeroImage"]');
    if (mobileHero) {
      var image = previewMediaUrl(values.mobileHeroImage);
      if (image) mobileHero.style.backgroundImage = "url(" + JSON.stringify(image) + ")";
    }

    Object.keys(values).forEach(function (key) {
      var value = values[key];

      if (value == null || typeof value === "object" || /Style$/.test(key)) return;

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
    function visibleTarget(node) {
      var rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && doc.defaultView.getComputedStyle(node).visibility !== "hidden";
    }
    if (targets.length && !targets.some(visibleTarget)) {
      var other = this.previewDevice === "mobile" ? "desktop" : "mobile";
      this.setPreviewDevice(other);
    }

    targets.forEach(function (node) {
      node.style.outline = "3px solid #3b82f6";
      node.style.outlineOffset = "4px";
    });

    var visible = targets.find(visibleTarget);

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

  HomepagePreview.prototype.onPreviewNavigation = function (event) {
    var anchor = event.target && event.target.closest && event.target.closest("a[href]");
    if (!anchor) return;
    // The CMS preview is a read-only representation of this entry, not a site browser.
    event.preventDefault();
    event.stopPropagation();
  };

  HomepagePreview.prototype.onLoad = function () {
    var doc = this.document();
    if (this.previewDoc) this.previewDoc.removeEventListener("click", this.onPreviewNavigation, true);
    this.previewDoc = doc;
    if (doc) doc.addEventListener("click", this.onPreviewNavigation, true);
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
    if (this.previewDoc) this.previewDoc.removeEventListener("click", this.onPreviewNavigation, true);
    if (this.previewObserver) this.previewObserver.disconnect();

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
        previewToolbar(this, "Начална страница - преглед преди публикуване"),
        previewViewport(this, window.TETRAEDAR_CMS_LANGUAGE === "en" ? "/en/?cms_preview=1" : "/?cms_preview=1", "Начална страница - преглед на живо")
      ]
    });
  };


  // Services editor uses the same working direct-DOM preview as the homepage.
  function ServicesPreview(props) {
    HomepagePreview.call(this, props);
  }
  ServicesPreview.prototype = Object.create(HomepagePreview.prototype);
  ServicesPreview.prototype.constructor = ServicesPreview;

  ServicesPreview.prototype.apply = function (values) {
    var doc = this.document();
    if (!doc || !doc.querySelector('[data-cms-service-index]')) return;
    var self = this;
    Object.keys(values).forEach(function (key) {
      var match = /^mobileImage([1-6])$/.exec(key);
      if (match) {
        var url = previewMediaUrl(values[key]) || "/services/mobile-service-" + match[1] + ".jpg";
        doc.querySelectorAll('[data-cms-mobile-image="' + match[1] + '"]').forEach(function (image) {
          if (image.getAttribute("src") !== url) image.setAttribute("src", url);
        });
        return;
      }
      if (/^detail[1-6]_[1-3]$/.test(key)) {
        var label = doc.querySelectorAll('[data-cms-field="' + key + '"]');
        label.forEach(function (node) { if (typeof values[key] === "string") node.textContent = values[key]; });
        return;
      }
      if (!/^(title|description)[1-6]$/.test(key)) return;
      var value = values[key];
      if (typeof value !== 'string') return;
      self.targets(key).forEach(function (target) {
        if (target.textContent !== value) target.textContent = value;
      });
    });
  };

  ServicesPreview.prototype.highlight = function (field) {
    var doc = this.document();
    if (!doc) return;
    var match = field && /^(?:title|description|mobileImage|detail)([1-6])(?:_[1-3])?$/.exec(field);
    if (match) {
      var index = Number(match[1]) - 1;
      if (this.previewDevice === "mobile") {
        var detail = doc.querySelector('[data-cms-field="description' + (index + 1) + '"]');
        if (!detail || !detail.getBoundingClientRect().height) {
          var back = Array.from(doc.querySelectorAll('button')).find(function (node) {
            return /всички услуги|all services/i.test(node.textContent || "");
          });
          function openCard() {
            var cardTitle = Array.from(doc.querySelectorAll('[data-cms-field="title' + (index + 1) + '"]')).find(function (node) {
              return node.closest('button');
            });
            if (cardTitle) cardTitle.closest('button').click();
          }
          if (back) {
            back.click();
            setTimeout(openCard, 250);
          } else openCard();
        }
      } else {
        var button = doc.querySelector('[data-cms-service-index="' + index + '"]');
        if (button && this.currentService !== index) {
          this.currentService = index;
          button.click();
        }
      }
    }
    var self = this;
    function highlightVisible() {
      var current = self.document();
      if (!current) return;
      current.querySelectorAll("[data-cms-field]").forEach(function (node) {
        node.style.outline = "";
        node.style.outlineOffset = "";
      });
      var visible = self.targets(field).find(function (node) {
        var rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (visible) {
        visible.style.outline = "3px solid #3b82f6";
        visible.style.outlineOffset = "4px";
        visible.scrollIntoView({behavior:"smooth",block:"center"});
      }
    }
    highlightVisible();
    if (match && this.previewDevice === "mobile") setTimeout(highlightVisible, 400);
  };

  ServicesPreview.prototype.render = function () {
    return element('div', {
      style: {height:'100%',minHeight:'80vh',display:'flex',flexDirection:'column',background:'#f5f5f5'},
      children: [
        previewToolbar(this, "Услуги и сервиз - преглед преди публикуване"),
        previewViewport(this, window.TETRAEDAR_CMS_LANGUAGE === "en" ? '/en/uslugi/?cms_preview=1' : '/uslugi/?cms_preview=1', 'Услуги и сервиз - преглед на живо')
      ]
    });
  };


  // Products use the real public product page, rather than Decap's raw field dump.
  function ProductPreview(props) {
    HomepagePreview.call(this, props);
    this.productSlug = "";
  }
  ProductPreview.prototype = Object.create(HomepagePreview.prototype);
  ProductPreview.prototype.constructor = ProductPreview;

  ProductPreview.prototype.apply = function (values) {
    var doc = this.document();
    if (!doc || !doc.querySelector("main")) return;
    var main = doc.querySelector("main");
    var title = main.querySelector("h1");
    if (title && typeof values.title === "string") title.textContent = values.title;

    var label = main.querySelector("section.grid > div:nth-child(2) > p");
    if (label && typeof values.cardLabel === "string" && values.cardLabel.trim()) {
      label.textContent = values.cardLabel;
    }

    // Preserve the real site's typography, spacing, and description block styling.
    var description = main.querySelector("section.grid > div:nth-child(2) > div.mt-7");
    if (description) {
      var signature = JSON.stringify([values.description, values.descriptionBlocks]);
      if (description.dataset.cmsSignature !== signature) {
        description.dataset.cmsSignature = signature;
        var blocks = Array.isArray(values.descriptionBlocks) ? values.descriptionBlocks : [];
        var outer = doc.createElement("div");
        outer.className = blocks.length ? "space-y-6 sm:space-y-7" : "space-y-5";
        function paragraph(text, intro) {
          String(text || "").split(/\n\s*\n/).forEach(function (part) {
            if (!part.trim()) return;
            var p = doc.createElement("p");
            p.className = intro ? "text-[16px] font-medium leading-[1.72] text-[#263244] sm:text-[18px]" : "text-[16px] leading-[1.75] text-[#4b5665] sm:text-[17px]";
            p.textContent = part.trim();
            outer.appendChild(p);
          });
        }
        if (blocks.length) {
          blocks.forEach(function (block, blockIndex) {
            var section = doc.createElement("div");
            section.setAttribute("data-cms-product-block", String(blockIndex));
            section.className = "space-y-3";
            if (!block || typeof block !== "object") return;
            var heading = block.title || (block.kind === "heading" ? block.text : "");
            if (heading) {
              var h = doc.createElement("h2");
              h.className = "text-[19px] font-semibold leading-tight text-[#172033] sm:text-[21px]";
              h.textContent = heading;
              h.setAttribute("data-cms-block-part", "title");
              section.appendChild(h);
            }
            if (block.kind !== "heading" && block.text) {
              var before = outer.childNodes.length;
              paragraph(block.text, block.kind === "intro");
              while (outer.childNodes.length > before) {
                var p = outer.childNodes[before];
                p.setAttribute("data-cms-block-part", "text");
                section.appendChild(p);
              }
            }
            if (Array.isArray(block.items) && block.items.length) {
              var ul = doc.createElement("ul");
              ul.className = "space-y-2 pl-5";
              block.items.forEach(function (item) {
                var li = doc.createElement("li");
                li.className = "list-disc text-[16px] leading-[1.7] text-[#4b5665] sm:text-[17px]";
                li.textContent = typeof item === "string" ? item : String(item || "");
                ul.appendChild(li);
              });
              ul.setAttribute("data-cms-block-part", "items");
              section.appendChild(ul);
            }
            outer.appendChild(section);
          });
        } else {
          paragraph(values.description || "", false);
        }
        description.replaceChildren(outer);
        if (this.activeField === 'descriptionBlocks') {
          var info = this.activeBlock;
          var selected = info && info.index >= 0 && outer.querySelector('[data-cms-product-block="' + info.index + '"]');
          var marked = selected && (selected.querySelector('[data-cms-block-part="' + info.part + '"]') || selected);
          if (marked) {
            marked.setAttribute('data-cms-preview-highlight', '1');
            marked.style.outline = '3px solid #3b82f6';
            marked.style.outlineOffset = '4px';
          }
        }
      }
    }
    this.applyModelDraft(values);
  };

  ProductPreview.prototype.targets = function (field) {
    var doc = this.document();
    if (!doc) return [];
    var main = doc.querySelector("main");
    if (!main) return [];
    var right = main.querySelector("section.grid > div:nth-child(2)") || main;
    var selectors = {
      name: "h1", title: "h1", cardLabel: "p", description: "div.mt-7", descriptionBlocks: "div.mt-7",
      models: "#modeli", images: "section.grid > div:first-child", gallery: "section.grid > div:first-child"
    };
    var selector = selectors[field];
    if (!selector) return [];
    var target = (field === "images" || field === "gallery" || field === "models") ? main.querySelector(selector) : right.querySelector(selector);
    return target ? [target] : [];
  };

  // Resolve Decap's nested list controls by their actual editor structure.
  // Decap does not put data-field-name on the nested controls in this editor.
  // Identify a model from its enclosing Decap sortable item, rather than
  // treating its nested "name" or "description" as a top-level product field.
  ProductPreview.prototype.modelContext = function (target) {
    var models = this.values().models;
    if (!Array.isArray(models) || !target || !target.closest) return null;
    var control = target.closest('input, textarea, select, [contenteditable="true"]') || target;
    var itemSelector = '[class*="ListItem-listControlItem"], [class*="ListItem-listItem"], [data-testid="list-item"]';
    var ancestors = [];
    for (var node = control.parentElement; node; node = node.parentElement) {
      if (node.matches && node.matches(itemSelector)) ancestors.push(node);
    }
    var modelIndex = -1, modelItem = null;
    ancestors.forEach(function (item) {
      if (modelIndex >= 0) return;
      // A model item contains its name input; nested description sections do not.
      var inputs = Array.from(item.querySelectorAll('input[type="text"], input:not([type]), textarea'));
      for (var i = 0; i < models.length; i++) {
        if (!models[i] || !models[i].name) continue;
        if (inputs.some(function (input) { return input.value && input.value.trim() === String(models[i].name).trim(); })) {
          modelIndex = i;
          modelItem = item;
          break;
        }
      }
    });
    if (modelIndex < 0) return null;
    var model = models[modelIndex] || {};
    var field = control.closest('[aria-label$=" field"]');
    var fieldLabel = field && field.getAttribute('aria-label');
    var value = typeof control.value === 'string' ? control.value.trim() : '';
    var blockIndex = -1, part = '';
    var blocks = Array.isArray(model.descriptionBlocks) ? model.descriptionBlocks : [];
    // First resolve the nested description block, if present.
    for (var j = 0; j < blocks.length; j++) {
      var block = blocks[j] || {};
      if (value && fieldLabel === 'text field' && String(block.text || '').trim() === value) { blockIndex=j;part='text';break; }
      if (value && fieldLabel === 'string field' && String(block.title || '').trim() === value) { blockIndex=j;part='title';break; }
      if (value && Array.isArray(block.items) && block.items.some(function (v) { return String(v).trim() === value; })) { blockIndex=j;part='items';break; }
    }
    var fieldName = '';
    // Identify top-level model fields by the actual input values and DOM position.
    if (blockIndex < 0) {
      var keys = ['name','description','height','width','depth','innerHeight','innerWidth','innerDepth','weight','volume','resistance'];
      for (var k=0;k<keys.length;k++) {
        if (value && String(model[keys[k]] || '').trim() === value) { fieldName=keys[k];break; }
      }
      if (!fieldName && fieldLabel === 'image field') fieldName='image';
      if (!fieldName && fieldLabel === 'text field') fieldName='description';
    }
    return {index:modelIndex, item:modelItem, field:fieldName, blockIndex:blockIndex, part:part};
  };

  ProductPreview.prototype.modelDescriptionRoot = function () {
    var doc = this.document();
    var section = doc && doc.querySelector('#modeli');
    if (!section) return null;
    var grid = section.querySelector('.mt-7.grid');
    return grid && grid.lastElementChild && grid.lastElementChild.querySelector('.mt-5.break-words');
  };

  ProductPreview.prototype.selectModel = function (index) {
    var doc = this.document();
    var section = doc && doc.querySelector('#modeli');
    var group = section && section.querySelector('[role="group"]');
    var buttons = group && group.querySelectorAll('button');
    if (!buttons || !buttons[index]) return;
    if (buttons[index].getAttribute('aria-pressed') !== 'true') buttons[index].click();
  };

  ProductPreview.prototype.applyModelDraft = function (values) {
    if (!this.activeModel || !Array.isArray(values.models)) return;
    var model = values.models[this.activeModel.index];
    var root = this.modelDescriptionRoot();
    if (!model || !root) return;
    var section = root.closest('#modeli');
    var buttons = section && section.querySelectorAll('[role="group"] button');
    if (!buttons || !buttons[this.activeModel.index] || buttons[this.activeModel.index].getAttribute('aria-pressed') !== 'true') return;
    var signature = JSON.stringify([this.activeModel.index, model.description, model.descriptionBlocks]);
    if (root.dataset.cmsModelSignature === signature) return;
    root.dataset.cmsModelSignature = signature;
    var blocks = Array.isArray(model.descriptionBlocks) ? model.descriptionBlocks : [];
    // Preserve existing public styling: only replace the preview's description content.
    var wrapper = root.ownerDocument.createElement('div');
    wrapper.className = blocks.length ? 'space-y-6 sm:space-y-7' : 'whitespace-pre-line text-sm leading-7 text-black/65';
    if (!blocks.length) wrapper.textContent = model.description || '';
    blocks.forEach(function (block, i) {
      var node = root.ownerDocument.createElement('div');
      node.className = 'space-y-3';
      node.setAttribute('data-cms-model-block',String(i));
      if (block.title || (block.kind === 'heading' && block.text)) {
        var h = root.ownerDocument.createElement('h3');
        h.className = 'text-[19px] font-semibold leading-tight text-[#172033] sm:text-[21px]';
        h.textContent = block.title || block.text;
        h.setAttribute('data-cms-model-part','title');node.appendChild(h);
      }
      if (block.kind !== 'heading' && block.text) {
        String(block.text).split(/\n\s*\n/).forEach(function (part) {
          if (!part.trim()) return;
          var p = root.ownerDocument.createElement('p');
          p.className = 'text-[16px] leading-[1.75] text-[#4b5665] sm:text-[17px]';
          p.textContent = part.trim();p.setAttribute('data-cms-model-part','text');node.appendChild(p);
        });
      }
      if (Array.isArray(block.items) && block.items.length) {
        var ul = root.ownerDocument.createElement('ul');ul.className='space-y-2 pl-5';
        ul.setAttribute('data-cms-model-part','items');
        block.items.forEach(function (item) {var li=root.ownerDocument.createElement('li');li.className='list-disc text-[16px] leading-[1.7] text-[#4b5665] sm:text-[17px]';li.textContent=String(item);ul.appendChild(li);});
        node.appendChild(ul);
      }
      wrapper.appendChild(node);
    });
    root.replaceChildren(wrapper);
  };

  ProductPreview.prototype.findField = function (target) {
    this.activeBlock = null;
    this.activeModel = this.modelContext(target);
    if (this.activeModel) return 'models';
    if (!target || !target.closest) return HomepagePreview.prototype.findField.call(this, target);
    var values = this.values();
    var blocks = Array.isArray(values.descriptionBlocks) ? values.descriptionBlocks : [];
    var control = target.closest('input, textarea, select, [contenteditable="true"]') || target;
    var fieldContainer = control.closest('[aria-label$=" field"]');
    var fieldType = fieldContainer && fieldContainer.getAttribute('aria-label');
    var typed = typeof control.value === 'string' ? control.value.trim() :
      (control.isContentEditable ? (control.textContent || '').trim() : '');
    var item = control.closest('[class*="ListItem-listControlItem"], [class*="ListItem-listItem"], [data-testid="list-item"]');
    // A nested items list may introduce another list item. Select the enclosing
    // description block by checking which list item contains kind/title/text.
    var outerItem = null;
    for (var ancestor = item; ancestor; ancestor = ancestor.parentElement && ancestor.parentElement.closest('[class*="ListItem-listControlItem"], [class*="ListItem-listItem"], [data-testid="list-item"]')) {
      var fields = ancestor.querySelectorAll('[aria-label="select field"], [aria-label="text field"], [aria-label="string field"]');
      if (fields.length >= 3) outerItem = ancestor;
    }
    var part = '';
    if (outerItem) {
      var directFields = Array.from(outerItem.querySelectorAll('[aria-label="select field"], [aria-label="string field"], [aria-label="text field"], [aria-label="list field"]'))
        .filter(function (node) { return !node.parentElement.closest('[aria-label="list field"]'); });
      var controlField = fieldContainer;
      var position = directFields.indexOf(controlField);
      if (position === 0) part = 'kind';
      else if (position === 1) part = 'title';
      else if (position === 2) part = 'text';
      else if (position >= 3) part = 'items';
    }
    // Textareas in description blocks are unique to the nested 'text' field.
    // Match the saved draft value first; this also works when Decap omits list metadata.
    var candidates = [];
    blocks.forEach(function (block, index) {
      if (!block) return;
      if (typed && String(block.text || '').trim() === typed && fieldType === 'text field') candidates.push({index:index, part:'text'});
      if (typed && String(block.title || '').trim() === typed && fieldType === 'string field') candidates.push({index:index, part:'title'});
      if (typed && Array.isArray(block.items) && block.items.some(function (v) {return String(v).trim() === typed;})) candidates.push({index:index, part:'items'});
    });
    var index = -1;
    if (outerItem) {
      // The surrounding Decap sortable list gives us the actual block order.
      var parent = outerItem.parentElement;
      if (parent) {
        var peers = Array.from(parent.children).filter(function (node) {
          return node.matches('[class*="ListItem-listControlItem"], [class*="ListItem-listItem"], [data-testid="list-item"]');
        });
        var ordinal = peers.indexOf(outerItem);
        if (ordinal >= 0 && ordinal < blocks.length) index = ordinal;
      }
    }
    if (index < 0 && candidates.length === 1) {
      index = candidates[0].index;
      part = candidates[0].part;
    }
    // An exact match is more reliable than an unverified DOM position.
    if (index >= 0 && candidates.length && !candidates.some(function (c) {return c.index === index;})) {
      if (candidates.length === 1) index = candidates[0].index;
    }
    if (index >= 0 || candidates.length) {
      if (!part) part = candidates.length ? candidates[0].part : 'text';
      this.activeBlock = {index:index, part:part};
      return 'descriptionBlocks';
    }
    // If the editor is inside the description list but no block can be
    // resolved, highlight its container, NEVER the product's h1.
    var labels = [];
    for (var node = control; node && node.nodeType === 1; node = node.parentElement) {
      if (node.getAttribute && node.getAttribute('data-field-name')) labels.push(node.getAttribute('data-field-name'));
    }
    if (labels.indexOf('descriptionBlocks') !== -1 || (outerItem && blocks.length)) {
      this.activeBlock = {index:-1, part:part || 'text'};
      return 'descriptionBlocks';
    }
    return HomepagePreview.prototype.findField.call(this, target);
  };

  ProductPreview.prototype.highlight = function (field) {
    var doc = this.document();
    if (!doc) return;
    doc.querySelectorAll("[data-cms-preview-highlight]").forEach(function (node) {
      node.style.outline = "";
      node.style.outlineOffset = "";
      node.removeAttribute("data-cms-preview-highlight");
    });
    if (!field) return;
    if (field === 'models' && this.activeModel) {
      var self = this;
      var context = this.activeModel;
      this.selectModel(context.index);
      function markModel() {
        var doc = self.document();
        if (!doc || self.activeModel !== context) return;
        self.applyModelDraft(self.values());
        doc.querySelectorAll('[data-cms-preview-highlight]').forEach(function (node) {
          node.style.outline='';node.style.outlineOffset='';node.removeAttribute('data-cms-preview-highlight');
        });
        var section = doc.querySelector('#modeli');
        if (!section) return;
        var target = null;
        var root = self.modelDescriptionRoot();
        if (context.blockIndex >= 0 && root) {
          var block = root.querySelector('[data-cms-model-block="' + context.blockIndex + '"]');
          target = block && (block.querySelector('[data-cms-model-part="' + context.part + '"]') || block);
        } else if (context.field === 'description') target = root;
        else if (context.field === 'name') target = section.querySelector('.mt-7.grid h3');
        else if (context.field === 'image') target = section.querySelector('.mt-7.grid img');
        else if (context.field) target = section.querySelector('.mt-7.grid > div:last-child');
        if (!target) target = section;
        target.setAttribute('data-cms-preview-highlight','1');
        target.style.outline='3px solid #3b82f6';target.style.outlineOffset='4px';
        target.scrollIntoView({behavior:'smooth',block:'center'});
      }
      markModel();
      setTimeout(markModel, 120);
      return;
    }
    var targets = this.targets(field);
    if (field === "descriptionBlocks" && this.activeBlock) {
      var info = this.activeBlock;
      var root = targets[0];
      if (root && info.index >= 0) {
        var block = root.querySelector('[data-cms-product-block="' + info.index + '"]');
        if (block) {
          var specific = block.querySelector('[data-cms-block-part="' + info.part + '"]');
          targets = [specific || block];
        }
      }
      // Never redirect a nested description field to the product title.
    }
    targets.forEach(function (node) {
      node.setAttribute("data-cms-preview-highlight", "1");
      node.style.outline = "3px solid #3b82f6";
      node.style.outlineOffset = "4px";
    });
    if (targets[0]) targets[0].scrollIntoView({behavior:"smooth",block:"center"});
  };

  ProductPreview.prototype.render = function () {
    var values = this.values();
    var slug = String(values.urlSlug || "").trim();
    var url = slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
      ? (window.TETRAEDAR_CMS_LANGUAGE === "en" ? "/en/produkti/" : "/produkti/") + encodeURIComponent(slug) + "/?cms_preview=1"
      : "";
    return element("div", {
      style: {height:"100%",minHeight:"80vh",display:"flex",flexDirection:"column",background:"#f5f5f5"},
      children: [
        previewToolbar(this, "Продукт - преглед на реалната страница"),
        url ? previewViewport(this, url, "Продукт - преглед на живо") :
          element("div", {style:{padding:"24px",fontSize:"14px"},children:"Въведете URL адрес (Slug), за да видите страницата."})
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
      window.CMS.registerPreviewTemplate(
        "services", ServicesPreview
      );
      window.CMS.registerPreviewTemplate(
        "products", ProductPreview
      );
      window.CMS.registerPreviewTemplate("products_en", ProductPreview);
      return;
    }

    if (++attempts < 300) {
      setTimeout(register, 100);
    }
  }

  register();
})();
