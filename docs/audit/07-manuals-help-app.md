# 07 · Manuals and the Help app

Audit of `experience/manual.html` (Diamond full manual), `experience/enso.html` (ENSŌ 2026 Edition manual) and `experience/app.html` (ENSŌ Help app). Shared header, footer, age gate, cart drawer, "Welcome gift" tab and the gold scroll-progress bar are out of scope (other auditors); they are mentioned only where they interact with these pages.

Everything below was either triggered in headless Chrome (1440x900, 800x900, 390x844 touch) or read from the page source. Screenshots: `scratchpad/shots/manual/` (`d-*` manual desktop, `m-*` manual mobile, `t-*` 800 px, `e-*` enso, `a-*` app).

## Summary

- **The two manuals share one stylesheet and one script.** The 68 KB page `<style>` and the 28 KB page `<script>` are byte-identical in `manual.html` and `enso.html` (and are the same blocks the other Experience pages use). Build them once as a shared "experience" asset. `enso.html` adds one extra 3.6 KB `<style>` for its own blocks (`.qs`, `.parts`, `.boxl`, `.figs`, `.faq--rich`, `.pill`, `.mn-app`, `.support`).
- **Diamond manual**: 33,950 px tall at 1440 (34,470 px at 390), 16 numbered chapters, 22 sliders, 18 animated device screens, 15 static device screens, 16 FAQ accordions, 128 images in the content (72 lazy). No JS errors.
- **ENSŌ 2026 manual**: 11,460 px at 1440 (14,640 px at 390), 8 chapters, 65 accordions (every one has an id), 3 YouTube links, no sliders, no animated screens. No JS errors.
- **Help app**: one 6.29 MB file (99 inlined JPEGs = 5.9 MB of base64, 5.75 MB of that inside the one `<script>`). It is **not** the app the handover describes: the file in the handoff carries a "site build" layer that removes the hard registration gate, the tour, the onboarding, the device tabs and the bottom bar. It is also **not self-contained**: it loads about 75 images from `img/` and `ui/` next to it and links to sibling pages with relative URLs.
- Top problems are listed at the end of each page and collected in the last section.

---

# 1. `experience/manual.html` · Diamond full manual

`<title>`: "Full manual · ENSŌ". Body is `<main id="MainContent" class="enso-pdp">` containing a breadcrumb `<nav class="xnav">` and `<main class="wrap">` (max-width 1200 px, side padding 40 px, 16 px at <=991).

## 1.1 Section inventory

