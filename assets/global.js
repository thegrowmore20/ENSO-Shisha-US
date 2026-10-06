/*
  Scroll progress bar — a thin fixed strip whose width tracks how far down
  the page the visitor has scrolled (0% at the top, 100% at the bottom).
*/
(() => {
  const bar = document.querySelector('[data-scroll-progress]');
  if (!bar) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();

/*
  Animated slideDown/slideUp for the product page's accordions
  (`.accordion` — Description/Specs/etc — and `.product-collapse`).
  Native <details> snaps open/closed instantly; this intercepts the click
  on <summary> and drives an actual height transition instead, so the page
  doesn't visibly jump. The content element is just "whatever comes right
  after <summary>", so this works with either markup without needing a
  shared class name.
*/
// (() => {
//   const ANIMATED_SELECTOR = 'details.accordion, details.product-collapse';
//   const DURATION = 250;

//   document.querySelectorAll(ANIMATED_SELECTOR).forEach((details) => {
//     const summary = details.querySelector(':scope > summary');
//     const content = summary?.nextElementSibling;
//     if (!summary || !content) return;

//     let animation = null;

//     const animate = (keyframes) => {
//       animation?.cancel();
//       animation = content.animate(keyframes, { duration: DURATION, easing: 'ease' });
//       return animation;
//     };

//     summary.addEventListener('click', (event) => {
//       event.preventDefault();
//       if (animation && animation.playState === 'running') return;

//       content.style.overflow = 'hidden';

//       if (details.open) {
//         // slideUp, then actually close once the collapse finishes
//         const startHeight = content.offsetHeight;
//         animate([{ height: startHeight + 'px' }, { height: '0px' }]).onfinish = () => {
//           details.open = false;
//           content.style.height = '';
//           content.style.overflow = '';
//         };
//       } else {
//         // Content must be open (and thus visible/measurable) before we can
//         // read its natural height, so open first, measure, then animate.
//         details.open = true;
//         const endHeight = content.offsetHeight;
//         content.style.height = '0px';
//         animate([{ height: '0px' }, { height: endHeight + 'px' }]).onfinish = () => {
//           content.style.height = '';
//           content.style.overflow = '';
//         };
//       }
//     });
//   });
// })();

/*
  Product page accordions — details.accordion / details.product-collapse
  REPLACES the previous slideDown/slideUp script entirely (delete the old one).

  WHY THE GALLERY WAS MOVING
  1. <details name="…"> makes the browser close the other open panel itself —
     instantly, no animation. The section loses that height in one frame and
     everything tied to it snaps, including the sticky gallery.
  2. A sticky element can't travel past the end of its container
     (.product-main__inner). When that end is near the screen, the gallery is
     resting on it: shrink the section and the gallery is dragged up, grow it
     and the gallery slides back down. That's how position: sticky works —
     no CSS rule changes it, which is why the CSS-only fixes did nothing.

  WHAT THIS DOES
  - Animates open AND close (height, padding, margin — nothing left to snap).
  - Runs one-open-at-a-time itself, animated, instead of the `name` attribute
    (no Liquid change needed — it takes the attribute over on first click).
  - While a panel moves, the section is never allowed to end above the
    gallery's bottom edge, and a gallery already resting on the section end is
    held where it is. Both holds release on scroll, only where that's invisible.
  - When a panel ABOVE the clicked one closes, the page scrolls so the clicked
    header stays under the cursor (skipped if that would move the gallery).
  - Respects prefers-reduced-motion. Scroll work only runs while a hold is active.
  - Delegated click listener, so it survives theme-editor section re-renders.
*/
(() => {
  const SELECTOR = 'details.accordion, details.product-collapse';
  const EASING = 'ease';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = () => (reducedMotion.matches ? 0 : 250);
  const CLOSED = { height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px' };

  let busy = false;
  const locks = new WeakMap(); // .product-main__inner -> lock state
  const pending = new Set();   // locks still waiting to release on scroll

  /* ---------------- Panels ---------------- */

  const panelOf = (details) => details.querySelector(':scope > summary')?.nextElementSibling || null;

  const boxOf = (el) => {
    const cs = getComputedStyle(el);
    return {
      height: cs.height,
      paddingTop: cs.paddingTop,
      paddingBottom: cs.paddingBottom,
      marginTop: cs.marginTop,
      marginBottom: cs.marginBottom,
    };
  };

  const openPanel = (details, panel) => {
    details.open = true; // must be open before it can be measured
    panel.style.overflow = 'hidden';
    const anim = panel.animate([CLOSED, boxOf(panel)], { duration: duration(), easing: EASING });
    return anim.finished.catch(() => {}).then(() => {
      panel.style.overflow = '';
    });
  };

  const closePanel = (details, panel) => {
    details.classList.add('is-closing');
    panel.style.overflow = 'hidden';
    const anim = panel.animate([boxOf(panel), CLOSED], { duration: duration(), easing: EASING, fill: 'forwards' });
    return anim.finished.catch(() => {}).then(() => {
      details.open = false;
      details.classList.remove('is-closing');
      anim.cancel(); // drop the held last frame now that the panel is really closed
      panel.style.overflow = '';
    });
  };

  // Take over from <details name="…"> — the browser's own exclusive mode closes
  // the other panel instantly, which is the snap we're removing.
  const groupOf = (details) => {
    const name = details.getAttribute('name');
    if (name) {
      document.querySelectorAll('details[name]').forEach((d) => {
        if (d.getAttribute('name') !== name) return;
        d.dataset.accordionGroup = name;
        d.removeAttribute('name');
      });
    }
    return details.dataset.accordionGroup || '';
  };

  const openSiblings = (details, group) =>
    group
      ? [...document.querySelectorAll('details[open]')].filter(
          (d) => d !== details && d.dataset.accordionGroup === group && d.matches(SELECTOR)
        )
      : [];

  /* ---------------- Sticky gallery lock ---------------- */

  const lockFor = (details) => {
    const inner = details.closest('.product-main__inner');
    const media = inner?.querySelector(':scope > .product-main__media');
    const info = inner?.querySelector(':scope > .product-main__content');
    // Mobile / sticky setting off → nothing to protect
    if (!media || !info || getComputedStyle(media).position !== 'sticky') return null;

    let lock = locks.get(inner);
    if (!lock) {
      lock = { inner, media, info, baseTop: 0, frozenTop: null, startHold: 0, lastY: window.scrollY };
      locks.set(inner, lock);
    }
    return lock;
  };

  // The section must not end above the gallery's bottom edge, or the gallery gets pushed.
  const holdFloor = (lock) => {
    const need = lock.media.getBoundingClientRect().bottom - lock.inner.getBoundingClientRect().top;
    lock.inner.style.minHeight = `${Math.max(need, lock.startHold)}px`;
  };

  // Undo the holds only as far as it's invisible. Returns true while anything is still held.
  const release = (lock) => {
    const { inner, media, info } = lock;
    if (!inner.isConnected) return false;

    const innerRect = inner.getBoundingClientRect();
    const y = window.scrollY;

    if (lock.frozenTop !== null) {
      const dy = y - lock.lastY;
      // Scrolling up: let the gallery ride back down with the page until it's at its normal offset
      if (dy < 0) lock.frozenTop = Math.min(lock.baseTop, lock.frozenTop - dy);

      const height = media.getBoundingClientRect().height;
      const backToNormal = lock.frozenTop >= lock.baseTop - 0.5;
      const notStuck = innerRect.top >= lock.baseTop - 0.5;
      const endPushing = innerRect.bottom - height <= lock.frozenTop + 0.5;

      if (backToNormal || notStuck || endPushing) {
        lock.frozenTop = null;
        media.style.top = '';
      } else {
        media.style.top = `${lock.frozenTop}px`;
      }
    }

    if (inner.style.minHeight) {
      const held = parseFloat(inner.style.minHeight);
      const natural = Math.max(media.offsetHeight, info.offsetHeight);

      if (natural >= held - 0.5) {
        inner.style.minHeight = '';
      } else {
        // Only trim what's below the fold and below the gallery — nothing on screen moves
        const keep = Math.max(
          natural,
          window.innerHeight - innerRect.top,
          media.getBoundingClientRect().bottom - innerRect.top
        );
        if (keep < held - 0.5) inner.style.minHeight = `${keep}px`;
      }
    }

    lock.lastY = y;
    return lock.frozenTop !== null || Boolean(inner.style.minHeight);
  };

  const engage = (lock) => {
    release(lock); // bring any hold left from the last toggle up to date
    if (lock.frozenTop === null) lock.baseTop = parseFloat(getComputedStyle(lock.media).top) || 0;

    const top = lock.media.getBoundingClientRect().top;
    if (top < lock.baseTop - 0.5) {
      // Gallery is already resting on the section end: pin its sticky offset
      // where it is, so the section growing can't slide it back down.
      lock.frozenTop = top;
      lock.media.style.top = `${top}px`;
    }

    lock.startHold = parseFloat(lock.inner.style.minHeight) || 0;
    holdFloor(lock);
  };

  /* ---------------- Per-frame tracking while panels move ---------------- */

  const track = (summary, lock, pin) => {
    const root = document.documentElement;
    const { body } = document;
    const savedBehavior = root.style.scrollBehavior;
    const savedAnchor = body.style.overflowAnchor;
    root.style.scrollBehavior = 'auto'; // corrections must be instant, not smooth-scrolled
    body.style.overflowAnchor = 'none'; // and the browser must not stack its own on top

    const startTop = summary.getBoundingClientRect().top;
    // Scrolling above this point would un-stick the gallery, so never pin past it
    const minY = lock
      ? window.scrollY + lock.inner.getBoundingClientRect().top - (lock.frozenTop ?? lock.baseTop)
      : 0;

    const step = () => {
      if (pin) {
        const drift = summary.getBoundingClientRect().top - startTop;
        if (Math.abs(drift) > 0.5) window.scrollTo(window.scrollX, Math.max(minY, window.scrollY + drift));
      }
      if (lock) holdFloor(lock);
    };

    let raf = requestAnimationFrame(function loop() {
      step();
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      step();
      root.style.scrollBehavior = savedBehavior;
      body.style.overflowAnchor = savedAnchor;
    };
  };

  const finish = (lock, stop) => {
    stop?.();
    if (lock) {
      lock.startHold = 0;
      lock.lastY = window.scrollY;
      if (release(lock)) pending.add(lock);
      else pending.delete(lock);
    }
    busy = false;
  };

  /* ---------------- Click handling ---------------- */

  document.addEventListener('click', (event) => {
    const summary = event.target.closest('summary');
    const details = summary?.parentElement;
    if (!details || !details.matches(SELECTOR)) return;
    if (details.querySelector(':scope > summary') !== summary) return;
    const panel = summary.nextElementSibling;
    if (!panel) return;

    event.preventDefault();
    if (busy) return;
    busy = true;

    let lock = null;
    let stop = null;

    try {
      lock = lockFor(details);
      if (lock) engage(lock);

      const closing = details.open;
      const others = closing ? [] : openSiblings(details, groupOf(details));
      const closesAbove = others.some((d) => d.compareDocumentPosition(details) & Node.DOCUMENT_POSITION_FOLLOWING);
      const galleryStuck = !lock || lock.media.getBoundingClientRect().top <= (lock.frozenTop ?? lock.baseTop) + 0.5;

      stop = track(summary, lock, closesAbove && galleryStuck);

      const jobs = others.map((d) => {
        const p = panelOf(d);
        if (p) return closePanel(d, p);
        d.open = false;
        return null;
      });
      jobs.push(closing ? closePanel(details, panel) : openPanel(details, panel));

      Promise.allSettled(jobs).then(() => finish(lock, stop));
    } catch (error) {
      console.error(error);
      finish(lock, stop);
    }
  });

  /* ---------------- Release holds as the user scrolls ---------------- */

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (busy || ticking || !pending.size) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        pending.forEach((lock) => {
          if (!release(lock)) pending.delete(lock);
        });
      });
    },
    { passive: true }
  );

  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return; // mobile URL-bar show/hide — ignore
    lastWidth = window.innerWidth;
    pending.forEach((lock) => {
      lock.inner.style.minHeight = '';
      lock.media.style.top = '';
      lock.frozenTop = null;
    });
    pending.clear();
  });
})();

