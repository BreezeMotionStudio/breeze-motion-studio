# Content Model — Sanity Schema Design

## Overview

This document defines the Sanity schema structure for Breeze Motion Studio. All document types, fields, and relationships are documented here as a reference for the implemented schemas in `/schemaTypes`.

**Status:** ✅ Implemented and deployed (as of 2026-02-25, Session 11)

---

## Document Types

There are **12 document types** total: 6 page singletons, 4 content collection types, 1 supporting content type, and 1 global settings singleton.

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
| `homeAbout` | heading, text, imageLeft{alt}, imageRight{alt}, imageAspectRatio *(radio: 1:1/2:3/9:16, default 1:1)*, buttons[]{label, url, style}, aboutLogo *(logo rendered inline between text halves)*, logoMaxWidth *(px, controls logo display width)*, bgVideoUrl, bgImage{alt} |
| `homeStudiosOverview` | heading, description, studioCards[]{studio→, cardImage{alt}, cardVideoUrl}, buttons[]{label, url, style}, bgVideoUrl, bgImage{alt} |
| `homeHowWeWork` | heading, sectionImage{alt} *(optional — renders between steps and button at natural dimensions)*, steps[]{stepNumber, title, description}, buttons[]{label, url, style}, bgVideoUrl, bgImage{alt} |
| `homeTestimonials` | bgVideoUrl, bgImage{alt} |
| `homeClientLogos` | clientLogos[]{client→, logoOverride{alt}, disabled} |
| `homeCta` | heading, text, buttons[]{label, url, style}, bgVideoUrl, bgImage{alt} |

**Notes:**
- `homeFeaturedWork.videoUrl` is the featured/showcase video (YouTube or direct file URL — auto-detected on frontend); currently **disabled** in CMS
- `homeAbout` section sits between Featured Work and Studios Overview; renders a 3-column layout on desktop (imageLeft | text | imageRight); images hidden on mobile; placeholder shown when no image uploaded; `imageAspectRatio` controls both containers simultaneously; `aboutLogo` renders inline between the two halves of body text with horizontal rule dividers; `logoMaxWidth` defaults to 256px if unset
- `homeStudiosOverview.studioCards[]` — each entry links a Studio document via reference and holds its own `cardImage` and `cardVideoUrl`; this is the media shown in the 1:1 square container on each studio card on the homepage. Card media set here is independent of the Studio document's own hero fields
- `homeTestimonials` renders featured testimonials (fetched via `TESTIMONIALS_QUERY`); background image/video optional
- `homeClientLogos` is a standalone section — independent of `homeTestimonials`; holds a `clientLogos[]` array where each entry links to an existing `client` document (using the client's own logo) with an optional `logoOverride` image field and a per-entry `disabled` toggle; auto-scrolls horizontally every 3 seconds; background is `#535D66` (BMS accent steel blue)
- `bgVideoUrl` on all sections is for background decoration; takes priority over `bgImage` if both set
- All bg media fields are optional; sections render without them
- `buttons[]` is a draggable array of `ctaButton` objects — editors can add/remove/reorder buttons freely

---

### 2. `aboutPage` — About Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `aboutHero` | heading |
| `aboutIntro` | text *(plain string — shown on white below hero)* |
| `aboutOverview` | overview *(blockContent)*, mission *(blockContent)* |
| `aboutFounder` | name, bio *(blockContent)*, image{alt} |
| `aboutValues` | values[]{title, description} |
| `aboutHowWeWork` | intro *(blockContent)*, steps[]{title, description} |

---

### 3. `contactPage` — Contact Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `contactHero` | heading |
| `contactIntro` | content *(blockContent)* |
| `contactDetails` | email, phone, formHeading |

---

### 4. `servicesPage` — Services Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `servicesHero` | heading |
| `servicesIntro` | text |
| `servicesCategories` | *(no fields — automatically pulls all published serviceCategory documents)* |
| `servicesCta` | heading, text, buttons[]{label, url, style} |

---

### 5. `studiosPage` — Studios Master Page (Singleton)

**Top-level fields:** `sections[]`, `seoTitle`, `seoDescription`

| Section Type | Fields |
|-------------|--------|
| `studiosHero` | heading |
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
| heroImage | image | No | Large hero image for studio page |
| displayOrder | number | Yes | Sort order on studios page |
| seoTitle | string | No | SEO override title |
| seoDescription | text | No | SEO meta description |

**Active entries:** Machine Studio (`/studios/machine`), Commercial Studio (`/studios/commercial`), Creative Studio (`/studios/creative`)

**Note:** Strategy Studio was removed from Sanity on 2026-02-25 pending a company profile repositioning. No documents referenced it at time of deletion.

---

### 8. `project` — Portfolio Entries

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Project title |
| slug | slug | Yes | URL slug |
| client | reference → client | Yes | Client this project was for |
| studio | reference → studio | Yes | Which studio this belongs to |
| services | array of reference → serviceCategory | No | Services provided |
| summary | text | Yes | Short project summary |
| description | blockContent | No | Detailed project description |
| coverImage | image | Yes | Primary project image |
| gallery | array of image | No | Additional project images |
| videoUrl | url | No | Video showcase URL (YouTube or direct file) |
| year | string | No | Project year |
| featured | boolean | No | Show on homepage featured section |
| featuredOrder | number | No | Sort order for featured display |
| displayOrder | number | No | Sort order within studio page |
| seoTitle | string | No | SEO override |
| seoDescription | text | No | SEO meta description |

---

### 9. `caseStudy` — Narrative Project Deep-Dives

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Case study title |
| slug | slug | Yes | URL slug |
| client | reference → client | Yes | Client |
| studio | reference → studio | Yes | Primary studio alignment |
| industry | string | Yes | Industry label |
| summary | text | Yes | Short summary for listing page |
| body | blockContent | Yes | Full narrative content (rich text) |
| coverImage | image | Yes | Cover image for listing |
| gallery | array of image | No | Supporting images |
| servicesProvided | array of string | Yes | List of services delivered |
| testimonial | reference → testimonial | No | Client testimonial for this project |
| year | string | No | Project year(s) |
| featured | boolean | No | Show on homepage |
| seoTitle | string | No | SEO override |
| seoDescription | text | No | SEO meta description |

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

### 12. `serviceCategory` — Service Groupings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Category name |
| slug | slug | Yes | URL slug |
| shortDescription | text | Yes | One-line description |
| services | array of string | Yes | Individual services within category |
| displayOrder | number | Yes | Sort order on services section |

**Categories (10):** Branding & Identity, Video & Motion Graphics, 3D Design & Industrial Video, Photography, Graphics & Visual Content, Print & Physical Brand Assets, Audio & Sound, Platform Design & Digital Presence Systems, System Optimisation & Workflow Architecture, Ongoing Digital Support & Maintenance

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
├── aboutPage.ts             # sections array: aboutHero, aboutIntro, aboutOverview, aboutFounder, aboutValues, aboutHowWeWork
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
├── blockContent.ts
└── shared/
    ├── ctaButton.ts
    └── seoFields.ts
```

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
