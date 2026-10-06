# Audit 02 — Home page (`partner-v2/index.html`), content sections

Audited by driving the page in headless Chrome 154 at 1440x900, 1100, 1000, 800, 740 and 390x844 (touch), plus reading the inline CSS/JS and `assets/1ffcf996-scripts.js`, `assets/7bab4e74-global.js`, `acc-sheet.js`. Header, footer, search, cart drawer, age gate and the welcome-gift popup are out of scope (another auditor). Screenshots: `scratchpad/shots/home/` (`d-*` desktop, `t-*` 800 px, `m-*` 390 px).

## Summary

- 13 content sections, in this order: hero slider, signature models, USP row, "Explore the system" video, Made for the ritual, Safety and certification, Diamond row, Awards, Shop accessories, ENSŌ Experience banner, Instagram reels, From the journal, Before and after you buy.
- 5 overlays are opened from these sections: USP modal, help modal (same DOM node `#ensoModal`), Instagram lightbox `#igv`, accessory quick-view sheet `#sheet` (from `acc-sheet.js`, desktop only), "Remind me" modal `#ensoRm`.
- Page height: 9915 px at 1440, 12654 px at 390. No horizontal overflow at any tested width. The driver reported no JS errors in any run.
- Two breakpoint families are mixed: the old theme uses 749/750 px, the new `enso-*` blocks use 991/992 px (journal uses 767 px). Between 750 and 991 px the page is a hybrid (see Responsive).
- Page background is forced white (`html,body{background:#fff!important}`); the only tinted bands are the USP row (`#f5f5f4`) and the dark Diamond row (`#1d1d1f`).
- The two blank panels from the earlier capture are both plain `loading="lazy"` images that had not been scrolled near. There is no video and no missing file in either (details in sections 8 and 12).
- "Add to cart" on the home accessory cards does nothing: every button has the `disabled` attribute but is styled as active (details in section 9).

## Section inventory

Sizes are at 1440 unless stated. "Editable" = merchant setting; "Shopify" = should come from store data.

