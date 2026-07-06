# Architecture — Breeze Motion Studio Website

**Last Updated:** 2026-04-14 (Session 23 — continued)

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
- Adding, removing, hiding, or reordering sections is done entirely from the CMS
- Consistent pattern across all 6 page singletons
- Section types are page-prefixed (e.g., `homeHero`, `aboutHero`) to avoid global name conflicts

**Implementation:**
- Each page schema defines a `sections` array with typed `of:` members
- Each section type includes a `disabled` boolean field ("Hide this section") — see Decision 8
- GROQ queries fetch `sections[disabled != true]{...}` — disabled sections are excluded at the query level
- Frontend `switch(section._type)` maps each type to its React component
- Existing content was migrated from flat fields to sections arrays via a one-time Node.js script

### 8. Section Disable/Enable Toggle

**Decision:** Each section has a `disabled` boolean field. Hidden sections are filtered at GROQ query time, not on the frontend.

**Rationale:**
- Allows hiding a section without deleting it — content is preserved, just not served
- Filtering at the query level (`sections[disabled != true]`) means zero frontend changes required; the section simply isn't in the response
- GROQ null semantics: `null != true` evaluates to `true`, so sections without the field (created before the toggle existed) default to visible — fully backward-compatible
- The `[HIDDEN]` prefix in the Studio preview makes the disabled state immediately visible in the section list

**Implementation:**
- `disabled` boolean field with `initialValue: false` added to every section type across all 6 page schemas
- `prepare()` functions updated to return `[HIDDEN] SectionName` as the title when disabled
- All 6 GROQ page queries use `sections[disabled != true]` as the array filter

### 9. Dynamic CTA Buttons Array

**Decision:** CTA fields in page sections use a `buttons[]` array of `ctaButton` objects, not fixed `primaryCta`/`secondaryCta` object fields.

**Rationale:**
- Native Sanity array UI gives editors add, remove, and drag-reorder without any code changes
- Removes the artificial two-button limit — any number of buttons can be configured
- `ctaButton` shared type carries `label`, `url`, and `style` (primary/secondary) — styling is data-driven, not position-driven
- Consistent with the rest of the page builder philosophy: structure from content, not code

**Applies to:** `homeHero`, `homeCta` (homePage), `servicesCta` (servicesPage), `aboutCta` (aboutPage)

### 10. Button Spacing Presets

**Decision:** `ctaButton` shared type includes `topSpacing` and `bottomSpacing` fields — 9-option preset scale from `neg-lg` (−mt-8) through `none` to `lg` (+mt-8).

**Implementation:**
- `web/src/lib/buttonSpacing.ts` — static lookup maps (`TOP_SPACING`, `BOTTOM_SPACING`) + `btnSpacingClass(topSpacing, bottomSpacing)` helper
- Applied at all button render sites: `page.tsx` (4 locations), `HowWeWorkSection.tsx`, `services/page.tsx`

### 11. Round Crop — Universal Image Field Convention

**Decision:** Every image field across all schemas includes a `roundCrop: boolean` sub-field (default `false`). When enabled, the frontend applies `rounded-full overflow-hidden` to the image container.

**Rules:**
- All future Sanity image fields must include `roundCrop`
- All future frontend image containers must support the `rounded-full overflow-hidden` variant
- `roundCrop` must be explicitly projected in all GROQ image projections

**Affected schemas:** `blockContent.ts`, `aboutPage.ts`, `client.ts`, `project.ts`, `caseStudy.ts`, `homePage.ts`, `studio.ts`, `siteSettings.ts`

### 12. Splash Accents System

**Decision:** Decorative splash graphics (white-art PNGs) rendered in section corners across all content sections. Controlled by a global `splashAccentsEnabled` toggle in `siteSettings`.

**Implementation:**
- PNG files in `/web/public/splash/`
- `SplashAccents.tsx` — server-compatible React component; props: `pattern` (0–3), `dark` (boolean); 4 patterns filling all 4 corners
- `filter: invert(1)` handles light backgrounds; no `'use client'` directive needed
- Global toggle: `siteSettings.splashAccentsEnabled` — when `false`, body gets `splash-off` class; CSS rule `.splash-off .splash-accent { display: none !important; }` in `globals.css`
- All hero sections excluded; all content sections included; parent `<section>` elements must be `relative overflow-hidden`; content wrappers must be `relative z-10`

