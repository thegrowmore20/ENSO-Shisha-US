let cartNoteDebounce = null;

function openCartDrawer() {
  document.querySelector(".cart-drawer").classList.add("cart-drawer--active");
}

function closeCartDrawer() {
  document.querySelector(".cart-drawer").classList.remove("cart-drawer--active");
}

function updateCartItemCounts(count) {
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
  });
}

async function updateCartDrawer() {
  // Capture order-note UI state before the drawer's innerHTML is replaced,
  // so a quantity/remove change elsewhere doesn't snap an open note closed
  // or interrupt someone mid-typing.
  const noteWrapperBefore = document.getElementById("cart-note-wrapper");
  const wasNoteOpen = noteWrapperBefore ? !noteWrapperBefore.hidden : false;

  const noteFieldBefore = document.getElementById("CartNote");
  const hadFocus = noteFieldBefore ? document.activeElement === noteFieldBefore : false;
  const cursorPos = hadFocus ? noteFieldBefore.selectionStart : null;

  const res = await fetch("/?section_id=cart-drawer");
  const text = await res.text();
  const html = document.createElement("div");
  html.innerHTML = text;

  const newBox = html.querySelector(".cart-drawer").innerHTML;

  document.querySelector(".cart-drawer").innerHTML = newBox;

  if (wasNoteOpen) {
    const noteWrapperAfter = document.getElementById("cart-note-wrapper");
    const noteToggleAfter = document.querySelector(".order-note-toggle");
    if (noteWrapperAfter) noteWrapperAfter.hidden = false;
    if (noteToggleAfter) {
      noteToggleAfter.setAttribute("aria-expanded", "true");
      noteToggleAfter.classList.add("is-open");
    }
  }

  if (hadFocus) {
    const noteFieldAfter = document.getElementById("CartNote");
    if (noteFieldAfter) {
      noteFieldAfter.focus();
      if (cursorPos !== null) {
        noteFieldAfter.setSelectionRange(cursorPos, cursorPos);
      }
    }
  }

  addCartDrawerListeners();
}

function addCartDrawerListeners() {
  // Update quantities
  document.querySelectorAll(".cart-drawer-quantity-selector button").forEach((button) => {
    button.addEventListener("click", async () => {
      const rootItem = button.closest(".cart-drawer-item");
      const key = rootItem.getAttribute("data-line-item-key");

      const input = button.parentElement.querySelector("input");
      const currentQuantity = Number(input.value);

      const isUp = button.classList.contains("cart-drawer-quantity-selector-plus");
      const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;

      const res = await fetch("/cart/update.js", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: {
            [key]: newQuantity < 1 ? 0 : newQuantity,
          },
        }),
      });

      const cart = await res.json();

      updateCartItemCounts(cart.item_count);

      await updateCartDrawer();
    });
  });


  // Remove cart item
  document.querySelectorAll(".cart-drawer-item-remove").forEach((button) => {
    button.addEventListener("click", async () => {
      const rootItem = button.closest(".cart-drawer-item");
      const key = rootItem.getAttribute("data-line-item-key");

      button.disabled = true;

      const res = await fetch("/cart/update.js", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: {
            [key]: 0,
          },
        }),
      });

      const cart = await res.json();

      updateCartItemCounts(cart.item_count);

      await updateCartDrawer();
    });
  });


  // Prevent drawer close when clicking inside box
  const cartBox = document.querySelector(".cart-drawer-box");

  if (cartBox) {
    cartBox.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }


  // Close drawer
  document
    .querySelectorAll(".cart-drawer-header-right-close, .cart-drawer")
    .forEach((el) => {
      el.addEventListener("click", () => {
        closeCartDrawer();
      });
    });


  // Order note: open/close toggle.
  // Re-bound here (called after every updateCartDrawer refresh, same as the
  // quantity/remove buttons above) because the toggle and wrapper live
  // inside .cart-drawer, which gets its innerHTML replaced on every update —
  // a listener bound once at initial load would be destroyed the first time
  // a quantity changes.
  const noteToggle = document.querySelector(".order-note-toggle");
  const noteWrapper = document.getElementById("cart-note-wrapper");

  if (noteToggle && noteWrapper) {
    noteToggle.addEventListener("click", () => {
      const willOpen = noteWrapper.hidden;
      noteWrapper.hidden = !willOpen;
      noteToggle.setAttribute("aria-expanded", String(willOpen));
      noteToggle.classList.toggle("is-open", willOpen);

      if (willOpen) {
        const field = document.getElementById("CartNote");
        if (field) field.focus();
      }
    });
  }

  // Order note: save to the cart, debounced, fire-and-forget (no drawer
  // refresh — nothing else in the drawer depends on the note, and
  // refreshing mid-typing would interrupt the user despite the focus
  // restoration above).
  const noteField = document.getElementById("CartNote");

  if (noteField) {
    noteField.addEventListener("input", () => {
      clearTimeout(cartNoteDebounce);
      const value = noteField.value;

      cartNoteDebounce = setTimeout(() => {
        fetch("/cart/update.js", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note: value }),
        }).catch((error) => console.error(error));
      }, 500);
    });
  }
}

addCartDrawerListeners();

/**
 * Add-to-cart forms and "go to cart" links are delegated from `document`
 * instead of bound directly to the nodes present at page load.
 *
 * Why: the collection page's facets.js replaces product cards via innerHTML
 * (filtering, sorting) or appends new ones (load more). A direct
 * `.forEach(form => form.addEventListener(...))` binds only to the forms
 * that existed at DOMContentLoaded — any card rendered afterwards has no
 * listener, so its quick-add form falls through to a native submit and the
 * browser navigates to /cart/add instead of opening the drawer. Delegating
 * from `document` (bound once, here) covers every current AND future card
 * with no re-binding required anywhere else.
 */
document.addEventListener("submit", async (e) => {
  const form = e.target.closest('form[action="/cart/add"]');
  if (!form) return;

  e.preventDefault();

  const formSubmitBtn = form.querySelector('[type="submit"]');
  const errorEl = form.querySelector('[data-add-to-cart-error]');
  if (errorEl) errorEl.hidden = true;

  if (formSubmitBtn) {
    formSubmitBtn.setAttribute('data-loading', '');
    const spinner = formSubmitBtn.querySelector('[data-add-to-cart-spinner]');
    if (spinner) spinner.removeAttribute('hidden');
  }

  try {
    // Submit form with ajax
    const response = await fetch("/cart/add", {
      method: "post",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.description || result.message || "Unable to add to cart");
    }

    document.dispatchEvent(new CustomEvent("cart:add", { bubbles: true, detail: { item: result } }));

    // Get cart count
    const res = await fetch("/cart.js");
    const cart = await res.json();
    updateCartItemCounts(cart.item_count);

    // Update cart
    await updateCartDrawer();

    // Open cart drawer
    openCartDrawer();
  } catch (error) {
    if (errorEl) {
      errorEl.textContent = error.message;
      errorEl.hidden = false;
    }
  } finally {
    if (formSubmitBtn) {
      formSubmitBtn.removeAttribute('data-loading');
      const spinner = formSubmitBtn.querySelector('[data-add-to-cart-spinner]');
      if (spinner) spinner.setAttribute('hidden', '');
    }
  }
});

document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href="/cart"]');
  if (!link) return;
  e.preventDefault();
  openCartDrawer();
});