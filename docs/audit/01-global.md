# 01 · Global chrome audit (header, menu, search, cart, footer, overlays, tokens)

Scope: everything that appears on every page of the handoff, not page content.
Test pages driven in headless Chrome: `partner-v2/index.html` (home, transparent header), `partner-v2/faq.html` and `partner-v2/warranty.html` (inner pages), spot checks on `pdp-v2/index.html`, `pdp-v2/cart.html`, `experience/index.html`, `quick.html`, `manual.html`, `enso.html`, `app.html`. Viewports 1440x900, 1000, 990, 800 and 390x844 (touch).
Screenshots: scratchpad `shots/global/` (`d-*` desktop, `t-*` tablet, `m-*` mobile). Step files: `global-a.json` … `global-f.json`.

## Summary

- The chrome is **the same on all 21 themed pages** (checked by script: only relative link prefixes and a few stale attributes differ). `experience/app.html` is the one exception: a standalone app with no header, footer or any chrome.
- Where the code lives: header/menu/footer base CSS is in the linked `assets/5db5dbe4-styles.css` and `assets/b2d45c36-base.css`; behaviour in `assets/7bab4e74-global.js` (progress bar, mobile menu, sticky header) and `assets/03198186-site-header.js` (mega panels). The handoff's own layer is inline: `<style id="enso-overrides">` (28 KB), `<style id="enso-footer">`, the pop-up `<style>`, plus three inline scripts (cart, search, pop-up). Of the ~400 KB inline CSS per page, ~335 KB is third-party app CSS (wishlist app, Route) and is not needed.
- Several things the README or the code suggest are **not actually live** in the preview: the bottom cart bar (short-circuited by `if(true) return;`), the cart drawer (never opened), the age gate (hidden by CSS), the wishlist (hidden by CSS), the announcement bar (CSS only, no markup), the `fix-footer-mobile` bottom nav (empty section). See "Dead or disabled" below.
- Counts: 14 chrome components documented, 41 behaviours triggered and verified.

## 1. Component inventory

| # | Component | On which pages | Desktop | Mobile (390) | Data source in Shopify |
|---|---|---|---|---|---|
| 1 | Scroll progress bar `.scroll-progress-bar` | all 21 | fixed top, 3.5px, `#c8943a`, z 100, width = scroll % | same | none (theme setting on/off at most) |
| 2 | Skip link `.skip-to-content-link` | all 21 | first Tab stop, href `#MainContent` | same | none |
| 3 | Header `.site-header` | all 21 | 79px, logo left, 2 nav items centred, 3 icons right | 64px, hamburger + logo left, 3 icons right | logo: theme setting; nav: menu |
| 4 | Mega panels (2) | all 21, desktop only | full-width panel under header, product cards | not rendered (nav hidden) | menu + featured products per menu item |
| 5 | Mobile menu drawer | all 21, <990px | not reachable | left drawer 335px, accordions, socials | menu (separate mobile structure, see 3.3) |
| 6 | Search overlay `.enso-search` | all 21 (built by JS on first open) | full-screen white, 760px column | same, 24px gutters | Shopify predictive search or JSON asset |
| 7 | Cart: icon badge + toast | all 21 | amber count badge on bag icon, black toast pill | same | Shopify cart |
| 8 | Cart bar `.enso-cartbar` | none (disabled in code) | — | — | decision needed |
| 9 | Cart drawer `.cart-drawer` | markup on all 21, never opens | 480px right drawer | — | theme cart drawer |
| 10 | Footer `.site-footer` | all 21 | brand column + 3 link columns, bottom bar | stacked, 2-col links, no accordion | menus + theme settings |
| 11 | Age gate `.agegate-overlay` | markup on 20 (not home), hidden everywhere | — | — | decision needed |
| 12 | "Welcome gift" tab + pop-up | tab on the 14 partner-v2 and pdp-v2 pages; force-hidden on `/experience/` | bottom-left tab, 900x668 two-column dialog | 358px single column, photo on top | newsletter / Klaviyo |
| 13 | Back-to-devices button `.enso-goup` | **home only** | 52px round, bottom-right | 46px, bottom 83px | none |
| 14 | `.xnav` sub-navigation | experience guide pages only | breadcrumb line (+ pill row on `enso.html`) | same, pill row scrolls sideways | page template |

Also present site-wide but belonging to other audits: the out-of-stock "Remind me" dialog `#ensoRm` (localStorage `ensoRemind`), and the accessory sheet from `acc-sheet.js` (loaded only on `partner-v2/index.html`, `enso.html`, `product.html`, `pdp-v2/index.html`).

