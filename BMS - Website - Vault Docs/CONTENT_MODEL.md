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

**Universal section fields:** Every section type includes a `disabled` boolean field ("Hide this section"). When ticked, the section is excluded from the GROQ query (`sections[disabled != true]`) and does not appear on the website. Content is preserved. Defaults to `false` (visible).

---

### 1. `homePage` — Homepage (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

**Section types in `sections[]`:**

| Section Type | Fields |
|-------------|--------|
| `homeHero` | title, subtitle, bgVideoUrl, bgImage{alt}, buttons[]{label, url, style} |
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
| `servicesCategories` | orderedCategories[] *(drag-to-reorder references to `serviceCategory` — preferred over global query)*, bgImage{alt} *(current live background: same wide panoramic image as homepage studios section)*, sectionTitle, sectionTitleColor *(radio: white/black/grey/dark-grey)*, collageImages[] *(exists in schema — currently unused; populate to restore irregular collage)*, stripImage{alt} *(optional base layer for horizontal accent strip)*, stripColor *(radio)*, stripOpacity *(0–100)*, buttonLabel, buttonUrl |
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
| `studiosGrid` | *(no fields — automatically pulls all published studio documents)* |

---

### 6. `caseStudiesPage` — Case Studies Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `caseStudiesHero` | heading |
| `caseStudiesIntro` | text |

**Note:** The case studies listing is always rendered after the sections (not a removable section).

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
| summary | text | Yes | Short summary for cards and case study listing (max 300 chars) |
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

**Case Study group:**

| Field | Type | Description |
|-------|------|-------------|
| showAsCaseStudy | boolean | "Feature on Case Studies Page" — controls public `/case-studies` listing only; does not gate content editing |
| caseStudyOrder | number | Display order on public case studies page (hidden unless `showAsCaseStudy` is true) |
| caseStudyOverview | text | Opening paragraph framing the project |
| caseStudyChallenge | blockContent | The Challenge narrative |
| caseStudyApproach | blockContent | The Approach narrative |
| caseStudyOutcome | blockContent | The Outcome narrative |
| testimonial | reference → testimonial | Client testimonial linked to this project |

**Note on Case Study visibility:**
- **Sanity sidebar** auto-populates the Case Studies section for any project with at least one `caseStudy*` content field filled — no toggle required
- **`/case-studies` listing** shows only projects with `showAsCaseStudy == true`
- **`/case-studies/[slug]`** works by slug for any project regardless of toggle — accessible via direct link or the "View Case Study" button on the project page
- The project page shows a "View Case Study" strip/button when case study content exists; the full narrative is only on the case study detail page

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

**Published combinations (5):** Brand Startup Collection, Media Overhaul, Industrial/Technical Showcase, System Diagnosis, Private Creative Collection

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

**Categories (5):** Branding & Identity, Video & Motion, Photography, Digital Systems & Platform Design, Print & Physical Brand Assets

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
| logo | image | No | Primary site logo |
| logoLight | image | No | Logo for dark backgrounds |
| splashAccentsEnabled | boolean | No | Global toggle — show/hide decorative camera splash graphics in section corners across all pages; defaults to `true` |

**Header & Navigation:**

| Field | Type | Description |
|-------|------|-------------|
| navLinks | array of {label, href} | Navigation bar links |
| navCta | {label, href} | Optional CTA button in nav (right side) |
| plainLogo | {enabled, logoImage{hotspot}, sizePreset, customSize} | Unaltered logo in nav; enabled by default; `logoImage` uploaded via CMS (falls back to General `logo`) |
| roundLogo | {enabled, logoImage{hotspot}, sizePreset, customSize} | Logo in circular crop; disabled by default; `logoImage` uploaded via CMS (falls back to General `logo`) |
| iconLogo | {enabled, logoImage{hotspot}, sizePreset, customSize} | Icon-only logo (no wordmark); disabled by default; `logoImage` uploaded via CMS (falls back to `/public/logo-icon.png`) |

**Note (2026-02-25):** Header & Navigation logos are now managed via manual image upload fields (`logoImage`) directly within each logo option in Sanity, replacing previous hardcoded or file-path-only approaches. All three logo variants (`plainLogo`, `roundLogo`, `iconLogo`) include a `logoImage` field with hotspot support.

**Footer:**

| Field | Type | Description |
|-------|------|-------------|
| footerPlainLogo | {enabled, sizePreset, customSize} | Plain logo in footer brand column |
| footerRoundLogo | {enabled, sizePreset, customSize} | Round crop logo in footer; prioritised over plain when both enabled |
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

### `blockContent` — Rich Text

Standard Portable Text configuration supporting:
- Paragraphs, headings (H2, H3, H4)
- Bold, italic, underline
- Links (internal + external)
- Images (inline)
- Block quotes

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
├── servicesPage.ts          # sections array: servicesHero, servicesIntro, servicesCategories, servicesCta
├── studiosPage.ts           # sections array: studiosHero, studiosIntro, studiosGrid
├── caseStudiesPage.ts       # sections array: caseStudiesHero, caseStudiesIntro
├── studio.ts
├── project.ts
├── caseStudy.ts
├── client.ts
├── testimonial.ts
├── serviceCategory.ts
├── serviceCombination.ts    # standalone combination example documents — Content Library → Services Combination Examples
├── blockContent.ts
└── shared/
    ├── ctaButton.ts         # includes topSpacing + bottomSpacing preset fields
    ├── bgColorField.ts
    └── seoFields.ts
```

### Round Crop — Universal Image Field Convention

All image fields across all schemas include a `roundCrop` boolean sub-field (default `false`). When enabled in the CMS, the frontend applies `rounded-full overflow-hidden` to the image container. This is a standing rule — all future image fields must include it.

**Affected schemas:** `blockContent.ts`, `aboutPage.ts`, `client.ts`, `project.ts`, `caseStudy.ts`, `homePage.ts`, `studio.ts`, `siteSettings.ts`

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
- **serviceCategory (10)** — All categories published with descriptions and services lists
- **client (33)** — All approved clients
- **testimonial (12)** — All linked to clients
- **caseStudy (12)** — All with rich narrative content, linked to clients/studios/testimonials

**⏳ Pending:**
- **project** — Portfolio projects (requires real project data and assets)
- **Case study images** — Cover images and gallery images for all 12 case studies

\n- STANDING RULE (Sanity): All future Sanity image fields with hotspot/crop enabled must also include a companion 'Round Crop' toggle or configuration.