class MobileMenu extends HTMLElement {
  constructor() {
    super();
    this.trigger = this.querySelector('[data-menu-trigger]');
    this.panel = this.querySelector('[data-menu-panel]');
    this.closeButton = this.querySelector('[data-menu-close]');

    if (!this.trigger || !this.panel) return;

    this.trigger.addEventListener('click', () => this.#open());
    this.closeButton?.addEventListener('click', () => this.#close());
    this.panel.addEventListener('click', (event) => {
      if (event.target === this.panel) this.#close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.#close();
    });
  }

  #open() {
    this.panel.setAttribute('data-open', 'true');
    this.trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  #close() {
    this.panel.removeAttribute('data-open');
    this.trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

customElements.define('mobile-menu', MobileMenu);

class LazyVideo extends HTMLElement {
  connectedCallback() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!this.querySelector('[data-video-template]')) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.#load();
          this.observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  #load() {
    const template = this.querySelector('[data-video-template]');
    if (!template || this.dataset.loaded) return;
    this.dataset.loaded = 'true';

    const kind = template.dataset.videoKind;

    if (kind === 'upload') {
      const video = template.content.firstElementChild.cloneNode(true);
      video.addEventListener('canplay', () => this.classList.add('is-ready'), { once: true });
      this.append(video);
      video.play().catch(() => {});
      return;
    }

    const videoId = template.dataset.videoId;
    if (!videoId) return;

    const iframe = document.createElement('iframe');
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    iframe.setAttribute('title', this.dataset.videoTitle || 'Background video');
    iframe.className = 'video-media__video';

    if (kind === 'vimeo') {
      iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&controls=0`;
    } else {
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&modestbranding=1&rel=0`;
    }

    iframe.addEventListener(
      'load',
      () => {
        window.setTimeout(() => this.classList.add('is-ready'), 300);
      },
      { once: true }
    );

    this.append(iframe);
  }
}

customElements.define('lazy-video', LazyVideo);

/*
  Generic horizontal carousel. Scrolling itself is native (scroll-snap); this
  only wires the arrows and reflects how far the track has scrolled, so the
  buttons disable at the ends and hide entirely when nothing overflows.
*/
class CarouselSlider extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-carousel-track]');
    if (!this.track) return;

    this.prevButton = this.querySelector('[data-carousel-prev]');
    this.nextButton = this.querySelector('[data-carousel-next]');

    this.prevButton?.addEventListener('click', () => this.#scrollByPage(-1));
    this.nextButton?.addEventListener('click', () => this.#scrollByPage(1));

    this.track.addEventListener('scroll', () => this.#sync(), { passive: true });

    this.resizeObserver = new ResizeObserver(() => this.#sync());
    this.resizeObserver.observe(this.track);

    this.#sync();
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  #scrollByPage(direction) {
    const card = this.track.firstElementChild;
    if (!card) return;

    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
    this.track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
  }

  #sync() {
    const maxScroll = this.track.scrollWidth - this.track.clientWidth;

    this.classList.toggle('carousel--static', maxScroll <= 1);

    if (!this.prevButton || !this.nextButton) return;
    this.prevButton.disabled = this.track.scrollLeft <= 1;
    this.nextButton.disabled = this.track.scrollLeft >= maxScroll - 1;
  }
}

if (!customElements.get('carousel-slider')) {
  customElements.define('carousel-slider', CarouselSlider);
}

/*
  Static product grid that starts with only the first `data-step` items
  visible ([hidden] on the rest) and reveals another batch of `data-step`
  items each time the button is clicked — no re-fetching, everything is
  already rendered server-side. Once every item is visible the button
  becomes "Show less" and collapses the grid back to the first batch
  instead of just disappearing.
*/
class LoadMoreGrid extends HTMLElement {
  connectedCallback() {
    this.step = parseInt(this.dataset.step, 10) || 4;
    this.items = Array.from(this.querySelectorAll('[data-grid-item]'));
    this.button = this.querySelector('[data-load-more-button]');
    this.expanded = this.items.every((item) => !item.hidden);

    this.button?.addEventListener('click', () => {
      this.expanded ? this.#collapse() : this.#revealNextBatch();
    });
  }

  #revealNextBatch() {
    const hiddenItems = this.items.filter((item) => item.hidden);
    hiddenItems.slice(0, this.step).forEach((item) => {
      item.hidden = false;
    });

    if (hiddenItems.length <= this.step) {
      this.expanded = true;
      this.#setButtonLabel('labelShowLess');
    }
  }

  #collapse() {
    this.items.slice(this.step).forEach((item) => {
      item.hidden = true;
    });
    this.expanded = false;
    this.#setButtonLabel('labelLoadMore');
    this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  #setButtonLabel(key) {
    if (this.button && this.button.dataset[key]) {
      this.button.textContent = this.button.dataset[key];
    }
  }
}

