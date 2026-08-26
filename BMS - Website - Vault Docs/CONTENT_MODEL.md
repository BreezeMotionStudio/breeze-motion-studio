# Content Model — Sanity Schema Design

## Overview

This document defines the Sanity schema structure for Breeze Motion Studio. All document types, fields, and relationships are documented here as a reference for the implemented schemas in `/schemaTypes`.

**Status:** ✅ Implemented and deployed (as of 2026-03-04, Session 18)

---

## Document Types

There are **13 document types** total: 6 page singletons, 4 content collection types, 2 supporting content types, and 1 global settings singleton.

---

### Page Singletons

All 6 page singletons share a common architecture: a **`sections[]` array** as the primary content field, plus top-level `seoTitle` and `seoDescription` fields. Sections can be drag-reordered in Sanity Studio and the frontend renders them in that order.

**Universal section fields:** Every section type includes:
- `disabled` boolean ("Hide this section") — when ticked, excluded at GROQ level (`sections[disabled != true]`); content preserved; defaults `false`
- `sectionBg` (`sectionBackground` type) — full background control: solid color, gradient (start/end/direction/stop), or image. Added to every section in Session 27. Replaces all legacy `bgColor` string fields. Frontend uses `resolveBg(s.sectionBg, s.bgColor)` / `resolveTextClass(...)` helpers from `web/src/lib/sectionBackground.ts` for backwards compatibility.

---

### 1. `homePage` — Homepage (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

**Section types in `sections[]`:**

| Section Type | Fields |
|-------------|--------|
| `homeHero` | title, subtitle, subtitleDisabled *(boolean — hides just the subtitle paragraph, keeps title/background/buttons)*, bgVideoUrl, bgImage{alt}, buttons[]{label, url, style} |
| `homeFeaturedWork` | videoUrl *(YouTube or direct file — main featured video)*, bgImage{alt} |
| `homeAbout` | heading, text, imageLeftSlides[]{alt} *(array — multiple images enable auto-slideshow)*, imageRightSlides[]{alt} *(array — multiple images enable auto-slideshow)*, imageAspectRatio *(radio: 1:1/2:3/9:16, default 1:1)*, buttons[]{label, url, style}, aboutLogo *(logo rendered at top of centre column with horizontal rule dividers)*, logoMaxWidth *(px, controls logo display width)*, bgVideoUrl, bgImage{alt} |
| `homeStudiosOverview` | heading, description, parentLogo{alt, roundCrop} *(centered logo displayed above the animated connector tree)*, studioCards[]{studio→, cardImage{alt}, cardVideoUrl}, buttons[]{label, url, style}, bgVideoUrl, bgImage{alt} |
| `homeHowWeWork` | heading, sectionImage{alt} *(optional — renders between steps and button at natural dimensions)*, steps[]{stepNumber, title, description}, buttons[]{label, url, style}, bgVideoUrl, bgImage{alt} |
| `homeTestimonials` | heading *(section heading, e.g. "What Our Clients Say")*, testimonials[] *(drag-to-reorder references to `testimonial` documents — order reflects on website)*, buttons[]{label, url, style}, bgVideoUrl, bgImage{alt} |
| `homeClientLogos` | clientLogos[]{client→, logoOverride{alt}, disabled} |
| `homeCta` | heading, text, buttons[]{label, url, style}, bgVideoUrl, bgImage{alt} |

