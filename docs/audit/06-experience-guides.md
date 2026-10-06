# 06 · ENSŌ Experience: hub and four Diamond guides

Audited 6 Oct 2026 against `shopify-handoff-html/site/experience/` by driving each page in headless Chrome at 1440×900, 800×900 and 390×844 (touch), plus reading the page-specific inline CSS/JS. Screenshots: `scratchpad/shots/exp/` (`idx-*`, `q-*`, `p-*`, `c-*`, `d-*`). Shared header/footer are out of scope (another auditor).

Pages: `index.html` (hub), `quick.html`, `packing.html`, `cleaning.html`, `diamond.html`.

## Summary

- All five pages are static content plus one shared inline script (the "live Diamond screens" bundle, about 26 KB, identical on quick/packing/cleaning) and, on `diamond.html`, a separate 8 KB scroll-scene script. No network calls, no localStorage, no forms. No JS errors were reported by the driver on any of the five pages.
- **The animated Diamond screens are DOM, not canvas or video.** A `<div class="lv" data-scene="…">` is positioned over a device photo (`img/closed-start.jpg`); JS injects one `<div class="lv__s">` per screen state, toggles `.on`, rewrites the numbers, and loops on `setTimeout`. All sizes use container-query units (`cqw`). The `ui/*.svg` files are **not** used by this system; only `diamond.html` uses them (as `<img>` layers crossfaded by scroll position).
- **`diamond.html` `.fit` is a pinned, scroll-scrubbed scene**: a 580vh section with a `position:sticky; top:0; height:100vh` child. Scroll progress drives a camera zoom into the dial, a screen swap through 7 SVGs and a 5-step text stack. Scrubs both ways, no snapping, no autoplay.
- **"Find your heat"** is a 2-question picker (3 tobaccos × 2 strengths = 6 outcomes) that writes three outputs and animates the dial number. Full table below.
- Sliders are native scroll-snap grids. Most are flagged `slider--grid` and become plain grids at ≥768px; only the first cleaning slider keeps arrows on desktop. No autoplay anywhere, no loop.
- `.xnav` (breadcrumb + chip links) is **not sticky**; it scrolls away with the page.
- Biggest rebuild risks: theme class-name collisions that already change the rendering (`.eyebrow`, `.card`), the fixed site header covering the pinned scene when it reappears, missing font weights on `packing.html`, and two 1.6–1.7 MB PNGs on `diamond.html`.

Counts: 38 sections; 30 numbered behaviours, plus the shared slider mechanics (0.4, 6 items) and live-screen mechanics (0.3).

---

## 0. Shared pieces

### 0.1 Page shell

Every page is `<main id="MainContent" class="enso-pdp">` wrapping the `.xnav` and a nested `<main class="wrap">` (nested `<main>` is invalid HTML; use a `div`). `.wrap` = `max-width:1200px; padding:0 40px` (16px at ≤991). `diamond.html` does not use `.wrap`: its sections are `max-width:1600px; padding:0 40px`, so its content starts at x=40 while the `.xnav` above starts at x=160 and the back links at x=144 (visible misalignment at 1440).

Base type (computed): body Montserrat 400 16px/28px, black on white. Headings Inter 800, letter-spacing −.02 to −.025em, `text-wrap:balance`. Tokens declared per page: `--ink:#000 --grey:#666 --line:rgb(0 0 0/.1) --mist:#f5f5f4 --sand:#c8943a --warn:#b3261e --dark:#0b0b0c`; `diamond.html` adds `--coral:#E2614C`. Screen colours: background `#0a0a0c`, text `#f0e8d8`, accent `#e2614c`, muted `#a6a39b`.

Fonts requested from Google Fonts differ per page:

| Page | Google Fonts request |
|---|---|
| index, packing | Inter 800; Montserrat 400/500/600/700 |
| quick, cleaning | Inter 400–800; JetBrains Mono 400; Montserrat 400–700 |
| diamond | Inter 800; Montserrat 400/500/700 |

### 0.2 `.xnav` sub-navigation

```html
<nav class="xnav" aria-label="ENSŌ Diamond guides">
  <a class="xnav__back" href="index.html#diamond">‹ ENSŌ Experience <span aria-hidden="true">/</span> <b>ENSŌ Diamond</b></a>
  <div class="xnav__row"> six chip links </div>
</nav>
```

| Item | Value |
|---|---|
| Position | `static` (verified at scrollY 600: it has scrolled away). Not sticky |
| Box | max-width 1200, padding 18px 40px 0 (14px 16px 0 at ≤991). Sits directly under the 79px fixed header (64px on mobile) |
| Breadcrumb | one link, 14px, colour rgb(0 0 0/.62), hover black; "ENSŌ Diamond" part is bold black. The whole line links to `index.html#diamond` (the "ENSŌ Diamond" crumb is not a separate link) |
| Chip row | flex, gap 8, margin-top 12, `overflow-x:auto`, scrollbar hidden. Chips: 1px border rgb(0 0 0/.12), radius 999, padding 8px 16px, Montserrat 500 14px, 46px tall. Hover: border black. Current page: `aria-current="page"` gives black fill, white text |
| Chips (same order everywhere) | Quick start → `quick.html` · Full manual → `manual.html` · Pack the cup → `packing.html` · Cleaning → `cleaning.html` · Troubleshooting → `manual.html#troubleshooting` · Software updates → `app.html#diamond-updates` |
| Mobile | row is 805px wide in a 358px box: swipe sideways, no fade or arrow hint; the current chip is not scrolled into view |

Per-page differences:

| Page | Breadcrumb | Chip row | Current chip |
|---|---|---|---|
| index | none (no `.xnav`) | none | n/a |
| quick | yes | **missing** (breadcrumb only) | n/a |
| packing | yes | yes | Pack the cup |
| cleaning | yes | yes | Cleaning |
| diamond | yes | yes | none marked (the page has no chip of its own) |

### 0.3 Live Diamond screen (`.lv`) — how it is built

Used by quick (2 scenes), packing (heat finder + 1 scene). Present but unused in cleaning's script.

**Markup**

```html
<div class="mac">                       <!-- or .qs__mac > .mac, or .ts__pic.ts__pic--mac -->
  <div class="dev">
    <img src="img/closed-start.jpg" alt="">            <!-- 1200×1490 device photo, 148 KB -->
    <div class="lv" data-scene="qstart" role="img" aria-label="…"></div>
  </div>
  <span class="finger" aria-hidden="true"></span>      <!-- display:none!important in final CSS -->
</div>
```

**Layout**: the frame (`.mac`, `overflow:hidden`, white, square or 4/5) shows a zoomed crop of the photo: `.dev{position:absolute; width:300%; left:50%; top:50%; transform:translate(-50.17%,-57.6%)}` (330% in the quick-start card). The screen sits on the photo's dial: `.dev .lv{position:absolute; left:50.17%; top:57.6%; width:21.4%; transform:translate(-50%,-50%); aspect-ratio:1; border-radius:50%; background:#0a0a0c; container-type:inline-size; overflow:hidden}`. Measured on quick step 5 at 1440: frame 541×433, photo 1786×2218, screen 382×382.

**Screens** (`SCR` map, HTML strings injected once per scene; only the screens a scene uses are created): `start`, `qt` (Pre-heat Timer menu item), `timer` (SVG ring, `stroke-dasharray = tm/900×100`), `pre` (Pre-heating countdown), `adj` (Adjust temp), `ses` (Running), `sesl` (Running + lock icon), `menu`, `lock`, `bat`, `ver`, `can` (Cancel Pre-heat? No/Yes), `off`. Battery always reads 100%. Type is Inter in `cqw` (for example `.t-huge` 700 22cqw coral, `.t-big` 700 15.6cqw, `.t-start` 700 9.9cqw coral, `.t-cap` 500 2.9cqw uppercase .14em); `.mono` labels use JetBrains Mono. Screens crossfade with `opacity .22s`.

**Scenes** (`SCENES[name]()` returns steps `[screen, values, ms, hint, press, linkKey]`). Scenes defined: `timer, start, temp, session, stop, qstart, qtimer, quick, hold, slow, fast, click, click2, click4, ver, level, brk, up, down, steps`. Used on these pages:

| Scene | Where | Sequence (ms per step) | Loop length |
|---|---|---|---|
| `qstart` | quick step 5, slide 1 | Start 1400 → Start + press 380 → Pre-heating 7:00, 6:59, 6:58, 6:57 at 275 °C (700 each) → Adjust temp 274→260 (110 each, hint "Turn") → 260 hold 900 → Pre-heating 6:55, 6:54, 6:53 at 260 °C (700 each) → +500 pause, repeat | about 9.7 s |
| `qtimer` | quick step 5, slide 2 | Pre-heat Timer 07:00 1400 → press 500 ("Click") → timer 07:00 900 → 08:00 700 → 09:00 900 (hint "Turn") → 09:00 press 700 ("Click to save") → Start 1400 → +500 | about 7.0 s |
| `down` | packing "If it tastes burnt", slide 1 | Running 265° 25:00 1300 → Adjust temp 264→245 (110 each, "Turn") → 245 hold 900 → Running 245° 25:01 1300 → +500 | about 6.2 s |

**Per-step effects**: hint pill (`.lv-hint`, black, top 12px, icon + "Turn"/"Click"/"Click to save"/…) fades in while a step has a hint; `press` adds `.lv.press` (thin coral ring glow, `box-shadow 0 0 0 .45cqw rgb(226 97 76/.9), 0 0 3cqw .5cqw rgb(226 97 76/.35)`, 0.35s ease); a turn adds `.tr-cw` or `.tr-ccw` (a conic-gradient coral arc on `.lv::after` sweeping 1.1s; direction is ccw when the value falls on the same screen), re-triggered at most every 900 ms.

**Start/stop**: an `IntersectionObserver` (threshold .35) per `.lv`. On entering, the loop restarts from step 0; on leaving, the timer is cleared and the frame freezes. Verified: off-screen screen did not advance in 3 s; a screen inside a horizontally scrolled-away slide does not run until its slide is swiped in. `prefers-reduced-motion: reduce` shows one still frame (`data-still`, default step 0) and removes transitions (from code, NOT VERIFIED in browser: the driver cannot emulate the media feature).

**Other features in the same script, with no markup on these five pages** (dead here, needed by `manual.html`): mesh tabs `.mpick__c`, chapter bar `.finder` (toggles `hdr-hide`/`hdr-show` on `<html>`), `.dialplay` coal row, `.hf-old`, dial lab `.dlab`, "Out of the box" `.box__img`.

### 0.4 Step slider (`.slider.tslider`)

```html
<div class="slider tslider [slider--grid] [slider--never]" style="--n:3">
  <div class="slides">
    <figure class="slide ts">
      <figcaption class="ts__tx"><span class="st__n">1</span><b>Title</b><p>Text</p></figcaption>
      <div class="ts__pic ts__pic--img"><img loading="lazy"></div>
    </figure> …
  </div>
  <button class="nav prev" aria-label="Previous">‹</button><button class="nav next" aria-label="Next">›</button>
</div>
```

Text sits above the picture. `.st__n` 30px black circle, Inter 800 14px white. Title Inter 800 21px/27px at ≥992 (18/24 at 768–991, 17/22 on phones), colour rgb(0 0 0/.8). Text 16.5px/25px (14.5/21 phones), rgb(0 0 0/.72). Picture frame radius 26 (20 on phones), `object-fit:cover`, 4/5 portrait.

| Width | Plain `.tslider` (cleaning slider 1 only) | `.slider--grid` (all others) |
|---|---|---|
| ≥992 | horizontal scroller, 3 columns visible, gap 32. Arrows 44px white circles with shadow at left −18 / right −18; a disabled arrow fades to opacity 0 | static grid `repeat(--n, 1fr)`, no arrows, dots or hint. `--n:1` becomes one centred 820px column with a 4/3 picture, number hidden, text centred |
| 768–991 | scroller, columns 46% (2.2 visible). Arrows `display:none`, dots hidden, "‹ Swipe for the next step" hint shown | static grid as above |
| ≤767 | one slide per view (100%, gap 16, snap start), dots + swipe hint under it | same as plain: becomes a one-per-view scroller with dots + hint (`--n:1`: no dots, no hint) |

Behaviour (triggered):
- Arrow click scrolls by one slide width + 20px, smooth. Cleaning slider 1: `scrollLeft` 0 → 384 (its maximum) on Next, Next then disabled; Prev returns to 0. No loop, no autoplay, no keyboard handling.
- Dots (`.tsdots`, built by JS, phones only): 8px grey dots, active is a 22×8 black pill. They follow scroll (`round(scrollLeft / (slideWidth+16))`). **They are not clickable** (verified: a tap left `scrollLeft` unchanged).
- Swipe hint: "‹ Swipe for the next step", Montserrat 600 13px grey, the chevron wiggles (1.4s loop). Hidden for good after the first scroll of that slider.
- Nudge: the **first** slider on the page plays `.nudge` once when 60% visible, 400 ms later: the track slides about −44px and back over 1.1s (verified on cleaning). Skipped for reduced motion.
- Equal text heights: JS sets every `.ts__tx` in a slider to the tallest one's `min-height` on load, resize (150 ms debounce) and `fonts.ready`, so pictures line up.
- Reset: on load and `pageshow`, every `.slides`, `.qs__track` and `.bs__list` is scrolled to 0 and dots reset (so a back navigation starts at step 1).

### 0.5 Back links

`.pk-back` / `.cl-back`: Montserrat 700 16px/22px black, 2px sand (`#c8943a`) underline via border-bottom, gap 12px 32px, margin about 48px 0 72px. No hover style.

---

## 1. `index.html` — ENSŌ Experience hub

Title "ENSŌ Experience · Guides, Manuals and Support". Document height 2106px (desktop, both cards closed).

### Sections

| # | Section | Desktop (1440) | Mobile (390) | Content slots |
|---|---|---|---|---|
| 1 | `.xh-head` intro | max-width 720, padding 72px 0 28px. Eyebrow, H1 Inter 800 48/52, one paragraph rgb(0 0 0/.72) | padding 40px 0 24px, H1 34/38 | Eyebrow "ENSŌ Experience"; H1 "Guides for your ENSŌ"; text. Merchant-editable |
| 2 | "Guides by device" (`h2.xh-devh` 36px + `.xh-list`) | Two stacked cards, gap 20, padding-bottom 96. Card: 1px line border, radius 28, white. Closed row is a 3-column grid `260px 1fr auto`, gap 32, padding 20/32/20/20, 235px tall: image box 260×195 (4/3, radius 20, `contain`), H2 Inter 800 32/38 + 15px/24px text (max 48ch), pill toggle | Row stacks: image 16/10 full width, H2 26/30, text, then the toggle left-aligned. Card 419px tall closed | Per card: image, name, one-line description, 2–3 app chips, "Open the app", 6 guide tiles (icon, title, subtitle, link). Merchant-editable blocks; nothing from Shopify product data |
| 3 | `.xapp` "The ENSŌ app" (`#app`) | Panel `#f5f3ef`, radius 28, padding 36, margin 64px 0 96px. Eyebrow, H2 Inter 800 36/42, paragraph (max 60ch), 4-column grid of white cards (radius 20, padding 22/20/24, 253×202), then pill button + small note in one row | padding 24/16, H2 28/33, cards 2×2 (radius 16), button then note stacked | Eyebrow "The ENSŌ app"; H2 "Register, update, fix and create"; text; 4 cards (icon, title, text, link); button "Open the ENSŌ app"; note "For ENSŌ 2026 and ENSŌ Diamond, made for the phone" |

Guide tiles inside an open card (`.xh__body`, padding 8/32/32):
- App strip `.xh__app`: `#f5f3ef`, radius 20, padding 14/16, one flex row: label "In the ENSŌ app" (Montserrat 700 12px, .08em, uppercase, **sand**), white pill chips (18px sand line icon + bold 14px label, hover border black), and "Open the app" (700 13px, underlined link) at the right. On ≤760 it becomes a column: chips are full-width rows (radius 14) with a sand "›" at the right.
- Tile grid `.xh__grid`: 3 columns ≥992, 2 columns ≤991, gap 12 (8 on mobile). Tile: `#f5f5f4`, radius 18, padding 20/22, 30px sand line icon (stroke 1.6), title Inter 800 18/24, subtitle 14/21 rgb(0 0 0/.66). Hover: background `#ecebe8` (0.2s).

### Behaviours

