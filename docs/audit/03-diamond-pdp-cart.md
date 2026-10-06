# Audit 03: ENSŌ Diamond product page and cart

Pages: `pdp-v2/index.html` (Diamond PDP) and `pdp-v2/cart.html` (cart). Shared header, footer, search, age gate, Welcome gift tab and scroll-progress line are out of scope (other auditor).

Method: both pages driven in headless Chrome at 1440x900, 390x844 (touch), plus 800, 1000 and 1200 wide. Every behaviour below was triggered unless marked "from code" or "NOT VERIFIED". The driver reported no page JS errors in any run. Screenshots: scratch `shots/diamond/` (`a-*` inventory, `b-*` desktop interactions, `c-*` cart, `d-*` mobile and mid widths).

## Summary

- The PDP is one long page: fixed buy bar, full-bleed teaser video, buy box (gallery + sticky card + 6 spec accordions), then 11 content sections. Page-specific CSS is one 52 KB `<style>` block and the JS one 26 KB inline script plus `partner-v2/acc-sheet.js`. Everything else in the file (about 400 KB) is old-theme CSS.
- Three overlay systems: one shared **modal** (`#modal`) used by features, "What is in the box" and help cards; the **accessory sheet** (`#sheet`, injected by `acc-sheet.js`); and a **toast**. No lightbox or zoom on the gallery.
- Cart is fake: every `[data-cart]` click is intercepted (no navigation), written to `localStorage.ensoCart`, a toast shows and the header badge updates. The README's "small bar at the bottom of the page" is **switched off in code** (`if(true) return;`), it never renders.
- `cart.html` is not a plain cart. It has four modes (empty, device, accessories, mixed). With one device in it, it becomes a **configurator** ("Choose your Diamond": pick a set, add accessories). The checkout button is a plain link to the live site's Diamond product, in a new tab, whatever is in the cart.
- Breakpoints: one main breakpoint at **991/992 px** for everything on the PDP and cart; the accessory sheet and the empty-cart grid switch at **767 px**.

---

# Page 1: `pdp-v2/index.html`

`<title>` "ENSŌ Diamond · Electric Heater for Your Hookah, Coal-Free". Canonical and `og:url` point at `https://ensoshisha.eu/products/enso-diamond-pre-order`. Document height 11645 px at 1440, 13167 px at 390.

## 1.1 Section inventory (top to bottom)

Container `.wrap`: max-width 1600, side padding 40 (16 below 992). Narrow container `.wrap--n`: max-width 1280. Standard section `.sec`: padding 96px 0 (72px below 992).

| # | Section (id, working name) | Purpose and desktop layout | Mobile (390) | Content source |
|---|---|---|---|---|
| 0 | `#bar` sticky buy bar | Fixed strip, 56 px high, white 94% + blur(10px), bottom border. Left: "ENSŌ Diamond · Pre-order" (Inter 800 16px). Right: "€320.00" + struck "€349.00" + small black pill "Pre-order". | Fixed to the **bottom**, border on top. Title wraps to 3 lines and the pill label to 2 ("PRE-/ORDER"), bar ends up 105 px tall. | Product title, price, compare-at price, variant id |
| 1 | `#hero` (B01) teaser band | Full-bleed (100vw) video, height `min(84vh, 920px)` = 756 px, 24 px margin above and below, night background `#07080a`, bottom 60% black gradient. Copy bottom-left: heading (it is an `h2`, not `h1`) "The electric heater for your hookah" 52/56 Inter 800 white, one paragraph; bottom-right white pill "Learn more". | Video `min(64vh, 560px)` = 540 px. Copy stacks, heading 36/40, pill under the text. | Merchant: video, poster, heading, text, button label + anchor |
| 2 | `#buy` (B02) buy box | Grid `minmax(0,680px) minmax(380px,520px)`, gap 48, centred, padding 48px 0 56px. Left column: gallery then spec accordions. Right: buy card, `position: sticky; top: 99px` (header 79 + 20), 1px border, radius 12, padding 28. | One column. Order: gallery, buy card, spec accordions (`.pcol` becomes `display: contents`). Card is static, padding 20. | Shopify product (media, title, price, compare-at) + merchant/metafield text |
| 3 | `#heater` (B02b) | Two columns 1fr/1fr, gap 56. Left: image 4:3, radius 28. Right: eyebrow "What it is", `h2` 40/44, paragraph, three facts each with a 2 px sand left border (title Inter 800 18/24, text 14/21). | Stacked, image first, `h2` 30/34. | Merchant |
| 4 | `#tech` (B03) "Explore the features" | Mist background `#f5f5f4`, `padding-top: 88px`. Left-aligned heading + sub. Carousel of 8 cards, each `min(900px, 76vw)` wide, radius 28, white, 4:3 image on top and caption row (title 28/34 + sub 17/26 grey). Round white arrows on the image edges, dots + pause button centred below. | Cards 88vw (343 px), image 4:5, caption stacked 22/28 + 15/23, arrows hidden, dots + pause stay. | Merchant (8 blocks: image, title, sub, long text, 3 sub-points, small note) |
| 5 | `#dial` (B05) "One dial, every setting" | Centred heading + sub. Grid `1fr minmax(360px,460px)`, gap 48. Left: video box 3:2, radius 22, max-height 66vh. Right: three clickable lines separated by hairlines, then a grey hint. | Stacked, video first (3:2), hint hidden. | Merchant (video, 3 lines each with a screen image) |
| 6 | `#fits` (B03b) | Reversed two-column block: copy left (max 600), tall hookah image right (`height: min(620px, 72vh)`, object-fit contain, white), gap 220, centred. Eyebrow "Fits any hookah", `h2`, paragraph, three sand-bordered facts. | Stacked, image first (`min(460px, 56vh)` high), then copy. | Merchant |
| 7 | `#acchero` (B12) | One big link card, radius 28, min-height 760, image cover anchored bottom, dark gradient from the top. Copy top-left with 56 px padding: eyebrow "Accessories", `h2` 64/68, paragraph 15/23, sand pill "Shop accessories" pinned bottom-left. | Min-height 560, padding 24/20, `h2` 40/44, **different image** (`acc-hero-mobile.jpg`). | Merchant (2 images, text, link) |
| 8 | `#package` (B11) "What is in the box" | Two columns 1fr/1fr, gap 56. Left: mist panel, radius 28, padding 24, 6-column grid of 9 cut-out part buttons (device spans 3x3). Right: `h2` that is a button with a "›", paragraph, 8-row list with counts right-aligned. | Order becomes heading, paragraph, picture, list. Picture grid is 4 columns (device 2x2). | Merchant (9 parts: image, name, count, linked accessory) |
| 9 | `#more` (B13) "You might also like" | Centred `h2`. Horizontal scroll-snap row, max-width 1280, 16 cards, 4 visible (305 px each, gap 20). Card: radius 16, padding 20, square image with border radius 12, title 16/22, grey text 13/19, footer row price (Inter 800 18) + small pill "Add to cart". Dark round arrows left/right. Outline pill "View all accessories" centred below. | Cards 72vw (281 px), arrows hidden, native swipe. | Shopify collection/product list (16 products, one with 2 variants) |
| 10 | `#bowl` (B07) | Dark banner, radius 22, aspect 19:10 (716 px high at 1440), image cover, left dark gradient, copy left: `h2` 44/48 white, paragraph, white pill "Open the guide" + ghost pill "Shop". | Image on top (1:1, **different image**), copy below on `#0f0d0b`. | Merchant |
| 11 | `#faq` (B14) | Narrow container. `h2`, 6 questions visible + 9 more hidden, then two outline pills "Show more" and "Full FAQ". Question row padding 26px 0, 17px/500, "+" on the right. | Same, full width. | Merchant (15 Q&A; could be metaobjects shared with the FAQ page) |
| 12 | `#exp` (B16) | One big link card, radius 28, `min-height: min(78vh, 760px)`, image cover, left dark gradient. Copy bottom-left: eyebrow "ENSŌ Experience", `h2`, paragraph, 4 outline chips, white pill "Open ENSŌ Experience →". | Min-height 520, **different image**, paragraph hidden, gradient runs top to bottom. | Merchant |
| 13 | `#help` (B15) "Before and after you buy" | Narrow container. Left-aligned `h2`. Three cards in a row, radius 24, padding 36/32/72, line icon 44 px, title 26/32, text 16/25, round "+" bottom-right. | Stacked. | Merchant (3 cards, each with 3 modal sub-sections and links) |

