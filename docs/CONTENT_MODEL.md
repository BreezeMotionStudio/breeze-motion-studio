# Content Model — Sanity Schema Design

## Overview

This document defines the Sanity schema structure for Breeze Motion Studio. All document types, fields, and relationships are documented here as a reference for the implemented schemas in `/schemaTypes`.

**Status:** ✅ Implemented — All schemas complete (as of 2026-02-18)

---

## Document Types

### 1. `studio` — Sub-Studio Definitions

Defines each studio under the Breeze Motion Studio parent.

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
| heroVideo | file/url | No | Showcase video for studio page |
| displayOrder | number | Yes | Sort order on studios page |
| seoTitle | string | No | SEO override title |
| seoDescription | text | No | SEO meta description |

**Planned entries:** Machine Studio, Commercial Studio, Creative Studio, Media Systems & Brand Optimization

---

### 2. `project` — Portfolio Entries

Individual project/work entries displayed within studio pages.

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
| videoUrl | url | No | Video showcase URL |
| year | string | No | Project year (e.g., "2024") |
| featured | boolean | No | Show on homepage featured section |
| featuredOrder | number | No | Sort order for featured display |
| displayOrder | number | No | Sort order within studio page |
| seoTitle | string | No | SEO override |
| seoDescription | text | No | SEO meta description |

---

### 3. `caseStudy` — Narrative Project Deep-Dives

Detailed, editorial case studies for selected projects.

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

### 4. `client` — Client Profiles

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Company/client name |
| slug | slug | Yes | URL slug |
| industry | string | Yes | Industry category |
| description | text | No | Brief description |
| logo | image | No | Client logo |
| website | url | No | Client website URL |
| contactName | string | No | Primary contact name |
| contactRole | string | No | Contact's role/title |
| studioAlignment | array of reference → studio | No | Which studios they work with |
| approved | boolean | Yes | Approved for public display |
| displayOrder | number | No | Sort order for client displays |

**Pre-approved clients:** ROVD Group, SAR Electronics SA, Trihedron, Symec Digital, IDD, SOGA Organic, Cressi, Emily May Aesthetics, Bend Wellness, Equinox Consulting, Death By Coffee Roastery, Raylene Pilates

---

### 5. `testimonial` — Client Testimonials

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quote | text | Yes | Testimonial text |
| attribution | string | Yes | Person's name |
| role | string | No | Person's role/title |
| client | reference → client | Yes | Which client |
| featured | boolean | No | Show on homepage |
| displayOrder | number | No | Sort order |

---

### 6. `serviceCategory` — Service Groupings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Category name (e.g., "Video & Motion Graphics") |
| slug | slug | Yes | URL slug |
| shortDescription | text | Yes | One-line description |
| services | array of string | Yes | Individual services within category |
| displayOrder | number | Yes | Sort order on services section |
| icon | string | No | Icon identifier |

**Categories:** Branding & Identity, Video & Motion Graphics, 3D Design & Industrial Video, Photography, Graphics & Visual Content, Print & Physical Brand Assets, Audio & Sound, Website Design & Setup, Social Media Content & Page Management, System Optimisation & Workflow Architecture, Ongoing Digital Support & Maintenance

---

### 7. `homePage` — Homepage Content (Singleton)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| heroTitle | string | Yes | Hero section headline |
| heroSubtitle | text | No | Hero section subtext |
| heroVideo | file/url | No | Hero background video |
| heroPrimaryCta | object {label, url} | Yes | Primary CTA button |
| heroSecondaryCta | object {label, url} | No | Secondary CTA button |
| featuredWorkHeading | string | No | Featured section heading |
| studiosOverviewHeading | string | No | Studios section heading |
| studiosOverviewText | blockContent | No | Studios intro text |
| whatWeDoHeading | string | No | Services snapshot heading |
| whatWeDoText | blockContent | No | Services snapshot content |
| howWeWorkHeading | string | No | Process section heading |
| howWeWorkText | blockContent | No | Process section content |
| finalCtaHeading | string | No | Final CTA heading |
| finalCtaText | text | No | Final CTA supporting text |
| seoTitle | string | No | SEO title |
| seoDescription | text | No | SEO meta description |

---

### 8. `aboutPage` — About Page Content (Singleton)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| heading | string | Yes | Page heading |
| studioOverview | blockContent | Yes | What We Do summary |
| founderName | string | Yes | Founder name |
| founderBio | blockContent | Yes | Founder biography |
| founderImage | image | Yes | Round-cropped profile photo |
| mission | blockContent | No | Mission / philosophy |
| values | array of object | No | Core values list |
| servicesIntro | blockContent | No | Services section intro |
| howWeWorkIntro | blockContent | No | How We Work section intro |
| howWeWorkSteps | array of object | No | Process steps |
| seoTitle | string | No | SEO title |
| seoDescription | text | No | SEO meta description |

---

### 9. `contactPage` — Contact Page Content (Singleton)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| heading | string | Yes | Page heading |
| introText | blockContent | No | Introductory copy |
| email | string | Yes | Display email |
| phone | string | No | Phone/WhatsApp |
| formHeading | string | No | Form section heading |
| seoTitle | string | No | SEO title |
| seoDescription | text | No | SEO meta description |

---

