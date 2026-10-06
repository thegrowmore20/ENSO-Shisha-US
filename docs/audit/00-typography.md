# Typography audit (handoff HTML)

Measured with the browser's computed styles on every visible text element of 21 pages (all except the help app `experience/app.html`), at 1440 px and 390 px wide: about 4,100 elements per width. Sizes are in px; "→" is desktop → mobile. Line height is shown as a ratio of font size; letter spacing in em.

## 1. Summary

- **Two brand families:** Montserrat (body, UI, old-theme headings) and Inter (new headings, prices, numbers).
- **Two type systems are mixed.** Sections carried over from the old theme use Montserrat headings (weights 500–700). Sections written new for the handoff use Inter 800 with tight letter spacing (−0.02 to −0.03 em). The same heading text can appear in either depending on the section.
- **There is no single heading scale.** `h1` has 10 distinct styles, `h2` about 40, `h3` about 25. Heading level does not predict size: an `h2` ranges from 18 px to 64 px.
- **`h5` and `h6` are never used.** `h4` appears on one page only (a journal article).
- **Four pages have no `h1`:** home, devices, FAQ, support (their page titles are `h2`), which is an SEO and accessibility gap to fix in the theme. One article has two `h1`s.
- **Body copy** is Montserrat 400 at 14–17 px. The most common sizes across all text are 16, 15, 14, 18, 17 and 12 px.

## 2. Families and weights in use

| Family | Weights found | Elements (desktop) | Where |
|---|---|---|---|
| Montserrat | 400 (1,538), 700 (629), 600 (272), 500 (232), 900 and 1000 (11) | 2,682 | Body, links, buttons, labels, old-theme headings, header and footer |
| Inter | 800 (788), 700 (86), 500 (66), 400 (18), 600 (14) | 972 | New headings, prices, step numbers, the animated device screens |
| Roboto | 400, 700 | 490 | Body of the three journal articles only |
| JetBrains Mono | 400, 500 | 16 | Captions on the animated device screens in the Diamond manual |
| Arial | 400 | 2 | The sort dropdown on the devices page (browser default, unstyled) |

