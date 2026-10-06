/*
  <cart-shipping-bar>: keeps the free-shipping progress bar rendered by
  snippets/cart-shipping-bar.liquid in step with the cart.

  It re-reads the cart total whenever the cart changes (the cart:* events
  dispatched on document by the cart drawer) and updates the message, the
  fill width and the progressbar value. The threshold is set in the store
  currency, so it is multiplied by Shopify.currency.rate for visitors paying
  in another currency.
*/
if (!customElements.get('cart-shipping-bar')) {
  class CartShippingBar extends HTMLElement {
    static #events = ['cart:add', 'cart:updated', 'cart:change', 'cart:refresh'];

    #message;
    #fill;
    #track;
    #threshold = 0;
    #onCartChange = (event) => this.#refresh(event);

    connectedCallback() {
      this.#message = this.querySelector('[data-shipping-bar-message]');
      this.#fill = this.querySelector('[data-shipping-bar-fill]');
      this.#track = this.querySelector('[data-shipping-bar-track]');

      const rate = Number(window.Shopify?.currency?.rate) || 1;
      this.#threshold = Math.round((parseInt(this.dataset.thresholdCents, 10) || 0) * rate);

      for (const name of CartShippingBar.#events) {
        document.addEventListener(name, this.#onCartChange);
      }

      // The server render cannot convert currencies; correct it once here.
      if (rate !== 1) this.#refresh();
    }

    disconnectedCallback() {
      for (const name of CartShippingBar.#events) {
        document.removeEventListener(name, this.#onCartChange);
      }
    }

    async #refresh(event) {
      const total = event?.detail?.cart?.total_price;
      if (typeof total === 'number') {
        this.#render(total);
        return;
      }

      try {
        const root = window.Shopify?.routes?.root || '/';
        const response = await fetch(`${root}cart.js`, { headers: { Accept: 'application/json' } });
        if (!response.ok) return;
        const cart = await response.json();
        this.#render(cart.total_price);
      } catch {
        // Leave the bar as it is: a stale bar is better than a broken cart.
      }
    }

    #render(totalCents) {
      if (!this.#threshold) return;

      const remaining = Math.max(0, this.#threshold - totalCents);
      const progress = remaining === 0 ? 100 : Math.floor((totalCents / this.#threshold) * 100);

      if (this.#fill) this.#fill.style.width = `${progress}%`;
      this.#track?.setAttribute('aria-valuenow', String(progress));

      if (!this.#message) return;
      this.#message.textContent =
        remaining === 0
          ? this.dataset.messageAfter || ''
          : (this.dataset.messageBefore || '').replace('[amount]', this.#formatMoney(remaining));
    }

    #formatMoney(cents) {
      const amount = cents / 100;
      try {
        return new Intl.NumberFormat(this.dataset.locale || undefined, {
          style: 'currency',
          currency: this.dataset.currency,
          minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        }).format(amount);
      } catch {
        return amount.toFixed(2);
      }
    }
  }

  customElements.define('cart-shipping-bar', CartShippingBar);
}