| # | Section (DOM id / class) | Purpose and layout at 1440 | Layout at 390 | Content slots | Source |
|---|---|---|---|---|---|
| 1 | Hero slider `<video-hero-slider data-autoplay="9000">` | Full viewport (`min-height:100dvh`, 900 px), dark `#1a1813`. Background video per slide over a poster image, scrim gradient, text bottom-left: content padding `120px 80px 64px`, children max 600 px wide. Arrows 44 px round at left/right 15 px, vertically centred. Dots bottom-right (bottom 32 px, right 80 px). Site header is transparent and overlays it | 844 px high, padding `120px 20px 64px`, heading 32/38.4, button 40 px high. Arrows hidden (≤749). Dots centred at bottom | Per slide: video, poster image + alt, heading (h2 styled h1), button label + link. 2 slides | Editable (blocks) |
| 2 | Signature models `.signature-models` | White, padding 64 px top/bottom, container max 1440 with 80 px gutters. Centred h2 + uppercase caption, 32 px gap, then a 2-column grid of 426 px cards (gap 48 px, grid 900 px wide, centred). Card: square image (radius 12, shadow `0 12px 32px rgba(10,10,10,.1)`), title, price, 2-line excerpt, black pill button with chevron. Text left-aligned | 1 column, 350 px square image as a swipe strip with dots below, padding 32 px, gutters 20 px, h2 28 px, title 20 px | Heading, caption; per card: 6–7 images, title, price, excerpt, button label, link | Heading/caption editable; cards = 2 products (title, price, images, link from Shopify; excerpt and button label editable) |
| 3 | USP row `.usps` | Full-bleed `#f5f5f4`, padding 48 px. 6 tiles in a flex row, max 1120 px, `space-between`. Tile: white 132 px square (radius 22, padding 20) with an 84 px line icon, uppercase label below (12 px/600, tracking .96 px), centred | 3x2 grid (gap 16x10), tile 100 px (radius 16), icon 52 px, padding 36 px | 6 x (SVG icon, label). Each opens a modal with title, video/image/icon, paragraph, link | Editable (blocks incl. modal content) |
| 4 | "Explore the system" `…video_hero_slider_p6YT3f` | Same component as #1 with one slide and no arrows/dots. Forced to `100svh` (900 px), white background, scrim removed, video `object-fit:cover`. One sand button centred at bottom 40 px. `margin-bottom:96px` | 844 px, button 40 px high at bottom 40 px | Video, poster, button label + link | Editable |
| 5 | Made for the ritual `#shopify-section-enso-phil` | Padding 96 px, container max 1600 with 40 px gutters. Grid 5fr/7fr (543 + 761 px), gap 56, centred vertically. Left: h2, grey lead, 3-item accordion. Right: media panel 4:3, radius 28 | 1 column, order: h2, lead, media (358x269), accordion. Padding 64 px, gutters 16 px | Heading, lead; 3 x (question, 2 paragraphs, image or video, focal point) | Editable |
| 6 | Safety and certification `#shopify-section-enso-safety` | Padding 96 px. h2 + grey lead, then 4 equal cards (325 px, gap 20): 1 px border `rgba(0,0,0,.1)`, radius 24, padding 32, 36 px line icon, h3, paragraph. Static | 1 column | Heading, lead; 4 x (icon, title, text) | Editable |
| 7 | Diamond row `.enso-drow` (one big `<a>`) | Padding 96 px. Dark `#1d1d1f` panel, radius 28, height 560, 2 equal columns: copy left (padding `48px 56px`, centred vertically), photo right (`object-fit:cover`, position 50% 38%). Copy: sand eyebrow, white h2 40/44, 4 bullet rows with a 2 px sand left rule (bold line + grey line), sand pill | 1 column, photo first as a 1:1 square, copy padding `28px 20px 32px`, h2 30/34, total 893 px | Photo + alt, eyebrow, heading, 4 x (title, text), button label, link | Editable; link = Diamond product |
| 8 | Awards `#enso-awards` | Padding 88 px, inner max 1200 with 40 px gutters. Centred h2 40/46 (margin-bottom 48), then 2 columns (532 px each, gap 56): square photo (radius 22, placeholder bg `#e9e4dc`) and a list of 2 awards (72 px logo + h3 + paragraph, divided by a 1 px rule) | 1 column (≤991): h2 28/34, photo 358 px square, logos 56 px, h3 20/26, padding 56 px, gutters 16 | Heading, photo + alt, 2 x (logo, title, text) | Editable |
| 9 | Shop accessories `<carousel-slider>` | Padding 32 top / 64 bottom, 80 px gutters. Header row: h2 left, "View all" text link right. Horizontal carousel of product cards, 4 per view, gap 24. Card: 1 px border `rgb(245,235,235)`, radius 12, padding 10, square image, 1-line title, price, full-width black "Add to cart" pill. Round black arrows over the track at `top:35%` | 1 card per view (350x472), "View all" moves below the carousel, centred | Heading, "View all" label + link, product list | Collection or product list from Shopify; heading/label editable |
| 10 | ENSŌ Experience banner `.split` | White band, 50 px above. One rounded panel (radius 28) 1280x600 with a full-bleed photo, left-to-right dark gradient, text bottom-left (padding-left 28, bottom 56, max 440 px): h2 44/48 white, paragraph 16/22.4 white, sand pill (padding 16x28) | 350x600, bottom-to-top gradient, photo focal point 38% 50%, heading 30/34, padding `0 20px 28px` | Photo + alt + focal points (desktop 50% 12%, mobile 38% 50%), heading, text, button label + link | Editable |
| 11 | Instagram `…custom_section_XMUKtA` | Padding 72 top / 40 bottom. Centred h2 36 px + handle link. Strip max 1040 px showing 3 tiles (333x593, 9:16, radius 20, gap 20), reel icon top-right of each tile, 2 round arrow buttons centred below | Tiles 62% wide (222x395), strip bleeds to the screen edges with 16 px inset, arrows hidden, heading wraps to 2 lines | Heading, handle + URL; 10 x (poster, 6 s loop video, full video, post URL, caption, like count, comment count) | Editable list, or an Instagram app; counts and captions are hard-coded in the page |
| 12 | From the journal `#shopify-section-enso-blog` | Padding 96 px. Header row max 1200: h2 left, "All articles ›" right. 3 cards (387x483, 4:5, radius 22, gap 20), photo full-bleed, dark bottom gradient, text over the photo: date, title, 2-line excerpt, "Read the article ›" | Horizontal swipe row, cards 80% wide (286x358), snap, title 22/26. Header stays one row, so the 42 px heading wraps under the link | Heading, link label; per card: image + focal point, date, title, excerpt | Latest 3 articles of a blog (Shopify); heading/labels editable. Card images here are not the article images (see Problems) |
| 13 | Before and after you buy `#shopify-section-enso-help` | Padding 56 top / 96 bottom, container max 1280. h2 (margin-bottom 40), 3 cards (387x314, gap 20): 1 px border, radius 24, padding `36 32 72`, 44 px line icon, h3, paragraph, 34 px round grey button bottom-right showing `›` or `+` | 1 column | Heading; 3 x (icon, title, text, action: link or modal with title + rich text) | Editable |

Global helpers visible over these sections but owned elsewhere: gold scroll-progress bar at the very top, "Welcome gift" tab bottom-left, and a round "go up" button bottom-right (`.enso-goup`). The go-up button is tied to the home page: it appears once the bottom of the signature-models section has scrolled out of view, and a click smooth-scrolls back to the top of signature models minus the header height (measured: scrollY 821, section top at 79 px). `aria-label="Back to ENSŌ Diamond and ENSŌ 2026"`. Position: right 24 / bottom 24, 52 px; at ≤991 px right 16 / bottom 83, 46 px.

## Behaviours (all triggered unless marked)

### 1. Hero slider

1. **Autoplay**: slides advance every 9000 ms (`data-autoplay`), measured: slide 2 active 9.5 s after load. The timer restarts after any manual change. It stops when the tab is hidden and restarts when visible again (code read, NOT VERIFIED in the driver). No pause on hover.
2. **Transition**: cross-fade, `opacity .6s ease` plus `visibility`. The active slide is `position:relative`, the others absolute.
3. **Loop**: yes, both directions (next on the last slide went to the first; prev on the first went to the last).
4. **Arrows**: prev/next buttons, shown ≥750 px, hidden ≤749 px.
5. **Dots**: one per slide, click jumps to that slide. Inactive 8x8 px `rgba(255,255,255,.4)`, active white and scaled 1.4. Bottom-right on desktop, centred at ≤749 px.
6. **Swipe**: none. The component has no touch handlers; a synthetic swipe on the hero at 390 px left the slide unchanged. On phones the only controls are the dots and autoplay.
7. **Video loading**: slide 1's `<video>` is already in the HTML (`autoplay muted loop playsinline preload="auto"`), so it loads eagerly. Slide 2's video lives in a `<template>` and is cloned into the slide only when that slide first becomes active (measured: 0 videos in slide 2 before, 1 after). The video fades in over .8 s on `canplay` (class `is-ready`); until then the poster image shows.
8. **Poster zoom**: the active slide's poster scales 1 → 1.08 over 7 s.
9. **Reduced motion**: with `prefers-reduced-motion`, no autoplay and no videos are loaded at all, posters only (code read, NOT VERIFIED).
10. **Button hover**: sand `#c8943a` → `#b3832f`.
11. Each slide also contains an invisible empty link to `reviews.html` (see Problems).

