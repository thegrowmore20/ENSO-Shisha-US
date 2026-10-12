/**
 * Smooth accordion — shared across FAQ, Diamond specs, and any future section.
 * Targets: details[data-accordion]
 * Panel:   first direct child that is not a <summary>
 *
 * Options via data attributes on <details>:
 *   data-accordion-group="name"  — only one item in the group stays open at a time
 *   data-accordion-open          — present = starts open (same as the `open` attribute)
 */
(function () {
  'use strict';

  const ATTR = 'data-accordion';
  const DURATION = 280;
  const EASING = 'ease-out';
  const initialised = new WeakSet();

  /** Find the animated panel — first non-summary direct child. */
  const panelOf = (details) =>
    [...details.children].find((el) => el.tagName !== 'SUMMARY') || null;

  /** All open accordion siblings sharing the same group name. */
  const openSiblings = (details) => {
    const group = details.dataset.accordionGroup;
    if (!group) return [];
    return [...document.querySelectorAll(`details[data-accordion][data-accordion-group="${group}"][open]`)]
      .filter((d) => d !== details);
  };

  class AccordionItem {
    #el; #summary; #panel; #anim = null; #closing = false; #expanding = false;

    constructor(details) {
      this.#el = details;
      this.#summary = details.querySelector(':scope > summary');
      this.#panel = panelOf(details);

      if (!this.#summary || !this.#panel) return;
      this.#summary.addEventListener('click', (e) => this.#onClick(e));
    }

    #onClick(e) {
      e.preventDefault();
      if (this.#closing || !this.#el.open) {
        /* Close any open siblings first (animated). */
        for (const sib of openSiblings(this.#el)) {
          initialised.has(sib) && sib._accordion?.close();
        }
        this.open();
      } else {
        this.close();
      }
    }

    #cancel() {
      if (!this.#anim) return;
      this.#anim.onfinish = this.#anim.oncancel = null;
      this.#anim.cancel();
      this.#anim = null;
    }

    open() {
      this.#cancel();
      const el = this.#el;
      el.style.overflow = 'hidden';
      el.style.height = el.offsetHeight + 'px';
      el.open = true;
      el.classList.add('is-open');
      this.#closing = false;
      this.#expanding = true;

      requestAnimationFrame(() => {
        const end = this.#summary.offsetHeight + this.#panel.offsetHeight;
        this.#anim = el.animate(
          { height: [el.offsetHeight + 'px', end + 'px'] },
          { duration: DURATION, easing: EASING }
        );
        this.#anim.onfinish = () => this.#finish(true);
        this.#anim.oncancel = () => this.#finish(true);
      });
    }

    close() {
      this.#cancel();
      const el = this.#el;
      el.style.overflow = 'hidden';
      el.classList.remove('is-open');
      this.#expanding = false;
      this.#closing = true;

      this.#anim = el.animate(
        { height: [el.offsetHeight + 'px', this.#summary.offsetHeight + 'px'] },
        { duration: DURATION, easing: EASING }
      );
      this.#anim.onfinish = () => this.#finish(false);
      this.#anim.oncancel = () => this.#finish(false);
    }

    #finish(open) {
      this.#el.open = open;
      this.#anim = null;
      this.#closing = false;
      this.#expanding = false;
      this.#el.style.height = '';
      this.#el.style.overflow = '';
    }
  }

  function initAccordion(root) {
    root.querySelectorAll(`details[${ATTR}]`).forEach((details) => {
      if (initialised.has(details)) return;
      initialised.add(details);
      const item = new AccordionItem(details);
      details._accordion = item; /* allow siblings to call .close() */
    });
  }

  document.addEventListener('DOMContentLoaded', () => initAccordion(document));
  document.addEventListener('shopify:section:load', (e) => initAccordion(e.target));
})();
