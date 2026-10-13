if (!customElements.get('cart-page')) {
  class CartPage extends HTMLElement {
    connectedCallback() {
      this.moneyFmt   = this.dataset.moneyFormat || '{{ amount }}';
      this.devicePids = new Set(
        (this.dataset.devicePids || '').split(',').map(s => s.trim()).filter(Boolean)
      );

      this.#bindSetSwitcher();
      this.#bindAddonCards();
      this.#bindAccRows();
      this.#bindFavCards();
      this.#bindSparesToggle();
      this.#bindDeviceRemove();
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    #fmt(cents) {
      const amount = (cents / 100).toFixed(2);
      return this.moneyFmt
        .replace(/\{\{\s*amount\s*\}\}/,  amount)
        .replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100))
        .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, amount.replace('.', ','));
    }

    async #cartFetch(url, body) {
      const r = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body:    JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`Cart request failed: ${r.status}`);
      return r.json();
    }

    async #getCart() {
      const r = await fetch('/cart.js', { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      return r.json();
    }

    // ── Set switcher (radio cards inside device accordions) ────────────────

    #bindSetSwitcher() {
      this.querySelectorAll('input[type="radio"][data-new-pid]').forEach(radio => {
        radio.addEventListener('change', async e => {
          if (!radio.checked) return;
          const oldKey = radio.dataset.oldKey;
          const newPid = parseInt(radio.dataset.newPid, 10);
          const newVid = parseInt(radio.dataset.newVid, 10);
          radio.closest('.cp-sets__grid')?.querySelectorAll('.cp-set').forEach(c => {
            c.classList.toggle('is-active', c.contains(radio));
          });
          radio.disabled = true;
          try {
            await this.#cartFetch('/cart/change.js', { id: oldKey, quantity: 0 });
            await this.#cartFetch('/cart/add.js', { id: newVid, quantity: 1 });
            window.location.reload();
          } catch (err) {
            console.error('Set switch failed', err);
            radio.disabled = false;
          }
        });
      });
    }

    // ── Addon cards (essentials / spares inside device accordion) ──────────

    #bindAddonCards() {
      this.querySelectorAll('.cp-addon').forEach(card => this.#initAddonCard(card));
    }

    #initAddonCard(card) {
      const atcBtn   = card.querySelector('.cp-addon__atc');
      const addedBtn = card.querySelector('.cp-addon__added');
      const qtyWrap  = card.querySelector('.cp-addon__qty');

      if (atcBtn) {
        atcBtn.addEventListener('click', async () => {
          atcBtn.disabled = true;
          const vid = parseInt(card.dataset.vid, 10);
          try {
            const data = await this.#cartFetch('/cart/add.js', { id: vid, quantity: 1 });
            const key  = data.key;
            card.dataset.key = key;
            card.classList.add('is-added');
            this.#renderAddonAdded(card, key, 1);
            await this.#refreshSidebar();
          } catch (err) {
            console.error('Addon add failed', err);
            atcBtn.disabled = false;
          }
        });
      }

      if (addedBtn) {
        addedBtn.addEventListener('click', () => this.#removeAddon(card));
      }

      if (qtyWrap) {
        this.#bindAddonQty(card, qtyWrap);
      }
    }

    #renderAddonAdded(card, key, qty) {
      const action = card.querySelector('.cp-addon__action');
      action.innerHTML = `
        <button type="button" class="cp-addon__added" aria-label="Remove from cart">
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
            <path d="M1 5l3 4L11 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ADDED
        </button>
        <div class="cp-addon__qty" data-key="${key}">
          <button type="button" class="cp-addon__qty-btn" data-d="-1" aria-label="Decrease quantity">−</button>
          <span class="cp-addon__qty-num">${qty}</span>
          <button type="button" class="cp-addon__qty-btn" data-d="1" aria-label="Increase quantity">+</button>
        </div>`;
      action.querySelector('.cp-addon__added').addEventListener('click', () => this.#removeAddon(card));
      this.#bindAddonQty(card, action.querySelector('.cp-addon__qty'));
    }

    #renderAddonRemoved(card) {
      const action = card.querySelector('.cp-addon__action');
      delete card.dataset.key;
      card.classList.remove('is-added');
      action.innerHTML = `<button type="button" class="cp-addon__atc">ADD TO CART</button>`;
      action.querySelector('.cp-addon__atc').addEventListener('click', async () => {
        action.querySelector('.cp-addon__atc').disabled = true;
        const vid = parseInt(card.dataset.vid, 10);
        try {
          const data = await this.#cartFetch('/cart/add.js', { id: vid, quantity: 1 });
          card.dataset.key = data.key;
          card.classList.add('is-added');
          this.#renderAddonAdded(card, data.key, 1);
          await this.#refreshSidebar();
        } catch (err) {
          console.error('Addon re-add failed', err);
          action.querySelector('.cp-addon__atc').disabled = false;
        }
      });
    }

    async #removeAddon(card) {
      const key = card.dataset.key;
      if (!key) return;
      try {
        await this.#cartFetch('/cart/change.js', { id: key, quantity: 0 });
        this.#renderAddonRemoved(card);
        await this.#refreshSidebar();
      } catch (err) {
        console.error('Addon remove failed', err);
      }
    }

    #bindAddonQty(card, qtyWrap) {
      qtyWrap.querySelectorAll('[data-d]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const key  = qtyWrap.dataset.key || card.dataset.key;
          const d    = parseInt(btn.dataset.d, 10);
          const num  = qtyWrap.querySelector('.cp-addon__qty-num');
          const curr = parseInt(num?.textContent || '1', 10);
          const next = curr + d;
          if (next <= 0) {
            await this.#removeAddon(card);
            return;
          }
          btn.disabled = true;
          try {
            await this.#cartFetch('/cart/change.js', { id: key, quantity: next });
            if (num) num.textContent = next;
            await this.#refreshSidebar();
          } catch (err) {
            console.error('Addon qty change failed', err);
          } finally {
            btn.disabled = false;
          }
        });
      });
    }

    // ── Standalone accessory rows ──────────────────────────────────────────

    #bindAccRows() {
      this.querySelectorAll('.cp-acc-row').forEach(row => this.#initAccRow(row));
    }

    #initAccRow(row) {
      const key = row.dataset.key;
      const removeBtn = row.querySelector('[data-remove]');
      if (removeBtn) {
        removeBtn.addEventListener('click', async () => {
          removeBtn.disabled = true;
          try {
            await this.#cartFetch('/cart/change.js', { id: key, quantity: 0 });
            row.remove();
            await this.#refreshSidebar();
            this.#checkEmpty();
          } catch (err) {
            console.error('Acc remove failed', err);
            removeBtn.disabled = false;
          }
        });
      }

      row.querySelectorAll('.cp-acc-row__qty-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const num  = row.querySelector('.cp-acc-row__qty-num');
          const curr = parseInt(num?.textContent || '1', 10);
          const d    = parseInt(btn.dataset.d, 10);
          const next = curr + d;
          if (next <= 0) {
            removeBtn?.click();
            return;
          }
          btn.disabled = true;
          try {
            const data = await this.#cartFetch('/cart/change.js', { id: key, quantity: next });
            if (num) num.textContent = next;
            const priceEl = row.querySelector('.cp-acc-row__price');
            const item    = data.items?.find(i => i.key === key);
            if (priceEl && item) priceEl.textContent = this.#fmt(item.final_line_price);
            await this.#refreshSidebar();
          } catch (err) {
            console.error('Acc qty change failed', err);
          } finally {
            btn.disabled = false;
          }
        });
      });
    }

    // ── Fav card ADD buttons ───────────────────────────────────────────────

    #bindFavCards() {
      this.querySelectorAll('.cp-fav__add').forEach(btn => {
        btn.addEventListener('click', async () => {
          const card = btn.closest('.cp-fav');
          const vid  = parseInt(card?.dataset.vid || '0', 10);
          if (!vid) return;
          btn.disabled = true;
          try {
            await this.#cartFetch('/cart/add.js', { id: vid, quantity: 1 });
            card.remove();
            await this.#refreshSidebar();
            if (!this.querySelector('.cp-fav')) {
              this.querySelector('.cp-favs')?.remove();
            }
          } catch (err) {
            console.error('Fav add failed', err);
            btn.disabled = false;
          }
        });
      });
    }

    // ── Spares "show more / show fewer" toggle ─────────────────────────────

    #bindSparesToggle() {
      this.querySelectorAll('[data-spares-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
          const forKey = btn.dataset.sparesToggle;
          const grid   = this.querySelector(`[data-spares-for="${forKey}"]`);
          if (!grid) return;
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          const showEl = btn.querySelector('.cp-addons__more-show');
          const hideEl = btn.querySelector('.cp-addons__more-hide');
          if (isOpen) {
            grid.querySelectorAll('[data-hidden-initially]').forEach(c => {
              if (!c.classList.contains('is-added')) c.classList.add('cp-addon--hidden');
            });
            btn.setAttribute('aria-expanded', 'false');
            if (showEl) showEl.hidden = false;
            if (hideEl) hideEl.hidden = true;
          } else {
            grid.querySelectorAll('[data-hidden-initially]').forEach(c => {
              c.classList.remove('cp-addon--hidden');
            });
            btn.setAttribute('aria-expanded', 'true');
            if (showEl) showEl.hidden = true;
            if (hideEl) hideEl.hidden = false;
          }
        });
        btn.setAttribute('aria-expanded', 'false');
      });
    }

    // ── Device remove (× button and "remove" anchor) ───────────────────────

    #bindDeviceRemove() {
      this.querySelectorAll('.cp-dev__x[data-remove], .cp-addons__remove-link[data-remove]').forEach(el => {
        el.addEventListener('click', async e => {
          e.preventDefault();
          const key = el.dataset.remove;
          el.setAttribute('disabled', '');
          try {
            await this.#cartFetch('/cart/change.js', { id: key, quantity: 0 });
            window.location.reload();
          } catch (err) {
            console.error('Device remove failed', err);
            el.removeAttribute('disabled');
          }
        });
      });
    }

    // ── Sidebar refresh (after accessory-only mutations) ───────────────────

    async #refreshSidebar() {
      try {
        const cart    = await this.#getCart();
        const itemsEl = document.getElementById('cp-sidebar-items');
        const totEl   = document.getElementById('cp-sidebar-total-price');

        if (itemsEl) {
          const rows = itemsEl.querySelectorAll('.cp-sidebar__row:not(.cp-sidebar__row--device)');
          rows.forEach(r => r.remove());
          for (const item of cart.items) {
            if (this.devicePids.has(String(item.product_id))) continue;
            const li = document.createElement('li');
            li.className = 'cp-sidebar__row';
            li.dataset.lineKey = item.key;
            const qty = item.quantity > 1 ? ` × ${item.quantity}` : '';
            li.innerHTML = `
              <span class="cp-sidebar__row-name">${this.#escHtml(item.product_title)}${qty}</span>
              <span class="cp-sidebar__row-price">${this.#fmt(item.final_line_price)}</span>`;
            itemsEl.appendChild(li);
          }
        }

        if (totEl) {
          totEl.textContent = this.#fmt(cart.total_price);
        }

        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
      } catch (err) {
        console.error('Sidebar refresh failed', err);
      }
    }

    #escHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    #checkEmpty() {
      const hasItems = this.querySelectorAll('.cp-acc-row').length > 0
        || this.querySelectorAll('.cp-dev').length > 0;
      if (!hasItems) window.location.reload();
    }
  }

  customElements.define('cart-page', CartPage);
}