1. **Device cards are `<details class="xh">`**, closed on load. The whole summary row is the click target; the pill reads "Show guides +" / "Hide guides −" (Montserrat 700 12px, .1em, uppercase, 44px tall). No open/close animation.
2. **One open at a time**: a `toggle` listener closes the other card. Verified: open Diamond, click ENSŌ 2026 → Diamond closes. Clicking an open card closes it (both closed is allowed).
3. **Hash opens a card**: on load and on `hashchange`, `#diamond` or `#enso` opens that card and closes the other; the browser also scrolls to it. Verified `index.html#enso` on load and switching hash to `#diamond`. This is what every guide's "Back to ENSŌ Experience" link relies on. Clicking a card does not write the hash.
4. Hover states: guide tile background darkens; app chips and `.xapp__go` cards get a 1px black border (focus-visible on `.xapp__go` also draws a 2px sand outline).
5. No search on the page, although the search code and data are still shipped (see Problems).

### Links

| Element | Destination |
|---|---|
| Diamond chips | `app.html#diamond-register`, `app.html#diamond-updates`, `app.html#diamond-recipes`; "Open the app" → `app.html#diamond` |
| Diamond tiles | Quick start `quick.html` · Full manual `manual.html` · Pack the cup `packing.html` · Cleaning `cleaning.html` · Troubleshooting `manual.html#troubleshooting` · Software updates `app.html#diamond-updates` |
| ENSŌ 2026 chips | `app.html#enso-register`, `app.html#enso-recipes`; "Open the app" → `app.html#enso` |
| ENSŌ 2026 tiles | Quick start `enso.html#quick-start` · Full manual `enso.html` · Troubleshooting `enso.html#troubleshooting` · Flavour guide `../partner-v2/blog-flavors.html` · **Video guides `https://ensoshisha.com/pages/user-guide` (external .com site, new tab)** · Accessories `../partner-v2/accessories.html#enso` |
| App block cards | `app.html#register`, `app.html#diamond-updates`, `app.html#fix`, `app.html#recipes` |
| App block button | `app.html` |

### Responsive

Breakpoints 991 (summary stacks, tile grid 3→2, app grid 4→2, `.wrap` padding 40→16) and 760 (app strip to column, `.xapp` padding and type shrink). At 800 the layout is already the stacked "mobile" form with 2-column grids. No horizontal overflow at 390.

### Media

| File | Intrinsic | Shown | Note |
|---|---|---|---|
| `../pdp-v2/img/g-3q-right.jpg` | 1128×1400, 119 KB | 260×195 box, `contain` | belongs to the Diamond product folder, not `experience/img` |
| `img/enso-2026-cut.png` | 900×791, 342 KB | same box | PNG cut-out |

