
/* TETRAEDAR - live homepage bridge. */
(function () {
  'use strict';

  if (
    new URLSearchParams(location.search).get('cms_preview') !== '1' ||
    window.parent === window
  ) return;

  var selected = [];

  var fields = function (key) {
    return Array.from(
      document.querySelectorAll(
        '[data-cms-field="' +
        String(key).replace(/[^a-zA-Z0-9_]/g, '') +
        '"]'
      )
    );
  };

  function imageURL(url) {
    if (typeof url !== 'string' || !url.trim()) return '';

    if (/^(https?:\/\/|blob:|data:image\/|\/)/i.test(url)) {
      return url;
    }

    return '/' + url.replace(/^\/+/, '');
  }

  function partnersUpdate(items) {
    if (!Array.isArray(items)) return;

    fields('partners').forEach(function (marquee) {
      var track = marquee.querySelector('.partners-track');
      if (!track) return;

      track.replaceChildren();

      for (var repeat = 0; repeat < 4; repeat++) {
        items.forEach(function (partner) {
          if (!partner) return;

          var item = document.createElement('div');
          item.className =
            'partner-item flex h-28 w-64 shrink-0 items-center justify-center px-8';

          var inner = document.createElement('div');
          inner.className =
            'flex h-full w-full items-center justify-center rounded-2xl border border-black/10 bg-white';

          var target = partner.url
            ? document.createElement('a')
            : document.createElement('div');

          if (partner.url) {
            target.href = partner.url;
          }

          target.className =
            'flex h-full w-full items-center justify-center';

          if (partner.image) {
            var img = document.createElement('img');

            img.src = imageURL(partner.image);
            img.alt = partner.name || '';
            img.className = 'h-16 w-40 object-contain';

            target.appendChild(img);
          } else {
            var name = document.createElement('span');

            name.className =
              'text-lg font-medium tracking-tight text-black/40';

            name.textContent = partner.name || '';
            target.appendChild(name);
          }

          inner.appendChild(target);
          item.appendChild(inner);
          track.appendChild(item);
        });
      }
    });
  }

  function update(values) {
    if (!values || typeof values !== 'object') return;

    Object.keys(values).forEach(function (key) {
      var value = values[key];

      if (key === 'partners') {
        partnersUpdate(value);
        return;
      }

      fields(key).forEach(function (el) {
        if (key === 'heroBackground') {
          el.style.backgroundImage = value
            ? 'url(' + JSON.stringify(imageURL(value)) + ')'
            : 'none';
        } else if (key === 'heroTitle') {
          el.textContent = String(value == null ? '' : value);
          el.style.whiteSpace = 'pre-line';
        } else if (
          typeof value === 'string' ||
          typeof value === 'number'
        ) {
          el.textContent = String(value);
        }
      });

      var linkTarget = {
        primaryLink: 'primaryButton',
        secondaryLink: 'secondaryButton',
        contactLink: 'contactButton'
      }[key];

      if (linkTarget) {
        fields(linkTarget).forEach(function (el) {
          var anchor = el.closest('a');

          if (anchor) {
            anchor.setAttribute('href', String(value || '#'));
          }
        });
      }
    });
  }

  function highlight(key) {
    selected.forEach(function (el) {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });

    selected = key ? fields(key) : [];

    selected.forEach(function (el) {
      el.style.outline = '3px solid #3b82f6';
      el.style.outlineOffset = '5px';
    });

    var visible = selected.find(function (el) {
      var rect = el.getBoundingClientRect();

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        getComputedStyle(el).visibility !== 'hidden'
      );
    });

    if (visible) {
      visible.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  window.addEventListener('message', function (event) {
    if (
      event.origin !== location.origin ||
      event.source !== window.parent ||
      !event.data ||
      event.data.source !== 'tetraedar-cms'
    ) return;

    if (event.data.type === 'update') {
      update(event.data.values);
    }

    if (event.data.type === 'focus') {
      highlight(event.data.field);
    }
  });

  // Prevent navigating away from the homepage preview.
  document.addEventListener('click', function (event) {
    var link = event.target.closest &&
      event.target.closest('a[href]');

    if (link) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  document.addEventListener('submit', function (event) {
    event.preventDefault();
  }, true);

  window.parent.postMessage(
    { source: 'tetraedar-preview', type: 'ready' },
    location.origin
  );
})();
