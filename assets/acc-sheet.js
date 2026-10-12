/**
 * acc-sheet.js
 * Product quick-view sheet for the Diamond WITB section.
 * Exposed as window.openAccSheet(handle, tileEl).
 */
(function () {
  'use strict';

  if (typeof window.openAccSheet === 'function') return;

  const sid = window.__witbSectionId;
  if (!sid) return;

  const sheet    = document.getElementById(sid + '-Sheet');
  const shGal    = document.getElementById(sid + '-SheetGal');
  const shMedia  = document.getElementById(sid + '-SheetMedia');
  const shDots   = document.getElementById(sid + '-SheetDots');
  const shFits   = document.getElementById(sid + '-SheetFits');
  const shTitle  = document.getElementById(sid + '-SheetTitle');
  const shLead   = document.getElementById(sid + '-SheetLead');
  const shWhat   = document.getElementById(sid + '-SheetWhat');
  const shWhy    = document.getElementById(sid + '-SheetWhy');
  const shHow    = document.getElementById(sid + '-SheetHow');
  const shOpts   = document.getElementById(sid + '-SheetOpts');
  const shPrice  = document.getElementById(sid + '-SheetPrice');
  const shAtc    = document.getElementById(sid + '-SheetAtc');
  const shFull   = document.getElementById(sid + '-SheetFull');
  const shClose  = document.getElementById(sid + '-SheetClose');

  if (!sheet || !shClose) return;

  let currentVariantId = null;
  let lastFocus = null;

  function formatMoney(cents) {
    const dollars = cents / 100;
    return '$' + (Number.isInteger(dollars) ? dollars : dollars.toFixed(2));
  }

  function setGallery(images) {
    const n = Math.min(images.length, 4);
    shMedia.dataset.n = n || 1;
    shGal.innerHTML = images.slice(0, 4).map((url, k) =>
      `<img src="${url}" alt="${k === 0 ? shTitle.textContent : ''}" loading="lazy">`
    ).join('');
    shDots.innerHTML = images.slice(0, 4).map((_, k) =>
      `<i class="${k === 0 ? 'is-on' : ''}"></i>`
    ).join('');
    shGal.scrollLeft = 0;
  }

  async function openAccSheet(handle, tileEl) {
    if (!sheet) return;
    lastFocus = tileEl instanceof Element ? tileEl : document.activeElement;

    /* Load tile text from data attributes immediately */
    if (tileEl instanceof Element) {
      shLead.textContent = tileEl.dataset.sub  || '';
      shWhat.textContent = tileEl.dataset.what || '';
      shWhy.textContent  = tileEl.dataset.why  || '';
      shHow.textContent  = tileEl.dataset.how  || '';
    }

    /* Show sheet with loading state */
    shTitle.textContent = '…';
    shFits.textContent  = '';
    shGal.innerHTML     = '';
    shDots.innerHTML    = '';
    shOpts.innerHTML    = '';
    shPrice.textContent = '';
    shAtc.disabled      = true;
    shAtc.textContent   = '…';
    shMedia.dataset.n   = 1;

    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('is-on'));
    document.body.style.overflow = 'hidden';
    shClose.focus();

    try {
      const res     = await fetch('/products/' + encodeURIComponent(handle) + '.js');
      const product = await res.json();

      /* Images */
      const imgs = (product.images || []).filter(Boolean);
      if (imgs.length > 0) {
        setGallery(imgs);
        shTitle.textContent = product.title;
      } else {
        shMedia.dataset.n = 1;
        shGal.innerHTML = '<span style="display:grid;place-items:center;width:100%;height:100%;color:#c8b89a"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#f0ede8"/><path d="M24 16 L30 24 L24 32 M24 16 L18 24 L24 32" stroke="#c8b89a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
        shTitle.textContent = product.title;
      }

      shFits.textContent = 'Fits Diamond';

      /* Variants */
      const variants = product.variants || [];
      currentVariantId = variants.length > 0 ? variants[0].id : null;

      if (currentVariantId) {
        shPrice.textContent = formatMoney(variants[0].price);
        const isAvailable = variants[0].available !== false;
        shAtc.disabled    = !isAvailable;
        shAtc.textContent = isAvailable ? 'Add to cart' : 'Out of stock';
      } else {
        shAtc.textContent = 'Add to cart';
        shAtc.disabled    = false;
      }

      /* Variant pills (if multiple) */
      if (variants.length > 1) {
        shOpts.innerHTML = variants.map((v, i) => {
          const label = v.title === 'Default Title' ? v.option1 : v.title;
          return `<button class="d-witb-sheet__opt${i === 0 ? ' is-on' : ''}" type="button" data-vid="${v.id}" data-price="${v.price}" data-avail="${v.available !== false}">${label}</button>`;
        }).join('');
      }

      /* Full details link */
      if (shFull) shFull.href = '/products/' + encodeURIComponent(handle);

    } catch (_) {
      shTitle.textContent = 'Could not load product';
      shAtc.textContent   = 'Add to cart';
      shAtc.disabled      = false;
    }
  }

  function closeSheet() {
    sheet.classList.remove('is-on');
    sheet.addEventListener('transitionend', () => {
      sheet.hidden = true;
    }, { once: true });
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  /* ── Variant selection ── */
  shOpts.addEventListener('click', function (e) {
    const btn = e.target.closest('.d-witb-sheet__opt');
    if (!btn) return;
    for (const b of shOpts.querySelectorAll('.d-witb-sheet__opt')) b.classList.remove('is-on');
    btn.classList.add('is-on');
    currentVariantId      = parseInt(btn.dataset.vid, 10);
    shPrice.textContent   = formatMoney(parseInt(btn.dataset.price, 10));
    const avail           = btn.dataset.avail !== 'false';
    shAtc.disabled        = !avail;
    shAtc.textContent     = avail ? 'Add to cart' : 'Out of stock';
  });

  /* ── Add to cart ── */
  shAtc.addEventListener('click', async function () {
    if (shAtc.disabled) return;
    if (!currentVariantId) return;
    shAtc.classList.add('is-loading');
    shAtc.disabled = true;
    try {
      const res  = await fetch('/cart/add.js', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: currentVariantId, quantity: 1 })
      });
      const item = await res.json();
      if (item.id) {
        document.dispatchEvent(new CustomEvent('cart:add', { detail: { item } }));
        closeSheet();
      } else {
        shAtc.textContent = 'Error — try again';
        shAtc.disabled    = false;
      }
    } catch (_) {
      shAtc.textContent = 'Error — try again';
      shAtc.disabled    = false;
    } finally {
      shAtc.classList.remove('is-loading');
    }
  });

  /* ── Gallery navigation ── */
  shMedia.querySelector('.d-witb-sheet__arr--l').addEventListener('click', () => {
    shGal.scrollBy({ left: -shGal.clientWidth, behavior: 'smooth' });
  });
  shMedia.querySelector('.d-witb-sheet__arr--r').addEventListener('click', () => {
    shGal.scrollBy({ left: shGal.clientWidth, behavior: 'smooth' });
  });
  shGal.addEventListener('scroll', function () {
    const k = Math.round(shGal.scrollLeft / (shGal.clientWidth || 1));
    for (const [j, dot] of [...shDots.children].entries()) {
      dot.classList.toggle('is-on', j === k);
    }
  });

  /* ── Close ── */
  shClose.addEventListener('click', closeSheet);
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !sheet.hidden) closeSheet();
  });

  window.openAccSheet = openAccSheet;
})();
