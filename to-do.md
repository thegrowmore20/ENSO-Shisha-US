# ENSO theme build: to-do

What to change in the theme (`ENSO Shisha V2`) so it matches the handoff HTML. The folder holds the old ENSO theme as the starting point (restored 2026-10-06); files nothing referenced were pruned the same day.

Every HTML page was driven in a browser at desktop and mobile widths. The findings are in `docs/audit/`:

| File | Covers |
|---|---|
| `00-typography.md` | Fonts, weights, sizes for every tag; proposed h0 to h6 scale |
| `01-global.md` | Header, menus, search, cart, footer, age gate, welcome popup |
| `02-home.md` | Home page |
| `03-diamond-pdp-cart.md` | ENSŌ Diamond product page, cart |
| `04-enso2026-devices-accessory-pdp.md` | ENSŌ 2026 product page, devices, accessory product page, accessory data model |
| `05-accessories-help-journal.md` | Accessories, FAQ, support, warranty, journal, articles |
| `06-experience-guides.md` | Experience hub, quick start, packing, cleaning, Diamond guide |
| `07-manuals-help-app.md` | Diamond manual, ENSŌ 2026 manual, help app |

- **Bring** means keeping the existing file and slimming it to what the HTML needs. **Rebuild** means rewriting it to match the HTML.
- **Status** values: `To do`, `In progress`, `Done`, `Skipped`. The **Decision** column in group D is for your answer.
- Suggested order: group A (items 1 to 11), then the home page, which pulls in items 12 to 17 and the building blocks it needs.

## A. Site-wide (shared by every page)

| # | Item | Old file | In the HTML? | Proposal | Status |
|---|---|---|---|---|---|
| 1 | Design tokens: colours, fonts, spacing, buttons, headings | `css-variables`, `base.css` | Yes | Bring, trimmed | Built, not yet previewed |
| 2 | Layout: skip link, meta tags, font loading | `theme.liquid`, `meta-tags` | Yes | Bring | Built, not yet previewed |
| 3 | Header with dropdown menus and mobile menu | `header`, `nav-dropdown`, `mega-menu`, `site-header.js` | Yes | Rebuild to match the HTML | Built, not yet previewed (search still links to the search page: item 11) |
| 4 | Footer | `footer`, `footer-social-icons`, `newsletter-signup-form` | Yes | Rebuild; fold `fix-footer-mobile` into it instead of a separate patch section | Built, not yet previewed |
| 5 | Cart drawer | `cart-drawer` section, JS and CSS | Yes | Bring, wired to the real cart | To do |
| 6 | Age-verification popup | `age-verification-popup` | Yes, on every page | Bring (confirmed) | To do |
| 7 | Scroll progress bar | `global.js` | Yes | Bring (tiny) | Kept as is (colour now follows the accent setting) |
| 8 | "Welcome gift" tab and signup popup | new in the HTML | Yes | New build; photos are in `partner-v2/popup/` | To do |
| 9 | Back-to-top button | new in the HTML | Home page only | New build | To do |
| 10 | Icons | 30 `icon-*` snippets | Partly | Bring only the ones a page uses | In progress (book and Pinterest icons added) |
| 11 | Search | old `main-search` | HTML uses a JSON index | Shopify predictive search instead | To do |

## B. Sections the HTML reuses from the old theme

| # | Section | Used on | Status |
|---|---|---|---|
| 12 | `video-hero-slider` | Home (twice) | To do |
| 13 | `signature-models` | Home | To do |
| 14 | `general-usps` | Home | To do |
| 15 | `feature-videos` (the awards block) | Home, ENSŌ 2026 page | To do |
| 16 | `shop-accessories` | Home | To do |
| 17 | `split-showcase` | Home (ENSŌ Experience banner) | To do |
| 18 | `hero-banner` | Devices, FAQ, Support | To do |
| 19 | `faqs-page` | FAQ | To do |
| 20 | `contact` | Support | To do |
| 21 | `awards` (three icon links) | Support | To do |
| 22 | `main-collection` with filters and sort | Devices | To do |
| 23 | `main-article` | Journal articles | To do |

## C. Shared building blocks

| # | Item | Old file | Status |
|---|---|---|---|
| 24 | Product card | `card-product` | To do |
| 25 | Price display | `price`, `price-range` | To do |
| 26 | Carousel | `carousel-slider` in `global.js`, `carousel-styles` | To do |
| 27 | Lazy video | `lazy-video` in `global.js`, `video-media` | To do |
| 28 | Collection filters | `facets`, `facets.js`, `sort-by`, `pagination` | To do |
| 29 | Product form and gallery | `product-form.js`, `product-media-gallery`, `quantity-selector` | To do |
| 30 | Breadcrumbs | `breadcrumbs` | To do |

## D. Your decision needed