## 2. Header

### 2.1 Layout and values (measured)

| Property | Desktop 1440 | Mobile 390 |
|---|---|---|
| Height (`--site-header-height`, set by JS from `offsetHeight`, re-measured on resize with 150 ms debounce) | 79px | 64px |
| Bar padding | 0 (nav items carry `padding-block:27px`) | 16px 0 |
| Container | max-width 1440, side padding 80px, flex, gap 24px | side padding 20px, gap 12px |
| Logo | `assets/d8ae97c1-Logo_text_web-01.webp` (1938x678), rendered 112x39 at x=80 | 92x32 at x=68, right after hamburger |
| Nav | centred `<ul>`, gap 32px; link Montserrat 400 18px, no transform | hidden |
| Caret | 6px chevron drawn with borders, rotates 45°→225° on hover/open | — |
| Icons | 3 x 20px, gap 16px, at x=1268/1304/1340 | at x=278/314/350 |
| Hamburger | hidden | 20px icon at x=20 |
| Position | `fixed; top:0`, z-index 41 (40 on home) | same |
| Shadow (solid state) | `0 8px 24px rgba(149,157,165,.2)` (base.css) | same |
| Body offset | inner pages: `body{padding-top:var(--site-header-height)}` = 79px; home: 0 (header overlays hero) | 64px / 0 |

Logo colour: one dark image. On the home page while transparent it is turned white with `filter:invert(1)` on the link (`.template-index … :not(.is-scrolled) .site-header__logo`); the filter is removed when scrolled or when a mega panel is open. Footer logo uses the same file with `invert(1)`.

### 2.2 Links

| Element | Destination | Note |
|---|---|---|
| Logo | `index.html` (home) | |
| "Shop Devices" link | `index.html#` | **Goes nowhere** (top of home). `devices.html` exists but the header does not link to it |
| "Shop Accessories" link | `accessories.html` | |
| Search icon | `href="#"`, class `enso-search-open` | opens search overlay |
| Book icon (aria-label "ENSŌ Experience") | `../experience/index.html` | inline SVG open book, stroke 1.5 |
| Cart icon | `../pdp-v2/cart.html` | plain navigation, verified; aria-label stays "Cart: 0 items in cart" even with items |

### 2.3 Mega panels (desktop)

Both nav items are `site-header__nav-item--mega`. Panel: `position:absolute; top:100%`, full width, white, top and bottom border, shadow `0 12px 24px #00000014`, 302px tall, inner padding-block 32px. Cards: 200px wide, 238px tall, 1px border `#f5ebeb`, radius 12px, padding 10px, 178px square image, title Montserrat 500 16px clamped to one line. Price, rating and badge are in the markup but `display:none`.

| Panel | Contents (left to right as rendered) |
|---|---|
| Shop Devices (`--mega-product-count:2`, centred) | ENSŌ Shisha 2026 Edition → `enso.html` (img `sku/menu-enso-2026-front.jpg`, hover `sku/menu-enso-2026-back.jpg`); ENSŌ Diamond → `../pdp-v2/index.html` (img `../pdp-v2/img/g-3q-right.jpg`, hover `g-hookah.jpg`) |
| Shop Accessories (`--mega-product-count:5`, 5 x 200px, gap 16px) | ENSŌ Backpack 2.0 → `product.html#e-backpack`; ENSŌ 2026 Ceramic Cups, 3-pack → `#e-cups`; ENSŌ 2026 Battery → `#e-battery-std`; ENSŌ 2026 Mouthpiece Extension → `#e-mouthpiece`; then "View all" → `accessories.html` (first in DOM, rendered last, plain underlined text link, no border) |

Behaviours (all triggered):
1. **Opens on hover** of the nav item (also on `:focus-within`). Fade + 4px rise, 150 ms. Caret flips.
2. While open the header gets `site-header--mega-open` + `data-mega-open="true"`; on the home page this switches the transparent header to solid white with black text and un-inverts the logo.
3. Closes when the pointer leaves the item + panel.
4. **Click on the caret button** toggles a sticky `is-open` state (`aria-expanded` true/false); only one item open at a time; stays open after the pointer leaves.
5. Click anywhere outside a nav item closes it. Esc removes `is-open`.
6. Card hover: image swaps to the secondary image (`display` swap, no fade) and scales 1.06; title turns amber `#c8943a`.
7. On pages that load `acc-sheet.js` (home, `enso.html`, `product.html`, Diamond PDP) a desktop click on an accessory card does **not** navigate: it opens the accessory sheet instead (verified on home: URL unchanged, `.sheet.is-on`). On all other pages it navigates to `product.html#id`. Under 992px the link is always followed.
8. While a mega panel is open the hide-on-scroll logic is suspended.