Overlays living at the end of `<main>`: `#modal` (shared), `#sheet` (injected), `.enso-toast` (injected on first add).

### Buy box detail (section 2)

Gallery
- Main image box: square, 680 px at 1440, 1px border, radius 12, `object-fit: contain` on white. Seven thumbs below in a row, 76x76, radius 8, gap 10, active thumb 2 px black border.
- Thumbs in order: `g-3q-right`, `g-hookah`, `g-3q-left`, `g-top-3q`, `g-open`, `g-back`, `g-top` (all `pdp-v2/img/`). No video in the gallery, no zoom, no lightbox, no arrows.

Buy card (top to bottom)
1. Eyebrow "Pre-order" with a 6 px green dot (`#16a34a`). This is the "pre-order badge". 14px, weight 500, uppercase, letter-spacing 2.8px.
2. `h1` "ENSŌ Diamond" (Inter 800 28/34). This is the only `h1` on the page.
3. Sub line "Electric heat for the hookah you already own".
4. Price row: "€320.00" (Inter 800 32) + struck "€349.00" (Inter 700 22, 45% black) + full-width note "Last pre-order price. The final price after launch is €349." (15px, 66% black). A sand "save" badge style exists in CSS (`.price__save`) but is not used.
5. Full-width black pill "Pre-order" (padding 20px 40px, 15px/700, uppercase, letter-spacing 1.5px, 55 px high). `href="cart.html"`, `data-cart='{"id":"diamond","name":"ENSŌ Diamond","price":320,"cur":"€"}'`.
6. Three trust items in 3 columns, each icon + bold line + grey line: "30 days to decide / From delivery", "Real people answer / Email support, in English", "EU prices include VAT / US prices before sales tax". On mobile only the bold line shows (the grey line is hidden with `font-size: 0`).
7. Bullet list (2 columns desktop, 1 mobile), 5 items: seven minutes to first draw, 90 minutes per battery, fits most stems, two-year warranty, ships from Hungary.
8. "In the box" paragraph ending with the link "See it laid out" (`#package`).
9. "Questions before you order: support@ensoshisha.eu" (mailto).

No quantity selector, no variant picker, no stock or delivery date, no payment icons, no dynamic checkout buttons.

Spec accordions (under the gallery on desktop, under the buy card on mobile): native `<details>`, six of them, all closed on load: Product dimensions, Heating, Battery and charging, Controls, Materials, Compatibility. The first holds a `dl` plus a silhouette image with "18 cm" (vertical) and "10 cm" labels drawn in CSS; the next four hold a `dl` (bold term, grey description); the last is one paragraph.

## 1.2 Behaviours (all triggered unless noted)

### Sticky buy bar
1. **When it shows**: class `is-on` is set when the buy card's bottom edge is above 64 px from the viewport top (`buycard.getBoundingClientRect().bottom < 64`), checked on scroll and resize. At 1440 that is around scrollY 2040 (off at 1800, on at 2500); at 390 around 1950 (off at 1900, on at 2100). It never hides again further down the page, it stays to the footer. Scrolling back up above the threshold hides it.
2. **Where it sits (desktop)**: it follows the theme header, which hides on scroll down and returns on scroll up. Header hidden: bar at `top: 0`. Header visible: bar at `top: 79px`, directly under the header. `top` animates over .3s; show/hide is a `translateY(-110%)` slide over .35s `cubic-bezier(.2,.8,.2,1)`. z-index 29 (header is above it).
3. **Mobile (below 992)**: fixed at `bottom: 0`, slides up from below. CSS also reserves `bottom: 67px` when a `.mobile-bottom-nav` exists, but no such nav exists in the handoff.
4. Its pill adds Diamond to the cart exactly like the main button (checked: quantity went up by one, toast showed).