if (!customElements.get('load-more-grid')) {
  customElements.define('load-more-grid', LoadMoreGrid);
}

/*
  Drives all scroll-linked header behavior:
   1. Marks the header once scrolled (.is-scrolled) — homepage-only in
      effect, since no CSS rule matches that class outside the hero
      context; harmless no-op elsewhere.
   2. Measures the header's own height into --site-header-height, which
      header.liquid's CSS uses to push page content down when the header
      is fixed (Always / Sticky on scroll up) — except on the homepage
      hero, which is deliberately NOT compensated for.
   3. Drives "Sticky on scroll up": hides on scroll down, reveals on
      scroll up, via .site-header--hidden — suppressed near the top of
      the homepage hero specifically to prevent the reveal-then-fade
      flicker (see comment below).

  isHeroOverlay() mirrors the CSS selector
  `#MainContent > .shopify-section:first-child .video-hero-slider` used
  in header.liquid — keep both in sync if that selector ever changes.
*/
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  const stickyMode = siteHeader.dataset.sticky;
  let lastScrollY = window.scrollY;

  const heroSection = document.querySelector('#MainContent > .shopify-section:first-child');
  const isHeroOverlay = () => !!(heroSection && heroSection.querySelector('.video-hero-slider'));

  const setHeaderHeightVar = () => {
    document.documentElement.style.setProperty('--site-header-height', siteHeader.offsetHeight + 'px');
  };

  let resizeTimer;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setHeaderHeightVar, 150);
  };

  const syncScrollState = () => {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 40;

    siteHeader.classList.toggle('is-scrolled', isScrolled);

    if (stickyMode === 'scroll_up') {
      const megaOpen = siteHeader.classList.contains('site-header--mega-open');
      const nearTopOfHero = isHeroOverlay() && scrollY <= 40;

      if (nearTopOfHero) {
        // Stay fully visible while still in the transparent zone — sliding
        // away and back here is what caused the solid-then-fade flicker.
        siteHeader.classList.remove('site-header--hidden');
      } else if (!megaOpen) {
        if (scrollY > lastScrollY && scrollY > 120) {
          siteHeader.classList.add('site-header--hidden');
        } else if (scrollY < lastScrollY) {
          siteHeader.classList.remove('site-header--hidden');
        }
      }
    } else if (stickyMode === 'none' && isHeroOverlay()) {
      siteHeader.classList.toggle('site-header--hidden', isScrolled);
    }

    lastScrollY = scrollY;
  };

  setHeaderHeightVar();
  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });
  window.addEventListener('resize', onResize);
}

if (!customElements.get('product-recommendations')) {
  class ProductRecommendations extends HTMLElement {
    observer = undefined;

    connectedCallback() {
      this.initializeRecommendations(this.dataset.productId);
    }

    disconnectedCallback() {
      this.observer?.unobserve(this);
    }

    initializeRecommendations(productId) {
      this.observer?.unobserve(this);
      this.observer = new IntersectionObserver(
        (entries, observer) => {
          if (!entries[0].isIntersecting) return;
          observer.unobserve(this);
          this.loadRecommendations(productId);
        },
        { rootMargin: '0px 0px 400px 0px' }
      );
      this.observer.observe(this);
    }

    loadRecommendations(productId) {
      fetch(`${this.dataset.url}&product_id=${productId}&section_id=${this.dataset.sectionId}`)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('product-recommendations');

          // Only swap in real content. An empty response (recommendations
          // still not found, and no fallback collection either) leaves the
          // synchronously-rendered fallback exactly as it already is.
          if (recommendations?.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  customElements.define('product-recommendations', ProductRecommendations);
}