### 2. Signature models

12. **Desktop hover on the image**: a second image fades in over the first (`opacity .45s`). ENSŌ 2026: `g2-white.jpg` → `sku/enso-top.jpg`. Diamond: product shot → Diamond on a hookah. The remaining images are `display:none` on desktop.
13. **≤991 px image carousel**: the image link becomes a horizontal scroll-snap strip (1 image per view, `scroll-snap-type:x mandatory`, `overscroll-behavior-x:contain`), all 6 (ENSŌ) or 7 (Diamond) images shown one after another, `object-fit:contain` on white. No arrows, no autoplay, no loop, native swipe only.
14. **Dots under the strip** (≤991 px only): a script adds one dot per image after the strip and updates the active dot on scroll (`round(scrollLeft / width)`). Measured: after scrolling 2 widths the 3rd dot was active; at the end the 7th. Dots are 6 px grey; active is an 18x6 black pill. The dots are not clickable.
15. The image, the title and the button all link to the product page. The image link has `aria-hidden="true" tabindex="-1"`.
16. Button hover: `#1d1d1f` → `#000`.
17. "Out of stock" / "Pre-order" badges and the star rating exist in the markup but are hidden by CSS.

### 3. USP row and its modal

18. **Tiles are buttons**: a script gives each tile `role="button"`, `tabindex="0"`, pointer cursor; click, Enter or Space opens the modal at that tile. Hover lifts the tile 3 px.
19. **Modal** (`#ensoModal`, wide variant 980 px, radius 24, backdrop `rgba(0,0,0,.55)`, z-index 9999): header with title and × button; body is 2 equal columns: media left (square, radius 16), paragraph + underlined link right; below, a pager: ‹ button, 6 dots, › button. Body scroll is locked (`body{overflow:hidden}`).
20. **Content is looked up by the tile's label text** (lower-cased), so renaming a label breaks the modal:

| Tile label | Modal title | Media | Link |
|---|---|---|---|
| No fire | No fire | video `assets/f178638f-…77491262.mp4` | "See how it heats ›" → `enso.html#whyenso` |
| Heat control | Heat control | video `assets/eaa9436a-…33843180.mp4` | "See the clouds ›" → `enso.html#whyenso` |
| Rechargeable | Rechargeable | video `assets/e0f4f545-…77492579.mp4` (position 50% 100%) | "See the battery ›" → `enso.html#whyenso` |
| Snap on | Snap and go | video `assets/eac855a0-…79892443.mp4` (position 50% 100%) | "See the magnets ›" → `enso.html#whyenso` |
| 2-year warranty | Two-year warranty | 120 px grey tile with a shield icon (narrow layout: icon column 120 px + text) | "Warranty and returns ›" → `warranty.html` |
| 30-day returns | Returns | icon tile (return arrow) | "How a return works ›" → `warranty.html` |

   The script also holds two entries with no tile on the page ("plug and play", "sleek design"); they are never shown.
21. **Paging**: ‹ / › buttons, dot click, keyboard ArrowLeft / ArrowRight, and horizontal swipe on the box (>50 px; verified with touch events at 390 px). It loops (› on the last item went to "No fire", ‹ on the first to "Returns").
22. **Modal videos**: created on open with `autoplay muted loop playsinline`, no poster, no controls; they played immediately. Nothing is loaded before the modal opens.
23. **Close**: × button, Esc, click on the backdrop. Body scroll is restored. Focus is not returned to the tile.
24. **390 px**: modal padding 12 px, box 366x561, media becomes 4:3 with `max-height:36dvh`, single column, the box does not scroll inside (`overflow:hidden`), title 22/28.
25. The `enso.html#whyenso` link landed on the anchor (scrollY 1978, target 120 px from the top, measured 4 s after the click).

### 4. "Explore the system"

26. One video, autoplay, muted, loop, no controls, eager (`preload="auto"`, already in the HTML). No arrows, dots or autoplay timer (single slide). Only interactive element: the button → `enso.html`.

### 5. Made for the ritual

27. **Accordion, exactly one open**: native `<details>`; a `toggle` listener closes the others when one opens. Item 1 is open on load.
28. **Cannot close all**: closing the open item automatically opens the next one (measured: closing item 3 opened item 1; closing item 1 opened item 2).
29. **Media swap**: opening an item fades the image out (`opacity .25s`), and 200 ms later swaps `src`, `object-position` and `alt` (alt = the question text), then fades in. Item 1 → `sku/exp-tearoom.jpg` (50% 45%), item 2 → `sku/phil-cup.jpg` (50% 50%, additionally zoomed by CSS `scale(1.35)` with origin 52% 58%), item 3 → the image is hidden and the video `sku/phil-coal-loop.mp4` is shown and played.
30. **Video**: `muted loop playsinline preload="auto"`, poster `sku/phil-coal-poster.jpg`, hidden until item 3 opens, paused again when another item opens (it resumes from where it stopped). It is downloaded eagerly on page load although hidden (readyState 4 at load).
31. Marker: `+` when closed, `−` (grey) when open. No height animation (native details).

### 6. Safety and certification

32. Static. No hover, no links.

### 7. Diamond row

33. The whole panel is one link to `../pdp-v2/index.html` (click verified). "Shop Diamond" is a `<span>` styled as a button, not a separate link. No hover effect on the panel.

