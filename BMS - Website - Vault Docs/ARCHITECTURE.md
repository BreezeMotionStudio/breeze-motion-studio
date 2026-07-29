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

### 18. Sitewide Hero Title Load-In Animation — `hero-catchup` (Session 33)

**Decision:** Every page hero title now animates in once on page load via a shared CSS keyframe class, `hero-catchup` (defined in `globals.css`): `translateY(36px) → translateY(0)` over 0.9s with a 0.1s delay, pure CSS, no JS/IntersectionObserver required. Applied to the hero title wrapper on Home, Studios (overview + `[slug]`), About, Services, Contact, Case Studies (listing + `[slug]` detail), and Project detail pages.

**Rationale:** The Studios page already had this exact animation; Rebekah asked for it to be consistent across every other page header. It's distinct from the separate `scroll-catchup` system (IntersectionObserver-driven, fires when a section scrolls into view, initial hidden state applied via JS after a 100ms hydration delay — used for in-page content reveals). A hero at the very top of the page is already in view on load, so the simpler load-once CSS animation is the correct tool there; `scroll-catchup` remains correct for everything below the fold.

**Implementation:** About's hero previously used `scroll-catchup` on its title wrapper — replaced with `hero-catchup`. Services, Contact, Case Studies (listing + `[slug]`), and Project `[slug]` hero title wrappers had no animation at all — added. Homepage was left untouched (already had it, and was explicitly out of scope per Rebekah's instruction).

### 19. Mobile Responsiveness — Fixed `VISIBLE` Counts Don't Reflow (Session 33)

**Decision:** Client-side carousels that compute item width as a percentage of a hardcoded "number of visible items" constant (e.g. `const VISIBLE = 3`) must make that count viewport-aware instead of a single fixed number, or narrow phone screens get item widths ~30% of the screen regardless of content.

**Rationale:** A full mobile audit (headless-browser screenshots across iPhone SE/14, large Android, and iPad widths, checking for horizontal overflow and visually spot-checking key sections) found `HomeTestimonials.tsx` hardcoded to always show 3 columns, causing testimonial quotes to wrap one word per line on a 375px phone. Fixed by computing `visible` from `window.innerWidth` (1 under 640px, 2 under 1024px, 3 above) via a small hook, recalculated on resize, with `idx` clamped to the new `maxIdx` on breakpoint change.

**Process going forward:** Before considering any new carousel/slider component "done," check it at phone width (375–428px) specifically — fixed-count grid/flex layouts are the most common mobile bug in this codebase. `CaseStudyImageSlider.tsx` avoids this class of bug entirely by using native horizontal scroll with each item sized to its own content rather than a percentage-of-N layout (see section 8 in `CONTENT_MODEL.md`).

**Local mobile testing:** With no domain attached yet, real-device testing is done over the local network — `npx next dev -H 0.0.0.0` binds the dev server to all interfaces, then any phone on the same Wi-Fi can open `http://<this-machine's-LAN-IP>:3000`. Windows already has an inbound firewall allow rule for Node.js on both Private and Public profiles, so no firewall changes were needed.

### 20. Mobile Responsiveness — Full Manual Pass Complete (Session 34)

**Decision:** The Session 33 automated pass + the Session 34 full manual/interactive pass (real-device testing over LAN, page by page) are both complete. Every page has been reviewed and fixed for mobile: Home, About, Studios (listing + detail), Services, Case Studies (listing + detail), Contact, Footer.

**Real bugs found and fixed this session (beyond the Session 33 testimonials carousel):**
- `HomeClientLogos.tsx` — same fixed-`VISIBLE`-count bug as Session 33's testimonials fix; made viewport-aware (2/4/7 under 640px/1024px/above)
- `CoreValuesSection.tsx` — the second value card had an unconditional `pl-6` offset tuned only for the desktop SVG-connector-line geometry (which the component already disables below 1024px); leaked onto mobile/tablet as a visible, unexplained indent. Scoped to `lg:pl-6`.
- Tap targets under ~44px bumped up: Nav hamburger, `ImageLightbox` close button, carousel chevrons in `HomeTestimonials`/`StudiosHighlights`/`CaseStudyImageSlider`, `StudiosLatestProjects` pagination button
- `projects/[slug]/page.tsx` supporting-videos grid used a bare `grid-cols-3`/`grid-cols-2` with no mobile breakpoint — fixed to `grid-cols-1 sm:grid-cols-3`
- Sitewide body-paragraph `text-lg` (18px, no smaller mobile step) standardized to `text-base md:text-lg` — intros, CTAs, and narrative text across every page and several shared components

