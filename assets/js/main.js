/* gapp.in — vanilla JS: theme toggle, search, hover previews, lightbox */
(function () {
  'use strict';
  var BASE = window.SITE_BASEURL || '';

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ---------- search ---------- */
  var overlay = document.getElementById('search-overlay');
  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var searchBtn = document.getElementById('search-toggle');
  var index = null;
  var selected = -1;

  function openSearch() {
    overlay.hidden = false;
    input.value = '';
    resultsEl.innerHTML = '';
    selected = -1;
    input.focus();
    if (!index) {
      fetch(BASE + '/search.json')
        .then(function (r) { return r.json(); })
        .then(function (data) { index = data; });
    }
  }

  function closeSearch() { overlay.hidden = true; }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && overlay && overlay.hidden &&
        !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape' && overlay && !overlay.hidden) {
      closeSearch();
    }
  });

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function highlight(text, terms) {
    var out = escapeHtml(text);
    terms.forEach(function (t) {
      if (!t) return;
      out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
    });
    return out;
  }

  function runSearch(q) {
    if (!index || q.length < 2) { resultsEl.innerHTML = ''; return; }
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var scored = [];
    for (var i = 0; i < index.length; i++) {
      var item = index[i];
      var title = item.title.toLowerCase();
      var body = item.content.toLowerCase();
      var score = 0;
      var ok = true;
      for (var j = 0; j < terms.length; j++) {
        var t = terms[j];
        if (title.indexOf(t) !== -1) score += title === t ? 30 : (title.indexOf(t) === 0 ? 15 : 10);
        else if (body.indexOf(t) !== -1) score += 2;
        else { ok = false; break; }
      }
      if (ok) scored.push({ item: item, score: score });
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    scored = scored.slice(0, 12);
    selected = -1;

    if (!scored.length) {
      resultsEl.innerHTML = '<li class="empty">no results</li>';
      return;
    }

    resultsEl.innerHTML = scored.map(function (s) {
      var it = s.item;
      var pos = it.content.toLowerCase().indexOf(terms[0]);
      var snippet = pos > -1
        ? (pos > 40 ? '…' : '') + it.content.slice(Math.max(0, pos - 40), pos + 110)
        : it.content.slice(0, 140);
      return '<li><a href="' + BASE + it.url + '">' +
        '<div class="r-title">' + highlight(it.title, terms) + '</div>' +
        '<div class="r-meta">' + escapeHtml(it.type) + '</div>' +
        '<div class="r-snippet">' + highlight(snippet, terms) + '</div>' +
        '</a></li>';
    }).join('');
  }

  if (input) {
    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () { runSearch(input.value.trim()); }, 120);
    });
    input.addEventListener('keydown', function (e) {
      var links = resultsEl.querySelectorAll('a');
      if (!links.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        selected += e.key === 'ArrowDown' ? 1 : -1;
        selected = (selected + links.length) % links.length;
        links.forEach(function (l, i) { l.classList.toggle('selected', i === selected); });
        links[selected].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && selected > -1) {
        e.preventDefault();
        links[selected].click();
      }
    });
  }

  /* ---------- hover preview (300ms delay) ---------- */
  var preview = document.getElementById('hover-preview');
  var hoverTimer = null;
  var cache = {};
  var currentLink = null;
  var isTouch = window.matchMedia('(hover: none)').matches;

  function isInternal(a) {
    if (a.origin !== location.origin) return false;
    var p = a.pathname;
    if (BASE && p.indexOf(BASE) !== 0) return false;
    if (/\.(png|jpe?g|gif|webp|svg|pdf|xml|json|zip|mp4)$/i.test(p)) return false;
    if (a.hasAttribute('data-lightbox') || a.closest('.hover-preview')) return false;
    // only preview links inside the page content, not nav/footer/breadcrumbs
    if (!a.closest('main')) return false;
    if (a.closest('.breadcrumb, .post-nav')) return false;
    return true;
  }

  function extractPreview(html, url) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var main = doc.querySelector('main .prose') || doc.querySelector('main') || doc.body;
    var titleEl = main.querySelector('.page-title') || doc.querySelector('h1') || doc.querySelector('title');
    var title = titleEl ? titleEl.textContent.trim() : url;
    // clone the whole article, minus chrome, so the popup is fully readable
    var frag = main.cloneNode(true);
    frag.querySelectorAll('.breadcrumb, .post-nav, .post-meta, .page-title, header, script').forEach(function (n) {
      n.remove();
    });
    // skip previews with nothing worth showing (bare listing pages etc.)
    if (frag.textContent.trim().length < 60 && !frag.querySelector('img')) return null;
    return '<div class="hp-title">' + escapeHtml(title) + '</div>' + frag.innerHTML;
  }

  function showPreview(a) {
    var url = a.href.split('#')[0];
    if (url === location.href.split('#')[0]) return;

    function render(content) {
      if (content === null) return;
      if (currentLink !== a) return;
      preview.innerHTML = content;
      preview.hidden = false;
      var rect = a.getBoundingClientRect();
      var top = rect.bottom + window.scrollY + 8;
      var left = rect.left + window.scrollX;
      var pw = preview.offsetWidth;
      if (left + pw > window.scrollX + document.documentElement.clientWidth - 12) {
        left = window.scrollX + document.documentElement.clientWidth - pw - 12;
      }
      if (left < 8) left = 8;
      // flip above if not enough space below
      if (rect.bottom + preview.offsetHeight + 16 > window.innerHeight && rect.top > preview.offsetHeight + 16) {
        top = rect.top + window.scrollY - preview.offsetHeight - 8;
      }
      preview.style.top = top + 'px';
      preview.style.left = left + 'px';
    }

    if (cache[url]) { render(cache[url]); return; }
    fetch(url)
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (html) {
        cache[url] = extractPreview(html, url);
        render(cache[url]);
      })
      .catch(function () { /* silently skip */ });
  }

  var hideTimer = null;

  function hidePreview() {
    clearTimeout(hoverTimer);
    clearTimeout(hideTimer);
    currentLink = null;
    if (preview) preview.hidden = true;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hidePreview, 250); // grace period to reach the popup
  }

  if (preview && !isTouch) {
    document.addEventListener('mouseover', function (e) {
      var a = e.target.closest('a');
      if (!a || !isInternal(a)) return;
      clearTimeout(hideTimer);
      currentLink = a;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { showPreview(a); }, 300);
    });
    document.addEventListener('mouseout', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      clearTimeout(hoverTimer);
      scheduleHide();
    });
    preview.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    preview.addEventListener('mouseleave', scheduleHide);
    window.addEventListener('scroll', scheduleHide, { passive: true });
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var items = [];
    var idx = 0;

    function openLb(i) {
      idx = i;
      lbImg.src = items[idx].href;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeLb() {
      lb.hidden = true;
      lbImg.src = '';
      document.body.style.overflow = '';
    }

    function step(d) {
      if (!items.length) return;
      idx = (idx + d + items.length) % items.length;
      lbImg.src = items[idx].href;
    }

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-lightbox]');
      if (!a) return;
      e.preventDefault();
      items = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
      openLb(items.indexOf(a));
    });

    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    // basic swipe support
    var touchX = null;
    lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) step(dx > 0 ? -1 : 1);
      touchX = null;
    }, { passive: true });
  }
})();
