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

    #escHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    #toast(msg) {
      const el = document.getElementById('cp-toast');
      if (!el) return;
      el.textContent = msg;
      el.classList.add('is-on');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => el.classList.remove('is-on'), 2400);
    }

    #updateCartCount(count) {
      // Update any cart count badges in the header
      document.querySelectorAll('.cart-count-bubble, .enso-cartcount, [data-cart-count]').forEach(el => {
        el.textContent = count;
        el.hidden = count === 0;
      });
    }

    // ── Set switcher (radio cards inside device accordions) ────────────────

    #bindSetSwitcher() {
      this.querySelectorAll('input[type="radio"][data-new-pid]').forEach(radio => {
        radio.addEventListener('change', async () => {
          if (!radio.checked) return;
          const oldKey = radio.dataset.oldKey;
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
      const atcBtn  = card.querySelector('.cp-addon__atc');
      const qtyWrap = card.querySelector('.cp-addon__qty');

      if (atcBtn) {
        atcBtn.addEventListener('click', async () => {
          if (atcBtn.classList.contains('is-on')) {
            // ADDED → remove
            await this.#removeAddon(card);
          } else {
            // not added → add
            const vid = parseInt(card.dataset.vid, 10);
            atcBtn.classList.add('is-loading');
            atcBtn.disabled = true;
            try {
              const data = await this.#cartFetch('/cart/add.js', { id: vid, quantity: 1 });
              card.dataset.key = data.key;
              card.classList.add('is-added');
              atcBtn.classList.add('is-on');
              atcBtn.classList.remove('is-loading');
              atcBtn.disabled = false;
              this.#renderAddonQtyVisible(card, data.key, 1);
              this.#toast('Added to cart');
              await this.#refreshSidebar();
            } catch (err) {
              console.error('Addon add failed', err);
              atcBtn.classList.remove('is-loading');
              atcBtn.disabled = false;
            }
          }
        });
      }

      if (qtyWrap) {
        this.#bindAddonQty(card, qtyWrap);
      }
    }

    #renderAddonQtyVisible(card, key, qty) {
      let qtyWrap = card.querySelector('.cp-addon__qty');
      if (!qtyWrap) {
        qtyWrap = document.createElement('div');
        qtyWrap.className = 'cp-addon__qty';
        qtyWrap.innerHTML = `
          <button type="button" class="cp-addon__qty-btn" data-d="-1" aria-label="Decrease quantity">−</button>
          <span class="cp-addon__qty-num">${qty}</span>
          <button type="button" class="cp-addon__qty-btn" data-d="1" aria-label="Increase quantity">+</button>`;
        card.querySelector('.cp-addon__row')?.appendChild(qtyWrap);
        this.#bindAddonQty(card, qtyWrap);
      } else {
        const num = qtyWrap.querySelector('.cp-addon__qty-num');
        if (num) num.textContent = qty;
      }
      qtyWrap.dataset.key = key;
      qtyWrap.hidden = false;
    }

    async #removeAddon(card) {
      const key = card.dataset.key;
      if (!key) return;
      const atcBtn = card.querySelector('.cp-addon__atc');
      if (atcBtn) { atcBtn.classList.add('is-loading'); atcBtn.disabled = true; }
      try {
        await this.#cartFetch('/cart/change.js', { id: key, quantity: 0 });
        delete card.dataset.key;
        card.classList.remove('is-added');
        if (atcBtn) {
          atcBtn.classList.remove('is-on', 'is-loading');
          atcBtn.disabled = false;
        }
        const qtyWrap = card.querySelector('.cp-addon__qty');
        if (qtyWrap) qtyWrap.hidden = true;
        this.#toast('Removed from cart');
        await this.#refreshSidebar();
      } catch (err) {
        console.error('Addon remove failed', err);
        if (atcBtn) { atcBtn.classList.remove('is-loading'); atcBtn.disabled = false; }
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
      const key       = row.dataset.key;
      const removeBtn = row.querySelector('[data-remove]');

      if (removeBtn) {
        removeBtn.addEventListener('click', async () => {
          removeBtn.disabled = true;
          try {
            await this.#cartFetch('/cart/change.js', { id: key, quantity: 0 });
            row.remove();
            this.#toast('Removed from cart');
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
          const pid  = card?.dataset.pid || '';
          if (!vid) return;
          btn.classList.add('is-loading');
          btn.disabled = true;
          try {
            const data = await this.#cartFetch('/cart/add.js', { id: vid, quantity: 1 });
            // Insert row into acc list
            this.#insertAccRow(data, card);
            card.remove();
            this.#toast('Added to cart');
            await this.#refreshSidebar();
            if (!this.querySelector('.cp-fav')) {
              this.querySelector('.cp-favs')?.remove();
            }
          } catch (err) {
            console.error('Fav add failed', err);
            btn.classList.remove('is-loading');
            btn.disabled = false;
          }
        });
      });
    }

    #insertAccRow(lineItem, favCard) {
      const list = document.getElementById('cp-acc-list');
      if (!list) return;

      // Ensure acc-section is visible (accessories mode may not have shown it)
      let accSection = this.querySelector('.cp-acc-section');
      if (!accSection) {
        accSection = document.createElement('div');
        accSection.className = 'cp-acc-section';
        const accList = document.createElement('ul');
        accList.className = 'cp-acc-list';
        accList.id = 'cp-acc-list';
        accList.setAttribute('role', 'list');
        accSection.appendChild(accList);
        // Insert before the favs section
        const favs = document.getElementById('cp-favs');
        favs ? this.querySelector('.cp-main').insertBefore(accSection, favs)
              : this.querySelector('.cp-main').appendChild(accSection);
      }

      const targetList = document.getElementById('cp-acc-list');
      if (!targetList) return;

      const nameText  = this.#escHtml(lineItem.product_title || '');
      const priceText = this.#fmt(lineItem.final_line_price);
      const imgSrc    = lineItem.featured_image?.url
        ? lineItem.featured_image.url.replace(/\.jpg|\.png/, '.webp')
        : '';
      const productUrl = lineItem.url || `/products/${lineItem.handle}`;
      const key        = lineItem.key;

      const li = document.createElement('li');
      li.className = 'cp-acc-row';
      li.dataset.key = key;
      li.innerHTML = `
        <a class="cp-acc-row__img" href="${productUrl}" aria-label="${nameText}">
          ${imgSrc
            ? `<img src="${imgSrc.replace(/(\?|$)/, '_64x64$1')}" alt="${nameText}" width="64" height="64" loading="lazy">`
            : '<svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="10" fill="#f0ede8"/></svg>'}
        </a>
        <div class="cp-acc-row__info">
          <a class="cp-acc-row__name" href="${productUrl}">${nameText}</a>
        </div>
        <div class="cp-acc-row__qty">
          <button type="button" class="cp-acc-row__qty-btn" data-d="-1" aria-label="Decrease quantity">−</button>
          <span class="cp-acc-row__qty-num">1</span>
          <button type="button" class="cp-acc-row__qty-btn" data-d="1" aria-label="Increase quantity">+</button>
        </div>
        <em class="cp-acc-row__price">${priceText}</em>
        <button type="button" class="cp-acc-row__remove" data-remove="${key}" aria-label="Remove ${nameText}">×</button>`;

      targetList.appendChild(li);
      this.#initAccRow(li);
    }

    // ── Spares "show more / show fewer" toggle ─────────────────────────────

    #bindSparesToggle() {
      this.querySelectorAll('[data-spares-toggle]').forEach(btn => {
        // Store the "show more" text from the initial render
        btn._showMoreText  = btn.textContent.trim();
        btn._showFewerText = 'Show fewer';

        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', () => {
          const forKey = btn.dataset.sparesToggle;
          const grid   = this.querySelector(`[data-spares-for="${forKey}"]`);
          if (!grid) return;
          const isOpen = btn.getAttribute('aria-expanded') === 'true';

          if (isOpen) {
            grid.querySelectorAll('[data-hidden-initially]').forEach(c => {
              if (!c.classList.contains('is-added')) c.classList.add('cp-addon--hidden');
            });
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = btn._showMoreText;
          } else {
            grid.querySelectorAll('[data-hidden-initially]').forEach(c => {
              c.classList.remove('cp-addon--hidden');
            });
            btn.setAttribute('aria-expanded', 'true');
            btn.textContent = btn._showFewerText;
          }
        });
      });
    }

    // ── Device remove (× button) ───────────────────────────────────────────

    #bindDeviceRemove() {
      this.querySelectorAll('.cp-dev__x[data-remove]').forEach(el => {
        el.addEventListener('click', async e => {
          e.stopPropagation();
          e.preventDefault();
          const key = el.dataset.remove;
          el.disabled = true;
          try {
            await this.#cartFetch('/cart/change.js', { id: key, quantity: 0 });
            window.location.reload();
          } catch (err) {
            console.error('Device remove failed', err);
            el.disabled = false;
          }
        });
      });
    }

    // ── Sidebar refresh ────────────────────────────────────────────────────

    async #refreshSidebar() {
      try {
        const cart    = await this.#getCart();
        const itemsEl = document.getElementById('cp-sidebar-items');
        const totEl   = document.getElementById('cp-sidebar-total-price');

        if (itemsEl) {
          itemsEl.innerHTML = '';
          for (const item of cart.items) {
            const li  = document.createElement('li');
            li.dataset.lineKey = item.key;
            const qty  = item.quantity > 1 ? ` × ${item.quantity}` : '';
            const name = this.#escHtml(item.product_title);
            li.innerHTML = `
              <span><span class="cp-sidebar__row-name">${name}${qty}</span></span>
              <span>${this.#fmt(item.final_line_price)}</span>`;
            itemsEl.appendChild(li);
          }
        }

        if (totEl) totEl.textContent = this.#fmt(cart.total_price);

        this.#updateCartCount(cart.item_count);
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
      } catch (err) {
        console.error('Sidebar refresh failed', err);
      }
    }

    #checkEmpty() {
      const hasAcc = this.querySelectorAll('.cp-acc-row').length > 0;
      const hasDev = this.querySelectorAll('.cp-dev').length > 0;
      if (!hasAcc && !hasDev) window.location.reload();
    }
  }

  customElements.define('cart-page', CartPage);
}