**New patterns established this session:**
- **Mobile-only style overrides without touching desktop:** for anything that can't be solved with a responsive Tailwind class alone (e.g. `ScrollObserver.tsx` sets the scroll-catchup transform inline via JS, so no plain `md:` class can beat it), add a small dedicated CSS class gated by `@media (max-width: 767px)` using `!important` (see `.scroll-catchup-md-only` in `globals.css`). Used to disable the About page Founder/Studio cards' slide-up animation on mobile only.
- **Full-bleed images on mobile:** since the only horizontal constraint in most page layouts below the `lg` breakpoint is the `max-w-5xl mx-auto px-6` wrapper's own `px-6` (the `max-w` itself never binds on a phone), a plain `-mx-6` on a mobile-only (`md:hidden`) wrapper is enough to reach true edge-to-edge — no `100vw`/`calc()` viewport trick needed. Used for the About page's overview image, repositioned between the Founder/Studio cards on mobile.
- **Swipe-to-navigate carousels:** a small `touchStartX` ref + `onTouchStart`/`onTouchEnd` pair computing horizontal delta against a ~40px threshold, calling the same `nextPage`/`prevPage` functions the buttons already use. Applied to `HomeTestimonials`, `StudiosHighlights`, `StudiosLatestProjects` (which needed a `prevPage` added — it only had forward-cycling via its button before).
- **Text-legibility scrim independent of decorative overlays:** when a section's overlay gradient exists for visual/blend purposes (e.g. `HeroImageFrame`'s diagonal-edge fade, or the Studios grid cards' corner gradient) rather than guaranteed text contrast, add a *separate* flat dark scrim behind the text specifically, so legibility never depends on what happens to be in that part of the photo. Root-caused via `Commercial Studio`'s card title nearly disappearing against a bright white coat in the bottom-left of its photo, even at the card's overlay already maxed to 100% opacity.
- **Stopping an interval-driven auto-scroll on real user interaction, not any DOM event that happens to land on the element:** `onTouchStart`/`onPointerDown`/`onWheel` all fire for incidental events (e.g. scrolling the page vertically with a finger that starts on top of the element) — this looked like the auto-scroll had died completely. Fixed by flagging the auto-scroll's own `scrollBy`/`scrollTo` calls (`programmaticRef`, cleared ~700ms later) and only treating a `scroll` event as "user took over" when that flag isn't set. Used in `CaseStudyImageSlider.tsx`.

**Component/schema changes:**
- New `homeHero.subtitleDisabled` boolean field — hides just the hero subtitle paragraph from Sanity Studio without touching title/background/buttons; schema deployed
- New `StudioProjectsGrid.tsx` client component — extracted from `studios/[slug]/page.tsx`'s inline projects grid; mobile shows 6 with a load-more arrow (borderless chevron matching the carousel-arrow style, not a bordered box), desktop/tablet always renders every project with no cap
- `Footer.tsx` — social links switched from text labels to inline SVG icons (white, sized up on mobile); phone number and the "Stock Footage" social link removed from `siteSettings` in Sanity (content change, not schema); Quick Links column and the "Get In Touch" heading hidden on mobile (`hidden md:block` / `invisible md:visible` — publishing the layout parity without removing anything at `md:` and up)

### 21. Hero Text Legibility — Soft Underlay Instead of Per-Letter Text Shadow (Session 35)

**Decision:** Replaced `.hero-text-shadow` (a `text-shadow` utility applied directly to the `<h1>`/`<p>` on the studio detail hero) with `.hero-text-underlay`, a single blurred radial-gradient shape rendered behind the whole text block via a `::before` pseudo-element (`position: absolute; inset: -28px -36px; background: radial-gradient(...); filter: blur(20px); z-index: -1`) on a wrapping `<div>` around the title + tagline.

**Rationale:** `text-shadow` traces each glyph's own outline, so at large hero sizes it reads as a dark halo around individual letters rather than one cohesive shadow. Rebekah flagged this as the wrong look for the studio sub-pages. A single soft shape behind the text block (not the text itself) reads as one underlay regardless of font size or letter shapes, and works for both the title and the tagline as one unit since the underlay wraps both.

**Where used / how to extend:** Currently only on `studios/[slug]/page.tsx`'s hero. If the same per-letter-shadow problem shows up elsewhere with a hero image and `overlay={false}` on `HeroImageFrame`, reuse `.hero-text-underlay` (wrap the affected text in a `relative` div with that class) rather than reaching for `text-shadow` again.

---

### 22. Case Study Delivery — Per-Project PDF + PNG Preview Instead of a Dedicated Page (Session 36)

**Decision:** Most projects no longer get a full dedicated case-study page. Instead, `project` documents gained a `caseStudyPdf` file field (the one-page A4 case study) and a required-when-a-PDF-exists `caseStudyPdfPreview` PNG (a high-res export of that same page). Any "View Case Study" button sitewide opens `CaseStudyPdfButton` → `CaseStudyPdfViewer`, a full-screen modal showing the PNG (sized for readable text, scrolls if taller than the viewport) with a "Download PDF" button. It never navigates to a page. Only a small curated set of projects (gated by the pre-existing `showAsCaseStudy` boolean) keep the original full-page `/case-studies/[slug]` treatment, reachable only from the `/case-studies` listing's own cards.

**Rationale:** An embedded-PDF approach (`<iframe>`) was tried first and rejected — browsers render embedded PDFs inconsistently (grey letterboxing, "fit whole page" zoom makes text unreadably small with no reliable cross-browser way to force a bigger zoom). A plain PNG `<img>` in a lightbox-style modal gives full, predictable control over sizing and zoom instead.