### 8. Awards

34. Static, no links, no video. **Why the media panel was blank in the earlier capture**: the photo is `<img src="sku/award-square-m.jpg" loading="lazy">` inside a figure with a beige placeholder background `#e9e4dc`. On a fresh load, before scrolling, the image reported `complete=false, naturalWidth=0`; after scrolling near it, `complete=true, 1200x1200`. A full-page screenshot taken without scrolling therefore shows only the beige box. The file exists (129,953 B). No interaction is needed. The old theme's `feature-videos` / `lazy-video` CSS is still in the page but no such element exists in this section any more.

### 9. Shop accessories carousel

35. **Carousel type**: native horizontal scroll with `scroll-snap-type:x mandatory`, snap-align start, `scroll-behavior:smooth`, hidden scrollbar, `cursor:grab` (there is no mouse-drag script, so the grab cursor is misleading).

| Width | Cards per view | Card width | Arrows | "View all" |
|---|---|---|---|---|
| 1440 | 4 | 302 px | shown | header, right |
| 1100 | 4 | 217 px | shown | header, right |
| 800 | about 3.5 (4-up rule, the 4th card is cut by the edge) | 199 px | shown | header, right |
| ≤749 (740, 390) | 1 | full width (350 px at 390) | shown | below the carousel, centred |

36. **Arrows**: 44 px black circles, white chevron, placed over the track at `top:35%`, left 0 / right 0. Each click scrolls by exactly one card + gap (326 px at 1440). Prev is `display:none` while disabled (at the start); next stays visible at 35% opacity when disabled (at the end). The arrow block is hidden entirely if everything fits (`carousel--static`).
37. **Dots**: none. **Autoplay**: none. **Loop**: none (stops at both ends). **Swipe**: native touch scroll. The track has `tabindex="0"`.
38. **8 cards in the markup, 6 visible**: a script hides any card whose title matches `Multi-Tool|Tombacco|Filling Set|Disposable Cups` (`display:none`), which removes "ENSŌ 2026 Disposable Cups, 10-pack" and "ENSŌ 2026 Filling Set". Visible: Battery €49.99, Backpack 2.0 €99.99, Mouthpiece Extension €19.99, Ceramic Cups 3-pack €19.99, Glass Tank €19.99, Mesh Screens and Wax Pads €9.99.
39. **Card hover**: title turns sand `#c8943a`; image scales 1.06 (`transform .6s`); cards with a second image swap to it (`display` toggle, no fade). Backpack has no second image.
40. **Add to cart does nothing**: every `quick-add-button` carries `disabled`, yet looks active (black, opacity 1, pointer cursor). A real click produced no click event, no navigation, no cart entry. There is no `data-cart` attribute anywhere on the home page.
41. **Card click, desktop (>991 px)**: `acc-sheet.js` intercepts every `a[href*="product.html#"]` click and opens a quick-view sheet instead of navigating. **≤991 px**: the card navigates to `product.html#<id>` (verified at 390: `product.html#e-battery-std`).
42. Hidden by CSS on every card: the "Out of stock" badge, the "Out of stock" price label, the star rating and the wishlist heart.

### 9b. Accessory quick-view sheet (desktop, opened from a card)

43. Centred white panel 960 px wide (radius 28, `max-height:88vh`, backdrop `rgba(0,0,0,.4)`), fades in and rises 24 px (.25 s / .35 s). Left: square gallery. Right: "Fits ENSŌ 2026 Edition" eyebrow, title, lead, What it is / Why / How to use it, then price + button, "View full details ›" → `product.html#<id>`, and for some items "The same for Diamond: …" (a link that re-opens the sheet for the paired item; verified Ceramic Cups → Diamond Ceramic Cups).
44. **Gallery**: scroll-snap strip of 1–2 images with ‹ › buttons and dots; arrows and dots are hidden when there is one image. Clicking an image goes to the full product page. No loop, no autoplay.
45. **In stock** (e.g. Backpack): "Add to cart" writes to `localStorage.ensoCart` (`[{qty:1,id:"e-backpack",name:"ENSŌ Backpack 3.0",price:119.99,cur:"€"}]`), closes the sheet, shows a black toast "ENSŌ Backpack 3.0 added" for 1.8 s and a sand count badge on the header cart icon. The cart drawer does not open.
46. **Out of stock** (Battery, Ceramic Cups): button reads "Out of stock", disabled, 55% opacity, and a "Remind me when in stock" link appears.
47. **Remind modal** (`#ensoRm`, 440 px, radius 20): eyebrow "Out of stock", title "Remind me when <name> is back", email field, "Notify me". Invalid email → "Enter an email address like name@example.com". Valid → "Thank you. We will email you when <name> is back in stock." and an entry in `localStorage.ensoRemind` (`[{id,at}]`); reopening for the same item shows "You are on the list…". Visual only, nothing is sent.
48. **Close**: × button, Esc, backdrop click. Esc with the remind modal open closes both the remind modal and the sheet at once.

### 10. ENSŌ Experience banner

49. Static panel; only the button is a link → `../experience/index.html`. Button hover `#c8943a` → `#b3832f`.

### 11. Instagram reels

50. **Carousel type**: native scroll-snap strip, 10 tiles.

| Width | Tiles per view | Arrows | Snap |
|---|---|---|---|
| ≥992 | 3 (333x593 at 1440) | 2 buttons below, centred (40 px white circles, 1 px border) | start |
| ≤991 | 1.6 (62% each: 222x395 at 390, 476x847 at 800) | hidden | centre |

