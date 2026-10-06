# 04 · ENSŌ 2026 product page, Devices collection, accessory product page

Audited by driving the handoff in headless Chrome (1440x900, 390x844 touch, plus 800 and 1100 widths). Screenshots: `scratchpad/shots/enso2026/` (a* b* c* = enso.html desktop, d* = enso.html mobile and mid widths, e* f* = devices.html, g* h* = product.html, i* = follow-ups). Shared header, footer, age gate, "Welcome gift" tab, search and cart drawer are out of scope (other auditors) and are only mentioned where they touch these pages.

## Summary

- **`partner-v2/enso.html`** is a new, hand-built product page (classes `.bar .hero .product .buy .acc .exp .hc .modal`, own inline CSS and JS). 11 visible sections plus 3 overlays (accessory sheet, help modal, back-in-stock modal). One hidden leftover section (`#tech`) that should not be ported.
- **`partner-v2/devices.html`** is the old theme's collection template almost untouched (banner, breadcrumbs, facet sidebar, sort, 2 product cards, mobile filter drawer). Filtering and quick-add cannot work in the static file; behaviour is documented from `assets/5426b3f8-facets.js`.
- **`partner-v2/product.html`** is one template rendered entirely by JS from `acc-sheet.js` (`window.ENSO_ITEMS`, 44 SKUs) according to the URL hash. It becomes the Shopify product template for accessories.
- No page JS errors were reported by the driver on any of the three pages.
- The biggest content conflict: enso.html sells the 2026 Edition **from €390, in stock** (Battery Plus variant €420, out of stock); devices.html shows the same product at **€420.00, Out of stock** with a disabled button. Details in section 2.7.

Fonts on all three pages: headings Inter 800 (only weight 800 is loaded from Google Fonts: `Inter:wght@800`, `Montserrat:wght@400;500;700`), body Montserrat. Elements that ask for Inter 600/700 (awards heading, product.html h1/h2/h3) therefore render with a substituted weight; decide the real weights in the theme.

---

## 1. `partner-v2/enso.html` · ENSŌ Shisha 2026 Edition

`<title>` "ENSŌ Shisha 2026 Edition · All-in-One Electric Hookah". Meta description "An all-in-one electric hookah: fire-free and cordless, with a magnetic hose and mouthpiece. Coal-free comfort, formidable clouds and the molasses you already love." Canonical `https://ensoshisha.eu/products/enso-2026-edition` (suggested handle). `og:image` is the favicon (`assets/2621df9d-favicon-01.png`). No JSON-LD. One `<h1>` (buy box title); the hero heading is an `<h2>`.

Document order and measured positions at 1440: hero 103 to 859, buy 883 to 2098, whyenso 2098 to 4459, witb 4459 to 5768, more 5768 to 6599, herb 6599 to 7159, awards 7159 to 7961, faq 7961 to 8731, exp 8731 to 9529, help 9529 to 10112, footer. Page height 10538.

### 1.1 Section inventory

| # | Section (id) | Purpose | Desktop 1440 | Mobile 390 | Content source |
|---|---|---|---|---|---|
| 1 | Sticky buy bar `#bar` | Persistent buy CTA after the buy card leaves view | Fixed, full width, 56px high, white 94% + `backdrop-filter: blur(10px)`, bottom border 1px rgba(0,0,0,.1), z-index 29. Left: product name (Inter 800 16px). Right: "From €390" (Inter 800 16px) + small black pill "Add to cart" (12px/22px padding, 12px text, 36px high). Sits at `top:79px` under the header, or `top:0` while the header is hidden (`body:has(.site-header--hidden)`). | Fixed to the **bottom**, auto height (77px measured), top border instead of bottom; name wraps to two lines, "From €390" wraps, pill text wraps to two lines (see d09). | Product title, min variant price, default available variant |
| 2 | Hero `#hero` (`.hero--band`) | Mood video band | Full-bleed (100vw), 24px margin above and below, video `height:min(84vh,920px)` = 756px, `object-fit:cover`, opacity .94 on `#07080a`. Bottom 60% gradient to black 60%. Copy bottom-left: h2 "An all-in-one portable hookah" (Inter 800 52/56, -1.3px, white, max 16ch) + line "Your ritual. Without charcoal. Open system, full control." (Montserrat 16/28, white 85%). Bottom-right: white pill "Learn more". Padding 0 40px 56px. | Video `min(64vh,560px)` = 540px. h2 36/40. Line forced to 12.5px `white-space:nowrap`. Copy stacks, button under the text, left aligned. Padding 0 16px 28px. | Merchant: video, heading, line, button label + anchor |
| 3 | Buy area `#buy` (`.product`) | Gallery, accordions, buy card | Grid `minmax(0,680px) minmax(380px,520px)`, gap 48px, centred, padding 48px 0 56px. Left column (`.pcol`, 680px): gallery then accordions, 28px gap. Right: buy card 520px, `position:sticky; top:100px` (header 80 + 20). | One column, order: gallery, buy card, accordions (`.pcol{display:contents}` + `order`). Buy card static, padding 20px. | Product |
| 3a | Gallery | Product photos | Main image box 680x511, white, 1px border, radius 12px, image `object-fit:contain` (files are 1400x1049). Thumbs row under it: 76x76 buttons, radius 8px, 10px gap, active = 2px black border. | Main `<img>` hidden; a horizontal scroll-snap strip (`#mainstrip`, one slide per thumb, `aspect-ratio:1`) replaces it. Thumbs stay under it and scroll horizontally. | Product media (5 images) |
| 3b | Accordions `.pspecs` | Description, Specifications, How to use, Why choose ENSŌ, Warranty and support | 5 native `<details>`, all closed on load. Summary Montserrat 700 16px, padding 16px 0, "+" / "−" (Inter 800 22px) on the right, 1px rules. Body 15/24, 78% black, max 60ch. Specs/How/Why are `<dl>` with bold `dt` and grey `dd`. | Same, full width, placed after the buy card. | Product description + metafields (specs table, steps, reasons, warranty text) |
| 3c | Buy card `#buycard` | Status, title, variant picker, price, CTA, trust, facts, box contents, contact | 1px border, radius 12px, padding 28px 28px 24px. Top to bottom: status line; h1 (Inter 800 28/34); sub "The complete electric hookah"; 3 chips; variant picker (2 radio cards); note paragraph; price row; full-width black pill; 3 trust items in a 3-col grid; 4 bullet facts in 2 cols; "In the box" text; contact line. | Same order; facts become 1 column; trust items show only icon + bold line (the grey second line is hidden with `font-size:0`). | Product, variants, inventory; merchant-editable chips, trust items, facts |
| 4 | Why ENSŌ `#whyenso` | Four feature rows with looping video | Old theme "feature-videos" section. Header centred: eyebrow "Why ENSŌ" (16px, uppercase, 3.2px tracking, sand `#c8943a`) + h2 "Built around the ritual". Four rows, 64px apart, each a 2-col grid (640px media + text), alternating media left/right; text is left aligned on odd rows and **right aligned** on even rows. Media box 640x480 (4:3), radius 24px, white, 1px border rgba(0,0,0,.08), no shadow. h3 Inter 800 36/43.2; body 16/24 `#333`, max 46ch; text padding-inline 64px. | Below 750px: one column, media on top (350x263), text under it, always left aligned. | Merchant: section blocks (video, poster, heading, text, alignment) |
| 5 | `#tech` "Explore the features" | **Hidden** (`hidden` + `display:none`) carousel with one empty placeholder slide (`FEATS=[{id:'none'}]`) | Not rendered | Not rendered | Do not port. Its `aria-label` still says "Diamond features" |
| 6 | What is in the box `#witb` | Labelled device image + part tiles + counted list | Centred head: eyebrow "What is in the box" (black, uppercase, 3.2px) + h2 "Everything to start a session". Grid `1.15fr .85fr`, gap 28px: left a 766x766 white card (radius 24, 1px border) with the device photo and 7 pins; right a 4-column grid of 5 small tiles (8px gap), which leaves the fifth tile alone on a second row and a large empty area under it (see b09). Below, full width: a 3-column counted list of 7 rows; then a grey hint line. | Below 992px: one column: device card (358x358, short pin labels), then tiles in 3 columns, then the list in 1 column (below 768px). | Merchant section with blocks (pins: label, short label, x/y %, linked accessory; tiles: image, label, count, linked accessory; list rows: count, name, note) |
| 7 | Accessories carousel `#more` | Cross-sell | h2 "Accessories for ENSŌ" centred. Track max 1280px, 4 cards visible (305px each, 20px gap), 8 cards total, round black arrows 48px at the sides. Outline pill "View all accessories" under it. | Cards 72vw (281px), free horizontal scroll with snap, arrows hidden. | Collection or product list (merchant picks) |
| 8 | Guide band `#herb` | Link to the manual's packing chapter | Full-bleed link block, 520px high, no radius, photo cover + left-to-right dark gradient; copy bottom-left: h2 "Pack your blend" (white, 36/42), paragraph, white pill "How to pack the cup". | Photo `object-position:62% 50%`, bottom-to-top gradient, paragraph stays visible (15.5/23). | Merchant: image, heading, text, button, link |
| 9 | Awards `#awards` | Two awards | Max 1200px, padding 88px 0. h2 "World-class performance and design" centred (40/46, weight 600). Grid 2 equal columns, gap 56px: square photo (532px, radius 22) + list of 2 items (72px logo, h3 24/30 weight 600, text 15/24 66% black), divider between items. | Padding 56px 0, h2 28/34, single column (photo then list), logos 56px. Applies below 992px. | Merchant: image, heading, award blocks (logo, title, text) |
| 10 | FAQ `#faq` | 7 questions | Max 1280px. h2 "Frequently asked questions" (Inter 800 36/42). 7 `<details class="qa">`, summary 17px weight 500, padding 26px 0, "+" / "−" 26px; answer max 80ch, 72% black. | Same, full width. | Merchant blocks or product metafield |
| 11 | ENSŌ Experience `#exp` | Link card to the Experience hub | Rounded card (radius 28) 1360x702, photo darkened (`filter:brightness(.62)`) + left gradient. Copy: eyebrow "ENSŌ Experience", h2 two lines "You have seen what it is / Now see how it is used", paragraph, 5 outline chips (Quick start, Full manual, FAQ, Warranty, Firmware app), white button "Open ENSŌ Experience →". | Min-height 520px, paragraph hidden, gradient bottom-up. | Merchant: image, texts, chips, link |
| 12 | Help `#help` | Three info cards that open a modal | Max 1280px. h2 "Before and after you buy" left. 3 equal cards (radius 24, 1px border, padding 36px 32px 72px): 44px line icon, h3 (Inter 800 26/32), text 16/25, round grey "+" bottom-right. | 1 column. | Merchant blocks (icon, title, lead, modal sections with optional link) |

