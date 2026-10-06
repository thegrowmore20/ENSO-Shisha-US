# 05 · Accessories, help pages and Journal: behaviour audit

Scope: `partner-v2/accessories.html`, `faq.html`, `support.html`, `warranty.html`, `blog.html`, `blog-electronic.html`, `blog-flavors.html`, `blog-tobacco.html`. Shared header, footer, cart drawer, age gate and the "Welcome gift" tab are out of scope (see `01-global.md`); they are only mentioned where they collide with these pages.

Method: every page was driven in headless Chrome at 1440x900 and 390x844 (plus 800 and 1100 where a breakpoint exists). Everything below was either triggered in the browser or read from the page's own inline CSS/JS. Items that could not be checked are marked NOT VERIFIED. Screenshots are in the scratch dir under `shots/acc/` (names quoted in brackets).

## Summary

| Page | Sections | What it is technically |
|---|---|---|
| Accessories | 6 (hero, sticky bar, tools row, filter panel, grid, detail sheet) + mobile bar, toast, remind modal | A client-rendered collection: 46 SKUs in a JS array, rendered as 39 cards. All state lives in JS and `localStorage` |
| FAQ | 2 (theme banner, FAQ section with search, 3 tabs, 66 accordions, footer note) | Old theme `faqs-page` section plus a small ENSŌ script for tabs, search and deep links |
| Support | 4 (theme banner, contact section with form, 3 icon links, empty custom-liquid) | 100% old theme sections, no page JS |
| Warranty | 6 blocks in one static section | Static HTML/CSS, no JS, no images |
| Journal index | 6 (header, featured, two-up, three-up, dark feature, list) | Static, curated, hand-linked; 3 local articles, 8 links to the live site |
| Articles x3 | Theme article template (date, title, hero image, rich text) | The rich text is a pasted, self-styled HTML document with its own palette and fonts; the three differ from each other |