51. **Arrows**: each click scrolls by one full strip width, i.e. 3 tiles (0 → 1060 → 2120 → 2473 max). They are never disabled and do nothing at the ends. No dots, no autoplay, no loop. Swipe is native.
52. **How the tile videos load and play**: each tile is an `<img>` poster (lazy) with a `<video muted loop playsinline preload="none" data-src="…-loop.mp4">` on top at opacity 0. An IntersectionObserver (threshold .6) sets `src` the first time a tile is more than 60% visible, plays it and fades it in (.4 s); when the tile drops under 60% it is paused. Measured at 1440: only the 3 visible tiles had a `src` and were playing; after "next", the next 3 loaded and the first 3 paused. At 390: 2 tiles play (one fully visible, one at 63%). Disabled entirely under `prefers-reduced-motion` (code read, NOT VERIFIED). The loop clips are 6 s, about 360x640.
53. **Hover**: poster scales 1.04 (.8 s). Mostly invisible once the video covers it.
54. **Click on a tile**: the default link (to the Instagram reel, new tab) is cancelled and a lightbox opens instead.
55. **Lightbox `#igv`** (z-index 10001, backdrop `rgba(0,0,0,.72)`): 9:16 card, `min(446px, 92vw)` wide, `max-height:88vh`, radius 22. Top bar: round logo, "enso.future", "View post" (→ the reel URL, new tab). Media: the full video (`assets/ig/ig-N.mp4`), autoplay, loop, muted, no controls, poster = tile image. Bottom: heart + like count, bubble + comment count, round sound button, first line of the caption on one line with ellipsis. Page scroll is locked (`html{overflow:hidden}`). Focus moves to the × button.
56. **Sound button**: toggles mute; the choice is kept for the next reels while the page stays open (measured: unmuted on reel 1, reel 2 opened unmuted).
57. **Navigation**: ‹ › round buttons beside the card (at ≤600 px they move to the bottom corners), keyboard ArrowLeft / ArrowRight. Order follows the tile order on the page and loops (measured: from the 1st tile, two steps back reached the 10th).
58. **Close**: × (top-right), Esc, backdrop click. The video is removed, scroll restored, focus returns to the tile.
59. **Fallback**: if a video fails to load, the lightbox shows the still image with a "▶ Watch on Instagram" link (code read, NOT VERIFIED).
60. The "@enso.future ›" link under the heading opens `https://instagram.com/enso.future` in a new tab.

### 12. From the journal

61. Each card is one link to its article. Hover (pointer devices): image scales 1.03 (.6 s). Focus ring 2 px `#96671f`.
62. **≤767 px**: horizontal scroll-snap row, cards 80% wide, start-aligned, bleeds to the screen edges. No arrows, dots, autoplay or loop; native swipe.
63. **Why the images were blank in the earlier capture**: the three `<img>` are `loading="lazy"` and absolutely positioned inside dark cards (`#1a1813`). Before scrolling they reported `complete=false, naturalWidth=0`; after scrolling, all three loaded (1600x1066, 1800x1200, 1600x1194). The files exist. Nothing else is involved.

### 13. Before and after you buy

64. Card 1 ("Guides and how-tos", shows `›`) is a plain link → `../experience/index.html`.
65. Cards 2 and 3 (show `+`) are `<article tabindex="0" data-help>`; click, Enter or Space opens the help modal (`#ensoModal`, narrow variant 760 px) with a title and rich text:
   - **Support**: "Ask us" + `mailto:support@ensoshisha.eu`, "Help yourself first" + "Open ENSŌ Experience ›" → `../experience/index.html`, "Support page ›" → `support.html`.
   - **Warranty and returns**: "What is covered", "How a claim works" + `mailto:support@ensoshisha.eu?subject=Warranty`, "Thirty days to decide", "Full warranty policy ›" → `warranty.html`.
66. Close: ×, Esc, backdrop. Focus returns to the card. Arrow keys do nothing here (they only page the USP variant). Body scroll locked while open. At 390 the box is 342x701 and fits without inner scroll.
67. Card hover: shadow `0 12px 40px rgba(0,0,0,.08)`.

## Links and buttons (content area)

| Where | Label | Destination | Status |
|---|---|---|---|
| Hero slide 1 | Shop now | `../pdp-v2/index.html` | ok |
| Hero slide 2 | Shop now | `enso.html` | ok |
| Hero slides 1 and 2 | (invisible, empty) | `reviews.html` | **missing file** |
| Signature card 1 (image, title, button) | Shop ENSŌ | `enso.html` | ok |
| Signature card 2 (image, title, button) | Pre-order Diamond | `../pdp-v2/index.html` | ok |
| USP modal | 4 x "See …" | `enso.html#whyenso` | ok, anchor exists |
| USP modal | Warranty and returns / How a return works | `warranty.html` | ok |
| Explore video | Explore the system | `enso.html` | ok |
| Diamond row (whole panel) | Shop Diamond | `../pdp-v2/index.html` | ok |
| Accessories | View all (x2: desktop + mobile copy) | `accessories.html` | ok |
| Accessories cards | 8 cards | `product.html#e-battery-std`, `#e-backpack`, `#e-mouthpiece`, `#e-cups`, `#e-disposable`, `#e-tank`, `#e-filling`, `#e-mesh` | ok (desktop opens the sheet instead) |
| Accessories cards | Add to cart | form `action="#"`, button disabled | **dead** |
| Experience banner | Open ENSŌ Experience | `../experience/index.html` | ok |
| Instagram | @enso.future › | `https://instagram.com/enso.future` (new tab) | external |
| Instagram tiles / lightbox "View post" | 10 reels | `https://www.instagram.com/reel/<id>/` (new tab) | external |
| Journal | All articles › | `blog.html` | ok |
| Journal cards | 3 | `blog-flavors.html`, `blog-electronic.html`, `blog-tobacco.html` | ok |
| Help card 1 | Guides and how-tos | `../experience/index.html` | ok |
| Help modals | see behaviour 65 | `support.html`, `warranty.html`, 2 mailto links | ok |

