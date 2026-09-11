if (!customElements.get('product-card-swatches')) {
  class ProductCardSwatches extends HTMLElement {
    connectedCallback() {
      this.card = this.closest('.product-card');
      if (!this.card) return;

      // The whole card is an <a>; without this, picking a swatch would
      // both select it AND navigate away via the ancestor link.
      this.addEventListener('click', (event) => {
        if (event.target.closest('.card-swatch-item')) {
          event.stopPropagation();
        }
      });

      this.addEventListener('change', (event) => {
        if (event.target.matches('.card-swatch-input')) {
          this.selectSwatch(event.target);
        }
      });
    }

    selectSwatch(input) {
      const image = this.card.querySelector('.product-card__primary-image');
      if (image && input.dataset.image) {
        image.src = input.dataset.image;
        image.removeAttribute('srcset');
      }

      // A stale second-angle image would no longer match the picked variant.
      const secondaryImage = this.card.querySelector('.product-card__secondary-image');
      if (secondaryImage) secondaryImage.style.display = 'none';

      if (input.dataset.url && this.card.tagName === 'A') {
        this.card.href = input.dataset.url;
      }

      const isAvailable = input.dataset.available === 'true';

      const variantIdInput = this.card.querySelector('.quick-add-form [data-variant-id-input]');
      if (variantIdInput) variantIdInput.value = input.dataset.variantId;

      const quickAddButton = this.card.querySelector('.quick-add-form .quick-add-button');
      if (quickAddButton) {
        quickAddButton.disabled = !isAvailable;
        const label = quickAddButton.querySelector('[data-quick-add-label]');
        if (label) {
          label.textContent = isAvailable ? label.dataset.labelAvailable : label.dataset.labelSoldOut;
        }
      }
    }
  }

  customElements.define('product-card-swatches', ProductCardSwatches);
}
