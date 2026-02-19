# Architecture — Breeze Motion Studio Website

**Last Updated:** 2026-02-18

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
- Keeping them separate avoids dependency conflicts (React 19 for both, but different build systems)
- Schema types are defined once at root and can be shared
- Each app has its own `package.json`, `tsconfig.json`, and build pipeline
- Simpler deployment: Studio deploys to Sanity Cloud, website deploys to Vercel

**Alternative considered:** Embedding Sanity Studio inside Next.js at `/studio` route. Rejected because the standalone Studio is already configured and this keeps concerns separated.

### 2. Next.js App Router

**Decision:** Use App Router (not Pages Router)

**Rationale:**
- Modern Next.js standard for new projects
- Better support for React Server Components (data fetching at server level)
- Built-in layouts for consistent navigation/footer across pages
- Streaming and Suspense support for progressive loading
- Better SEO with metadata API

### 3. Tailwind CSS for Styling

**Decision:** Tailwind CSS v4

**Rationale:**
- Utility-first approach matches the systematic design philosophy
- Easy to implement the specific color palette and typography system
- No CSS-in-JS runtime overhead
- Design tokens map directly to Tailwind config
- Fast iteration during design phase

### 4. next-sanity for Data Fetching

**Decision:** Use `next-sanity` package for Sanity integration

**Rationale:**
- Official Sanity integration for Next.js
- Provides optimized client, image URL builder, and portable text rendering
- Supports both server-side and client-side data fetching
- Built-in visual editing / live preview support
- Type generation with `sanity typegen`

### 5. Sanity Image CDN

**Decision:** Use Sanity's built-in CDN for images

**Rationale:**
- Automatic image transformations (resize, crop, format)
- Global CDN with good performance
- Integrated with the content model
- `@sanity/image-url` package for URL building
- Next.js Image component integration

### 6. Video Strategy (TBD)

**Options under consideration:**
- **Sanity file uploads** — Simple but limited for large video files
- **Mux integration** — Sanity has a Mux plugin for video streaming
- **External embedding** — Vimeo/YouTube for showcase videos
- **Self-hosted** — MP4 files on CDN for hero/background videos

**Recommendation:** Use Mux for primary video content (studio showcases, hero video) with fallback to Sanity file uploads for smaller clips. Decision pending based on video file sizes and budget.

---

## Data Flow

### Content Creation Flow
```
Editor (Sanity Studio) → Sanity Content Lake → CDN Cache → Next.js (ISR/SSR) → Browser
```

### Page Rendering Strategy

| Page | Strategy | Revalidation |
|------|----------|-------------|
| Homepage | ISR | 60 seconds |
| About | ISR | 3600 seconds (1 hour) |
| Studios (master) | ISR | 60 seconds |
| Studio sub-pages | ISR | 60 seconds |
| Case Studies listing | ISR | 60 seconds |
| Case Study detail | ISR | 60 seconds |
| Contact | Static | N/A |

ISR (Incremental Static Regeneration) ensures fast page loads with near-real-time content updates.

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
- Group related schemas with comments

### Next.js Frontend (`/web/src`)
```
src/
├── app/                    # Pages and layouts (App Router)
│   ├── layout.tsx          # Root layout (nav + footer)
│   ├── page.tsx            # Homepage
│   ├── about/
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

## Implementation Status (as of 2026-02-18)

### ✅ Completed

**Sanity Studio:**
- Custom structure (`structure.ts`) with organized sidebar navigation
- All 10 document types implemented with field groups and validation
- Shared types (ctaButton, blockContent, seoFields)
- Singleton documents properly configured
- Icons and preview configurations for all content types

**Next.js Frontend:**
- Complete page structure matching sitemap (7 routes total)
- Sanity client configured with environment variables
- GROQ queries defined for all data fetching needs
- Homepage fully implemented with:
  - Hero section with CTA buttons
  - Featured projects grid
  - Studios overview with cards
  - Process steps display
  - Featured testimonials
  - Final CTA section
- Design system partially integrated:
  - Color palette as Tailwind CSS variables
  - Typography system (Cormorant SC, Arial, Calibri)
  - Basic responsive structure

**Integration:**
- `next-sanity` package configured
- Real-time data fetching from Sanity Content Lake
- Image URL builder ready for use
- Type-safe queries with proper error handling

### 🔄 In Progress

- Design system completion (spacing, components, animations)
- Component library (Navigation, Footer, Cards, Buttons)
- Remaining page implementations (About, Studios, Case Studies, Contact)

### ⏳ Pending

- Content population via Sanity Studio
- SEO meta tags and structured data
- Image optimization and CDN configuration
- Contact form integration
- Performance optimizations
- Production deployment configuration
- Domain and DNS setup

### Technical Decisions Made

1. **Video Strategy:** Decided to use URL fields for flexibility (can support Mux, Vimeo, YouTube, or self-hosted)
2. **Portable Text:** Using standard `blockContent` schema for rich text across all documents
3. **Revalidation:** Set to `revalidate = 0` during development for immediate content updates
4. **Error Handling:** Graceful fallbacks when CMS content is not yet published
5. **Image Fields:** All images include hotspot support and required alt text for accessibility