No link in the content area points at the old live site.

## Responsive notes

| Range | What changes |
|---|---|
| ≥992 | Everything as in the inventory "1440" column. Tested 1100 and 1000: same layout, columns shrink; accessories stay 4-up; hero stays 100dvh |
| 750–991 | Hybrid. New blocks go single column (ritual, safety, Diamond row at 1146–1210 px tall, awards, help cards); section padding 96 → 64 px, gutters 40 → 16 px; signature image becomes the swipe strip with dots but the grid stays 2 columns; USP row becomes a 3x2 grid; Instagram tiles 62% wide and arrows gone (at 800 a tile is 476x847, nearly a full screen); journal stays 3 columns until 767; accessories stay 4-up with header "View all"; hero keeps arrows and 48 px heading |
| ≤749 | Hero arrows hidden, dots centred, heading 32 px, gutters 20 px, button 40 px high; signature grid 1 column, h2 28 px, card title 20 px; accessories 1 per view, "View all" below; journal becomes a swipe row (≤767) |
| ≤600 | Instagram lightbox arrows move to the bottom corners, card `max-height:80vh` |
| ≤991 | Product cards navigate instead of opening the sheet; go-up button moves to bottom 83 px; `body` gets 55 px bottom padding at ≤768 for the fixed mobile bar (other auditor) |

The `enso-h2` headings (sections 5, 6, 12, 13) stay 42/46 px at every width, so on a 390 px screen "From the journal" and "Before and after you buy" wrap to 2 lines; only the Diamond row heading has a mobile size (30/34). Decide whether to keep that.

## Media

### Videos

| Section | File (under `partner-v2/`) | Size on disk | Dimensions, length | autoplay / muted / loop | Poster | Loading |
|---|---|---|---|---|---|---|
| Hero slide 1 | `assets/7565a211-e43f560e7b1b47d3a2265a39cfd33dd1.SD-480p-1.5Mbps-83746470.mp4` | 714,411 B | 848x480, 26.4 s | yes / yes / yes, playsinline, no controls | `assets/live/diamond-hero-poster.jpg` (848x480, 32,884 B, `fetchpriority="high"`) as a separate `<img>` under the video | Eager, `preload="auto"`, in the HTML |
| Hero slide 2 | `assets/live/a2f99e6f-lite.mp4` | 785,185 B | 960x540, 14.0 s | yes / yes / yes | `assets/live/a2f99e6f-poster.jpg` (1600x900, 47,859 B, eager) | Lazy: cloned from `<template>` when the slide first becomes active |
| Explore the system | `assets/34b32e93-a726a9d69d414e18811fa97b77202100.HD-1080p-7.2Mbps-32265318.mp4` | 974,817 B | 1080x834, 13.9 s | yes / yes / yes | `assets/6403a43b-Screenshot_2026-09-21_111535-removebg-preview.png` (528x472, 47,037 B, `fetchpriority="high"`) | Eager, `preload="auto"`, in the HTML although 2000 px below the fold |
| Made for the ritual, item 3 | `sku/phil-coal-loop.mp4` | 1,244,490 B | 600x1080, 9.6 s | no autoplay attr (played by script) / yes / yes | `sku/phil-coal-poster.jpg` (44,480 B) | Eager, `preload="auto"`, although hidden until item 3 is opened |
| USP modal: No fire | `assets/f178638f-881118a7195845919250bb1bb8d1af0a.HD-720p-4.5Mbps-77491262.mp4` | 63,284 B | 720x720, 5.5 s | yes / yes / yes | none | On modal open only |
| USP modal: Heat control | `assets/eaa9436a-928b86f2b2c54f409d83866a94dee497.HD-1080p-7.2Mbps-33843180.mp4` | 105,849 B | 1036x1080, 3.0 s | yes / yes / yes | none | On modal open |
| USP modal: Rechargeable | `assets/e0f4f545-ab3eb3b3a4e74553991a274732af51b9.HD-720p-4.5Mbps-77492579.mp4` | 1,368,000 B | 720x720, 5.1 s | yes / yes / yes | none | On modal open |
| USP modal: Snap on | `assets/eac855a0-da6f5b12bd4140049bb0a9473dd6d095.HD-720p-4.5Mbps-79892443.mp4` | 52,017 B | 720x720, 4.7 s | yes / yes / yes | none | On modal open |
| Instagram tiles (10) | `assets/ig/ig-0-loop.mp4` … `ig-9-loop.mp4` | 108–259 KB each, 1,807,417 B total | about 360x640, 6.0 s | played by script / yes / yes | `assets/ig/ig-N.jpg` (55–570 KB, 1,451,089 B total; `ig-3.jpg` alone is 569,686 B) | `preload="none"`, `src` set when the tile is 60% visible |
| Instagram lightbox (10) | `assets/ig/ig-0.mp4` … `ig-9.mp4` | 0.85–1.49 MB each, 12,716,366 B total | about 480x854, 9.6–30 s | yes / muted by default, toggle / yes | tile image | On lightbox open, one at a time |

`assets/live/a2f99e6f.mp4` (1,962,631 B) is in the folder but not referenced by the home page.

Eager video weight on first load: about 2.9 MB (hero 1 + explore + the hidden coal loop).

### Images

