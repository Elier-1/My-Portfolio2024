/* ==========================================================================
   Miguel Valtierra — Portfolio interactions
   1. Turn on motion (adds .js to <html>)
   2. Split headline text into words that rise in
   3. Reveal elements as they scroll into view
   4. Navbar border on scroll
   5. Home: tint the page with each project's color on hover
   6. Footer year
   Everything respects "prefers-reduced-motion".
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* 2. Split text ---------------------------------------------------------- */
  function splitWords(el) {
    var i = 0;
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            var wi = document.createElement('span');
            w.className = 'w'; wi.className = 'wi';
            wi.style.setProperty('--i', i++);
            wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
  }
  var splits = document.querySelectorAll('[data-split]');
  splits.forEach(splitWords);

  /* 3. Reveal on scroll ---------------------------------------------------- */
  var targets = document.querySelectorAll('.reveal, [data-split]');
  var show = function (el) { el.classList.add('in'); };

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
    // Safety net: anything already on screen after load is shown.
    window.addEventListener('load', function () {
      targets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show(el);
      });
    });
  }

  /* 4. Navbar -------------------------------------------------------------- */
  var nav = document.querySelector('.site-nav');
  var onScroll = function () { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 5. Home: tint page with the hovered project's ground color ------------ */
  var base = getComputedStyle(document.body).getPropertyValue('--c60');
  document.querySelectorAll('[data-tint]').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      document.body.style.backgroundColor = card.getAttribute('data-tint');
    });
    card.addEventListener('mouseleave', function () {
      document.body.style.backgroundColor = '';
    });
  });

  /* 6. Footer year --------------------------------------------------------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