Quirk seen: after a caret click the button keeps focus, so on the home page Esc removed `is-open` but the panel stayed visible through `:focus-within` until focus moved elsewhere.

### 2.4 Transparent vs solid, sticky and hide-on-scroll

`data-sticky="scroll_up"` on every page. Thresholds verified by stepping `scrollY`:

| scrollY | Home (first section contains `.video-hero-slider`) | Inner pages |
|---|---|---|
| 0–40 | transparent background, text/icons `#f5f1e6`, logo inverted, no shadow border, always shown | solid white, black text, shadow |
| 41+ | adds `is-scrolled`: white background, black text, logo normal | adds `is-scrolled` (no visual change) |
| >120 while scrolling **down** | adds `site-header--hidden` → `transform:translateY(-100%)` | same |
| any scroll **up** (even 1px) | header slides back in (solid) | same |

Transition: home `top .2s, transform .2s`; inner pages computed `transition: all` (no explicit duration found, so the hide is effectively instant there; NOT VERIFIED visually frame by frame). Same thresholds on mobile (verified at y=41 and y=300).
The saved HTML of `index.html`, `devices.html` and `blog-flavors.html` has `is-scrolled site-header--hidden` baked into the header class (captured mid-scroll); JS corrects it on load.

### 2.5 Breakpoints

- Base theme switches nav/hamburger at **990px**; the handoff override hides the nav at **≤991px**.
- **Bug, verified at 990px wide:** nav hidden and hamburger hidden at the same time, header collapses to 32px, no navigation at all (`t-warranty-top-990.jpg`). At 1000px desktop header is fine; at 800px mobile header is fine. Use one breakpoint in the rebuild.

## 3. Mobile menu drawer

Custom element `<mobile-menu>` wrapping the header.

- Open: tap hamburger → panel gets `data-open="true"`, `aria-expanded="true"`. Backdrop `rgba(10,10,10,.4)` fades in 200 ms, z-index 50; drawer slides in from the **left**, 250 ms.
- Drawer: width `min(360px, 86vw)` = 335px at 390, full height, white, padding 16px, column gap 32px, scrolls internally.
- Header row: logo 112px (links home) and a 20px close X on the right.
- Items (Montserrat 500 20px, 8px vertical padding, 8px gap):

| Item | Type | Children |
|---|---|---|
| Shop devices | `<details>` accordion | "ENSŌ \| 2026 Edition" → `enso.html`; "ENSŌ Diamond" → `../pdp-v2/index.html` |
| Shop accessories | `<details>` accordion | "Shop all" → `accessories.html`; "Shop Diamond" → `accessories.html#diamond`; "Shop ENSŌ Shisha" → `accessories.html#enso` |
| Guides | link | `../experience/index.html` |
| Support | link | `support.html` |
| FAQ | link | `faq.html` |

- Accordions are plain native `<details>`: **several can be open at once** (verified both open), no animation, chevron rotates. Sub-links 16px, `#333`, indented 16px, gap 12px. They stay open after the drawer is closed and reopened.
- Socials pinned to the bottom (`margin-top:auto`, 1px top border, 24px padding): Facebook `https://www.facebook.com/share/16AJipvPXs/?mibextid=wwXIfr`, Instagram `https://instagram.com/enso.future`, YouTube `https://www.youtube.com/@enso.future`, all new tab.
- Close: X button, tap on backdrop, Esc. All three verified.
- Scroll lock: JS sets `body.style.overflow='hidden'`, but `#enso-overrides` has `html,body{overflow:visible!important}`, so **the page behind still scrolls** (verified). No focus trap; focus stays on the hamburger.
- The mobile menu has Guides/Support/FAQ, which the desktop nav does not; the desktop nav has no text link to those pages at all (only the book icon and the footer).

## 4. Search

Inline script on every page; overlay is created on first open.

