# Architecture — Breeze Motion Studio Website

**Last Updated:** 2026-02-19

## System Overview

```
┌─────────────────────┐     ┌─────────────────────┐
│   Sanity Studio      │     │   Next.js Website    │
│   (CMS / Editor)     │     │   (Public Frontend)  │
│   localhost:3333     │     │   localhost:3000      │
│                       │     │                       │
│   - Content editing   │     │   - SSR / SSG pages   │
│   - Media uploads     │     │   - Tailwind styling  │
│   - Schema management │     │   - GROQ data fetch   │
│   - GROQ playground   │     │   - Image optimization│
└──────────┬────────────┘     └──────────┬────────────┘
           │                             │
           ▼                             ▼
    ┌──────────────────────────────────────┐
    │         Sanity Content Lake          │
    │   Project: ce9w3sdr                  │
    │   Dataset: production                │
    │                                       │
    │   - Documents (JSON)                 │
    │   - Assets (images, files)           │
    │   - Real-time sync                   │
    └──────────────────────────────────────┘
```

## Architecture Decisions

### 1. Monorepo with Separate Apps

**Decision:** Sanity Studio at root, Next.js at `/web`

**Rationale:**
- Sanity Studio was scaffolded first as a standalone project
- Keeping them separate avoids dependency conflicts
- Schema types are defined once at root
- Each app has its own `package.json`, `tsconfig.json`, and build pipeline
- Simpler deployment: Studio deploys to Sanity Cloud, website deploys to Vercel

### 2. Next.js App Router

**Decision:** Use App Router (not Pages Router)

**Rationale:**
- Modern Next.js standard for new projects
- Better support for React Server Components (data fetching at server level)
- Built-in layouts for consistent navigation/footer across pages
- Better SEO with metadata API

### 3. Tailwind CSS for Styling

**Decision:** Tailwind CSS v4

**Rationale:**
- Utility-first approach matches the systematic design philosophy
- Easy to implement the specific color palette and typography system
- No CSS-in-JS runtime overhead
- Design tokens map directly to Tailwind config

### 4. next-sanity for Data Fetching

**Decision:** Use `next-sanity` package for Sanity integration

**Rationale:**
- Official Sanity integration for Next.js
- Provides optimized client, image URL builder, and portable text rendering
- Supports both server-side and client-side data fetching
- Type generation with `sanity typegen`

### 5. Sanity Image CDN

**Decision:** Use Sanity's built-in CDN for images

**Rationale:**
- Automatic image transformations (resize, crop, format)
- Global CDN with good performance
- `@sanity/image-url` package for URL building
- Next.js Image component integration

### 6. Video Strategy — URL Fields with Smart Detection

**Decision:** URL fields in Sanity with automatic YouTube/direct-file detection on the frontend

**Rationale:**
- Maximum flexibility — paste any video URL: YouTube, Vimeo, self-hosted `.mp4`
- YouTube URLs (`youtube.com/watch?v=...`, `youtu.be/...`) are auto-detected and converted to embed URLs rendered as `<iframe>`
- Direct file URLs use the native HTML `<video>` tag (autoplay, muted, looped)
- Background video sections use the same detection logic
- No additional services, plugins, or accounts required
- Mux can be added later as an enhancement if streaming quality becomes a priority

### 7. Page Builder / Sections Array Pattern

**Decision:** All page singletons use a `sections[]` array of typed objects instead of flat top-level fields

**Rationale:**
- Enables drag-to-reorder sections directly in Sanity Studio UI — no code changes needed
- Frontend maps through `sections` array and renders based on `_type` (switch/case)
- Adding or hiding sections is done entirely from the CMS
- Consistent pattern across all 6 page singletons
- Section types are page-prefixed (e.g., `homeHero`, `aboutHero`) to avoid global name conflicts

**Implementation:**
- Each page schema defines a `sections` array with typed `of:` members
- GROQ queries fetch `sections[]{...}` with explicit projections for image fields
- Frontend `switch(section._type)` maps each type to its React component
- Existing content was migrated from flat fields to sections arrays via a one-time Node.js script

---

## Data Flow

### Content Creation Flow
```
Editor (Sanity Studio) → Sanity Content Lake → CDN Cache → Next.js (ISR/SSR) → Browser
```

### Page Rendering Strategy

| Page | Strategy | Revalidation |
|------|----------|-------------|
| All pages (current) | No cache | `revalidate = 0` during development |
| Homepage | ISR (planned) | 60 seconds |
| About | ISR (planned) | 3600 seconds (1 hour) |
| Studios (master) | ISR (planned) | 60 seconds |
| Studio sub-pages | ISR (planned) | 60 seconds |
| Case Studies listing | ISR (planned) | 60 seconds |
| Case Study detail | ISR (planned) | 60 seconds |
| Contact | Static (planned) | N/A |