| # | Item | Why it's a question | Decision |
|---|---|---|---|
| 31 | Announcement bar | Audit: leftover CSS only, never shown in the HTML. Section already removed in the prune. | Answered: not in the HTML |
| 32 | Free-shipping progress bar in the cart | Old theme has it; no trace of it in the HTML. | |
| 33 | Wishlist button | Audit: markup exists but is hidden by CSS on every page. Proposal: remove. | |
| 34 | Product card swatches | Old theme setting; not in the HTML. | |
| 35 | Sticky add-to-cart | The old one isn't in the HTML, but both product pages have a new sticky buy bar. Proposal: build the new one only. | |
| 36 | Instagram section | The HTML loads the 231 KB app widget. Proposal: a native reels section instead; it will need the videos uploaded. | |
| 37 | Password page | Old theme has a custom one. | |

## G. Decisions from the audits (yours)

| # | Question | Detail | Decision |
|---|---|---|---|
| 48 | Bugs in the HTML: fix or copy? | The HTML has real bugs (list in group I). Proposal: fix them in the theme; this is the one exception to "match exactly". | |
| 49 | Heading scale | Use the h0 to h6 scale as the default and keep per-section sizes where the HTML differs (exact match), or enforce the scale strictly? | |
| 50 | Missing `h1` | Home, devices, FAQ and support have no `h1`. Promote the page title (no visual change)? | |
| 51 | Headings that do not shrink on phones | Home section headings stay 42 px at 390 px wide. Keep or treat as an oversight? | |
| 52 | Age gate | Hidden on every HTML page. If brought from the old theme: "No" sends visitors to google.com, and the code says 21 while the text says 18. | |
| 53 | Desktop quick-view sheet | Clicking an accessory card opens a detail sheet on desktop but the product page on phones. Keep both behaviours? | |
| 54 | "Per row" slider on accessories | Desktop only, 3 to 6; breaks the card button at 5 and 6. Keep? | |
| 55 | Desktop vs mobile menu | Desktop shows two shop items; mobile adds Guides, Support and FAQ. Keep the difference? | |
| 56 | Devices page | Keep as a filtered collection for two products, or make it the side-by-side page the README describes? | |
| 57 | Journal index | Hand-curated layout with 8 of 11 links to the live site. Drive it from the Shopify blog (date order) or keep hand-picked slots? | |
| 58 | Article styling | Each article carries its own pasted styles (Roboto, olive/orange palette, italics). Strip to theme styles? | |
| 59 | Font weights to load | Minimum is Inter 800 and Montserrat 400/500/600/700. Map the rarely used weights to these? | |

## H. Questions for the client

| # | Question | Detail | Answer |
|---|---|---|---|
| 60 | Cart: configurator or normal cart? | `cart.html` turns into "Choose your Diamond" with sets and add-on toggles; the README says to use the theme's own cart and drawer. | |
| 61 | "Diamond + Battery" €379 bundle | Exists only in the cart script, about €11 under the separate prices. Needs a real variant, bundle or discount. | |
| 62 | ENSŌ 2026 price and stock | Product page: from €390, Standard in stock, Battery Plus €420 back mid-October. Devices page: €420, out of stock. | |
| 63 | ENSŌ 2026 variants | Battery Plus has no cart id; a third "Standard + Battery Plus" €435 option is in the script and FAQ but has no button. | |
| 64 | Accessory names and prices | Card vs detail sheet disagree: Backpack 2.0 €99.99 vs 3.0 €119.99; Mouthpiece Extension €19.99 vs Mouthpiece €29.99; Mesh €9.99 vs €11.99. | |
| 65 | Returns wording | "30 days to decide" in the buy box vs "14 days unopened, 30 opened" elsewhere. | |
| 66 | Shipping wording | "From our warehouse in Hungary" vs "EU and US warehouses". | |
| 67 | Other copy conflicts on the ENSŌ 2026 page | Help card says "Two years on Diamond"; support "in English" vs "English, German or Russian"; cup capacity 15–25 g vs 8–13 g. | |
| 68 | Hidden accessories on the home page | Disposable Cups and Filling Set are in the markup but hidden. Sell them or not? | |
| 69 | Missing or placeholder images | Three accessories with "photo coming soon"; Diamond feature 3 is a sketch; the "Explore the system" poster and Backpack image look like screenshots; the Diamond card's two main images exist only embedded in the HTML. | |
| 70 | Help app | The file has no registration gate and needs about 75 image files beside it, both contrary to the handover document; its line numbers are stale. Which behaviour is intended? | |
| 71 | Warranty return address | No city or postcode. | |
| 72 | Firmware | Placeholder date "1 Oct 2026" and a link to an `ensoshisha.eu/firmware` page that is not in the handoff. | |
| 73 | Links to the live site | Eight journal articles, policies, user-guide videos, and checkout pointing at the old Diamond product. Confirm the real destinations. | |

## I. Bugs in the HTML (proposal: fix, do not copy; see item 48)