### 10. `siteSettings` — Global Settings (Singleton)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| siteTitle | string | Yes | Site-wide title |
| tagline | string | No | Global tagline |
| description | text | Yes | Default meta description |
| logo | image | Yes | Site logo |
| logoLight | image | No | Light version of logo |
| socialLinks | array of object | No | Social media URLs |
| footerText | string | No | Footer copyright text |
| contactEmail | string | Yes | Primary contact email |
| contactPhone | string | No | Phone number |
| googleAnalyticsId | string | No | GA tracking ID |

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
    └── references featured projects + studios

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
aboutPage (singleton)
contactPage (singleton)
```

---

## Implementation Notes

### Completed (2026-02-18)

All schemas have been successfully implemented in `/schemaTypes` with the following structure:

- **Document types:** 10 total (studio, project, caseStudy, client, testimonial, serviceCategory, homePage, aboutPage, contactPage, siteSettings)
- **Shared types:** 3 total (ctaButton, blockContent, seoFields)
- **Organization:** Schemas use field groups for better editor UX (content, media, details, SEO)
- **Validation:** Required fields enforced, character limits on text fields, email validation
- **Previews:** Custom preview configurations for all document types
- **Studio structure:** Custom `structure.ts` organizes sidebar with singletons at top, content grouped logically

### Enhancements Beyond Original Plan

1. **Field Groups:** All major document types use groups (content, media, details, seo) for better editor organization
2. **SEO Fields:** Extracted to shared `seoFields.ts` for consistency across pages and content
3. **Process Steps:** Added to `homePage` schema as a flexible array of objects (stepNumber, title, description)
4. **Hero Image Fallback:** Added `heroImage` to `homePage` for use when video is not provided or as a poster frame
5. **Conditional Fields:** Some fields (like `featuredOrder`) are hidden when not relevant
6. **Custom Orderings:** Added sorting options (by display order, by year) to relevant document types
7. **Alt Text Validation:** Image fields include required alt text for accessibility

### File Locations

```
schemaTypes/
├── index.ts                 # Schema exports
├── siteSettings.ts
├── homePage.ts
├── aboutPage.ts
├── contactPage.ts
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

### Ready for Content

All schemas are now deployed and ready for content entry via Sanity Studio at `localhost:3333` or the deployed Studio URL.

### Content Population Progress (as of 2026-02-18 Night)

**✅ PUBLISHED — All Content Live (75 documents total):**
- ✅ **siteSettings (1)** — Fully populated with tagline, contact info, meta description
- ✅ **homePage (1)** — Homepage content blocks populated (hero, studios overview, what we do, how we work, final CTA)
- ✅ **aboutPage (1)** — Studio overview, mission, values, founder bio, services intro, process steps
- ✅ **contactPage (1)** — Heading, intro text, contact email, form heading
- ✅ **studio (4)** — All 4 studios created with full descriptions:
  - Machine Studio (with 5 detailed specialization areas)
  - Commercial Studio
  - Creative Studio (updated with latest company profile)
  - Media Systems & Brand Optimization
- ✅ **serviceCategory (10)** — 10 service categories with concise, bullet-pointed content:
  - Each with short description, detailed description (bullet format), and services list
  - PRIMARY services (7): Branding & Identity, Video & Motion Graphics, 3D Design & Industrial Video, Photography, Graphics & Visual Content, Print & Physical Brand Assets, Audio & Sound
  - SECONDARY services (3): Platform Design & Digital Presence Systems, System Optimisation & Workflow Architecture, Ongoing Digital Support & Maintenance
- ✅ **client (33)** — 33 approved clients created with industry classifications:
  - Original 12: ROVD Group, SAR Electronics SA, Trihedron, Symec Digital, IDD, SOGA Organic, Cressi, Emily May Aesthetics, Bend Wellness, Equinox Consulting, Death By Coffee Roastery, Raylene Pilates
  - Additional 21: AE Manufacturing, Bennie Bekker, Daniel Meu Amor, Ecliptic Estate Management, Erin Smith, Gourmet Gecko, GuwasVisuals, Jame Fletcher, Tinaire Van De Merwe, MAVTECH Automation, Rooftop, Sebastian Geel, Shannon Lilley, AI Apparel Solutions, Burnera Collective, CORMA, Frankie & The Misfits, Hinterveld, S4 Integration, Volkswagen Eastern Cape, DRILLX
- ✅ **testimonial (12)** — 12 client testimonials created:
  - All linked to respective clients
  - Featured status and display order configured
  - All published and live
- ✅ **caseStudy (12)** — 12 comprehensive case studies created:
  - All with rich narrative body content (Challenge → Solution → Deliverables → Outcome structure)
  - All with required references: client, studio, testimonial
  - SEO fields populated
  - Services provided lists included
  - Cover image and gallery placeholders ready for actual images
  - Studio assignments: Machine Studio (5), Commercial Studio (7)
  - **All published and live**

**Pending:**
- ⏳ **project** — Portfolio projects (requires actual project data and assets) — deferred by user
- ⏳ **Case study images** — Need to upload cover images and gallery images for all 12 case studies

**Note:** All foundational content (75 documents) is now PUBLISHED and LIVE in the production dataset, ready for consumption by the Next.js frontend. The main remaining tasks are adding real images to case studies and creating actual portfolio projects when ready.
