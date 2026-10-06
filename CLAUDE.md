## Shopify Theme Development Guidelines (ENSO Shisha)

You are an Expert Shopify Theme Developer with advanced knowledge of Liquid, HTML, CSS, JavaScript, and the latest Shopify Online Store 2.0 features. This repo (`ENSO Shisha V2`) is the **ENSO storefront theme being reworked to match the HTML handoff** (see Build Directive). Generic Shopify/Liquid reference (filters, tags, objects, schema examples) lives in `AGENTS.md`; this file holds the rules specific to this theme.

**Base = the existing ENSO theme.** The user restored the old theme's files here (2026-10-06) as the starting point; the handoff HTML was itself built on this theme, so header, footer, cart drawer, tokens and several sections already match in structure. Work page by page: reuse and slim an existing section where the HTML uses it, write new sections where it does not, and remove old files once nothing references them. Unreferenced sections/snippets/assets were already pruned on 2026-10-06 (recoverable with `git show HEAD:<path>`); check a file exists before relying on a name mentioned below. Per-page behaviour and typography audits of the HTML are in `docs/audit/`; the work list is `to-do.md`.


## Build Directive: HTML handoff → performance theme

- **Source of truth for design:** the static HTML handoff at `C:\Users\user\Downloads\ENSO-shopify-handoff-2026-10-05\shopify-handoff-html\site` (`partner-v2/` home, ENSŌ 2026, accessories, help pages, journal · `pdp-v2/` Diamond PDP and cart · `experience/` guides, manuals, help app). Read its `README.md` and `help-app-HANDOVER.md` before touching a page they cover
- **Same layout, exactly.** Each theme page must match its HTML page at desktop (1440) and mobile (390): same structure, order, spacing, type and imagery. Nothing distorted, no pixelated or degraded images
- **But not the same code.** The HTML pages are saved copies of the old theme with ~400KB of inline CSS and ~50KB of inline JS each, a 231KB Instagram widget script, and autoplaying MP4s. Rebuild each section cleanly: only the CSS/JS that section needs (`{% stylesheet %}` / `{% javascript %}`), Shopify CDN images with `srcset`/`sizes`, lazy media below the fold, one eager LCP image per page, no third-party widget where a native section can do it
- **Page by page.** Analyze the HTML page (render it — don't judge from source alone), agree the plan with the user, build, compare screenshots against the HTML, then move to the next page. Ask the user for missing assets or decisions instead of guessing
- **Wire to real Shopify:** `data-cart` buttons → real variants via `/cart/add.js` and the theme cart drawer; prices from Shopify, never hardcoded; `search-index.json` → predictive search; `product.html#<id>` → real product pages; forms → Shopify customer/contact forms. Keep cross-page anchors working (`manual.html#charge-while-smoking`, `app.html#diamond-fix`, …)

### House rules (from the client README — check before calling a page done)
- No reviews and no star ratings anywhere (don't render `star-rating` or the `reviews` section)
- No italic type
- Headings, eyebrows and buttons never end with a full stop
- Always ENSŌ with the macron: ENSŌ, ENSŌ Diamond, ENSŌ 2026 Edition, ENSŌ Experience
- Never call the guides, the app or support "free"
- Images are approved one by one: use the supplied files as they are — no recolouring, filters or generated replacements; ask for a new crop if a slot needs one
- Sand accent is `#c8943a`; fonts and colours otherwise come from the theme


## Global settings and shared snippets (built 2026-10-06)

- **Theme settings groups:** Logo and favicon, Colors, Buttons, Typography, Layout, Cart, Social media, Social sharing image, Badges, Product cards. All labels are `t:` keys in `locales/en.default.schema.json`
- **Logo:** `settings.logo`, `logo_width`, `logo_width_mobile`, optional `logo_inverse`. Always render it with `{% render 'site-logo' %}` (pass `inverted: true` on dark backgrounds); never hardcode a logo URL
- **Cart:** `settings.cart_type` is `drawer` or `page`; `layout/theme.liquid` only renders the drawer section and loads `cart-drawer.js`/`.css` for `drawer`. Free shipping bar: `free_shipping_enable`, `_threshold`, `_message_before`/`_after`, `_fill_color`/`_track_color`, optional `_markets`/`_countries` allow-lists, rendered by `{% render 'cart-shipping-bar' %}`
- **Social:** `settings.social_<network>_link` (facebook, instagram, youtube, tiktok, pinterest, x), rendered anywhere with `{% render 'social-icons' %}`
- **Header / footer:** `sections/header.liquid` and `sections/footer.liquid` match the handoff; their CSS lives in their own `{% stylesheet %}` blocks, not in `base.css`. The header's transparent-over-hero state is pure CSS keyed on the first section containing `.video-hero-slider`; `global.js` mirrors that selector

## Liquid Development

- Use `{% liquid %}` for multiline logic
- Maintain proper closing order; use object dot notation
- Apply defensive coding (blank checks, `default` filters) — never assume a setting or metafield is set
- Use nested `if` instead of mixing `and`/`or` (no parentheses or ternaries in Liquid)
- Every user-facing string goes through `t` and `locales/en.default.json` (hierarchical snake_case keys, max 3 levels, sentence case, English only). Editor-facing schema labels use `t:` keys too, with matching entries in `locales/en.default.schema.json`
- Make sure no translation key is missing before finishing a change
- `locales/en.default.json` carries an "auto-generated" header comment — keep it and the JSON valid


## Theme Architecture

- `sections/` customizable page areas · `blocks/` configurable elements · `snippets/` reusable fragments (`card-product`, `price`, `star-rating`, `button`, `meta-tags`, `css-variables`, icon snippets, …) · `layout/theme.liquid` · `config/` · `assets/` · `locales/` · `templates/` (JSON)
- Page-type templates exist for default, custom-enso and diamond-pre-order products, plus contact / faq / happy-customers / warranty pages
- Header and footer are sections (`header-group.json`, `footer`); `cart-drawer` and `age-verification-popup` are rendered globally from `theme.liquid`
- Snippets and statically rendered blocks need a `{% doc %}` header


## UX Principles (theme editor)

- Settings should be simple, clear, and non-repetitive
- Order settings by visual impact and element placement; group related settings under headings
- Avoid word duplication between headings and labels
- Use conditional settings judiciously (max 2 levels deep)
- Prefer the existing color-scheme picker and shared settings keys (`t:sections.all.*`) over inventing new ones


## HTML Standards

- Semantic HTML with modern features
- ID naming in CamelCase; append block/section IDs where several instances can exist
- Interactive elements must stay focusable; use `tabindex="0"` sparingly


## CSS Guidelines

- Avoid ID selectors; keep specificity at 0-1-0 with single class selectors; BEM naming
- Limit nesting to first level except for media queries
- Mobile-first queries with the `screen` descriptor; breakpoints in use: 750px (tablet), 990px (desktop) — match the existing file you're editing
- **Never hardcode colors.** The theme uses a Horizon-style color palette, not color schemes: one `color_palette` setting (Theme settings > Colors; keys `background`, `foreground`, `white`, `ink`, `graphite`, `sand`, `sand_deep`, `bronze`, `gold`, `paper`, `cream`, `ivory`, `linen`, `mist`, `stone`, `line`, `champagne`, `error`, `sale`) and role settings that default to palette colors. `snippets/css-variables.liquid` outputs both: `--palette-<key>` for a raw palette color, and the roles `--color-background`, `--color-background-raised`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-accent-hover`, `--color-focus`, `--color-error`, `--color-inverse-background` / `-text`, `--color-primary-button-*`, `--color-accent-button-*`, `--color-secondary-button-*`, `--badge-sold-out-*` / `--badge-sale-*`. Prefer a role; use a `--palette-*` variable only when no role fits. A new color in the design is added to the palette default in `config/settings_schema.json` first (max 20 keys, hex without alpha)
- **Per-section colors:** a section that can change color gets two `color` settings, `color_background` and `color_text`, whose defaults reference the palette (`"default": "{{ settings.color_palette.ink }}"`), renders `surface-colors` with them, and puts the `color-surface` class on its wrapper. The snippet re-points the role variables for that section and derives muted text, borders and raised surfaces, so never assume light-on-dark or dark-on-light. Do not add `color_scheme` settings
- Use the shared tokens instead of magic numbers: spacing `--space-1…8`, radius `--radius-sm…xl/pill`, `--shadow-sm/md/lg`, `--page-width`, `--page-margin`, `--announcement-bar-height`
- **Typography** comes from Theme settings > Typography through variables; never set a raw font family or a numeric weight. Families: `--font-heading` (Montserrat), `--font-body` (Montserrat), `--font-subheading` (Montserrat, eyebrows and labels), `--font-accent` (Inter, display headings and prices). Weights: `--font-weight-regular` 400, `-medium` 500, `-semibold` 600, `-bold` 700, `-heavy` 800 (and `--font-<role>-weight` for each picker). Sizes: `--font-size-body`, and the heading scale `--font-size-h0` … `--font-size-h6` (64/48/36/30/24/20/18px, switching to 44/32/28/24/20/18/16px at 768px) used by the `.h0`–`.h6` classes; the older `.h-display`, `.h-product`, `.h-section`, `.h-catalog`, `.h-feature`, `.body-text`, `.caption`, `.eyebrow`, `.stat` classes remain. `snippets/theme-fonts.liquid` loads only body 400/500/600/700 and accent 600/800 plus each picked variant: a design that needs another weight must add it there
- Buttons use `.btn` + `.btn--primary` (black on light backgrounds) / `.btn--accent` (sand, on dark and photo backgrounds) / `.btn--secondary` / `.btn--outline` (+ `.btn--full`); height is 44px. The cart drawer deliberately overrides this to `height: auto`
- Text on a colored/photo background must keep at least 4.5:1 contrast (3:1 for text ≥24px, or ≥19px bold). Gold accent `#C8943A` on the cream background is below 4.5:1 for body-size text — use it for large text/decoration only, and never put muted gray lighter than roughly `#55636b` on a white/light background for body-sized text
- Scope section/snippet CSS in that file's `{% stylesheet %}` tag. `assets/base.css` is for genuinely shared CSS only (reset, `.container`, `.grid--*`, typography scale, `.btn`, shared snippet styles). Per-feature stylesheets already in `assets/` (`cart-drawer.css`, `main-product.css`, `breadcrumbs.css`, `comparison-table.css`, `diamond-preorder.css`) stay there; a new feature gets a `{% stylesheet %}` block, not a new asset file


## JavaScript Principles

- Minimize external dependencies; prioritize native browser features
- Avoid `var`; prefer `const` over `let`; use `for...of` instead of `forEach()`
- Use module patterns/IIFEs to avoid global scope pollution; prefix private methods with `#`
- Interactive components are **custom elements** (`mobile-menu`, `carousel-slider`, `lazy-video`, `load-more-grid`, `product-recommendations`, `product-info`, `product-media-gallery`, `sticky-add-to-cart`, `product-card-swatches`, `cart-shipping-bar`). New components should follow that pattern (`customElements.define`, guard against double definition) rather than adding ad-hoc `querySelectorAll` listeners
- Script placement: `assets/global.js` holds the site-wide custom elements and layout-level behavior (scroll progress bar, mobile menu, carousel, lazy video, load-more, recommendations). Feature scripts live in their own asset (`cart-drawer.js`, `product-form.js`, `product-card-swatches.js`, `site-header.js`, `facets.js`, `wishlist-reveal.js`) loaded `defer` by the section/layout that needs them. New section-only behavior belongs in that section's `{% javascript %}` block (one per file; no Liquid inside it)
- Cart state is cross-section. The cart drawer (`cart-drawer.js`) owns open/close, line-item mutation and re-rendering; other pieces talk to it through events on `document`: `cart:add`, `cart:updated`, `cart:change`, `cart:refresh` (consumed by `cart-shipping-bar.js`) and `variant:change` (dispatched by `product-form.js`). Reuse these events instead of calling drawer internals, and update only the fragment you own — never blind-replace a whole section
- Mobile menu drawer: follows the handoff, so nested items are native `<details>` (several can be open at once, no animation). The drawer can use its own menu (header setting "Mobile menu"). One breakpoint, 990px, switches the desktop nav and the hamburger: never introduce a second one


## Accessibility & SEO

- Every `image_tag`/`img` needs an explicit `alt`: a real description when the image carries information the surrounding text doesn't; `alt: ''` only for genuinely decorative images
- Every page must render a non-empty `<meta name="description">`. `snippets/meta-tags.liquid` already builds `meta_description` as `page_description | default: shop.description | default: shop.name`; the tag is currently wrapped in `{% if meta_description != blank %}` — that can only be blank if the shop name is, but keep the fallback chain intact
- Never leave a meta tag with an empty `content=""`. `theme-color` in `layout/theme.liquid` follows the page background setting
- Icon-only controls (search/cart/account/menu) always need `aria-label`; links need a real `href` (no `href="#"`) and descriptive, unique text
- The skip-to-content link and `<main id="MainContent">` exist in `theme.liquid` — don't remove them. The mobile menu trigger uses `aria-expanded`; keep that state in sync when changing the menu
- Respect the age-verification popup: any new full-screen overlay must not trap focus or sit above it (`z-index: 1000`)
- Run a Lighthouse pass (Accessibility, SEO, Best Practices) after changes to `layout/theme.liquid`, `meta-tags.liquid`, or images


## Performance Optimization

- Serve images through Shopify's CDN (`image_url` + `image_tag`) with `widths`/`sizes` so `srcset` is generated; use `loading: 'lazy'` below the fold and `fetchpriority="high"` / eager for the hero/LCP image
- Fonts are loaded with `font_face: font_display: 'swap'` in `theme.liquid`; keep the number of weights low
- Lazy-load videos (`lazy-video`) and avoid autoplaying heavy media above the fold
- Don't add render-blocking scripts; use `defer`. `cart-drawer.css` is currently a render-blocking `<link>` in `<head>` — prefer moving new CSS into `{% stylesheet %}`
- Monitor with Lighthouse and Shopify Theme Check

**Known gaps (verified against the theme; fix when touching the related file)**
- No `Product`/`Organization` JSON-LD is output (`meta-tags.liquid` only emits meta/OG tags). If adding it, base it on real data only (variant offers, availability); do not invent price-validity dates or part numbers
- No Speculation Rules block and no manual `preconnect` beyond `cdn.shopify.com` — add only after a real network-waterfall check
- `sections/fix-footer-mobile.liquid` and the `ai_gen_block_*` blocks look like patch/generated files; prefer fixing the footer section itself rather than extending them


## Section Schema Convention

Use a `t:` name, translated setting labels, and a preset. Prefer the shared `section-attrs` / `apply-color-vars` snippets for wrapper class, width, and color overrides (see `sections/rich-text.liquid`).

```
{% schema %}
{
  "name": "t:sections.section_name.name",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:sections.section_name.settings.heading.label", "default": "Default heading" }
  ],
  "blocks": [],
  "presets": [{ "name": "t:sections.section_name.presets.name" }]
}
{% endschema %}
```


## UI Components

### Sliders
- Reuse `carousel-slider` and `snippets/carousel-styles.liquid` rather than writing a new slider
- For new arrow controls: 35×35px on mobile and 40×40px from 750px up, translucent white background (`rgba(255, 255, 255, 0.7)`), `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`, 20×20px icon colored with `var(--color-text)`, positioned symmetrically (`left/right: 2px` on mobile, `10px` from 750px up) with no negative-margin overflow
- Existing arrows in `carousel-styles.liquid` may not match this spec yet — check before assuming

### Product cards
- Use `snippets/card-product.liquid` and `price`; don't duplicate card markup per section. Do not render `star-rating` (house rule: no ratings)


## Working in this repo

- Build here, at the repo root (old ENSO theme as base: JSON templates, `sections/`, `header-group.json`)
- Files deleted in the 2026-10-06 prune show as deleted against `HEAD`; that is intentional. Do not `git restore` or commit without the user asking
- Before deleting a section, snippet or asset, confirm nothing references it (templates and section groups JSON, `render` calls, `asset_url`), then re-check for snippets orphaned by the deletion
- Still present but against house rules or slated for replacement — remove when the page that uses them is rebuilt: `sections/reviews.liquid`, `snippets/star-rating.liquid`, Loox app blocks in templates, `templates/page.happy-customers.json`, `blocks/ai_gen_block_*`, `sections/product-meta-shorts.liquid`, `sections/image-slider.liquid`, `sections/image-before-after.liquid`, `sections/fix-footer-mobile.liquid`
- Shopify CLI is installed (4.8.4); previewing needs the user's store and login
