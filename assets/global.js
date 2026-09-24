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
(() => {
  const ANIMATED_SELECTOR = 'details.accordion, details.product-collapse';
  const DURATION = 250;

  document.querySelectorAll(ANIMATED_SELECTOR).forEach((details) => {
    const summary = details.querySelector(':scope > summary');
    const content = summary?.nextElementSibling;
    if (!summary || !content) return;

    let animation = null;

    const animate = (keyframes) => {
      animation?.cancel();
      animation = content.animate(keyframes, { duration: DURATION, easing: 'ease' });
      return animation;
    };

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (animation && animation.playState === 'running') return;

      content.style.overflow = 'hidden';

      if (details.open) {
        // slideUp, then actually close once the collapse finishes
        const startHeight = content.offsetHeight;
        animate([{ height: startHeight + 'px' }, { height: '0px' }]).onfinish = () => {
          details.open = false;
          content.style.height = '';
          content.style.overflow = '';
        };
      } else {
        // Content must be open (and thus visible/measurable) before we can
        // read its natural height, so open first, measure, then animate.
        details.open = true;
        const endHeight = content.offsetHeight;
        content.style.height = '0px';
        animate([{ height: '0px' }, { height: endHeight + 'px' }]).onfinish = () => {
          content.style.height = '';
          content.style.overflow = '';
        };
      }
    });
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