Top findings (details in each page's "Problems" list):

1. Accessories: the sticky tab/total bar and the fixed site header fight for the same strip. The bar sticks at `top:0`, the header is `position:fixed` 81 px tall and reappears on scroll-up, covering the bar completely.
2. Accessories prices are EUR on screen but the cart payload stores `cur:'$'` for every non-Diamond item; 3 products are "photo coming soon" placeholder JPGs; 4 cards + 3 variants are out of stock, and the card-level "remind me" path in the JS is dead code.
3. Article FAQ accordions are broken in 2 of 3 articles: in `blog-electronic` the 12 answers can never be opened (no script), in `blog-tobacco` all 8 answers are permanently open (no script, no-JS fallback). Only `blog-flavors` works.
4. Roboto: all three article bodies set `font-family:'Roboto',Arial,sans-serif` in CSS pasted inside the article content. Only `blog-electronic` actually loads Roboto (a Google Fonts `<link>` sits inside the article body). It is legacy content styling from the .com blog, not theme typography, and it contradicts the README rule "fonts and colours come from your theme".
5. Support contact form posts to `#` (page reloads, fields cleared, no message); the third block "custom liquid" is empty; none of the help pages has an `<h1>` except Warranty.

---

## 1. Accessories (`partner-v2/accessories.html`)

Wrapper: `<main id="MainContent" class="enso-accshop">`. Page CSS is one inline `<style>` (about 16 KB, classes `.hero .bar .seg .tools .tsearch .tfilt .tcols .fp .grid .card .opts .sheet .mbar .toast .rm-*`), page JS is the last inline `<script>` (33 KB) holding the `ITEMS` array and all behaviour. `acc-sheet.js` is not used by this page (it serves `product.html`).

### 1.1 Section inventory

| # | Section | Desktop 1440 | Mobile 390 | Content source |
|---|---|---|---|---|
| 1 | Hero `.hero` | Full width, 460 px high (`min-height:min(52vh,460px)`), image `object-fit:cover; object-position:50% 78%`, dark gradient from the top (rgb(29 29 31/.78) to 0 at 70%). Only an `<h1>` "Accessories", top-left, 48 px from the top, inside a 1600 px wrap with 40 px gutters. No subtitle, no button | 520 px high, portrait image via `<picture><source media="(max-width:991px)">`, h1 36/40 | Collection title + collection image (two crops). Merchant-editable |
| 2 | Sticky bar `.bar` | White, 65 px, bottom hairline, `position:sticky; top:0; z-index:35`. Left: segmented control All / ENSŌ / Diamond (pill on `#f5f5f4`, active pill black). Right: "0 items", total (Inter 800 20 px), black pill "Go to cart" | Only the segmented control; count/total/button are `display:none` and move to the fixed bottom bar (row 8) | Tabs = device filter (tag or metafield). Count/total = cart |
| 3 | Tools row `.tools` | 28 px below the bar. Search pill (max 480 px, 48 px high, 1.5 px border, magnifier icon), "Filter" pill button with icon and a hidden count badge, then right-aligned "Per row" label + range slider (140 px) + number | Search full width on its own row, Filter full width under it (centred label). "Per row" hidden | UI only |
| 4 | Filter panel `#fpanel` | Right-hand drawer, 420 px wide, full height, backdrop rgb(0 0 0/.4). Title "Filter and sort", close X, three fieldsets (below), sticky footer with "Clear all" (underlined text) and black pill "Show results" | Bottom sheet, full width, `max-height:86vh`, top corners 22 px | Shopify sort_by + availability filter + device filter |
| 5 | Grid `#grid` | 4 columns by default (`repeat(var(--cols,4),1fr)`, gap 20 px, cards 325 x 572), padding 40 px top / 96 px bottom | 2 columns, gap 14 px, cards 168 wide, padding 24 / 140 px (room for the bottom bar) | Collection products |
| 6 | No-results line `#noresults` | Grey sentence "Nothing matches your search. Try another word, or show all accessories." with an inline underlined button | Same | UI text |
| 7 | Detail sheet `#sheet` | Centred modal 960 px wide, radius 28 px, `max-height:88vh`, two columns (5fr media / 6fr text), gap 36 px | Bottom sheet, full width, top corners 28 px, one column, media 4:3 | Product data |
| 8 | Mobile bottom bar `.mbar` | Hidden | Fixed bottom, white, top hairline, 80 px: count (small) over total (Inter 800 20 px) on the left; round 46 px "back to top" arrow button and "Go to cart" pill on the right. Shown at every width up to 991 px | Cart |

Nothing follows the grid: after the last row comes the footer directly (no pagination, no load-more, no SEO text, no related block).

### 1.2 Product data

46 entries in `ITEMS`, each `{id, dev: 'diamond'|'enso'|'both', name, price, img, img2?, sub, what, why, how, pair?, grp?, opt?, gname?, oos?, ph?}`. Entries sharing a `grp` are variants of one card, so the grid shows **39 cards**:

| Group (tab) | Cards | Notes |
|---|---|---|
| Diamond (`dev:'diamond'`) | 15 | Battery 69.99, Ceramic Cups 2-pack 19.99, Mesh Screen Baskets (2-pack 16.99 / 5-pack 24.99), Flat Mesh Screens 7.99, Thermo Cap without Silicone 35.99, Thermo Cap Metal 26.99, Top Cap Silicone Part 5.99, Adapter Long 3.99, Adapter Short 3.99, Side Shaft Silicone Covers 2.99, Cup Removal Tool 18.99, Cleaning Brush 3.99, USB-C Cable 4.99, Travel Bag 34.99, String Bag 6.99 |
| Universal (`dev:'both'`) | 2 | ENSŌ Cleaning Glove 7.99, ENSŌ Filling Set 14.99. Shown under every tab |
| ENSŌ 2026 (`dev:'enso'`) | 22 | Angel Cloud Elite, Backpack 3.0 (119.99), Glass Thermo Cap, Hose Adapters pair, Disposable Hose Adapter, Purge Valve, 3-in-1 Multi-Tool, Battery Plus, Battery, Mesh Screens and Wax Pads, Mesh Screen Kit, Glass Tank, Acrylic Tank, Dip Tube, Glass Collar, Ceramic Cups 3-pack, Flower Cups 2-pack, Disposable Cups (20 / 50), Hose 1.5 m (1.2 / 1 / 0.8 cm), Mouthpiece, Cup Removal Tool, Leather Strap (Beige / Black) |

Tab counts as driven: All 39, Diamond 17 (15 + 2 universal), ENSŌ 24 (22 + 2 universal).

- Variant groups (4): Diamond baskets `2-pack / 5-pack`; Disposable cups `20-pack / 50-pack`; Hose `1.2 cm / 1 cm / 0.8 cm`; Strap `Beige / Black`. The pills' `aria-label` is always "Pack size", even for diameter and colour.
- Out of stock: 4 cards (`e-battery`, `e-battery-std`, `e-cups`, `e-flower`) and 3 variants (`e-disposable50`, `e-hose10`, `e-hose08`). The filter panel reports "In stock (35) / Out of stock (4)" (it counts the visible variant of each card only).
- "Photo coming soon" placeholders (3, flag `ph:true`): `d-shaft`, `d-case`, `d-bag`. They are real JPGs (`pdp-v2/img/new/sku-ph-d-*.jpg`, 1200x1200: grey square, camera icon, product name, "PHOTO COMING SOON"), not a CSS state. The `ph` flag is not read anywhere in the code.
- 18 cards have a second image (`img2`) for hover.
- `pair` links a Diamond item with its ENSŌ 2026 counterpart (battery, cups, baskets/mesh, cap, tool) and feeds the "The same for ..." line in the sheet. Pairs are not always symmetrical (`d-basket` points at `e-mesh`, `e-mesh` points at `d-screens`).
- `BEST` is a hard-coded best-seller order of 18 ENSŌ 2026 ids used by the "Best selling" sort.

### 1.3 Card anatomy

Top to bottom inside `article.card` (white, 1 px border rgb(0 0 0/.1), radius 22 px):

1. Image area, square, white, image `object-fit:contain` with 6% padding (mobile: `20% 8% 8%` so the badge does not overlap). Clickable.
2. Device badge, absolute top-left 14 px: "DIAMOND", "ENSŌ 2026" or "UNIVERSAL". Montserrat 700 12 px uppercase, letter-spacing .08em, on `#f5f5f4`, pill, text rgb(0 0 0/.7). Mobile 10 px.
3. Title `h3` (Inter 800 18/24, -0.025em; mobile 15/20). For grouped cards the title is the group name without the variant ("ENSŌ 2026 Hose, 1.5 m"). Clickable.
4. Variant pills (only grouped cards): Montserrat 600 12 px, 1.5 px border, active = black fill.
5. Short line `.sub` (Montserrat 400 14/22, rgb(0 0 0/.72)). Hidden on mobile.
6. "Details" text link (13 px, `#666`, underlined). It is a `<span>`, not an `<a>` or button, so it is not keyboard-focusable.
7. Footer pinned to the card bottom: price (Inter 800 20/24; mobile 17 px) left, button right. Button: black pill "ADD TO CART", Montserrat 700 12 px uppercase .08em, padding 12x18. On mobile it becomes a 44 px black circle with a bag-plus icon (text kept for screen readers via `font-size:0`).

States:

- Hover (desktop): card lifts 3 px with shadow `0 12px 40px rgb(0 0 0/.08)`; if there is a second image it cross-fades in (.45 s); otherwise the single image scales 1.04. [a03-card-hover]
- In cart: card gets `.is-in`; button turns light grey (`#f5f5f4`, black text) and reads "IN THE CART"; on mobile the circle shows a tick. Clicking it again removes the item (no confirmation on the card). [a09-added, m04-added]
- Out of stock: price unchanged, button is a disabled grey pill "OUT OF STOCK" (`#f5f5f4`, text 50% black). No "notify me" on the card. [a12-tab-diamond]

### 1.4 Behaviours (all triggered)

1. **Add / remove from a card.** Click "Add to cart": count becomes "1 item", total "€19.99", "Go to cart" href becomes `../pdp-v2/cart.html?add=d-cup`, button reads "In the cart", `localStorage.ensoCart` = `[{qty:1,id,name,price,cur}]`. A second click removes it. Total is a plain sum of prices; quantity is always 1 per item (a toggle, no stepper).
2. **Count/total update** lives in `render()`: it rewrites `#count`/`#mcount` ("N item(s)"), `#total`/`#mtotal`, and the href of `#go` and the mobile bar link (`cart.html?add=<comma list>`). The header cart badge showed "1" after adding (via the shared `window.ensoCart`).
3. **Cart restore on load.** Items already in `localStorage.ensoCart` pre-select their cards. Old ids from the Diamond page are mapped (`battery→d-battery`, `cups→d-cup`, `basket→d-basket`, `flat→d-screens`, `cap→d-cap`, `adapters→d-adapter-long`, `cable→d-cable`, `tool→d-tool`, `brush→d-brush`).
4. **Device tabs.** Click sets `aria-pressed`, filters cards (universal items always stay), and, if the page is scrolled past the tools row, smooth-scrolls back to it (driven: from y=1500 to y=469). Clicking a tab does **not** write a URL hash.
5. **URL hashes.** `#diamond` / `#enso` pre-select the tab on load (verified: 17 / 24 cards, page stays at the top). Any other hash is treated as a product: `#e-tank` opens that product's sheet after 300 ms. Old live-site handles are mapped too (`#glass-thermo-cap`, `#enso-battery`, `#replacement-ceramic-cup`, ... 15 entries). One mapping is dead: `#50-longer-mouthpiece → e-longmouth`, which does not exist (verified: nothing opens).
6. **Search.** Filters on every keystroke, case-insensitive, all words must match (AND) against group name/name + short line + "what it is" text + device words ("diamond", "enso 2026", or both for universal). "cup" leaves 15 cards, "diamond brush" leaves 1. It combines with the active tab and availability filter. No highlighting. Empty state shows the no-results line; its "show all accessories" button clears the query, resets the tab to All and refocuses the input (it does not clear the availability filter). The browser's native clear "x" appears in the field. [b05, b06]
7. **Filter panel.** Opens from "Filter" (focus moves to the close button, body scroll locked). Contents:
   - Sort by (radio): Featured (default, array order), Best selling (hard-coded list first), Price low to high, Price high to low, Alphabetically A–Z.
   - Availability (checkboxes): In stock (35), Out of stock (4). Both ticked = no filter.
   - Device (radio): All accessories, Fits Diamond, Fits ENSŌ 2026. Kept in sync with the tabs in both directions.
   - Nothing changes until "Show results": it applies, closes, re-sorts the DOM, shows a black count badge on the Filter button (1 per non-default sort, 1 per ticked availability, 1 for a device) and scrolls to the list. Verified: price-asc + in stock + ENSŌ gave 20 cards from €4.99 to €119.99 and badge "3".
   - "Clear all" only resets the controls inside the panel; it needs "Show results" to take effect (verified: Clear + Esc leaves the filter on).
   - Closes on X, Esc, backdrop click; focus returns to the Filter button. No focus trap.
   - Sort uses the price of the currently shown variant of a grouped card.
8. **"Per row" slider.** Range 3 to 6, step 1, default 4. Sets `--cols` on the grid and stores the value in `localStorage.ensoAccCols` (verified: survives reload). Card widths at 1440: 3 = 440 px, 4 = 325, 5 = 256, 6 = 210. Desktop only (>= 992 px); below that the grid is fixed at 2 columns and the slider is hidden. At 5 and 6 the "ADD TO CART" label wraps to three lines and the pill becomes a blob. [b11-cols6]
9. **Variant pills on a card.** Clicking a pill swaps the whole card for that variant (new id, price, images, stock state) and keeps focus on the pill. Verified: baskets 2-pack €16.99 to 5-pack €24.99; hose "1 cm" turns the card into "Out of stock". If one variant is in the cart, the card shows that variant on load.
10. **Detail sheet (desktop).** Opened by clicking the image, the title or "Details". Layout [c01-sheet-dcup, c07-sheet-hose-opts]:
    - Decorative grab handle (44x5 px) top centre; round close button (38 px) top-right.
    - Left: square bordered media box (radius 22 px) holding a horizontal scroll-snap gallery of 1 or 2 images, round prev/next arrows and dots (arrows and dots hidden when there is one image). Arrows scroll smoothly; dots follow the scroll position. Clicking the image navigates to `product.html#<id>` (cursor is zoom-in, but it is a navigation, not a zoom).
    - Right: fit line (uppercase grey: "FITS DIAMOND" / "FITS ENSŌ 2026 EDITION" / "UNIVERSAL: FITS EVERY ENSŌ DEVICE"), `h2` full product name incl. variant (Inter 800 32/38), lead = short line (17 px), three blocks "What it is" / "Why" / "How to use it" (h3 Inter 800 15/22 + paragraph 15/24), variant pills with prices ("1.2 cm · €39.99"), divider, price (Inter 800 26/30) + black pill "Add to cart", link "View full details ›" to `product.html#<id>`, and a grey line "The same for ENSŌ 2026: <link>" when a pair exists (the link re-opens the sheet for the paired product).
    - Add: adds, closes the sheet and shows a black toast pill at the bottom centre for 1.8 s ("<name> added to the cart").
    - Remove needs two clicks: first click turns the button amber (`#b3832f`) "Remove? Tap again to confirm" for 2.5 s, second click removes and shows the toast "<name> removed"; the sheet stays open.
    - Out of stock: button disabled "Out of stock" (55% opacity) and a text button "Remind me when in stock" appears under it.
    - Variant pill inside the sheet swaps both the sheet and the card behind it.
    - Close: X, Esc, backdrop click. Body scroll locked while open; focus goes to the close button on open and back to the trigger on close. No focus trap.
    - The sheet never changes the URL.
11. **Detail on mobile.** At <= 991 px a tap on image/title/"Details" does **not** open the sheet; it navigates to `product.html#<id>` (verified). The sheet can still appear on mobile through a product hash in the URL, as a bottom sheet [m07].
12. **Remind-me modal** (`#ensoRm`, shared markup at the end of the page): eyebrow "OUT OF STOCK", title "Remind me when <name> is back", one email field, black "Notify me" button. Invalid email shows "Enter an email address like name@example.com"; valid email stores `{id, at}` in `localStorage.ensoRemind` and shows "Thank you. We will email you when <name> is back in stock." Reopening for the same product shows "You are on the list...". Closes on X, backdrop, Esc. Visual only, no backend.
13. **Mobile "back to top" button** scrolls to y=0 (verified).
14. **Sticky bar vs header** (see Problems 1): scrolling down hides the header (translate -81 px) and the bar sits at the top; scrolling up brings the fixed header back over the bar. [b01, b02]

Stored in the browser: `ensoCart` (cart), `ensoAccCols` (slider), `ensoRemind` (reminders).

### 1.5 Links and buttons

| Element | Destination |
|---|---|
| "Go to cart" (bar and mobile bar) | `../pdp-v2/cart.html?add=<ids>` (plain `cart.html?add=` when empty) |
| "View full details ›", gallery image click, mobile card tap | `product.html#<id>` |
| "The same for ..." link | Re-opens the sheet (`href="#"`, default prevented) |
| Filter, tabs, pills, slider, search | In-page only |

No links to the live site on this page.

### 1.6 Responsive

- Breakpoint is 991/992 px for everything on this page. Verified at 800 px: 2-column grid, mobile hero image, bottom bar visible, icon-only add buttons. At 1100 px: desktop layout, 4 columns of 240 px.
- Mobile-only: bottom bar, icon add buttons, hidden short lines, hidden "Per row", Filter as bottom sheet, Details navigates instead of opening the sheet.
- On mobile the old theme's body gets `padding-bottom:55px` for a `.mobile-bottom-nav` that is not present in this page; the ENSŌ bottom bar sits at `bottom:0` (there is a rule to lift it to 67 px if that nav exists).

### 1.7 Media

| Slot | File | Intrinsic |
|---|---|---|
| Hero desktop (likely LCP) | `partner-v2/sku/acc-hero.jpg` | 2400x1340 |
| Hero mobile (LCP on phones) | `partner-v2/sku/acc-hero-mobile.jpg` | 1128x1400 |
| Diamond products | `pdp-v2/img/new/sku-*.jpg` (+ `-b` second shots, `cap-parts-3.jpg` shared by the three cap parts) | 1200 to 1600 px square |
| ENSŌ 2026 and universal | `partner-v2/sku/live-acc/*.jpg` | mostly 1080x1080; some 800x800, some not square (1148x1200, 1200x991, 1129x1200, 1075x1200, 1152x1153) |

All 39 card images are injected by JS without `loading="lazy"`, `width`/`height` or `srcset`, so every product image is requested on load.

### 1.8 Design values

- Tokens declared by the page: `--ink:#000`, `--grey:#666`, `--line:rgb(0 0 0/.1)`, `--mist:#f5f5f4`, `--night:#1d1d1f`, `--sand:#c8943a`.
- h1: Inter 800 56/60, letter-spacing -1.4 px, white (mobile 36/40).
- Tabs: Montserrat 700 13 px uppercase, .06em, padding 10x18, pill; active black/white.
- Pills (`.pill`): black, white text, radius 999, padding 14x22, Montserrat 700 13 px uppercase .1em.
- Search and Filter controls: 48 px high, 1.5 px border, radius 999; focus-visible outline `2px solid #96671f`.
- Body copy: Montserrat 400. Headings: Inter 800.

### 1.9 Problems and open questions

1. **Sticky bar collides with the header.** `.enso-accshop .bar{top:0}` while the header is fixed, 81 px, z-index 41 and reappears on scroll-up. Result: scrolling up hides the tabs, total and "Go to cart" behind the header on desktop and mobile. Rebuild with `top` = header height when the header is visible (or make the bar part of the header stack).
2. **Currency mismatch in the cart payload.** Cards show € for everything, but `toggle()` stores `cur:'$'` for ENSŌ 2026 and universal items (an unused `usd()` helper is still in the code). Irrelevant once Shopify prices are used, but it means the preview cart may show mixed currencies.
3. **Three placeholder products** (Side Shaft Silicone Covers, Travel Bag, String Bag) ship with "photo coming soon" JPGs and are purchasable. Client to confirm: launch with placeholders, or hide until photos arrive.
4. **Out-of-stock handling is inconsistent.** Cards only show a disabled button; "Remind me" exists only in the desktop sheet, and mobile users never see the sheet. The code path for a card-level reminder form (`[data-remind]`, `remindForm()`, `.rm-f` styles) is never rendered. Decide: back-in-stock app/Klaviyo, and where the entry point lives.
5. Stock state, best-seller order and "featured" order are hard-coded; in Shopify they should come from inventory, `best-selling` sort and manual collection order.
6. Dead legacy hash mapping (`50-longer-mouthpiece → e-longmouth`). Decide whether old `#handle` deep links need to keep working at all once each accessory is a real product URL.
7. "Details" is a `<span>` and the card image/title are click targets without link semantics; the two dialogs have no focus trap; variant groups are all labelled "Pack size". Rebuild as real links/buttons.
8. Add button wraps badly at 5 and 6 per row. Either cap the slider at 4 to 5, or switch to the icon button at narrow card widths. Open question: keep the "Per row" slider at all (it is unusual for a store)?
9. Sheet image has `cursor:zoom-in` but navigates away. Tabs do not update the hash, so a filtered view cannot be shared unless the link is typed by hand.
10. On mobile, tapping a card leaves the page for the product page, while desktop opens a quick view: confirm this split is intended for the Shopify build (quick view on desktop only).

---

## 2. FAQ (`partner-v2/faq.html`)

### 2.1 Section inventory

| # | Section | Desktop | Mobile | Source |
|---|---|---|---|---|
| 1 | Hero banner (old theme `hero-banner`, class `.banner`) | Full width, fixed 300 px, image cover centred, black overlay 50%. Left-aligned text block (max 600 px) in the 1280 container: heading "FAQ" (an `<h2>`, Montserrat 700 56 px, white) and one line "ENSŌ Experience · answers for Diamond, the 2026 Edition and your order" (16 px white) | Same 300 px, heading 32 px, same image (no mobile image set) | Section settings: image, overlay colour/opacity, heading, text, heights per breakpoint |
| 2 | FAQ section (`.faq-section`, inner max 1000 px, padding 60 px / 40 px mobile) | Header: eyebrow "Everything you need to know about ENSŌ" exists in the markup but is `display:none`; `h2` "Frequently asked questions" (Montserrat 600 36 px; 28 px mobile). Then a sand label "ENSŌ EXPERIENCE · FAQ" (700 13 px uppercase, `#96671f`), the search pill (max 560 px, 52 px high), three pill tabs, the accordion list, and a closing note | Tabs wrap to two rows (12 px text, padding 10x14) | Heading/label editable; questions = blocks or metaobjects grouped by tab and category |

Content inside the body column starts 80 px inside the 1000 px container (items are 840 px wide at 1440).

Tabs and counts (66 questions in total, matching the 66 entries in the `FAQPage` JSON-LD in the page):

| Tab (`data-tab`) | Questions | Category sub-headings inside the tab |
|---|---|---|
| ENSŌ Diamond (`diamond`) | 15 | none |
| ENSŌ 2026 Edition (`enso`) | 33 | "ENSŌ 2026 EDITION", "PACKING AND FLAVOURS", "CLEANING AND CARE" (24 px, 600, uppercase, 1 px letter-spacing) |
| Orders, shipping and warranty (`orders`) | 18 | "ORDERS, SHIPPING AND RETURNS", "WARRANTY AND SAFETY" |

Each item is `<details class="faq-item" id="q-<slug>">` with a `<summary>` (question, Montserrat 600 16 px, 84 px row with hairline `#8080803d` below) and a 30 px black circle on the right showing a white plus (minus when open; 25 px on mobile). Answers are plain paragraphs (15 px, line-height 1.7); a few contain links.

Closing note: "More step-by-step help lives in ENSŌ Experience: quick start, packing, the full manual and firmware." (15 px, 66% black).

### 2.2 Behaviours (all triggered)

1. **Tabs.** Click sets `aria-selected`, shows that group and hides the others, and writes the hash with `history.replaceState` (`#diamond`, `#enso`, `#orders`). No scrolling. Default tab is Diamond.
2. **Accordion: one open at a time, across the whole page.** Opening a second question closes the first (verified); clicking the open one closes it. Height animates 300 ms ease-out via the Web Animations API (the old theme's `FaqAccordionItem` script); the open item gets `.is-open`, which swaps plus to minus. Nothing is open on load.
3. **Search.** On each keystroke: tabs row is hidden, all three groups are shown, and only questions whose question + answer text contains every typed word (case-insensitive AND) stay visible; empty groups are hidden. Category sub-headings remain for groups that still have matches. "battery" gives 5 + 8 + 3 results. **There is no highlighting of matches** and matches are not auto-opened. Empty state: "No question matches that. Try another word, or write to support@ensoshisha.eu." (mailto link). Clearing the field restores the tab that was active before searching and closes every item. [f06, f08]
4. **Deep links.** `faq.html#diamond|#enso|#orders` selects the tab on load (no scroll). `faq.html#q-<slug>` selects the right tab, opens that question and scrolls it to 110 px below the top (re-applied at 80, 400 and 1200 ms and on `load`). Verified with `#q-how-do-i-dispose-of-batteries-and-cups`. `hashchange` is handled too, so in-page links to another question work. Opening a question by hand does not write its hash.
5. Search input shows the browser's native clear "x".

### 2.3 Links

| Link | Destination |
|---|---|
| `support@ensoshisha.eu` (empty state + 5 answers) | `mailto:` |
| "Accessories" (one answer) | `accessories.html` |
| "ENSŌ Experience" (closing note) | `../experience/index.html` |

No live-site links.

### 2.4 Responsive, media, design values

- Mobile: banner stays 300 px; placeholder text is cut off in the search field ("Search the questions: battery, clear"); tabs wrap; everything else is the same single column with 20 px gutters.
- Media: one image, `assets/b96448b9-web_support-6290.webp` (file is 1600x900; the tag claims 5760x3240), `loading="eager" fetchpriority="high"`: the LCP element. Same image as the Support banner.
- Fonts here are the old theme's: Montserrat for headings and body (not Inter), black `#000`, pill radius 999, tab border 1.5 px rgb(0 0 0/.12).

### 2.5 Problems and open questions

1. **Duplicate id** `q-can-i-take-it-on-a-plane` (one in the ENSŌ 2026 tab, one in Orders). A deep link can only reach the first. Ids must be unique per question in the rebuild.
2. A question opened through a deep link is `open` but does not get `.is-open`, so the icon state can be wrong until it is toggled; rebuild should derive the icon from `[open]`.
3. The banner heading is an `<h2>` and the page has no `<h1>`.
4. Search does not highlight (the task brief assumed it might). Decide whether to add it.
5. Tabs use `role="tab"` without `tabpanel`/arrow-key support; the hidden eyebrow is dead markup.
6. The Diamond tab has no category heading while the other two do: confirm that is intended.

---

## 3. Support (`partner-v2/support.html`)

Entirely old theme sections; no page-specific JS.

### 3.1 Section inventory

| # | Section | Desktop | Mobile | Source |
|---|---|---|---|---|
| 1 | Hero banner | Same component and same image as FAQ, 300 px. Heading "Support" (h2, Montserrat 700 56 px white), line "Our customer support team will be happy to assist you!" | Heading 32 px | Section settings |
| 2 | Contact section (`.contact-section`, padding 64/32 px) | Two equal columns (610 + 610, gap 60) in the 1280 container | One column: text block, then the form card | Section settings + blocks |
| 2a | "Get in touch" block (left) | Eyebrow "GOT ANY QUESTIONS?" (600 12 px uppercase, 1.2 px tracking); h2 "GET IN TOUCH" (Montserrat 600 40 px, rendered uppercase by CSS; 28 px mobile); paragraph (15/24); two black cards side by side (297x97 each, radius 12, white text): "Location" with a map icon and "OMNI-TECH Design Kft, Hungary", "Email" with an envelope icon and `support@ensoshisha.eu`; a row "OUR SOCIAL MEDIA" with three 20 px icons right-aligned; a line "We answer Monday to Friday, 9 am to 6 pm CET." (14 px) | Cards stack, full width | Blocks: contact cards (icon, heading, rich text, colours), social links from theme settings, rich text |
| 2b | Contact form (right) | Card with 1 px border, radius 12, padding 32. Title "Contact Us" (h3, 600 24 px). Fields below. Full-width black pill "Submit" (44 px high, Montserrat 500 16 px, `#1d1d1f`) | Fields stack one per row | Shopify `contact` form |
| 3 | Three icon links (old theme `awards` section) | Three centred columns (400 px each): an 84 px round grey (`#f2f2f2`) medallion with a line icon, and a bold 18 px linked title under it | Stacked, one per row, 40 px gap | Blocks: icon image + rich-text title |
| 4 | Custom liquid block | An empty `<section class="custom-section">` with an empty container: 96 px of white space (48 px padding top and bottom; 32 px on mobile). No content at all | Same, 64 px | Should be dropped |

### 3.2 Contact form

| Field | Type / name | Required |
|---|---|---|
| First name | text, `contact[first_name]` | no |
| Last name | text, `contact[last_name]` | no |
| Email * | email, `contact[email]` | yes |
| Phone | tel, `contact[phone]` | no |
| Message * | textarea (4 rows), `contact[body]` | yes |

Inputs: 43 px high, 1 px border rgb(0 0 0/.2), radius 6, padding 10x14, labels 500 14 px above. Hidden inputs `form_type=contact`, `utf8`.

Submit behaviour (driven): with empty required fields the browser's native validation bubble appears on Email ("Please fill out this field") and nothing is sent. With valid values the form does `method="post" action="#"`: the page reloads at `support.html#` with the fields cleared and no success or error message. So it is visual only, as the README says. In Shopify: standard `{% form 'contact' %}` with success and error states (which the preview does not show, so their design is an open item).

### 3.3 Behaviours

1. Hovering the **Location** card fades its background from black to the sand accent (`rgb(200,148,58)`) in .4 s. The Email card has no hover state (inconsistent: only `.contact-card-1` got the rule).
2. Form validation and submit as above.
3. No other interaction (no hover effect on the three icon links, no animation).

### 3.4 Links

| Element | Destination |
|---|---|
| Location card | `https://www.google.com/maps/search/?api=1&query=OMNI-TECH+Design+Kft` (new tab) |
| Email card | `mailto:support@ensoshisha.eu` |
| Facebook | `https://www.facebook.com/share/16AJipvPXs/?mibextid=wwXIfr` (new tab) |
| Instagram | `https://instagram.com/enso.future` (new tab) |
| YouTube | `https://www.youtube.com/@enso.future` (new tab) |
| "ENSŌ User Guide" | `../experience/enso.html` (local) |
| "ENSŌ Video Guide" | `https://ensoshisha.eu/pages/user-guide-videos` (live site, new tab) |
| "ENSŌ Warranty Registration" | `../experience/app.html#register` (local, deep link) |

### 3.5 Responsive, media

- The two-column layout collapses to one column below roughly 990 px (verified one column at 800 px).
- On mobile the field rows lose their vertical gap: the "Email *" label sits tight under the Last name input. [s09-m-2]
- Media: banner `assets/b96448b9-web_support-6290.webp` (LCP); icons `assets/f6921af2-Icons_all-05-webp.webp`, `assets/513fbff2-Icons_all-01-webp.webp` (633 px declared, 240 px files), `assets/b8368a02-ICON_E150-04_...webp`.

### 3.6 Problems and open questions

1. **Empty custom-liquid section** at the bottom adds blank space; remove.
2. **"ENSŌ Video Guide" points at the live site** (`ensoshisha.eu/pages/user-guide-videos`). Client to say whether that page survives, or whether the link should go to ENSŌ Experience.
3. The icon images carry raw escaped HTML in their `alt` attributes (old links to `ensoshisha.com/pages/user-guide`, `/pages/warranty` and a PDF). Needs clean alt text.
4. No `<h1>` (banner heading is `<h2>`); "Get in touch" is forced to uppercase by old theme CSS while the new pages use sentence case: confirm which style wins.
5. Form success/error states are not designed in the handoff.
6. "User Guide" goes to the ENSŌ 2026 manual only; there is no link to the Diamond manual from Support. Confirm.
7. Location shows only "OMNI-TECH Design Kft, Hungary" while Warranty prints a street address without city or postcode (see 4.4).

---

## 4. Warranty (`partner-v2/warranty.html`)

One static block: `<main class="enso-warranty"> .wr > .wr-in` (max 1080 px incl. 40 px gutters, so a 1000 px column), padding 56 px top / 96 px bottom. No banner, no images, no JS. This is the only help page with a real `<h1>`.

### 4.1 Block inventory

| # | Block | Desktop | Mobile (<= 991) |
|---|---|---|---|
| 1 | Title + lead | h1 "Warranty" (Inter 800 56 px, -0.03em, `#1d1d1f`); one paragraph, max 60ch | h1 40 px |
| 2 | Stat cards `.wr-tiles` | 3 equal cards (323x176, gap 16), background `#f5f3ef`, radius 20, padding 28x26. Big value (Inter 800 40 px) + text (15/23, 70% black): "2 years / on ENSŌ products, for software errors, material defects and manufacturing faults", "1 year / on the ENSŌ battery, as a separate warranty", "Return costs / reasonable return costs are covered for valid warranty cases" | Stacked; each card becomes a row with the value (30 px, min 84 px wide) left and the text right |
| 3 | "What the warranty covers" | h2 (Inter 800 30/36). Two bordered cards (490 px each, gap 20, 1 px border rgb(0 0 0/.12), radius 20, padding 28): "Covered" with 3 rows and a dark round tick icon, "Not covered" with 4 rows and a red (`#9b3b2a`) cross icon; rows separated by hairlines; a small grey note (13/20) under each list | Stacked |
| 4 | "How to make a claim" | 4 columns, each with a 2 px dark top rule, a large sand step number generated by CSS counter (Inter 800 28 px, `#96671f`) and one sentence (15/23) | 2 x 2 grid |
| 5 | "Sending a product back" | Two columns (1.3fr / 1fr): left two paragraphs and a beige note box ("Please note" bold + "Returns sent cash on delivery are not accepted."); right a dark card (`#1d1d1f`, radius 20, padding 28) with a sand uppercase label "RETURN ADDRESS", "Omni-Tech Design Kft", "Weiner Leo utca 12. fszt. 6.", "Phone +36 20 598 9144" | Stacked |
| 6 | Help box `.wr-cta` | Bordered card (radius 24, padding 32), flex row: left h2 "Need help with a claim?", "Write to us with:" and a 4-item bullet list; right a dark pill button showing the email address (52 px high, Montserrat 700 13 px uppercase, .1em) | Wraps: text, then the button under it (button keeps its 274 px width) |

Section spacing 64 px (48 px mobile). All text is merchant-editable copy; nothing comes from Shopify data. Suggested build: one section with blocks (stat, list card, step, note, address, CTA) or a page template with rich settings.

### 4.2 Behaviours

1. Email pill hover: background `#1d1d1f` to `#3a3a3c` (verified).
2. Focus-visible outline on links: 2 px `#96671f`.
3. Nothing else: no accordion, no animation, no form.

### 4.3 Links

| Element | Destination |
|---|---|
| Phone | `tel:+36205989144` |
| Email pill | `mailto:support@ensoshisha.eu` |

No link to the warranty registration (`../experience/app.html#register`) from this page, although Support links to it.

### 4.4 Problems and open questions

1. Return address has no city, postcode or country ("Weiner Leo utca 12. fszt. 6."). Client to supply the full address.
2. Company name is written "Omni-Tech Design Kft" here and "OMNI-TECH Design Kft" on Support and in the footer.
3. The lead paragraph does not get its intended style: `.wr p` (16/26, 75% black) overrides `.wr-lead` (17/28, 66% black), and the 40 px gap under it is lost, so the lead sits close to the stat cards. Decide which is intended (the screenshots show the overridden look).
4. Two sand tones are in use on this page: `#96671f` (step numbers, focus ring) and `#c8943a` (the "Return address" label); the README names only `#c8943a` as the accent. Confirm whether the darker one is a deliberate text-contrast variant.
5. Should this page link to warranty registration and to Support?

---

## 5. Journal index (`partner-v2/blog.html`)

Static block `<main class="enso-blog"> .jr > .jr-in` (max 1200 px incl. 40 px gutters, 1120 px column), padding 56 / 96 px. No JS. Every card is a single `<a>` wrapping image, date, title and summary.

### 5.1 Section inventory

| # | Section | Desktop | Mobile (<= 991) | Article and link |
|---|---|---|---|---|
| 1 | Header | h1 "Journal" (Inter 800 64 px, -0.03em) left; right-aligned grey intro (15/24, max 38ch); hairline under, 40 px gap | Stacked, h1 44 px, intro left-aligned | Blog title + description |
| 2 | Featured `.jr-lead` | Two columns 1.55fr / 1fr, gap 48, vertically centred. Image 652x489 (4:3, radius 20). Right: date, title (Inter 800 44/48), summary (17/28, 66% black), underlined uppercase "READ THE ARTICLE" | Stacked, title 30/35 | "Best Shisha Flavors of 2026", August 4, 2026 → `blog-flavors.html` (local) |
| 3 | Two-up `.jr-pair` | Two cards 544 px wide, image 4:5 portrait, date, title (26/31), summary | Stacked, 40 px gap | "Electronic Shisha", July 13, 2026 → `blog-electronic.html` (local). "Hookah Tobacco", July 7, 2026 → `blog-tobacco.html` (local) |
| 4 | "Culture and craft" three-up | h2 (Inter 800 32/38) then three cards 355 px wide, square images, title 22/27 | Horizontal scroll-snap carousel: cards are 78% wide (279 px), 14 px gap, bleeding to the screen edge, no arrows or dots, no scrollbar | "What Is Shisha?" (Aug 29, 2025), "Shisha Around the World" (Sep 8, 2025), "How to Pack a Bowl" (Aug 9, 2025): all → `https://ensoshisha.eu/blogs/news/<handle>` in a new tab |
| 5 | Dark feature row `.jr-wide` | One card 1120x460, radius 24, background `#1d1d1f`: text left (padding 56x48: date, title 40/44 white, summary 75% white), image right filling the height (`object-position:50% 60%`) | Image on top (4:3), text under, title 30/35 | "Electric Hookah" (Aug 20, 2025) → `https://ensoshisha.eu/blogs/news/electric-hookah` (new tab) |
| 6 | "More from the journal" list | h2, then 4 rows separated by hairlines: date (160 px column), title (Inter 700 19/25), one-line summary (14/22), chevron "›" at the right | Each row stacks date / title / summary with the chevron centred on the right | "Best Portable Hookah in 2026" (Aug 4, 2026), "Hookah Glass Bowls" (Aug 12, 2026), "Hookah Flavors" (Aug 16, 2025), "Top Hookah Brands 2025" (Jul 16, 2025): all → `https://ensoshisha.eu/blogs/news/<handle>` (new tab) |

So: **3 local links** (the three articles in this package) and **8 links to the live site**, all with `target="_blank" rel="noopener"`.

### 5.2 Behaviours

1. Card hover (devices with hover only): image scales to 1.025 over .8 s inside its rounded frame; the title gets a thin underline. [j02]
2. List row hover: chevron moves 4 px right, title underlines. [j07]
3. Mobile three-up carousel: native horizontal scroll with mandatory snap (verified by scrolling 293 px). No autoplay, arrows, dots or loop.
4. `prefers-reduced-motion` removes the image transition. Focus-visible: 2 px `#96671f` outline with 12 px radius.
5. No pagination, tag filter, search or "load more".

### 5.3 Media

| Slot | File | Intrinsic | Loading |
|---|---|---|---|
| Featured (LCP) | `sku/jr-arch-redcup.jpg` | 1600x1066 | eager, fetchpriority high |
| Electronic Shisha | `sku/phil-moment.jpg` | 1800x1200 | lazy (`object-position:45% 50%`) |
| Hookah Tobacco | `sku/phil-cup.jpg` | 1600x1194 | lazy |
| What Is Shisha? | `sku/jr-arch-sofa.jpg` | 1600x1067 | lazy |
| Shisha Around the World | `sku/jr-arch-terrace.jpg` | 1600x1067 | lazy (`45% 55%`) |
| How to Pack a Bowl | `sku/jr-arch-cup.jpg` | 1600x1067 | lazy |
| Electric Hookah | `sku/jr-arch-sunset.jpg` | file present; size NOT VERIFIED (still lazy when measured) | lazy |

All `alt` attributes are empty. The index images are **not** the articles' own hero images (the articles use poster-style graphics, see 6.4), and focal points are set per card with inline `object-position`.

### 5.4 Problems and open questions

1. **8 of 11 cards leave the site** for `ensoshisha.eu/blogs/news/...`. In Shopify these are presumably articles of the same blog and should be internal links: confirm that all eleven articles will exist in the new store.
2. The layout is hand-curated (fixed slots, hand-written summaries, hand-picked crops and focal points) and not in date order (the list runs Aug 4 2026, Aug 12 2026, Aug 16 2025, Jul 16 2025). Decide how it maps to Shopify: slot 1 = newest article and the rest by date, or a section where the merchant picks articles per slot. Card images would need an article metafield (the featured image of the articles is a different graphic) plus a focal point.
3. Local article dates and titles are consistent with the article pages, except casing: the index says "Electronic Shisha", the article h1 is "electronic shisha".
4. No pagination or archive beyond these 11 entries: what happens with article 12?
5. Local file names say "flavors" (US) while index copy says "flavours" (UK); content question only.

---

## 6. Articles (`blog-electronic.html`, `blog-flavors.html`, `blog-tobacco.html`)

### 6.1 Template anatomy (identical on all three)

Old theme article section: `<article class="article color-scheme-paper section-padding"> .container.article__inner`.

| Part | Desktop 1440 | Mobile 390 |
|---|---|---|
| Section | Cream background `rgb(250,246,236)`, padding 64 px top and bottom | Same colour |
| Column | `max-width:720px` with 80 px side padding, so a **560 px** text column | 350 px (20 px gutters) |
| Date | Centred, Montserrat 400 16 px, `rgb(90,85,75)`, format "August 04, 2026" (zero-padded day; the index prints "August 4, 2026") | Same |
| Title | `h1.h-section.article__title`, centred, Inter 600 48/55, `rgb(10,10,10)`, margin 12 / 32 px | 30/35 |
| Hero image | Full column width, natural aspect ratio (no crop), radius 16, 32 px gap below, `loading="eager"` | Same, 350 px wide |
| Rich text | `div.body-text.article__content` (Montserrat 16/24 from the theme), which contains the pasted article document described in 6.2 | Same |

**Not present on any of the three:** table of contents in the template (one article has its own inside the body), author block, tags, reading progress specific to the article, share links, related posts, previous/next, comments, back-to-Journal link, breadcrumbs. The article ends with the body's own "Sources" paragraph and then the footer.

### 6.2 Rich-text styles

The body of each article is a self-contained HTML fragment with its own `<style>` block and its own palette, pasted into the article content. Shared palette: olive `#3E4A21`, orange `#CC5500`, beige `#EDE9CF`, light olive `#C2CCA9`, mint `#ECF0EC`. None of these are theme colours.

| Element | blog-electronic | blog-flavors | blog-tobacco |
|---|---|---|---|
| Wrapper | `article.enso-article`, max 760, padding 24x20 (text column shrinks to 520 px) | `div#enso-flavors-article.enso-article`, max 860 | `div.enso-article`, max 760 |
| Body text | Roboto → 17 px / 1.7, `#2b2f24` | Roboto → 17 px / 1.65, `#2b2b1f` | Roboto → 16 px / 1.7, olive `#3E4A21` |
| In-body title | `h2` "Electronic Shisha: A Complete Guide to Modern Shisha" | an **empty `<h1>`** | a second `<h1>` "Hookah Tobacco: A Comprehensive Guide to Types, Flavors & History" (32 px) |
| Byline line | "Last updated: 13 July 2026 · By Mary Lovato · 12 min read" (13.6 px grey) | "Last updated: August 2026" | "Last updated: July 7, 2026 · By the ENSŌ Editorial Team" |
| h2 | Montserrat 700 23.2 px olive, 2 px light-olive rule under, 44 px above | 24 px, 3 px **orange** rule | 24 px, 2 px light-olive rule |
| h3 | Montserrat 600 17.9 px olive | 18.4 px **orange** | 18.4 px olive |
| h4 | none | 16.8 px olive (inside cards) | none |
| Links | Orange, underlined | TOC links olive, no underline | Orange, **not** underlined |
| Lists | 5 `ul`, 1 `ol`, 24 px indent | 4 `ul` | 1 `ul`, 2 `ol` |
| Tables | 2 (6 and 3 columns), olive header with white text, bottom borders only, zebra mint rows, wrapped in `.enso-tablewrap` (overflow-x auto) | 2 (5 and 2 columns), olive header with beige text, full cell borders, zebra | 4 (5, 2, 2, 4 columns), olive header, full borders, zebra |
| Inline images | 2, both wrapped in links (ENSŌ render → `enso.html`; Diamond photo → `../pdp-v2/index.html`), full column width | none | 1 (`hookah_tobacco_2.jpg`), no link |
| Callouts | definition box (mint, orange left bar), 2 beige note boxes, a 3-tile stat row (`.enso-stats`, beige tiles with orange figures), olive CTA box with orange button | legal/age notice (mint, olive left bar), TOC box, 2 beige notes, 10 bordered "brand cards" each with tag chips, a 2-column grid of 6 beige "mix" cards, olive CTA box with orange button | lead box (mint, orange left bar), 5 "Myth vs fact" boxes |
| Blockquotes | none | none | none |
| Italics | none | none | **7 italic runs** (`<em>`/`<i>`: mu'assel, tombak, heated, three source titles, the closing age notice) |
| FAQ block | 12 items | 11 items | 8 items |
| Closing | "Sources" paragraph (small grey, top rule) | same | same |
| Structured data inside the body | JSON-LD (BlogPosting, Organization, BreadcrumbList, FAQPage), valid | JSON-LD present but **invalid JSON** (parse error at position 670) | none |
| Stray head tags inside the body | `<meta charset>`, viewport, description, canonical to `ensoshisha.com/blogs/guides/electronic-shisha`, 2 preconnects and a Google Fonts stylesheet | none | none |

On mobile the tables are wider than the column (424 to 552 px content in 310 to 350 px) and scroll horizontally inside themselves; the page itself does not scroll sideways (verified). There is no visual hint that a table scrolls. [v08, b08, e08]

### 6.3 Behaviours (all triggered)

| Behaviour | blog-electronic | blog-flavors | blog-tobacco |
|---|---|---|---|
| Article FAQ accordion | **Broken.** Answers are `display:none` until `.open` is added, and the page contains no script that adds it. Real clicks and scripted clicks change nothing; the 12 answers are unreachable (they only exist for search engines via JSON-LD). [e04] | **Works.** Many-open accordion: each question toggles on its own, others stay open. `max-height` transition .25 s, "+" rotates 45° into "×", `aria-expanded`/`aria-controls` set by an inline script (click + Enter/Space). | **Not interactive.** No script; the no-JS fallback shows all 8 answers open permanently and hides the "+" icons. Buttons do nothing. [b11] |
| Table of contents | none | "On this page" box with 11 anchor links (`#enso-quick-answer` ... `#enso-faq`); all 11 targets exist. Click smooth-scrolls (theme sets `scroll-behavior:smooth`) and lands the heading at the very top of the viewport (no offset; fine while the header is hidden on scroll-down, but the fixed header covers the heading if it is showing). No active-section highlight. | none |
| CTA | Olive box "Experience Shisha Without the Charcoal" + orange button "Discover ENSŌ" → `index.html` | Olive box + orange button "Shop the ENSŌ Diamond" → `../pdp-v2/index.html` | none |
| Other | Image links as above | none | none |

No sliders, video, sticky elements or scroll effects inside any article.

### 6.4 Links and media

| Page | Links in the body | Hero image (LCP) | Other images |
|---|---|---|---|
| blog-electronic | `enso.html` (x2), `../pdp-v2/index.html`, `index.html` (x2), `../experience/index.html`, `../experience/packing.html`. All local | `assets/201d9208-electronic_shisha.jpg`, 1080x1350 portrait poster with baked-in text ("ELECTRONIC SHISHA / THE FEATURE IS HERE"), shown 560x700 | `assets/62bb5d61-ENSO_pr_2_...png` 1080x1080; `assets/9280e02a-diamond-top-side.jpg` 1856x2304 |
| blog-flavors | 11 in-page anchors, `../pdp-v2/index.html` | `assets/c72349d8-Best_Shisha_Flavors_of_2026.jpg`, file 1200x675 (tag says 1672x941), landscape poster with baked-in text | none |
| blog-tobacco | `index.html` (x2) | `assets/618135e1-Hookah_Tobacco_...jpg`, 800x1200 portrait poster with baked-in text, shown 560x840 (taller than the first screen) | `assets/5466e7a0-hookah_tobacco_2.jpg` 1448x1086 |

No links to the live site inside the three articles (only the stray canonical to ensoshisha.com in blog-electronic).

### 6.5 The Roboto question

- **Where:** every element of the article body on all three pages computes `font-family: Roboto, Arial, sans-serif` (170, 138 and 126 text elements respectively). It comes from the `<style>` pasted inside each article's content (`.enso-article{font-family:'Roboto',Arial,sans-serif}` / `#enso-flavors-article{...}`), with Montserrat for the in-body headings. The theme's own article styles (Montserrat body, Inter title) are overridden inside the body.
- **Is Roboto actually loaded?** Only on `blog-electronic.html`: its article body contains `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500&display=swap">`, and the browser reports Roboto 400 and 500 as loaded. `blog-flavors` and `blog-tobacco` name Roboto but load no font file, so they render in the fallback (Arial) on a machine without Roboto installed.
- **Intended?** Almost certainly not as a design decision for the new store. It is legacy styling carried inside article content copied from the old .com blog (the stray canonical and meta tags come from the same paste). The README says "Fonts and colours come from your theme", and the rest of the site uses Inter + Montserrat. The other Roboto mentions in these files are only fallback entries in system-font stacks of third-party app CSS, not a loaded font.
- **Decision needed:** strip the per-article `<style>` and render article rich text with theme typography and theme colours (recommended), or keep the olive/orange "editorial" look deliberately. Either way the Google Fonts link inside article content should go.

### 6.6 Differences between the three, in one list

1. Body wrapper tag, max-width and padding differ (520 px vs 560 px text column on desktop).
2. Body text size and colour differ (17 px near-black, 17 px near-black, 16 px olive).
3. h2 rule colour and h3 colour differ (flavors uses orange).
4. Link underline differs (tobacco has none).
5. Table styling differs (bottom borders vs full grid; wrapper only in electronic).
6. Three different FAQ implementations with three different results (broken, working, static).
7. Only flavors has a table of contents, brand cards, tag chips and a mix grid; only electronic has stat tiles and a definition box; only tobacco has myth boxes and italics.
8. In-body title: `h2` (electronic), empty `h1` (flavors), second `h1` (tobacco).
9. JSON-LD: valid (electronic), invalid (flavors), absent (tobacco).
10. CTA box: electronic and flavors only.
11. Byline formats and date formats differ; one names an author ("Mary Lovato"), one an "Editorial Team", one nobody.

### 6.7 Problems and open questions

1. FAQ accordions broken or static in two articles (6.3). One shared article accordion component is needed.
2. Legacy inline styling and fonts inside article content (6.5): a client decision on the article look, then one rich-text stylesheet for headings, lists, tables, callouts, images and links.
3. House rules: italics in blog-tobacco (7 runs); `blog-electronic` title is all lower case ("electronic shisha", also in the page `<title>`); American spelling in articles vs British on the index.
4. Two `<h1>` on flavors (one empty) and tobacco; stray `<meta>`/`<link>` tags and a canonical to ensoshisha.com inside the electronic body; invalid JSON-LD in flavors. Structured data should be generated by the theme, not pasted into content.
5. Hero images are text-heavy posters in three different aspect ratios (4:5, 16:9, 2:3) with a different visual style from the index cards: confirm they stay as the article hero, and whether the index card image is a separate field.
6. No related posts, share links, author or back-to-Journal navigation in the handoff. Confirm that none is wanted.
7. Health-related copy ("Tips for quitting", "Health risks") and an age notice appear inside article bodies; flag for the client's legal review, not a build item.
8. Mobile tables scroll sideways with no affordance; anchor jumps have no offset for the fixed header.

---

## Appendix: counts

- Sections documented: 30 (Accessories 8, FAQ 2, Support 5 incl. the two halves of the contact section, Warranty 6, Journal 6, article template parts 3 shared across the three articles).
- Behaviours documented: 31 (Accessories 14, FAQ 5, Support 3, Warranty 2, Journal 4, Articles 3 groups compared across three pages).
- JS errors reported by the driver on these eight pages: none.
- NOT VERIFIED: intrinsic size of `sku/jr-arch-sunset.jpg` (lazy image not yet decoded when measured); behaviour of real touch swipe on the mobile carousel and sheet gallery (scroll position was changed by script, not by a finger gesture); the mailto/tel/maps and live-site links were read from the DOM, not followed.
