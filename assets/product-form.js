if (!customElements.get('product-info')) {
  class ProductInfo extends HTMLElement {
    connectedCallback() {
      this.idInput = this.querySelector('[data-variant-id-input]');
      this.variantsScript = this.querySelector('[data-product-variants]');
      this.variants = this.variantsScript ? JSON.parse(this.variantsScript.textContent) : [];
      this.priceTemplates = this.querySelector('[data-price-templates]');
      this.priceWrapper = this.querySelector('[data-price-wrapper]');
      this.addButton = this.querySelector('[data-add-to-cart]');
      this.addButtonText = this.querySelector('[data-add-to-cart-text]');
      this.gallery = document.getElementById('ProductMediaGallery-' + this.dataset.sectionId);

      this.#bindVariantPicker();
      this.#bindQuantity();

      if (this.variants.length) this.#refreshAvailability();
    }

    #pillGroups() {
      return Array.from(this.querySelectorAll('[data-option-index]'));
    }

    #currentSelection() {
      return this.#pillGroups().map((group) => {
        const selected = group.querySelector('.pill.is-selected');
        return selected ? selected.dataset.optionValue : null;
      });
    }

    #findVariant(selection) {
      return this.variants.find((variant) =>
        selection.every((value, index) => value === null || variant.options[index] === value)
      );
    }

    #bindVariantPicker() {
      this.#pillGroups().forEach((group) => {
        const pills = Array.from(group.querySelectorAll('.pill'));

        pills.forEach((pill, index) => {
          pill.addEventListener('click', () => {
            if (pill.disabled) return;

            pills.forEach((p) => {
              p.classList.remove('is-selected');
              p.setAttribute('aria-checked', 'false');
            });
            pill.classList.add('is-selected');
            pill.setAttribute('aria-checked', 'true');
            group.querySelector('[data-selected-value]').textContent = pill.dataset.optionValue;

            this.#onSelectionChange();
          });

          // Arrow-key navigation within a radiogroup, per WAI-ARIA radio pattern
          pill.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            const dir = event.key === 'ArrowRight' ? 1 : -1;
            const next = pills[(index + dir + pills.length) % pills.length];
            next.focus();
            next.click();
          });
        });
      });
    }

    #onSelectionChange() {
      if (!this.variants.length) return;
      const selection = this.#currentSelection();
      const variant = this.#findVariant(selection);
      this.#refreshAvailability(selection);
      if (variant) this.#applyVariant(variant);
    }

    // Disables pills that can't form a real variant combination given the
    // rest of the current selection. Sold-out-but-real combinations stay
    // enabled — that distinction is handled by #applyVariant instead.
    #refreshAvailability(selection) {
      selection = selection || this.#currentSelection();
      this.#pillGroups().forEach((group, groupIndex) => {
        group.querySelectorAll('.pill').forEach((pill) => {
          const testSelection = selection.slice();
          testSelection[groupIndex] = pill.dataset.optionValue;
          const exists = this.#findVariant(testSelection);
          const unavailable = !exists;
          pill.classList.toggle('is-unavailable', unavailable);
          pill.disabled = unavailable;
          pill.setAttribute('aria-disabled', String(unavailable));
        });
      });
    }

    #applyVariant(variant) {
      // 1. Hidden id input — dispatch change so the native dynamic checkout button refreshes itself
      if (this.idInput) {
        this.idInput.value = variant.id;
        this.idInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 2. Price — swap in the server-rendered template for this variant (correct money formatting, no JS math)
      if (this.priceTemplates && this.priceWrapper) {
        const template = this.priceTemplates.content.querySelector(
          '[data-variant-price-id="' + variant.id + '"]'
        );
        if (template) this.priceWrapper.innerHTML = template.innerHTML;
      }

      // 3. Add to cart button state
      if (this.addButton) this.addButton.disabled = !variant.available;
      if (this.addButtonText) {
        this.addButtonText.textContent = variant.available
          ? this.addButtonText.dataset.labelAvailable
          : this.addButtonText.dataset.labelSoldOut;
      }

      // 4. Media — jump the gallery to this variant's featured media, if it has one
      if (this.gallery && variant.featured_media) {
        this.gallery.setActiveMedia(variant.featured_media.id);
      }

      // 5. URL — shareable link without a page reload
      if (window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url);
      }
    }

    #bindQuantity() {
      const input = this.querySelector('[data-quantity-input]');
      if (!input) return;

      this.querySelector('[data-quantity-minus]')?.addEventListener('click', () => {
        input.value = Math.max(1, parseInt(input.value || '1', 10) - 1);
      });
      this.querySelector('[data-quantity-plus]')?.addEventListener('click', () => {
        input.value = parseInt(input.value || '1', 10) + 1;
      });
      input.addEventListener('change', () => {
        const value = parseInt(input.value, 10);
        if (isNaN(value) || value < 1) input.value = 1;
      });
    }

    // Submitting the form is handled by the single delegated listener in
    // cart-drawer.js (document-level, matches form[action="/cart/add"]).
    // This element used to also bind its own submit handler here and POST
    // independently — since preventDefault() doesn't stop an event from
    // bubbling to document, both handlers fired on every submit, adding
    // the item to the cart twice. Do not re-add a submit handler here.
  }

  customElements.define('product-info', ProductInfo);
}