- Triggers: click on the search icon; pressing `/` when focus is not in an input.
- Overlay: `position:fixed; inset:0`, z-index 10000, background `rgb(255 255 255 / .98)` (page faintly visible behind), padding `96px 24px 40px`, content column `min(760px,100%)`, scrolls internally. `role="dialog"`, `aria-label="Search"`.
- Input row: `type="search"`, placeholder "Search devices, accessories, guides", Montserrat 400 28px/36px, 2px black bottom border, close "×" button at the right. Hint below: "Type to search the site. Esc closes." (hidden once a query is typed). Input auto-focused after 30 ms and cleared on every open.
- Data: one `fetch` of `partner-v2/search-index.json` (path derived from the logo href), cached for the page. 103 entries, shape `{k, t, u, s, i}` = kind label, title, URL relative to `partner-v2/`, summary, optional image. Kinds: Device 2, Page 7, Accessory · Diamond 16, Accessory · ENSŌ 2026 27, FAQ 40, Journal 3, Diamond (PDP features) 8. 58 entries have no image. All targets and images exist. On fetch failure the hint reads "Search is not available offline."
- Empty query: shows the first 8 entries of kind Device or Page (Diamond, ENSŌ Shisha 2026 Edition, Accessories, Cart, ENSŌ Experience, Support, Warranty, FAQ).
- Matching: lower-cased, split on spaces; **every word must appear** in title or summary; score +3 per word in the title, +1 in the summary; sorted by score; max 12 results; runs on every `input` event with no debounce.
- "battery" → 12 results: 3 accessories, 7 FAQ, 1 Diamond feature (`../pdp-v2/index.html#tech`), 1 page. "diamond" → 12 results: the device then 11 Diamond accessories.
- Result row: link, grid `64px 1fr`, gap 16px, padding `10px 12px`, radius 14px, hover/focus background `#f5f5f4`. Thumbnail 64x64 contain, white, 1px border, radius 10px (empty cell when no image). Text: kind 12px uppercase `.08em` `#666`; title Montserrat 700 16px/22px; summary 13px/19px `#444`. FAQ results deep-link to `faq.html#q-…`.
- Empty state: `Nothing found for “zzzqq”. Try “battery”, “cup”, “warranty”.`
- Close: × button, click on the overlay background, Esc (all verified). Enter does nothing (no results page).
- Scroll lock is attempted the same way as the menu and is equally ineffective.
- Problems: once text is typed there are two crosses (the browser's own clear button plus the close button). On a 390px screen the close button sits at x=380–411, mostly off-screen (`m-search-default.jpg`). Some summaries in the JSON are cut mid-word ("…change to a second Diamond Battery and sw").
- On desktop pages with `acc-sheet.js`, clicking an accessory result opens the sheet rather than navigating (same rule as 2.3 point 7; code read, NOT separately triggered).

## 5. Cart

### 5.1 Mechanism (inline script, identical on all pages)

- Storage: `localStorage['ensoCart']` = JSON array of lines. Verified value after three adds:
  `[{"qty":2,"id":"x-glove","name":"ENSŌ Cleaning Glove","price":7.99,"cur":"€"},{"qty":1,"id":"diamond","name":"ENSŌ Diamond","price":320,"cur":"€"},{"qty":1,"id":"d-battery","name":"Diamond Replacement Battery","price":69.99,"cur":"€"}]`
- Line shape: `id` (string, to be mapped to a Shopify variant), `name`, `price` (number), `cur` ("€"), `qty` (added by the script, starts at 1). ENSŌ 2026 lines also carry `set` (e.g. `"enso-std"`). Adding an existing `id` increments `qty`.
- Trigger: delegated click on any `[data-cart]` element; attribute holds the JSON line; `preventDefault`. 18 such buttons on the Diamond PDP, 8 on `enso.html`, none in the static HTML of other pages (the accessory sheet calls `ensoCart.add` directly).
- Public API `window.ensoCart`: `items()`, `add(line)`, `remove(id)`, `set(id, on, line)`, `clear()`, `total()`.
- Feedback on add (verified): amber count badge appears on the bag icon (`.enso-cartcount`: `#c8943a`, white Inter 700 11px, 18px pill, top -6px right -10px) and persists across pages; black toast pill "`<name>` added" bottom-centre (`bottom:96px`, Montserrat 600 13px, z 9001) for 1.8 s. No toast on `accessories.html` by design.
- The same script also forces every new page load to the top (or to its `#anchor`) and sets `history.scrollRestoration='manual'` unless the navigation is back/forward.

### 5.2 Cart bar (README item) — disabled

`render()` contains `if(true) return;` right after the badge update, so `.enso-cartbar` is never created. Verified: after adds on home and PDP no cart bar exists in the DOM. The CSS is still there; I injected the markup by hand only to record the intended design (`d-home-cartbar-FORCED.jpg`): white pill, max-width 720px, centred at the bottom, 1px border, shadow, "3 items / last item name and more", total in Inter 800 18px, black "Go to cart" pill → `pdp-v2/cart.html`, round × that **empties the whole cart**. Decision needed: build it or not.

### 5.3 Cart icon, cart drawer, cart page

- Cart icon navigates to `pdp-v2/cart.html` (verified). With items in storage that page rewrites its URL to `cart.html?set=diamond&add=x-glove%2Cd-battery` (cart page itself is another audit).
- Cart drawer markup (old theme) is in every page but never opens: `cart-drawer.js` only listens for `a[href="/cart"]` and for `form[action="/cart/add"]`, neither exists. Forced open for reference (`d-cartdrawer-forced.jpg`): overlay `#000000b3`, panel 480px from the right, `#f5f5f4`, radius `12px 0 0 12px`, header "Your cart" 18px/500 + "0 items" + X, empty state "Your cart is empty" 22.5px and a black "Continue Shopping" pill → `index.html#`. Its line-item, quantity, note and totals styles are in `assets/1d1c6c86-cart-drawer.css`.
- The six "Add To Cart" buttons in the home "Shop accessories" row are `disabled` submit buttons and do nothing when clicked (verified: no storage change, no toast). To add from home on desktop you click the card, which opens the accessory sheet, and use its button; out-of-stock items show a disabled "Out of stock" button there.

## 6. Footer

Background `#1d1d1f` flat (the old background image and overlay are switched off), white text, `padding-top:40px` + container 64px top / 12px bottom, height 426px at 1440.

| Zone | Desktop 1440 | Mobile 390 |
|---|---|---|
| Top grid | 2 columns `462px 770px`, gap 48px | 1 column, gap 32px |
| Brand column | logo 132px (inverted) → home; tagline "A Modern Twist on a Classic Ritual" 16px; newsletter; 3 social icons 20px, gap 16px | same, newsletter full width |
| Link columns | 3 equal columns, gap 32px | 2 columns (`165px 165px`, gap 28px/20px), Contact spans both |
| Bottom bar | 1px divider `rgba(255,255,255,.06)`; centred; copyright first, then policies; 14px, 70% white | policies first, copyright second; 12px |

Columns (title: Montserrat 500 18px, uppercase, letter-spacing .2em, colour `#fbbc05`; links 16px white, 12px gap; hover turns `#fbbc05` and underlines):

| Shop | Quick Links | Contact |
|---|---|---|
| Devices → `index.html#` (goes nowhere) | Support → `support.html` | Get In Touch → `support.html` |
| Accessories → `accessories.html` | ENSŌ Experience → `../experience/index.html` | `support@ensoshisha.eu` (mailto) |
| | FAQs → `faq.html` | OMNI-TECH Design Kft, Hungary → Google Maps search, new tab |
| | Journal → `blog.html` | |
| | Warranty → `warranty.html` | |

Bottom bar: "© 2026 ENSŌ Shisha EU" (links home), "Terms of service" → `https://ensoshisha.eu/policies/terms-of-service`, "Refund policy" → `https://ensoshisha.eu/pages/return-policy` (both absolute links to the live site). Payment icons row exists in markup (8 icons) but is `display:none`.

Newsletter `.enso-fs`: label "Sign up for updates" (12px/600, `.12em`, uppercase, `#c8943a`); 44px pill row with 1px `rgba(255,255,255,.22)` border; email input, placeholder "Your email address"; white "Subscribe" pill (Montserrat 700 11px uppercase). `novalidate`; JS regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- Invalid (verified): message "Enter an email address like name@example.com" under the field, `aria-invalid="true"`, focus returns to the input.
- Valid (verified): the input row is hidden and replaced by "Thank you. You are on the list." Nothing is sent or stored.

Mobile: **stacked, not an accordion**; all links always visible (`m-footer.jpg`). Footer is 830px tall at 390.

`fix-footer-mobile` section: the section wrapper is empty. Only its CSS and a wishlist-mover script remain. One side effect is live: `@media (max-width:768px){body{padding-bottom:55px}}` leaves a **55px blank white strip under the footer on phones** (verified, `m-home-bottom.jpg`). The WhatsApp/bottom-nav bar it was made for does not exist.

## 7. Age gate

- Markup (`#agegate-overlay`, `role="dialog"`) is on 20 pages; **the home page has the CSS and JS but no markup**, so the script exits there.
- Hidden everywhere by `#enso-overrides`: `.agegate-overlay{display:none!important}`.
- The script still runs (verified on `warranty.html`): if `localStorage['over-21']` is not set, after **3000 ms** it adds `is-active` to the overlay and `agegate-is-active` to `<body>` and tries to focus the Yes button. Nothing is visible. The first Esc press anywhere then silently writes `over-21 = "true"`.
- Forced visible for reference (`d-agegate-forced.jpg`): backdrop `rgb(0 0 0 / 80%)` + 10px blur, z 1000; card max-width 380px, cream `#faf6ec`, radius 16px, padding 32px, fade + rise animation. Logo 112px, heading "Are you 18 or older?" (Montserrat 600 22px), text "ENSŌ products are intended for adults only. Please confirm your age to continue.", two equal buttons, legal line "By entering you agree to our Terms & Conditions ." → `https://ensoshisha.eu/policies/terms-of-service`.
- Buttons: "Yes, I'm 18+" stores `over-21="true"` and closes (verified); "No, I'm not" redirects to `https://google.com` (code read, not clicked). Esc equals Yes. Both buttons render as identical black pills because the override restyles `.btn--outline` too; `text-transform:capitalize` shows "No, I'm Not".
- Inconsistency: the key is named `over-21`, the copy says 18. Decision needed: is an age gate wanted on the new store at all.

## 8. "Welcome gift" tab and pop-up

Tab `.enso-tab` (button, aria-label "Welcome gift: sign up for letters from ENSŌ"):
- Fixed bottom-left: `left:24px; bottom:0`, 159x35px, amber `#c8943a` (hover `#b5842f`), radius `14px 14px 0 0`, white Montserrat 600 12px uppercase `.12em`, z 9990. Mobile: `left:16px`, 141x32px, 11px text.
- Hidden below the fold line by `translateY(100%)` until it gets `is-away`. JS on scroll: `is-away` when `scrollY > 0.6 × viewport height` **and** the footer top is more than 40px below the viewport bottom. So it appears after the first screen and slides away again at the footer (both verified). Transition 350 ms.
- Under 992px it also steps aside while a sticky buy bar (`.bar.is-on` or `.mbar`) is on screen.
- Never shown on `/experience/` pages (`hidden` set by path test; verified).
- Stored state: `sessionStorage['enso_pop_gone']='1'` once the pop-up is closed or submitted; the tab is then hidden on every page for the rest of the session (verified across a page change). No localStorage.
- The pop-up never opens by itself; only the tab opens it.

Pop-up `.enso-pop__overlay` (`role="dialog" aria-modal="true"`):

| | Desktop | Mobile ≤760px |
|---|---|---|
| Overlay | `rgba(26,24,19,.55)` + 2px blur, z 9999, padding 24px, centred | padding 16px |
| Card | 900x668, grid `520px 380px`, ivory `#F8F5EF`, radius 6px | 358px wide, one column, 799px tall |
| Photo | right column, `popup/popup-photo-desktop@2x.jpg` (760x1200) | on top, 320px high, `popup/popup-photo-mobile@2x.jpg` (760x640) |
| Copy padding | `56px 56px 44px 72px` | `24px 32px 22px` |
| Logo | `popup/enso-lockup-graphite@2x.png`, 112px | 96px |
| Eyebrow "FIRST TIME HERE?" | 12px/600, `.2em`, champagne `#A8875A` | 11px |
| Title "A welcome gift" + "from the ENSŌ team" (second part champagne, own line) | Montserrat 300 40px/1.18 | 29px |
| Text | "Sign up and hear from us now and then: new arrivals, restocks and notes on the ritual." 15px | 13px |
| Field | email, placeholder "Your email address", 52px, radius 4px | 48px |
| Button "SIGN UP" | `#1d1d1f`, white, radius 64px, 13px/600 `.12em`, 52px | 48px, 12px |
| "No thanks" | underlined text button, 13px | 12px |
| Legal | "Unsubscribe any time." 11px | 10px |
| Close ✕ | white, top-right over the photo | same |

Behaviours (verified): focus moves to the email field on open; Tab is trapped inside the dialog (code read); empty or invalid submit shows "Enter an email address like name@example.com" in `#9b3b2a` and red field border; valid submit swaps to "Thank you. You are on the list." with a "BACK TO THE SHOP" button; close via ✕, "No thanks", "BACK TO THE SHOP", backdrop click or Esc; every close sets the session flag and removes the tab. Nothing is sent anywhere. Scroll lock is set on `<html>` and is defeated by the same `overflow:visible!important` rule (page behind scrolled during the test).

## 9. Small fixed elements

- **Scroll progress bar**: width = `scrollY / (scrollHeight − innerHeight)`, updated in `requestAnimationFrame`. Always visible, sits above the header.
- **Skip link**: first Tab stop on every page, but it carries both `visually-hidden` and the skip-link class, so on focus it stays a 1x1px clipped box. It is **never visible** (verified, rect 1x1). Fix in the rebuild.
- **`.enso-goup`** (home only): despite the arrow it is not "back to top". aria-label "Back to ENSŌ Diamond and ENSŌ 2026". It appears (`is-on`, fade + 12px rise) once the "signature models" section has scrolled out above the viewport, and a click smooth-scrolls to that section minus the header height (verified: landed at y=821 = section top 900 − 79). 52px circle `#1d1d1f`, `right:24px; bottom:24px`, z 40; mobile 46px, `right:16px; bottom:83px`. On mobile at the very bottom it overlaps the footer's policy line (`m-home-bottom.jpg`).

## 10. Dead or disabled (answering "rendered or leftover?")

| Thing | Verdict | Evidence |
|---|---|---|
| Announcement bar | **Leftover CSS only.** No markup on any page; `--announcement-bar-height` is `0px` | grep on all 22 files; computed var |
| Wishlist | **Markup present, never visible.** Header heart, card hearts and app CSS/JS references remain, all hidden by `[class*="wishlist"]{display:none!important}` | computed `display:none`, width 0 |
| Reviews / stars | Loox rating markup is still inside every product card (including mega menu cards, e.g. "4.8 (369)"), hidden by CSS. Must not be ported (house rule) | markup + override |
| Cart bar | Disabled in code | 5.2 |
| Cart drawer | Present, unreachable | 5.3 |
| Age gate | Hidden, script still runs | 7 |
| `fix-footer-mobile` bottom nav | Empty; only the 55px body padding survives | 6 |
| Payment icons | In markup, hidden | 6 |
| "Out of stock" badges and prices in mega cards | In markup, hidden | 2.3 |

## 11. Differences between folders

| | partner-v2 | pdp-v2 | experience |
|---|---|---|---|
| Header, footer, search, cart script, pop-up markup | baseline | identical | identical |
| Link prefixes | `x.html`, `../pdp-v2/…`, `../experience/…` | `../partner-v2/x.html`, own `index.html`/`cart.html` | `../partner-v2/…`, book icon → `index.html` |
| Transparent header | home only | no | no |
| `body` class | `template-index/page/collection/blog/article` | `template-page` | `template-page` |
| Welcome gift tab | shown | shown | always hidden |
| `.enso-goup` | home only | no | no |
| Age gate markup | all except home | yes | yes |
| `.xnav` | no | no | guide pages only |
| `app.html` | — | — | standalone, no chrome at all |

`.xnav` (inside `<main>`, directly under the header, not sticky): max-width 1200px, padding `18px 40px 0` (mobile `14px 16px 0`). A breadcrumb-style back link, 14px, 62% black: "‹ ENSŌ Experience / **ENSŌ Diamond**" → `index.html#diamond` on `quick`, `manual`, `packing`, `cleaning`, `diamond`; "‹ ENSŌ Experience / **ENSŌ 2026 Edition**" → `index.html#enso` on `enso.html`. Only `enso.html` also has the pill row `.xnav__row`: Quick start → `enso.html#quick-start`, Full manual (current, black pill), Troubleshooting → `enso.html#troubleshooting`, Flavour guide → `../partner-v2/blog-flavors.html`, Accessories → `../partner-v2/accessories.html#enso`. Pills: 1px border, radius 999px, padding `8px 16px`, 14px/500; on mobile the row scrolls sideways with no scrollbar (662px content in 358px). The Diamond guide pages have the CSS for the row but no row.

## 12. Design tokens

`:root` (inline `<style data-shopify>`):

| Group | Values |
|---|---|
| Fonts | `--font-heading` Montserrat; `--font-body` Montserrat; `--font-accent` Inter |
| Spacing | `--space-1…8` = 4, 8, 12, 16, 24, 32, 48, 64px |
| Radius | sm 6, md 8, lg 12, xl 16, pill 999px |
| Layout | `--page-width` 1440px; `--page-margin` 80px (20px ≤749px); `--page-margin-mobile` 20px; container switches to mobile margin ≤989px |
| Badges | sold-out `#000`/`#fff`; sale `#EA4335`/`#fff` |
| Shadows | sm `0 1px 3px rgba(10,10,10,.07)`; md `0 12px 32px rgba(10,10,10,.10)`; lg `0 24px 60px rgba(10,10,10,.16)` |
| Easing | `--ease-out: cubic-bezier(.16,1,.3,1)` |
| Runtime | `--site-header-height` (JS), `--announcement-bar-height` 0px |

Colour schemes (each sets background, raised, text, muted, border, accent, accent-soft and primary/secondary button sets):

| Class | Background | Text | Muted | Border | Accent | Used by |
|---|---|---|---|---|---|---|
| `.color-scheme-paper` | `#faf6ec` | `#0a0a0a` | `#5a554b` | `#e3ddcc` | `#c8943a` | cart drawer, age gate, some sections |
| `.color-scheme-graphite` | `#1a1813` | `#f0e8d8` | `#8a8070` | `#3a3731` | `#c8943a` | not used by chrome |
| `.color-scheme-2c477b01-…` | `#ffffff` | `#000000` | `#333333` | `#333333` | `#c8943a` | header, mobile drawer |
| `.color-scheme-c77ef17d-…` | `#333333` (overridden to `#1d1d1f`) | `#ffffff` | `#ffffff` | `#ffffff` | `#fbbc05` | footer |

Colours the handoff layer actually uses: black `#1d1d1f`, hover `#000` / `#3a3a3c`; sand `#c8943a`, hover `#b3832f` / `#b5842f`; light grey `#f5f5f4`; page background forced to `#fff`; pop-up ivory `#F8F5EF`, graphite `#302E29`, champagne `#A8875A`; error `#9b3b2a`; focus ring `#96671f` or `--color-accent`, 2px.

Buttons (computed on the home page):

| Class / context | Background | Text | Shape | Type |
|---|---|---|---|---|
| `.btn` base | — | — | height 44px (40px ≤749px), padding `0 40px` (`0 28px` ≤589px), radius 999px, 1px border | Montserrat 500 16px (15px mobile), `text-transform:capitalize`, hover opacity .88, active scale .98 |
| `.btn--primary`, `.signature-model__cta`, `.quick-add-button` on light | `#1d1d1f` (hover `#000`) | `#fff` | pill | as base |
| `.btn` inside hero slider, split banner, footer, `.enso-acc`, `.enso-exp`, `.enso-drow` (dark/photo backgrounds) | `#c8943a` (hover `#b3832f`) | `#fff` | pill | as base |
| `a.btn--outline`, "View all" links | none | `#000` | no padding, no border | underlined text link, offset 4px |
| Pop-up, newsletter, cart bar, "Remind me" buttons | own classes, see sections above | | | uppercase, letter-spaced 11–13px |

Rule of thumb written in the CSS comment: "buttons: black on light, sand on dark".

Typography in chrome: body Montserrat 400 16px/1.4, black on white. `.eyebrow` Montserrat 500 16px (18px in footer) uppercase `.2em`, accent colour. `.h-catalog`, `.h-feature`, `.caption` utility classes as in `base.css`. `.enso-h2` = Inter 800 42px/46px, `-.025em`.
Fonts shipped: Montserrat 200/300/400/500/600 and **Inter 600 only** (woff2 in `assets/`). CSS asks for Montserrat 700 and Inter 800 in many places (search titles, cart bar, `.enso-h2`), so the browser synthesises bold. The only Google Fonts request in the page is Titillium Web from a third-party app, which nothing in the chrome uses.

## 13. Problems and open questions

1. **No working scroll lock anywhere.** `html,body{overflow:visible!important}` defeats the lock in the mobile menu, search and pop-up; the page scrolls behind all three.
2. **Dead zone at 990–991px**: neither nav nor hamburger (two different breakpoints).
3. **Cart bar from the README does not exist** in the build (`if(true) return;`). Build the theme cart drawer only, or also this bar? The home page "Add To Cart" buttons are disabled dummies.
4. **"Shop Devices" (header) and "Devices" (footer) link to `index.html#`**, not to `devices.html`. Which is intended?
5. **Stale product data in the mega menu**: "ENSŌ Backpack 2.0 €99.99" vs the sheet's "ENSŌ Backpack 3.0 €119.99"; ENSŌ 2026 shows "€420.00" in hidden price markup on most pages and "From €390" on home; everything flagged "Out of stock". Feed these from Shopify.
6. **Skip link is never visible**; mobile search close button is off-screen; two crosses in the search field.
7. **Age gate**: wanted or not? Currently invisible but writes `over-21` on the first Esc; missing from the home page; key says 21, copy says 18; "No" sends people to google.com.
8. **55px blank strip under the footer on phones** from the leftover `fix-footer-mobile` CSS; back-to-devices button overlaps the footer legal line on phones.
9. **House-rule leftovers hidden only by CSS**: Loox star ratings and review counts, wishlist hearts, payment icons. Do not port the markup. Footer policy links and the age-gate terms link point at the live `ensoshisha.eu`.
10. Desktop nav has no route to Support, FAQ, Journal or Warranty except the footer; mobile menu has Guides/Support/FAQ. Confirm the intended menus. Mobile label "ENSŌ | 2026 Edition" differs from "ENSŌ Shisha 2026 Edition" used elsewhere.

No JavaScript exceptions were reported by the driver on any chrome interaction.