### Hero video
5. `autoplay muted loop playsinline`, poster `media/teaser-poster.jpg`, no controls, no pause button, no sound toggle. Source 1081x608, 26.4 s, 671 KB. Confirmed playing on load at both widths.
6. "Learn more" scrolls smoothly to `#tech` and sets the hash (`scroll-margin-top: 130px`).

### Gallery
7. Desktop: clicking a thumb swaps the main image `src` and `alt` at once (no fade) and moves the active border. All seven checked.
8. Clicking the main image does nothing (cursor stays default).
9. Mobile (below 992): the single main image is hidden and a horizontal **scroll-snap strip** of all seven images takes its place (swipe). Tapping a thumb smooth-scrolls the strip to that image; swiping the strip updates the active thumb. The thumb row scrolls sideways on its own (592 px of thumbs in 358 px).

### Pre-order / add to cart (page-wide)
10. One document-level listener handles every `[data-cart]` element: `preventDefault()` (so the `cart.html` href is **never followed**), parse the JSON, call `ensoCart.add()`. Same id again raises `qty`.
11. Feedback: black toast pill bottom-centre "<name> added" for 1.8 s, and the header cart icon gets a sand badge with the total quantity. Nothing else: no drawer, no redirect.
12. To reach the cart the visitor must click the header cart icon (`href="cart.html"`).

### Spec accordions
13. **Many can be open at once** (opened all six together), each toggles on its own, "+" becomes "−", no animation.

### "Explore the features" carousel (`#hl`)
14. 8 slides, built by JS from a `FEATS` array. Active slide is centred with the neighbours peeking at 45% opacity (70% on hover). Track moves with `transform`, .8s ease.
15. **Autoplay**: 5000 ms per slide (measured 5.02 s between changes), endless loop. Runs only while at least 35% of the carousel is in view and not paused. Starts paused when the visitor has reduced motion set (from code).
16. **Dots**: 8 dots in a grey pill; the active one stretches to 44 px and fills left to right as a progress bar. Clicking a dot jumps there and restarts the timer.
17. **Pause button**: toggles pause/play icon and `aria-label` Pause/Play; progress freezes and resumes from the same point. It stays paused when the visitor then uses arrows or dots.
18. **Arrows** (desktop only): previous/next, wrap around both ways (last → first, first → last).
19. **Keyboard** when the carousel has focus: ← → move, Space toggles pause.
20. **Swipe**: touch swipe over 40 px moves one slide (30 px does nothing). Mouse drag over 40 px does the same (from code, mouse drag NOT VERIFIED).
21. **Click a side slide**: it becomes active. **Click the active slide**: opens the feature modal. On hover the active slide shows a "Read more" tag top-right and the image zooms to 1.03.
22. Slides and captions:

| # | id | Title | Sub | Image (`img/new/`) |
|---|---|---|---|---|
| 1 | blend | Any blend you like | Blonde, dark or your own mix, 10–15 g in the cup | s-feat-blend-open.jpg |
| 2 | swap | Change the cup mid-session | Lift the cup out, drop the next one in | s-feat-cup-swap.jpg |
| 3 | heat | Heat from every side | The element wraps the cup, the plate closes it from the top | s-feat-heat-sketch.jpg (sketch, final render to follow per README) |
| 4 | clean | Only the cup to clean | The heating element stays clean | s-feat-clean-cup.jpg |
| 5 | ceramic | Ceramic heat, clean taste | Ceramic cup, stainless steel air path, no flame | s-feat-ceramic-heater.jpg |
| 6 | battery | Removable battery | About 90 minutes per pack, pre-heat not included | s-feat-battery-wide.jpg |
| 7 | charge | Charge while you smoke | USB-C in the back, the session keeps going | s-feat-charge-back.jpg |
| 8 | update | Update over USB-C | New firmware from your computer | s-feat-update-off.jpg (object-position 66% 55%) |

### Feature modal (shared `#modal`, feature mode)
23. Desktop: dialog up to 1320 px wide, radius 24, on a 55% black backdrop. Header (title + ×), then picture left (4:3, radius 18) and text right: lead paragraph 17/27, three sub-heads with a paragraph each. Footer: prev arrow, 8 dots (not clickable), next arrow. Large round arrows also sit on the picture.
24. Navigation loops through all 8 features: arrows on the picture, footer arrows, keyboard ← →, horizontal trackpad swipe (from code), touch swipe anywhere in the box.
25. Close: × button, Esc, click on the backdrop. Body scroll is locked while open (`overflow: hidden`).
26. Mobile: full screen, no radius, picture on top (4:3), **only the lead paragraph** (sub-heads, small note and arrows on the picture are hidden), footer prev/dots/next. Swipe and footer arrows both worked.
27. The carousel underneath is not paused by the modal (from code).

### "One dial, every setting" (`#dial`)
28. Default state: `media/dial-loop.mp4` plays (`autoplay muted loop playsinline preload="metadata"`, no poster, source 1080x1350, 11.9 s, 1.35 MB, cropped to 3:2 with `object-fit: cover`).
29. Clicking a line pauses the video, shows a round "screen" overlay centred on the dial (44% of the box width, with a glass highlight and an orange glow), marks the line with a small orange dot after its title, and shows a "Play the loop" pill at the bottom of the picture. States:

| Line | Screen image | What the screen shows |
|---|---|---|
| Precise temperature control | `ui/session.svg` | ⚡22%, "250°", "18:42", "RUNNING" |
| Profiles that remember | `ui/profile_default.svg` | battery 82%, "Default", "7 min · 275 °C" |
| Haptic feedback | `ui/start.svg` | ⚡36%, "Start Pre-heat" with left/right arrows |

30. Back to the loop: click "Play the loop" or anywhere on the picture. The overlay hides, the dot clears, the video resumes from where it stopped.
31. Only one line is active at a time; clicking another line swaps the screen directly. `ui/quick_preheat_timer.svg` is preloaded but no line uses it.
32. Hint text "Tap a line to see that screen on the dial. Tap the picture to play the loop again" shows on desktop only.