| Section | Files | Notes |
|---|---|---|
| Hero | the two posters above | **Likely LCP element**: slide 1 poster `assets/live/diamond-hero-poster.jpg` (eager, `fetchpriority="high"`), replaced visually by the video once it can play |
| Signature, ENSŌ 2026 | `assets/live/enso/g2-white.jpg` (1400x1049), `sku/enso-top.jpg` (1128x1400), `assets/25429a46-Product_1_1.webp`, `assets/live/enso/g3.jpg`, `g4.jpg`, `g5.jpg` | First is eager, `object-position:50% 55%`; the rest lazy |
| Signature, Diamond | 2 images embedded as base64 data URIs (1128x1400 and 1200x1200, about 240 KB of the HTML), then `../pdp-v2/img/g-3q-left.jpg`, `g-top-3q.jpg`, `g-open.jpg`, `g-back.jpg`, `g-top.jpg` | The first two need real files |
| USP row | `assets/usp-no-fire.svg`, `usp-heat.svg`, `usp-battery.svg`, `usp-snap.svg`, `usp-warranty.svg`, `usp-returns.svg` | 1–7 KB each |
| Made for the ritual | `sku/exp-tearoom.jpg` (2200x1643, 460 KB), `sku/phil-cup.jpg` (1600x1194, 222 KB), `sku/phil-coal-poster.jpg` | |
| Diamond row | `../pdp-v2/img/new/heater-dial.jpg` (2000x1493, 255 KB) | Not lazy |
| Awards | `sku/award-square-m.jpg` (1200x1200, 130 KB), logos `assets/c3732052-SM_Logo-1.webp` (200x201), `assets/13b827ca-red-dot-logo_….webp` (200x199) | `sku/award-square.jpg` is only used by the unused "sleek design" modal entry |
| Accessories | `assets/0ad94d5c-battery1.png` + `4013021a-battery3.png`, `602aa889-Screenshot_2026-05-18_155855.png`, `00a861df-Mp_ext_default.png` + `62bef871-…blownout.png`, `eea6c2a7-Battery_3pack_….png` + `7b2b9175-Battery_3pack2nd.png`, `d3456b1d-Rep_glass.png` + `367421ca-Rep_glass2.png`, `95b03d7a-Vaping_Kit_main.png` + `0ea927dc-WaxPad_….png` (plus the two hidden cards) | All `loading="eager"`, about 700 px PNGs of 130–940 KB each, both images of every card |
| Experience banner | `sku/enso-exp-tea.jpg` (2200x1467, 471 KB) | `loading="eager" fetchpriority="high"` although far below the fold |
| Journal | `sku/jr-arch-redcup.jpg` (1600x1066), `sku/phil-moment.jpg` (1800x1200), `sku/phil-cup.jpg` | Lazy |
| Sheet (desktop) | `sku/live-acc/*.jpg` (1080x1080) | Different images from the cards |

## Design values (computed)

Fonts: Montserrat (body and theme headings) and Inter (new `enso-*` headings, prices). Faces actually loaded in the test browser: Montserrat 400/500/600 and Inter 600 only, although the CSS asks for Montserrat 700 and Inter 800 (see Problems).

| Element | Value |
|---|---|
| Hero heading | Montserrat 500, 48/57.6 px (32/38.4 at ≤749), `#f5f1e6` |
| Theme h2 (signature, accessories, Instagram) | Montserrat 700, 36/43.2 px, black (28 px at ≤749 for signature) |
| Signature caption | Montserrat 400, 16 px, uppercase, tracking 1.28 px, `#333` |
| Signature title / price / excerpt | Montserrat 700 24/33.6 · Inter 600 18 px, tracking −.36 px · Montserrat 400 16/24 `#333` |
| `enso-h2` (ritual, safety, journal, help) | Inter 800, 42/46 px, tracking −.025em (−1.05 px), black |
| Lead under `enso-h2` | Montserrat 400, 16/22.4, `rgba(0,0,0,.6)` |
| Accordion summary / body | Montserrat 700 18/24 · 15/24 `rgba(0,0,0,.72)` |
| Safety h3 / p | Inter 800 22/28, tracking −.44 px · Montserrat 15/24 `rgba(0,0,0,.72)` |
| Diamond row eyebrow / h2 / bullets | Montserrat 700 13 px uppercase tracking 1.04 px `#c8943a` · Inter 800 40/44 white · Montserrat 700 16 px white + 400 14/21 `rgba(255,255,255,.75)` |
| Awards h2 / h3 / p | Montserrat 600 40/46, tracking −.4 px · Montserrat 600 24/30 · 15/24 `rgba(0,0,0,.66)` |
| Product card title / price | Montserrat 500 18/25.2, 1-line clamp · Montserrat 18 px bold |
| Experience heading / text | Montserrat 700 44/48 white · 16/22.4 white |
| Journal date / title / excerpt / link | Montserrat 500 12 px `rgba(255,255,255,.7)` · Inter 800 26/30 tracking −.52 px · Montserrat 14/21, 2-line clamp · Montserrat 600 13 px |
| Help card h3 / p | Inter 800 26/32 · Montserrat 16/25 `rgba(0,0,0,.72)` |
| Modal title / body | Inter 800 26/32 · Montserrat 16/26 `rgba(0,0,0,.78)`; links 600 with a 1 px black underline |
| Button (all pills) | Montserrat 500 16/22.4, `text-transform:capitalize`, height 44 px, padding 0 40 px, radius 999 px, 1 px border in the fill colour, transition opacity/transform .15s |
| Button colours | Light sections: `#1d1d1f`, hover `#000`. Over photos/video and on the dark row: sand `#c8943a`, hover `#b3832f`. "View all" is a bold underlined text link, not a button |
| Radii | 12 (product and signature images), 16 (modal media), 20 (Instagram tiles), 22 (USP tiles, journal cards, awards photo), 24 (cards, modals), 28 (ritual media, Diamond row, Experience panel, sheet) |
| Colours | White page; `#f5f5f4` USP band and small grey buttons; `#1d1d1f` dark; sand `#c8943a`; hairlines `rgba(0,0,0,.1)` |
| Theme tokens seen | `--page-margin:80px` (20 px ≤749), `--space-3:12px`, `--space-6:32px`, `--space-8:64px`, `--radius-pill:999px`, `--radius-xl:16px`, `--ease-out:cubic-bezier(.16,1,.3,1)` |

