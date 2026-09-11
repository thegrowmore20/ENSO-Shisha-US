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
  class ProductMediaGallery extends HTMLElement {
    connectedCallback() {
      this.thumbs = Array.from(this.querySelectorAll('[data-thumb]'));
      this.items = Array.from(this.querySelectorAll('.product-gallery__item'));
      this.isCarousel = !!this.querySelector('[data-carousel-track]');

      this.thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => this.setActiveMedia(thumb.dataset.targetMediaId));
      });

      // Lazily load Google's model-viewer library only if this product actually has a 3D model
      if (this.querySelector('[data-media-type="model"]') && window.Shopify?.loadFeatures) {
        window.Shopify.loadFeatures([{ name: 'model-viewer-ui', version: '1.0', onLoad: () => {} }]);
      }
    }

    setActiveMedia(mediaId) {
      if (this.isCarousel) {
        const target = this.querySelector('[data-media-id="' + mediaId + '"]');
        target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        return;
      }

      this.items.forEach((item) => {
        const isMatch = item.dataset.mediaId === String(mediaId);
        item.hidden = !isMatch;
        item.classList.toggle('is-active', isMatch);
        if (!isMatch) item.querySelector('video')?.pause();
      });

      this.thumbs.forEach((thumb) => {
        const isMatch = thumb.dataset.targetMediaId === String(mediaId);
        thumb.classList.toggle('is-active', isMatch);
        thumb.setAttribute('aria-selected', String(isMatch));
      });
    }
  }

  customElements.define('product-media-gallery', ProductMediaGallery);
}