### `#fits`
33. Static. The script has a scroll-linked "device settles onto the stem" effect, but its element (`#fitsdev`) is not in the markup, so nothing moves. Dead code.

### `#acchero`
34. Whole card is one link to `../partner-v2/accessories.html#diamond`. Hover: image zooms to 1.03 over 1.4 s.

### "What is in the box" (`#package`)
35. Hover on a part: it scales to 1.08 and a white name label fades in under it. Count badges "×2" (cups) and "×3" (screens) are always visible.
36. **The "›" heading** is a button. It opens the shared modal titled "What is in the box": intro line and a 9-row list (thumb, name, one-line sub, "×n").
37. In that list: the device row opens the "Diamond with thermo cap" modal view (text, "Also in the box" list of the other 8, side photo `img/g-top-3q.jpg`, small note "Charge it fully before the first session"). Every other row closes the modal and **opens the accessory sheet** for the matching accessory.
38. **Clicking a part in the picture**: the device opens the same device modal; the other eight open the **accessory sheet** directly. So yes, `acc-sheet.js` drives it. Mapping:

| Part | Opens sheet for | Price |
|---|---|---|
| Ceramic cups ×2 | `d-cup` Diamond Ceramic Cups, 2-pack | €19.99 |
| Basket mesh | `d-basket2` Diamond Mesh Screen Baskets, 2-pack | €16.99 |
| Flat mesh screens ×3 | `d-screens` Diamond Flat Mesh Screens, 5-pack | €7.99 |
| Long adapter | `d-adapter-long` | €3.99 |
| Short adapter | `d-adapter-short` | €3.99 |
| Cup removal tool | `d-tool` | €18.99 |
| Cleaning brush | `d-brush` | €3.99 |
| USB-C cable | `d-cable` | €4.99 |

39. The plain text list on the right (8 rows with counts) is not clickable.
40. On mobile the parts still open the sheet (as a bottom sheet), not a page.

### Accessory sheet (`#sheet`, from `partner-v2/acc-sheet.js`)
41. Desktop: centred dialog 960 px wide, radius 28, max-height 88vh, 40% black backdrop, fades in and rises 24 px. Left: square image box with 1 or 2 photos (scroll-snap, arrows and dots only when there are 2). Right: "Fits Diamond" tag, title 32/38, lead, "What it is", "Why", "How to use it", price + "Add to cart", "View full details ›", and for some items "The same for ENSŌ 2026: <link>".
42. Mobile (below 768): bottom sheet, full width, top corners radius 28, grab handle, image 4:3 on top, content scrolls.
43. "Add to cart" adds the item (`{id, name, price, cur:'€'}`), **closes the sheet** and shows the toast. An out-of-stock item shows a disabled "Out of stock" button at 55% opacity and a "Remind me when in stock" link (seen on ENSŌ 2026 Ceramic Cups reached through the pair link).
44. "The same for …" link swaps the sheet content to the paired product in place.
45. "View full details ›" goes to `partner-v2/product.html#<id>`. Clicking a photo in the sheet does the same (cursor is zoom-in, but it navigates; from code).
46. Close: × button, Esc, backdrop click. Focus returns to the element that opened it. Body scroll locked while open.
47. The sheet has an empty "Pack size" group (`#shOpts`) that is never filled, so the baskets open as the 2-pack with no way to pick the 5-pack inside the sheet.

### "You might also like" (`#more`)
48. 16 cards. Arrows scroll by one card (325 px) with smooth scrolling; native scroll-snap. **No loop**: at either end the arrow does nothing, and the arrows do not disable or hide. No dots, no autoplay.
49. Hover on a card: soft shadow; if the card has a second photo it cross-fades in (.45s); single-photo cards zoom the image to 1.04.
50. **Pack-size pills** (only on "Diamond Mesh Screen Baskets"): "2-pack" / "5-pack", built by JS from the card's `data-opts`. Picking one swaps the description, the price (€16.99 / €24.99), the image and the button's `data-cart` (`d-basket2` / `d-basket`). The title drops the pack suffix. Adding with 5-pack selected stored `d-basket` at 24.99 (checked).
51. "Add to cart": toast + badge, no navigation. Clicking twice gives `qty: 2`.
52. Clicking a card's **image or title**: on desktop (992 and up) opens the accessory sheet for that product; below 992 it navigates to `../partner-v2/product.html#<id>` (checked on mobile: landed on `product.html#x-glove`). The description and price are not clickable.
53. "View all accessories" → `../partner-v2/accessories.html#diamond`.

Card list (id, price): d-battery 69.99, x-glove 7.99, d-cup 19.99, d-basket2 16.99 / d-basket 24.99, d-screens 7.99, d-cap 35.99, d-cap-metal 26.99, d-topcap 5.99, d-adapter-long 3.99, d-adapter-short 3.99, d-shaft 2.99, d-tool 18.99, d-brush 3.99, d-cable 4.99, d-case 34.99, d-bag 6.99.

### `#bowl`
54. "Open the guide" → `../experience/packing.html`. "Shop" scrolls up to `#buy`.

### FAQ
55. Native `<details>`, **many can be open at once**, no animation, "+" / "−".
56. "Show more" reveals the 9 hidden questions (15 in total) and its label becomes "Show less" (`aria-expanded` flips). "Show less" hides them again and smooth-scrolls back to the top of the FAQ section.
57. "Full FAQ" → `../partner-v2/faq.html`.

### `#exp`
58. Whole card is one link to `../experience/index.html#diamond`. The four chips (Quick start, Full manual, Warranty, Firmware) are **not** separate links. Hover: image zooms to 1.04 and the arrow in the button slides 6 px right.

### Help cards (`#help`)
59. The whole card is the click target (also Enter/Space when focused); the "+" is decoration. Hover adds a shadow.
60. It opens the shared modal (plain mode, 1040 px wide): three sub-heads with a paragraph and sometimes a link. Footer arrows and ← → step through the three cards and loop. Esc, × and backdrop close it.