Notes:
- **Roboto** is not a brand font and is not shipped in the package. It comes from styles inside the article content, so it only renders where the visitor has Roboto installed. Decision needed: keep articles in Montserrat like the rest of the site.
- **Montserrat 900/1000** is requested for product-card prices (`.price__current`) and a few `strong` tags. No such weight is loaded, so the browser falls back to the heaviest available. The theme should use a real 700 or 600.
- **Italic:** 14 elements, all `em` tags inside the tobacco article. The client rule is no italic type, so article content needs `em` styled upright.
- **Font files in the package:** Montserrat 200, 300, 400, 500, 600 and Inter 600, each as woff2 and woff (the old theme's fonts). Inter 800 (the main heading weight) and Montserrat 700 are not among them: the pages pull those from Google Fonts at load time (`Inter 400–800`, `Montserrat 400–700`, `JetBrains Mono 400`). The theme should serve all of them from Shopify's font library instead, with no Google Fonts request.
- **Titillium Web** is also requested from Google Fonts (six styles, including italics) on every page checked, but no visible element uses it. It is dead weight and should not be carried over.

## 3. Headings as found

### h1 (18 elements, 10 styles)

| Style | Desktop → mobile | Used on |
|---|---|---|
| Inter 800, lh 1.0, ls −0.03 | 64 → 44 | Journal index |
| Inter 800, lh 1.05–1.07, ls −0.025/−0.03 | 56 → 40 | Warranty, Diamond guide |
| Inter 800, lh 1.07, ls −0.025 | 56 → 36 | Accessories, accessory product page |
| Inter 800, lh 1.08, ls −0.025 | 48 → 34 | Experience hub, Diamond manual, ENSŌ 2026 manual |
| Inter 800, lh 1.08, ls −0.02 | 48 → 36 | Quick start, Cleaning |
| Inter 600, lh 1.15, ls −0.03 (`.h-section`) | 48 → 30 | Article titles (three articles) |
| Inter 800, lh 1.09, ls −0.025 | 44 → 32 | Cart, Packing |
| Montserrat 700, lh 1.3 | 32 → 32 | Second `h1` inside the tobacco article body |
| Inter 800, lh 1.21, ls −0.025 (`.buy__title`) | 28 → 28 | Product title in the buy box (both product pages) |

### h2 (168 elements, about 40 styles): the main groups

| Style | Desktop → mobile | Used on |
|---|---|---|
| Inter 800, ls −0.03 (`.h-xl`) | 64 → 40 | Diamond page "Extras for your Diamond" |
| Montserrat 700 (`.banner__heading`) | 56 → 32 | Page banners: Devices, FAQ, Support |
| Inter 800, lh 1.12 | 52 → 30 | Chapter headings in both manuals (24 uses) |
| Inter 800, lh 1.08 (`.hero__h`) | 52 → 36 | Product page hero bands |
| Montserrat 500 (`.h1.video-hero-slider__heading`) | 48 → 32 | Home hero slides |
| Inter 800, lh 1.14 | 44 → 30 | Diamond guide sections (12 uses) |
| Inter 800 / Montserrat 700 (`.split__heading`) | 44 → 34 / 30 | "Design your perfect bowl", home "ENSŌ Experience" |
| Inter 800 (`.enso-h2`) | 42 → 42 | Home: "Made for the ritual", safety, journal, help (mobile size does not shrink) |
| Inter 800, lh 1.1–1.15 | 40 → 30 | Diamond page "An electric heater…", Packing "Find your heat", home Diamond row |
| Montserrat 600 (`.enso-aw__h`, `.contact-section__heading` uppercase) | 40 → 28 | Awards heading, Support "Get in touch" |
| Inter 800, lh 1.17 | 36 → 30 / 28 | Section headings on both product pages (12 uses), Packing, Experience hub |
| Montserrat 700 / 600 (`.h2`, `.theme-heading__heading`, `.faq-section__heading`) | 36 → 28 (Instagram: 36 → 36) | Home "Shop signature models", "Follow us on Instagram", FAQ |
| Inter 800, lh 1.18 | 34 → 26 / 28 | Quick start steps, Cleaning sections |
| Inter 800, lh 1.19 | 32 → 26 / 32 | Journal sub-headings, accessory sheet title |
| Inter 800, lh 1.2 | 30 → 26 | Warranty sub-headings |
| Montserrat 700, lh 1.25–1.3 | 23–24 → 20–24 | Headings inside article bodies |
| Montserrat 500 / Inter 500 | 18 → 18 | "Your cart" title in the cart drawer |

### h3 (254 elements, about 25 styles): the main groups

| Style | Desktop → mobile | Used on |
|---|---|---|
| Inter 800 | 38 → 24 | Manual "Pre-heat time" |
| Inter 800 (`.h2.feature-row__heading`) | 36 → 28 | ENSŌ 2026 "Coal-Free Comfort" rows |
| Inter 800, lh 1.21 | 28 → 22 | Diamond feature slider captions |
| Inter 800, lh 1.23 | 26 → 20 | Manual sub-sections (29 uses) |
| Inter 800, lh 1.23 | 26 → 26 | "Before and after you buy" cards, Diamond guide |
| Inter 600 / Montserrat 600 | 24 → 20 | Award titles |
| Inter 800 | 24 → 24 | Diamond guide checklist |
| Montserrat 600 (`.contact-form-wrap__heading`) | 24 → 24 | Support "Contact Us" |
| Inter 800, lh 1.27 | 22 → 22 | Home safety cards |
| Inter 800 | 20 → 17 / 20 | ENSŌ 2026 manual steps, Packing |
| Inter 700 | 19 → 19 | Warranty "Covered / Not covered" |
| Inter 800, lh 1.33 | 18 → 15 | Accessory card titles (78 uses) |
| Montserrat 500 (`.h-feature.product-card__title`) | 18 → 18 | Old-theme product cards (home, devices) |
| Montserrat 600–700 | 17.9–18.4 → same | Headings inside article bodies |
| Inter 800, lh 1.38 | 16 → 16 | Accessory carousel card titles on product pages |
| Inter 800, lh 1.47 | 15 → 15 | Accessory sheet block titles ("What it is", "Why") |
| Montserrat 600, uppercase, ls 0.12 | 12 → 12 | Warranty "Return address" label |

### h4, h5, h6

| Tag | Style | Used on |
|---|---|---|
| h4 | Montserrat 700, 16.8 px, lh 1.65 | Flavour names in the flavours article (10 uses) |
| h4 | Montserrat 600, 11.5 px, uppercase (`.enso-tag`) | Tag labels in the same article (10 uses) |
| h5 | not used | |
| h6 | not used | |

## 4. Proposed heading scale for the theme (h0 to h6)

The HTML has no scale to copy, so this is a consolidation of what it actually uses, as `.h0`–`.h6` classes independent of the tag. All Inter 800, letter spacing −0.025 em, unless a section listed in section 3 uses Montserrat.

| Class | Desktop | Mobile | Line height | Covers (from the HTML) |
|---|---|---|---|---|
| `.h0` | 64 | 44 | 1.0–1.06 | Journal title, "Extras for your Diamond" (that one is 40 on mobile) |
| `.h1` | 56 | 40 | 1.07 | Page titles: Warranty, Diamond guide; Accessories (36 on mobile); page banners (Montserrat 700, 32 on mobile) |
| `.h2` | 48 | 34 | 1.08 | Experience page titles (34–36 on mobile); manual chapters (52 → 30); product hero bands (52 → 36); home hero (Montserrat 500, 48 → 32) |
| `.h3` | 44 | 30 | 1.1–1.14 | Cart and Packing titles (32 on mobile), Diamond guide sections, large banners; also the 40–42 px home and product headings |
| `.h4` | 36 | 28 | 1.17–1.2 | Standard section heading on product pages (30 on mobile), Packing, FAQ, home old-theme headings; the 30–34 px sub-headings |
| `.h5` | 26 | 20 | 1.23 | Card and sub-section headings (some stay 26 on mobile); 22–28 px feature captions |
| `.h6` | 18 | 16 | 1.33 | Card titles (accessory cards go to 15), 15–20 px small headings |

**Important:** a seven-step scale cannot reproduce every size in the HTML exactly. The "Covers" column lists where the HTML deviates (for example the same 56 px title is 40 px on mobile on one page and 36 px on another). To match the HTML exactly, each section keeps its own size where it differs from the scale; the scale is the default, not a replacement. If you prefer strict consistency over exact match in those spots, say so and the deviations get dropped.

## 5. Paragraphs and body text

`<p>`: 406 elements in page content, 42 distinct styles. Main ones:

| Style | Desktop → mobile | Used for |
|---|---|---|
| Montserrat 400, 14 px, lh 1.57 (`.sub`) | 14 → 14 | Accessory card descriptions (78 uses) |
| Montserrat 400, 15 px, lh 1.6 | 15 → 15 | Standard body copy in new sections (72 uses) |
| Montserrat 400, 16 px, lh 1.75 | 16 → 12.5 | Hero sub-lines (`.hero-line`) and old-theme default paragraph |
| Montserrat 400, 16.5 px, lh 1.52 | 16.5 → 14.5 | Manual body copy |
| Montserrat 400, 15 px, lh 1.7 | 15 → 15 | Product page section intros |
| Montserrat 400, 17 px, lh 1.59 | 17 → 17 | Guide lead paragraphs |
| Montserrat 400, 16 px, lh 1.5 (`.body-text`) | 16 → 16 | Old-theme body class (footer tagline etc.) |
| Roboto 400, 15.2–17 px, lh 1.65–1.7 | same | Article bodies (see Roboto note) |

Base `body` size is 16 px Montserrat 400 with line height 1.75 (old theme default).

## 6. Other tags

| Tag / role | Style | Desktop → mobile |
|---|---|---|
| `li` (content) | Montserrat 400, 15 px, lh 1.47–1.6 | 15 → 15 |
| `a` chip links (Experience sub-nav) | Montserrat 500, 14 px | 14 → 14 |
| `summary` (accordions on product pages) | Montserrat 700, 16 px, lh 1.75 | 16 → 16 |
| `summary` (FAQ on ENSŌ 2026 manual) | Montserrat 500, 17 px | 17 → 17 |
| `summary` (home "Made for the ritual") | Montserrat 700, 18 px | 18 → 18 |
| FAQ question buttons (`.enso-faq-q`) | Montserrat 600, 16 px | 16 → 16 |
| `label` (forms) | Montserrat 500, 14 px | 14 → 14 |
| `input`, `textarea` | Montserrat 400, 15–16 px (footer email 14 px) | same |
| `small` | Montserrat 400, 13–13.5 px | 13 |
| `dt` / `dd` (spec lists) | Montserrat 700 / 400, 15 px, lh 1.47 | 15 → 15 |
| `b` (step leads in guides) | Inter 800, 21 px, ls −0.01 | 21 → 17 |
| Prices on new cards (`.price`) | Inter 800, 20 px, ls −0.02 | 20 → 17 |
| Prices on old-theme cards (`.price__current`) | Montserrat "1000", 18 px | 18 → 18 |
| `td` / `th` (article tables) | Roboto 400 / 700, 14.7–15.2 px | same |

## 7. Buttons, pills, eyebrows and labels

| Element | Style | Desktop → mobile |
|---|---|---|
| Old-theme button (`.btn`, e.g. "Shop now", "Explore the system") | Montserrat 500, 16 px, capitalised | 16 → 15 |
| New pill button (`.pill`, e.g. "Pre-order", "Go to cart", "Shop accessories") | Montserrat 700, 12–15 px, uppercase, ls 0.1 | same |
| Card "Add to cart" (`.add`) | Montserrat 700, 12 px, uppercase, ls 0.08 | 12 |
| Pack-size option buttons ("2-pack") | Montserrat 600, 12 px, ls 0.04 | 12 |
| Filter tabs ("All", "ENSŌ", "Diamond") | Montserrat 700, 13 px, uppercase, ls 0.06 | 13 |
| FAQ tabs (`.faq-tab`) | Montserrat 700, 13 px, ls 0.04 | 13 |
| Old-theme eyebrow (`.eyebrow`, footer column titles) | Montserrat 500, 16–18 px, uppercase, ls 0.2 | same |
| Device badge on cards (`.fits`) | Montserrat 700, 12 px, uppercase, ls 0.08 | 12 → 10 |
| Chapter number ("01 · Start") | Inter 800, 14 px, uppercase, ls 0.12 | 14 |
| USP labels ("No fire") | Montserrat 600, 12 px, uppercase, ls 0.08 | 12 |
| "Welcome gift" tab | Montserrat 600, 12 px, uppercase, ls 0.12 | 12 |

Two button systems exist side by side: the old theme's capitalised 16 px button and the new uppercase letter-spaced pill. Both must be supported to match the HTML.

## 8. Header and footer

| Element | Style |
|---|---|
| Header nav links | Montserrat 400, 18 px, lh 1.4 |
| Footer column titles | Montserrat 500, 18 px, uppercase, ls 0.2 |
| Footer links, contact lines | Montserrat 400, 16 px, lh 1.4 |
| Footer tagline | Montserrat 400, 16 px, lh 1.5 |
| Footer bottom links | Montserrat 400, 14 px |
| Newsletter label | Montserrat 600, 12 px, uppercase, ls 0.12 |
| Newsletter input / button | Montserrat 400, 14 px / Montserrat 700, 11 px uppercase, ls 0.08 |

## 9. Heading tags per page

| Page | h1 | h2 | h3 | h4 |
|---|---|---|---|---|
| Home (`partner-v2/index`) | 0 | 13 | 18 | 0 |
| ENSŌ 2026 (`enso`) | 1 | 11 | 12 | 0 |
| Diamond (`pdp-v2/index`) | 1 | 13 | 30 | 0 |
| Devices | 0 | 2 | 2 | 0 |
| Accessories | 1 | 3 | 42 | 0 |
| Accessory product page | 1 | 3 | 42 | 0 |
| Cart | 1 | 1 | 0 | 0 |
| FAQ | 0 | 3 | 0 | 0 |
| Support | 0 | 3 | 1 | 0 |
| Warranty | 1 | 5 | 3 | 0 |
| Journal index | 1 | 3 | 0 | 0 |
| Article: electronic | 1 | 16 | 30 | 0 |
| Article: flavours | 1 | 12 | 14 | 10 |
| Article: tobacco | 2 | 12 | 3 | 0 |
| Experience hub | 1 | 5 | 0 | 0 |
| Quick start | 1 | 6 | 0 | 0 |
| Packing | 1 | 8 | 2 | 0 |
| Cleaning | 1 | 6 | 0 | 0 |
| Diamond guide | 1 | 13 | 5 | 0 |
| Diamond manual | 1 | 18 | 31 | 0 |
| ENSŌ 2026 manual | 1 | 10 | 6 | 0 |

Counts include one `h2` per page for the cart drawer title ("Your cart"), and on accessory pages the hidden detail-sheet headings.

## 10. Decisions needed

1. **Scale vs exact match:** adopt the `.h0`–`.h6` scale in section 4 as the default with per-section sizes where the HTML differs (exact match), or enforce the scale strictly (more consistent, small visible differences)?
2. **Roboto in articles:** replace with Montserrat?
3. **Missing `h1` on home, devices, FAQ and support:** promote the page title to `h1` (no visual change)?
4. **Font weights to load:** the design needs Inter 800 and Montserrat 400, 500, 600, 700 at minimum. Each extra weight costs load time; Inter 500/600/700 and Montserrat 200/300 are barely used and could be mapped to the nearest loaded weight.
5. **Mobile sizes that do not shrink** (for example the home `.enso-h2` at 42 px on a 390 px screen): keep as in the HTML, or treat as an oversight?