---

## Deployment Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Namecheap   │────▶│   Vercel     │────▶│  Next.js    │
│  DNS         │     │   Edge       │     │  (SSR/ISR)  │
│              │     │   Network    │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                                ▼
                                       ┌─────────────┐
                                       │   Sanity     │
                                       │   API + CDN  │
                                       └─────────────┘

┌─────────────┐
│  Sanity      │──── studio.breezemotionstudio.com (or Sanity-hosted)
│  Studio      │
│  (Deployed)  │
└─────────────┘
```

---

## Directory Conventions

### Sanity Schemas (`/schemaTypes`)
- One file per document type
- Use `defineType` and `defineField` from `sanity`
- Export all types from `index.ts`
- Page schemas use a `sections[]` array as the primary content field

### Next.js Frontend (`/web/src`)
```
src/
├── app/                    # Pages and layouts (App Router)
│   ├── layout.tsx          # Root layout (nav + footer)
│   ├── page.tsx            # Homepage
│   ├── about/
│   ├── services/
│   ├── studios/
│   │   ├── page.tsx        # Studios master
│   │   └── [slug]/
│   │       └── page.tsx    # Studio sub-pages
│   ├── case-studies/
│   │   ├── page.tsx        # Case studies listing
│   │   └── [slug]/
│   │       └── page.tsx    # Individual case study
│   └── contact/
│       └── page.tsx
├── components/             # Reusable components
│   ├── layout/             # Nav, Footer, etc.
│   ├── ui/                 # Buttons, Cards, etc.
│   └── sections/           # Page sections (Hero, Featured, etc.)
├── lib/                    # Utilities
│   ├── sanity/             # Sanity client, queries, helpers
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── image.ts
│   └── utils.ts
└── styles/
    └── globals.css         # Global styles + Tailwind imports
```

---

## Implementation Status (as of 2026-02-19)

### ✅ Completed

**Sanity Studio:**
- Custom structure (`structure.ts`) with 7 singletons and organized content library
- 12 document types implemented with field groups and validation
- All 6 page singletons use draggable sections array architecture
- Shared types (ctaButton, blockContent, seoFields)
- Icons and preview configurations for all content types
- Schema deployed to Sanity Cloud

**Next.js Frontend:**
- Complete page structure matching sitemap (7 routes + sub-pages)
- Sanity client configured with environment variables
- GROQ queries for all data fetching (sections-aware projections)
- All 6 primary pages fully implemented as section-based renderers:
  - Homepage (homeHero, homeFeaturedWork, homeStudiosOverview, homeHowWeWork, homeTestimonials, homeCta)
  - About (aboutHero, aboutIntro, aboutOverview, aboutFounder, aboutValues, aboutHowWeWork)
  - Contact (contactHero, contactIntro, contactDetails)
  - Services (servicesHero, servicesIntro, servicesCategories, servicesCta)
  - Studios (studiosHero, studiosIntro, studiosGrid)
  - Case Studies (caseStudiesHero, caseStudiesIntro)
- YouTube URL detection and iframe rendering for video fields
- Design system partially integrated (colors, typography)

**Integration:**
- `next-sanity` package configured
- Real-time data fetching from Sanity Content Lake
- Image URL builder ready for use
- YouTube / direct video URL auto-detection

### 🔄 In Progress

- Design system completion (spacing, components, animations)
- Component library (Navigation, Footer, Cards, Buttons)

### ⏳ Pending

- Studio sub-pages (`/studios/[slug]`)
- Case study detail pages (`/case-studies/[slug]`)
- SEO meta tags and structured data
- Image optimization and CDN configuration
- Contact form integration
- Performance optimizations
- Production deployment configuration
- Domain and DNS setup

### Technical Decisions Made

1. **Video Strategy:** URL field with smart detection — YouTube → iframe embed, direct files → `<video>` tag
2. **Page Architecture:** Sections array pattern for all 6 page singletons (drag-to-reorder in Studio)
3. **Portable Text:** Using standard `blockContent` schema for rich text across all documents
4. **Revalidation:** Set to `revalidate = 0` during development for immediate content updates
5. **Error Handling:** Graceful fallbacks when CMS content is not yet published
6. **Image Fields:** All images include hotspot support and required alt text
7. **Singleton IDs:** Used `createOrReplace()` via Node.js scripts for documents requiring exact IDs