| Card | Modal sections | Links inside |
|---|---|---|
| Warranty and returns | What is covered / How a claim works / Returns | `mailto:support@ensoshisha.eu?subject=Warranty`, `../partner-v2/warranty.html` |
| Support | Ask us / Help yourself first / Firmware | `mailto:support@ensoshisha.eu`, `../experience/` |
| Wholesale and distribution | For lounges and shops / For distributors / Get in touch | `mailto:support@ensoshisha.eu?subject=Wholesale%20and%20distribution` |

### Other
61. `?labels` in the URL shows pink working-name tags on every `[data-block]` (design aid, not for the store).
62. On load the page forces scroll to the top or to the `#anchor` (sets `history.scrollRestoration = 'manual'`), except on back/forward.

## 1.3 Links and buttons

| Element | Destination |
|---|---|
| Bar "Pre-order", buy card "Pre-order" | `cart.html` in markup, but intercepted: adds `diamond` to cart, stays on page |
| Hero "Learn more" | `#tech` |
| "See it laid out" | `#package` |
| support@ensoshisha.eu (buy card) | `mailto:support@ensoshisha.eu` |
| Accessories hero card | `../partner-v2/accessories.html#diamond` |
| 16 x "Add to cart" | `cart.html` in markup, intercepted |
| "View all accessories" | `../partner-v2/accessories.html#diamond` |
| "Open the guide" | `../experience/packing.html` |
| "Shop" (bowl banner) | `#buy` |
| "Full FAQ" | `../partner-v2/faq.html` |
| Experience card | `../experience/index.html#diamond` |
| Sheet "View full details" | `../partner-v2/product.html#<id>` |
| Help modal links | see table above |

No link in the page body points at the old live site. Only the `<head>` canonical/`og:url` do.

## 1.4 Responsive notes

| Width | What changes |
|---|---|
| 1440 | As described. Accessory arrows sit at 56 px from each edge. |
| 1200, 1000 | Still the desktop layout (two-column buy box 552/520 and 352/520, sticky card). **The accessory carousel arrows are off-screen** (`left: calc(50% - 664px)` = -64 px and -164 px), so below roughly 1330 px there is no visible arrow. Add-to-cart labels wrap to two lines at 1000. |
| 800 | Mobile layout already (everything below 992): one column, strip gallery, bar at the bottom, mobile images for accessories hero / bowl / experience, carousel cards 72vw (576 px), feature slides 704 px. |
| 390 | See the Mobile column in 1.1. Help cards, facts and hero2 blocks all stack; `h2` 30/36; side padding 16. |

Other mobile points: the toast (`bottom: 96px`) overlaps the top edge of the bottom bar; the bar covers the bowl banner's buttons while that banner is at the bottom of the screen; dial hint hidden; Experience paragraph hidden; trust items reduced to their bold line.

## 1.5 Media

| Slot | File | Intrinsic size | Weight |
|---|---|---|---|
| Hero video | `pdp-v2/media/teaser.mp4` | 1081x608, 26.4 s | 671 KB |
| Hero poster | `pdp-v2/media/teaser-poster.jpg` | not measured | 65 KB |
| Gallery x7 | `pdp-v2/img/g-*.jpg` | 1128x1400 (g-hookah 1200x1200) | 60–135 KB each |
| Dimensions | `pdp-v2/img/dim-silhouette.png` | 1099x1969 | – |
| Heater | `pdp-v2/img/new/heater-dial.jpg` | 2000x1493 | 255 KB |
| Features x8 | `pdp-v2/img/new/s-feat-*.jpg` | 2000x1493 | 219–388 KB each |
| Dial video | `pdp-v2/media/dial-loop.mp4` | 1080x1350, 11.9 s | 1.35 MB |
| Dial screens | `pdp-v2/ui/{session,profile_default,start,quick_preheat_timer}.svg` | 384x384 | – |
| Fits | `pdp-v2/img/new/fits-hookah-real.jpg` | 656x1800 | 77 KB |
| Accessories hero | `img/new/acc-hero.jpg` / `acc-hero-mobile.jpg` | 2400x1340 / 1128x1400 | 355 / 203 KB |
| Box parts x9 | `partner-v2/sku/cut2/*.webp` | 727–1282 px | – |
| Accessory cards | `pdp-v2/img/new/sku-*.jpg`, `partner-v2/sku/live-acc/cleaning-glove-1.jpg` | 1200–1600 square (cap-parts-3 is 2000x1493) | – |
| Bowl | `img/new/bowl-darkwood.jpg` / `bowl-darkwood-m.jpg` | 2000x1200 / 1120x1400 | 416 / 321 KB |
| Experience | `partner-v2/sku/exp-tearoom.jpg` / `exp-tearoom-mobile.jpg` | 2200x1643 / 1080x1350 | – |
| Device modal side photo | `pdp-v2/img/g-top-3q.jpg` (default `img/t-heat.jpg` is in the markup but never shown) | 1128x1400 | – |

**LCP**: above the fold is only the header and the hero video, so the LCP element is the video's poster frame (`teaser-poster.jpg`) at both widths. The product image and the `h1` start below the fold (buy box top is 883 px at 1440, 652 px at 390).

Loading notes: only the feature slides and the mobile gallery strip use `loading="lazy"`. All 16 accessory cards (up to 2 photos each, 1200–1600 px), the 9 box cut-outs, both banners and the 1.35 MB dial video load eagerly. The mobile strip duplicates the seven gallery images in the DOM.

## 1.6 Design values (computed)

