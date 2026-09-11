(function () {
  var READY = 'is-wishlist-ready';
  var WRAP = 'custom-wishlist-button';
  var ADD = '.xb-wishlist__add';
  var REMOVE = '.xb-wishlist__remove';
  var DETECT = 'custom-wishlist-detect';
  var MAX_WAIT = 5000;

  if (!window.MutationObserver || !window.WeakSet) return;

  var watched = new WeakSet();

  function shown(el) {
    if (!el || !el.isConnected) return false;
    var style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function settled(wrap) {
    return shown(wrap.querySelector(ADD)) !== shown(wrap.querySelector(REMOVE));
  }

  function watch(wrap) {
    if (wrap.classList.contains(READY) || watched.has(wrap)) return;

    if (settled(wrap)) {
      wrap.classList.add(READY);
      return;
    }

    watched.add(wrap);

    var observer = new MutationObserver(function () {
      if (settled(wrap)) done();
    });

    var timer = window.setTimeout(function () {
      var remove = wrap.querySelector(REMOVE);
      if (remove && !settled(wrap)) remove.style.display = 'none';
      done();
    }, MAX_WAIT);

    function done() {
      observer.disconnect();
      window.clearTimeout(timer);
      wrap.classList.add(READY);
    }

    observer.observe(wrap, {
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
      childList: true,
      subtree: true
    });
  }

  document.addEventListener(
    'animationstart',
    function (event) {
      if (event.animationName !== DETECT) return;

      var wrap = event.target;
      if (wrap && wrap.classList && wrap.classList.contains(WRAP)) watch(wrap);
    },
    true
  );

  function scan() {
    var list = document.querySelectorAll('.' + WRAP + ':not(.' + READY + ')');
    for (var i = 0; i < list.length; i++) watch(list[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan, { once: true });
  } else {
    scan();
  }
})();
