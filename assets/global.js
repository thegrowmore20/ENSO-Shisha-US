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
  Marks the header once the page has scrolled, so an overlay header sitting on
  top of a full-bleed hero can pick up a solid background instead of staying
  transparent over the content below.
*/
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  const syncScrollState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });
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