- Fonts: headings Inter 800, letter-spacing -0.025em; body Montserrat 400 16/28, black. Buttons Montserrat 700.
- Colours: ink `#000`, night `#07080a`, grey `#666`, hairline `rgb(0 0 0 / .1)`, mist `#f5f5f4`, sand `#c8943a` (hover `#b3832f`), "added" brown `#96671f` (cart), green dot `#16a34a`, dial accent `#e2614c`. Secondary text is black at 72% (66% for section subs, 78% in lists).
- Headings: section `h2` 36/42 (30/36 mobile); `#heater`/`#fits` `h2` 40/44 (30/34); hero 52/56 (36/40); accessories hero 64/68, -0.03em (40/44); bowl 44/48 (34/38); buy title 28/34; feature card title 28/34 (22/28); help card title 26/32; accessory card title 16/22.
- Eyebrows: Montserrat 500, uppercase, letter-spacing 0.2em; 16px in sections, 14px in the buy card.
- Pills: radius 999. Large: padding 20px 40px, 15px/700, uppercase, letter-spacing .1em, 55–57 px high. Small: 12px 22px, 12px, 36 px high. Variants: black (hover `#0f0f0f`), white (hover `#f2f2f2`), sand, ghost on dark (1px white 60% border), outline on light (1px black 25% border, used for Show more / Full FAQ / View all). Focus ring: 2px black, offset 3px.
- Radii: banners and feature cards 28; bowl banner, dial video 22; help cards 24; accessory cards 16; gallery, buy card 12; thumbs 8.
- Bar: 56 px high, `rgb(255 255 255 / .94)`, `backdrop-filter: blur(10px)`.
- Modal: backdrop `rgb(0 0 0 / .55)`, box radius 24, title 28px. Sheet: backdrop 40% black, radius 28. Toast: black pill, white 13px/600, `bottom: 96px`.

## 1.7 Problems and open questions

1. **Pre-order does not go anywhere.** The button only adds to the fake cart and shows a toast. Decision needed for Shopify: add to cart then open the theme's cart drawer, or go to `/cart`, or straight to checkout.
2. **No quantity cap for the device on the PDP**: clicking Pre-order three times stores `qty: 3`, but the cart page then silently resets a device to quantity 1. Decide whether more than one Diamond per order is allowed.
3. **The bottom cart bar from the README does not exist**: `render()` returns early (`if(true) return;`). Its CSS and markup builder are dead. Confirm it is not wanted.
4. **Bar flash on desktop**: while hidden, the bar is parked at `top: 79px; translateY(-110%)`, i.e. behind the header. When the header auto-hides on scroll down, the bar is exposed for about 0.3 s before its `top` animates to 0 (sampled: bar top 17 → 0 → -62 px over 300 ms). Visible as a flicker of "ENSŌ Diamond · Pre-order" at the top of the page on every first scroll down.
5. **Mobile bar layout**: at 390 the title wraps to three lines and the button to two; the bar is 105 px tall.
6. **Carousel arrows off-screen between 992 and about 1330 px** (see 1.4). Also the arrows never disable at the ends.
7. **Pack pill writes a broken href**: after picking a size the button's href becomes `cart.htmld-basket` (missing separator). Harmless here because the click is intercepted, but do not copy it.
8. **Sheet has no pack-size choice**; baskets always open as the 2-pack. The in-box "Basket mesh ×1" row shows the sub "Two spare baskets" and opens the 2-pack product, which reads oddly for a part of which one is in the box.
9. Heading order: the hero heading is an `h2` and the `h1` ("ENSŌ Diamond") comes after it. "What is in the box" is a `button` inside an `h2`.
10. Feature modal: after Esc focus falls back to `<body>` (the slide is not focusable); the 8 footer dots are not clickable; the carousel keeps autoplaying behind the modal.
11. `#fits` scroll animation and `ui/quick_preheat_timer.svg` preload are dead code; `img/t-heat.jpg` is referenced in the modal markup but never shown.
12. Placeholder content: feature 3 uses a sketch (`s-feat-heat-sketch.jpg`, README says the final render follows with the same name). The spec "Firmware: Updates over USB-C from a page on ensoshisha.eu (coming)" and FAQ "coming with the first update" describe something not live yet. Product photos for `d-shaft`, `d-case`, `d-bag` are files named `sku-ph-*` (flagged `ph: true` in the data), likely placeholders.
13. House rules: no star ratings or review blocks are rendered and no italic type is rendered (`<i>` and `<em>` are used only as hooks with `font-style: normal`). No heading, eyebrow or button ends with a full stop. ENSŌ has its macron everywhere in visible copy. But the `<head>` still carries **Loox review app CSS and a `loox_global_hash` script** from the old theme; do not carry these over. The page `<title>` ends in "Coal-Free": not the banned use of "free", but worth a client glance.
14. Two `<meta name="description">` tags with different text. `og:image` is the favicon. No product JSON-LD.
15. Copy consistency to confirm with the client: buy card says "30 days to decide, from delivery", while the FAQ, help card and cart say "14 days unopened, 30 days opened". Shipping: buy card "Ships from our warehouse in Hungary", help modal and cart "our EU and US warehouses". Trust line mentions US prices on an EU store.
16. Which content is per-product metafield versus section setting needs a decision: spec accordions, bullet list, "In the box", features, dial lines, box parts and FAQ are all Diamond-specific.

---

# Page 2: `pdp-v2/cart.html`

`<title>` changes with the cart (see modes). `<meta name="robots" content="noindex,nofollow">`. Page CSS is one 16 KB block, JS one 26 KB inline script holding the full product and accessory catalogue.

## 2.1 Layout

Desktop: `.layout` grid `minmax(0,1fr) 420px`, gap 60, padding 56px 0 96px, inside the 1600 px wrap. Left: `h1` (Inter 800 44/48), lead line, then the blocks for the current mode. Right: summary card, `position: sticky; top: 88px`, 1px border, radius 24, padding 28.

Below 992: one column, `h1` 32/36, summary becomes static and drops under the blocks, and a **fixed bottom bar** (`.mbar`) appears: "Total" + amount (Inter 800 20) on the left, black pill "Pre-order" on the right, 81 px high. Bottom padding of the page grows to 140 px to clear it.

## 2.2 Modes (all four captured)

| Mode | When | `h1` / lead / `<title>` | Left column | Back link in summary |
|---|---|---|---|---|
| **empty** | nothing in cart | "Your cart" / none / "Cart · ENSŌ" | Empty state, summary and mobile bar hidden, grid collapses to one column | – |
| **device** | exactly one device and every accessory in the cart is one of that device's add-ons | "Choose your Diamond" / "Pick a set, then add what the evening needs." / "Your Diamond · ENSŌ" | One device block, open | "‹ Back to Diamond" → `index.html` |
| **accessories** | no device | "Your accessories" / "Picked from the accessories shop. Add a device any time." / "Your accessories · ENSŌ" | Accessory line list + upsell | "‹ Back to accessories" → `../partner-v2/accessories.html` |
| **mixed** | two devices, or a device plus an accessory that is not one of its add-ons | "Your cart" / "Open a device to change its set or add-ons." / "Your cart · ENSŌ" | "In your cart" heading, device blocks (collapsed), then the accessory line list | "‹ Keep shopping" → `../partner-v2/index.html` |