No `loading`/`width`/`height` attributes. LCP at 1440 is one of these two card images or the H1 text (the driver's observer reported the card image).

---

## 2. `quick.html` — Diamond quick start

Title "Quick start · ENSŌ Diamond". Document height 3564px at 1440.

### Sections

| # | Section | Desktop | Mobile | Content |
|---|---|---|---|---|
| 1 | `.xnav` | breadcrumb only | same | see 0.2 |
| 2 | `.qs__hero` | max-width 720, padding 48px 0 24px. Eyebrow, H1 Inter 800 48/52, 17px/27px line, then a "rule" line: 22px sand no-water icon + Montserrat 600 15px black | padding 28px 0 16px, H1 36/40 | Eyebrow "ENSŌ Experience · Diamond"; H1 "Quick start"; "Your first session in five steps."; rule "Keep the battery and its contacts dry." |
| 3 | `ol.qs` five step cards | Cards stacked, gap 18. Card: `#f5f5f4`, radius 28, padding 28/28/28/40, 2-column grid `1fr 1.15fr`, gap 40, vertically centred, 489px tall. Left: 40px black number circle (Inter 800 17px), H2 Inter 800 34/40, text 17/27 rgb(0 0 0/.74), max 40ch. Right: picture box 541×433 (5/4), radius 20, white | One column: text then picture; padding 20/16, radius 22, number 34px, H2 26/32, text 16/24, picture 326×408 (4/5) | Per step: number, heading, text, 2–4 slides |
| 4 | `.qs__more` | margin 32px 0 64px. Link Inter 800 20/26 with 2px sand underline + grey 15px line | same | "Read more in the full manual ›" / "Temperature in coals, profiles, the cap, cleaning and more" |
| 5 | `.cl-back` | one back link | same | "‹ Back to ENSŌ Experience" |

Step content:

| Step | Heading | Slides |
|---|---|---|
| 1 | Charge it | `before-charge.jpg`, `charge-in.jpg`, `charge-dots.jpg` |
| 2 | Pack the cup | `basket-empty.jpg`, `pack-layer1.jpg`, `pack-press.jpg`, `cup-filled.jpg` |
| 3 | Cup in, cap on | `chamber-empty.jpg`, `cup-in-by-hand.jpg`, `cap-on-press-pad.jpg`, `plate-fork-macro.jpg` |
| 4 | On your hookah | `hookah-adapter-two-hands.jpg`, `hookah-mount-two-hands.jpg`, `on-hookah-front.jpg` |
| 5 | Pre-heat, then your heat | two live screens: scene `qstart`, scene `qtimer` (see 0.3), each over `img/closed-start.jpg` |

### Behaviours

6. **Per-step carousel** (`.qs__pic--seq`): `.qs__track` is `position:absolute; inset:0; display:flex; overflow-x:auto; scroll-snap-type:x mandatory`, scrollbar hidden; each slide is `flex:0 0 100%`, `object-fit:cover`, snap centre.
7. **Dots** (`.qs__dots`, in the markup, bottom 12px, centred, gap 7): 8px circles rgb(0 0 0/.18); active is a 22×8 black pill, `transition:all .2s`. **Clickable**: click dot *j* → `track.scrollTo({left: j × clientWidth, behavior:'smooth'})`. Verified 0 → 541 → 1083. Active dot follows scroll (`round(scrollLeft / clientWidth)`).
8. **No autoplay**: `scrollLeft` unchanged after 6 s in view. No loop. No arrows. Advance by dot click, touch swipe, or trackpad/shift-wheel horizontal scroll; a plain mouse has only the 8px dots.
9. **Step 5 live screens**: slide 1 plays `qstart`, slide 2 plays `qtimer`. Each runs only while its own slide is visible (IntersectionObserver). Verified frames: "Start Pre-heat" → "Pre-heating 6:59 275°C REMAINING" → "260° ADJUST TEMP" → "Pre-heating 6:53 260°C"; after clicking dot 2: "PRE-HEAT TIMER 09:00 MM:SS" with a "Turn" hint, then "Start Pre-heat".
10. **Step 5 caption pill** (`.qs__caps`, bottom 34px): white pill, Montserrat 700 12.5px, shadow. Shows "Start Pre-heat: 7 min · 275 °C" on slide 1 and "Set the pre-heat time" on slide 2, switched by the same scroll handler.
11. On load/`pageshow` all tracks reset to slide 1.

### Links

`index.html#diamond` (breadcrumb and back link), `manual.html` ("Read more in the full manual ›"). Nothing else.

### Responsive

Breakpoint 767 only (card to one column). At 800 the card stays 2-column and is tight: card 768×338, picture 353×282. `.wrap` padding 16 at ≤991. No overflow at 390.

### Media

14 files from `img/s/` (1.20 MB) + `img/closed-start.jpg` (148 KB, used twice). Landscape slides are 1000×747, portrait ones 746×1000, `on-hookah-front.jpg` 713×1000; all are cropped by `object-fit:cover` into a 5/4 box (desktop) or 4/5 box (mobile). All 14 slide images have `loading="lazy"` and empty `alt`. **LCP at both 1440 and 390 is `img/s/before-charge.jpg`, which is lazy-loaded**: make the first slide of step 1 eager with fetchpriority high.

### Design values

Eyebrow as rendered: Montserrat 500 16px, letter-spacing 3.2px, uppercase, black (see Problems: the page's own sand 13px style loses to the theme). Step number 40px circle. Card background rgb(245 245 244). Dots as in behaviour 7.

---

## 3. `packing.html` — How to pack the cup

Title "How to pack the cup · ENSŌ". Document height 6028px at 1440. Sections other than the hero use `.pk-sec{max-width:1200; padding:56px 40px 8px}` **inside** `.wrap`, so their content is inset a further 40px (x=200, 1040 wide) compared with the hero (x=160, 1120 wide).

### Sections

| # | Section | Desktop | Mobile | Content |
|---|---|---|---|---|
| 1 | `.xnav` | breadcrumb + chips, "Pack the cup" current | chips scroll | see 0.2 |
| 2 | `.pk-hero` | 2 columns 1fr/1fr, gap 48, padding 64px 0 48px. Left image 536×402 (4/3, radius 28, cover, `object-position:100% 50%`). Right: eyebrow, H1 Inter 800 44/48, text (max 52ch), three outline pills (1px line, radius 999, 14px, padding 6/14) | stacked, image first 358×269, H1 32/36 | Image; eyebrow "ENSŌ Experience · Guide"; H1 "How to pack the cup"; intro; facts "10–15 g", "Basket or flat screen", "Default 7 min · 275 °C" |
| 3 | "Touching or not: two meshes" | H2 Inter 800 36/42, lead 17/27 (max 68ch), then `slider--grid --n:2`: two columns 504px, picture 504×630 | H2 28/34; one-per-view scroller with dots + swipe hint | Slide 1 "Flat screen: in contact" (`flat-screen.jpg`); slide 2 "Basket mesh: off the walls" (`basket-empty.jpg`) |
| 4 | "Pack it" | `slider--grid --n:3`, three columns 325px, then a note | scroller + dots | "Mix the tobacco" (`pack-layer1.jpg`), "First layer, pressed a little" (`pack-press.jpg`), "Second layer to the edge" (`cup-filled.jpg`); note "**One flavour?** One layer, semi-dense, to the tab or to the edge of the basket." |
| 5 | "Mix in layers" | `.pk-heatmap`: grid `400px 1fr`, gap 32. Left an inline SVG diagram, right a lead paragraph. Then a note | one column, SVG max 400 centred | SVG (see below); paragraph; note "Most people smoke one flavour…" |
| 6 | "Find your heat" (`#heat`, `.pk-heat`) | padding 72px 40px. H2 Inter 800 40/46, lead 17px. `.hf2` grid `520px 1fr`, gap 56: left the device frame 520×520 (radius 22), right two button groups, a 3-column result row, a note | padding 48/16, H2 30/36; one column: device 326×326, then questions; results 2 columns with Pre-heat spanning both | see 3.1 |
| 7 | "By tobacco" | `.pk-cards` 2 columns, gap 16. Card: 1.5px border rgb(0 0 0/.1), radius 22, padding 20/22; image 4/3 cover radius 14; H3 Inter 800 20/26; brands line Montserrat 600 13px `#8a5d17`; text 15.5/24; tip box `#f5f5f4` radius 12, 14/21 | one column | Card 1 "Virginia, blonde leaf" (`cup-filled.jpg`, "Starline, Fumari, Adalya"); card 2 "Burley, dark leaf" (`dark-leaf-packed.jpg`, "Darkside, MustHave, BlackBurn") |
| 8 | "Pre-heat and pace" | H2 + one lead paragraph, nothing else | same | text only |
| 9 | "If it tastes burnt" | `slider--grid --n:3` | scroller + dots | Slide 1 "Turn the dial down" with live screen scene `down`; slide 2 "Cap off, let it breathe" (`cap-off.jpg`); slide 3 "Cap back on" (`cap-on-press-pad.jpg`) |
| 10 | `.pk-back` | two back links | same | "‹ Back to the full manual", "‹ Back to ENSŌ Experience" |

Notes (`.pk-note`): background `#f6ecd9`, radius 14, padding 12/16, 16px/25px, max 68ch.

**Mesh choice**: on this page it is section 3, a plain two-item step grid. There is no interactive mesh picker here: the `.mpick__c` tab code is in the script but the page has no such elements (it belongs to `manual.html`).

**Layered-mix diagram** (section 5): inline SVG `viewBox="0 0 360 310"`, `role="img"` with a long `aria-label`. A dark cup outline (`#1d1b19`) filled with a vertical gradient `#e2614c` (bottom) → `#e7a35a` → `#f3dfb8` (top), a dashed divider, labels "Accent" (top, `#3a2a10`) and "Main flavour" (bottom, white) in Inter 800 17px, and six coral arrows: 2 from below (`.hu`), 2 from the left (`.hl`), 2 from the right (`.hr`). The arrows animate with CSS only: 1.6s ease-in-out infinite, each fading in while sliding toward the cup (up 8→−24px, sideways ±8→∓14px), with small delays. Off for reduced motion. The gradient id is `hg` (keep it unique if the section is ever repeated).

### 3.1 "Find your heat" picker

**Markup**: `.hf2` > `.mac > .dev > img + .lv` (the screen is filled by JS), then `.hf__q` with two `.hf__g` groups, a `<dl class="hf2__out" aria-live="polite">` and a note.

**Inputs** (buttons with `data-hf` / `data-v` and `aria-pressed`; one per group is pressed):

| Group label | `data-hf` | Options (`data-v`): label / small text | Default |
|---|---|---|---|
| Your tobacco | `leaf` | `virginia`: Virginia / Blonde leaf · `dark`: Burley / Dark leaf, heavier · `mix`: A mix / Virginia and dark | virginia |
| How you like it | `str` | `soft`: Lighter / Smooth and long · `strong`: Stronger / More body | soft |

**Outputs**: `dd.hf2__pre` (Pre-heat), `dd.hf2__t` (Session heat, coral), `dd.hf2__prof` (Profile to try), plus the number on the device screen under the caption "SESSION HEAT".

**Logic** (inline JS):

```
BASE = {virginia:252, dark:270, mix:262}      PROF = {virginia:'Phoenix', dark:'Wraith', mix:'Default'}
t   = BASE[leaf] + (str==='strong' ? +5 : -5)
pre = '7 minutes at 275 °C (Default)';  prof = PROF[leaf]
if leaf==='dark' && str==='strong': pre='7 minutes at 290 °C'; prof='Oracle'
else if leaf==='dark':              pre='7 minutes at 280 °C'
// a third input "fl" (fruit | dessert | mint) exists in code, fixed at 'fruit' because the page has no buttons for it:
//   dessert: t -= 10;   mint: t = (leaf==='virginia' ? 235 : t-12), pre = '7 minutes at 255 °C, gentler'
t = round(t/5)*5
```

**Result table** (all six combinations clicked and read back from the page):

| Tobacco | Strength | Pre-heat | Session heat | Profile to try |
|---|---|---|---|---|
| Virginia | Lighter | 7 minutes at 275 °C (Default) | 245 °C | Phoenix |
| Virginia | Stronger | 7 minutes at 275 °C (Default) | 255 °C | Phoenix |
| Burley | Lighter | 7 minutes at 280 °C | 265 °C | Wraith |
| Burley | Stronger | 7 minutes at 290 °C | 275 °C | Oracle |
| A mix | Lighter | 7 minutes at 275 °C (Default) | 255 °C | Default |
| A mix | Stronger | 7 minutes at 275 °C (Default) | 265 °C | Default |

**Behaviour**
12. Clicking an option sets `aria-pressed` on its group, rewrites the three outputs at once, and the dial number counts from its current value to the target in 1° steps every 20 ms (255→275 takes 0.4 s). On load it counts 275 → 245. Verified mid-count: 255° → 257° after 100 ms.
13. Each click adds `.press` to the screen for 250 ms (coral ring pulse).
14. With reduced motion the number jumps straight to the target (from code).
15. The device screen is static otherwise: battery "100%", coral number, "SESSION HEAT". No scene loop, no hint pill.

**Styles**: group label Montserrat 700 12px, .08em, uppercase, `#777`. Option button Inter 700 17px/20px (16px on phones), padding 16/22 (12/14 on phones, `flex:1`), radius 16, 2px border `#e2ded7`, white; small line Montserrat 500 12.5px `#777`. Pressed: black fill and border, white text, small line white 70%. Hover: border black. Results: 2px black top rule, padding-top 14; `dt` Montserrat 700 11px .08em uppercase `#777`; `dd` Inter 800 18/23; session heat Inter 800 38/42 at ≥992 (30/34 below) in `#e2614c`. Note 14/21 grey: "A starting point. Turn the dial by taste: the harder you draw, the more heat you need."

### Other behaviours

16. Sliders as in 0.4. On desktop all three are static grids (no arrows). On phones each is a one-per-view scroller; verified dot 2 lights and the swipe hint disappears after the first scroll.
17. "If it tastes burnt" slide 1 plays scene `down` while in view (verified "265° 25:00 RUNNING", hint "Turn").
18. Hover on xnav chips (border black). No other hover states.

### Links

`index.html#diamond` (breadcrumb, back link), xnav chips (0.2), `manual.html` (back link). The page id `#heat` is the picker's anchor (no in-page link points at it; other pages may).

### Responsive

Breakpoints: 991 (hero stacks, `.wrap` 16px), 767 (sections 40/16, card grids to 1 column, sliders become scrollers, heat finder 1 column, heatmap 1 column), 992 (larger slider and picker type). **At 768–991 the heat finder is cramped**: still 2 columns (`440px 1fr`), the option buttons stack one per row and "7 minutes at 275 °C (Default)" wraps to five lines in a 60px column (screenshot `p-800-heat`).

### Media

| File | Intrinsic | Use |
|---|---|---|
| `../pdp-v2/img/new/g-bowl.jpg` | 2000×1125, 311 KB | hero, shown 536×402. Eager. **LCP** at 1440 and 390. Lives in the product page folder |
| `img/s/flat-screen.jpg`, `basket-empty.jpg`, `pack-layer1.jpg`, `pack-press.jpg`, `cup-filled.jpg` (×2), `dark-leaf-packed.jpg`, `cap-off.jpg`, `cap-on-press-pad.jpg` | 1000×747 or 746×1000, 66–131 KB | sliders (lazy) and tobacco cards (eager) |
| `img/closed-start.jpg` | 1200×1490, 148 KB | heat finder and "burnt" slide 1 |

Landscape 1000×747 photos are cropped hard into 4/5 portrait frames by `object-fit:cover` in the sliders.

---

## 4. `cleaning.html` — Cleaning

Title "Cleaning · ENSŌ Diamond". Document height 5653px at 1440. Sections are `.cl-sec{padding:56px 0 8px}` (40px 0 4px on phones), full `.wrap` width (x=160).

### Sections

| # | Section | Slider | Content |
|---|---|---|---|
| 1 | `.xnav` | | "Cleaning" current |
| 2 | `.cl-hero` | | max-width 720, padding 48px 0 8px. Eyebrow "ENSŌ Experience · Diamond"; H1 "Cleaning" Inter 800 48/52 (36/40 phones); text 17/27; three filled pills (`#f5f5f4`, radius 999, Montserrat 600 14px, padding 8/14): "Cup and mesh: every session", "Shaft: every few sessions", "Battery: never wet" |
| 3 | "After every session: the cup" | plain `.tslider`, `--n:4` (the only real slider on desktop: 3 visible + arrows) | Lead; steps "Let it cool, then lift it out" (`clean-01-lift-cup-out.jpg`), "Loosen around the edge" (`clean-00b-loosen-edge.jpg`), "Push it out from below" (`clean-02-push-mesh-out.jpg`), "Out in one piece" (`clean-03-out-in-one-piece.jpg`) |
| 4 | "Wash the cup and the mesh" | `slider--grid --n:3` | Lead; "Rinse" (`clean-04-rinse.jpg`), "Sponge or steel scrubber" (`clean-05-scrubber.jpg`), "Stuck? Soak it" (`clean-06-soak.jpg`); then the Cleaning Glove promo |
| 5 | "The cap" | `slider--grid --n:1` (one centred 820px column, picture 4/3, no number, text centred) | Lead; "Rinse all three parts" (`cap-parts-rinse.jpg`) |
| 6 | "Every few sessions: the shaft" | `slider--grid --n:3` | Lead; "Battery in, latch closed" (`clean-capoff-back-brush.jpg`), "Brush the shaft" (`clean-shaft-brush.jpg`), "Rinse from the top" (`ok-rinse-shaft.jpg`) |
| 7 | "Never" (the don't cards) | `slider--grid slider--never --n:2` | Lead "The battery and the contacts never get wet."; "No water in the battery bay" (`dont-water-bay.jpg`), "Keep the battery dry" (`dont-water-battery.jpg`) |
| 8 | `.cl-back` | | "‹ Back to the full manual", "‹ Back to ENSŌ Experience" |

Section heading H2 Inter 800 34/40 (28/34 phones); lead 16.5px/26px rgb(0 0 0/.72), max 62ch.

**Do/don't styling**: the page has no "do" variant. The two "Never" cards use `.slider--never`: the picture gets a 4px `#b3261e` outline (`outline-offset:-4px`, follows the 26px radius), the number circle turns `#b3261e`, the title turns `#b3261e`. No cross-out line, no icon. (The diagonal-strike `.slider--dont` and green `.st--ok` variants exist in the CSS but are not used on this page.) At desktop the two cards are 544px columns with 544×680 pictures.

**Cleaning Glove promo** (`a.cl-glove`, inside section 4): grid `120px 1fr`, gap 18, max-width 760, background `#f6ecd9`, radius 20, padding 14. Image 120×120 (88 on phones), radius 14. Title Inter 800 18/24 "Quicker with the ENSŌ Cleaning Glove", text 15/23, and "See the Cleaning Glove ›" in an `<em>` reset to `font-style:normal`, weight 700 (computed style confirmed normal). The whole block is one link; no hover style. In Shopify this should link to the Cleaning Glove product (title and image could come from the product).

### Behaviours

19. Section 3 slider at 1440: arrows work as in 0.4 (Next: 0 → 384 and disables; Prev back to 0). At 800: no arrows, no dots, only the swipe hint and native scrolling (2.2 slides visible). At 390: one per view, dots + hint.
20. First-slider nudge on scroll into view (verified, about −44px and back).
21. On phones every multi-slide block is a swipe scroller, including "Never" (its hint also reads "Swipe for the next step").
22. Hover on xnav chips only. No live screens on this page (the shared script is loaded but finds no `.lv`).

### Links

`index.html#diamond`, xnav chips (0.2), `manual.html`, and `../partner-v2/product.html#x-glove` (the glove promo; opens the accessory sheet by hash in the preview).

### Responsive

Breakpoints 991 / 767 as in 0.4. No overflow at 390.

### Media

13 files from `img/s/` (1.31 MB), all 746×1000 except `clean-06-soak.jpg` (1000×746), all `loading="lazy"`, empty `alt`. Plus `../partner-v2/sku/live-acc/cleaning-glove-1.jpg` (1200×1200, 223 KB, eager, shown at 120px). **LCP is the hero paragraph (text)** at both widths; the first slider's pictures start at y=839, just inside a 900px viewport.

---

## 5. `diamond.html` — Diamond guide (short)

Title "ENSŌ Diamond guide · ENSŌ Experience". Document height 13181px at 1440 (5220px of it is the pinned scene). Sections are `max-width:1600; padding:… 40px` (16px at ≤991), each with a 1px top rule. `html{scroll-behavior:smooth}` comes from the theme's base CSS, so in-page anchors scroll smoothly.

### Sections

| # | Section | Desktop (1440) | Mobile (390) | Content |
|---|---|---|---|---|
| 1 | `.xnav` | breadcrumb + chips, none current | same | 0.2 |
| 2 | `header.hero` | grid `5fr 7fr`, gap 24, padding 64/40/96, 790px tall. Left: brand line (Montserrat 500 22/28), H1 Inter 800 56/60, sub (max 34ch), link list. Right: product image centred, `min-height:70vh`, image `width:min(52vh,520px)` = 468×581 | one column, **image first** (`order:-1`), 273×339; H1 40/44; padding 24/16/48 | Brand "ENSŌ Diamond"; H1 "Start here"; sub; 6 list rows; `img/hero-3q.png` |
| 3 | `section.rail#quick-start` | padding 96px 0 80px. Head grid `5fr 7fr`: H2 Inter 800 44/50 left, one line right. Track: flex, gap 20, padding 0 40px 8px, cards `flex:0 0 min(560px,78vw)`. Dots row under it | H2 30/36, head stacks, cards 304px (78vw), track scrolls | H2 "Charge the battery first"; "Two things before the first session."; 2 cards |
| 4 | `section.fit[data-scene="heat"]` | 580vh tall; pinned 100vh scene: text stack left (5fr), device stage right (7fr) | text on top (250px), stage below | 5 steps + device with 7 screen SVGs. See 5.1 |
| 5 | `.divider` | 1px rule in a 1600 container | same | |
| 6 | `section.xp.xp--seat#hookah` | grid `5fr 6fr`, gap 64, padding 96/40. Left image 520×650 (4/5, radius 28, cover). Right: grey eyebrow, H2 Inter 800 44/50, text, numbered list | one column, image first, H2 30/36, padding 64/16 | Eyebrow "On your hookah"; H2 "Fits the stem you already have"; text; 4 steps (bold title + line); `img/s/on-hookah-front.jpg` |
| 7 | `section.xp.xp--cap#cap` | head (max 62ch) then 3-column grid, gap 24. Each figure: caption **above** the picture (bold 19/25 + 15/23 line), picture 437×547 (4/5), radius 14, 1px line border | one column, pictures full width | Eyebrow "Cap and cup"; H2 "Open, load, close"; text; Open (`cap-off.jpg`), Load (`cup-in-by-hand.jpg`), Close (`img/closed-start.jpg`) |
| 8 | `section.check#before` | padding 96/40/80. Head grid `5fr 7fr`. 3-column grid, gap 24: square image (437×437, cover, no radius), H3 Inter 800 24/30, list of 3 lines (15/23, 10px 0, 1px rules) | one column | H2 "Before the first session"; "Three things to know, and one to remember."; Heat (`cap-on-press-pad.jpg`), Water (`basket-empty.jpg`), Power (`charge-dots.jpg`), 3 bullets each |
| 9 | `section.xp.xp--air#air` | same 2-column layout as #hookah | stacked | Eyebrow "Airflow"; H2 "The plate sets the draw"; text; grey 14px note "The plate is hot during a session. Use the tool, not your fingers."; `img/s/plate-tool.jpg` |
| 10 | `section.xp.xp--manual#manual` | head + one pill button | same | Eyebrow "Full manual"; H2 "Every function, one chapter at a time"; text; button "Read the full manual" |
| 11 | `section.xp.xp--app#app` | copy grid `5fr 6fr` (eyebrow spans both; H2 left, text right), then a full-width image 1360×583 (21/9, radius 28, `object-position:50% 62%`) | copy stacks, image 4/3 | Eyebrow "Firmware"; H2 "Updates over USB‑C, from our website" (non-breaking hyphen `&#8209;`); text; `img/firmware-laptop.jpg` |
| 12 | `p.foot` + back links | grey 14px line, padding 0 40px 80px; then two back links in a 1200 container (inline styles) | same | "Questions at any point: support@ensoshisha.eu · The ENSŌ team" (plain text, not a link); "‹ The full manual", "‹ Back to ENSŌ Experience" |

Hero link list (`ul.entries`): rows with 1px rules, each an `<a>` with flex space-between: bold title left (Montserrat 700 18px; first row `.primary` 22px with a " ↓" added by `::after`, padding 20px 0), grey 14px note right-aligned. Hover: title underlined (offset 4px).

`.xp__steps`: CSS counter in a 28px outlined circle (1px line, 13px bold), title Montserrat 700 17px, line 15/23 rgb(0 0 0/.72), gap 16.

`.xp__eyebrow`: Montserrat 400 13px, letter-spacing .14em (1.82px), uppercase, `#666`. Note this page uses its own eyebrow class, so it is grey and small, unlike the other four pages.

`.xp__btn`: black pill, white Montserrat 700 13px, .1em, uppercase, padding 16/28, 48px tall; hover `#333`.

Rail cards (as rendered at 1440): 560×948, 1px line border, radius 12, **20px padding from the theme's `.card` rule** (see Problems), image 518×648 (4/5 cover), body padding 22/24/26: small grey number (700 13px), H3 Inter 800 26/32, text 15/24. Card 2 has a warning box (1px line, radius 6, padding 12/14, 14/22, 20px triangle icon): "Before the first use, pull the protective paper off the battery contacts."

### 5.1 The `.fit` scroll scene — exact behaviour

**Structure**

```html
<section class="fit" data-scene="heat" style="height:580vh">
  <div class="fit__sticky">                      <!-- position:sticky; top:0; height:100vh; overflow:hidden; grid 5fr/7fr -->
    <div class="fit__copy"><div class="stack"> 5 × <div class="step">h2 + p [+ small]</div> </div></div>
    <div class="fit__stage"><div class="stage-box">            <!-- overflow:hidden viewport, sized by JS -->
      <div class="stage" data-w="1099" data-h="1969">           <!-- transform-origin 0 0; moved/scaled by JS -->
        <img src="img/diamond-front.png" style="width:1099px;height:1969px">
        <div class="glow" id="ht-glow"></div>
        <div class="screen" id="ht-screen"> 7 × <img data-scr="…" src="ui/….svg"> <div class="glass"></div></div>
      </div></div></div>
  </div>
</section>
```

**It is pinned and scroll-scrubbed.** Progress `p = clamp(-rect.top / (rect.height − innerHeight), 0, 1)`: 0 when the section top reaches the viewport top, 1 when its bottom reaches the viewport bottom. At 1440×900 that is 4320px of scrolling (4.8 screens); at 390×844 about 4051px. One passive `scroll` listener, throttled with `requestAnimationFrame`, re-renders; `resize` re-fits. Nothing is time-based except CSS transitions on the text and the glow pulse. Scrolling back up reverses everything (verified). No snapping, no wheel hijack, no IntersectionObserver.

Before the pin (section entering): the scene is in its p=0 state (device whole, screen dark) and scrolls up like normal content. After p=1 it un-pins in the final state (Oracle) and scrolls away; the next section follows directly.

**Geometry**: the dial centre in `diamond-front.png` is (546, 1187), radius 264 (hard-coded `M.front.dial`). The screen is a 528px circle there; the glow is a 581px blurred coral radial gradient (`mix-blend-mode:screen`, blur 26px). `.glass` adds a highlight and vignette over the screen.

**Camera** (CSS transform on `.stage`: `translate(bw/2 − cx·zoom, bh/2 − cy·zoom) scale(zoom)`), interpolating with ease-out cubic between:
- `wide`: centre of the image, `zoom = min(bw/1099, bh/1969)` (whole device fits the box)
- `dial`: centre on the dial, `zoom = min(bw,bh) / (528 × 1.35)` (dial fills about 74% of the short side)

Stage box size `bw × bh`: desktop (≥992) = stage column width × 92% of viewport height (779×828 at 1440×900); below 992 = (viewport width − 32) × (viewport height − 280) (358×564 at 390×844, 768×620 at 800×900).

**Timeline** (same thresholds at every width):

| Progress p | Camera | Screen | Glow | Text step |
|---|---|---|---|---|
| 0 – 0.02 | wide: whole device (scale 0.42 at 1440, 0.29 at 390) | off (opacity 0) | 0 | 1 "Hold to switch on" |
| 0.02 – 0.16 | zooms to the dial, ease-out (scale 0.85 at p=.06; 1.09 final at 1440, 0.50 at 390) | fades in over p .10–.16 (0.5 at p=.13) showing `start.svg` | fades to 0.4 | 1 |
| 0.16 – 0.26 | dial close-up (stays for the rest) | `start.svg` | 0.4 | 1 |
| 0.26 – 0.30 | | `start.svg` | 0.4 | 2 "Click to start" |
| 0.30 – 0.36 | | `quick_preheat_timer.svg` | 0.4 | 2 |
| 0.36 – 0.58 | | `preheat.svg` ("Pre-heating 3:30 275°C REMAINING") | 0.7 and pulsing (`.is-pulsing`: scale 1→1.12, opacity .55→.9, 1.6s loop) | 3 "Pre-heating" |
| 0.58 – 0.76 | | `profile_default.svg` | 0.4 | 4 "Default runs AUTO" |
| 0.76 – 0.84 | | `profile_phoenix.svg` | 0.4 | 5 "Or pick a profile" |
| 0.84 – 0.92 | | `profile_wraith.svg` | 0.4 | 5 |
| 0.92 – 1 | | `profile_oracle.svg` | 0.4 | 5 |

Screen images switch by setting inline `opacity` 1/0 with no transition (hard cut). All state samples above were read from the live page at p = 0, .06, .13, .20, .28, .33, .45, .65, .80, .88, .97, 1.

**Text stack**: all steps are stacked in one place. The current one gets `.is-on` (opacity 1, in flow); the previous one gets `.was-on` and sits directly above it at 32% opacity, shifted up 22px; others are hidden (opacity 0, 24px down). Changes animate with `opacity/transform .45s cubic-bezier(.2,.8,.2,1)`. Step H2 Inter 800 44/50 (30/36 below 992), text 16/28 rgb(0 0 0/.72) max 34ch (15/24 on phones); step 5 has a 13px grey `<small>`: "Profiles return to their defaults when the battery is removed".

**Desktop vs mobile**

| | ≥992 | ≤991 (800 and 390 checked) |
|---|---|---|
| Pinned box | 100vh, 2 columns: text vertically centred at left, stage right | 100vh, 2 rows: text at the top (`.fit__copy` min-height 250, padding-top 24), stage below at y≈270 |
| Previous step ghost | visible above the current step | positioned above the copy area, i.e. off the top of the pinned box: effectively only the current step shows |
| Stage | 779×828 | full width × (vh − 280) |
| Timeline | identical | identical |

**Header interaction**: the theme header is `position:fixed` (79px desktop, 64px mobile) and hides on scroll down (`site-header--hidden`). The scene pins at `top:0` and this page sets `--header-height:0px`. When the user scrolls **up** inside the scene the header slides back in and covers the top 79px of the pinned scene (screenshot `d-d-fit-045-back`). Decide whether the pin should offset by the header height when the header is visible.

**Unused code**: the script also defines scenes `charge`, `power` and `air` (battery slide-in, plate rotation), with no matching sections on the page. `window.__exp[i].set(p)` is a debug hook that forces a progress value.

### Behaviours

23. Hero "Quick Start ↓" → `#quick-start`: smooth scroll, lands with the rail at the very top (no `scroll-margin` on `#quick-start`, so its heading sits under the fixed header if the header is showing).
24. Hero "Firmware app" → `#app`, which has `scroll-margin-top:90px` (verified on load with the hash: section top at y=90). `#hookah`, `#cap`, `#manual`, `#air` also have 90px; `#quick-start` and `#before` have none.
25. Rail: native horizontal scroll, `scroll-snap-type:x mandatory`, snap start, scrollbar hidden. Dots (6px, black when active) follow scroll: the active one is the last card whose left edge is ≤ `scrollLeft + 10`. **Dots are not clickable** and are `aria-hidden`.
26. At 1440 the two 560px cards fit (track 1440/1440), so the rail **does not scroll on desktop** and the dots never change; there is an empty area to the right of card 2. On 390 the track is 660 wide in 390; note that with two 304px cards the maximum `scrollLeft` is 270, which never satisfies "card 2 left edge ≤ scrollLeft + 10" (294 > 280): **dot 2 never lights even when fully swiped** (verified: "270 dots is-on,-").
27. Pinned scroll scene, 5.1.
28. Glow pulse during the pre-heat range only (CSS animation toggled by class).
29. Hover: hero list titles underline; `.xp__btn` background `#333`; xnav chips border.
30. No sliders, no accordions, no live `.lv` screens on this page.

### Links

| Element | Destination |
|---|---|
| Breadcrumb, last back link | `index.html#diamond` |
| xnav chips | as 0.2 |
| Hero list | `#quick-start` · `manual.html` · `../partner-v2/faq.html` · `../partner-v2/warranty.html` · `mailto:support@ensoshisha.eu` · `#app` |
| "Read the full manual", "‹ The full manual" | `manual.html` |

Page ids to keep: `quick-start`, `hookah`, `cap`, `before`, `air`, `manual`, `app` (plus `rail`, `ht-glow`, `ht-screen` used by JS).

### Responsive

Single breakpoint at 991 for everything (hero, rail head, scene, 2-column sections, grids). At 800 it is the stacked "mobile" layout. JS uses `innerWidth < 992` to match. No overflow at 390.

### Media

| File | Intrinsic | Size | Use |
|---|---|---|---|
| `img/hero-3q.png` | 1856×2304 | **1.7 MB** | hero, shown 468×581 (273×339 mobile). **LCP** |
| `img/diamond-front.png` | 1099×1969 | **1.6 MB** | scene stage (needs transparency? it is shown on white: a JPEG/WebP/AVIF would do, but see house rule on images) |
| `ui/start.svg`, `preheat.svg` | 384×384 | 9 KB, 15 KB | text converted to paths |
| `ui/quick_preheat_timer.svg`, `profile_default.svg`, `profile_phoenix.svg`, `profile_wraith.svg`, `profile_oracle.svg` | 384×384 | 105–106 KB each | live `<text>` with **Inter and a mono font embedded as base64 woff2** inside each SVG (2 `@font-face` each) |
| `img/firmware-laptop.jpg` | 2000×1493 | 339 KB | #app |
| `img/closed-start.jpg` | 1200×1490 | 148 KB | #cap "Close" |
| `img/s/` × 9 | 1000×747 / 746×1000 / 713×1000 | 0.65 MB | rail, sections |

No image on this page has `loading="lazy"`: all 20 images (4.9 MB) load up front, including the seven screen SVGs.

---

## 6. Cross-page deep links and anchors (all five pages)

Targets were checked against the handoff files.

| Link | Used on | Target exists? |
|---|---|---|
| `index.html#diamond` | quick, packing, cleaning, diamond (breadcrumb + back) | yes, `<details id="diamond">`; opened by JS |
| `index.html#enso` | (ENSŌ 2026 pages) | yes, `<details id="enso">` |
| `index.html#app` | none of the five | id exists on the app block |
| `quick.html`, `packing.html`, `cleaning.html`, `manual.html`, `enso.html` | hub tiles, xnav | files exist |
| `manual.html#troubleshooting` | hub tile, xnav on packing/cleaning/diamond | yes (`id="troubleshooting"`) |
| `manual.html#charge-while-smoking` | README example; not linked from these five | yes (id exists) |
| `enso.html#quick-start`, `enso.html#troubleshooting` | hub | yes (ids exist); `enso.html#q-packing` (README) also exists |
| `app.html#diamond-updates` | hub (×3), xnav on packing/cleaning/diamond | handled by the app's hash router, not an element id |
| `app.html#diamond-register`, `#diamond-recipes`, `#diamond`, `#enso-register`, `#enso-recipes`, `#enso`, `#register`, `#fix`, `#recipes` | hub | same router |
| `packing.html#heat` | not linked from these five | id exists |
| `diamond.html#quick-start`, `#app` | diamond hero | ids exist |
| `../partner-v2/faq.html`, `warranty.html`, `blog-flavors.html` | diamond hero, hub | files exist |
| `../partner-v2/accessories.html#enso` | hub | filter hash handled by that page's JS |
| `../partner-v2/product.html#x-glove` | cleaning | id `x-glove` is in `acc-sheet.js`; becomes a product URL in Shopify |
| `https://ensoshisha.com/pages/user-guide` | hub "Video guides" | external, old .com site, `target="_blank" rel="noopener"` |
| `mailto:support@ensoshisha.eu` | diamond hero | |

`app.html` router (`ensoDeep()`, runs on load and `hashchange`): lower-cases the hash; `^(diamond|enso)-(.+)$` picks the device first; bare `diamond`/`enso` opens that device's home; the rest maps through `{register, warranty, profile → register; updates, software, notify → sw; fix, troubleshooting, troubleshoot → fix; recipes, blends → recipes; howto, guides → howto; search → search}`. So every hash listed above resolves. In Shopify the hub and guides must keep emitting exactly these hashes against wherever the app page lives.

No page here reads or writes `localStorage`/`sessionStorage`. The only hash-driven behaviour on the five pages is the hub's `#diamond` / `#enso`.

## 7. Image folders

| Folder | Files | Size | Used by (experience pages) | Used by the five audited pages |
|---|---|---|---|---|
| `experience/img/` | 5 | 4.06 MB | index, quick, packing, diamond, manual, app | `closed-start.jpg` (quick, packing, diamond), `enso-2026-cut.png` (index), `hero-3q.png`, `diamond-front.png`, `firmware-laptop.jpg` (diamond) |
| `experience/img/s/` | 51 JPG | 4.71 MB | quick, packing, cleaning, diamond, manual, app (all 51 are referenced somewhere) | 32 distinct files: quick 14, packing 8, cleaning 13, diamond 9 |
| `experience/img/m/` | 1 (`hero-front-start.jpg`) | 0.08 MB | manual only | none |
| `experience/img/manual/` | 22 | 0.91 MB | enso, app | none |
| `experience/ui/` | 7 SVG | 0.54 MB | diamond, manual, app | diamond only (scroll scene) |
| `experience/ui/hq/` | 22 PNG | 2.51 MB | manual, app | none |

Also pulled from outside `experience/`: `../pdp-v2/img/g-3q-right.jpg` (hub), `../pdp-v2/img/new/g-bowl.jpg` (packing hero), `../partner-v2/sku/live-acc/cleaning-glove-1.jpg` (cleaning).

Per-page image weight (page-specific only): index 0.46 MB, quick 1.35 MB, packing 1.23 MB, cleaning 1.53 MB, diamond 4.9 MB.

## 8. What has to change for Shopify page templates

1. **Asset paths.** Every `img/…`, `img/s/…`, `ui/…` and the three `../pdp-v2` / `../partner-v2` paths are relative to the HTML file. In a theme they become `{{ 'file.jpg' | asset_url }}` or Files URLs. Theme `assets/` is flat (no subfolders), and names repeat meaning across folders (`ui/preheat.svg` vs `ui/hq/preheat.png`, `img/s/…`): prefix them (for example `exp-s-before-charge.jpg`) or use Files. With section image pickers the README rule "use the files as they are" still holds; Shopify's CDN can serve resized `image_url` widths of the same file.
2. **Paths inside JS.** None on these five pages: the live-screen script builds everything from inline HTML strings and inline SVG; `diamond.html`'s script only reads `<img>` tags already in the markup. So the scripts can move to asset files unchanged as long as the markup keeps its classes, `data-scene`, `data-scr`, `data-hf`/`data-v`, `data-w`/`data-h` and the ids `rail`, `ht-glow`, `ht-screen`.
3. **Inline scripts.** Move to theme assets and load with `defer` only on these templates. They currently run at parse time at the end of `<main>` (they query the DOM immediately), so they must load after the markup (defer is fine) and should re-init on `shopify:section:load` in the theme editor. The shared bundle should be split: `.lv` engine + heat finder + sliders are needed here; mesh tabs, chapter bar, dial lab, box picker belong to the manual. On `packing.html` the slider arrows are wired twice (an older standalone snippet plus the shared one, with no `_wired` guard on the first): harmless today because every slider there is a grid on desktop, but a real slider would move two slides per click.
4. **Inline CSS.** Each page carries its own `<style>` blocks: 8–15 KB on index/diamond, but about 70–80 KB on quick, packing and cleaning because they embed the whole manual stylesheet. Extract one shared `experience.css` plus small per-page parts, and drop the unused manual rules.
5. **Class-name collisions with the theme** (already visible in the handoff, where the old theme CSS is loaded):
   - `.eyebrow`: the theme's `.eyebrow:not(.product-block)` (Montserrat 500 16px, .2em, `--color-accent`) outranks the page's `.eyebrow` (sand `#c8943a`, 700 13px, .08em). What renders on index, quick, packing and cleaning is the theme version: 16px, 3.2px spacing, black.
   - `.card`: the theme adds `padding:20px` and a raised background to the rail cards on `diamond.html`.
   - Also generic and at risk: `.hero`, `.pill`, `.wrap`, `.nav`, `.slider`, `.slide`, `.step`, `.stage`, `.screen`, `.check`, `.foot`, `.divider`, `.rail`. Namespace them in the rebuild and decide which rendering is the approved one.
6. **Fonts.** Google Fonts links per page (0.1). The live screens need Inter 500/600/700/800 and JetBrains Mono 400; `packing.html` requests only Inter 800 (see Problems). The README says fonts come from the theme: Inter and JetBrains Mono are additions for these pages and need to be loaded (self-hosted in assets is best).
7. **Links.** Replace relative `.html` links with page URLs while keeping every hash in section 6. `product.html#x-glove` → the Cleaning Glove product URL. `index.html#diamond` → the hub page URL + `#diamond`.
8. **Content model.** Everything here is editorial (no product, price or cart data; no `data-cart` buttons). Sensible section schema: step cards / slides as blocks (image, title, text), the hub's device cards and tiles as blocks, the heat-finder numbers as section settings or a JSON setting so the client can retune them, scene progress thresholds left in JS.
9. **Page wrapper.** The pages rely on `main.enso-pdp` only for cart-bar offsets that do not exist here; the nested `<main class="wrap">` should become a `div`. The "Welcome gift" tab is explicitly suppressed on `/experience/` paths by the theme script (`/\/experience\//.test(location.pathname)`): the new URLs (`/pages/…`) will not match, so that rule needs a template-based condition.
10. **Sticky/pinned scene vs header**: see 5.1; pick an offset rule once the new header's behaviour is fixed.

## 9. Problems and open questions

| # | Page | Issue |
|---|---|---|
| 1 | index, quick, packing, cleaning | Eyebrow renders in the theme style (16px, black, 3.2px spacing), not the page's own sand 13px style. `diamond.html` uses a third style (grey 13px). Which one is approved? |
| 2 | diamond | Rail cards pick up 20px padding from the theme `.card` rule; the page CSS intends edge-to-edge images. Which is approved? |
| 3 | diamond | Fixed header covers the top 79px of the pinned scene whenever it reappears on scroll up |
| 4 | diamond | Rail dots: never change on desktop (nothing to scroll) and dot 2 never activates on mobile (threshold bug). Cards are 948px tall at 1440 with empty space beside them. Keep as a rail, or make it a 2-column grid on desktop? |
| 5 | diamond | Scene screens show battery 36% (`start.svg`) then 82% (pre-heat and profiles), and a charging bolt only on the first; the `.lv` screens elsewhere follow "battery always 100%". Profile screen reads "Wraith 9 min · 275 °C". Confirm these SVGs are final |
| 6 | diamond | `hero-3q.png` (1.7 MB) is the LCP image and `diamond-front.png` is 1.6 MB; nothing is lazy. 4.9 MB of images on first load. Five of the SVGs carry embedded base64 fonts (105 KB each). Ask the client for web-weight versions, or serve Shopify-resized formats of the same files |
| 7 | diamond | Content width 1600/40px vs `.xnav` and back links at 1200: left edges at 40, 160 and 144px. xnav has no current chip here and the page is not in the chip row or the hub tiles (only reachable by direct URL?). Confirm whether `diamond.html` is still a live page |
| 8 | diamond | Copy says "Firmware app … Updates over USB-C from ensoshisha.eu, coming" and "No app to install", while the hub and xnav send "Software updates" to `app.html#diamond-updates`. Two different stories about updates |
| 9 | quick | No chip row in `.xnav` (the other three guides have it). Intentional? |
| 10 | quick | LCP image (`before-charge.jpg`) is `loading="lazy"`. Carousels have no arrows: a mouse user has only 8px dots. On step 5 the black dots sit on the black device photo and are almost invisible |
| 11 | quick, packing, cleaning | Meta description is the generic store line ("ENSŌ premium electric shisha: fire-free, cordless and magnetic…"), same on `diamond.html`. Only the hub has its own. Slide images have empty `alt` |
| 12 | packing | Lead says "Three taps" but there are two questions. The flavour question (fruit / dessert / mint) exists in the logic and in the copy of the "By tobacco" tip ("minty … around 235 °C") but has no buttons. Restore it or change the lead? |
| 13 | packing | Loads only Inter 800 and no JetBrains Mono, yet the heat-finder buttons (Inter 700), the live screen (Inter 500/600/700) and the "RUNNING" label (mono) need them: browsers fall back or synthesise. Faces actually loaded on the page: Inter 600 and 800 only, no JetBrains Mono |
| 14 | packing | Heat finder is cramped at 768–991 (5-line result, stacked buttons). `.pk-sec` sections are inset 40px more than the hero |
| 15 | packing, cleaning | Step text blocks get equal `min-height`, which pushes short paragraphs down and leaves uneven gaps between title and text across columns (visible in "If it tastes burnt" and cleaning slider 1) |
| 16 | cleaning | "Never" cards on phones show "Swipe for the next step"; dots are not tappable on any `.tslider` (they are on quick-start carousels): inconsistent |
| 17 | index | Dead code shipped: `window.XP_INDEX` (18.7 KB search index of 66 FAQ entries), the search handler and a typed-placeholder script, all for a `#xq` input that is not in the page. Do not port unless the search is coming back. |
| 18 | index | "Video guides" goes to `ensoshisha.com/pages/user-guide` (old live .com site) in a new tab. Needs a new target |
| 19 | index | ENSŌ 2026 image `alt` is "ENSŌ Shisha 2026 Edition"; elsewhere the product is "ENSŌ 2026 Edition" |
| 20 | all | House rules check: no reviews or stars in page content; no italics rendered (`<i>`/`<em>` are reset to normal); ENSŌ macron correct in all visible copy; no "free" claims; headings, eyebrows and buttons have no trailing full stop. Loox review CSS/JS from the old theme is still in every file's shell (21 mentions): do not carry it over |
| 21 | all | Nested `<main>` inside `<main>`; `.finger` element is in the markup but permanently `display:none!important`; `prefers-reduced-motion` paths exist for screens, nudge, arrows and counters but could not be exercised by the driver (NOT VERIFIED) |
| 22 | all | `ui/*.svg` are used only by `diamond.html`'s scroll scene (and by manual/app). The README's "animated screens come from the inline script" is true for the `.lv` screens; the README's "`ui/` folder" matters for the scroll scene. Both mechanisms must be kept if `diamond.html` stays |