Buy card copy (exact):
- Status line (uppercase, 14px, 2.8px tracking, green 6px dot): "In stock · ships now"
- Chips: "No charcoal", "Battery powered", "Magnetic mouthpiece"
- Trust: "30 days to decide / From delivery", "Real people answer / Email support, in English", "EU prices include VAT / US prices before sales tax"
- Facts: "2 hours per battery", "180–330 °C, one dial", "Magnetic mouthpieces", "Two-year warranty, one year on the battery"
- In the box: "ENSŌ 2026 Edition · glass ThermoCap · brown leather strap · mouthpiece, 15 cm · blow-out valve · hose, 1.5 m · glass water tank · dip tube · **{battery}** **{extra}** · 2 ceramic cups · 10 disposable capsules · 3-in-1 multi-tool with glove · USB-C cable · 5 silicone mouth tips · cleaning brushes · 2 mesh screens · 5 glass balls for the valve · screen wipe · warranty card · manual" where `{battery}` and `{extra}` change with the variant (below)
- Contact: "Questions before you order: support@ensoshisha.eu"

Box section data:

| Pin (desktop label / mobile label) | Position | Opens accessory |
|---|---|---|
| Glass ThermoCap / ThermoCap | left 49.5%, top 9.9% | `e-glasscap` |
| Brown leather strap / Strap (label on the left) | right 59%, top 18.9% | `e-strap` |
| Mouthpiece · 15 cm / Mouthpiece | left 63%, top 29.5% | `e-mouthpiece` |
| Blow-out valve / Valve (left) | right 66%, top 47% | `e-choke` |
| Hose · 1.5 m / Hose | left 70%, top 62% | `e-hose12` |
| Glass water tank / Tank (left) | right 59.5%, top 86.5% | `e-tank` |
| Dip tube / Dip tube | left 49.5%, top 83.5% | `e-diptube` |

Tiles: Battery 1× (`e-battery`), Ceramic cups 2× (`e-cups`), Disposable capsules 10× (`e-disposable`), 3-in-1 multi-tool + glove 1× (`e-multitool`), Mesh screens 2× (`e-meshkit`).
List rows (not clickable): 1× USB-C cable · wall adapter not included; 5× Silicone mouth tips; 1 set Cleaning brushes · for the shaft; 5× Glass balls · for the blow-out valve; 1× ENSŌ screen wipe; 1× Warranty card; 1× User manual. Counts are sand-brown `#96671f`, bold.
Hint: "Tap a part to see what it is and where to get a spare. The wall adapter is not included."

Carousel cards, in order: ENSŌ Cleaning Glove €7.99; ENSŌ Angel Cloud Elite €19.99; ENSŌ 2026 Battery Plus €59.99 (out of stock); ENSŌ Backpack 3.0 €119.99; ENSŌ 2026 Glass Thermo Cap €29.99; ENSŌ 2026 Ceramic Cups, 3-pack €19.99 (out of stock); ENSŌ 2026 Glass Tank €19.99; ENSŌ 2026 Mesh Screens and Wax Pads €11.99. Each card: square image box (radius 12, 1px border, image `contain` with 6% padding), title (Inter 800 16/22, a link), a 3-line description written for the card (different text from `sub` in `acc-sheet.js`), then a footer row with price (Inter 800 18px) left and a small black pill right. Card: 1px border, radius 16, padding 20.

### 1.2 Behaviours (all triggered unless marked)

1. **Hero video**: `autoplay muted loop playsinline`, no `controls`, no `poster`. Playing on load (1080x608, 32s, `assets/live/a2f99e6f.mp4`, 1.9 MB). Not paused when scrolled away.
2. **"Learn more"** (`href="#whyenso"`): smooth scroll (`html{scroll-behavior:smooth}`), lands with the section 120px below the viewport top (`scroll-margin-top:120px`); URL gets `#whyenso`.
3. **Gallery, desktop**: clicking a thumb swaps `#mainimg` `src`/`alt` instantly (no fade) and moves `aria-current`. Clicking or hovering the main image does nothing (no zoom, no lightbox).
4. **Gallery, mobile**: the main image is a native horizontal scroll-snap strip; swiping it updates the active thumb (scroll listener, index = `round(scrollLeft / width)`); tapping a thumb smooth-scrolls the strip to that slide. No arrows, no dots, no loop.
5. **Accordions under the gallery**: native `<details>`, independent (many can be open; opened all five together). No animation. Because the left column grows, the sticky buy card stays pinned at `top:100px` (measured 99px) while the accordions are scrolled.
6. **Variant picker** (`role="radiogroup"`, two `role="radio"` buttons, selected = black 1.5px border + inset 1px ring). Selecting changes:

| | Standard battery (default) | Battery Plus |
|---|---|---|
| Option card | "Standard battery" / "Ready to ship" / €390 | "Battery Plus" / "Back in mid-October" / €420 |
| Status line | green dot, "In stock · ships now" | grey dot `#9a9a9a`, "Back in mid-October" |
| Note under picker | "The standard battery takes about 3 hours to charge fully (Battery Plus: about 1 hour 45 minutes). Same 2026 Edition. In the box: the 2026 glass ThermoCap, hose and magnetic mouthpiece, plus a spare hose and a short mouthpiece." | "The 2026 Edition with Battery Plus, which charges fully in about 1 hour 45 minutes. New units arrive in mid-October; leave your email and we will write as soon as they are in." |
| Price row | "€390.00" + "In stock" | "€420.00" + "Back in mid-October" |
| Button | black pill "Add to cart" (link) | grey pill "Out of stock" (a `<span>`, opacity .55, not clickable) + underlined text button "Remind me when it is back" |
| In the box | "standard battery" + " · spare hose and short mouthpiece" | "Battery Plus", the spare hose and short mouthpiece text is removed |
| `data-cart` on the button | `{"id":"enso","set":"enso-std","name":"ENSŌ Shisha 2026 Edition · Standard battery","price":390,"cur":"€"}` | unchanged (button hidden); no cart id exists for this variant |

   The sticky bar does **not** follow the picker: it always says "From €390" and always adds the Standard battery set. Gallery images do not change with the variant. Selection is not written to the URL.
   The script also defines a third variant that has no button: `duo` = "Standard battery + Battery Plus", €435.00, in stock, `set:"enso-duo"`. The FAQ answer "Which battery should I choose?" still describes it.