### 13. SVG Connector Tree Animation (Studios Overview)

*(unchanged — see DESIGN_SYSTEM.md for full spec)*

### 14. Universal `sectionBackground` Type (Session 27)

**Decision:** Every section on every page uses the `sectionBackground` shared object type for all background control (solid color, gradient, or image). The legacy `bgColorField` (a plain string with a color picker) is retired from new sections.

**Rationale:**
- Single field covers solid, gradient, and image backgrounds — editors don't need three separate fields
- Shared `COLOR_LIST` (13 brand swatches) in `sectionBackground.ts` propagates the palette everywhere automatically — no per-section maintenance
- `resolveBg()` / `resolveTextClass()` / `resolveIsLight()` helpers in `web/src/lib/sectionBackground.ts` provide a backwards-compatible bridge so legacy `bgColor` string values continue rendering while all new work uses `sectionBg`
- Adding a new section in future requires only adding `sectionBg: sectionBackground` to the schema — no additional frontend logic needed

**Implementation:**
- `schemaTypes/shared/sectionBackground.ts` — defines the type; exports `COLOR_LIST` (13 swatches) used by `bgColor`, `gradientFrom`, `gradientTo` fields
- `web/src/lib/sectionBackground.ts` — `sectionBgStyle()` (original), `resolveBg()`, `resolveTextClass()`, `resolveIsLight()` (added Session 27)
- GROQ: every section projection includes `sectionBg{ bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage{ asset->{ url }, alt } }`
- Image type: `sectionBgStyle()` returns `{}` for `bgType === 'image'` — the component must render `<img>` + overlay div explicitly; pattern used in all affected section components

**Decision:** Animated SVG org-chart in `homeStudiosOverview` connecting a parent logo to sub-studio cards. Managed in `HomeStudiosOverview.tsx` as a `'use client'` component.

**Implementation:** See `DESIGN_SYSTEM.md → Motion & Animation → SVG Connector Tree Animation` for full technical spec.

### 15. Automated Bug-Prevention System (Session 32)

**Decision:** A husky + lint-staged pre-commit hook and a GitHub Actions CI workflow both run lint (and CI also runs a full production build) on every commit/push, catching real bugs — hook-order violations, refs mutated during render, etc. — before they ship.

**Rationale:** Several real bugs (React Rules-of-Hooks violations, refs set synchronously during render) had shipped silently in past sessions. A repo with two separate apps (Sanity Studio at root, Next.js in `web/`) needs both lint configs to run against only their own codebase, or one config's rules get wrongly applied to the other app's files.

**Implementation:**
- `.husky/pre-commit` runs `npx lint-staged`; `.lintstagedrc.mjs` (repo root) routes root-level TS files through the root eslint config and `web/src/**` files through `npm --prefix web run lint -- --fix` (so `web/eslint.config.mjs`'s Next.js-specific rules apply, not the Studio's).
- `.github/workflows/ci.yml` — two jobs, `studio` (root lint) and `website` (web lint + `next build`), run on every push/PR to `master`.
- Root `eslint.config.mjs` has `{ignores: ['web/**']}` — without it, root lint sweeps the entire Next.js app (and its `node_modules`) under the Sanity Studio ruleset, producing thousands of irrelevant errors.
- Two Next.js lint rules are deliberately downgraded from error → warn in `web/eslint.config.mjs`: `@typescript-eslint/no-explicit-any` (CMS section-data props are intentionally loosely typed throughout this codebase) and `react-hooks/set-state-in-effect` (the DOM-measurement-driven SVG line animations in `CoreValuesSection.tsx`/`HowWeWorkSection.tsx` legitimately need this pattern).

### 16. Portable-Text Style Marks — Sanity-Editable Color/Font/Size (Session 32)