**Notes:**
- `homeFeaturedWork.videoUrl` is the featured/showcase video (YouTube or direct file URL — auto-detected on frontend); currently **disabled** in CMS
- `homeAbout` section sits between Featured Work and Studios Overview; renders a 3-column layout on desktop (imageLeftSlides | text+logo | imageRightSlides); image columns hidden on mobile; placeholder shown when no images uploaded; `imageAspectRatio` controls both containers simultaneously; `imageLeftSlides[]` and `imageRightSlides[]` are image arrays — a single image renders statically, multiple images auto-slide right-to-left every 8s with no controls; containers have `overflow-hidden` + `group-hover:scale-105` on inner images for a subtle contained zoom on hover; `aboutLogo` renders at the top of the centre column with horizontal rule dividers flanking it; full body text renders as a single unbroken block below the logo; `logoMaxWidth` defaults to 256px if unset
- `homeStudiosOverview.parentLogo` — optional centered logo displayed above the animated SVG connector tree linking the parent studio to the three sub-studio cards; supports `roundCrop` toggle for circular display; links to `/studios` on click; visible on desktop only (connector tree hidden on mobile, replaced by a simple vertical divider line)
- `homeStudiosOverview.studioCards[]` — each entry links a Studio document via reference and holds its own `cardImage` and `cardVideoUrl`; this is the media shown in the 1:1 square container on each studio card on the homepage. Card media set here is independent of the Studio document's own hero fields
- `homeTestimonials` renders testimonials from its own `testimonials[]` reference array — drag-to-reorder in Studio; order is reflected directly on the website. No longer uses the global `TESTIMONIALS_QUERY`; background image/video optional
- `homeClientLogos` is a standalone section — independent of `homeTestimonials`; holds a `clientLogos[]` array where each entry links to an existing `client` document (using the client's own logo) with an optional `logoOverride` image field and a per-entry `disabled` toggle; auto-scrolls horizontally every 3 seconds; background is `#535D66` (BMS accent steel blue)
- `bgVideoUrl` on all sections is for background decoration; takes priority over `bgImage` if both set
- All bg media fields are optional; sections render without them
- `buttons[]` is a draggable array of `ctaButton` objects — editors can add/remove/reorder buttons freely

---

### 2. `aboutPage` — About Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `aboutHero` | heading, heroImage{alt} *(diagonal frame, right 57% of hero — placeholder shown when empty)* |
| `aboutIntro` | text *(plain string — shown on white below hero)* |
| `aboutOverview` | studioImage{alt} *(wide 3:1 rectangle below "The Studio" label)*, overview *(blockContent — right column)*, founderImage{alt} *(wide 3:1 rectangle below "The Founder" label)*, mission *(blockContent — Founder Text Part 1)*, founderImage2{alt} *(round-cropped w-56 h-56 circle between text blocks)*, missionPart2 *(blockContent — Founder Text Part 2; mt-auto pins it to column bottom)* |
| `aboutMission` | heading *(string, defaults to "Mission" if blank)*, text *(blockContent — full rich text mission statement)*, bgImage{alt} *(optional full-bleed background; bg-black/65 overlay applied)*, bgColor |
| `aboutValues` | values[]{title, description} *(black background, white text — bgColor field intentionally left blank)* |
| `aboutCta` | heading, text *(plain string)*, bgImage{alt} *(optional full-bleed background; bg-black/65 overlay applied)*, buttons[]{label, url, style, topSpacing, bottomSpacing}, bgColor |
| `aboutHowWeWork` | intro *(blockContent)*, steps[]{title, description} |

**Current published section order:** aboutHero → aboutIntro → aboutOverview → aboutMission → aboutValues → aboutCta *(aboutHowWeWork exists in schema but is not currently in the live document)*

**Notes:**
- `aboutFounder` section type was removed (Session 23) — bio has always lived in `aboutOverview`; the disabled document entry was also removed
- `aboutValues.intro` and `aboutValues.missionBgImage` were removed from the schema in Session 23; the mission statement is now a standalone `aboutMission` section with `blockContent` text
- `aboutOverview` Studio title was renamed from "Studio Overview & Mission" to "Studio Overview" in Session 23
- `aboutValues` renders with a black background (`CoreValuesSection.tsx`); `bgColor` field intentionally left blank — do not set a white bgColor on this section or it will override the component default
- `aboutCta` uses the same background image as `homeCta` and `servicesCta` — standardised across all pages

---

### 3. `contactPage` — Contact Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `contactHero` | heading, heroImage{alt} *(diagonal frame)* |
| `contactIntro` | content *(blockContent)* |
| `contactDetails` | email, phone, note *(optional text shown below contact details, left column)*, formHeading, namePlaceholder, emailPlaceholder, companyPlaceholder, messagePlaceholder *(form field placeholder text)*, submitLabel *(submit button text, default "Send Message")*, formBg *(sectionBackground — solid/gradient/image background for the form container; defaults to black on frontend)* |

---

### 4. `servicesPage` — Services Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `servicesHero` | heading, heroImage{alt} *(diagonal frame)* |
| `servicesIntro` | text |
| `servicesCategories` | orderedCategories[] *(drag-to-reorder references to `serviceCategory` — preferred over global query)*, bgImage{alt} *(current live background: same wide panoramic image as homepage studios section)*, sectionTitle, sectionTitleColor *(radio: white/black/grey/dark-grey)*, collageImages[] *(exists in schema — currently unused; populate to restore irregular collage)*, buttonLabel, buttonUrl. *(`stripImage`/`stripColor`/`stripOpacity` removed Session 32 — the "accent strip" they backed was never actually rendered on the frontend since the fields were first added; confirmed no real content had ever been set, so removed rather than left inert.)* **⚠️ `orderedCategories[]` is a manual override array (see `ARCHITECTURE.md` decision 17, Pattern A) — when a `serviceCategory` document is created, deleted, or reordered, this array must be patched to match or the change won't appear on the live page even though the source document is correctly published (hit this exact bug in Session 33).** |
| `servicesStrip` | text *(MissionReveal-style animated statement strip between categories and combinations)*, bgImage{alt} *(full-bleed background for the strip section)*, disabled |
| `serviceCombinations` | heading, intro, combinations[] *(drag-to-reorder references to `serviceCombination` documents — edit content under Content Library → Services Combination Examples)*, collageImages[] *(exists in schema — currently unused; populate to restore irregular collage)* |
| `servicesCta` | heading, text *(short description below heading)*, buttons[]{label, url, style}, bgImage{alt} |

---

### 5. `studiosPage` — Studios Master Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `studiosHero` | heading, heroImage{alt} *(diagonal frame)* |
| `studiosIntro` | text |
| `studiosHighlights` | heading — highlights carousel; default bg `#0d0d0d`; `sectionBg` for override; `highlights[]` — array of `{project→, enabled}` entries with inline ON/OFF toggle; project data resolved in page from section array |
| `studiosGrid` | cards[] *(optional: studio reference + taglineOverride + imageOverride + overlayOpacity + overlayDirection)*; falls back to all studios when empty; `sectionBg` for override; studio cards use `flex flex-wrap justify-center` — odd card auto-centres |
| `studiosBts` | heading, `btsImages[]` *(managed list — see below)* |
| `studiosLatestProjects` | heading; `latestProjects[]` — array of `{project→, enabled}` entries with inline ON/OFF toggle; `sectionBg` for override |
| `studiosCta` | heading, text, buttons[], sectionBg *(full sectionBackground type)* |

**`studiosBts.btsImages[]`** supports two member types:
- `projectBts` — `{project→, imageOverride? (image), enabled (bool, default true), autoPulled (bool, hidden), label?, caption?}` — links a project; uses `imageOverride` if set, else pulls `project.btsImages[defined(asset)][0]` at render time
- `manualBts` — `{image (required, validated), label?, caption?}` — standalone uploaded image; no project link

Auto-population: `BtsImagesInput` custom component queries all projects with `count(btsImages[defined(asset)]) > 0` on mount and patches any new ones into the array as `projectBts { autoPulled: true }` entries. Auto-pulled items are tagged with a red "autopulled" badge in Studio; can be toggled, deleted, reordered, or have their image replaced just like manual entries.

**BTS image card display (bottom-left overlay):** client name (top, muted) → project title (main) → image caption (bottom, muted). Caption is sourced from `project.btsImages[].caption`. For `manualBts` entries, only `label` is shown if set.

**`project.btsImages[]`** — array members now have `validation: r.required()` on the image field — empty placeholder entries cannot be saved. Query always uses `btsImages[defined(asset)][0]` to skip any legacy empty entries.

**Inline toggles:** Both `studiosHighlights.highlights[]` and `studiosLatestProjects.latestProjects[]` use the `InlineToggleItem` custom component — an ON/OFF pill button is rendered directly in the array item row without opening the item.

**Section render order (current):** studiosHero → studiosIntro → studiosHighlights → studiosGrid → studiosBts → studiosLatestProjects → studiosCta *(only renders if configured in Sanity)*

**Notes (Session 27):** Highlights section moved above the studio grid. Studio cards switched from `grid-cols-2` to `flex flex-wrap justify-center` for correct odd-card centering.
**Notes (Session 28):** `studiosBts` fully redesigned — managed `btsImages[]` array replaces the old auto-query approach. `studiosHighlights` and `studiosLatestProjects` gained per-item inline toggles.

---

### 6. `caseStudiesPage` — Case Studies Page (Singleton)

**Top-level fields:** `sections[]`, `listingKickerLabel` *(small label above each card's title, default "Case Study" — Session 33)*, `listingCtaLabel` *(text on each listing card, default "Read Case Study →")*, `listingSectionBg` *(sectionBackground — Session 32, background for the listing cards themselves)*, `listingSectionTitle` *(heading above the featured cards, default "Featured Case Studies" — Session 36)*, `viewMoreLabel` *(button revealing every other project's case study as thumbnails, default "View More" — Session 36)*, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `caseStudiesHero` | heading, heroImage{alt} *(diagonal frame, matching every other page hero — Session 33)* |
| `caseStudiesIntro` | text |
| `caseStudiesCta` | heading, text, buttons[], sectionBg *(Session 32 — always renders at the very bottom of the page, below the listings, regardless of position in the sections array)* |

**Note:** The case studies listing is always rendered after the sections (not a removable section). Listing cards (Session 33 redesign) each sit on their own white, rounded-corner card that scales up slightly on hover; all card text is fixed to dark colors regardless of the section's own background (previously some text was hardcoded black even when the section background was dark — fixed as part of this redesign). Cards show a "Case Study" kicker label, title, client/year, cover image, summary, and CTA.

---

### Content Collection Types

---

### 7. `studio` — Sub-Studio Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Studio name (e.g., "Machine Studio") |
| slug | slug | Yes | URL slug (e.g., "machine") |
| tagline | string | No | Short descriptor |
| description | blockContent | Yes | Full studio description |
| purpose | text | Yes | What the studio does |
| industriesServed | array of string | Yes | Industries this studio serves |
| whatWeDoNot | array of string | No | Explicit exclusions |
| heroImage | image | No | Displayed in the diagonal frame on the right side of the studio hero; placeholder shown when empty |
| displayOrder | number | Yes | Sort order on studios page |
| seoTitle | string | No | SEO override title |
| seoDescription | text | No | SEO meta description |

**Active entries:** Machine Studio (`/studios/machine`), Commercial Studio (`/studios/commercial`), Creative Studio (`/studios/creative`)

**Note:** Strategy Studio was removed from Sanity on 2026-02-25 pending a company profile repositioning. No documents referenced it at time of deletion.

---

### 8. `project` — Portfolio Entries (also serves as Case Studies)

Fields are organised into groups in Sanity Studio: **Basics**, **Deliverables**, **Behind the Scenes**, **Case Study**, **Settings**, **SEO**.

**Basics group:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Project title |
| slug | slug | Yes | URL slug — also used for `/projects/[slug]` and `/case-studies/[slug]` |
| client | reference → client | Yes | Client this project was for |
| studio | reference → studio | Yes | Which studio this belongs to |
| services | array of reference → serviceCategory | No | Services provided |
| year | string | No | Project year |
| tagline | string | No | One-line descriptor shown on project cards (max 100 chars) |
| summary | text | Yes | Short summary for cards and case study listing (max 500 chars, raised from 300 in Session 36) |
| description | blockContent | No | Detailed project description — shown in the Overview section |
| coverImage | image | Yes | Primary thumbnail used on all cards site-wide |

**Deliverables group:**

| Field | Type | Description |
|-------|------|-------------|
| deliverableImages | array of image | Drag-and-drop gallery (`options.layout: 'grid'`); `w-full h-auto` — no forced aspect ratio; empty slots skipped |
| deliverableVideos | array of video object | Each object: `platform` (youtube/vimeo/other), `url`, `title`; first = featured full-width embed; rest = centered supporting grid |

**Behind the Scenes group:**

| Field | Type | Description |
|-------|------|-------------|
| btsNote | text | Optional paragraph about process/making-of |
| btsImages | array of image | Gallery-style upload; same display rules as deliverableImages |
| btsVideos | array of video object | Same structure as deliverableVideos |

**Case Study group** *(rebuilt in Session 36 — see `ARCHITECTURE.md` decision 22)*:

| Field | Type | Description |
|-------|------|-------------|
| showAsCaseStudy | boolean | "Feature on Case Studies Page" — only for the small curated set that keep the full dedicated `/case-studies/[slug]` page. Most projects should leave this off and use `caseStudyPdf` instead. |
| caseStudyPdf | file (PDF only) | The one-page A4 case study PDF. Available regardless of `showAsCaseStudy` — this is the delivery method for every project *not* in the featured set. |
| caseStudyPdfPreview | image (PNG only) | High-res PNG export of the same page, shown in the "View Case Study" modal. **Required whenever `caseStudyPdf` has a file** (schema-level custom validation) — publish is blocked if one exists without the other. |
| caseStudyOrder | number | Display order on public case studies page (hidden unless `showAsCaseStudy` is true) |
| caseStudyOverview | text | Opening paragraph framing the project (hidden unless `showAsCaseStudy` is true) |
| caseStudyChallenge | blockContent | The Challenge narrative (hidden unless `showAsCaseStudy` is true) |
| caseStudyApproach | blockContent | The Approach narrative (hidden unless `showAsCaseStudy` is true) |
| caseStudyOutcome | blockContent | The Outcome narrative (hidden unless `showAsCaseStudy` is true) |
| testimonial | reference → testimonial | Client testimonial linked to this project (hidden unless `showAsCaseStudy` is true) |
| caseStudySliderImages | array of image | *(Session 32)* "Custom Selection" override for the image slider at the bottom of the case study page (hidden unless `showAsCaseStudy` is true). Empty = slider auto-shows every `deliverableImages` image (Content Override Pattern A — see `ARCHITECTURE.md` decision 17). Populated = fully replaces the automatic pull for the slider only; `deliverableImages` itself is never affected. |

**"View Case Study" behavior everywhere except the featured set:** opens `CaseStudyPdfButton` → `CaseStudyPdfViewer`, a full-screen modal showing `caseStudyPdfPreview` (not the raw PDF — embedded PDF viewers render inconsistently across browsers) with a Download PDF button. Never navigates to a page.

**Case study detail page image slider:** `CaseStudyImageSlider.tsx`, rendered directly above the testimonial section *(moved above testimonial in Session 33; was previously just above the CTA)*. Full-bleed, edge-to-edge native horizontal scroll — each image keeps its own natural aspect ratio at a fixed height (`h-72 md:h-96`, `w-auto`, no forced cropping) and images sit stacked back-to-back with no gap *(redesigned in Session 33 — previously all images were forced into equal-width cropped boxes)*. White gradient fades on both edges, chevron arrows overlaid on top of the fade, no visible section background (section height hugs the image strip exactly), auto-advances every 4s, click-to-enlarge via the shared `ImageLightbox` component.

**Note on Case Study visibility (updated Session 36):**
- **`/case-studies` listing** shows only the featured cards for projects with `showAsCaseStudy == true`, reachable only from their own cards — no other button anywhere in the site links to a `/case-studies/[slug]` URL (deliberate; `ServiceCombinationsSection`'s own case-study links are the one confirmed exception)
- **`/case-studies` "View More" reveal** (`MoreCaseStudies.tsx`) shows *every* project with both `caseStudyPdf` and `caseStudyPdfPreview` uploaded — featured or not — as small clickable thumbnails, always visible even with nothing to show yet
- **`/projects/[slug]`** shows a "View Case Study" button whenever `caseStudyPdf` + `caseStudyPdfPreview` both exist — opens the PDF/PNG modal, not a page link, regardless of `showAsCaseStudy`

**Settings group:**

| Field | Type | Description |
|-------|------|-------------|
| status | string (radio) | draft / inProgress / complete |
| completedAt | date | Completion date — drives default sort order; hidden unless status = complete |
| isHighlight | boolean | Show in the highlights carousel on the Studios page |
| highlightOrder | number | Sort order in highlights carousel (hidden unless `isHighlight`) |
| featured | boolean | Show in homepage featured section |
| featuredOrder | number | Sort order for featured display (hidden unless `featured`) |
| manualOrder | boolean | Override auto date-sort with a manual pin position |
| displayOrder | number | Pin position (hidden unless `manualOrder`; pinned projects sort before date-ordered ones) |
| sectionOrderVideos | number | Display position of Video Gallery section on detail page (default: 1) |
| sectionOrderImages | number | Display position of Image Gallery section (default: 2) |
| sectionOrderBts | number | Display position of Behind the Scenes section (default: 3) |

**Default sort order (GROQ):** `order(select(manualOrder == true => displayOrder, 9999) asc, completedAt desc)` — pinned projects first, then newest-completed.

**Project detail page (`/projects/[slug]`) section order:** Hero → Overview → [media sections sorted by sectionOrder* fields] → Case Study CTA strip → Testimonial → CTA strip

---

### 9. `caseStudy` — **RETIRED**

> The standalone `caseStudy` document type has been retired as of Session 26 (2026-05-25). Case studies are now `project` documents with the Case Study group fields filled in and optionally `showAsCaseStudy` toggled on. Any existing `caseStudy` documents should be migrated to `project` documents. The Sanity sidebar Case Studies section, the `/case-studies` listing page, and the `/case-studies/[slug]` detail page all now operate entirely on `project` type documents.

---

### 10. `client` — Client Profiles

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Company/client name |
| slug | slug | Yes | URL slug |
| industry | string | Yes | Industry category |
| description | text | No | Brief description |
| logo | image | No | Client logo — supports hotspot (focal point for crops) and alt text |
| website | url | No | Client website URL |
| contactName | string | No | Primary contact name |
| contactRole | string | No | Contact's role/title |
| studioAlignment | array of reference → studio | No | Which studios they work with |
| approved | boolean | Yes | Approved for public display |
| displayOrder | number | No | Sort order for client displays |

**Published clients:** ROVD Group, SAR Electronics SA, Trihedron, Symec Digital, IDD, SOGA Organic, Cressi, Emily May Aesthetics, Bend Wellness, Equinox Consulting, Death By Coffee Roastery, Raylene Pilates + 21 additional

---

### 11. `testimonial` — Client Testimonials

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quote | text | Yes | Testimonial text |
| attribution | string | Yes | Person's name |
| role | string | No | Person's role/title |
| client | reference → client | Yes | Which client |
| featured | boolean | No | Show on homepage |
| displayOrder | number | No | Sort order |

---

### 12. `serviceCombination` — Service Combination Examples

Standalone documents for the "Example Combinations" section on the services page. Managed under Content Library → Services Combination Examples in Sanity Studio.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Combination name (e.g., "Brand Startup Collection") |
| subtitle | string | No | Short descriptor line below the title |
| description | simpleRichText | No | Paragraph description shown on the card |
| items | array of string | No | "Typically Includes" list — shown as bullet points |
| caseStudySlug | string | No | Slug of a linked case study — activates "View Case Study" button |
| bgImage | image | No | Per-card background image; `bg-black/70` overlay applied |
| images | array of image | No | Up to 3 thumbnail images shown on the card; click to open lightbox |

**Published combinations (6, in order):** Brand Startup Collection, Brand Refresh Collection, Media Overhaul, Industrial/Technical Showcase, System Diagnosis, Private Creative Collection

**Note:** The order on the services page is controlled by the `combinations[]` reference array in `servicesPage.serviceCombinations` — drag to reorder there, not in the document list itself.

---

### 13. `serviceCategory` — Service Groupings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Category name |
| slug | slug | Yes | URL slug |
| shortDescription | text | Yes | One-line description (write long enough to fade into the "Read More" bar on the card) |
| description | blockContent | No | Full rich-text description |
| services | array of string | No | Flat list of individual services (legacy — superseded by `serviceGroups`) |
| serviceGroups | array of object | No | Structured service groups for the modal: each group has `subheading` (string), `description` (text — shown above the service blocks), `items` (array of string — the service pill blocks) |
| image | image | No | Card visual on services page (hotspot + alt text) |
| displayOrder | number | Yes | Sort order fallback (overridden by `orderedCategories` drag order in `servicesPage`) |

**Categories (6, current live order — Session 33):** Video & Videography (`video`), Image & Photography (`photography`), Audio & Sound (`audio-sound`), Motion Graphics (`motion-graphics`), Graphic Design (`graphics-visual-content`), Digital Platforms & Systems (`digital-platforms-systems`)

**Session 33 note:** The former single "Video & Motion Graphics" category was split into two standalone documents — **Video & Videography** (video production only) and **Motion Graphics** (motion graphics + the "Cinematic 3D Showcases" sub-group, kept together per Rebekah's choice). "Photography" was renamed **Image & Photography** and its scope clarified: real image capture and photo editing only (not graphic design), all shot onsite with no indoor studio shoots. See the `orderedCategories[]` override warning above — both the new document and every reorder had to be mirrored into `servicesPage`'s section as a separate step.

**Notes:**
- `serviceGroups[]` is the primary field for modal content — each group renders a bold animated-underline subheading, an optional description paragraph, and service pill blocks
- The `services` flat array is kept for backwards compatibility but the modal prefers `serviceGroups` when present
- Sub-group descriptions are sourced from the BMS Company Profile v5 (2026-03-19) — see `project_company_profile.md` in memory

---

### 13. `siteSettings` — Global Settings (Singleton)

**Groups:** General, Header & Navigation, Footer, Contact, Social Media

**General:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| siteTitle | string | Yes | Site-wide title |
| tagline | string | No | Global tagline |
| description | text | Yes | Default meta description (max 160 chars) |
| primaryLogo | image | Yes | The logo used everywhere on the site — nav, footer, favicon, OG/social preview, structured data. Has its own white background, safe on any page background. Update once here and it cascades everywhere automatically (favicon excepted — see note below). |
| primaryLogoTransparent | image | No | Transparent PNG of the primary (dark ink) logo, no white backdrop. Not wired into anything on the site by default. |
| invertedLogo | image | No | Transparent PNG, light/inverted logo, no backdrop. Not wired into anything on the site by default. |
| invertedLogoBlackBg | image | No | The inverted (light ink) logo with a solid black background baked in. Not wired into anything on the site by default — was briefly used as the round-cropped favicon on 2026-08-25, reverted same day back to `primaryLogo`. |
| wordmarkBlack | image | No | Transparent PNG of the "BREEZE MOTION STUDIO" wordmark lockup in black, for light backgrounds. Source files ship with a huge transparent margin around the glyphs — always trim tight to the ink bounding box (plus a small breathing margin) before uploading, or the wordmark renders far smaller than intended wherever it's placed. |
| wordmarkWhite | image | No | Same wordmark lockup in white, for dark backgrounds. Same trim requirement as `wordmarkBlack`. Live as of 2026-08-26: homepage hero (replaces the `homeHero.title` text when set) and site footer brand column (replaces the `siteTitle` text when set), both sized to visually match what the text they replaced looked like. |

**Favicon note:** `web/src/app/favicon.ico` is a static file, sourced from `primaryLogo` — **not auto-synced**. Whenever `primaryLogo` changes and you want the tab icon to match, regenerate it manually (download, resize to 16/32/48px, save as `.ico`).
| splashAccentsEnabled | boolean | No | Global toggle — show/hide decorative camera splash graphics in section corners across all pages; defaults to `true` |

**Header & Navigation:**

| Field | Type | Description |
|-------|------|-------------|
| navLinks | array of {label, href} | Navigation bar links |
| navCta | {label, href} | Optional CTA button in nav (right side) |

**Note (2026-08-25):** Nav and footer no longer have their own separate logo upload fields. Both always render `siteSettings.primaryLogo` (round-cropped, fixed size in code — 44px nav, 56px footer) — this replaced the old `plainLogo`/`roundLogo`/`iconLogo`/`footerPlainLogo`/`footerRoundLogo` per-shape fields, which had drifted out of sync with each other and with the general `logo`/`logoLight` fields (which weren't even wired into the frontend). Same fix applied to the homepage's `homeAbout` and `homeStudiosOverview` sections, which previously had their own separate `aboutLogo`/`parentLogo` upload fields — both removed, both sections now also source from `primaryLogo`. Updating the logo now requires touching exactly one field, sitewide.

**Footer:**

| Field | Type | Description |
|-------|------|-------------|
| footerTagline | string | Short tagline under logo/studio name in footer brand column |
| footerLinks | array of {label, href} | Footer navigation column links |
| footerText | string | Copyright notice (e.g., © 2026 Breeze Motion Studio. All rights reserved.) |

**Note:** The footer brand column heading (studio name) is driven by `siteTitle` from the General group — not a separate footer field. The brand column displays: logo → `siteTitle` → `footerTagline`, all center-aligned.

**Contact:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| contactEmail | string | Yes | Primary contact email |
| contactPhone | string | No | Phone / WhatsApp number |

**Social Media:**

| Field | Type | Description |
|-------|------|-------------|
| socialLinks | array of {platform, url} | Social media platform links |

---

## Shared Types

### `sectionBackground` — Section Background Control

Universal background type used on every section across all pages (added Session 27). Defined in `schemaTypes/shared/sectionBackground.ts`.

| Field | Type | Description |
|-------|------|-------------|
| `bgType` | radio string | `solid` / `gradient` / `image`; default `solid` |
| `bgColor` | string (select) | Solid fill — 13-swatch dropdown (see COLOR_LIST below) |
| `gradientFrom` | string (select) | Gradient start color — same 13-swatch dropdown |
| `gradientTo` | string (select) | Gradient end color — same 13-swatch dropdown |
| `gradientDirection` | radio string | 8 direction options; default `to bottom` |
| `gradientStop` | number | Start color weight %; default 56 |
| `bgImage` | image | Full-bleed background image; `sectionBgStyle()` returns `{}` for image type — component must render `<img>` tag explicitly |

**COLOR_LIST (13 swatches):** Pure Black `#000000`, Deep Black `#0d0d0d`, Near Black `#333333`, Steel Blue Dark `#363F47`, Charcoal Dark `#3F3F3F`, Dark Blue-Grey `#444E57`, Charcoal `#4B4B4B`, Steel Blue — Accent `#535D66`, Dark Grey `#999999`, Mid Grey `#CCCCCC`, Light Grey `#E6E6E6`, Off-White `#F5F5F5`, Pure White `#FFFFFF`

**Frontend helpers** (`web/src/lib/sectionBackground.ts`):
- `sectionBgStyle(bg)` — converts sectionBg object → `CSSProperties` (handles solid + gradient; `{}` for image)
- `resolveBg(sectionBg?, legacyBgColor?)` — checks sectionBg first, falls back to legacy `bgColor` string
- `resolveTextClass(sectionBg?, legacyBgColor?, defaultIsLight?)` — returns `'text-white'` or `'text-black'`
- `resolveIsLight(sectionBg?, legacyBgColor?)` — boolean; used to select button variant

**GROQ projection** (required in every section projection that uses sectionBg):
```groq
sectionBg{ bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage{ asset->{ url }, alt } }
```

---

### `blockContent` — Rich Text

Standard Portable Text configuration supporting:
- Paragraphs, headings (H2, H3, H4)
- Bold, italic, underline
- Links (internal + external)
- Images (inline) — rendered via `PortableTextContent.tsx`'s `types.image` (added Session 32; images inserted into rich text previously vanished on the frontend since no renderer existed for them)
- Block quotes
- Text color / font / size marks (Session 32 — see below)

### `simpleRichText` — Single-Style Rich Text

Lighter-weight Portable Text config (`schemaTypes/shared/simpleRichText.ts`) for headings, labels, and short paragraphs — single block style (no H2/H3/lists), decorators: bold, italic, underline, plus the text color/font/size marks below. Used across most page schemas for any heading/label field that needs the same rich-text toolbar as `blockContent` without full formatting power. Rendered via `web/src/components/ui/SimpleRichText.tsx`, which returns a bare fragment (no wrapping `<p>`) so it can sit inside an existing `<h1>`/`<h2>`/`<span>` etc.

### Text Style Marks — `textColor` / `textFont` / `textSize` / `textStyle` (Session 32)

Added to both `simpleRichText` and `blockContent`'s `marks.annotations`, so any field using either type automatically gets per-selection color/font/size controls in the Studio toolbar, with zero additional per-field schema work. Defined in `schemaTypes/shared/textMarks.ts`.

| Type | Kind | Purpose |
|------|------|---------|
| `textColor` | portable-text annotation | Wraps selected text in a color, chosen from the same `COLOR_LIST` used by `sectionBackground` |
| `textFont` | portable-text annotation | Wraps selected text in one of the 3 brand fonts only — Cormorant SC (`brand`), Arial (`functional`), Calibri (`body`) |
| `textSize` | portable-text annotation | Wraps selected text in a size, from a fixed scale (`xs` through `7xl`) |
| `textStyle` | plain object (not rich text) | Same 3 controls (no bold/italic) for fields whose *value* also drives behavior — e.g. Contact page `email`/`phone`, which stay plain strings (for `mailto:`/`tel:` links + validation) with sibling `emailStyle`/`phoneStyle` fields instead of being converted to portable text |

**Frontend:** `web/src/lib/textMarkStyles.ts` (`MARK_FONT_VARS`, `MARK_SIZE_VALUES`, `resolveMarkColor()`, `textStyleToCss()`) is the single source of truth for the font-var/size-value mappings — keep in sync with `textMarks.ts`'s option lists if either changes. Both `SimpleRichText.tsx` and `PortableTextContent.tsx` render all three marks plus `underline`.

**Studio list-view previews:** any field converted from `string`/`text` to `simpleRichText` that was referenced in a `preview.select` (for the collapsed section's subtitle in Studio) needs `plainTextFromBlocks()` from `schemaTypes/shared/portableTextPreview.ts` inside `prepare()` — a raw portable-text array renders as blank/garbage in that context otherwise.

**Rollout scope (Session 32):** headings, section labels, and paragraphs across every page. Deliberately excluded: button labels (`ctaButton.label`), nav links, and form placeholders — those stay plain strings, locked to the coded design. One further exception: `aboutValues.values[].title` stayed a plain string because `CoreValuesSection.tsx` splits it into per-word stacked lines, which conflicts with portable text.

### `ctaButton` — Call to Action Object

| Field | Type | Description |
|-------|------|-------------|
| label | string | Button text |
| url | string | Link destination |
| style | string | "primary" or "secondary" |
| topSpacing | string | Vertical nudge above button — preset values: `neg-lg` (−mt-8) → `none` (default) → `lg` (+mt-8); 9 options total |
| bottomSpacing | string | Vertical nudge below button — same preset scale using `mb-` classes |

**Button spacing implementation:** `web/src/lib/buttonSpacing.ts` — static lookup maps (`TOP_SPACING`, `BOTTOM_SPACING`) and `btnSpacingClass(topSpacing, bottomSpacing)` helper that returns the combined Tailwind class string. Applied to all button render sites across `page.tsx`, `HowWeWorkSection.tsx`, and `services/page.tsx`.

---

## Relationships Diagram

```
homePage (singleton)
    └── references studios (auto) + testimonials (auto)

studiosPage (singleton)
    └── references studio documents (auto via studiosGrid section)

caseStudiesPage (singleton)
    └── references caseStudy documents (auto, listing always shown)

servicesPage (singleton)
    └── references serviceCategory documents (auto via servicesCategories section)

studio
    ├── has many → project
    ├── has many → caseStudy
    └── has many → client (via projects)

project
    ├── belongs to → studio
    ├── belongs to → client
    └── tagged with → serviceCategory[]

caseStudy
    ├── belongs to → studio
    ├── belongs to → client
    └── includes → testimonial

client
    ├── has many → project
    ├── has many → testimonial
    └── aligned to → studio[]

testimonial
    └── belongs to → client

serviceCategory (standalone)

siteSettings (singleton)
```

---

## Implementation Notes

### Page Builder Pattern (as of 2026-02-19)

All 6 page singletons use a `sections[]` array instead of flat top-level fields. This enables:
- **Drag-to-reorder** in Sanity Studio (native array UI)
- **Section-level control** — add, remove, or reorder any section from the CMS
- **Consistent frontend pattern** — all pages use the same `section._type` switch/case renderer

Section type names are page-prefixed (e.g., `homeHero` not `hero`) to avoid potential Sanity global schema conflicts.

### File Locations

```
schemaTypes/
├── index.ts                 # Schema exports
├── siteSettings.ts
├── homePage.ts              # sections array: homeHero, homeFeaturedWork, homeAbout, homeStudiosOverview, homeHowWeWork, homeTestimonials, homeClientLogos, homeCta
├── aboutPage.ts             # sections array: aboutHero, aboutIntro, aboutOverview, aboutMission, aboutValues, aboutCta, aboutHowWeWork
├── contactPage.ts           # sections array: contactHero, contactIntro, contactDetails
├── servicesPage.ts          # sections array: servicesHero, servicesIntro, servicesCategories, servicesStrip, serviceCombinations, servicesCta
├── studiosPage.ts           # sections array: studiosHero, studiosIntro, studiosHighlights, studiosGrid, studiosBts, studiosLatestProjects, studiosCta
├── caseStudiesPage.ts       # sections array: caseStudiesHero, caseStudiesIntro
├── studio.ts
├── project.ts
├── caseStudy.ts             # RETIRED — all case studies now use project type
├── client.ts
├── testimonial.ts
├── serviceCategory.ts
├── serviceCombination.ts    # standalone combination example documents — Content Library → Services Combination Examples
├── blockContent.ts
└── shared/
    ├── ctaButton.ts         # includes topSpacing + bottomSpacing preset fields
    ├── sectionBackground.ts # ← UNIVERSAL background type (solid/gradient/image); replaces bgColorField
    ├── bgColorField.ts      # LEGACY — no longer added to new sections; kept for backwards compat
    └── simpleRichText.ts
```

### Round Crop — Universal Image Field Convention

All image fields across all schemas include a `roundCrop` boolean sub-field (default `false`). When enabled in the CMS, the frontend applies `rounded-full overflow-hidden` to the image container. This is a standing rule — all future image fields must include it.

**Affected schemas:** `blockContent.ts`, `aboutPage.ts`, `client.ts`, `project.ts`, `caseStudy.ts`, `homePage.ts`, `studio.ts`

**Exception (2026-08-25):** `siteSettings.primaryLogo`/`invertedLogo` do not have a `roundCrop` sub-field. The logo's crop treatment is fixed in code instead (round in Nav and Footer) rather than CMS-toggleable, since it's the same single image used everywhere and doesn't need per-placement control.

**GROQ query requirement:** `roundCrop` must be explicitly projected in all image field projections, e.g. `image{asset->{url}, alt, roundCrop}`.

### Content Population Status (as of 2026-02-19)

**✅ PUBLISHED — All Content Live:**
- **siteSettings (1)** — Contact info, tagline, meta description
- **homePage (1)** — Hero, featured work, studios overview, how we work, testimonials, CTA
- **aboutPage (1)** — Hero, intro, overview, founder, values, how we work
- **contactPage (1)** — Hero, intro, contact details
- **servicesPage (1)** — Hero, intro, categories section, CTA
- **studiosPage (1)** — Hero, intro, studios grid
- **caseStudiesPage (1)** — Hero, intro
- **studio (3)** — Machine, Commercial, Creative *(Strategy removed 2026-02-25)*
- **serviceCategory (6)** — Video & Videography, Image & Photography, Audio & Sound, Motion Graphics, Graphic Design, Digital Platforms & Systems (Session 33 — split from 5 categories; see section 13 above)
- **client (33)** — All approved clients
- **testimonial (12)** — All linked to clients
- **caseStudy (12)** — All with rich narrative content, linked to clients/studios/testimonials

**⏳ Pending:**
- **project** — Portfolio projects (requires real project data and assets)
- **Case study images** — Cover images and gallery images for all 12 case studies

\n- STANDING RULE (Sanity): All future Sanity image fields with hotspot/crop enabled must also include a companion 'Round Crop' toggle or configuration.
