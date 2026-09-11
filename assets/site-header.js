/**
 * Desktop dropdown / mega menu toggle.
 *
 * Deliberately independent of the existing <mobile-menu> custom element
 * (which handles the mobile drawer's open/close via data-menu-trigger /
 * data-menu-panel / data-menu-close) — this file only touches
 * [data-nav-item] / [data-dropdown-toggle], so it can't collide with
 * whatever that element already does.
 *
 * The caret button is a separate control from the nav link on purpose: the
 * link always just navigates, the caret always just toggles. Overloading a
 * single click target to do both ("first click opens, second click
 * navigates") is the kind of ambiguous state that's easy to get subtly
 * wrong across mouse/touch/keyboard — a dedicated button sidesteps it.
 *
 * CSS shows the panel on :hover / :focus-within for mouse and keyboard users
 * with zero JS involved. This script only manages the .is-open class and
 * aria-expanded — needed for touch devices at desktop widths (no :hover)
 * and for correct ARIA state — and closes everything on outside click or
 * Escape.
 */
function closeAllDropdowns() {
  document.querySelectorAll('[data-nav-item].is-open').forEach((item) => {
    item.classList.remove('is-open');
    const toggle = item.querySelector('[data-dropdown-toggle]');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
}

document.querySelectorAll('[data-dropdown-toggle]').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const item = toggle.closest('[data-nav-item]');
    if (!item) return;

    const wasOpen = item.classList.contains('is-open');
    closeAllDropdowns();

    if (!wasOpen) {
      item.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    updateMegaOpenState();
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-nav-item]')) {
    closeAllDropdowns();
    updateMegaOpenState();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeAllDropdowns();
    updateMegaOpenState();
  }
});

/**
 * Adds a class + data attribute to the <header class="site-header"> element
 * for as long as any mega menu is visible — by hover, keyboard focus, OR
 * the click-toggle .is-open state above (the same three conditions that
 * already drive the mega panel's own CSS visibility in mega-menu.liquid).
 *
 * This exists specifically for the transparent homepage header: it needs a
 * stable hook to switch to a solid background while a mega menu is open,
 * the same way it already does via .is-scrolled — see the .site-header--mega-open
 * rule folded into that same selector in header.liquid.
 *
 * Implemented as "re-check on relevant events" rather than tracking open/
 * closed state manually, using :hover / :focus-within as live selectors —
 * one source of truth, can't drift out of sync with what's actually visible.
 */
const megaNavItems = document.querySelectorAll('.site-header__nav-item--mega');

function updateMegaOpenState() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const isOpen = Array.from(megaNavItems).some((item) => (
    item.matches(':hover') || item.matches(':focus-within') || item.classList.contains('is-open')
  ));

  header.classList.toggle('site-header--mega-open', isOpen);

  if (isOpen) {
    header.setAttribute('data-mega-open', 'true');
  } else {
    header.removeAttribute('data-mega-open');
  }
}

megaNavItems.forEach((item) => {
  item.addEventListener('mouseenter', updateMegaOpenState);
  item.addEventListener('mouseleave', updateMegaOpenState);
});

// focusin/focusout bubble (unlike focus/blur), so one pair of delegated
// listeners covers tabbing in and out of every mega panel's links.
document.addEventListener('focusin', updateMegaOpenState);
document.addEventListener('focusout', updateMegaOpenState);