| Area | Bug |
|---|---|
| Site-wide | Page scrolls behind the mobile menu, search overlay and welcome popup |
| Site-wide | At 990–991 px wide both the desktop menu and the hamburger are hidden |
| Site-wide | "Shop Devices" and the footer "Devices" link go nowhere |
| Site-wide | Skip link stays a 1 px box when focused |
| Site-wide | 55 px blank strip under the footer on phones |
| Search | Enter does nothing; two clear buttons; close button mostly off-screen on phones |
| Home | "Add to cart" on accessory cards is disabled but looks active |
| Home | Hero has no swipe on phones; about 2.9 MB of video loads up front |
| Product pages | Sticky buy bar flashes when the header hides; 105 px tall on phones |
| Product pages | Accessory carousel arrows off-screen between 992 and about 1330 px (causes sideways scroll on the ENSŌ 2026 page) |
| Product pages | Pre-order quantity can stack to 3 while the cart forces 1; header count goes stale |
| Accessory product page | Payment buttons stay visible on out-of-stock items; "More payment options" link is broken; ENSŌ shown without the macron in the mobile bar |
| Accessories | Sticky filter bar slides under the header; cart stores a dollar sign for non-Diamond items; "Remind me" unreachable on phones |
| Articles | FAQ answers cannot be opened in one article and cannot be closed in another |
| Support | Contact form submits nowhere and shows no confirmation |
| ENSŌ 2026 manual | Search box cannot be clicked; `#q-packing` lands on a closed accordion |
| Diamond guide | 4.9 MB of images with nothing lazy; header covers the pinned scene on scroll up |
| Experience pages | Theme `.eyebrow` and `.card` styles override the pages' own (eyebrow shows black 16 px instead of sand) |
| All pages | Review stars, wishlist hearts and payment icons are in the markup, hidden only by CSS: remove outright |

## E. Leave behind

| Group | Items | Reason |
|---|---|---|
| Reviews | `reviews` section, `star-rating`, Loox app blocks, happy-customers page | Client rule: no reviews or ratings anywhere |
| Old product page content | `diamond-preorder.css` (246 KB), the two `ai_gen_block_*` blocks, `product-meta-shorts`, `image-slider`, `image-before-after`, `product-comparison-table`, `product-highlight` | Replaced by the new product pages |
| Unused home sections | `categories-grid`, `story-timeline`, `philosophy`, `reasons`, `hero`, `email-signup`, `newsletter`, `video-with-text`, `video-with-text-overlay`, `rich-text`, `blog-posts`, `instagram-reels` (unless chosen for item 36) | Not in the HTML |
| Old theme plumbing | Colour-override helper snippets (`apply-color-vars`, `button-vars`, `section-attrs` and similar) | Not needed in the lean build |

## F. New in the HTML (no old equivalent)

| # | Item | HTML file | Status |
|---|---|---|---|
| 38 | Home: "Made for the ritual", safety and certification, Diamond row, journal, help cards | `partner-v2/index.html` | To do |
| 39 | ENSŌ Diamond product page | `pdp-v2/index.html` | To do |
| 40 | ENSŌ 2026 product page | `partner-v2/enso.html` | To do |
| 41 | Accessories collection and detail sheet | `partner-v2/accessories.html` | To do |
| 42 | Accessory product page | `partner-v2/product.html` | To do |
| 43 | Cart page | `pdp-v2/cart.html` | To do |
| 44 | Warranty page | `partner-v2/warranty.html` | To do |
| 45 | Journal index | `partner-v2/blog.html` | To do |
| 46 | ENSŌ Experience hub and guides (seven pages) | `experience/` | To do |
| 47 | Help app (hosted separately, needs a backend) | `experience/app.html`, `help-app-HANDOVER.md` | To do |

## Step 1 notes (2026-10-06)

Built: global settings (logo and favicon, colour palette and roles, buttons, typography, cart type, free shipping bar, social media), the CSS variables, the colour-scheme-to-palette migration across 35 sections and 17 templates, and the header and footer. Nothing has been previewed in a store yet.

To set in the theme editor after uploading:

| Setting | Where | Why |
|---|---|---|
| Logo | Theme settings > Logo and favicon | Points at `Logo_text_web-01.webp` in Files; confirm it resolves |
| Guides link | Header > Guides link | Empty until set, so the book icon is hidden |
| Mobile menu | Header > Mobile menu | Pick a menu with Guides, Support and FAQ to match the HTML |
| Footer menus | Footer blocks | "Devices" must point at the devices collection (the HTML link went nowhere) |
| Free shipping | Theme settings > Cart | Off by default; stored threshold is 500 |

## Open points

- Preview: run `shopify theme dev --store <store>.myshopify.com` in the V2 folder and share the preview URL, so each item can be checked against the HTML.
- The bottom cart bar the README describes is switched off in the HTML; only a header count and a short toast show after adding an item.
- Already pruned from the folder (2026-10-06, recoverable from git): 11 unused sections, 28 unused snippets, `diamond-preorder.css`, `comparison-table.css`, and the Skeleton theme's README and licence files.
- Still in the folder until their pages are rebuilt: `reviews`, `star-rating`, Loox blocks, the happy-customers template, `ai_gen_block_*`, `product-meta-shorts`, `image-slider`, `image-before-after`, `fix-footer-mobile`, `categories-grid`, `story-timeline`, `blog-posts`, `instagram-reels`, `newsletter`.