Because of `text-transform:capitalize`, buttons render as "Shop Now", "Add To Cart", "Explore The System", "Pre-Order Diamond", "View All" although the source text is sentence case.

## Problems and open questions

1. **`reviews.html` links (missing page)**: both hero slides contain `<div class="custom-liquid"><a href="reviews.html">…Loox 4.8 (369) star rating…</a></div>` right after the "Shop now" button (source offsets 452575 and 454581). The rating is hidden by CSS, so the link is an empty 0x0 anchor that is still in the DOM and still points at a page the README says was left out on purpose. Do not rebuild it. The rule meant to hide it (`a[href^="reviews.html"]:empty`) does not match because the anchor is not empty.
2. **Star ratings still in the markup** (hidden by CSS only): hero "4.8 (369)", the Diamond signature card, and every accessory card ("5.0 (1)" on the Battery). House rule says none anywhere; leave them out of the rebuild rather than hiding them.
3. **Home "Add to cart" is dead**: disabled buttons that look enabled. Decision needed: real quick-add (and what an out-of-stock card shows), or no button. The cards also hide their "Out of stock" badge and label while the markup marks every one as sold out.
4. **Card and sheet disagree** for the same id: `e-backpack` card "ENSŌ Backpack 2.0 €99.99" vs sheet "ENSŌ Backpack 3.0 €119.99"; `e-mouthpiece` card "Mouthpiece Extension €19.99" vs sheet "ENSŌ 2026 Mouthpiece €29.99"; `e-mesh` €9.99 vs €11.99; `e-disposable` "10-pack" vs "20-pack". Stock also differs (cards all sold out; sheet has only Battery and Ceramic Cups out of stock). Shopify must be the single source; ask the client which values are right.
5. **Two accessory cards are hidden by a title regex** (Disposable Cups, Filling Set). Ask whether these products should be excluded from the home carousel, or simply use a curated collection.
6. **Desktop quick-view sheet vs product page**: desktop card clicks open the sheet, phones navigate. The README says each accessory becomes its own product page; confirm whether the quick view is wanted in the theme.
7. **Placeholder-looking assets**: the "Explore the system" poster is `Screenshot_2026-09-21_111535-removebg-preview.png` (528x472) stretched to cover a full screen; the Backpack card image is `Screenshot_2026-05-18_155855.png`; the Diamond card's two main images exist only as base64 inside the HTML. Ask for proper files.
8. **"Explore the system" crops the film**: the CSS comment says "the whole film, not a crop" but the 1080x834 video is `object-fit:cover` in a full-viewport box, so it is cropped at both 1440x900 and 390x844 (heavily on phones). Confirm the intended fit.
9. **Eager loading that hurts speed**: the coal loop (1.2 MB) and the explore video (1 MB) download on first load although off-screen or hidden; all 14 visible accessory PNGs are eager (several 600–940 KB); the Experience photo has `fetchpriority="high"`; the explore poster too. The rebuild should lazy-load all of these and keep only the slide 1 poster as high priority.
10. **Journal card images are not the article images**: cards use `sku/jr-arch-redcup.jpg`, `sku/phil-moment.jpg`, `sku/phil-cup.jpg` with hand-set focal points, and `phil-cup.jpg` is the same photo as accordion item 2. If the section pulls from the blog, each article needs a suitable featured image.
11. **Italic tag**: "Read the article ›" is an `<i>` element reset to `font-style:normal`. Renders upright; use a `<span>` in the rebuild.
12. **Font weights**: Inter 800 and Montserrat 700 are requested for most headings, but only Inter 600 and Montserrat 400/500/600 were loaded in the test browser, so bold headings may be synthesised. Confirm which weights the theme should ship.
13. **USP modal lookup by label text**, with two unused entries ("plug and play", "sleek design") and a tile "Snap on" whose modal is titled "Snap and go". Rebuild as block settings.
14. **Instagram data is static**: like and comment counts, captions and video files are hard-coded. Captions spell the brand "Ensō"/"ENSO" in places and include emoji; only the first line shows. Decide between a manual block list and an app. The first tile's loop is 361x468, not 9:16.
15. **Small behaviour gaps**: hero has no swipe on phones; Instagram arrows never disable at the ends; accessories track shows a grab cursor but cannot be dragged with a mouse; USP modal does not return focus to the tile; Esc closes both the remind modal and the sheet; closing the USP modal by backdrop leaves the wide class on the box (harmless, it is reset on the next open).
16. **Diamond row** is a single anchor wrapping a heading, a list and a fake button; fine visually, weak for accessibility. Safety block wording (CE, RoHS, FCC, UN 38.3 for every device) is still being confirmed by the client per the README.
17. **Heading sizes on phones**: `enso-h2` stays 42 px at 390 (see Responsive). Confirm.
18. NOT VERIFIED (code read only): reduced-motion branches (hero, Instagram), hero pause on hidden tab, lightbox still-image fallback.