| # | Block | Purpose and layout | Content slots | Source |
|---|---|---|---|---|
| A | Breadcrumb `.xnav` | One line under the header: "‹ ENSŌ Experience / **ENSŌ Diamond**". 14 px Montserrat, grey with bold black last part. No pill row on this page (the ENSŌ page has one). | link to `index.html#diamond` | fixed |
| B | Chapter bar `.finder > .chips` | Floating white pill (bg rgba(255,255,255,.92), blur 10 px, radius 999, shadow), "CHAPTERS" label + 16 chip links in one non-wrapping row that scrolls sideways. Sticky. Comes first in the DOM, above the hero. At <=767 the "CHAPTERS" label is hidden. | 16 chips, each `href="#id"` + `data-id` | generated from chapters |
| C | Hero `.mn-hero` | 2 columns (1.1fr / .9fr, gap 48, padding 48/16), text left, product image right (max-height 380). <=991: stacked, image under text, max-height 260. | eyebrow "ENSŌ Experience · Diamond", H1 "Diamond manual", intro paragraph, image `img/m/hero-front-start.jpg` 1600x1200 | editable text + image |
| D | Search `.search--top` | Pill input, max-width 640, magnifier icon, result count on the right. | placeholder "Search the manual: battery, plate, clean…" | fixed |
| E | "Before you start" `.bs#safety` | Mist card (#f5f5f4, radius 22, padding 40/44, 18/16 on mobile) with H2 and a 3-slide slider of warnings. Desktop shows 2 slides (4:3 pictures) with arrows; mobile 1 slide (4:5) with dots. Each slide: sand "!" badge, bold title, text, photo; first photo has two hotspot labels ("USB-C port", red "Contacts: keep dry"). | 3 x (title, text, image, optional markers with left/top %) | repeatable block |
| F | Pack banner `.packban` | Full-bleed dark photo card, whole card is one link to `#pack`. Desktop: 380 px tall, radius 28, breaks out of the column by 40 px each side, text left with left-to-right dark gradient, white pill "HOW TO PACK". Mobile: 440 px tall, radius 22, text at the bottom over a bottom-up gradient, different crop. | title "Charged? Pack your first cup", text, pill label, desktop image `../pdp-v2/img/new/bowl-darkwood.jpg` 2000x1200, mobile image `bowl-darkwood-m.jpg` 1120x1400 (`<picture>` switch at 991) | editable |
| 01-16 | Chapters `section.ch` | See 1.2. Padding 112/104 desktop, 72/64 tablet, 44/40 mobile. Even-numbered chapters get a full-bleed #faf8f4 band (done with `box-shadow: 0 0 0 100vmax` + `clip-path`). Each starts with sand number line (`01 · Start`, Inter 800 14 px, .12em, uppercase), H2, lead paragraph. | | |
| G | Back links `.cl-back` | Two text links with a 2 px sand underline: "‹ Quick start" (`quick.html`), "‹ Back to ENSŌ Experience" (`index.html#diamond`). | | fixed |
| H | No-results line `#mn-none` | Hidden; shown by search when nothing matches: "Nothing found. Try another word, or open the troubleshooter" (`app.html#diamond-fix`). | | fixed |

## 1.2 Chapters, anchors and what each one contains

All ids below were confirmed present in the DOM. `.ch` has `scroll-margin-top:150px`, so a chapter hash lands with the chapter top 150 px below the viewport top (measured: `#troubleshooting` -> top = 150).

| # | Group | H2 | id | y at 1440 | Contents, in order |
|---|---|---|---|---|---|
| 01 | Start | Out of the box | `out-of-the-box` | 1780 | parts picker (P1); H3 "Before you switch it on" + 5-step slider (one slide has a red hotspot label) |
| 02 | Start | Charge it first | `charging` | 3676 | 4-step slider (last slide = animated screen `level`); H3 `#charger` "Which charger" + 2 option cards; H3 "Reading the four dots" + animated dots bar + 4 dark % cards; H3 `#charge-while-smoking` + photo/text split with 2 option cards |
| 03 | Start | Battery | `battery` | 5893 | 2 stat cards; H3 "When it runs low" + 3 stat cards (third red); H3 "Swap it mid-session" + 4-step slider (last = static screen `continue.png`) |
| 04 | Start | The dial and the screen | `the-dial` | 7367 | 7-step slider, every slide an animated screen (`hold, slow, fast, click, click2, click4, level`) |
| 05 | Start | Pack the cup | `pack` | 8379 | grams callout; H3 + 2-card grid (slider on mobile); H3 "Pick your mesh, then pack" + mesh picker with 2 panes (`#pack-basket` 5 steps, `#pack-flat` 4 steps); H3 "Mix in layers" + animated SVG cup diagram; H3 "By tobacco" + 2 tobacco cards; H3 "Into the chamber" 3-step slider; H3 `#cup-tool` 3-step slider; "more" link to `packing.html` |
| 06 | Start | On your hookah | `on-your-hookah` | 13803 | 3-step slider |
| 07 | Every session | Pre-heat and temperature | `switch-on` (+ hidden `span#temperature`) | 14815 | feature card with animated screen `timer`; H3 "Find your heat" picker (P7); H3 "On the dial" 5-step slider of animated screens (`timer, start, temp, session, stop`); "more" link to `#profiles`; 2 tip notes; H3 `#break` feature card (animated `brk`); H3 `#burnt` 4-step slider (first = animated `down`) |
| 08 | Every session | Profiles | `profiles` | 18923 | 6-step slider of static screens; tip note |
| 09 | Every session | Menu and settings | `menu` | 20212 | 8-step slider of static screens |
| 10 | Every session | Software updates | `software` | 21260 | 4-step slider (photo, 2 inline SVG browser mock-ups, animated `ver`); tip note linking `app.html#diamond-updates`; black pill "OPEN SOFTWARE UPDATES" -> `app.html#diamond-updates` |
| 11 | Every session | The cap and the draw | `the-cap` | 22489 | 5-step slider |
| 12 | Care | Cleaning | `cleaning` | 23507 | H3 + 4-step slider; H3 + 3-card grid; Cleaning Glove promo link; H3 "The cap" single wide card; H3 shaft 3-card grid; H3 "Never" 2-card red grid; "Makes it quicker" product row (Multi-Tool, €19.99) |
| 13 | Care | Travel and flights | `travel` | 28520 | 3 stat cards; tip note |
| 14 | Care | Keep it safe | `donts` | 29214 | 3 do/don't rows; red warning note |
| 15 | Help | Troubleshooting | `troubleshooting` | 30943 | 4 H3 groups with 4 + 3 + 3 + 6 accordions; black pill "OPEN THE FULL TROUBLESHOOTER" -> `app.html#diamond-fix` |
| 16 | Help | Warranty and support | `warranty` | 32867 | lead + one paragraph with mailto and link to `../partner-v2/warranty.html` |

Other anchors in the page: `safety` (Before you start), `charger`, `charge-while-smoking`, `cup-tool`, `temperature`, `break`, `burnt`, `pack-basket`, `pack-flat`. Sub-anchors on an H3 have **no** scroll margin: `manual.html#charge-while-smoking` lands with the heading at viewport top 0 (measured), and `#temperature` is a hidden span offset by -150 px.

### Deep links into this page

| Link | From | Exists |
|---|---|---|
| `manual.html#troubleshooting` | `cleaning.html`, `diamond.html`, `index.html`, `packing.html` | yes |
| `manual.html#charge-while-smoking` | named in the README (no page in the handoff links to it) | yes (H3) |
| `manual.html` (no hash) | `app.html` Guides screen for Diamond | n/a |

## 1.3 Block patterns (document once, reuse)

**P1 · Parts picker** (`.boxgrid--stack` > `.box__img` + `ul.boxlist`). Used once, chapter 01.
- Left: mist card (radius 28, padding 24) with a 6-column grid of 9 cut-out images (`figure.bx[data-tile]`, `role=button`, `tabindex=0`); the Diamond tile spans 3x3; "×2"/"×3" black count badges; caption line at the bottom ("Tap a part to see what it is"). Right: list of 10 rows (sand "×1", bold name, description), each `li[data-tile]`. Two rows share tile 0 (Diamond and Diamond Battery).
- Desktop >=992: 2 columns (620 px + rest, gap 56), list single column. <=991: stacked, image card on top.
- The image card is `position:sticky` (top 12 px desktop, 8 px mobile; 70 px while the chapter bar is showing) so it stays in view while the list scrolls. On mobile it shrinks to a compact 6-column strip with a shadow.

**P2 · Step slider** (`.slider.tslider[style="--n:N"]` > `.slides` > `figure.slide.ts` + `button.nav.prev/.next`). 22 instances.
- Slide = text block on top (`figcaption.ts__tx`: black round number `.st__n` 30 px or sand "!" `.st__i`, bold title Inter 800, paragraph) and picture below (`.ts__pic`, radius 26 desktop / 20 mobile, aspect 4:5; 4:3 inside "Before you start").
- Picture variants: `--img` (photo, `object-fit:cover`), `--mac` (animated or static device screen, see P4), `--mock` (inline SVG browser mock-up, chapter 10).
- Optional hotspot labels on a photo: `span.mk` positioned with inline `left/top` %, white dot + black pill; `.mk--warn` red; `.mk--l` label to the left; `.mk--c` label below.
- Modifiers: `.slider--grid` (static grid on >=768, slider below), `.slider--never` (red number, red title, 4 px red outline on pictures), `.slider--care` (Before you start), `--n:1` (single wide card, no number, max 820 px, 4:3).

**P3 · Option/stat cards**
- `.temps` (3-column grid of mist cards, big Inter 800 26 px figure + 14.5 px caption; `.red` variant tinted). Chapters 03, 13. 1 column at <=991.
- `.cws` (2 cards, 6 px left border, green when `--on`). Chapter 02 twice. 1 column at <=767.
- `.dots4` (4 dark cards with 4 dots each, 25/50/75/100 %). 2 columns at <=767.
- `.grams` (big "10-15 g" figure + sentence on a #faf8f4 bar).
- `.cwsx` (photo 360 px + text column; stacked at <=767).
- `.pk-cards` (2 bordered tobacco cards with 4:3 image, title, brand examples line in brown, text, grey tip box).

**P4 · Device screens**
- Wrapper `.dev` holds the device photo `img/closed-start.jpg` (1200x1490) and, on top of the dial, either an animated `div.lv[data-scene]` or a static `img.lvimg` (`ui/hq/*.png`, 800x800). Both sit at `left:50.17%; top:57.6%; width:21.4%` of the photo.
- In sliders and feature cards the wrapper is `.ts__pic--mac` / `.mac`: the photo is scaled to 300 % and centred on the dial so only the dial area shows.
- Animated screens are drawn in HTML/CSS by the shared script (see 1.4, B12). Colours: screen #0a0a0c, ember #e2614c, cream #f0e8d8, grey #a6a39b, green #7eae82. Fonts Inter and JetBrains Mono, all sizes in `cqw` (container query units), so the wrapper needs `container-type:inline-size`.
- Scenes used on this page: `level` (x2), `hold`, `slow`, `fast`, `click`, `click2`, `click4`, `timer` (x2), `start`, `temp`, `session`, `stop`, `brk`, `down`, `ver`, plus the Find-your-heat screen (no scene). The script also defines scenes used by other pages (`qstart`, `qtimer`, `quick`, `up`, `steps`).
- Static screens used: `continue`, `m-profiles`, `p-profiles` (x2), `profile_default/phoenix/wraith/oracle`, `q-menu`, `p-theme`, `p-volume`, `p-haptic`, `p-brightness`, `p-screen`, `p-stats`.

**P5 · Feature card** (`.feat.feat--mac`): #faf8f4 card, radius 28, device screen left (520 px), H3 (Inter 800 38 px) + paragraph right. Stacked on mobile. Chapter 07 twice.

**P6 · Mesh picker** (`.mpick`): two full-width bordered buttons (thumbnail, name, 4-row spec list, "How to pack it" + chevron), each followed by its pane with a step slider. See B8.

**P7 · Find your heat** (`.hf2`): device screen left, two option groups right ("Your tobacco": Virginia / Burley / A mix; "How you like it": Lighter / Stronger), then a 3-cell result row (Pre-heat, Session heat in ember 38 px, Profile to try) and a note. See B9.

**P8 · Notes** (`.note`): `--tip` cream #f6ecd9 with sand "i" badge and brown bold title; `--dont` pale red with red "!" badge. Radius 20, max-width 820, bullet list inside. Chapters 07 (x2), 08, 10, 13, 14.

**P9 · Do / don't rows** (`.safe`): each row = H3 on the left (240 px) + a pair of photos; red 3 px frame + "✕ Don't", green frame + "✓ Do", caption overlaid in a white box at the bottom of the photo. Mobile: H3 above, two photos side by side, captions under the photos.

**P10 · FAQ accordion** (`.faq > details`): native `<details>`, bold 16 px summary with "+" that becomes grey "−", 1 px rules, max-width 860.

**P11 · Promo links**: `.cl-glove` (cream card, 120 px image, title, text, "See the Cleaning Glove ›"), `.spare` (bordered row: 56 px image, name, sub-line, price), `.tsmore` (black uppercase pill + grey caption), `.more` (bold text link).

**P12 · Heat diagram** (`.pk-heatmap`): inline SVG cup in section with gradient fill, "Accent" / "Main flavour" labels and six arrows; text column to the right; stacked on mobile.

There are **no tables** in this page, **no back-to-top** control and **no separate table of contents**: the sticky chapter bar is the only chapter navigation.

## 1.4 Behaviours (all triggered unless marked)

| # | Behaviour | Trigger and result |
|---|---|---|
| B1 | Chapter bar, active chip | IntersectionObserver (`rootMargin:-40% 0 -55% 0`) adds `.on` (black pill, white text) to the chip of the chapter crossing the upper-middle of the viewport, and scrolls the bar sideways to centre that chip. |
| B2 | Chapter bar, click | `preventDefault`; clears the search if it has text; `scrollIntoView({behavior:'smooth'})`; `history.replaceState` sets `#id` (no history entry). Lands with the chapter top at 150 px. |
| B3 | Chapter bar and site header on scroll | Custom script on `<html>`/`.finder`: scrolling down more than 4 px past y=400 adds `.away` to the bar (slides up, fades). Scrolling up a total of more than 140 px brings the bar back at `top:8px` while the site header stays hidden (`html.hdr-hide` translates `.site-header` up). The site header only returns near the top (y<220), after 900 px of upward scroll, or on one fast flick (more than 120 px in a frame); then `html.hdr-show` moves the bar to `header height + 8px`. `body.bar-on` is set while the bar shows past y=300 (moves the sticky parts picker down to 70 px). Verified: after a chip jump the bar was `.away`; three 60 px scroll-ups brought it back at top 8 with `hdr-hide` still set; on mobile a 200 px scroll-up produced `hdr-show` and bar top 72. This overrides the theme's own header hide/show on these pages. |
| B4 | Search | `input` event, no debounce, no submit. Indexes the full text of each of the 16 `section.ch` (lower-cased, accents stripped, so "enso" matches "ENSŌ"). Query is split on spaces and every word must occur in the chapter (AND). Non-matching chapters get `hidden`; their chips are hidden too; the pack banner is hidden while a query exists; the counter shows "12 chapters" / "1 chapter". Verified: "battery" -> 12 chapters, "plate ENSO" -> 1 (cleaning), "latch" -> 4. No highlighting, no jump to the match, accordions are not opened, "Before you start" is not searched and always stays. The native search "x" clears it. |
| B5 | Search, nothing found | "zzzz" -> "0 chapters", `#mn-none` shown with link to `app.html#diamond-fix`; page shrinks to about 2,170 px. |
| B6 | Step slider, desktop | Native horizontal scroll with `scroll-snap-type:x mandatory`. Arrows are 44 px white circles overlapping the edges by 18 px; click scrolls by one slide width + 20 px (snap corrects the rest). `prev` is disabled at the start, `next` at the end; a disabled arrow is invisible (opacity 0). No loop, no autoplay, no keyboard handling. Desktop shows 3 slides (2 in "Before you start"). Verified end state: `scrollLeft` = max, next hidden. |
| B7 | Step slider, tablet and mobile | <=991: arrows hidden, "‹ Swipe for the next step" hint appears under every slider (chevron pulses), hidden for that slider after its first scroll. 768-991: 46 % wide slides. <=767: one slide per view (100 %), dot row appended by script (`.tsdots`, active dot is a 22 px black pill), dots follow `scrollLeft`. The first slider on the page nudges sideways once when 60 % visible (skipped with reduced motion). Script equalises the height of all text blocks in a slider so the pictures line up (re-run on load, font load, resize, mesh switch). All sliders reset to slide 1 on load and on back/forward (`pageshow`). |
| B8 | Mesh picker | Click a card: it gets a black 2 px outline, chevron flips, `aria-expanded=true`, its pane fades in below it and the other closes (one open at most). Clicking the open card closes it (none open). Opening scrolls the card to about 90 px from the top if it is off-centre. Basket is open on load. |
| B9 | Find your heat | Buttons are `aria-pressed` toggles within each group. Result is computed in JS: base Virginia 252, Burley 270, mix 262; +5 stronger / -5 lighter; rounded to 5. Defaults (Virginia, Lighter) -> "7 minutes at 275 °C (Default)", 245 °C, Phoenix. Burley + Stronger -> "7 minutes at 290 °C", 275 °C, Oracle. A mix + Stronger -> 265 °C, Default. The device screen counts degree by degree (20 ms per degree) to the new value and flashes a ring. The script also supports a third "flavour" group (`data-hf="fl"`: dessert -10, mint) that this page does not render. |
| B10 | Parts picker | Click or Enter/Space on a tile: tile gets a white fill + black ring, matching list row(s) turn cream with larger name, caption becomes "**Name** description" (aria-live), and the page scrolls so the row is visible below the sticky card. Clicking a row highlights its tile without scrolling. Desktop hover shows a floating name pill on the tile (disabled on touch and <=991). |
| B11 | Pack banner hover | Image scales to 1.03 over .6 s. Click jumps to `#pack` (native anchor, 150 px margin). |
| B12 | Animated device screens | Each `.lv[data-scene]` is filled by script with the screens it needs and plays a timed loop (per-step durations 110-2600 ms, 500 ms pause before repeating) **only while at least 35 % visible** (IntersectionObserver); it pauses when scrolled away and restarts from step 1. A hint pill at the top of the picture names the gesture ("Turn", "Click", "Click twice", "Hold 3 seconds", "Turn slowly", "Turn fast", "Click four times", "Click five times", "Click to save") with an icon. A press shows an ember ring around the screen; a turn sweeps an arc clockwise or counter-clockwise. With `prefers-reduced-motion` one still frame is shown. The `.finger` element in the markup is hidden by CSS (`display:none!important`). |
| B13 | Charging dots | `.dotsanim`: four dots fill one after another on a 4 s CSS loop (static, all lit, with reduced motion). |
| B14 | Heat diagram | Six arrows pulse towards the cup on a 1.6 s CSS loop. |
| B15 | FAQ accordion | Native `<details>`, many can be open at once (opened two together). Nothing is stored. |
| B16 | Hash on load | Browser-native scroll only. No script reads the hash; accordions are not opened by hash. |

Nothing on this page writes to `localStorage` or `sessionStorage` (the age gate's `over-21` and the pop-up's `enso_pop_gone` belong to the shared shell; the Welcome-gift tab is hidden on every `/experience/` URL).

## 1.5 Links and buttons

| Element | Destination |
|---|---|
| Breadcrumb | `index.html#diamond` |
| 16 chips | in-page `#out-of-the-box … #warranty` |
| Pack banner | `#pack` |
| Ch 05 text link "The cap and the draw" | `#the-cap` |
| Ch 05 "The packing guide: tobaccos, mixes and heat ›" | `packing.html` |
| Ch 07 "Profiles: a starting heat for each kind of blend ›" | `#profiles` |
| Ch 10 note "Update alerts ›" and pill "Open Software updates" | `app.html#diamond-updates` |
| Ch 12 Cleaning Glove card | `../partner-v2/product.html#x-glove` (accessory product) |
| Ch 12 Multi-Tool row, €19.99 | `../partner-v2/product.html#e-multitool` (accessory product; price is hard-coded text) |
| Ch 15 pill "Open the full troubleshooter", no-results link | `app.html#diamond-fix` |
| Ch 16 | `mailto:support@ensoshisha.eu`, `../partner-v2/warranty.html` |
| Back links | `quick.html`, `index.html#diamond` |

No link points at the old live site. No dead links.

## 1.6 Responsive notes

| Width | What changes |
|---|---|
| >=992 | 3-up sliders with arrows, big type (H2 52/58, H3 26/32, lead 19/30), parts picker 2 columns, do/don't rows with side heading. |
| 768-991 (checked at 800) | Hero stacks, chips bar still one scrolling row, sliders 46 % slides with swipe hint and no arrows or dots, `.slider--grid` blocks are static grids (2 x 366 px measured), stat cards 1 column, parts picker stacked with sticky image. H2 40/46. |
| <=767 (checked at 390) | One slide per view with dots; pictures 4:5 (device screens 4:5 too); "CHAPTERS" label hidden; H1 34/38, H2 30/36, H3 20/26, lead 16/28, slide title 17/22, slide text 14.5/21; `.cws`, `.pk-cards`, `.feat`, `.hf2`, `.cwsx`, `.pk-heatmap` stack; `.dots4` 2 columns; mesh picker's "How to pack it" drops under the spec list; do/don't captions move under the photos. No horizontal overflow (scrollWidth 390). |

## 1.7 Media

- Step photos come from `experience/img/s/` (51 files in the folder; those measured are 1000x747 or 1600x1195, landscape 4:3, shown cropped to 4:5 or 4:3 with `object-fit:cover`). Loaded lazily.
- Hero `img/m/hero-front-start.jpg` 1600x1200, shown at 482x362, **not** lazy and no `width`/`height` attributes: this is the LCP element on desktop. On mobile the H1 text is the likely LCP (image is below the text).
- Device photo `img/closed-start.jpg` 1200x1490 is used 33 times (once per screen: 18 animated + 15 static) and none of them is lazy.
- Static screens `ui/hq/*.png` 800x800, not lazy.
- Parts cut-outs `../partner-v2/sku/cut2/*.webp` (e.g. device-top 876x1009, d-cup 1204x861), lazy.
- Pack banner: `../pdp-v2/img/new/bowl-darkwood.jpg` 2000x1200 and `bowl-darkwood-m.jpg` 1120x1400, eager.
- Promo images: `../partner-v2/sku/live-acc/cleaning-glove-1.jpg` 1200x1200, `multi-tool-1.jpg` 1080x1080.
- No video on this page. Step photos have empty `alt`.

## 1.8 Design values (computed at 1440)

| Element | Value |
|---|---|
| Body text | Montserrat 400 16/28, #000; muted text rgba(0,0,0,.72) |
| H1 | Inter 800 48/52, letter-spacing -1.2 px |
| Chapter H2 | Inter 800 52/58, -1.3 px |
| H3 | Inter 800 26/32, -.65 px |
| Chapter number | Inter 800 14 px, .12em, uppercase, sand #c8943a |
| Lead | Montserrat 400 19/30, max 62ch |
| Slide title / text | Inter 800 21/27 (24/30 in "Before you start") / Montserrat 16.5/25 (17/26) |
| Chip | Montserrat 600 13.5/18, padding 7x13, radius 999; active #000 on white text |
| Search | 1.5 px border rgba(0,0,0,.1), radius 999, padding 13x20, input Montserrat 500 16 |
| Black pill button | Montserrat 700 12/16, .1em, uppercase, padding 13x22, radius 999 |
| Banner pill | white, Montserrat 700 12 px, .1em, uppercase, padding 14x24 |
| Colours | sand #c8943a, warn red #b3261e, ok green #2e7d4f, mist #f5f5f4, band #faf8f4, cream note #f6ecd9 / border #ead7b3, dark card #0b0b0c, ember #e2614c |
| Radii | cards 18-28, pictures 26 (20 mobile), pills 999 |
| Slider arrow | 44 px circle, shadow 0 4px 14px rgba(0,0,0,.18) |

## 1.9 Problems and open questions

1. **Eyebrow style is overridden by the theme.** The page CSS wants the hero eyebrow sand, 13 px, bold; the theme's own `.eyebrow` rule wins, so it renders black, 16 px, weight 500, letter-spacing 3.2 px (.2em). Same on `enso.html`. Decide which one is intended; the chapter number lines are sand.
2. **The page CSS is a stack of dated overrides.** The same selectors (`.ch`, `.finder`, `.ts__pic`, `.lv.press`, `.note`, `.mpick`) are redefined 3-6 times with `!important`. Rebuild from the computed result in this document, not from the source order.
3. **Firmware placeholder.** The `ver` scene shows "Software / 1 Oct 2026" (README says the real format is still to come). The chapter 10 mock-ups show `ensoshisha.eu/firmware`, a page that does not exist in the handoff.
4. **Hard-coded commerce data.** "€19.99" on the Multi-Tool row and both accessory links should come from the Shopify products.
5. **Two different support flows.** Chapter 16 says write to `support@ensoshisha.eu`; the troubleshooter pill sends people to the app.
6. **Accessibility gaps.** Step photos have empty alt text; slider arrows have no keyboard scrolling beyond the buttons; the search has no live region for the result count; accordions and search are not connected (a match inside a closed answer stays closed).
7. **Sub-anchors land under the bar.** `#charge-while-smoking`, `#charger`, `#cup-tool`, `#break`, `#burnt` have no scroll margin; they land at the very top where the chapter bar or header can cover them.
8. **Search does not cover "Before you start".**
9. `<main>` is nested inside `<main>` (invalid HTML).

---

# 2. `experience/enso.html` · ENSŌ 2026 Edition manual

`<title>`: "ENSŌ 2026 Edition Manual · Quick Start, Modes, Troubleshooting". Same wrapper, CSS and script as the Diamond manual. No sliders, no animated screens, no mesh picker, no parts picker on this page.

## 2.1 Section inventory

| # | Block | Purpose and layout | Content slots |
|---|---|---|---|
| A | Breadcrumb + pill row `.xnav` | "‹ ENSŌ Experience / **ENSŌ 2026 Edition**" and a row of 5 bordered pills (14 px, radius 999; current page black). Row scrolls sideways on mobile. | Quick start, Full manual (current), Troubleshooting, Flavour guide, Accessories |
| B | Hero `.mn-hero` | Same 2-column hero. Under the intro two small outlined pills. Image right. | eyebrow "ENSŌ Experience · ENSŌ 2026", H1 "ENSŌ 2026 Edition manual", paragraph, pills "Register your warranty" / "Troubleshoot in the app", image `../partner-v2/sku/enso-front.jpg` 1128x1400 (shown with its grey background as a rectangle) |
| C | Warning note `.note--dont` | Pale red box, max 820 px, red "!" badge, red title "Before you start: keep your warranty intact", two bullets with bold lead-ins. | title + 2 rich-text bullets |
| D | Finder `.finder` | Search pill (max 560 px) and under it the floating chip bar with 8 chapter chips (no "CHAPTERS" label). Sits **after** the hero and the note. Sticky like the Diamond bar; the search sticks with it (block is 89 px tall). | placeholder "Search: battery, flashes, clean, mode…" |
| 01 | `#quick-start` · Start · Quick start | 5 cards in a row (`.qs`): line drawing on mist square, black number badge, H3, paragraph, grey small note pinned to the bottom. 3 columns at <=1100, at <=760 a list of rows with a 92 px thumbnail on the left. | 5 x (image `img/manual/step-*-ink.png`, title, text, note) |
| 02 | `#parts` · Start · Know your ENSŌ | 2 columns: lettered drawing (A-K labels are part of the image) on a mist card, and a list "On the back, not in the drawing" L-S (sand letter + name, 1 px rules). Stacked at <=760. | image `parts-diagram-ink.png`, 8 list rows |
| 03 | `#in-the-box` · Start · In the box | 15 items in a 3-column ruled list (1 column at <=760) + small grey note. | list items, note |
| 04 | `#temperature` · Use · Temperature and modes | 2 columns: dial drawing (max 420 px) + numbered list (Scale, Turn, Read) and a paragraph; H3 "Three modes" + 3 mist cards (Default, G-Mode, Blue-Mode); two more drawings side by side. | images `temp-dial-ink.png`, `dial-turn-ink.png`, `led-temp-ink.png` |
| 05 | `#using` · Use · Using ENSŌ | 12 accordions (`.faq--rich`) | see 2.2 |
| 06 | `#care` · Care · Cleaning, care and travel | 6 accordions | |
| 07 | `#troubleshooting` · Help · Troubleshooting | 34 accordions, some with 1-2 drawings at the top of the answer | |
| 08 | `#warranty` · Help · Warranty | Lead, CTA row (black pill "REGISTER YOUR WARRANTY" + text link "Warranty terms ›"), 13 accordions | |
| E | Support `.support` | Top rule, H2 "Still need a hand", lead, two lines with mailto links (Europe / Rest of the world). | |
| F | Back link | "‹ Back to ENSŌ Experience" with sand underline (styled inline). | `index.html#enso` |
| G | `#mn-none` | "Nothing found. Try another word, or write to us." (no link) | |

Chapter y positions at 1440: 1046, 1978, 2752, 3419, 4695, 5864, 6643, 9272. Odd chapters here carry the #faf8f4 band (the first `.ch` is an even `section` child).

## 2.2 Accordions and anchors

- 65 `<details>`, **all with ids** (`q-…`). Answer body `.faq__a`: max 72ch, 15/24, paragraphs, ordered lists, upper-case bold sub-headings (`p.sub`), optional `.figs` row of drawings (flex, max 280 px each, 2 per row on mobile).
- Using (`#using`): `q-turn-on`, `q-battery`, `q-cs-charging-use`, `q-cs-break`, `q-water`, `q-hose`, `q-packing`, `q-draw`, `q-cs-bubbling`, `q-cs-two-hoses`, `q-cs-stones`, `q-cs-temp-2026`.
- Care (`#care`): `q-cleaning`, `q-cs-clean-pack`, `q-cs-water-in-device`, `q-travel`, `q-cs-dimensions`, `q-cs-discreet`.
- Troubleshooting: `q-weak-smoke`, `q-wont-turn-on`, `q-ot-red-flashes`, `q-not-charging`, `q-burnt`, `q-leaking`, `q-ot-no-heat`, `q-ot-chamber-moves`, `q-ot-cup-fit`, `q-ot-condensation`, `q-ot-air-escapes`, `q-ot-damaged-arrival`, `q-draw-tight`, `q-led-meaning`, `q-double-hose`, then 19 `q-cs-…` support answers (`wont-turn-on`, `chamber-crack`, `sound`, `thermodial`, `weak-vapor-cs`, `charging-port`, `battery-dead`, `battery-plus-charger`, `battery-specs`, `battery-identify`, `charger-power`, `oring`, `missing-part`, `thermo-cap`, `ceramic-cup`, `cleaning-tools`, `strap`, `spare-parts`, `accessory-compat`).
- Warranty: `q-cs-warranty-terms`, `-warranty-proof`, `-warranty-name`, `-return-body`, `-replacement-new`, `-replacement-model`, `-replacement-cost`, `-replacement-reg`, `-refund`, `-reseller`, `-transfer`, `-multiple-forms`, `-repair`.

### Deep links into this page

| Link | From | Exists | Result |
|---|---|---|---|
| `enso.html#quick-start` | `index.html`, own pill row | yes | chapter, 150 px margin |
| `enso.html#troubleshooting` | `index.html`, own pill row | yes | chapter, 150 px margin |
| `../experience/enso.html#q-packing` | `partner-v2/enso.html` (product page) | yes | scrolls so the "Pack the perfect bowl" row is at the very top of the viewport, **but the accordion stays closed** (measured `open:false`). |

## 2.3 Video guides

Not embedded. Three plain bold text links inside accordion answers, all `target="_blank" rel="noopener"`:

| Where | Label | URL |
|---|---|---|
| `q-turn-on` | Watch: ENSŌ Quick Setup › | `https://www.youtube.com/watch?v=hm01ZbaWdpY` |
| `q-packing` | Watch: Mastering ENSŌ › | `https://youtu.be/4FlQ9ACwn00` |
| `q-cleaning` | Watch: ENSŌ Cleaning › | `https://www.youtube.com/watch?v=gAHT4Sp2tOM` |

No iframe, no `<video>` on the page. (The Help app does embed YouTube, click-to-load; see 3.5.)

## 2.4 Behaviours

| # | Behaviour | Result |
|---|---|---|
| E1 | Chapter chips (active state, click, replaceState) | Same as B1/B2. |
| E2 | Bar and header on scroll | Same as B3. The whole finder (search + chips) slides away and returns; at mobile it returned at top 72 with the header. |
| E3 | Search logic | Same code as B4: filters the 8 chapters, hides chips, shows count. `flashes` -> "1 chapter" (troubleshooting), 7 chips hidden. Accordions are not opened and not filtered, so a hit inside the 34-item troubleshooting chapter leaves the reader with 34 closed rows. "zzzz" shows the no-results line. |
| E4 | **Search input cannot be clicked** | Verified: a real click on the input leaves focus on `<body>`; `elementFromPoint` at the input returns the element behind it. Cause: `.finder{pointer-events:none}` (written for the Diamond page where only the chips live in the finder) and only `.finder .chips` is re-enabled. The input still works by keyboard Tab or script. On the Diamond page the search sits outside `.finder` and is fine. |
| E5 | Accordions | Native `<details>`, many open at once (opened `q-turn-on` and `q-packing` together). No open-on-hash. |
| E6 | Pill row | "Troubleshooting" and "Quick start" are plain same-page hash links (native jump, no smooth-scroll script, hash added to history). |

No sliders, so the slider, nudge, equal-height and reset scripts find nothing to do here. Nothing is stored.

## 2.5 Links and buttons

| Element | Destination |
|---|---|
| Breadcrumb / back link | `index.html#enso` |
| Pill row | `enso.html#quick-start`, `enso.html`, `enso.html#troubleshooting`, `../partner-v2/blog-flavors.html`, `../partner-v2/accessories.html#enso` |
| Hero pills | `app.html#register`, `app.html#fix` |
| Warranty CTA | `app.html#register`, `../partner-v2/warranty.html` |
| Video links | YouTube (see 2.3) |
| Support | `mailto:support@ensoshisha.eu`, `mailto:support@ensoshisha.com` |

Text-only references with no link: "ask support", "register your warranty" inside answers, "Full terms live on the webshop's terms and policies page".

## 2.6 Responsive notes

- 1440: quick start 5 columns (211 px each), parts 540 + 540, box list 3 columns, modes 3 columns, accordions capped at 860 px.
- 800: hero stacked; quick start 3 columns (<=1100); parts still 2 columns; box list 3 columns.
- 390: quick start becomes rows with a 92 px thumbnail; parts, box list and modes 1 column; pill row and chip bar scroll sideways; hero pills wrap onto two lines; hero image below the pills. No horizontal overflow.

## 2.7 Media

- Hero `../partner-v2/sku/enso-front.jpg` 1128x1400, eager, no dimensions: LCP on desktop.
- 11 line drawings in `experience/img/manual/*-ink.png` (e.g. step-charge 404x312, step-fill 419x346, step-enjoy 517x235), all lazy, shown `object-fit:contain` on a mist tile. The folder also holds non-`-ink` versions of each drawing that this page does not use.

## 2.8 Design values (differences from the Diamond page)

| Element | Value |
|---|---|
| Hero pills `.mn-app a` | Montserrat 700 13 px, 1.5 px border rgba(0,0,0,.1), padding 9x16, radius 999, hover border black |
| Black pill `.pill` | Montserrat 700 13 px, .1em (1.3 px), uppercase, padding 16x26 |
| Quick-start card | 1 px border, radius 22, padding 18/18/22; H3 Inter 800 20/26; text 15/23; note 13.5/20 grey; number badge 30 px black circle |
| Answer text | Montserrat 400 15/24, rgba(0,0,0,.8), max 72ch |
| Video link | bold, inherits answer colour, no underline |
| Warning note | bg rgba(179,38,30,.05), border rgba(179,38,30,.25), padding 22/26/22/64 |

## 2.9 Problems and open questions

1. **Search field is dead to mouse and touch** (E4). One-line CSS fix, or move the search out of the finder as on the Diamond page.
2. **`#q-packing` deep link does not open its answer.** The product page sends people to a closed row. Add open-on-hash (and on `hashchange`) for `details[id]`.
3. **Search does not open or filter answers.** With 65 closed rows the chapter filter is not enough; filter the `<details>` and open the matches.
4. **Copy style differs from the Diamond manual.** 68 em dashes here against none there; mixed spelling ("flavor", "vapor", "colors" next to "flavour", "vapour"); upper-case sub-headings. Summaries are consistent (no trailing full stops, ENSŌ always with macron, no italics rendered).
5. **House rule "never free".** Two answers say "replaced free of charge" and "The replacement is free". They describe a warranty replacement, not the guides or the app, so probably fine, but the client should confirm.
6. **Old-site and US references in answers**: "$5.99", "about $25 elsewhere", "ensoshisha.com price", "the webshop's terms and policies page" (no link).
7. **Duplicate topics.** Several issues appear twice with different wording (e.g. `q-wont-turn-on` and `q-cs-wont-turn-on`, `q-weak-smoke` and `q-cs-weak-vapor-cs`, `q-double-hose` and `q-cs-two-hoses`). Client content decision.
8. Hero image is a photo with its own grey background, shown as a hard rectangle on white (the app uses a cut-out, `img/enso-2026-cut.png`).
9. Eyebrow override and nested `<main>` as on the Diamond page.

---

# 3. `experience/app.html` · the ENSŌ Help app

To be hosted separately, not rebuilt in the theme. This section says what the theme must link to and what a developer needs to host the file.

## 3.1 What the file really is

- 6,286,673 bytes, 3,938 lines. Two `<style>` blocks (23 KB "site build" layer + 58 KB app CSS), one 5.75 MB `<script>` (the knowledge base with inlined photos is inside it).
- 99 inlined `data:image/jpeg` images (5.9 MB of base64).
- Font: DM Sans 300-700 from Google Fonts (`<link>`, not inlined). System fallback if blocked.
- Malformed document: an outer `<!doctype html><html><head>…</head><body>` wraps a second complete `<!DOCTYPE html><html lang="en"><head>…<body>`. Browsers recover; it should be cleaned before hosting. No `lang` on the effective root, no manifest link, no service worker registration, favicon is an empty data URI.
- No JS errors in any state driven.
- **Theme follows the device**: `prefers-color-scheme` picks dark (#141210 background) or light (#fff); a three-way switch in the menu (System settings / Light / Dark) stores `ensoTheme`.

### It is the "site build", not the app in the handover

The top of the file says: `site build: simple layer (1 Oct 2026)` and, in the script, `v3 … registration offered, never forced; no tour, no onboarding steps; no tabs, no bottom bar; nothing about pre-order`. Measured consequences:

| Handover says | The file does |
|---|---|
| "Registration is a hard gate, nothing opens until a warranty is registered" | **No gate.** A fresh visitor sees a start screen and can open every section without registering. `applyGate()` always removes `body.gated`; `saInit()` removes it again. The comment above `go()` and above `ensoDeep()` still claims the gate exists. |
| Onboarding step 2 "add to home screen", step 3 notifications | Onboarding is switched off (`obResume` returns false, stage forced to `done`). "Add to home screen" is an optional card and menu item; the notify step is offered only from Diamond's Software updates screen. |
| Device tabs ENSŌ / ENSŌ 2.0 / Diamond, bottom navigation, tour, "What's new" pill | All hidden with `display:none!important` (`.model-tabs, #ntBar, .stage, #bottomNav, .nav, .tour, .e2hero, .wn-pill, .help-btn, .prof-btn`). Replaced by a top bar with a Menu button and a device choice stored on the phone. |
| `?screen=<id>` preview links | Do not work: `saInit()` runs afterwards and navigates home (`?screen=profile` showed the home screen). `?reset=1` still works (clears `ensoProfile`, `ensoOnboard`, `ensoNotifyMuted`, `enso_tour_v1` and reloads without the query). |
| "Self-contained, all images inlined" | Not any more. See 3.6. |
| Line numbers for the functions to fill in | All stale. See 3.7. |

The client should confirm which behaviour is wanted before hosting: the gated app of the handover, or this open site build.

## 3.2 Screens (all seen at 390 px unless noted)

The app is a fixed-height column (`.app`, `height:100dvh`, max-width 430 px, centred); the page itself never scrolls, `#wrap` scrolls. One `.scr.active` at a time.

| Screen id | How you get there | What it shows |
|---|---|---|
| `scr-start` | First visit with no device and no hash | "Welcome to ENSŌ"; dark hero card "Register your warranty" with Register button; "Which one is yours?" and two device cards (ENSŌ 2026 Edition, ENSŌ Diamond); a dismissible "What's new" card (currently "Angel Cloud Elite cap" with link to `ensoshisha.eu/products/angel-pack`). |
| `scr-search` (device home) | After picking a device, `go('home')`, logo button | Search field whose placeholder types example questions by itself; "Start here · Quick start" card with device image; 6 tiles (Manual, FAQ, Troubleshoot, Guides, Recipes, Support); cards "Put ENSŌ on your home screen" (hidden when installed), "Software updates" (Diamond only), "Register your warranty" or "Warranty active · covered until …"; "What's new" card; for ENSŌ a "Did you know?" accessory line; footer with the support address (`.eu` for Diamond). |
| `scr-qs` | Quick start | ENSŌ: the first-time-setup guide as step cards. Diamond: 5 numbered steps, each with a swipeable picture strip and dots (photos from `img/s/`, device screens from `ui/hq/` over `img/closed-start.jpg`). |
| `scr-howto` / `scr-dhow` | Manual | Accordion list of topics. ENSŌ: 17 topics (Before you start, First-time setup, Parts diagram, Unboxing, Turn on/off, Adjust temperature, Modes, Battery, Water tank, Vaporhose, Pack the bowl, Draw resistance, Cleaning, Weesha, Travel, Accessories, Register your warranty). Diamond: 15 topics mirroring the manual chapters. An open topic shows numbered steps or swipe cards ("1 / 7") with a picture, and sometimes an "Upgrade your unit" product card. |
| `scr-faq` | FAQ | ENSŌ: 23 questions (support answers + warranty). Diamond: 15. |
| `scr-fix` / `scr-dfix` | Troubleshoot | ENSŌ: 34 problems. Diamond: 18. Tap to open numbered steps. |
| `scr-guides` | Guides | Link rows. ENSŌ: `enso.html`, `../partner-v2/blog-flavors.html`, `https://ensoshisha.com/pages/user-guide` (new tab). Diamond: `quick.html`, `packing.html`, `cleaning.html`, `manual.html`. |
| `scr-recipes` | Recipes | Tabs Community / Create blend / My blends; leaderboard, "Recipe of the Year · Dec 2027", prize copy; blend builder with flavour rows, percentage cup graphic, temperature dials; share-card overlay. Stored on the phone only. |
| `scr-sw` | Diamond only: Software updates | "Latest release · October 1, 2026" (from `FIRMWARE.Diamond.date`), "Which version do I have", "How to update" 4 swipe cards, "Update alerts" with "Turn on update alerts". |
| `scr-register` | Warranty (when not registered) | Warranty header (2 years device / 1 year battery / 30 days to return); for ENSŌ a reseller warning card; fields: device (only when no device is known; choices ENSŌ / Diamond), serial, name, email, date of purchase, where bought (ensoshisha.eu / ensoshisha.com / A shop), order number (optional), hidden honeypot `regNick`, consent checkbox with Terms and Privacy links; button "Register and activate warranty" (disabled until valid); for ENSŌ seven tutorial blocks under the form, six with a YouTube cover. |
| `scr-profile` | Warranty (when registered) | Avatar initials, name, email; device card (model, serial, bought, device cover until, battery cover until, "Have you updated your software?" prompt); "Warranty & service" answers; buttons: add a device, Notifications, My blends, Contact support, Sign out of this device (confirm dialog). |
| `scr-notify`, `scr-ob-notify`, `scr-ob-install` | From Software updates, the home card or the menu | Notification explainer and switch; "Add ENSŌ to your home screen" with a drawn iPhone share sheet and Android note. |
| `scr-diamond`, `scr-diasoon` | Not reachable in this build | Old Diamond landing with the pre-order card (€320 / €349, link to `ensoshisha.eu/products/enso-diamond-pre-order`). Still in the file. |

### Top bar, menu, temp bar

- Top bar: back arrow (hidden on home/start, goes home), "ENSŌ" + device short name (button, goes home), "Menu" button.
- Menu (`#saMenu`, `role=dialog`): on mobile a full-screen sheet over a 38 % black backdrop. Rows: Home, Quick start, Manual, FAQ, Troubleshoot, Guides, Recipes, Software updates (Diamond only), Warranty, Add to home screen (not when installed), Contact support (opens `mailto:`), then "Your device" with the two devices (tick on the current one) and "Theme: …". Before a device is chosen it only lists Home, Warranty, Add to home screen, Contact support. Closes with the ✕, Escape (verified) or a click on the backdrop. Picking a device always lands on that device's home.
- Temp bar: when a deep link arrives with no device stored (for example `#fix`), the section opens for a default device and a strip says "Showing ENSŌ 2026 Edition" with a button "Switch to Diamond". Pressing it stores the device and shows the same section for the other one (verified: `scr-fix` -> `scr-dfix`, `ensoDevice=diamond`).

### Search

- Device home search runs live 250 ms after typing (and on Enter / the round button); the section tiles hide while there is a query. "battery" on ENSŌ returned 3 answers; tapping one opens it in place.
- ENSŌ and Diamond pools are separate: with Diamond selected only categories `dhow`, `dfix`, `dfaq` are searched, otherwise everything except those.
- Magic words typed in the search and submitted with Enter: `wakeup20` (or `bringback20`) and `sleep20` (or `hide20`). Punctuation and spaces are ignored, so "wake up 2.0" works.

### Desktop and tablet

- >=900 px: the app widens to max 1240 px, centred with side borders; a permanent 272 px sidebar replaces the Menu button (same rows, current one highlighted, device switch and theme at the bottom); content column about 820 px; step cards and tutorial videos go two-up. Looks like a small web app, clean in light theme.
- 800 px: still the phone layout, a 430 px column centred on a blank page with the Menu button.
- 390 px: full width.

## 3.3 Hash routes

Handled by `ensoDeep()` on load and on `hashchange`. Format: `#<section>` or `#<device>-<section>` with device `diamond` or `enso`; `#diamond` / `#enso` alone open that device's home. A device prefix **stores** the device (`ensoDevice`).

| Section word(s) | Screen |
|---|---|
| `register`, `warranty`, `profile` | registration form, or the profile if already registered |
| `updates`, `software`, `notify` | Software updates (`scr-sw`) |
| `fix`, `troubleshooting`, `troubleshoot` | Troubleshoot (`scr-fix` / `scr-dfix`) |
| `recipes`, `blends` | Recipes |
| `howto`, `guides` | Manual (`scr-howto` / `scr-dhow`). Note `#guides` opens the Manual, not the Guides screen. |
| `search` | device home |
| unknown or empty | ignored (fresh load goes home or start) |

Routes used by the handoff pages, all verified to resolve from a clean browser:

| Link | Used by | Lands on |
|---|---|---|
| `app.html` | `index.html` | start screen (or last device's home) |
| `app.html#diamond`, `#enso` | `index.html` | device home, device stored |
| `app.html#register` | `index.html`, `enso.html` (x2), `partner-v2/support.html` | registration, device selector visible |
| `app.html#diamond-register`, `#enso-register` | `index.html` | registration for that device, selector hidden |
| `app.html#fix` | `index.html`, `enso.html` | ENSŌ troubleshooting with the "Switch to Diamond" strip |
| `app.html#diamond-fix` | `manual.html` (x2) | Diamond troubleshooting |
| `app.html#recipes`, `#diamond-recipes`, `#enso-recipes` | `index.html` | Recipes |
| `app.html#diamond-updates` | `manual.html` (x2), `index.html` (x3), `cleaning.html`, `diamond.html`, `packing.html` | Diamond Software updates |

If the app moves to its own host, every one of these links in the theme must become an absolute URL to that host with the same hash. Keep the hash vocabulary unchanged.

## 3.4 Storage (localStorage only, no cookies, no network calls)

| Key | Meaning |
|---|---|
| `ensoDevice` | `enso` or `diamond`: the chosen device |
| `ensoProfile` | `{name, email, devices:[{model, serial, bought, where, order, fw, at}]}` |
| `ensoRegistry` | serial -> registration, kept after sign-out (this is the local stand-in for the backend lookup) |
| `ensoOnboard` | onboarding stage; forced to `done` in this build |
| `ensoNotifyMuted`, `ensoNtBarHidden` | pause switch, old alerts bar |
| `ensoTheme` | `light` / `dark`, absent = system |
| `enso2Visible` | `on` / `off`: the hidden ENSŌ 2.0 content |
| `saNewsSeen` | dismissed "What's new" item |
| `enso_tour_v1` | tour seen (set to true on first load) |
| `enso_recipes_v1`, `enso_votes_v1`, `enso_tried_v1`, `enso_mine_v1` | recipes |

Because storage is per origin, moving the app from `ensoshisha.eu/…/app.html` to `help.ensoshisha.eu` starts everyone from empty; and a registration made on one origin is invisible on another until the backend exists.

## 3.5 Registration, as driven

Reached the screens behind registration by filling the form with dummy data (serial `HW-TEST-0001`, name, `audit@example.com`, consent ticked):

- Button enables when serial has 3+ characters, name 2+, email matches a simple pattern and consent is ticked. Serial is upper-cased while typing. No format check (by design).
- Bot checks: a filled honeypot is silently ignored; a submit less than 4 s after the screen opened shows "Give that one more second and try again."
- Submit calls `lookupRegistration(serial)` (same serial + other email is refused with a message naming support; same serial + same email restores the profile), then `sendRegistration({...dev, name, email, consentAt, consentText})`, saves to localStorage and opens the profile: "WARRANTY ACTIVE", device cover until +2 years, battery +1 year (from purchase date, or today when the date is empty: it showed Oct 6, 2028 / Oct 6, 2027).
- The consent text stored is the fixed string `18+, owner, Terms + Privacy Notice`.
- Terms and Privacy links: `https://ensoshisha.eu/policies/terms-of-service`, `https://ensoshisha.eu/policies/privacy-policy` (new tab).
- ENSŌ tutorial videos: a cover from `i.ytimg.com`; a tap replaces it with an iframe `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0&playsinline=1` (verified for `c074UJJ1NLs`); a "Watch on YouTube ›" link stays under each. IDs: `c074UJJ1NLs`, `nHbQdU88cig`, `I3Yu_wTiqIM`, `wc_XFr_qo18`, `2JXPFqqa2vQ`, `t0hbKM_1ef8`.

## 3.6 What the file depends on outside itself

The app must be hosted **with these beside it**, or the references rewritten:

- **Images by relative path (about 75 files)**: `img/closed-start.jpg`, `img/enso-2026-cut.png`, 51 files in `img/s/` and 22 in `ui/hq/`. They are the same files the manuals use. They appear in Diamond's Quick start, Manual, Software updates and the ENSŌ device card. (All loaded correctly from the handoff folder; they will 404 if only the HTML is uploaded.)
- **Relative page links**: `enso.html`, `quick.html`, `packing.html`, `cleaning.html`, `manual.html`, `../partner-v2/blog-flavors.html`, `../partner-v2/product.html#d-tool`, `../partner-v2/product.html#d-screens`. On a separate host these must become absolute store URLs.
- **Absolute links to the live stores**: 16 `https://ensoshisha.eu/products/…` accessory links (angel-pack, enso-battery, enso-battery-plus, glass-thermo-cap, multi-tool, acrylic-tank and others), `https://ensoshisha.eu/products/enso-diamond-pre-order`, `https://ensoshisha.com/pages/warranty`, `https://ensoshisha.com/pages/user-guide`. Handles must still exist after the rebuild or be redirected.
- **Third parties**: Google Fonts, `i.ytimg.com`, `youtube-nocookie.com`, YouTube links.
- **Hard-coded prices** inside answers (for example "Diamond Battery · €69", "Battery Plus … €59,99", "€320 / €349").
- Support addresses: `support@ensoshisha.com` by default, `support@ensoshisha.eu` for Diamond screens.

## 3.7 The four `HOSTING DAY` spots (real line numbers in this file)

| Line | Function | What to do |
|---|---|---|
| 2892 (function at 2899) | `pushSubscribe()` and `pushSyncTags()` | Init the push provider (OneSignal or FCM) and opt in; send the pause switch as a tag (`muted`). Currently returns false. Needs `/sw.js` and `/manifest.json` at the domain root and HTTPS. |
| 3042 (function at 3045) | `lookupRegistration(serial)` | Fetch the stored registration for a serial from the server, or null. Currently reads `ensoRegistry` from localStorage. |
| 3050 (function at 3053) | `sendRegistration(dev)` | POST the registration (serial, name, email, model, bought, where, order, consentAt, consentText, fw, at). Currently `return true`. |
| 3127 | `regBotSuspect()` | Place for Cloudflare Turnstile if junk registrations start. |

Also to edit per release: `const FIRMWARE` at line 3207 (all three models `date:"2026-10-01"`, `ver`, `notes`, `how` empty) and `const FW_SUGGEST = "2026-10-02"` at line 3213. The handover's line numbers (2525, 2672, 2681, 2755, 2835, 2841) are from an older file.

## 3.8 Hidden ENSŌ 2.0 content

- Typed `wakeup20` in the home search + Enter: page reloads, `enso2Visible=on`. Typed `sleep20`: reloads, `off`. Both verified.
- In this site build the reveal is only partial: the "ENSŌ 2.0" choice appears in the registration device selector and in the recipe builder's "Made for" row, but the device tabs and the 2.0 hero stay hidden by the site layer's CSS, and the menu still offers only ENSŌ 2026 Edition and ENSŌ Diamond. The handover's "tabs, content, photos" do not come back with the magic word alone here. Do not strip the 2.0 code; ask the client how 2.0 should surface in November.

## 3.9 What the theme needs to do

1. Link to the app from the Experience hub, both manuals, the guides and the support page using the routes in 3.3, as absolute URLs once the host is known.
2. Do not embed the app in the theme (it sets `html, body {height:100%; overflow:hidden}` and uses its own fonts and theme colours). Open it as its own page; decide same tab or new tab (the handoff uses same tab).
3. Provide the pages the app points back to at stable URLs: the two manuals, quick start, packing, cleaning, flavour guide, accessory products `d-tool` and `d-screens`, Terms and Privacy policies, and the product handles listed in 3.6.
4. Keep `img/` and `ui/` with the app (or change its paths to the Shopify CDN).
5. Hosting checklist from the handover that still applies: HTTPS, `manifest.json` + `sw.js` at the root, push provider, a small registration backend keyed on serial + email, DPAs, retention and deletion route, and expect the HTML file to be replaced several times ("one file in, one file out").

## 3.10 Design values (for reference only)

DM Sans; light tokens `--bg #fff`, `--ink #1A1A1A`, `--ink-2 #6B6560`, `--ink-3 #9B9590`, `--accent #2C2825`, `--gold #CFA872`, `--gold-ink #8a6a3a`, `--border rgba(0,0,0,.06)`, radius 16 px, pills 100 px. Dark tokens `--bg #141210`, `--surface #1D1A17`, `--ink #F0E8D8`, `--accent #EDE4D3`, `--gold #CFA872`. The app's gold (#CFA872) is not the Experience sand (#c8943a).

## 3.11 Problems and open questions

1. **Handover and file disagree** on the registration gate, onboarding, tabs and bottom bar (3.1). Client decision needed.
2. **Not self-contained**: about 75 external images and 8 relative links (3.6). "Upload one file" will break pictures and links.
3. **Invalid nested HTML document**; no manifest, no service worker, no icons yet.
4. **`?screen=` preview links are broken** by the site layer; stale comments claim a gate that no longer exists.
5. **`#guides` opens the Manual**, not the Guides screen; there is no hash for Quick start, FAQ or Guides.
6. **ENSŌ 2.0 reveal is incomplete** in this build (3.8).
7. **Stale and conflicting content inside the app**: "Recipe of the Year · Dec 2027", unreachable pre-order card with €320 / €349, US-dollar shipping figures, `ensoshisha.com` warranty and user-guide links, accessory prices in text, em dashes and US spelling throughout the ENSŌ answers.
8. **Registration with an empty purchase date** counts cover from today; date is optional in the form but required in the handover's minimum record.
9. **6.3 MB single file**: every visit downloads all of it before anything shows. On a real host, serve it compressed with long cache headers, or ask the client whether the inlined photos can become files like the other 75.
10. Storage is per origin: changing the host later wipes every local profile until the backend lookup exists.

---

# 4. Top problems across the three files

1. `enso.html`: the search input cannot be clicked or tapped (`pointer-events:none` inherited from `.finder`).
2. `enso.html#q-packing` (linked from the ENSŌ product page) scrolls to a closed accordion; no open-on-hash anywhere.
3. `app.html` in the handoff is an open "site build": no hard registration gate, no onboarding, no tabs or bottom bar. This contradicts `help-app-HANDOVER.md`.
4. `app.html` is not self-contained: about 75 images in `img/` and `ui/` and 8 relative page links must travel with it or be rewritten.
5. All `HOSTING DAY` and firmware line numbers in the handover are stale (real: 2892, 3042, 3050, 3127; `FIRMWARE` 3207, `FW_SUGGEST` 3213).
6. The theme's `.eyebrow` rule overrides the Experience eyebrow on both manuals (black 16 px tracked instead of sand 13 px bold).
7. Both manuals share one CSS and one JS block made of layered `!important` patches; rebuild from computed values. The animated screens need Inter, JetBrains Mono and container-query units.
8. Search on both manuals filters whole chapters only: no highlight, no opening of answers, "Before you start" not indexed.
9. Hard-coded commerce data (Multi-Tool €19.99, accessory links by `#id`, prices inside app answers) must be wired to Shopify or kept in sync by hand.
10. Copy consistency for the client: em dashes, US spelling and "free of charge" in the ENSŌ manual and the app's ENSŌ answers; firmware version placeholder; `ensoshisha.eu/firmware` page referenced but not delivered.