if (!customElements.get('product-media-gallery')) {
  // Below this, a swipe/drag is treated as an intentional slide change
  // rather than a tap or an indecisive wiggle.
  const SWIPE_THRESHOLD_PX = 40;

  class ProductMediaGallery extends HTMLElement {
    connectedCallback() {
      this.thumbs = Array.from(this.querySelectorAll('[data-thumb]'));
      this.items = Array.from(this.querySelectorAll('.product-gallery__item'));
      this.track = this.querySelector('[data-gallery-track]');
      this.viewport = this.querySelector('[data-gallery-main]');
      this.isCarousel = !!this.querySelector('[data-carousel-track]');
      this.activeIndex = Math.max(0, this.items.findIndex((item) => item.classList.contains('is-active')));

      this.thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => this.setActiveMedia(thumb.dataset.targetMediaId));
      });

      // Lazily load Google's model-viewer library only if this product actually has a 3D model
      if (this.querySelector('[data-media-type="model"]') && window.Shopify?.loadFeatures) {
        window.Shopify.loadFeatures([{ name: 'model-viewer-ui', version: '1.0', onLoad: () => {} }]);
      }

      if (!this.isCarousel && this.track && this.items.length > 1) {
        this.#bindSwipe();
      }

      this.#bindThumbsOverflow();
    }

    setActiveMedia(mediaId) {
      if (this.isCarousel) {
        const target = this.querySelector('[data-media-id="' + mediaId + '"]');
        target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        return;
      }

      const index = this.items.findIndex((item) => item.dataset.mediaId === String(mediaId));
      if (index === -1) return;
      this.#goToIndex(index);
    }

    #goToIndex(index, options) {
      const animate = !options || options.animate !== false;
      index = Math.max(0, Math.min(index, this.items.length - 1));
      this.activeIndex = index;

      if (this.track) {
        this.track.classList.toggle('is-dragging', !animate);
        this.track.style.transform = 'translateX(' + -100 * index + '%)';
      }

      this.items.forEach((item, itemIndex) => {
        const isMatch = itemIndex === index;
        item.classList.toggle('is-active', isMatch);
        if (isMatch) {
          item.removeAttribute('inert');
        } else {
          item.setAttribute('inert', '');
          item.querySelector('video')?.pause();
        }
      });

      const activeMediaId = this.items[index]?.dataset.mediaId;
      this.thumbs.forEach((thumb) => {
        const isMatch = thumb.dataset.targetMediaId === activeMediaId;
        thumb.classList.toggle('is-active', isMatch);
        thumb.setAttribute('aria-selected', String(isMatch));
      });

      const activeThumb = this.thumbs.find((thumb) => thumb.dataset.targetMediaId === activeMediaId);
      activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }

    // Pointer events unify mouse drag (desktop) and touch swipe (mobile) in
    // one handler. touch-action: pan-y on the viewport (see main-product.css)
    // leaves vertical page scrolling to the browser; this only ever acts on
    // horizontal movement.
    #bindSwipe() {
      let startX = 0;
      let currentX = 0;
      let dragging = false;
      let pointerId = null;

      const width = () => this.viewport.getBoundingClientRect().width || 1;

      const onPointerDown = (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        dragging = true;
        pointerId = event.pointerId;
        startX = event.clientX;
        currentX = startX;
        this.track.classList.add('is-dragging');
        // Wrapped: the Pointer Capture API can throw NotFoundError in
        // browser-specific edge cases (e.g. capture already auto-released
        // before this call). Letting that escape here would only cost the
        // few pixels of extra drag precision capture provides — nothing
        // else in this handler depends on it succeeding.
        try {
          this.viewport.setPointerCapture?.(pointerId);
        } catch (error) {
          // Ignored — see comment above.
        }
      };

      const onPointerMove = (event) => {
        if (!dragging || event.pointerId !== pointerId) return;
        currentX = event.clientX;
        const deltaPercent = ((currentX - startX) / width()) * 100;
        this.track.style.transform =
          'translateX(' + (-100 * this.activeIndex + deltaPercent) + '%)';
      };

      const onPointerUp = (event) => {
        if (!dragging || event.pointerId !== pointerId) return;
        dragging = false;
        // Same NotFoundError risk as setPointerCapture above — critically,
        // this must not throw and skip the #goToIndex() call below, or the
        // slide is left stuck mid-drag with the transition still disabled.
        try {
          this.viewport.releasePointerCapture?.(pointerId);
        } catch (error) {
          // Ignored — see setPointerCapture above.
        }

        const delta = currentX - startX;
        let nextIndex = this.activeIndex;
        if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
          nextIndex += delta < 0 ? 1 : -1;
        }
        this.#goToIndex(nextIndex);
      };

      this.viewport.addEventListener('pointerdown', onPointerDown);
      this.viewport.addEventListener('pointermove', onPointerMove);
      this.viewport.addEventListener('pointerup', onPointerUp);
      this.viewport.addEventListener('pointercancel', onPointerUp);
    }

    // Shows/hides the up/down scroll arrows flanking a vertical thumbnail
    // column (thumbnails_left layout) based on whether it actually
    // overflows its max-height, and keeps them in sync as the visitor
    // scrolls the column or the viewport is resized.
    // The thumbnail column is vertical on desktop and switches to a
    // horizontal row on mobile (see main-product.css). Rather than track
    // that breakpoint separately here, ask the element itself which axis
    // it's actually scrolling in right now — correct automatically across
    // resizes, including live resizing in the theme editor/devtools.
    #bindThumbsOverflow() {
      const thumbsList = this.querySelector('[data-gallery-thumbs]');
      const prevButton = this.querySelector('[data-thumbs-prev]');
      const nextButton = this.querySelector('[data-thumbs-next]');
      if (!thumbsList || !prevButton || !nextButton) return;

      const isHorizontal = () => getComputedStyle(thumbsList).flexDirection === 'row';

      const updateArrows = () => {
        if (isHorizontal()) {
          const canScroll = thumbsList.scrollWidth > thumbsList.clientWidth + 1;
          prevButton.hidden = !canScroll || thumbsList.scrollLeft <= 0;
          nextButton.hidden =
            !canScroll || thumbsList.scrollLeft + thumbsList.clientWidth >= thumbsList.scrollWidth - 1;
        } else {
          const canScroll = thumbsList.scrollHeight > thumbsList.clientHeight + 1;
          prevButton.hidden = !canScroll || thumbsList.scrollTop <= 0;
          nextButton.hidden =
            !canScroll || thumbsList.scrollTop + thumbsList.clientHeight >= thumbsList.scrollHeight - 1;
        }
      };

      const scrollByStep = (direction) => {
        const horizontal = isHorizontal();
        const thumbSize = horizontal
          ? this.thumbs[0]?.getBoundingClientRect().width
          : this.thumbs[0]?.getBoundingClientRect().height;
        const step = (thumbSize || 64) + 12;
        thumbsList.scrollBy(
          horizontal ? { left: direction * step * 2, behavior: 'smooth' } : { top: direction * step * 2, behavior: 'smooth' }
        );
      };

      prevButton.addEventListener('click', () => scrollByStep(-1));
      nextButton.addEventListener('click', () => scrollByStep(1));
      thumbsList.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);

      updateArrows();
    }
  }

  customElements.define('product-media-gallery', ProductMediaGallery);
}