**Where used / how to extend:** `web/src/components/CaseStudyPdfButton.tsx` / `CaseStudyPdfViewer.tsx`. The `/case-studies` listing page also has a "View More" reveal (`MoreCaseStudies.tsx`) showing every project's case study — featured or not — as small clickable thumbnails, always visible even with nothing to show. See `CONTENT_MODEL.md` and session memory `project_case_study_pdf_system.md` for the full field/validation details and the `ServiceCombinationsSection` exception (its own case-study links stay page-based, by design).

---

### 23. Contact Form — Resend, Temporarily Force-Routed Pending Domain Verification (Session 36)

**Decision:** The contact form (previously a static `<form>` with no submit handler at all) now POSTs to a Route Handler (`web/src/app/api/contact/route.ts`) which sends via Resend. The destination address is `process.env.CONTACT_TO_EMAIL_OVERRIDE || settings.contactEmail` — currently set to `rebekah@breezemotionstudio.com` in `.env.local`, not the real configured `info@breezemotionstudio.com`.

**Rationale:** Resend's free/unverified tier only allows delivery to the account's own signup email until a sending domain is verified. Rebekah's Resend account is signed up with `rebekah@`; sending straight to `info@` returned a 403. Rather than block on DNS work now, routing overrides to a known-working address unblocks the feature immediately.

**Where used / how to extend:** Remove `CONTACT_TO_EMAIL_OVERRIDE` from `.env.local` (and Vercel, once deployed) once `breezemotionstudio.com` is verified as a sending domain in Resend — do this at the same time as the domain/Vercel migration (Decision pending — see Domain/DNS row in `PROJECT_STATUS.md`), since it's a few DNS records added at the same time, not a separate task. Also swap the `from` address in `route.ts` from Resend's sandbox `onboarding@resend.dev` to a proper `noreply@breezemotionstudio.com` address once verified.

---

### 24. Image Performance — next/image via a Custom Sanity CDN Loader (Session 36)

**Decision:** Every `<img>` sitewide (~30 files) migrated to `next/image`, backed by a custom loader (`web/src/lib/sanity/imageLoader.ts`, wired in `next.config.ts` via `images.loader: 'custom'`) that requests correctly-sized images directly from Sanity's own CDN (`?w=&auto=format&q=`) rather than double-proxying through Next's built-in image-optimization server. Exactly 3 images were deliberately left as plain `<img>`: the click-to-enlarge lightbox/modal previews (`ImageLightbox.tsx`, `CaseStudyPdfViewer.tsx`, and one inside `ServiceCombinationsSection.tsx`) — these are on-demand full-size views outside the initial page load, so `next/image`'s benefits don't apply and the added sizing complexity isn't worth it.

**Rationale:** This is the standard recommended integration pattern for Sanity + Next.js — Sanity's CDN is already purpose-built for on-the-fly image resizing, so there's no reason to route that work through Next's server as well.

**Where used / how to extend:** Any new image should use `next/image` from the start. Two conversion patterns: `fill` inside a `position: relative`/fixed-aspect wrapper (the overwhelming majority of cases — backgrounds and cropped cards), or explicit `width`/`height` sourced from a `metadata{dimensions}` GROQ projection (added where missing) for natural-aspect-ratio images with no fixed crop. Portable-text inline images use `getImageDimensions()` from `@sanity/asset-utils` instead, since that asset stays as an unexpanded reference. See session memory `project_image_performance_migration.md` for the full decision tree and a gotcha: neither `tsc` nor `eslint` reliably catch every missed `<img>` — always finish with a plain `grep '<img\b'` sweep across `src/`.

---

### 25. Open Graph / Twitter Card Metadata — Shared `buildMetadata()` Helper (Session 36)

**Decision:** `web/src/lib/openGraph.ts` exports `buildMetadata({title, description, path, imageUrl, imageAlt})`, returning a full `Metadata` object with `openGraph` and `twitter: {card: 'summary_large_image'}` populated. Every page's `generateMetadata()` calls this instead of returning a bare `{title, description}` object, so social/messaging link previews (Slack, iMessage, LinkedIn, etc.) show a proper title, description, and image instead of a bare URL.

**Rationale:** No page had any Open Graph metadata before this — previously only `title`/`description` were set, which search engines use but link-preview surfaces don't. This doesn't affect search ranking (Open Graph isn't a ranking signal) but does affect how the site looks whenever a link to it is shared anywhere outside a search engine.

**Where used / how to extend:** Wired into the root `layout.tsx` (using the site logo — this also covers `/` since the homepage has no `generateMetadata` of its own and inherits the layout's) and all 8 other pages' `generateMetadata()`. Each page passes whatever hero/cover image its own query already fetches — no new Sanity queries were added for this. Any new page's `generateMetadata()` should call `buildMetadata()` rather than returning a plain metadata object.

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
│   ├── StudioProjectsGrid.tsx        # Studio detail projects grid — mobile caps at 6 w/ load-more arrow, desktop shows all ('use client', Session 34)
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