Adding Pre-order + battery + glove + baskets from the Diamond page and opening the cart lands in **device** mode, i.e. the configurator, not a line-item list.

### Empty state
Grey line "Nothing here yet. Start with a device, or add what your ENSŌ is missing." Three link cards in a row (radius 24, square image, bold title 22/28, grey line, small pill): "ENSŌ Diamond" → `index.html` (black pill "Shop Diamond"), "ENSŌ 2026 Edition" → `../partner-v2/enso.html` (outline "See the 2026 Edition"), "Accessories" → `../partner-v2/accessories.html` (outline "Shop accessories"). Then "Questions before you order? support@ensoshisha.eu". Cards lift 3 px with a shadow on hover. Below 768 they stack as rows with a 96 px thumb.

### Device block (`<details class="dev">`)
- Summary row: 72 px thumb, device name (Inter 800 17/22) with "set name · first item" in grey under it, price (Inter 800 18), a "Change set and add-ons" toggle line with a chevron (reads "Hide set and add-ons" when open), and a round × button top-right.
- Body, "Pick a set": radio cards in a 3-column grid (1 column on mobile). For Diamond there are two: **Diamond €320.00** (tag "Pre-order · launch price", shows "launch price" and struck €349.00 "regular", 4 bullet lines) and **Diamond + Battery €379.00** (tag "Most chosen", 3 lines). Selected card has a 2 px black border.
- Body, "Add accessories": "The essentials" (up to 4 cards) and "Spares" (2 cards, plus any already in the cart), 2-column grid (1 on mobile). Card: 72 px thumb, bold name, optional pack-size pills, grey sub, price, and a pill that reads "Add to cart" (black) or "✓ Added" (brown `#96671f`); selected card gets a 2 px black border. The battery card also shows − 1 + once added.
- "Show 10 more spares" underlined text button under Spares.
- "Remove Diamond from the cart" underlined grey text button at the bottom.

### Accessory line list (accessories and mixed modes)
`h2` "Accessories", then one row per line: 64 px thumb, bold name + grey sub, quantity control (− n +, 28 px round buttons), line total (Inter 800 15), round × on a mist background. On mobile the row becomes two lines (name and × on top, quantity and price below).

### Upsell "Did you forget anything?" (accessories mode only)
Heading row with "All accessories ›" → `../partner-v2/accessories.html`. Three cards (image, name, sub, price, small black pill "Add"), 3 columns on desktop, compact rows on mobile. Picks the first three from a fixed favourites list that are in stock, not already in the cart, and match the device family of what is in the cart (plus universal `x-` items).

### Summary card
"Summary" (Inter 800 22), one row per line (device rows show the set name with "first item and more" in grey; accessory rows show "name × n" when n > 1), "Total" row (Inter 800 26), note "VAT included for EU orders. Shipping and any duties are shown at checkout.", full-width black pill **"Pre-order on ensoshisha.eu"**, three trust lines with icons ("14 days unopened, 30 days opened, from delivery" / warranty line / "Ships from our EU and US warehouses"), and the back link. No discount code field, no shipping estimate, no order note, no payment icons, no delivery progress bar.

## 2.3 Behaviours (all triggered unless noted)