**Decision:** Instead of a bespoke "styled string" type, three custom portable-text annotation types (`textColor`, `textFont`, `textSize`) were added to the existing shared `simpleRichText` and `blockContent` types' `marks.annotations`. Any field using either shared type automatically gains per-selection color/font/size controls, on top of the existing bold/italic/underline decorators — no per-field schema work required.

**Rationale:** Rebekah wanted every heading/label/paragraph across the site to support color, brand-font choice (Cormorant SC / Arial / Calibri only), size, and bold/italic — matching the toolbar already seen on the Contact page's intro text field. Piloted on Contact + Case Studies pages first, then rolled out sitewide once confirmed. Button labels, nav links, and form placeholders were explicitly excluded — those stay plain strings, locked to the coded design.

**Implementation:**
- `schemaTypes/shared/textMarks.ts` — the three annotation object types, plus `textStyle` (a plain, non-rich-text color/font/size object for fields whose value also drives behavior, e.g. Contact page `email`/`phone`, which stay plain strings with sibling `emailStyle`/`phoneStyle` fields rather than becoming portable text).
- `schemaTypes/shared/portableTextPreview.ts` — `plainTextFromBlocks()`, used inside `preview.prepare()` wherever a converted field used to show as a Studio list-view subtitle (a raw portable-text array renders as blank otherwise).
- `web/src/lib/textMarkStyles.ts` — `MARK_FONT_VARS`, `MARK_SIZE_VALUES`, `resolveMarkColor()`, `textStyleToCss()`; `SimpleRichText.tsx` and `PortableTextContent.tsx` both render the three new marks plus `underline` (previously defined in the schema decorators but never actually rendered on the frontend).
- Converting an existing populated `string`/`text` field to `simpleRichText` requires a one-time Sanity patch to wrap the old value as a portable-text block array, or the Studio's rich-text input won't display the existing content correctly.
- One deliberate exception: `aboutPage.aboutValues.values[].title` stayed a plain string — `CoreValuesSection.tsx` splits it into per-word stacked `<span>` lines, which conflicts with portable text (would break the layout or silently drop per-word formatting).

### 17. Content Override Patterns — Auto-Pull With Per-Page Manual Control (Session 32)

**Decision:** Two patterns, chosen by scope, for letting content that's automatically pulled from a source be swapped out or hidden per-page without touching the source:

- **Pattern A ("replace-if-populated")** — for same-document, small curated sets (e.g. a project's own image gallery feeding its own case-study slider). A second array field of the same shape; frontend does `doc.override?.length > 0 ? doc.override : doc.source`. Empty = full auto-pull; populated = full manual replacement. Used by `studiosGrid.cards` (pre-existing) and the new `project.caseStudySliderImages` (falls back to `project.deliverableImages`).
- **Pattern B (toggle + override array with auto-sync)** — for cross-document aggregation (e.g. every project's BTS image pulled onto the shared Studios page). A managed array with `enabled`/override per entry; a custom Studio input component (`BtsImagesInput.tsx`) auto-detects and patches in new source documents on mount; frontend also merges in anything not yet synced as a fallback. Used by `studiosBts`, `studiosHighlights`, `studiosLatestProjects`, `homeClientLogos`.

**Rule of thumb:** same-document + small set → Pattern A. Cross-document aggregation + potentially-growing set → Pattern B.

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
├── app/                              # Pages and layouts (App Router)
│   ├── globals.css                   # Design system tokens + Tailwind imports
│   ├── layout.tsx                    # Root layout (nav + footer, splash toggle)
│   ├── page.tsx                      # Homepage (all section renderers inline)
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── studios/
│   │   ├── page.tsx                  # Studios master page
│   │   └── [slug]/page.tsx           # Studio sub-page (hero, projects grid)
│   ├── case-studies/
│   │   ├── page.tsx                  # Case studies listing
│   │   └── [slug]/page.tsx           # Case study detail (body, gallery, testimonial)
│   └── contact/page.tsx
├── components/
│   ├── layout/
│   │   ├── Nav.tsx                   # Fixed nav, mobile hamburger, logo variants
│   │   └── Footer.tsx                # Footer with social icons, CMS-driven
│   ├── ui/
│   │   ├── Button.tsx                # black/white variants only
│   │   └── PortableTextContent.tsx   # Portable Text renderer
│   ├── HeroImageFrame.tsx            # Diagonal parallelogram hero image frame (server); placeholder when no image
│   ├── AboutMission.tsx              # Standalone mission statement with animated line reveal ('use client')
│   │   *(AboutCta is inline in about/page.tsx — dark bg CTA with optional bgImage + buttons)*
│   ├── AboutSlideshow.tsx            # Auto-sliding image column for homeAbout ('use client')
│   ├── CoreValuesSection.tsx         # Core values grid with SVG connector animation ('use client')
│   ├── MissionReveal.tsx             # Animated line + text reveal for mission/strip text ('use client')
│   ├── CollageBackground.tsx         # 4-panel angular clip-path collage background (server)
│   ├── ServiceCategoriesGrid.tsx     # Services card grid with modal overlay ('use client')
│   ├── ServiceCombinationsSection.tsx # Service combinations cards with lightbox ('use client')
│   ├── HomeStudiosOverview.tsx       # Studios connector tree ('use client')
│   ├── HowWeWorkSection.tsx          # Animated SVG process steps ('use client')
│   ├── HomeTestimonials.tsx          # Testimonials carousel ('use client')
│   ├── HomeClientLogos.tsx           # Logo strip ('use client')
│   ├── StudioCard.tsx                # Studio card (server)
│   ├── SplashAccents.tsx             # Splash graphics (server-compatible)
│   └── ScrollObserver.tsx            # Scroll reveal utility ('use client', mounted in root layout)
└── lib/
    ├── sanity/
    │   ├── client.ts
    │   ├── queries.ts                # All GROQ queries
    │   └── image.ts
    ├── buttonSpacing.ts              # Button spacing presets + helper
    ├── sectionBackground.ts          # sectionBgStyle / resolveBg / resolveTextClass / resolveIsLight / toColor
    └── sectionColors.ts              # LEGACY getBgStyle / getTextClass / isLightBg (kept for compat)
```

---

## Implementation Status (as of 2026-02-28)

### ✅ Completed

**Sanity Studio:**
- Custom structure (`structure.ts`) with 7 singletons and organized content library
- 12 document types implemented with field groups and validation
- All 6 page singletons use draggable sections array architecture
- Shared types (ctaButton with spacing presets, blockContent, bgColorField, seoFields)
- Icons and preview configurations for all content types
- Round crop boolean on every image field across all schemas
- Schema deployed to Sanity Cloud
- 75+ documents published in Sanity production dataset

**Next.js Frontend — Pages:**
- Complete page structure matching sitemap (7 routes + sub-pages)
- All 6 primary pages fully implemented as section-based renderers:
  - Homepage: homeHero, homeFeaturedWork, homeAbout, homeStudiosOverview, homeHowWeWork, homeTestimonials, homeClientLogos, homeCta
  - About: aboutHero, aboutIntro, aboutOverview, aboutMission, aboutValues, aboutCta *(live order; aboutHowWeWork in schema but not in current document)*
  - Contact: contactHero, contactIntro, contactDetails
  - Services: servicesHero, servicesIntro, servicesCategories, servicesCta
  - Studios: studiosHero, studiosIntro, studiosGrid
  - Case Studies: caseStudiesHero, caseStudiesIntro + auto listing
- Studio sub-pages (`/studios/[slug]`) — hero, purpose/description, projects grid, back link
- Case study detail pages (`/case-studies/[slug]`) — hero with client/industry/studio tags, summary+cover, portable text body, gallery, testimonial block, back link

**Next.js Frontend — Components:**
- `Nav.tsx` — fixed top nav, mobile hamburger, CMS-driven links + CTA, three logo variants (plain/round/icon) with CMS upload + size presets; active route highlighting
- `Footer.tsx` — CMS-driven links, social icons, logo variants, tagline from `siteTitle`
- `Button.tsx` (`ui/`) — `black` and `white` variants; `hover:bg-neutral-800`/`hover:bg-gray-200` + `hover:scale-105`; Arial uppercase tracking-widest; `rounded-sm`
- `PortableTextContent.tsx` (`ui/`) — Portable Text renderer for blockContent fields
- `StudioCard.tsx` — 2:3 card with 1:1 media container; YouTube iframe or `<video>` for video; hover scale pop
- `HowWeWorkSection.tsx` — animated SVG draw-on line; step-lighting via `pathFractionToTime()`; window-level hover/scroll detection with buffer + delayed deactivation; `'use client'`
- `HomeTestimonials.tsx` — auto-scrolling carousel (5s), chevron navigation, step dots, pause on hover; `'use client'`
- `HomeClientLogos.tsx` — auto-scrolling logo strip (3s), CMS client references + optional logo override, `#535D66` background; `'use client'`
- `HomeStudiosOverview.tsx` — parent logo + animated SVG connector tree (stem → arms → drops); desktop only, mobile vertical divider; `'use client'`
- `SplashAccents.tsx` — decorative splash graphics, 4 patterns, server-compatible; global toggle via `siteSettings.splashAccentsEnabled`
- `ScrollObserver.tsx` — scroll-based reveal utility

**Next.js Frontend — Utilities (`web/src/lib/`):**
- `sanity/client.ts` — Sanity client
- `sanity/queries.ts` — all GROQ queries (HOME, ABOUT, CONTACT, SERVICES, STUDIOS, CASE_STUDIES page queries + STUDIOS, STUDIO_BY_SLUG, FEATURED_PROJECTS, CASE_STUDIES, CASE_STUDY_BY_SLUG, TESTIMONIALS, SERVICE_CATEGORIES)
- `sanity/image.ts` — image URL builder
- `buttonSpacing.ts` — `TOP_SPACING`/`BOTTOM_SPACING` maps + `btnSpacingClass()` helper
- `sectionColors.ts` — `getBgStyle()`, `getTextClass()`, `isLightBg()` for CMS-driven section background colors

**Integration:**
- `next-sanity` package configured
- Real-time data fetching (`revalidate = 0`) from Sanity Content Lake
- YouTube / direct video URL auto-detection (iframe vs `<video>`)

### 🔄 In Progress

- Studios dropdown in Nav (design specifies Machine/Commercial/Creative sub-links — not yet implemented)
- Contact form backend (email routing)

### ⏳ Pending

- Nav Studios dropdown with sub-studio links
- SEO meta tags and structured data
- Image optimization (Next.js `<Image>` component adoption, lazy loading)
- Contact form + email routing to rebekah@breezemotionstudio.com
- Performance optimizations
- Production deployment configuration
- Domain and DNS setup (Namecheap → Vercel)
- Portfolio project content (real images + project documents)
- Case study cover/gallery images

### Technical Decisions Made

1. **Video Strategy:** URL field with smart detection — YouTube → iframe embed, direct files → `<video>` tag
2. **Page Architecture:** Sections array pattern for all 6 page singletons (drag-to-reorder in Studio)
3. **Portable Text:** Using standard `blockContent` schema for rich text across all documents
4. **Revalidation:** Set to `revalidate = 0` during development for immediate content updates
5. **Error Handling:** Graceful fallbacks when CMS content is not yet published
6. **Image Fields:** All images include hotspot support and required alt text
7. **Singleton IDs:** Used `createOrReplace()` via Node.js scripts for documents requiring exact IDs
8. **Section Visibility:** `disabled` boolean on each section, filtered at GROQ level — no frontend change needed to hide a section
9. **CTA Buttons:** `buttons[]` array replaces fixed primaryCta/secondaryCta — add/remove/reorder from Studio with no code changes
10. **Button Spacing:** `topSpacing`/`bottomSpacing` preset fields on `ctaButton`; `btnSpacingClass()` resolves to Tailwind mt-/mb- classes
11. **Round Crop:** Universal `roundCrop` boolean on all image fields — applied via `rounded-full overflow-hidden` in frontend; must be explicitly projected in GROQ
12. **Splash Accents:** Decorative splash graphics with global CMS toggle; server-compatible; hero sections excluded; parent sections must be `relative overflow-hidden`, content wrappers `relative z-10`
13. **SVG Connector Tree:** `stroke-dashoffset`/`pathLength="1"` animation; sequential enter/reverse exit; desktop only (`lg:block`)