7. **Add to cart** (buy card, sticky bar, carousel cards, sheet): any `[data-cart]` click is intercepted site-wide; the link to `../pdp-v2/cart.html` is **not** followed. The item is pushed to `localStorage.ensoCart` (same id increments `qty`), the header bag gets a sand badge with the item count, and a black pill toast "{name} added" shows bottom-centre for 1.8s. No cart drawer opens. Stored example: `[{"qty":1,"id":"enso","set":"enso-std","name":"ENSŌ Shisha 2026 Edition · Standard battery","price":390,"cur":"€"}]`.
8. **Back-in-stock modal** (`#ensoRm`, shared markup at the end of the page; `window.ensoRemind(id,name)`): centred white card (max 440px, radius 20) on a 50% dark backdrop, z-index 10000. Eyebrow "Out of stock", title "Remind me when {name} is back", text "Leave your email and we will write to you as soon as it is back in stock. One email, nothing else.", pill email input, black "Notify me" button. Empty or invalid email shows red "Enter an email address like name@example.com" and keeps focus in the field. Valid email hides the form and shows "Thank you. We will email you when {name} is back in stock."; it stores `{id, at}` in `localStorage.ensoRemind` (the email itself is not stored or sent). Reopening for the same id shows "You are on the list. We will email you when {name} is back." Closes with ✕, backdrop click (code) and Esc (triggered). From the buy card the name is "ENSŌ 2026 Edition with Battery Plus" and the id is `enso`.
9. **Sticky buy bar**: gets `.is-on` when the bottom of `#buycard` is less than 64px from the viewport top (measured: off at y=1500, on at y=2000). Slides in with a 0.35s transform. Desktop: slides down from the top; when the header hides on scroll down the bar sits at `top:0`, when the header returns on scroll up the bar moves to `top:79px`. Mobile: slides up from the bottom and stays there. With accordions open the buy card stays sticky longer, so the bar appears later.
10. **Why ENSŌ videos**: each row is a `<lazy-video>` custom element (defined by the old theme's JS) holding a poster `<img>` and a `<video autoplay muted loop playsinline preload="auto">` that fades in over 0.7s once ready. All four were playing at the same time on load, including the ones far below the fold; they never pause. No controls, no click behaviour. All four rows use the **same** poster file (`assets/6403a43b-Screenshot_2026-09-21_111535-removebg-preview.png`, 528x472, alt text differs per row), so the poster shows the wrong picture for three rows until the video paints.
11. **Box pins**: hover or keyboard focus turns the label pill black with white text. Click opens the accessory sheet for the pin's `data-acc` id (behaviour 13). At 390 the same tap opens the sheet as a bottom sheet (the box section calls `openAccSheet` directly, so it does not navigate on phones).
12. **Box tiles**: hover lifts 2px with a soft shadow; click opens the sheet for the tile's id. The list rows and the hint are plain text. A second small dialog (`#wbPop`, with texts for "valve" and "hose") exists in the markup but nothing on the page triggers it (no `data-info` elements): dead code.
13. **Accessory sheet** (`#sheet`, injected by `acc-sheet.js`, `role="dialog" aria-modal="true"`):
    - Desktop: centred white box, 960px wide, radius 28, max-height 88vh with internal scroll, on a 40% black backdrop (z-index 100, so the header and sticky bar stay dimmed underneath). Fades in 0.25s, box rises 24px over 0.35s. A grey grab handle (44x5) is drawn at the top on desktop too. Round grey ✕ top-right (38px).
    - Layout: two columns (5fr / 6fr, gap 36, padding 28px 40px 40px). Left: square image box (radius 22, 1px border), image `contain` with 10% padding, cursor `zoom-in`. With two images: round white arrows left/right and two dots; the gallery is a scroll-snap strip (arrow click scrolled by one width, dot moved to the second; swipe works by native scroll). With one image the arrows and dots are hidden.
    - Right: uppercase grey "fits" line ("Fits ENSŌ 2026 Edition" / "Fits Diamond" / "Universal: fits every ENSŌ device"), h2 name (32/38), lead = `sub` (17px), then three fixed headings with text: "What it is" (`what`), "Why" (`why`), "How to use it" (`how`); then a buy row: price (Inter 800 26px, shown as €29.99, or without decimals for whole prices) + black pill "Add to cart"; then link "View full details ›" to `product.html#<id>`; then, if the item has `pair`, a grey line "The same for Diamond: {name}" or "The same for ENSŌ 2026: {name}" whose link swaps the sheet content to that item in place.
    - On enso.html the buy row is drawn inside a bordered rounded box because the sheet's `<div class="buy">` picks up the page's `.buy` card rule (border, radius, padding, `position:sticky`). This is a CSS collision, not a design decision; decide which look is wanted.
    - Out of stock item: button text "Out of stock", disabled, opacity .55; under the buy row an underlined "Remind me when in stock" that opens the back-in-stock modal on top of the sheet.
    - Add to cart: adds `{id,name,price,cur:'€'}` (quantity 1, no stepper), shows the toast and **closes the sheet**.
    - Close: ✕, Esc, backdrop click (all triggered). Body scroll is locked while open (`body{overflow:hidden}`), focus goes to ✕ on open and back to the opener on close. No focus trap.
    - Clicking the sheet image navigates to the full product page (`product.html#<id>`).
    - The sheet has an empty `#shOpts` "Pack size" group that is never filled: grouped items (disposable cups, hoses, straps, baskets) show only the one SKU that was opened, with no option switch.
    - Mobile (below 768px): bottom sheet, full width, top corners radius 28, one column, image box 4:3, internal scroll (measured 743px tall, content 920px).
14. **Accessory links open the sheet on desktop**: a document-level handler in `acc-sheet.js` catches every `a[href*="product.html#"]` outside the sheet when the viewport is wider than 991px and opens the sheet instead of navigating. At 991px and below the link is followed to `product.html#<id>` (triggered both ways with the carousel card title).
15. **Accessories carousel**: native horizontal scroll with `scroll-snap-type:x mandatory`; the arrows scroll by one card (card width + 20px, smooth). Eight cards, four visible: four clicks reach the end (scrollLeft 1300 of 1300). No loop, no autoplay, no dots, arrows are never disabled or hidden at the ends. Card hover: shadow `0 12px 40px rgba(0,0,0,.08)` and the single image scales to 1.04.
16. **Out-of-stock carousel card**: price with a small uppercase grey "Out of stock" under it, button label "Remind me". Clicking it on desktop opens **both** the accessory sheet (through the link handler of behaviour 14) and the back-in-stock modal on top of it (see c06); one Esc closes both. On mobile the link handler is skipped and the inline handler returns false, so only the modal should open (code read, not triggered).
17. **"View all accessories"**: outline pill, goes to `accessories.html#enso`.
18. **Guide band**: the whole band is one link to `../experience/enso.html#q-packing`; hover zooms the photo to 1.04 over 1.4s.
19. **FAQ**: native `<details>`, independent, all closed on load, no animation.
20. **Experience card**: whole card is one link to `../experience/index.html#enso`; hover zooms the photo to 1.04 and nudges the arrow 6px right.
21. **Help cards**: click, Enter or Space opens the modal (`#modal`, z-index 50, 55% backdrop, white box max 1040px, radius 24). Header: title + ✕. Body: sections of h4 + paragraph + optional underlined link. Footer: round ‹ › buttons and three dots; the arrows and keyboard ←/→ cycle through the three cards with wrap-around (triggered); a horizontal touch swipe of more than 40px does the same (code read, not triggered). Closes with ✕, Esc, backdrop. Body scroll locked. Card hover adds a shadow.
22. **Scroll restoration script**: on a fresh navigation the page forces scroll to top (or to the hash target) until the visitor interacts; `history.scrollRestoration='manual'`. Back/forward keeps the browser position.
23. **Other fixed elements seen on the page** (shared, other audits): gold scroll-progress bar at the very top (`.scroll-progress-bar`), header that hides on scroll down and returns on scroll up, "Welcome gift" tab bottom-left, 18+ age gate 3s after load unless `localStorage['over-21']` is set.

### 1.3 Links and buttons

| Element | Destination |
|---|---|
| Sticky bar "Add to cart", buy card "Add to cart" | `../pdp-v2/cart.html` in markup, intercepted: adds to `ensoCart` |
| Hero "Learn more" | `#whyenso` |
| How to use accordion "ENSŌ Experience" | `../experience/index.html` |
| Warranty accordion | `mailto:support@ensoshisha.eu`, `warranty.html`, `support.html` |
| Buy card contact | `mailto:support@ensoshisha.eu` |
| Carousel image + title | `product.html#<id>` (sheet on desktop, page on mobile) |
| Carousel "Add to cart" | intercepted, adds the accessory |
| Carousel "Remind me" | `product.html#<id>` in markup; opens the modal |
| "View all accessories" | `accessories.html#enso` |
| Guide band | `../experience/enso.html#q-packing` |
| Experience card | `../experience/index.html#enso` |
| Help modal links | `mailto:support@ensoshisha.eu?subject=Warranty`, `../partner-v2/warranty.html`, `mailto:support@ensoshisha.eu`, `../experience/`, `mailto:support@ensoshisha.eu?subject=Wholesale%20and%20distribution` |
| Sheet "View full details ›" | `product.html#<id>` |

No link on this page points at the live ensoshisha.eu site (only the canonical/og tags and the age-gate terms link in the shared footer area).

### 1.4 Responsive notes

- Breakpoints in the page CSS: 991px (buy area to one column, bar to the bottom, box section stacks, awards stack, help cards stack, carousel arrows hidden, sheet link behaviour), 767px (sheet becomes a bottom sheet, box list one column, hero line nowrap, guide band gradient), 749px (Why ENSŌ rows stack).
- 800px: single-column buy area with a 768px-wide gallery image; Why ENSŌ rows are still two columns (media 380px wide) because that section switches at 749px, not 991px.
- 1100px: buy area is two columns (452px + 520px). **The page scrolls sideways** (document width 1214px): the carousel arrows are positioned with `calc(50% - 640px - 24px)`, which becomes negative below about 1330px, so the right arrow sits 114px outside the viewport and the left arrow is off-screen. Affects every width from 992 to about 1330px.
- 390px: no horizontal overflow (document width 390). `body` has `padding-bottom:55px` reserved for the old theme's mobile bottom nav, which is not present.
- Mobile trust row loses its second lines ("From delivery", "Email support, in English", "US prices before sales tax").

### 1.5 Media

| Slot | File | Intrinsic | Notes |
|---|---|---|---|
| Hero video | `assets/live/a2f99e6f.mp4` | 1080x608, 32s, 1.9 MB | No poster. Likely LCP candidate area; nothing paints here until the video has data. Add a poster in the theme |
| Gallery | `assets/live/enso/g1.jpg`, `g2-grey.jpg`, `g3.jpg`, `g4.jpg`, `g5.jpg` | 1400x1049 each | Alts: "ENSŌ 2026 Edition, front three-quarter", "Front", "Back", "Side", "ThermoCap and strap, close". On mobile the first gallery image is the LCP candidate below the hero |
| Why ENSŌ videos | `assets/f178638f-…mp4` (720x720, 5.5s, 62 KB), `assets/e0f4f545-…mp4` (720x720, 5.1s, 1.3 MB), `assets/eac855a0-…mp4` (720x720, 4.7s, 51 KB), `assets/eaa9436a-…mp4` (1036x1080, 3.0s, 103 KB) | | Square videos shown `cover` in a 4:3 box, so top and bottom are cropped |
| Why ENSŌ poster | `assets/6403a43b-Screenshot_2026-09-21_111535-removebg-preview.png` | 528x472 | Same file for all four rows |
| Box device | `sku/witb/device-callout-side.jpg` | 1300x1300 | |
| Box tiles | `sku/witb/witb-battery.jpg`, `witb-cups.jpg`, `witb-capsules.jpg`, `witb-multitool.jpg` (900x900), `sku/live-acc/mesh-screen-kit-1.jpg` (1080x1080) | | |
| Carousel | `sku/live-acc/cleaning-glove-1.jpg` 1200x1200, `angel-pack-1.jpg` 1148x1200, `enso-battery-plus-1.jpg` 1080x1080, `enso-backpack-2-0-copy-1.jpg` 1080x1080, `glass-thermo-cap-1.jpg` 1200x991, `replacement-ceramic-cup-1.jpg` 1080x1080, `replacement-glass-tank-1.jpg` 1152x1153, `mesh-screen-and-wax-pad-kit-1.jpg` 800x800 | | |
| Guide band | `sku/jr-arch-cup.jpg` | 1600x1067 | |
| Awards | `sku/award-square-m.jpg` 1200x1200; logos `assets/c3732052-SM_Logo-1.webp` 200x201, `assets/13b827ca-red-dot-logo_….webp` 200x199 | | `loading="lazy"` on the photo |
| Experience card | `sku/enso-exp-tea.jpg` | 2200x1467 | Darkened with a CSS filter (`brightness(.62)`), `object-position:62% 45%` |

### 1.6 Design values (computed)

| Element | Value |
|---|---|
| Page tokens (`:root`) | `--ink:#000; --night:#07080a; --grey:#666; --line:rgb(0 0 0 / .1); --mist:#f5f5f4; --sand:#c8943a; --sand-dark:#b3832f; --header:80px; --bar:56px` |
| Body | Montserrat 16/28, black on white |
| Wrap | max 1600px, 40px side padding (16px below 992); narrow wrap 1280px |
| Section padding | 96px top/bottom (72px below 992) |
| Section h2 | Inter 800, 36/42, letter-spacing -0.9px |
| Hero heading | Inter 800 52/56, -1.3px (mobile 36/40) |
| Buy title h1 | Inter 800 28/34, -0.7px |
| Price | Inter 800 32px, -0.8px; stock text Montserrat 14px `#666` |
| Primary pill | black, white text, Montserrat 700 15px, uppercase, letter-spacing 1.5px, padding 20px 40px, radius 999px, 55px high; hover `#0f0f0f`. Small pill: 12px text, padding 12px 22px. Light pill: white with black text, hover `#f2f2f2`. Outline pill ("View all accessories"): transparent, 1px border rgba(0,0,0,.25) (black on hover), 13px, padding 16px 32px |
| Variant card | white, 1.5px border rgba(0,0,0,.14), radius 16, padding 12px 16px, 76px high; name Montserrat 700 15/20; small 13px 60% black; price Inter 800 16px; selected: black border + inset 1px black; focus ring 2px `#96671f` |
| Chips | 1px border, radius 999, padding 6px 12px, 13px |
| Buy card | 1px border rgba(0,0,0,.1), radius 12 |
| Eyebrows (theme `.eyebrow`) | 16px (14px in the buy card), weight 500, uppercase, letter-spacing .2em; sand `#c8943a` in Why ENSŌ, black in the box section, white 70% on the Experience card |
| Toast | black pill, white Montserrat 600 13px, bottom 96px, z-index 9001 |
| Cart badge | `#c8943a`, white Inter 700 11px, 18px circle |

### 1.7 Problems and open questions

1. **Price and stock conflict with devices.html** (section 2.7). Decide the variant structure: Standard battery €390 (in stock, default) and Battery Plus €420 (out of stock); is the €435 "Standard + Battery Plus" set a third variant or dropped? The FAQ still mentions it.
2. **Battery Plus has no cart data** in the handoff (no `set` id). It needs a real variant plus a back-in-stock integration; the modal here stores nothing useful.
3. **Help card says "Two years on Diamond"** on the ENSŌ 2026 page (copied from the Diamond page).
4. **Return policy is stated three ways**: buy card "30 days to decide, from delivery" and accordion "Within 30 days of delivery you can return the 2026 Edition in its box for a full refund"; help card and modal "14 days unopened, 30 days opened".
5. **Support language**: trust item says "Email support, in English"; the Warranty accordion says "A person answers in English, German or Russian".
6. **Cup capacity**: Specifications says "Cup 15–25 g, ceramic"; How to use says "8 to 13 g of molasses"; the Ceramic Cups accessory says "Pack 8–13 g".
7. **Naming**: "Blow-out valve" (pin, in-the-box text) opens the accessory "ENSŌ 2026 Purge Valve"; "ThermoCap" vs "Thermo Cap"; "disposable capsules" vs "Disposable Cups"; the box says the battery tile is the Battery Plus (`e-battery`, out of stock) although the default set ships the standard battery (`e-battery-std`).
8. **Em dashes in headings/body of the Why ENSŌ rows** ("Just clean, controlled heat — and a session…"), and Title Case headings ("Coal-Free Comfort", "Formidable Clouds") unlike the sentence case used elsewhere. Confirm the copy is final. The first row also makes a health claim ("no toxic carbon monoxide and none of the harmful chemicals") that the client should approve.
9. **Same poster image for all four Why ENSŌ videos**; all four videos autoplay from page load regardless of visibility (the 1.3 MB one included). The rebuild should load and play them only when in view.
10. **Hero video has no poster**; it is the first thing on the page.
11. **Horizontal scroll between 992 and about 1330px** caused by the carousel arrows (section 1.4).
12. **Desktop "Remind me" on a carousel card opens two overlays at once** (sheet + modal).
13. **Sheet buy row styling depends on a CSS collision** with the page's `.buy` rule; the sheet never shows pack-size options (`#shOpts` is empty).
14. **Box section layout**: five tiles in a four-column grid leave a lone tile and a large blank area on desktop. Confirm this is intended.
15. **Dead code not to port**: hidden `#tech` carousel (still labelled "Diamond features"), `FEATS`/feature modal variant (`.modal--feat`), `#wbPop`, `BOXPOS_UNUSED`, `window.ACCSUB` (Diamond ids only), `#fitsbox` and `#dloop` scripts (elements absent), the `data-opts` pack-size script for carousel cards (no card carries `data-opts`).
16. **SEO**: `og:image` is the favicon; no Product structured data.
17. The age-gate key is called `over-21` while the dialog asks "Are you 18 or older?" (shared; noted for the global audit).

---

## 2. `partner-v2/devices.html` · Devices collection (old theme template)

`<title>` "Devices · ENSŌ". Meta description "ENSŌ premium electric shisha: fire-free, cordless and magnetic. Your ritual, without charcoal." **No `<h1>`** on the page (the banner heading is an `<h2>`). Body class `template-collection`. The README suggests "page or collection"; the markup is a real collection template with `data-pagination-type="load_more"`.

### 2.1 Section inventory

| # | Section | Desktop 1440 | Mobile 390 | Content source |
|---|---|---|---|---|
| 1 | Hero banner (`.banner`, section `hero_banner_CzDtgQ`) | Full width, fixed 300px high, image `cover` with a black 35% overlay; heading "Devices" left aligned inside the 1280px container, white, Montserrat 700 56/61.6. Section settings exposed as CSS variables: heading size desktop 56 / mobile 32, overlay colour and opacity, content width 600/500px, height per breakpoint (300/300/300). | Same 300px height, heading 32px. | Merchant section (image, heading, overlay, heights); heading could come from the collection title |
| 2 | Breadcrumbs | "Home / Devices", muted; current page darker. Under the banner, inside the container. | Same | Collection |
| 3 | Collection tabs (`.mobile-collection-tabs`) | `display:none` | Horizontal scrolling pill row: "Devices (2)" active (black, white text), "Accessories (19)", "Herbal Molasses (3)" (outline pills) | Menu / collection list |
| 4 | Filter sidebar (`.collection__sidebar`) | Static left column 260px (layout grid `260px 988px`). Rows separated by 1px rules: three collection links with a right chevron ("Devices (2)", "Accessories (24)", "Herbal Molasses (3)"), then two open `<details>` groups: "Availability" (checkboxes "In stock (1)", "Out of stock (1)") and "Price" (dual-thumb range slider 0 to 420 + two number inputs with € prefix, placeholders "120.00" and "420.0"). Row text 16px weight 500. | Off-canvas drawer from the left (340px wide, full height, `position:fixed`, translated -340px when closed). Also used at 800px. | Shopify collection filters (`filter.v.availability`, `filter.v.price`), collection list |
| 5 | Toolbar | "2 products" (muted) on the left, native sort `<select>` on the right (13.3px, 1px `#333` border, radius 6px, 35px high). Options: Featured, Most relevant, Best selling, Alphabetically A-Z, Alphabetically Z-A, Price low to high, Price high to low, Date old to new, Date new to old. Filter button hidden. | Yellow "Filter" pill with a sliders icon on the left, "2 products" on the right; the toolbar sort select is hidden (it moves into the drawer). | Collection sort options |
| 6 | Product grid | 3 columns of 308px, gap 32px (third column empty with 2 products). Card: white, 1px border `#f5ebeb`, radius 12, padding 10px, 308x434. Square media 286px (radius 12), title Montserrat 500 18/25.2, price 18px extra bold, full-width dark pill button (`#1d1d1f`, white text, 16px weight 500, capitalised, 44px high, bag icon). | 2 columns (`collection--mobile-cols-2`), titles truncated with an ellipsis ("ENSŌ Shisha…"), same buttons. 800px: 2 columns of 364px. | Collection products |
| 7 | Pagination wrapper | Empty (2 products). Template supports a "load more" button. | | |

Product cards, exactly as shown:

| | Card 1 | Card 2 |
|---|---|---|
| Title | ENSŌ Shisha 2026 Edition | ENSŌ Diamond |
| Link | `enso.html` | `../pdp-v2/index.html` |
| Price text | **€420.00** | **€320** (no €349 compare-at) |
| Stock | "Out of stock" badge and "Out of stock" price label exist in the markup but are `display:none`; the button reads **"Out Of Stock"** and is disabled | Button "Add To Cart", enabled |
| Shopify ids in markup | product 8323645178169, variant 49661616783673, handle `enso`, `xb-is-in-stock="false"` | product 10199408247097, variant 53270960603449, handle `enso-diamond-pre-order`, `xb-is-in-stock="true"` |
| Images | `assets/dfd39f86-Product_1_1.webp` + hover `assets/3b265e0f-Product_1.1_1.webp` (700x700 files, declared 1328x1328) | primary is an **inline base64 JPEG of about 160 KB** embedded in the HTML (1128x1400), hover `sku/diamond-main.jpg` (1128x1400, declared 1856x2304) |
| Extras | hidden wishlist button | hidden wishlist button; hidden Loox star-rating block ("0.0 (0)") |

### 2.2 Behaviours

1. **Card hover (desktop)**: the title turns sand/gold and the second image replaces the first (seen in f02: the 2026 card switches to a front view). No lift or shadow.
2. **Card click**: the whole card is one `<a>`; title click on card 1 goes to `enso.html`, on card 2 to `../pdp-v2/index.html` (both triggered).
3. **Quick add** (button inside the card, a real `<form method="post" action="#">` with `name="id"` = variant id): in the static file a click just submits to `#` and reloads the page at the top; nothing is added to `ensoCart` and no drawer opens (the button carries no `data-cart`). In the old theme this posts to the cart and opens the cart drawer, with a spinner (`data-add-to-cart-spinner`) and labels `data-label-available="Add To Cart"` / `data-label-sold-out="Out of stock"`. NOT VERIFIED live: needs Shopify.
4. **Availability checkboxes, price slider, price inputs, sort select** (from `assets/5426b3f8-facets.js`, class `FacetFilters`): every change builds a query string from the checked boxes, price inputs and sort value, fetches `?section_id=<section>&…` (Shopify section rendering), replaces the sidebar, product grid, pagination and toolbar HTML, and pushes the new URL with `history.pushState`. Price changes are debounced 500ms; the two range thumbs cannot cross; the track fill is updated by inline `left/right` percentages; the two sort selects (toolbar and drawer) are kept in sync; open/closed state of filter groups is preserved across the swap; the section gets `collection--loading` during the fetch. Active-filter pills with remove buttons and a "clear all" link are handled by the script but do not appear in this static state. Triggered in the static file: the URL changes (for example `devices.html?filter.v.availability=1&sort_by=manual`, `?sort_by=price-ascending`, `?filter.v.price.gte=200&sort_by=manual`) but the file refetches itself, so the checkbox resets and both products stay. Real filtering NOT VERIFIED: needs Shopify.
5. **Filter groups**: native `<details>`, both open by default, independent; clicking "Availability" collapsed it.
6. **Collection links in the sidebar and tabs**: "Devices (2)" goes to `index.html#` (the home page, not this page); "Accessories" and "Herbal Molasses" both go to `accessories.html`.
7. **Mobile filter drawer**: "Filter" opens the sidebar as a left drawer (340px of 390, full height) with a dim overlay; `aria-expanded="true"` on the button, `aria-hidden="false"` on the drawer, `body.collection-drawer-open`. Drawer content: header "Filter" + ✕, the sort select, the three collection links, Availability, Price, and a full-width dark pill **"View Results (2)"** pinned at the bottom. It closes with ✕, the overlay, "View Results" (it only closes; filters already applied live) and Esc (all triggered except the overlay, which uses the same `data-sidebar-close` handler). Focus returns to the Filter button. Body scroll was not locked in the static file (computed `overflow: visible`).
8. **Header on load**: this file ships with `is-scrolled site-header--hidden` already on the header element, so the page opens with the header slid away and a blank 79px white strip above the banner on desktop and mobile (see e01, e07). It appears after scrolling. Almost certainly a capture artefact; flag for the global audit.

### 2.3 Links

Breadcrumb "Home" → `index.html`. Sidebar/tabs: `index.html#`, `accessories.html`, `accessories.html`. Cards: `enso.html`, `../pdp-v2/index.html`. No links to the live site in the page-specific part.

### 2.4 Responsive notes

- Sidebar becomes the drawer and the Filter button appears at 800px and below (exact breakpoint not measured; desktop layout at 1440, drawer at 800 and 390).
- Grid: 3 columns at 1440, 2 at 800 and 390.
- Collection tabs only on the drawer layouts. Tab count for Accessories says (19), the sidebar says (24).
- No horizontal overflow at 390.

### 2.5 Media

Banner `assets/2dbc8481-Enso-2.webp` (file 1600x418, declared 2067x540, `loading="eager" fetchpriority="high"`): the LCP element. No separate mobile image (the same wide image is cropped to 390x300). Card images as in the table above; all `loading="eager"`.

### 2.6 Design values

Banner heading Montserrat 700 56/61.6 white (mobile 32px). Card title Montserrat 500 18px; price 18px; card border `1px solid rgb(245,235,235)`, radius 12, padding 10. Quick-add button `#1d1d1f`, white, radius 999, 16px weight 500, `text-transform:capitalize`, 44px high. Filter pill yellow (theme accent), black text. Sidebar rows 16px weight 500 with 1px dark rules. This page uses Montserrat for headings while the new pages use Inter 800.

### 2.7 The ENSŌ 2026 price and stock conflict (exact wording)

| Where | Price shown | Stock shown | Button |
|---|---|---|---|
| enso.html sticky bar | "From €390" | none | "Add to cart" (adds Standard battery, €390) |
| enso.html buy card, Standard battery (default) | "€390" on the option, "€390.00" as the price | "In stock · ships now" (status line), "Ready to ship" (option), "In stock" (next to price) | "Add to cart" |
| enso.html buy card, Battery Plus | "€420" on the option, "€420.00" as the price | "Back in mid-October" (three places) | "Out of stock" (disabled) + "Remind me when it is back" |
| devices.html card | "€420.00" | hidden "Out of stock" badge, `xb-is-in-stock="false"` | "Out Of Stock" (disabled) |
| README | "ENSŌ 2026 Edition, from €390" | | |

The devices card is showing the old live product's single (Battery Plus) variant. In the rebuild the card should come from Shopify: "From €390", available, with the Standard battery as the first variant.

### 2.8 Problems and open questions

1. The conflict above.
2. Diamond card: "Add To Cart" and "€320" with no compare-at, while the README says "pre-order €320 (was €349)" and other pages use "Pre-order". Handle is `enso-diamond-pre-order`.
3. **Loox star-rating markup** is still in the Diamond card (hidden). House rule: no reviews or star ratings anywhere; remove it and the Loox app block.
4. A 160 KB base64 image is inlined in the HTML for the Diamond card.
5. No `<h1>`.
6. "Herbal Molasses (3)" collection and its tab point at `accessories.html`; is there a molasses collection at all in the new store? Accessory counts disagree (19 vs 24; `acc-sheet.js` has 44 SKUs / 39 products).
7. "Devices (2)" links to the home page.
8. Price filter placeholder "120.00" as the minimum although both devices cost more and the slider starts at 0.
9. Button label capitalisation ("Add To Cart", "Out Of Stock", "View Results (2)") differs from the sentence case used on the new pages ("Add to cart").
10. Is this page staying as a Shopify collection with filters (two products make filters and sort pointless), or should it become the "both devices side by side" page the README describes? Client decision.
11. Header hidden on load (2.2 item 8).

---

## 3. `partner-v2/product.html#<id>` · accessory product template

One HTML shell; `acc-sheet.js` provides `window.ENSO_ITEMS`; an inline script renders the item whose id equals the URL hash. Audited with `#x-glove` (universal, one image, in stock), `#e-disposable` → `#e-disposable50` (pack-size options, second option out of stock), `#e-battery` (out of stock, two images, has `pair`), `#d-shaft` ("photo coming soon" placeholder image, Diamond), `#e-strap` → `#e-strap-black` (Colour options with different images), `#e-hose12` (Diameter options, two of three out of stock), `#d-basket` (pack sizes), `#e-hoseadapter` ("pair" counted as 2 pieces).

### 3.1 Section inventory

| # | Block | Desktop 1440 | Mobile 390 | Data |
|---|---|---|---|---|
| 1 | Breadcrumbs `.pp__crumbs` | "Home › Accessories › {device}", 13px `#666`, hover black + underline. Container `.pp` max 1280px, padding 24px 40px 96px. | Padding 14px 16px 120px | Third crumb: "Diamond" → `accessories.html#diamond`, "ENSŌ 2026" → `accessories.html#enso`, "All accessories" → `accessories.html` for universal items |
| 2 | Top grid `.pp__top` | `1.1fr 1fr`, gap 56px. Left gallery (599px) is `position:sticky; top:96px`; right info column 545px. | One column, gap 22px, gallery static | |
| 2a | Gallery | Square white box, 1px border, radius 24, image `contain` with 6% padding. Thumbs (only when the item has 2 images): 84x84, radius 14, 1.5px border, black when selected. | Radius 20, thumbs 64x64 | `img`, `img2` |
| 2b | Badge `.pp__fits` | Grey pill (`#f5f5f4`), Montserrat 700 12px uppercase, .08em: "Fits Diamond" / "Fits ENSŌ 2026" / "Universal" | Same | `dev` |
| 2c | Title, subtitle | h1 Inter 40px line-height 1.1, -0.02em (CSS weight 700; only Inter 800 is loaded). Subtitle 18px, 75% black. The h1 shows the name **without** the pack/pair/option suffix (`gname` or the name minus ", N-pack" / ", pair"). | h1 30px, subtitle 16px | `name`/`gname`, `sub` |
| 2d | Price + stock | Price Inter 800 28px, always two decimals ("€7.99", "€12.00"). Stock: uppercase 12px weight 600, "In stock" green `#1f7a4d` or "Out of stock" grey `#666` | Same | `price`, `oos` |
| 2e | Options `.pp__opts` (grouped items only) | Uppercase grey label, then pill buttons (1.5px border, 9px 16px, Montserrat 600 14px); selected = black with white text; out-of-stock option = strikethrough grey text (still clickable). Label: "Colour" if the name contains "strap", "Diameter" if it contains "hose", otherwise "Pack size". | Same | `grp`, `opt` |
| 2f | Buy row | Quantity stepper (pill, 1.5px border, 52px high, "−" 1 "+") + black pill "Add to cart" (52px, Montserrat 700 13px uppercase, .1em) filling the rest | Same | |
| 2g | Dynamic checkout | Full-width black pill "Buy with  Pay" (Apple logo SVG, system font 600 16px, 52px) and a centred grey 13px link "More payment options" | Same | Shopify dynamic checkout button |
| 2h | Back-in-stock link | Underlined "Remind me when in stock", only when out of stock | Same | |
| 2i | Shipping notes `.pp__trust` | Three lines with 18px line icons, 14px, 75% black: "Ships from our EU warehouse, tracking by email"; "14 days to return an unopened item"; "Questions? support@ensoshisha.eu, a person answers" (plain text, not a link) | Same | Merchant (theme setting / blocks) |
| 2j | Accordions `#ppAcc` | Five blocks separated by 1px rules: Description, Specifications, What is in the box, How to use, Warranty and support. Summary Montserrat 700 16px, padding 18px 32px 18px 0, "+" / "–" at the right; body 15px/1.65, 78% black. | Same | See 3.2 item 6 |
| 3 | Three info cards `.pp__why` | 80px below; 3 equal columns, gap 20; each a grey card (`#f5f5f4`, radius 24, padding 28): h3 Inter 19px + text 15px/1.6. "Made as one system", "Original parts", "Support that answers" (texts in the markup, identical for every product) | One column, 48px above | Merchant (static blocks) |
| 4 | "Questions about this part" | h2 Inter 32px; max 860px wide; five `<details>`, summary Montserrat 600 17px, the first one open on load | h2 26px | Generated, see 3.2 item 7 |
| 5 | Related grid | h2 "More for Diamond" / "More for ENSŌ 2026" / "More accessories" (universal). A horizontal scroll-snap row, 4 cards visible (285px each, gap 20), up to 10 cards, no arrows or dots. Card: white, 1px border, radius 20, padding 16; square image; name Inter 700 15px; price Inter 800 16px; small uppercase "Out of stock" when relevant. Then an outline pill "View all accessories". | Cards 62% wide, swipe | Recommendations / same-device collection |
| 6 | Mobile sticky bar `#ppSticky` | Hidden | Fixed bottom bar (z-index 40, white, top border): small grey product name (one line, ellipsis) over the price (Inter 800 20px) on the left, "Add to cart" pill (48px high) on the right. Always visible, from the top of the page. Also shown at 800px (breakpoint 991px). | |

### 3.2 Behaviours

1. **Hash routing**: the id is read from `location.hash`; `hashchange` re-renders in place and scrolls to the top. A missing or unknown id redirects to `accessories.html` with `location.replace` (triggered with `#nope` and with no hash). The script also sets `document.title` to "{name} · ENSŌ Accessories" and the meta description to "{name}. {sub}. {what}" cut to 158 characters.
2. **Gallery**: clicking a thumb swaps the main image `src` and moves `aria-pressed`. No zoom, no swipe on the main image, no lightbox (clicking the main image does nothing).
3. **Options**: clicking an option replaces the hash with the sibling SKU's id (`history.replaceState`, so the Back button skips option changes) and re-renders everything: price, stock, images, specs, FAQ, title tag. The h1 stays the group name. Example: `#e-disposable` 20-pack €8.99 In stock → `#e-disposable50` 50-pack €19.99 Out of stock; `#e-strap` Beige → `#e-strap-black` swaps the image to `replacement-leather-strap-2.jpg`. The page scrolls to the top on every option click and the quantity resets to 1.
4. **Quantity**: minimum 1, maximum 20 (clicked 30 times: stays 20). Not an input, cannot be typed.
5. **Add to cart**: adds `{id,name,price,cur:'€',qty}` to `ensoCart` (the full SKU name, for example "ENSŌ 2026 Disposable Cups, 20-pack"), shows the toast "{name} added" and the header badge, and turns **both** buttons (main and mobile sticky) into a sand-brown `#96671f` state with a check icon and the label "Added to cart". The state stays until the quantity changes or the product changes; clicking again adds the quantity again (2 then 4 in the test). Out of stock: both buttons read "Out of stock", disabled, grey (`#f5f5f4`, text 45% black).
6. **Accordions**: rule in the script: a block whose text is shorter than 90 characters and has no list is shown flat (heading + text, no toggle); longer blocks are `<details>`, and only Description starts open. Independent toggles, no animation. Content per block:
   - Description: `what` + `why` as two paragraphs.
   - Specifications: a two-column `<dl>`: Product type (derived from keywords in the id/name: Battery pack, Cleaning scrubber, Cleaning brush, Mesh basket, Mesh screens, Silicone ring, Metal plate, Thermo cap, Adapter, Multi-tool, Tool, Backpack, Bag, Water tank, Hose, Mouthpiece, Carry strap, USB-C cable, Disposable cups, Ceramic cups, Heat insert, Purge valve, Glass collar, Dip tube, Packing set, Silicone covers, else Accessory); Fits ("ENSŌ Diamond" / "ENSŌ 2026 Edition" / "Universal: every ENSŌ device"); Pieces (only when more than 1, parsed from "N-pack" or "pair" in the name); the option label and value for grouped items; Availability.
   - What is in the box: "{pieces} × {name without the device prefix}", for example "1 × Cleaning Glove", "20 × Disposable Cups".
   - How to use: `how`; when it has more than one sentence it becomes a numbered list, one sentence per step.
   - Warranty and support: "If a part arrives damaged or does not fit, write to support@ensoshisha.eu within 48 hours of delivery with a photo, and we replace it." prefixed with "One year on the battery. " when the name contains "battery"; links "Warranty terms" (`warranty.html`) · "Support" (`support.html`).
7. **Questions accordion** (first open, independent): "Will it fit my device?" (universal: "Yes. It is universal and fits every ENSŌ device."; otherwise "It is made for {device}. It does not fit {other device}; see the accessories for your device."), "How do I use it?" (`how`), then either "How fast does it ship?" ("In-stock items leave our warehouse within 24 hours on working days, and you get a tracking link by email.") or, when out of stock, "When will it be back in stock?" ("We do not have a date yet. Tap Remind me when in stock and leave your email; we write to you as soon as it is back."), "What if it arrives damaged?" ("Photograph the damage and write to support@ensoshisha.eu within 48 hours of delivery. We send a replacement at no cost once the claim is approved."), "Can I return it?" ("An unopened item can be returned within 14 days of delivery for a full refund. Write to support@ensoshisha.eu first.").
8. **"Buy with Pay"**: adds the current item with the chosen quantity, then goes to the cart page (landed on `pdp-v2/cart.html?add=x-glove`, title "Your accessories · ENSŌ"). In Shopify this is the dynamic checkout button and would go straight to checkout with the wallet the browser supports.
9. **"More payment options"**: broken in the handoff. The script sets the href to `'../pdp-v2/cart.html' + id`, giving `../pdp-v2/cart.htmlx-glove`, a file that does not exist (triggered: the browser showed the raw file path as the title).
10. **Out-of-stock state**: the script sets `hidden` on "Buy with Pay" and "More payment options", but `.pp__pay{display:flex}` and `.pp__more{display:block}` override the attribute, so both **remain visible** under a disabled "Out of stock" button (seen on desktop h02 and mobile h11). Clicking "Buy with Pay" then would open the cart without adding anything (code read, not clicked).
11. **"Remind me when in stock"**: opens the shared back-in-stock modal titled "Remind me when {full SKU name} is back" (triggered for the 50-pack).
12. **Related grid**: items for the same device plus universal items (for a universal item: everything), excluding the current group, showing one card per option group (the first SKU of the group, labelled with the group name), in-stock first, first 10. Clicking a card changes the hash and re-renders at the top (on this page the desktop sheet is not used: `acc-sheet.js` skips its link handler when the path ends in `product.html`). No hover effect on the cards. "View all accessories" goes to `accessories.html#diamond`, `#enso` or no hash.
13. **Sticky gallery**: stays at 96px from the top while the right column scrolls (measured).
14. **Mobile sticky bar**: tapping "Add to cart" there behaves exactly like the main button, and both show "Added to cart".

### 3.3 Data model in `acc-sheet.js` (becomes Shopify product data)

`window.ENSO_ITEMS` is an array of 44 SKUs. Fields:

| Field | Type | Required | Meaning | Used by | Suggested Shopify home |
|---|---|---|---|---|---|
| `id` | string | yes | SKU id, also the URL hash and the cart id. Prefix `d-` Diamond, `e-` ENSŌ 2026, `x-` universal (but `e-filling` is universal too) | everything | product handle (ungrouped) or variant SKU (grouped) |
| `dev` | `'diamond'` \| `'enso'` \| `'both'` | yes | Device group | badge, breadcrumb, Fits, FAQ, related, accessories filter | metafield or tag; collection membership |
| `name` | string | yes | Full SKU name including pack size / colour / diameter | sheet title, cart line, title tag, sticky bar | product title (+ variant title) |
| `price` | number (EUR) | yes | | price | variant price |
| `img` | path | yes | Main image | gallery, cards | product/variant media 1 |
| `img2` | path | no (22 of 44) | Second image | gallery thumbs, sheet arrows/dots | product media 2 |
| `sub` | string | yes | One-line subtitle | under the title, sheet lead, meta description | metafield (subtitle) |
| `what` | string | yes | "What it is" | sheet; Description paragraph 1 | description or metafield |
| `why` | string | yes | "Why" | sheet; Description paragraph 2 | description or metafield |
| `how` | string | yes | "How to use it" (sentences become numbered steps) | sheet; How to use; FAQ answer | metafield |
| `pair` | id | no (9 of 44) | Equivalent accessory for the other device | sheet only ("The same for Diamond/ENSŌ 2026: …"); not used on product.html | product reference metafield |
| `grp` | string | no (9 SKUs in 4 groups) | Option group key | options on product.html, related grid de-duplication | one product with variants |
| `opt` | string | with `grp` | Option value label ("2-pack", "1.2 cm", "Beige") | option pills, Specifications | variant option value |
| `gname` | string | with `grp` | Group (product) name without the option | h1, related card | product title |
| `oos` | `true` | no (7 SKUs) | Out of stock | stock label, disabled button, remind link, FAQ, ordering | variant inventory |
| `ph` | `true` | no (3 SKUs) | The image is a "photo coming soon" placeholder | not read by product.html or the sheet (the placeholder is baked into the JPEG); NOT VERIFIED whether accessories.html uses it (out of scope) | nothing: needs real photos |

Derived on the page, not stored: product type, piece count, option label (Colour / Diameter / Pack size), "What is in the box" line, warranty prefix for batteries, the five FAQ answers. The carousel on enso.html has its own longer card descriptions that are not in this file.

Groups (should become one Shopify product with variants each): `d-baskets` = Diamond Mesh Screen Baskets (2-pack €16.99, 5-pack €24.99); `e-disp` = ENSŌ 2026 Disposable Cups (20-pack €8.99, 50-pack €19.99 oos); `e-hoses` = ENSŌ 2026 Hose, 1.5 m (1.2 cm €39.99, 1 cm €39.99 oos, 0.8 cm €29.99 oos); `e-straps` = ENSŌ 2026 Leather Strap (Beige €4.99, Black €4.99). 44 SKUs → 39 products: 16 Diamond SKUs (15 products), 26 ENSŌ 2026 SKUs (22 products), 2 universal.

Out of stock: `e-battery`, `e-battery-std`, `e-cups`, `e-flower`, `e-disposable50`, `e-hose10`, `e-hose08`. Placeholder photos: `d-shaft`, `d-case`, `d-bag`. All referenced image files exist. Diamond images live in `../pdp-v2/img/new/`, ENSŌ 2026 and universal images in `sku/live-acc/`.

`pair` links are not symmetric: `d-basket → e-mesh` but `e-mesh → d-screens`; `d-cap → e-glasscap`, `d-tool → e-multitool`, `e-mesh → d-screens` have no link back; `e-cuptool → d-tool` but `d-tool → e-multitool`.

Full list:

| id | name | price | device | sub | group / option | flags | pair | images |
|---|---|---|---|---|---|---|---|---|
| `d-battery` | Diamond Replacement Battery | €69.99 | Diamond | A second pack, ready when the first runs low |  |  | `e-battery` | sku-battery.jpg |
| `d-cup` | Diamond Ceramic Cups, 2-pack | €19.99 | Diamond | One in, one clean |  |  | `e-cups` | sku-cup.jpg, sku-cup-b.jpg |
| `d-basket2` | Diamond Mesh Screen Baskets, 2-pack | €16.99 | Diamond | Two spare baskets | `d-baskets` / 2-pack (gname: Diamond Mesh Screen Baskets) |  |  | sku-basket.jpg, sku-basket-b.jpg |
| `d-basket` | Diamond Mesh Screen Baskets, 5-pack | €24.99 | Diamond | For the loose, airy pack | `d-baskets` / 5-pack (gname: Diamond Mesh Screen Baskets) |  | `e-mesh` | sku-basket.jpg, sku-basket-b.jpg |
| `d-screens` | Diamond Flat Mesh Screens, 5-pack | €7.99 | Diamond | For the dense, even pack |  |  |  | sku-screens.jpg, sku-screens-b.jpg |
| `d-cap` | Diamond Thermo Cap, without Silicone | €35.99 | Diamond | The cap body |  |  | `e-glasscap` | sku-cap-shell.jpg, cap-parts-3.jpg |
| `d-cap-metal` | Diamond Thermo Cap, Metal | €26.99 | Diamond | The stainless steel plate of the cap |  |  |  | sku-cap-metal.jpg, cap-parts-3.jpg |
| `d-topcap` | Diamond Top Cap Silicone Part | €5.99 | Diamond | The silicone ring of the cap |  |  |  | sku-cap-silicone.jpg, cap-parts-3.jpg |
| `d-adapter-long` | Diamond Connection Silicone Adapter, Long | €3.99 | Diamond | For taller stems |  |  |  | sku-adapter-tall.jpg |
| `d-adapter-short` | Diamond Connection Silicone Adapter, Short | €3.99 | Diamond | For shorter stems |  |  |  | sku-adapter-short.jpg |
| `d-shaft` | Diamond Side Shaft Silicone Covers, 2-pack | €2.99 | Diamond | Two spare covers |  | ph |  | sku-ph-d-shaft.jpg |
| `d-tool` | Diamond Cup Removal Tool | €18.99 | Diamond | Lifts the hot cup out |  |  | `e-multitool` | sku-tool.jpg, sku-tool-b.jpg |
| `d-brush` | Diamond Cleaning Brush | €3.99 | Diamond | For the chamber and the cup |  |  |  | sku-brush.jpg |
| `d-cable` | Diamond USB-C Cable | €4.99 | Diamond | Braided, 1.5 m |  |  |  | sku-cable.jpg |
| `d-case` | Diamond Travel Bag | €34.99 | Diamond | For Diamond and the accessories |  | ph |  | sku-ph-d-case.jpg |
| `d-bag` | Diamond String Bag | €6.99 | Diamond | For the device alone |  | ph |  | sku-ph-d-bag.jpg |
| `x-glove` | ENSŌ Cleaning Glove | €7.99 | Both | For cups, baskets and screens |  |  |  | cleaning-glove-1.jpg |
| `e-angel` | ENSŌ Angel Cloud Elite | €19.99 | ENSŌ 2026 | Holds the heat, lowers the temperature |  |  |  | angel-pack-1.jpg |
| `e-backpack` | ENSŌ Backpack 3.0 | €119.99 | ENSŌ 2026 | Carries the whole system |  |  |  | enso-backpack-2-0-copy-1.jpg |
| `e-glasscap` | ENSŌ 2026 Glass Thermo Cap | €29.99 | ENSŌ 2026 | The see-through cap |  |  |  | glass-thermo-cap-1.jpg |
| `e-hoseadapter` | ENSŌ 2026 Hose Adapters, pair | €29.99 | ENSŌ 2026 | Use a regular hookah hose |  |  |  | hose-adapter-1-1.jpg |
| `e-hoseadapter-disp` | ENSŌ 2026 Disposable Hose Adapter | €6.99 | ENSŌ 2026 | For standard disposable hoses |  |  |  | disposable-hose-adapter-1.jpg |
| `e-choke` | ENSŌ 2026 Purge Valve | €19.99 | ENSŌ 2026 | Clears stale smoke from the base |  |  |  | choke-valve-1.jpg |
| `e-multitool` | ENSŌ 2026 3-in-1 Multi-Tool | €19.99 | ENSŌ 2026 | For cleaning and packing |  |  |  | multi-tool-1.jpg |
| `e-battery` | ENSŌ 2026 Battery Plus | €59.99 | ENSŌ 2026 | Four LEDs, fast charge |  | oos | `d-battery` | enso-battery-plus-1.jpg, enso-battery-plus-2.jpg |
| `e-battery-std` | ENSŌ 2026 Battery | €49.99 | ENSŌ 2026 | The standard pack |  | oos |  | enso-battery-1.jpg, enso-battery-2.jpg |
| `e-mesh` | ENSŌ 2026 Mesh Screens and Wax Pads | €11.99 | ENSŌ 2026 | Five screens, two wax pads |  |  | `d-screens` | mesh-screen-and-wax-pad-kit-1.jpg |
| `e-meshkit` | ENSŌ 2026 Mesh Screen Kit | €6.99 | ENSŌ 2026 | Spare screens |  |  |  | mesh-screen-kit-1.jpg |
| `e-tank` | ENSŌ 2026 Glass Tank | €19.99 | ENSŌ 2026 | The spare water tank |  |  |  | replacement-glass-tank-1.jpg, replacement-glass-tank-2.jpg |
| `e-acrylic` | ENSŌ 2026 Acrylic Tank | €20.99 | ENSŌ 2026 | Unbreakable, for travel |  |  |  | acrylic-tank-1.jpg |
| `e-diptube` | ENSŌ 2026 Dip Tube | €12.00 | ENSŌ 2026 | The spare dip tube |  |  |  | replacement-dip-tube-1.jpg, replacement-dip-tube-2.jpg |
| `e-collar` | ENSŌ 2026 Glass Collar | €19.99 | ENSŌ 2026 | More tobacco, longer sessions |  |  |  | glass-collar-1.jpg, glass-collar-2.jpg |
| `e-cups` | ENSŌ 2026 Ceramic Cups, 3-pack | €19.99 | ENSŌ 2026 | Three spare cups |  | oos | `d-cup` | replacement-ceramic-cup-1.jpg, replacement-ceramic-cup-2.jpg |
| `e-flower` | ENSŌ 2026 Flower Cups, 2-pack | €20.99 | ENSŌ 2026 | Perforated cup for a lighter pack |  | oos |  | flower-cup-2-pack-1.jpg, flower-cup-2-pack-2.jpg |
| `e-disposable` | ENSŌ 2026 Disposable Cups, 20-pack | €8.99 | ENSŌ 2026 | For lounges and parties | `e-disp` / 20-pack (gname: ENSŌ 2026 Disposable Cups) |  |  | disposable-cups-10-pack-1.jpg, disposable-cups-10-pack-2.jpg |
| `e-disposable50` | ENSŌ 2026 Disposable Cups, 50-pack | €19.99 | ENSŌ 2026 | For lounges and parties | `e-disp` / 50-pack (gname: ENSŌ 2026 Disposable Cups) | oos |  | disposable-cups-10-pack-1.jpg, disposable-cups-10-pack-2.jpg |
| `e-filling` | ENSŌ Filling Set | €14.99 | Both | Mat and filling fork, for every ENSŌ |  |  |  | enso-filling-set-1.jpg, enso-filling-set-2.jpg |
| `e-hose12` | ENSŌ 2026 Hose, 1.5 m, 1.2 cm | €39.99 | ENSŌ 2026 | Choose the diameter | `e-hoses` / 1.2 cm (gname: ENSŌ 2026 Hose, 1.5 m) |  |  | enso-custom-hoses-1.jpg, enso-custom-hoses-2.jpg |
| `e-hose10` | ENSŌ 2026 Hose, 1.5 m, 1 cm | €39.99 | ENSŌ 2026 | Choose the diameter | `e-hoses` / 1 cm (gname: ENSŌ 2026 Hose, 1.5 m) | oos |  | enso-custom-hoses-1.jpg, enso-custom-hoses-2.jpg |
| `e-hose08` | ENSŌ 2026 Hose, 1.5 m, 0.8 cm | €29.99 | ENSŌ 2026 | Choose the diameter | `e-hoses` / 0.8 cm (gname: ENSŌ 2026 Hose, 1.5 m) | oos |  | enso-custom-hoses-1.jpg, enso-custom-hoses-2.jpg |
| `e-mouthpiece` | ENSŌ 2026 Mouthpiece | €29.99 | ENSŌ 2026 | 15 cm, the spare |  |  |  | replacement-mouthpiece-1.jpg |
| `e-cuptool` | ENSŌ 2026 Cup Removal Tool | €14.99 | ENSŌ 2026 | Lifts the hot cup out |  |  | `d-tool` | cup-removal-tool-1.jpg, cup-removal-tool-2.jpg |
| `e-strap` | ENSŌ 2026 Leather Strap, Beige | €4.99 | ENSŌ 2026 | Beige or black | `e-straps` / Beige (gname: ENSŌ 2026 Leather Strap) |  |  | replacement-leather-strap-1.jpg |
| `e-strap-black` | ENSŌ 2026 Leather Strap, Black | €4.99 | ENSŌ 2026 | Beige or black | `e-straps` / Black (gname: ENSŌ 2026 Leather Strap) |  |  | replacement-leather-strap-2.jpg |

### 3.4 Links

Breadcrumbs: `index.html`, `accessories.html`, `accessories.html[#diamond|#enso]`. "Buy with Pay" → adds, then `../pdp-v2/cart.html`. "More payment options" → broken (`../pdp-v2/cart.html<id>`). Warranty accordion: `warranty.html`, `support.html` (rendered in body colour with no underline, so they do not look like links, see g04). Related cards: `product.html#<id>`. "View all accessories": `accessories.html[#diamond|#enso]`. The support address in the shipping notes, the grey cards and the FAQ is plain text, not a mailto link.

### 3.5 Responsive notes

- One breakpoint at 991px: single column, gallery not sticky, thumbs 64px, h1 30px, grey cards stacked, related cards 62% wide, sticky bottom bar on, bottom padding 120px.
- 800px: same as mobile, with a 768px-wide gallery box (see h15); the image fills the first screen and the title starts below the fold.
- 1100px: desktop two-column layout.
- 390px: no horizontal overflow. In the sticky bar the product name line clips the macron: it reads "ENSO 2026 Battery Plus" / "ENSO Cleaning Glove" (see h10, h14) because the one-line `overflow:hidden` label cuts the top of the Ō. House rule: ENSŌ always with the macron.
- The "Welcome gift" tab overlaps the sticky bar's left side when it is showing (h11).

### 3.6 Media

Main image is set by JS (`<img id="ppImg" src="data:,">` in the markup), so the LCP image is discovered late; in Shopify it should be server-rendered with `fetchpriority="high"`. Sample intrinsic sizes: `cleaning-glove-1.jpg` 1200x1200, `enso-battery-plus-2.jpg` 1080x1080, `sku-ph-d-shaft.jpg` 1200x1200 (grey card with a camera icon, the part name and "PHOTO COMING SOON" baked in). Images are a mix of square sizes from 800 to 1200px; all are shown `contain` on white. Related-card images are `loading="lazy"`.

### 3.7 Design values (computed at 1440)

| Element | Value |
|---|---|
| Tokens | `--ink:#000; --grey:#666; --line:rgb(0 0 0 / .1); --mist:#f5f5f4; --night:#1d1d1f; --sand:#c8943a`; confirm/added state `#96671f`; in-stock green `#1f7a4d`; focus ring 2px `#96671f`, offset 2px |
| Container | max 1280px, padding 24px 40px 96px; base Montserrat 16px/1.4 |
| h1 | Inter, 40px/44px, -0.8px |
| Subtitle | Montserrat 400 18/27, 75% black |
| Price | Inter 800 28px |
| Badge | `#f5f5f4`, radius 999, padding 6px 12px, Montserrat 700 12px uppercase, 0.96px tracking |
| Add to cart | black, radius 999, 52px high, Montserrat 700 13px uppercase, 1.3px tracking; disabled `#f5f5f4` with 45% black text |
| Quantity | 114x52 pill, 1.5px border rgba(0,0,0,.1), buttons 44px wide, 20px glyphs |
| Pay button | black, radius 999, 52px, `-apple-system, Helvetica, Arial` 600 16px |
| Accordion summary | Montserrat 700 16px; body 15px/24.75px, 78% black |
| Grey cards | `#f5f5f4`, radius 24, padding 28; h3 Inter 19px; text 15/24, 72% black |
| Section h2 | Inter 32px/38.4px, -0.64px; sections 80px apart (48px mobile) |
| FAQ summary | Montserrat 600 17px, padding 18px 32px 18px 0; answer max 70ch, line-height 1.65 |
| Related card | white, 1px border, radius 20, padding 16; name Inter 700 15/19.5; price Inter 800 16px |
| Outline button | 48px high, padding 0 28px, 1px border rgba(0,0,0,.25), Montserrat 700 13px uppercase, 1.3px tracking |

### 3.8 Problems and open questions

1. "More payment options" link is broken; "Buy with Pay" and "More payment options" stay visible when the item is out of stock (3.2 items 9 and 10).
2. Macron clipped in the mobile sticky bar (3.5).
3. Three products ship with "photo coming soon" placeholders (`d-shaft`, `d-case`, `d-bag`) and are sold as in stock. Real photos needed before launch, or hide the products.
4. Product titles: the h1 drops the pack size ("Diamond Ceramic Cups" for "Diamond Ceramic Cups, 2-pack", "ENSŌ 2026 Hose Adapters" for "…, pair") while cards, cart and title tag keep it. Decide the Shopify title convention. Diamond accessories are titled "Diamond …" without "ENSŌ" (rule: "ENSŌ Diamond").
5. Return and damage wording here ("14 days to return an unopened item", claims "within 48 hours of delivery") differs from the device page ("30 days to decide").
6. "We send a replacement at no cost once the claim is approved": not the word "free", but close to the house rule; confirm.
7. The Specifications, What is in the box, product type, FAQ and warranty text are generated by string rules in JS. In Shopify they need a real source: metafields per product, or the same rules in Liquid driven by product type and tags. Client or developer decision.
8. Every option click scrolls to the top and resets the quantity; fine for a hash-driven demo, wrong for a variant picker. The rebuild should update in place.
9. The "Buy with Pay" button is a static Apple Pay look-alike; the real Shopify dynamic checkout button changes brand per browser/wallet and cannot be restyled freely.
10. Colour option for straps: the Beige photo shows both straps together (`replacement-leather-strap-1.jpg`); the Black one shows the black strap.
11. `pair` links are inconsistent (3.3) and are not shown on the product page at all, only in the sheet.
12. Related grid has no arrows on desktop: 10 cards, 4 visible, only trackpad/shift-wheel scrolling reveals the rest.
13. Heading weights rely on Inter 700, which is not loaded (see Summary).