1. **Load**: reads `localStorage.ensoCart`, plus URL parameters `?set=<config id>`, `?product=<diamond|enso>` and `?add=<comma list>` (old short ids such as `battery`, `cups` are aliased to real ids). It then rewrites both the storage and the URL (`history.replaceState`), e.g. `cart.html?set=diamond&add=d-battery%2Cx-glove%2Cd-basket`. So the cart state is shareable by URL.
2. **Pick a set**: clicking a radio card re-renders, updates summary and total (320 → 379 gave €481.97 from €422.97) and stores the new `set`, `name` and `price` on the device line.
3. **Add-on card click** toggles that accessory in or out of the cart ("Add to cart" ⇄ "Added"), summary and total follow (Travel Bag: +€34.99, then back).
4. **Quantity in device mode** exists only for items flagged `qty` (batteries): + raised the battery to 2 (summary "Diamond Replacement Battery × 2 €139.98"); − down to 0 removed it.
5. **Pack-size pills in the cart** swap the variant in place and keep the quantity (5-pack → 2-pack changed the line to `d-basket2` at €16.99). Out-of-stock options render disabled and struck through (from code).
6. **Show more spares** expands the Spares grid from 2 to all 12 and the label becomes "Show fewer spares"; clicking again collapses.
7. **Device block toggle**: the summary row opens and closes the block (native `details`). In device mode it starts open; in mixed mode all start closed and the open state is remembered per device across re-renders.
8. **Remove a device**: × on the row or "Remove Diamond from the cart". The mode recalculates at once (device → accessories; mixed → device when the other device goes).
9. **Swipe to remove (touch)**: dragging a device row left by more than 56 px snaps it to -112 px and reveals a dark "Remove" panel on the right; tapping it removes the device. Checked with synthetic touch events at 390.
10. **Accessory list quantity**: + and − change the quantity and the line total; − at 1 removes the line; × removes the line. Checked: glove 1 → 2 (€15.98) → 1; baskets − at 1 removed; × on the last line gave the empty state.
11. **Upsell "Add"** puts the item in the cart with quantity 1 and the grid refills with the next favourite. Clicking the card image or title instead goes to `../partner-v2/accessories.html#<id>` (checked: landed on `accessories.html#d-battery`).
12. **Totals**: sum of device set price + accessory price × quantity, formatted `€0.00` with two decimals, shown in the summary and in the mobile bar. No shipping, tax or discount lines.
13. **Checkout**: "Pre-order on ensoshisha.eu" (and the mobile bar's "Pre-order") is a static link to `https://ensoshisha.eu/products/enso-diamond-pre-order`, `target="_blank" rel="noopener"`. It never changes with the cart content and passes nothing along. NOT clicked (external live site).
14. **Warranty line** in the summary switches to "Two years on Diamond, one year on the battery" when Diamond is the only device, otherwise the generic device wording.

## 2.4 `ensoCart` data shape and header count

Storage key: `localStorage.ensoCart`, a JSON array.

Written by the Diamond page (and every other shop page) through `window.ensoCart.add()`:
```json
[{"qty":1,"id":"diamond","name":"ENSŌ Diamond","price":320,"cur":"€"},
 {"qty":1,"id":"d-battery","name":"Diamond Replacement Battery","price":69.99,"cur":"€"},
 {"qty":1,"id":"d-basket","name":"Diamond Mesh Screen Baskets, 5-pack","price":24.99,"cur":"€"}]
```
Rewritten by the cart page on every render (devices get a `set` and are forced to `qty: 1`, name and price come from the chosen set):
```json
[{"id":"diamond","name":"Diamond","set":"diamond","price":320,"cur":"€","qty":1},
 {"id":"d-battery","name":"Diamond Replacement Battery","price":69.99,"cur":"€","qty":1}]
```
API on `window.ensoCart`: `items()`, `add(item)`, `remove(id)`, `set(id, on, item)`, `clear()`, `total()` (returns the items, not a number). Device ids: `diamond`, `enso`. Diamond set ids: `diamond` (€320, was €349), `battery` (€379). Accessory ids as listed in 1.2.

Header count: a shared inline script appends `<span class="enso-cartcount">` to `.site-header__cart` (sand `#c8943a` circle, 18 px, Inter 700 11px, top-right of the icon) with the **sum of quantities**, and removes it at zero. It refreshes on every `ensoCart.add/remove/set/clear` and on page load. On the cart page itself the cart script writes to storage directly, so **the badge does not update while you edit the cart** (it showed 4 with 3 items, and still 4 with an empty cart) until the page is reloaded. The header icon's `aria-label` stays "Cart: 0 items in cart".

Other storage keys seen: `over-21` (age gate, shared).

## 2.5 Links

| Element | Destination |
|---|---|
| Empty state cards | `index.html`, `../partner-v2/enso.html`, `../partner-v2/accessories.html` |
| Empty state email | `mailto:support@ensoshisha.eu` |
| Checkout pill (summary and mobile bar) | `https://ensoshisha.eu/products/enso-diamond-pre-order` (new tab, **old live site**) |
| Back link | `index.html` / `../partner-v2/enso.html` / `../partner-v2/accessories.html` / `../partner-v2/index.html` by mode |
| "All accessories ›" | `../partner-v2/accessories.html` |
| Upsell card image/title | `../partner-v2/accessories.html#<id>` |

## 2.6 Responsive notes

- 1440: two columns (880 + 420). Set cards 3 across (Diamond only fills two), add-ons 2 across, upsell 3 across.
- 800 and 390 (below 992): single column, set cards and add-ons stack, set cards switch to a row layout (88 px image beside the title and price), summary static under the content, fixed bottom bar with total and "Pre-order". The bottom bar overlaps content while scrolling (expected) and is hidden in the empty state.
- Below 768: empty-state cards become horizontal rows.

## 2.7 Media

Device thumb and set image `img/g-3q-right.jpg`; second set image `img/new/sku-battery.jpg`; accessory thumbs from `img/new/sku-*.jpg` and `../partner-v2/sku/live-acc/*.jpg`; empty state uses `img/g-3q-right.jpg`, `../partner-v2/assets/25429a46-Product_1_1.webp`, `img/new/sku-battery.jpg`. No video. LCP is the `h1` text (or the first empty-state image).

## 2.8 Design values (computed)

`h1` Inter 800 44/48 (32/36 mobile); lead 16/28 at 72% black; block `h2` Inter 800 22/28 (28/34 for "Accessories" and the upsell heading); device block radius 22, 1.5px border; set card radius 22, padding 22, price Inter 800 22/26, tag black pill 11px/700 uppercase; add-on card radius 18, padding 14, name Montserrat 700 15/20, sub 13/18 grey, price Inter 800 15, CTA pill 34 px high 11px/700 uppercase (black, or `#96671f` when added); quantity buttons 26–28 px circles with a 1px 20% black border; summary card radius 24, padding 28, rows 15/22, total Inter 800 26/30, note 13/20 grey; checkout pill padding 18px 28px, 15px/700, uppercase, letter-spacing .1em, full width.

## 2.9 Problems and open questions

1. **Biggest decision: what is the cart in Shopify?** The handoff cart is a set configurator with add-on toggles, a pack-size switcher, four modes and URL-driven state. The README says to "use the theme's own cart (`/cart/add.js`) and cart drawer". These do not match. Client needs to say whether the configurator ("Pick a set", essentials, spares) must be rebuilt, and if so whether sets are variants or bundles.
2. **"Diamond + Battery €379" is not a product anywhere else.** It only exists in the cart script. €320 + €69.99 = €389.99, so the set is a discount of about €11. Needs a real variant, bundle or automatic discount.
3. **Checkout is a link to the old live site** and ignores the cart. Must become real Shopify checkout. The button label "Pre-order on ensoshisha.eu" needs new wording.
4. **Header badge goes stale on the cart page** (see 2.4).
5. **Device quantity is forced to 1**, and there is no quantity control for devices at all. Only batteries get +/− inside the configurator; other add-ons are on/off there but get +/− in the plain list. Inconsistent; decide the rule.
6. **Upsell disappears** when the cart holds only universal (`x-`) items such as the Cleaning Glove, because the family filter then matches nothing.
7. Prices, names, stock flags (`oos`) and "essential" flags are hard-coded in the cart script and duplicated in `acc-sheet.js` and the PDP cards. Shopify must be the single source.
8. The 3-column set grid leaves an empty third column for Diamond (two sets).
9. Summary has no discount field, shipping line or tax line; all deferred to checkout by the note. Confirm that is intended.
10. Copy: "Untick anything already in your set." refers to checkboxes the visitor never sees as ticks (they are "Add to cart / Added" pills).
