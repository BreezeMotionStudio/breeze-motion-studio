# Project Status — Breeze Motion Studio Website

## Current Phase: Core Implementation (Near Complete)

**Last Updated:** 2026-08-11 (Session 41)

---

## Progress Overview

| Phase | Status | Notes |
|-------|--------|-------|
| Sanity Studio scaffold | ✅ Done | v5.9.0, project ID `ce9w3sdr`, dataset `production` |
| CLAUDE.md documentation | ✅ Done | Full codebase documentation |
| Project tracking (/docs) | ✅ Done | This directory |
| Next.js frontend scaffold | ✅ Done | `/web` with App Router, Tailwind, next-sanity |
| Sanity schema design | ✅ Done | See `CONTENT_MODEL.md` for schema design |
| Sanity schema implementation | ✅ Done | 12 document types + shared types implemented |
| Custom Studio structure | ✅ Done | `structure.ts` — 7 singletons + organized content library |
| Page builder architecture | ✅ Done | All pages use draggable sections arrays |
| Frontend page structure | ✅ Done | All routes created with Sanity integration |
| Homepage implementation | ✅ Done | Fully implemented with all sections |
| All pages implemented | ✅ Done | About, Studios, Case Studies, Contact, Services |
| Design system (partial) | 🔄 In Progress | Colors + fonts configured in Tailwind |
| Schema deployment | ✅ Done | Deployed to Sanity Cloud with `npx sanity schema deploy` |
| Content population | ✅ Done | All foundational content published (75+ documents) |
| Component library | 🔄 In Progress | Nav, Footer, StudioCard, HowWeWorkSection, HomeStudiosOverview, HomeTestimonials, HomeClientLogos, CaseStudyImageSlider built |
| Automated bug prevention | ✅ Done | Session 32 — pre-commit hook (husky+lint-staged) + GitHub Actions CI, both apps |
| Sanity text styling system | ✅ Done | Session 32 — color/font/size + bold/italic/underline on headings/labels/paragraphs sitewide |
| Services page category split | ✅ Done | Session 33 — "Video & Motion Graphics" split into 2 categories, now 6 total, reordered, descriptions clarified |
| Case studies redesign (listing + detail) | ✅ Done | Session 33 — white card listing, hero image, sitewide hero animation, full-bleed native-scroll image slider |
| Contact page dark-bg text contrast | ✅ Done | Session 33 — fixed hardcoded dark text on the details/form section's configurable dark background |
| Mobile responsiveness audit | ✅ Done | Session 34 — full manual/real-device pass across every page, on top of Session 33's automated pass; see decision 20 in `ARCHITECTURE.md` |
| Case study PDF system | ✅ Done | Session 36 — per-project PDF + required PNG preview replaces most dedicated case-study pages; see `CONTENT_MODEL.md` |
| Case Studies page "View More" | ✅ Done | Session 36 — reveals every project's case study (featured or not) as small clickable thumbnails |
| SEO implementation | ✅ Done | Session 36 — per-page meta tags (earlier session) + sitemap.xml, robots.txt, Organization JSON-LD, and Open Graph/Twitter card previews with page-specific images (this session) |
| Contact form integration | ✅ Done | Session 36 — Resend-powered; temporarily force-routed to rebekah@ pending domain verification, see decision 22 in `ARCHITECTURE.md` |
| Performance optimization | ✅ Done | Session 36 — every `<img>` migrated to `next/image` via a custom Sanity CDN loader (3 deliberate lightbox exceptions); see decision 23 in `ARCHITECTURE.md` |
| Deployment pipeline | Partial | Vercel linked, needs frontend config |
| Domain / DNS | Not Started | Namecheap domain → Vercel — deliberately deferred until all client projects are uploaded to Sanity |
| Console error cleanup | ✅ Done | Session 37 — null hero alt, deprecated Sanity import, logo loader warning all fixed |
| Case study fields visible for all projects | ✅ Done | Session 38 — Rebekah can now write case study copy ahead of featuring a project |
| Individual-client hero toggle | ✅ Done | Session 39 — see `ARCHITECTURE.md` decision 26 |
| Studio showcase video section | ✅ Done | Session 40 — see `ARCHITECTURE.md` decision 27; not yet populated for any studio |
| Full-site empty-text-block audit | ✅ Done | Session 41 — see below; 5 personal-client case studies deliberately left blank pending Rebekah's input |

---

## Development Log

### 2026-08-11 (Session 41) — Dev Server Hang Fix, Full-Site Text Audit, Orphan Draft Cleanup

**Dev server unresponsive again ("pages not loading"):**
- 🐛 **Bug found & fixed:** same failure mode as Session 35 — `next dev` process still `LISTENING` on port 3000 but not answering any request (curl timed out). Killed the hung PID, started a fresh `npm run dev`, confirmed HTTP 200.
- 🔍 The Sanity Studio "won't publish" report turned out not to be a bug — the publish had actually completed (likely just slow while the hung Next.js process was starving CPU/memory), and the Publish button greying out afterward is expected Studio behavior once a document has no unpublished changes left.

**Full-site audit for empty/unpopulated text fields (per the standing CMS-sync rule):**
- ✅ 4 page singletons (`homePage`, `aboutPage`, `contactPage`, `servicesPage`) had empty `seoTitle`/`seoDescription` — populated with the same copy the frontend's `||` fallback was already using (moved out of hardcoded fallback strings and into Sanity, per rule 1). Note: `homePage`'s SEO fields aren't actually wired into any `generateMetadata()` (the homepage inherits root `layout.tsx`'s metadata, sourced from `siteSettings` instead) — populated anyway for CMS completeness, but there was no rendering change to verify.
- ✅ `serviceCategory` "Digital Platforms & Systems" was missing its full `description` (had `shortDescription` only, unlike all 5 other categories) — written to match the existing bullet-list pattern, sourced from its own already-populated `serviceGroups`/`services` fields (no new claims introduced).
- ✅ `project` "Company Promo Video" (Trihedron) was missing `caseStudyOverview` (had Challenge/Approach/Outcome/Summary) — written by synthesizing the already-approved Summary/Challenge copy on that same document, not new facts.
- ⛔ **Deliberately left blank:** 4 personal/individual-client projects (Tinaire Van De Merwe "The Harpy", Al & Tee "Devotion", Erin Smith "The BlackSmith", Tammy "Skater Esque") have zero case study narrative (`caseStudyOverview`/`Challenge`/`Approach`/`Outcome`) — these only became visible in Studio after Session 38's toggle change. Writing a Challenge/Approach/Outcome narrative requires firsthand knowledge of what actually happened on each shoot, which isn't something to invent for real client work. **Rebekah still needs to write these herself** (or brief a future session with the actual details) — flagged here rather than filled with generic copy.
- ✅ Confirmed via code check that a generic sweep for empty `heading`/`text`/`label` across every page section was mostly false positives (many section types use differently-named fields — e.g. `homeHero` uses `title`/`subtitle`, not `heading`/`text` — or have no text field by design, e.g. pure content-grid sections). No further real gaps found beyond the ones above.

**Orphan draft cleanup:**
- ✅ Found and published 2 long-standing orphan drafts, both simply an uploaded image never published (not incomplete content): `serviceCategory` "Image & Photography" (category image, drafted 2026-07-27) and `client` "AE Manufacturing [Pty] Ltd." (logo, drafted back in February — previously flagged in Session 34's log as "not this session's to resolve," now resolved). Dataset has zero orphan drafts as of this session.

**New architecture decisions documented:** `ARCHITECTURE.md` decisions 26 (individual-client hero toggle) and 27 (studio showcase video section) — both had shipped in Sessions 39-40 but hadn't been written up yet.

---

### 2026-08-10 (Session 40) — Studio Showcase Video Section

- ✅ New optional video section on `/studios/[slug]`, between Overview and the Projects grid — `studio.showcaseVideo` (upload) or `studio.showcaseVideoUrl` (YouTube/Vimeo/direct link), upload takes priority, section hidden entirely if neither is set. No title. Background independently editable via `studioPageTemplate.showcaseVideoSectionBg` (new `showcaseVideo` field group). See `ARCHITECTURE.md` decision 27.
- ⏳ Not yet populated for any of the 3 studios — pending video assets from Rebekah.

---

### 2026-08-05 (Session 39) — Individual-Client Hero Toggle

- ✅ New `client.individual` boolean — when true, `projects/[slug]/page.tsx`'s hero heading falls back to the project title instead of the client's real name. Fixes personal photoshoot clients (portrait series) having their name displayed as the large hero heading. See `ARCHITECTURE.md` decision 26, session memory `project_individual_client_toggle.md`.

---

### 2026-08-04 (Session 38) — Case Study Fields Always Visible in Studio

- ✅ `project.ts`: case study fields (`caseStudyOverview`/`Challenge`/`Approach`/`Outcome`) no longer hidden unless `showAsCaseStudy` is on — Rebekah wants to write case study copy for any project in advance, not only the curated featured set.

---

### 2026-08-03 (Session 37) — Console Error Cleanup

- 🐛 **Bug found & fixed:** `HeroImageFrame`'s alt-text default only caught `undefined`, not the `null` that Sanity's GROQ projection returns for an unset `alt` field — `next/image` was flagging missing alt on every hero image across About/Services/Studios/Case Studies/Contact.
- 🐛 **Bug found & fixed:** switched to `@sanity/image-url`'s named export (deprecated default-export usage was warning).
- 🐛 **Bug found & fixed:** local fallback logo images marked `unoptimized` to silence the custom-loader width warning (the custom Sanity CDN loader can't size a local `/public` file).

---

### 2026-07-29 (Session 36) — Case Study PDF System, Contact Form Email, SEO, Image Performance

**Case study delivery redesigned (see `ARCHITECTURE.md` decision 22):**
- ✅ Most projects now deliver their case study as a PDF (`project.caseStudyPdf`) + a required companion PNG preview (`project.caseStudyPdfPreview`) instead of a dedicated page — schema validation blocks publishing one without the other
- ✅ "View Case Study" anywhere on the site opens a full-screen modal (`CaseStudyPdfButton`/`CaseStudyPdfViewer`) showing the PNG (sized for readable text, scrolls if taller than the screen) with a Download PDF button — never navigates to a page
- ✅ Only the small curated `showAsCaseStudy` set keeps the original full-page `/case-studies/[slug]` treatment; old full-page-only Studio fields now hidden unless that flag is on
- ✅ `/case-studies` listing gained a "Featured Case Studies" heading and an always-visible "View More" reveal (`MoreCaseStudies.tsx`) showing every project's case study (featured or not) as small clickable thumbnails
- 🐛 **Bugs found & fixed along the way:** a pre-existing empty (no-asset) Behind the Scenes image slot and an over-length Short Summary field were both blocking publish on the one live project — unrelated to this session's schema changes, just surfaced when validation ran; a hardcoded `text-black` heading was invisible against the Case Studies listing's actual (dark, Sanity-configured) background — fixed by deriving color from `resolveTextClass` instead of assuming a light section

**Contact form now sends real email (see `ARCHITECTURE.md` decision 23):**
- ✅ New `/api/contact` Route Handler sends via Resend; client-side `ContactForm.tsx` replaces the old static form (which had no submit handler at all)
- ⚠️ **Temporarily force-routed** to `rebekah@breezemotionstudio.com` via `CONTACT_TO_EMAIL_OVERRIDE` in `.env.local` instead of the real `info@breezemotionstudio.com` — Resend's unverified-domain sandbox only allows delivery to the account's own signup address. Remove the override (and verify `breezemotionstudio.com` as a Resend sending domain) at the same time as the domain/Vercel migration
- ✅ Confirmed end-to-end working — test email received and independently re-tested by Rebekah

**SEO basics filled in:**
- ✅ `web/src/app/sitemap.ts` — dynamic sitemap pulling all published studios/projects/featured-case-studies from Sanity
- ✅ `web/src/app/robots.ts` — points at the sitemap
- ✅ Organization JSON-LD structured data added sitewide in `layout.tsx`

**Image performance (see `ARCHITECTURE.md` decision 24):**
- ✅ Every `<img>` sitewide (~30 files) migrated to `next/image`, backed by a new custom Sanity CDN loader (`web/src/lib/sanity/imageLoader.ts`) so images are correctly resized by Sanity's own CDN instead of double-proxying through Next's image server
- ✅ 3 click-to-enlarge lightbox/modal previews deliberately left as plain `<img>` (on-demand full-size views, outside the initial-load performance budget)
- 🐛 **Found & removed:** one genuinely dead function (`AboutSideImage` in the homepage, defined but never called)
- ✅ End-of-session verification: `tsc --noEmit` (0 errors), `npm run lint` (0 errors, warnings down from 149 → 83, all remaining ones pre-existing/accepted), `npm run build` (succeeds, all routes compile), full page-by-page HTTP smoke test (all 200s)

**Open Graph / Twitter card metadata (see `ARCHITECTURE.md` decision 25):**
- ✅ New shared `buildMetadata()` helper (`web/src/lib/openGraph.ts`) wired into every page's `generateMetadata()` — each page now gets a proper social-share preview card (title, description, image) instead of none at all
- ✅ Each page uses its own hero/cover image already available from its existing query (no new fetches added); homepage uses the site logo; a branded default image covers any page with nothing more specific
- ✅ Verified live via `curl` on every route — each has the correct page-specific `og:image`, not one generic image reused everywhere

**Studio structure fix:**
- ✅ Content Library's "Case Studies" list renamed to **"Featured Case Studies"** and its filter changed from a narrative-field-presence heuristic to checking `showAsCaseStudy == true` directly — the old heuristic became unreliable once those narrative fields were hidden-unless-featured earlier this session

**Investigated and deliberately left alone:**
- 🔍 Found that the brand heading font (Cormorant SC) never actually loads anywhere in the codebase (no `next/font`/`@font-face`/font `<link>` — confirmed by reading every relevant file) and silently falls back to the browser's default serif. Raised with Rebekah; she confirmed she likes the current fallback look and explicitly declined the fix. **Do not "fix" this without asking again** — see `feedback_font_fallback_is_intentional` session memory.
- 🔍 Reviewed the legacy `caseStudy` archive (12 documents, retired document type) — confirmed with Rebekah to keep all 12 indefinitely as reference material for when she uploads matching new projects soon, rather than deleting or bulk-migrating now. See `project_legacy_case_study_archive` session memory.

---

### 2026-07-16 (Session 35) — Dev Server Hang Fix, Studio Hero Text Shadow Redesign

**Dev server unresponsive ("website won't load"):**
- 🐛 **Bug found & fixed:** the `web/` dev server process was still listening on port 3000 but not responding to any request (hung, not crashed/stopped) — `curl` timed out after 15s instead of getting a connection refused. Killed the hung `next dev` process and started a fresh one; confirmed HTTP 200 on reload. Distinct from the known "server stopped" failure mode already covered by `feedback_dev_server_must_stay_running` session memory — this one still shows up as LISTENING in `netstat`, so a port check alone isn't enough to confirm the server is actually healthy; an HTTP request is needed.

**Studio sub-page hero text shadow (see `ARCHITECTURE.md` decision 21):**
- ✅ Replaced `.hero-text-shadow` (`text-shadow`, applied directly to the hero `<h1>`/`<p>` on `studios/[slug]/page.tsx`) with `.hero-text-underlay` — a single blurred radial-gradient shape behind the whole title+tagline block via a `::before` pseudo-element, instead of a shadow outlining each letter
- ✅ Old class removed from `globals.css` (was unused elsewhere); title + tagline now wrapped in one `<div className="hero-text-underlay">` instead of each carrying the shadow class individually

---

### 2026-07-15 (Session 34) — Full Mobile Responsiveness Pass (Every Page)

**Goal:** Complete the manual/real-device mobile pass deferred from Session 33 — go page by page, fix what's actually broken or cramped on a phone, verify each change on the LAN dev server.

**Homepage:**
- ✅ Hero: added `homeHero.subtitleDisabled` boolean field (Sanity-editable — hides just the subtitle text, keeps title/bg/buttons); title locked to one line (`whitespace-nowrap` + fluid `clamp(1.1rem,6vw,4.5rem)` font-size instead of fixed breakpoint steps) so "Breeze Motion Studio" can never wrap mid-word; mobile hero height changed to `min-h-[85svh] sm:min-h-screen` so the title/buttons sit closer to true center on a phone (accounts for mobile browser chrome); title→button gap increased (`mb-6`→`mb-10`)
- ✅ About section: description text-size stepped down for mobile (`text-base md:text-lg`); heading split into two stacked lines ("About" / "Breeze Motion Studio") via plain-text extraction + word-split, matching the `CoreValuesSection` stacked-title convention
- ✅ Call to Action section: description text matched to the About section's sizing
- 🐛 **Bug found & fixed:** `HomeClientLogos.tsx` had the same hardcoded-`VISIBLE`-count bug as Session 33's testimonials fix (`LOGO_VISIBLE = 7` regardless of viewport) — made viewport-aware (2/4/7)
- ✅ Testimonials ("What Our Clients Say"): chevron arrows hidden on mobile (`hidden sm:block` — were eating too much of a 375px screen alongside a fixed `gap-10`, squashing the quote column); added touch-swipe (40px threshold, reuses existing `nextPage`/`prevPage`); gap above the dot indicators tightened (`mt-10`→`mt-0` + `leading-none` on the footer, since the real remaining gap was line-height slack, not the margin); vertical divider line between quote cards removed entirely
- ✅ Footer: social links switched from text labels to inline SVG icons (Instagram/Facebook/LinkedIn/SoundCloud + generic fallback), white, sized up on mobile (`w-10 h-10` vs `w-6 h-6` desktop); phone number and the "Stock Footage" social link removed from `siteSettings` in Sanity (content only, no schema change); Quick Links column hidden on mobile (`hidden md:block`); "Get In Touch" heading hidden on mobile while the email moved to render under the social icons instead

**About page:**
- ✅ Founder/Studio card backgrounds: horizontal bleed (`-inset-x-7`, tuned for desktop) was actually exceeding the mobile container's own padding, pushing the card past the screen edge — scoped to `-inset-x-3 md:-inset-x-7`
- 🐛 **Bug found & fixed:** the two cards' vertical bleed (`-inset-y-8`, 32px each) exactly canceled out the grid's row-gap (`gap-16`, 64px) on mobile, leaving zero visible space between the stacked cards — fixed via `gap-y-[5.5rem] md:gap-y-16`
- ✅ Scroll-triggered slide-up animation disabled on mobile only for these two cards, via a new `.scroll-catchup-md-only` CSS class (media-query + `!important`, since `ScrollObserver.tsx` sets the transform inline via JS and a plain responsive class can't win against that)
- ✅ Overview image repositioned: on mobile it now renders as a grid item between the Founder/Studio cards (was below both, full-bleed via `-mx-7`) — the mobile instance uses `-mx-6` for true edge-to-edge (the only horizontal constraint below `lg` is the wrapper's own `px-6`, no viewport-width trick needed); desktop keeps the original position/treatment via `hidden md:block`
- ✅ Core Values: each value now sits in an outlined rounded box (`border border-[#535D66]/35 rounded-2xl`, `p-6 sm:p-8`) — applied to the same div that already handles the hover/scroll scale, so the border scales with it
- 🐛 **Bug found & fixed (same session, code audit):** `CoreValuesSection.tsx`'s second value card had an unconditional `pl-6` — a desktop-only offset for the SVG connector-line geometry (already disabled below 1024px) — leaking an unexplained indent onto mobile/tablet; scoped to `lg:pl-6`

**Studios pages:**
- ✅ Listing page: bigger gap between studio cards on mobile (`gap-3`→`gap-6 md:gap-3`); more top/bottom section padding on mobile (`py-10` vs `md:py-4 lg:py-6 xl:py-8`, decoupled from horizontal padding)
- 🐛 **Bug found & fixed:** Commercial Studio's card title was nearly unreadable — its photo has a bright white coat filling the bottom-left corner, and the existing diagonal overlay gradient (already configured at max 100% opacity) is only fully opaque right at the corner pixel. Added a fixed `bg-gradient-to-t from-black/85 via-black/25 to-transparent` scrim behind the text on all three cards, independent of the configurable diagonal gradient — protects against any future photo with a bright bottom area, not just this one
- ✅ `StudiosHighlights.tsx` rebuilt to exactly match `StudiosLatestProjects.tsx` — same header (label + line + dot pagination + single next-arrow button, no more chevron-flanked sliding track or 3s auto-advance), same card sizing (`text-xl` title, `text-sm` tagline, `mb-4`, 24×24 placeholder icon), same `grid-cols-1 md:grid-cols-3` (dropped the old `sm:grid-cols-2` step)
- ✅ Swipe-to-navigate added to both `StudiosHighlights` and `StudiosLatestProjects` (the latter needed a `prevPage` function added — it only had forward-cycling via its button before)
- ✅ Studio detail hero: `HeroImageFrame.tsx` (shared across every page hero — About/Services/Studios/Case Studies/Contact too) had only a diagonal-edge-blend gradient, not a guaranteed-legibility one; added a flat `bg-black/55` scrim across the whole clipped image area
- ✅ New `StudioProjectsGrid.tsx` client component, extracted from the inline projects grid: mobile shows 6 with a load-more arrow that reveals 6 more per click (stacks downward, stays visible until everything's shown); desktop/tablet always render every project with no cap, rows just keep adding as more are added in Sanity. Arrow style matched to the borderless carousel-chevron pattern used elsewhere (not a bordered/circular button) — 56×28 downward chevron, no border, grey→white hover + slight scale

**Services page:**
- ✅ Example service cards: number + title now sit side by side on mobile (`flex items-start`, top-aligned so a wrapping title only extends downward, never up past the number) — was stacked vertically (number row, then title row) since the desktop 3-column grid collapses to 1 column on mobile; title sized down to `text-lg` for the mobile row specifically (desktop title unaffected, separate element)

**Contact page:**
- ✅ Message textarea made taller (`rows={6}`→`rows={9}`)

**Case study detail pages:**
- ✅ `CaseStudyImageSlider.tsx`: removed the left/right white fade overlays and the prev/next chevron arrow buttons (native touch-scroll/swipe already works without them); quote/testimonial text sized down (`text-xl`→`text-base`)
- 🐛 **Bug found & fixed:** after removing the arrow buttons, added `onTouchStart`/`onPointerDown`/`onWheel` to permanently stop the 4s auto-scroll on user interaction — but those events fire for *any* touch/wheel input landing on the element, including just scrolling the page vertically past that section, so auto-scroll appeared to die immediately. Fixed by flagging the auto-scroll's own `scrollBy`/`scrollTo` calls (`programmaticRef`, ~700ms) and only treating a `scroll` event as "user took over" when that flag isn't set
- ✅ Narrative Challenge/Approach/Outcome image placeholders were `hidden md:flex` (invisible on mobile) — made visible on all breakpoints so it's clear where an image will go once one is uploaded

**Sitewide:**
- ✅ Body-paragraph `text-lg` (18px, no smaller mobile step) standardized to `text-base md:text-lg` across every page intro/CTA and several shared components (`AboutMission`, `MissionReveal`, `ServiceCombinationsSection`) — the same fix originally piloted on the homepage About/CTA sections
- ✅ Tap targets under ~44px bumped: Nav hamburger (24px→padded to ~44px), `ImageLightbox` close button, carousel chevrons in `HomeTestimonials`/`StudiosHighlights`/`CaseStudyImageSlider`, `StudiosLatestProjects` pagination button (36px→44px)
- ✅ Shared `Button` component: added `text-center` to guard against a long label wrapping to two lines and defaulting to left-aligned on a narrow phone; same fix applied to two one-off buttons outside the shared component (services modal "Close", desktop Nav CTA)
- 🐛 **Bug found & fixed:** `projects/[slug]/page.tsx`'s supporting-videos grid used a bare `grid-cols-3`/`grid-cols-2` with no mobile breakpoint, squeezing video embeds into ~110px columns on a phone — fixed to `grid-cols-1 sm:grid-cols-3` / `grid-cols-1 sm:grid-cols-2`

**End-of-session verification:** full `tsc --noEmit` (0 errors), `npm run lint` (0 errors, 145 pre-existing warnings — all `no-explicit-any`/`set-state-in-effect`/`no-img-element`, none new), production `next build` (succeeds), and an HTTP smoke test of every static page plus all dynamic routes (all studios, the one case-study-enabled project) — all 200s. One pre-existing unpublished draft found (`client` doc "AE Manufacturing [Pty] Ltd.", created February 2026, unrelated to this session) — left untouched, not this session's to resolve. 🐛 **Bug found & fixed during this final check:** `StudioProjectsGrid.tsx`'s load-more arrow had been temporarily forced visible (`hasMore || true`) earlier in the session so Rebekah could review its design against real carousel-arrow styling on a studio with only 1 project — reverted to the real `hasMore` condition before ending the session.

---

### 2026-07-13 (Session 33) — Services Category Split, Case Studies Redesign, Contact Contrast Fix, Mobile Audit

**Services page — category split & reorder:**
- ✅ Split the single "Video & Motion Graphics" `serviceCategory` document into two standalone documents: **Video & Videography** (video production only) and **Motion Graphics** (motion graphics + "Cinematic 3D Showcases" sub-group, kept together per Rebekah's choice)
- ✅ Renamed "Photography" → **Image & Photography**; clarified scope in both `shortDescription` and `description` — real image capture and photo editing only (not graphic design), all shot onsite, no indoor studio shoots
- ✅ Reordered categories twice per Rebekah's feedback; final live order: Video & Videography → Image & Photography → Audio & Sound → Motion Graphics → Graphic Design → Digital Platforms & Systems
- ✅ Trimmed a stray parenthetical off the Digital Platforms & Systems "Platform Design & Configuration" tag
- 🐛 **Bug found & fixed:** the new Motion Graphics category didn't appear on the live page after being created and published — root cause was `servicesPage`'s `servicesCategories` section `orderedCategories[]`, a manually curated reference array that overrides the full live category query (see `ARCHITECTURE.md` decision 17, Pattern A) and hadn't been updated to include the new document. Fixed and documented the gotcha directly on the field in `CONTENT_MODEL.md` so it isn't missed again.

**Case studies listing page (`/case-studies`) redesign:**
- ✅ Each case study now sits on its own white, rounded-corner card that scales up slightly on hover (was a plain divided list row)
- ✅ All card text switched to fixed dark colors — fixes a latent bug where the CTA link was hardcoded black regardless of the section's actual (possibly dark) background
- ✅ Added a "Case Study" kicker label above each title — new `listingKickerLabel` field on `caseStudiesPage` (Sanity-managed, not hardcoded, per standing CMS-sync rule)
- ✅ Added `heroImage` to `caseStudiesHero` (schema + query + component) — now matches every other page's hero pattern
- ✅ Switched `CASE_STUDIES_PAGE_QUERY` from `*[_type == "caseStudiesPage"][0]` to `*[_id == "caseStudiesPage"][0]` (see `feedback_sanity_singleton_queries` — was violating the standing singleton-query rule)

**Case study detail page (`/case-studies/[slug]`) — image slider redesign:**
- ✅ Moved `CaseStudyImageSlider` to render directly above the testimonial section (was below it, just above the CTA)
- ✅ Redesigned to full-bleed, edge-to-edge: images touch both sides of the section completely, with a light white gradient fade on each edge and the prev/next arrows overlaid on top; no section background visible anywhere
- ✅ Replaced the old equal-width/percentage-transform carousel (which cropped every image into an identical box) with a native `overflow-x-auto` scroll track — each image keeps its own original aspect ratio at a fixed height, stacked back-to-back with no gaps; section height now hugs the image strip exactly (no vertical padding/background)

**Sitewide hero title animation (see `ARCHITECTURE.md` decision 18):**
- ✅ Rolled out the Studios page's `hero-catchup` load-in animation to every other page header title that lacked it: About (replaced `scroll-catchup`), Services, Contact, Case Studies listing, case study detail, and project detail. Homepage explicitly excluded (already had it).

**Contact page — dark background text contrast fix:**
- 🐛 **Bug found & fixed:** the contact details/form section's left column ("Get In Touch" heading, email/phone labels + values, note text) had several hardcoded `text-black`/dark-grey classes that assumed the section was always on a white background — but the section's actual configured background in Sanity is a dark gradient, making that text nearly invisible. Added a `resolveIsLight()` check so all five text elements adapt between dark/light variants, matching the pattern already used elsewhere on the site.

**Mobile responsiveness (see `ARCHITECTURE.md` decision 19):**
- ✅ First automated audit pass — headless-browser screenshots across iPhone SE (375px), iPhone 14 (390px), large Android (412px), and iPad (768px) widths for every page, checking for horizontal overflow and console errors; none found
- 🐛 **Bug found & fixed:** `HomeTestimonials.tsx` had a hardcoded `VISIBLE = 3` column count with no mobile breakpoint, squeezing testimonial quotes into ~30%-width columns on phones (text wrapping one word per line). Made the visible count viewport-aware (1 / 2 / 3 columns under 640px / 1024px / above) via a resize-aware hook
- ✅ Set up local-network mobile testing since the site has no domain attached yet: `next dev -H 0.0.0.0` + confirmed Windows firewall already allows inbound Node.js connections — Rebekah confirmed the site loads correctly on her phone over Wi-Fi at the machine's LAN IP
- ⏳ Full manual mobile pass (beyond the automated check) planned for next session

---

### 2026-07-06 (Session 32) — Bug Prevention System, Case Studies Redesign, Sitewide Text Styling, Case Study Image Slider

**Bug audit & fixes:**
- ✅ `HomeClientLogos.tsx`, `HomeTestimonials.tsx` — hooks (`useState`/`useRef`/`useCallback`) were declared *after* an early `return null`, violating React's Rules of Hooks (crash risk if data went empty↔populated between renders); moved all hook declarations before any early return
- ✅ `HomeClientLogos.tsx`, `CoreValuesSection.tsx`, and (found later in the same session) `HowWeWorkSection.tsx`, `StudiosHighlights.tsx` — the "latest ref" pattern (`someRef.current = fn`) was set synchronously during render; moved into a bare `useEffect` (React-legal, same effective timing)
- ✅ `PortableTextContent.tsx` — no `types.image` renderer existed, so any image inserted into a rich-text field (about/contact/studio/case-study/service pages, via the shared `blockContent` type) silently never appeared on the site; added, using the existing `urlFor()` helper
- ✅ `HomeStudiosOverview.tsx` — internal `/studios` link used a plain `<a>` instead of `next/link`, forcing a full page reload
- ✅ `ServiceCategoriesGrid.tsx` — `stripImage`/`stripColor`/`stripOpacity` fields accepted and even pre-computed but never rendered anywhere, confirmed via git history to have been true since the fields were first added (not a regression) and confirmed via Sanity that no real content had ever been set; removed the fields from schema, GROQ query, `services/page.tsx`, and the component, and cleared/republished the live document
- ⚠️ Correction: `studio.description` ("Specializations" field) was initially wired up as a "missing content" fix, then reverted at Rebekah's request — it was intentionally not meant to display (see [[feedback_unrendered_fields_not_always_bugs]] session memory: an unrendered-but-populated field is not automatically a bug)

**Automated bug-prevention system (see `ARCHITECTURE.md` decision 15):**
- ✅ `.husky/pre-commit` + `.lintstagedrc.mjs` — lints/auto-fixes staged files on every commit, routed through the correct app's own eslint config (root Studio vs `web/`)
- ✅ `.github/workflows/ci.yml` — lint + full `next build` on every push/PR, as a second line of defense
- ✅ Root `eslint.config.mjs` scoped away from `web/**` (was previously applying the Studio ruleset to the entire Next.js app)
- ✅ Two Next.js rules downgraded error→warn to avoid blocking on intentional existing patterns: `@typescript-eslint/no-explicit-any`, `react-hooks/set-state-in-effect`

**Studio pages — design simplification (Rebekah's design call, not a bug fix):**
- ✅ Removed the "Specializations" list render from studio pages (see correction above)
- ✅ Removed the project-summary paragraph from project cards in the studio-page Projects grid — cards now show image/title/client/year only

**Case Studies listing page redesign:**
- ✅ Removed the "01" index number and category/industry tag from each card; replaced category with project year
- ✅ Removed the off-white hover backdrop on the whole card row
- ✅ Cover image container corners slightly rounded (`rounded-sm`)
- ✅ "Read Case Study" CTA text: black + underlined, lightens (`text-black/60`) on hover
- ✅ Description text lightened to `text-bms-grey-400`; title no longer changes color on hover
- ✅ New `listingSectionBg` field (sectionBackground type) — the listing cards section itself is now Sanity-editable (color/gradient/image), matching every other page section
- ✅ New `caseStudiesCta` section type — heading, text, buttons[], sectionBg; always renders at the very bottom of the page below the listings regardless of position in the sections array; populated with a live "Start a Project" default and the same standard CTA background image used on About/Studios CTAs
- ✅ Fixed the same CTA's image background not rendering — `resolveBg()` returns `{}` for `bgType: 'image'` by design (see `ARCHITECTURE.md` decision 14); needed the manual `<img>` + overlay pattern already used on `AboutCta`

**Sitewide text-styling system — Sanity-editable color/font/size (see `ARCHITECTURE.md` decision 16, `CONTENT_MODEL.md` "Text Style Marks"):**
- ✅ Piloted on Contact + Case Studies pages first, then rolled out to Home, About, Studios (listing + `[slug]` template), Services, and the Project/Case Study/Studio page templates
- ✅ New shared types `textColor`/`textFont`/`textSize` (portable-text annotations, added to both `simpleRichText` and `blockContent`) and `textStyle` (plain object, for value-driving fields like Contact's `email`/`phone`)
- ✅ Scope: headings, section labels, and paragraphs only — button labels, nav links, and form placeholders intentionally left as plain strings (locked to the coded design), per explicit decision
- ✅ One further exception: `aboutValues.values[].title` stayed a plain string (conflicts with `CoreValuesSection.tsx`'s per-word stacked-line layout)
- ✅ All existing live string content migrated into portable-text-array shape via Sanity patches so no copy was lost; republished
- ✅ Schema deployed each phase

**Case study image slider (see `ARCHITECTURE.md` decision 17, `CONTENT_MODEL.md` section 8):**
- ✅ New `CaseStudyImageSlider.tsx` — flush-packed, fixed-height carousel before the CTA on every case study page; 4 images visible at a time, auto-advances every 4s, chevron arrows, click-to-enlarge via the existing `ImageLightbox`; same carousel architecture as `StudiosHighlights`/`HomeClientLogos`
- ✅ Images auto-pulled from `project.deliverableImages` by default
- ✅ New `project.caseStudySliderImages` field — populate to fully replace the automatic pull for the slider only, without touching `deliverableImages` (Content Override Pattern A)
- ✅ Documented the two established "auto-pull with per-page override" patterns (same-document replace-if-populated vs. cross-document toggle+override-array) as a standing rule for future pages, per Rebekah's request for a consistent approach

---

### 2026-06-29 (Session 31) — Full CMS Editability Audit & Fix

**Goal:** Complete 100% Sanity editability — no hardcoded labels, headings, or UI text anywhere on the site.

**Schema additions (20 new fields across 8 schema files):**
- ✅ `homePage.ts` — `homeFeaturedWork.heading` ("Featured Work")
- ✅ `caseStudiesPage.ts` — top-level `listingCtaLabel` ("Read Case Study →")
- ✅ `aboutPage.ts` — `aboutValues.heading` ("Core Values")
- ✅ `servicesPage.ts` — `servicesStrip.heading`; `servicesCategories.readMoreLabel`, `servicesIncludeLabel`, `closeLabel`; `serviceCombinations.typicallyIncludesLabel`, `viewCaseStudyLabel`
- ✅ `siteSettings.ts` — footer column headings: `footerLinksHeading`, `footerContactHeading`, `footerFollowHeading`; `footerPlainLogo.logoImage` and `footerRoundLogo.logoImage` image fields; site `description` field
- ✅ `caseStudyPageTemplate.ts` — `backLabel` ("← Case Studies")
- ✅ `studioPageTemplate.ts` — `backLabel` ("← Studios")
- ✅ `projectPageTemplate.ts` — `deliverablesLabel`, `viewCaseStudyLabel`
- ✅ `studiosPage.ts` — `studiosGrid.exploreLabel` ("Explore Studio →")
- ✅ `contactPage.ts` — `contactDetails.getInTouchLabel`, `emailLabel`, `phoneLabel`
- ✅ Schema deployed

**Frontend wiring (11 pages/components updated):**
- ✅ `web/src/app/layout.tsx` — converted static `metadata` export to async `generateMetadata()` fetching site title + description from Sanity; passes footer heading props to Footer
- ✅ `web/src/components/layout/Footer.tsx` — footer column headings and logo image URLs from Sanity (fallback `/logo.png`)
- ✅ `web/src/app/page.tsx` — `homeFeaturedWork` heading wired
- ✅ `web/src/app/case-studies/page.tsx` — `listingCtaLabel` wired into `CaseStudiesListings`
- ✅ `web/src/app/case-studies/[slug]/page.tsx` — `backLabel` wired
- ✅ `web/src/app/studios/[slug]/page.tsx` — `backLabel`, `overviewLabel`, `overviewSubtext`, `projectsLabel` wired; CDN fallback image pattern fixed (solid/gradient via `resolveBg`, image via manual img+overlay)
- ✅ `web/src/app/projects/[slug]/page.tsx` — `deliverablesLabel`, `viewCaseStudyLabel` wired; same CDN fallback fix
- ✅ `web/src/app/studios/page.tsx` — `exploreLabel` wired into `StudiosGrid`
- ✅ `web/src/app/about/page.tsx` — values heading, how-we-work heading, founder/studio card headings wired
- ✅ `web/src/app/contact/page.tsx` — `getInTouchLabel`, `emailLabel`, `phoneLabel` wired
- ✅ `web/src/app/services/page.tsx` — all new label props wired into `ServiceCategoriesGrid` and `ServiceCombinationsSection`
- ✅ `web/src/components/CoreValuesSection.tsx` — accepts `heading?` prop
- ✅ `web/src/components/ServiceCategoriesGrid.tsx` — accepts `readMoreLabel?`, `servicesIncludeLabel?`, `closeLabel?`
- ✅ `web/src/components/ServiceCombinationsSection.tsx` — accepts `typicallyIncludesLabel?`, `viewCaseStudyLabel?`

**Also completed (carried forward from Session 30):**
- ✅ `PROJECT_PAGE_TEMPLATE_QUERY` updated with `deliverablesLabel`, `viewCaseStudyLabel`
- ✅ `STUDIO_PAGE_TEMPLATE_QUERY` includes `backLabel`, `overviewLabel`, `overviewSubtext`, `projectsLabel`
- ✅ `CASE_STUDY_PAGE_TEMPLATE_QUERY` includes `backLabel`
- ✅ `SITE_SETTINGS_QUERY` includes `description`, footer headings, logo image URLs

---

### 2026-06-14 (Session 30) — Services CTA Fix, Studio Sub-Pages Redesign & Project Page Template

**Services page — CTA background:**
- ✅ Removed `bg-gradient-to-b from-black to-transparent` top gradient overlay from `ServicesCta`
- ✅ Removed redundant `bg-black/70` overlay; re-added `bg-black/65` to match studios CTA standard
- ✅ Final state: `bg-black` fallback + standard CTA background image + `bg-black/65` overlay (matches homepage/studios CTA)

**Studio sub-pages (`/studios/[slug]`) — full redesign:**
- ✅ Specializations redesigned from `PortableTextContent` block to compact pill tags — `font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white bg-black border border-black px-3 py-1.5 rounded-sm`
- ✅ Specializations extracted from `description` field via inline filter (bold-first-child blocks only)
- ✅ Overview section always renders `studio.purpose` as plain text (was conditionally rendering PortableText)
- ✅ Tagline `<p>` had `max-w-xl` removed — prevents multi-line wrapping on all studio taglines
- ✅ CTA section: `bg-bms-dark-400` fallback + standard CTA background image (`05b32c4153168a8465c443af641d1859f9389cac`) + `bg-black/55` overlay — matches homepage CTA exactly
- ✅ All 4 sections template-driven via `STUDIO_PAGE_TEMPLATE_QUERY` / `studioPageTemplate` singleton
- ✅ Unused `parseSpecializations()` helper retained but simplified; final extraction is a single inline filter

**New `studioPageTemplate` schema and singleton:**
- ✅ New file `schemaTypes/studioPageTemplate.ts` — fields: `heroSectionBg`, `overviewSectionBg`, `projectsSectionBg`, `ctaSectionBg`, `ctaHeading`, `ctaText`, `ctaButtonLabel`, `ctaButtonUrl`
- ✅ Registered in `schemaTypes/index.ts` and `structure.ts` (SINGLETONS array + "Studio Page Template" item under Sub Page Templates)
- ✅ `STUDIO_PAGE_TEMPLATE_QUERY` added to `web/src/lib/sanity/queries.ts` using `*[_id == "studioPageTemplate"][0]`
- ✅ Schema deployed

**Studio schema field renames (Sanity Studio labels only):**
- ✅ `purpose` field title: "Purpose" → **"Overview"**
- ✅ `description` field title: "Full Description" → **"Specializations"**; description updated to "List of specializations only — each item should be a bold title"

**Studio content updates (Sanity):**
- ✅ Machine Studio: specializations set to 7 tags — Factory Showcases, Machine Showcases, Digital and Simulation Showcases, Events and Tradeshows, Training & Instructional Media, Industrial 3D Model Collaborations, Turnkey Project Showcases
- ✅ Commercial Studio: specializations set to 6 tags — Brand Identity & Visual Systems, Campaign Photography & Videography, Commercial Product Showcases, Retail & Lifestyle Content, Broadcast & Social Media Reels, Strategic Brand Consulting
- ✅ Creative Studio: specializations set to 6 tags — Documentary Cinematography, Music & Artist Content, Independent Film & Narrative Projects, Fine Art Photography, Creative Direction & Concept Development, Personal Brand & Signature Storytelling
- ✅ Commercial Studio description fixed: "We deliver" → "Breeze Motion Studio delivers" (brand voice rule)
- ✅ Creative Studio description fixed: "we tailor" → "projects are tailored" (brand voice rule)
- ✅ All documents published

**Project page (`/projects/[slug]`) — final template redesign:**
- ✅ Hero: project title + year as black tag pills (removed client name from pills)
- ✅ Hero h1: `project.client?.name || project.title` — client name is the primary heading
- ✅ Removed client industry tag; removed services tags block below deliverables
- ✅ Removed testimonial section entirely
- ✅ Removed white-background inline case study section
- ✅ New "View Case Study" section: `bg-black`, only shown when `hasCaseStudy` is true; image background support via `caseStudySectionBg` from template; white `Button` centered
- ✅ Cleaned up all removed variables (`testimonialBg`, `testimonialBgImg`, `hasTestimonialBgImage`)
- ✅ `PROJECT_PAGE_TEMPLATE_QUERY` already existed and fetches `caseStudySectionBg`; `projectPageTemplate` singleton confirmed in Sanity with section backgrounds configured
- ✅ All new projects added via Sanity automatically inherit the full template — no per-project wiring required

---

### 2026-05-25 (Session 29) — Studios Page Fixes, Service Combinations Styling & BTS Image Labels

**Studios page — `sectionBg` wiring:**
- ✅ `StudiosBts` and `StudiosLatestProjects` were ignoring `s.sectionBg` entirely — both had hardcoded backgrounds with no `style` prop; added `sectionBgStyle` import and wiring to both components
- ✅ `StudiosHighlights` was already correct

**Studios page — project cards:**
- ✅ Studio name removed from the meta row on `StudiosLatestProjects` and `StudiosHighlights` project cards — client name only; studio label was crowding the text

**Studios page — BTS image labels:**
- ✅ Project name displayed permanently at bottom-left of each BTS image card (was hover-only)
- ✅ Client name added above project title (muted, small caps)
- ✅ Image caption added below project title (muted, small caps) — sourced from `btsImages[].caption` on the project
- ✅ Display order: client name (top) → project title (middle, main) → image caption (bottom)
- ✅ GROQ query updated: `client->{name}` and `caption` added to `firstBtsImage` projection for both `btsImages[]` and `allProjectBts`
- ✅ `BtsImageItem` type extended with `clientName` and `imageCaption`; page resolver threads both through

**Studios page — BTS empty asset fix:**
- ✅ `btsImages[0]` on a project could be an empty placeholder entry (no asset uploaded) — query now uses `btsImages[defined(asset)][0]` throughout to skip empties
- ✅ `BtsImagesInput` auto-pull filter changed from `defined(btsImages[0])` to `count(btsImages[defined(asset)]) > 0`
- ✅ `project.ts` schema: added `validation: r.required()` to `btsImages` array member — prevents empty image entries being saved in future

**Service combinations section (`ServiceCombinationsSection.tsx`):**
- ✅ Background set to pure white in Sanity (`#FFFFFF`)
- ✅ Removed top/bottom black gradient overlays (were designed for dark background)
- ✅ Card borders removed entirely; replaced with `shadow-[0_8px_32px_rgba(0,0,0,0.18)]` drop shadow
- ✅ Heading: `text-white/80` (slightly off-white); intro: `text-white/50` (muted)

**Core Values section — black rectangle bug fixed:**
- ✅ SVG cover rects (masking the animated line behind value cards) were rendering black instead of white
- ✅ Root cause: `toColor(undefined)` returns `'#000000'` (truthy), so `|| '#FFFFFF'` fallback never fired
- ✅ Fix: check for a colour value before calling `toColor`; default to `#FFFFFF` when none set

**Sanity content — CTA backgrounds:**
- ✅ `studiosCta` — standard CTA background image set via `sectionBg`; "Get in Touch" button added linking to `/contact`
- ✅ `aboutCta` — standard CTA background image set via `sectionBg` (had legacy `bgImage` field set but `sectionBg` was null)

---

### 2026-05-25 (Session 28) — Studios Page Inline Toggles, BTS Auto-Pull & Autopulled Badge

**Inline ON/OFF toggles for Highlights and Latest Projects:**
- ✅ `InlineToggleItem` custom Sanity component (`schemaTypes/components/InlineToggleItem.tsx`) — renders an ON/OFF pill button directly on each array item row using `components.item`; no need to open items individually
- ✅ Uses `useFormValue(['_id']) + useClient` pattern for direct document patching (Sanity `ObjectItemProps` has no `onChange`); optimistic UI via `pending` state
- ✅ Applied to `studiosHighlights.highlights[]` and `studiosLatestProjects.latestProjects[]` item member definitions via `components: {item: InlineToggleItem}`
- ✅ Schema deployed

**BTS section full redesign — managed array with auto-pull:**
- ✅ `studiosBts.btsImages[]` redesigned from a simple auto-query to a fully managed array with two member types:
  - `projectBts` — links a project reference; uses `imageOverride` if set, otherwise pulls `project.btsImages[0]` at query time; fields: `enabled`, `autoPulled` (hidden), `label`, `caption`
  - `manualBts` — standalone uploaded image; fields: `image` (required), `label`, `caption`
- ✅ `BtsImagesInput` custom Sanity component (`schemaTypes/components/BtsImagesInput.tsx`) — on mount, queries all projects with `defined(btsImages[0])`, finds ones not already in the array, and patches them in as `projectBts { autoPulled: true }` entries; returns `renderDefault(props)` — no separate preview panel
- ✅ All auto-pulled and manual items are drag-reorderable, togglable, deletable, and have image override support — single unified list
- ✅ `autoPulled` hidden boolean field added to `projectBts` member schema so the flag persists after auto-patching
- ✅ Red "autopulled" badge on `InlineToggleItem` — positioned left of the ON/OFF button; visible only when `value.autoPulled === true`

**Query and frontend updates:**
- ✅ `STUDIOS_PAGE_QUERY` `btsImages[]` projection updated: `_type, _key, enabled, project->{_id, "firstBtsImage": btsImages[0]{asset->{url}, alt}}, imageOverride{asset->{url}, alt}, image{asset->{url}, alt}, label, caption`
- ✅ GROQ conditional projection added: `_type == "studiosBts" => { "allProjectBts": *[_type == "project" && defined(btsImages[0])] | order(completedAt desc, _createdAt desc){ _id, "firstBtsImage": btsImages[0]{asset->{url}, alt} } }` — supplies unmanaged project BTS for append at end
- ✅ `studios/page.tsx` BTS resolution: managed enabled items first (in array order) + unmanaged projects appended at end; handles both `projectBts` (imageOverride or firstBtsImage) and `manualBts` item shapes
- ✅ Sections always render even when empty — removed all `return null` early exits from `StudiosHighlights`, `StudiosLatestProjects`, `StudiosBts`
- ✅ Schema deployed

---

### 2026-05-25 (Session 27) — Background Standardisation, Studios Page & Responsive Fixes

**Background field standardisation — all sections now use `sectionBackground`:**
- ✅ `sectionBackground` shared type (`schemaTypes/shared/sectionBackground.ts`) promoted to universal background field across every section on every page — replaces all legacy `bgColorField` uses
- ✅ `bgColorField` is now legacy; retained in codebase but no longer added to new sections
- ✅ New fields added: `sectionBg: sectionBackground` on every section in `aboutPage.ts`, `contactPage.ts`, `homePage.ts`, `studiosPage.ts`, `servicesPage.ts`; standalone `bgImage` and `bgColor` string fields removed from sections that only ever had one or the other
- ✅ Three new helper functions in `web/src/lib/sectionBackground.ts`:
  - `resolveBg(sectionBg?, legacyBgColor?)` — resolves to `CSSProperties`; checks `sectionBg` first, falls back to legacy string
  - `resolveTextClass(sectionBg?, legacyBgColor?, defaultIsLight?)` — returns `'text-white'` or `'text-black'`
  - `resolveIsLight(sectionBg?, legacyBgColor?)` — returns boolean; used to pick button variant
- ✅ All 10 frontend files updated to use the new helpers (`about/page.tsx`, `contact/page.tsx`, `page.tsx`, `services/page.tsx`, `studios/page.tsx`, `CoreValuesSection.tsx`, `HomeStudiosOverview.tsx`, `HomeTestimonials.tsx`, `HowWeWorkSection.tsx`, `StudiosHighlights.tsx`)
- ✅ GROQ queries updated for HOME, ABOUT, CONTACT pages: `sectionBg{ bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage{ asset->{ url }, alt } }` projected on every section
- ✅ Schema deployed

**sectionBackground — gradient color dropdowns:**
- ✅ `gradientFrom` and `gradientTo` fields changed from free-text inputs to dropdown selects
- ✅ `bgColor` (solid) also changed from free-text to dropdown select
- ✅ Shared `COLOR_LIST` constant (13 swatches): Pure Black `#000000`, Deep Black `#0d0d0d`, Near Black `#333333`, Steel Blue Dark `#363F47`, Charcoal Dark `#3F3F3F`, Dark Blue-Grey `#444E57`, Charcoal `#4B4B4B`, Steel Blue — Accent `#535D66`, Dark Grey `#999999`, Mid Grey `#CCCCCC`, Light Grey `#E6E6E6`, Off-White `#F5F5F5`, Pure White `#FFFFFF`
- ✅ `COLOR_LIST` is shared across all three fields — identical palette on solid, gradient start, and gradient end
- ✅ Schema deployed

**Studios page improvements:**
- ✅ `StudiosHighlights` section moved above the studio grid (was below) — highlights → grid → BTS → latest projects
- ✅ `StudiosHighlights` default background changed from `bg-white` to `bg-[#0d0d0d]` — matches the dark service categories grid
- ✅ `StudiosHighlights` updated for dark default: divider `bg-white/10`, chevrons `text-[#555] hover:text-white`, dot indicators `bg-white/20`, card titles `text-white`
- ✅ `studiosHighlights` section in `studiosPage.ts` now has `sectionBg: sectionBackground` for optional override
- ✅ `studiosGrid` section now has `sectionBg: sectionBackground`
- ✅ Studio cards container changed from CSS grid to `flex flex-wrap justify-center` — odd card (e.g. 3 studios) auto-centres; each card `w-full md:w-[calc(50%-6px)]`

**Responsive design improvements (site-wide):**
- ✅ Hero H1 headings: added `sm:`/`md:` size steps on all page heroes to scale gracefully from mobile to desktop
- ✅ Section H2 headings: added `sm:text-3xl md:text-4xl` responsive steps where missing
- ✅ CTA H2 headings: same responsive scaling applied
- ✅ `StudiosHighlights` hardcoded 3-column grid replaced with responsive flex/wrap
- ✅ Various layout gaps and padding reviewed across pages
- ✅ Footer grid: responsive column stacking verified

---

### 2026-05-25 (Session 26) — Project Detail Pages, Portfolio Infrastructure & Content Display

**Project schema — full rebuild (groups: basics, deliverables, bts, caseStudy, settings, seo):**
- ✅ Removed legacy `gallery` and `videoUrl` fields
- ✅ `deliverableImages` — drag-and-drop gallery (`options.layout: 'grid'`); no forced aspect ratio; empty slots skipped in render
- ✅ `deliverableVideos` — array of video objects (platform/url/title); first item = featured full-width embed; remaining = centered supporting grid (1→max-w-sm, 2→2-col, 3+→3-col)
- ✅ `btsNote`, `btsImages` (gallery), `btsVideos` (array of video objects) — Behind the Scenes group
- ✅ `showAsCaseStudy` renamed → **"Feature on Case Studies Page"** — controls public listing only; content fields always visible
- ✅ `caseStudyOrder`, `caseStudyOverview`, `caseStudyChallenge`, `caseStudyApproach`, `caseStudyOutcome`, `testimonial` (reference) — Case Study group; hidden condition removed from content fields (only `caseStudyOrder` stays hidden unless featured)
- ✅ `status` (draft/inProgress/complete), `completedAt` (date, hidden unless complete) — drives default sort order
- ✅ `isHighlight` / `highlightOrder` — appears in highlights carousel on Studios page
- ✅ `manualOrder` / `displayOrder` — optional pin override; GROQ `select(manualOrder == true => displayOrder, 9999) asc, completedAt desc` sorts pinned first
- ✅ `sectionOrderVideos` (default 1), `sectionOrderImages` (default 2), `sectionOrderBts` (default 3) — configurable per project in Settings tab; frontend sorts media sections by these values
- ✅ Schema deployed

**Case Studies architecture — unified with projects:**
- ✅ `caseStudy` standalone document type retired; all case studies are now `project` documents
- ✅ `/case-studies` listing queries `*[_type == "project" && showAsCaseStudy == true]`
- ✅ `/case-studies/[slug]` detail page works for any project by slug (no `showAsCaseStudy` filter)
- ✅ Sanity Case Studies sidebar auto-populates: filter `defined(caseStudyOverview) || defined(caseStudyChallenge) || defined(caseStudyApproach) || defined(caseStudyOutcome)` — no toggle needed to appear in Studio
- ✅ `CASE_STUDY_BY_SLUG_QUERY` updated to query `project` type + include new fields
- ✅ `CASE_STUDIES_QUERY` updated to query `project` type with `showAsCaseStudy == true`

**New page: `/projects/[slug]`:**
- ✅ Server component with full project detail layout
- ✅ Sections in order: Hero (cover bg, studio back link, client/industry/studio/year tags) → Overview (cover + summary + description + services) → [sorted media sections] → Case Study CTA strip → Testimonial → CTA
- ✅ Media sections rendered in configured order (`sectionOrderVideos/Images/Bts`)
- ✅ `PROJECT_BY_SLUG_QUERY` added to `queries.ts`

**Project pages — video gallery:**
- ✅ Section labelled "Video Gallery"; section background black
- ✅ First video = featured (full-width `aspect-video`)
- ✅ Supporting videos grid: 1→`grid-cols-1 max-w-sm mx-auto`, 2→`grid-cols-2 max-w-2xl mx-auto`, 3+→`grid-cols-3`
- ✅ YouTube embeds: `?vq=hd1080&rel=0`; Vimeo embeds: `?quality=1080p`

**Project pages — image gallery:**
- ✅ Section labelled "Image Gallery"; `bg-[#F5F5F5]`
- ✅ All images at full natural dimensions: `w-full h-auto` — no forced aspect ratio, no cropping, no height cap
- ✅ Empty grid cells skipped (items without `asset.url` render null, not empty `<div>`)

**Project pages — behind the scenes:**
- ✅ Black background (`bg-black`), white/70 note text — distinct from image gallery
- ✅ Same natural-dimensions display and empty-cell fix as image gallery

**Project pages — case study:**
- ✅ Full inline narrative (overview/challenge/approach/outcome) removed from project pages
- ✅ Replaced with a minimal strip: `Case Study ——— [View Case Study →]` button
- ✅ Button appears when case study content exists, regardless of `showAsCaseStudy` status
- ✅ Links to `/case-studies/[slug]` — works for featured and non-featured alike

**Project cards — all made clickable:**
- ✅ `StudiosLatestProjects.tsx` — conditional Link wrapper; title gets `group-hover:text-bms-accent`
- ✅ `StudiosHighlights.tsx` — same conditional Link wrapper pattern
- ✅ `studios/[slug]/page.tsx` — project cards wrapped in Link

**Studios nav dropdown:**
- ✅ Desktop: hover state on "Studio" link shows left-aligned dropdown panel with per-studio sub-links
- ✅ Transparent 12px bridge div prevents dropdown from closing when mouse moves from link to panel
- ✅ No chevron icon
- ✅ Mobile: studio sub-links as indented items with left border below "Studio"
- ✅ `layout.tsx` fetches studios and passes to Nav; `STUDIOS_QUERY` used

**Contact page:**
- ✅ Hover animation (`hover:scale-[1.015]`) removed from form container div

**New components added:**
- ✅ `web/src/components/ui/VideoEmbed.tsx` — YouTube (watch/shorts), Vimeo, and fallback link; 1080p quality params
- ✅ `web/src/components/StudiosLatestProjects.tsx` — dark section with pagination
- ✅ `web/src/components/StudiosHighlights.tsx` — auto-scrolling highlights carousel (3s, 3-per-page, chevrons + dot indicators)
- ✅ `web/src/app/projects/[slug]/page.tsx` — full project detail page

---

### 2026-04-30 (Session 25) — Service Combinations Content Library, Contact Form Container, CTA Fixes & Visual Tweaks

**Service combinations migrated to standalone content library documents:**
- ✅ New `serviceCombination` document type (`schemaTypes/serviceCombination.ts`) — fields: `title`, `subtitle`, `description` (simpleRichText), `items[]` (string array), `caseStudySlug`, `bgImage`, `images[]`
- ✅ `serviceCombinations.combinations[]` in `servicesPage.ts` changed from inline objects to `reference` array pointing to `serviceCombination` documents
- ✅ `structure.ts` updated: "Services Combination Examples" entry added to Content Library section; type excluded from auto-generated list
- ✅ `SERVICES_PAGE_QUERY` updated: `combinations[]{ _key, ...@->{ _id, title, subtitle, description, items, caseStudySlug, bgImage { asset->{ url }, alt }, images[]{ asset->{ url }, alt } } }` — key preserved from ref array item, fields dereferenced from document
- ✅ 5 combination documents created and published in Sanity (Brand Startup Collection, Media Overhaul, Industrial/Technical Showcase, System Diagnosis, Private Creative Collection)
- ✅ `servicesPage.serviceCombinations.combinations[]` patched to reference all 5 documents; published
- ✅ Schema deployed

**Contact page — form container background:**
- ✅ `formBg` field (`sectionBackground` type) added to `contactDetails` schema — supports solid/gradient/image background
- ✅ Form column wrapped in styled container: `rounded-xl`, `hover:scale-[1.015] transition-transform duration-300`, defaults to `bg-black` when no Sanity background set
- ✅ Image background variant: `<img>` absolutely positioned + `bg-black/60` overlay
- ✅ All form inputs/text set to white: `text-white`, `placeholder-white/70`, `border-white/30`, focus `border-white`
- ✅ "Get In Touch" left-column label changed from `text-bms-grey-400` to `text-black`
- ✅ `CONTACT_PAGE_QUERY` updated: `formBg { bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt } }` projected
- ✅ Schema deployed

**Services CTA — bgImage fix + description:**
- ✅ `SERVICES_PAGE_QUERY` `servicesCta` section was missing explicit `bgImage{asset->{url}, alt}` projection — `...` spread doesn't dereference; added explicit projection, background image now loads correctly
- ✅ `servicesCta.text` populated in Sanity: "Email me directly to set up a meeting." — published

**Shadow gradient system — services page:**
- ✅ `ServiceCombinationsSection.tsx`: two shadow overlays — `top-0 h-32 bg-gradient-to-b from-black to-transparent` (blends from strip above) and `bottom-0 h-64 bg-gradient-to-t from-black to-transparent` (gradual fade into CTA below)
- ✅ `ServicesCta` (`services/page.tsx`): retains its own `top-0 h-32 bg-gradient-to-b from-black to-transparent` overlay for additional blending at section top

**ServiceCombinationsSection — card border:**
- ✅ Card border changed from `border border-[#222222]` to `border-2 border-[#888888]` — thick medium-grey border on all combination cards

**Services CTA — spacing fix:**
- ✅ `ServicesCta` description paragraph spacing reduced from `mb-24` to `mb-8` — tighter gap between description and button

**Industrial/Technical Showcase combination — copy update:**
- ✅ Subtitle updated to: "Media coverage for businesses in the industrial sector."
- ✅ Description updated to: "Full media coverage for industrial and technical operations — video showcases, environment photography, aligned graphics and motion, and cinematic 3D renderings."
- ✅ Items list confirmed: full industrial video showcases, photography, aligned motion graphics, aligned graphic design, cinematic 3D renderings

---

### 2026-04-18 (Session 24) — About Page Column Boxes, Core Values Inversion, Services Connector, Collage Removal, Contact Enhancements

**About page — black boxes behind Founder and Studio columns (`aboutOverview`):**
- ✅ Two black boxes with rounded corners (`rounded-xl`) added behind each column via absolute-positioned `div` (`absolute -inset-y-8 -inset-x-7 bg-black -z-10 rounded-xl`) — extends wider than the column text without affecting grid spacing
- ✅ All text inside both columns inverted to white; center alignment applied
- ✅ Staggered scroll reveal: outer `scroll-catchup` div on each column; Studio column has `style={{ transitionDelay: '300ms' }}` for left-then-right sequence
- ✅ Hover scale: inner div carries `hover:scale-[1.02] transition-transform duration-500 ease-out` — separated from scroll div to avoid CSS transform conflict between `translateY` (scroll) and `scale` (hover)
- ✅ Both outer and inner divs are `h-full` — ensures columns stretch to equal grid row height and boxes stay bottom-aligned

**About page — Studio overview copy (Sanity):**
- ✅ `aboutOverview.overview` text rewritten in Sanity to remove all "we/our/us" wording and shortened; published

**Core Values section — inverted to white:**
- ✅ `CoreValuesSection.tsx` background changed from `bg-black` → `bg-white`; SVG `coverFill` changed from `#000000` → `#FFFFFF` (cover rect now hides line on white not black)
- ✅ Section heading label (`text-white/60`) → `text-black/60`
- ✅ Core value h3 titles: added explicit `text-black`

**Services page — `ServiceCategoriesGrid` visual overhaul:**
- ✅ Collage background removed; section now uses single `bgImage` pointing to the same wide panoramic image as the homepage studios section (Sanity asset `image-605724ed48a5120f6bca9ca0f1258277e07dad83-6780x2160-jpg`); `bg-black/55` overlay
- ✅ Section title shadow: hard black box replaced with full-width radial gradient overlay (`radial-gradient(ellipse 40% 80% at 50% 10%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, transparent 100%)`) — `height: 340px`, `inset-x-0`, `pointer-events-none`, `z-[2]`
- ✅ Animated SVG connector tree added (same architecture as `HomeStudiosOverview`): stem → left branch → center drop → right branch; positioned `top: 118px`, desktop only (`hidden lg:flex`), `max-w-6xl px-6`; drops end at `y=62` (not touching card tops)
- ✅ Branch paths use `strokeLinejoin="round"` for rounded corners; all elements `strokeLinecap="round"`
- ✅ Connector timing: enter delays 0/100/100ms (stem/arms/drops); exit delays 600/400/400ms — activates faster than homepage
- ✅ Section title changed in Sanity from "Our Services" → "Services"

**Homepage — `HomeStudiosOverview` connector tree refinements:**
- ✅ Drop line endpoint shortened: `y2="106"` → `y2="82"` — drops no longer touch studio card tops; `overflow: visible` retained on SVG
- ✅ Branch paths converted to `<path>` elements with `strokeLinejoin="round"` — joints between arm and drop are now smoothly rounded; `pathLength="1"` retained for animation

**Footer:**
- ✅ Tagline `text-sm` → `text-xs` — visually smaller below the studio name

**Contact page — left column note + Sanity-editable placeholders:**
- ✅ Contact note (`s.note`) rendered below email/phone list in left column; `font-[--font-body] text-base text-black leading-relaxed mt-10 max-w-[260px]`; only renders when field is populated
- ✅ Form input placeholders now read from Sanity: `s.namePlaceholder`, `s.emailPlaceholder`, `s.companyPlaceholder`, `s.messagePlaceholder`; all fall back to sensible defaults if blank
- ✅ `contactDetails` schema: added `note` (text, rows 3), `namePlaceholder`, `emailPlaceholder`, `companyPlaceholder`, `messagePlaceholder` (all string) fields
- ✅ Schema deployed

**Button component — global cursor:**
- ✅ `cursor-pointer` added to `BASE` string in `web/src/components/ui/Button.tsx` — applies to all buttons and anchor buttons site-wide without individual class additions

**ServiceCombinationsSection — white background, no collage:**
- ✅ Section always `bg-white`; `CollageBackground` import and render block removed entirely
- ✅ Top black gradient shadow div (`from-black via-black/40`) removed
- ✅ Heading/intro wrapper `bg-black px-8 py-14` box removed; heading always `text-black`; intro always `text-[#4B4B4B]`
- ✅ Example combination cards (dark `#141414` bg, white text) left completely unchanged

**Collage setup documented:**
- ✅ Full collage implementation details (both `services` and `examples` variants) saved to session memory (`project_collage_setup.md`) — full panel clip-path geometry, JSX wiring, schema fields, GROQ additions, re-creation checklist

---

### 2026-04-14 (Session 23) — Hero Image Frames, Image Load Optimisation, Mission Statement Standalone Section

**Hero image loading performance:**
- ✅ `SectionBg` component in `web/src/app/page.tsx` given `priority` prop (default `false`)
- ✅ `HomeHero` passes `priority` — hero image now gets `fetchPriority="high"` + `loading="eager"`
- ✅ All non-hero `SectionBg` images get `fetchPriority="low"` + `loading="lazy"` (defers CTA bg image etc.)
- ✅ All `SectionBg` images now append `?w=1920&auto=format&q=80` — Sanity CDN serves WebP at correct resolution

**Diagonal hero image frame — all page hero sections:**
- ✅ New component `web/src/components/HeroImageFrame.tsx` — diagonal parallelogram covering the right 57% of the hero; `clip-path: polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)`; gradient softens left diagonal edge into the dark background; images served at `?w=1400&auto=format&q=80`; `fetchPriority="high"` + `loading="eager"`
- ✅ Empty-state placeholder: same clip-path shape, `bg-white/[0.04]` fill, camera icon + "Hero Image" label centred in visible area — always rendered so the frame is visible before an image is uploaded
- ✅ `heroImage` field (image, hotspot + alt) added to `aboutHero`, `contactHero`, `servicesHero`, `studiosHero` schemas
- ✅ Individual studio hero (`studios/[slug]`) converted from full-bleed `opacity-30` background to the same diagonal frame
- ✅ All four page GROQ queries updated: `heroImage{asset->{url}, alt}` projected
- ✅ Schema deployed

**About page — standalone Mission Statement section:**
- ✅ New section type `aboutMission` added to `aboutPage` schema — `heading` (string, default "Mission"), `text` (blockContent — full rich text), `bgImage` (image + hotspot), `bgColor`
- ✅ `intro` and `missionBgImage` fields removed from `aboutValues` schema (Studio UI fields gone; data preserved in document)
- ✅ New component `web/src/components/AboutMission.tsx` (`'use client'`) — identical animated line reveal to `MissionReveal` but renders `PortableTextContent` instead of a plain string; full paragraph/bold/italic/link support
- ✅ `aboutMission` section inserted into live document; pre-populated with existing mission text ("To deliver distinctive creative and digital solutions…") and existing background image reference; published
- ✅ `ABOUT_PAGE_QUERY` updated: `bgImage{asset->{url}, alt}` projected (covers the new `aboutMission.bgImage`)

**About page — schema & document cleanup:**
- ✅ `aboutFounder` section type removed from `aboutPage` schema (bio has always lived in `aboutOverview`; section was `disabled: true` in document)
- ✅ Disabled `aboutFounder` document entry removed from the live Sanity document via MCP patch + republish
- ✅ `AboutFounder` component and `case "aboutFounder"` renderer removed from `about/page.tsx`
- ✅ `aboutOverview` Studio title renamed from "Studio Overview & Mission" → "Studio Overview" (the `mission`/`missionPart2` fields inside it are Founder biographical text, not the mission statement)

**About page section reorder + CTA section:**
- ✅ `aboutMission` moved above `aboutValues` in the live document — final published order: Hero → Intro → Overview → Mission → Values → CTA
- ✅ New section type `aboutCta` added to `aboutPage` schema — `heading` (string), `text` (plain text), `bgImage` (image + hotspot), `buttons[]` (ctaButton array), `bgColor`
- ✅ `AboutCta` inline component added to `about/page.tsx` — dark charcoal (`#2A3137`) default background, optional full-bleed `bgImage` with `bg-black/65` overlay, centered heading + supporting text + white button row; scroll-catchup animation applied
- ✅ `ABOUT_PAGE_QUERY` updated: `buttons[]{_key, label, url, style, topSpacing, bottomSpacing}` projected
- ✅ About CTA populated: heading "Get in touch", text, button "Contact" → `/contact`; background image set to the standard CTA image (same as home page)
- ✅ Schema deployed, document published

**Core Values section — inverted to black:**
- ✅ `CoreValuesSection.tsx` background changed from `bg-white` to `bg-black`; SVG cover fill changed from `#ffffff` to `#000000`
- ✅ "Core Values" label changed from `text-bms-grey-400` to `text-white/60`
- ✅ Value description text changed from `text-[#4B4B4B]` to `text-bms-grey-400` (steel blue-grey, legible on black)
- ✅ `bgColor` field cleared from `aboutValues` in Sanity so the white override no longer overrides the component default
- ✅ Value titles (h3) inherit white text via `getTextClass(bgColor)` (no `isLight` arg → dark-bg default)

**CTA background image standardisation:**
- ✅ All CTA sections now use the same background image (asset `image-05b32c4153168a8465c443af641d1859f9389cac-6780x2160-jpg`)
- ✅ Home `homeCta` — already set ✓; About `aboutCta` — set when populated; Services `servicesCta` — updated from a different image; Studios/Contact/Case Studies — no CTA sections

---

### 2026-04-05 (Session 22) — Full Button CMS Coverage

**`homeTestimonials` — heading and button made editable:**
- ✅ Added `heading` (string) and `buttons[]` (ctaButton array) fields to `homeTestimonials` schema
- ✅ Frontend updated: heading renders from `s.heading`, button renders from `s.buttons` (no hardcoded fallback)
- ✅ Sanity populated: heading "What Our Clients Say", button "View Our Case Studies" → `/case-studies`
- ✅ Schema deployed and document published

**All remaining hardcoded button fallbacks removed:**
- ✅ `ServicesCta` (`services/page.tsx`) — hardcoded "Get In Touch" fallback removed; Sanity populated with button "Get In Touch" → `/contact`
- ✅ `HomeStudiosOverview` — hardcoded "Explore All Studios" fallback removed; Sanity already had "Explore The Studio" → `/studios`
- ✅ `ServiceCategoriesGrid` — button condition tightened to require both `buttonLabel` AND `buttonUrl` (no internal text default); button only renders when both fields are set in Sanity

**Contact form submit button made editable:**
- ✅ Added `submitLabel` field to `contactDetails` schema (string, default label "Send Message")
- ✅ `contact/page.tsx` submit button now reads `s.submitLabel` (fallback to `'Send Message'` if blank)
- ✅ Sanity populated: `submitLabel: "Send Message"`
- ✅ Schema deployed and document published

**Voice rule recorded:**
- ✅ Sole operator — never use "we/our/us" in any copy; use "I/my" or studio name

---

### 2026-03-25 (Session 21) — Services Page Visual Polish, Irregular Collage System, Shadow Depth Effects

**ServiceCombinationsSection — hover & lightbox:**
- ✅ Combination cards: outer card `hover:scale-[1.015]`; named group `group/card` used so only background image (`group-hover/card:scale-[1.06]`), number (`group-hover/card:scale-[1.08]`), and title (`group-hover/card:scale-[1.04]`) scale on hover — body text and thumbnail row stay static
- ✅ Thumbnail images (`group/thumb`) are clickable — cursor pointer, opens full-size `ImageLightbox` modal (fixed overlay, click outside or × to close)
- ✅ "Typically Includes" label: brand font (`--font-brand`), bold, `text-sm uppercase tracking-widest text-white`
- ✅ CTA section: `bgImage` field added to `servicesCta` schema — image uploads via Sanity with `bg-black/70` overlay

**ServiceCombinationsSection — combination card backgrounds:**
- ✅ `bgImage` field added to `combination` object in `servicesPage.ts` schema — per-card background image with `bg-black/70` overlay; scales separately from card via `group-hover/card:scale-[1.06]`
- ✅ `SERVICES_PAGE_QUERY` updated: `combinations[]{ ..., bgImage { asset->{ url }, alt } }`
- ✅ Schema deployed

**Irregular collage background system (`CollageBackground.tsx`):**
- ✅ New component `web/src/components/CollageBackground.tsx` — 4 angular clip-path panels tiling the full section background with zero gaps (shared edge vertices)
- ✅ Two variants: `services` (large pentagon top-left, narrow wedge top-right, broad pentagon bottom-right, slim quad bottom-left) and `examples` (wide horizontal band top, large left pentagon, pure triangle right-center, broad bottom-right sweep)
- ✅ Each panel image is sized to only its polygon's bounding box — minimises upscaling and preserves quality
- ✅ Props: `images` (array of `{ image?: { asset, alt } }`), `overlayOpacity` (default 55), `variant` ('services' | 'examples')
- ✅ `collageImages` field added to `servicesCategories` and `serviceCombinations` schema sections — array of `collageSlot` objects (max 4) with `image` inside; drag-to-reorder enabled via Sanity's default array UI
- ✅ `SERVICES_PAGE_QUERY` updated: `collageImages[]{ image { asset->{ url }, alt } }`
- ✅ `CollageBackground` wired into `ServiceCategoriesGrid` (variant: services) and `ServiceCombinationsSection` (variant: examples)
- ✅ Schema deployed
- ✅ Pattern saved to memory (`project_irregular_collage.md`) — future "irregular collage" requests automatically include Sanity schema update + deploy

**ServiceCategoriesGrid — "Our Services" black title box:**
- ✅ Black box: `absolute z-[2]`, centered, `h-[340px]`, `px-16 pt-16` — extends from section top down behind the first row of cards
- ✅ Title vertically aligned via `items-start pt-16` inside the black box (centered between section top and top of cards)
- ✅ Cards container: `relative z-[10] pt-48` when title present — cards render in front of black box

**ServiceCombinationsSection — black heading box:**
- ✅ Heading + intro text wrapped in single `bg-black px-8 py-14` container (`max-w-2xl`) — one unified box; `mb-4` gap between box bottom and first card
- ✅ Box sits in normal document flow (not absolute) — text always contained, no overlap with cards

**Shadow depth effect at statement strip boundary:**
- ✅ `ServiceCategoriesGrid` bottom shadow: `absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none z-20` — pitch black at strip edge, smooth fade upward
- ✅ `ServiceCombinationsSection` top shadow: `absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none z-20` — pitch black at strip edge, smooth fade downward
- ✅ Statement strip (`servicesStrip`) has no internal shadow gradients — depth effect is external only

**Misc:**
- ✅ About page mission section "MISSION" label: `text-bms-grey-400` → `text-white`
- ✅ Horizontal accent strip removed from `ServiceCategoriesGrid` — `stripImage`, `stripColor`, `stripOpacity` props remain in schema/component but strip is no longer rendered
- ✅ `--font-body` confirmed as `Calibri, "Carlito", sans-serif` (reverted after brief Arial trial)

---

### 2026-03-19 (Session 20) — Services Page UI Overhaul, Company Profile v5, Service Combinations Redesign

**Company profile:**
- ✅ BMS Company Profile v5 (2026-03-19) loaded and saved to memory (`project_company_profile.md`) — identity, vision/mission, values, full 5-studio service model with sub-group descriptions, example combinations, approved clients, expertise

**Service category modal — sub-group UI:**
- ✅ Added `description` field (text) to `serviceGroup` object in `serviceCategory` schema — shown above service pill blocks in the modal
- ✅ `SERVICES_PAGE_QUERY` and `SERVICE_CATEGORIES_QUERY` updated: `serviceGroups[]{ _key, subheading, description, items }`
- ✅ `ServiceCategoriesGrid.tsx` type updated, description rendered below animated underline, above pill blocks
- ✅ Sub-category descriptions patched into Sanity for all 5 categories from Company Profile v5; published
- ✅ Sub-category spacing increased: `mb-6` → `mb-12` between service groups

**Service category modal — animated underline:**
- ✅ New `AnimatedLine` component in `ServiceCategoriesGrid.tsx` — draws left-to-right on scroll into view
- ✅ React `useState`-driven width transition (`'0'` → `'100%'`), `IntersectionObserver` fires with 80ms delay
- ✅ Draw speed: 1.2s `cubic-bezier(0.22, 1, 0.36, 1)`, grey `#B3B3B3`, 1px height (inline style — bypasses Tailwind processing)
- ✅ Container: `inline-flex flex-col` + `whitespace-nowrap` so line width matches text width; line extends `calc(100% + 1.25rem)` with negative margin for slight bleed beyond text

**Service category modal — styling:**
- ✅ Sub-heading: brand font (`--font-brand`), bold, `text-base uppercase tracking-wide`
- ✅ "Services Include:" label: brand font, `text-lg uppercase tracking-widest text-[#535D66]`
- ✅ Service pill blocks: `bg-[#535D66] text-white border-[#535D66]`, hover: `bg-black border-black text-white`
- ✅ Card titles: `font-semibold` (tried bold → regular → settled on semibold)
- ✅ Close button: `bg-black text-white px-6 py-3 rounded-md hover:scale-[1.06] cursor-pointer`

**bgImage removal:**
- ✅ `bgImage` permanently removed from the live `servicesCategories` section document via MCP `unset` patch and republished
- ✅ Note added to `CONTENT_MODEL.md` — do not re-add
- ✅ Feedback saved to memory: never `set` the full `sections` array (overwrites image asset `_ref` fields)

**ServiceCombinationsSection — full redesign:**
- ✅ Complete redesign of `web/src/components/ServiceCombinationsSection.tsx`
- ✅ Section background: `bg-white` with dark cards
- ✅ Cards: `bg-[#141414] rounded-2xl border border-[#222222] p-8 md:p-12`
- ✅ 3-column grid: `[auto_1fr_1fr]` — number | title + description + image thumbnails | items + button
- ✅ Numbers: `text-white text-5xl/6xl` brand font, auto-indexed (`01`, `02`, etc.)
- ✅ Text colors: titles white, descriptions/items `text-[#B3B3B3]`
- ✅ Bullet points: `<span>●</span>` at `text-[6px]` in `#B3B3B3`
- ✅ Image thumbnails: 3 × `flex-1 aspect-square` — real image or `ImagePlaceholder` (camera icon SVG, `bg-[#1e1e1e] border border-[#2a2a2a]`)
- ✅ Case study button (active): `bg-[#ffffff] text-black rounded-md hover:scale-[1.05] cursor-pointer`; disabled state: `opacity-80 cursor-not-allowed`; no arrow icon

**serviceCombinations schema additions:**
- ✅ Added `caseStudySlug` (string) to `combination` object — fill when case study published
- ✅ Added `images[]` (array of image, max 3) to `combination` object — preview thumbnails
- ✅ `SERVICES_PAGE_QUERY` updated: `combinations[]{ ..., images[]{ asset->{ url }, alt } }`
- ✅ Schema deployed

---

### 2026-03-17 (Session 19) — About/Services Redesign, Services Card Grid & Final Polish

**About page — column layout swap:**
- ✅ `AboutOverview` column order swapped: Founder column (mission content, founderImage, founderImage2, missionPart2) now renders **left**; Studio column (studioImage, overview text) now renders **right**
- ✅ Label changed from `"Founder"` to `"The Founder"` in the left column heading

**About page — hero title resized:**
- ✅ `AboutHero` h1 reduced from `text-7xl md:text-[10rem]` back to `text-5xl md:text-7xl` — now matches all other page hero titles (Contact, Studios, Services, Case Studies)

**MissionReveal — animation slowdown:**
- ✅ Text body fade slowed from `0.6s` to `1.4s`, slide slowed from its default to `1.1s cubic-bezier(0.22, 1, 0.36, 1)`

**CoreValuesSection — decorative line removal & connector adjustment:**
- ✅ Removed thin grey horizontal lines above each core value card (`<span className="block h-px bg-[#E6E6E6] mb-6" />` and associated `lineRefs`/`LINE_DURATION`/`STAGGER` logic)
- ✅ Cover rect calculation asymmetrically buffered left (`bufLeft = colW * 0.14, bufRight = 0.00`) — shifts visible connector segments left for even spacing
- ✅ Bottom horizontal line moved higher: `lineY = dR.top - sR.top - 20`
- ✅ "Creative Precision" (index 1) card: added `pl-6` class to nudge its text slightly right for centering

**Services page — intro text:**
- ✅ Added `servicesIntro` section in Sanity with broad, non-salesy description: "Breeze Motion Studio provides a wide range of media production and digital services, working with clients across industrial, entertainment, corporate, commercial and creative sectors. All work is structured with remote possibilities in mind."
- ✅ Published

**Services page — CTA section:**
- ✅ Increased gap between text and button (`mb-24` on text paragraph)
- ✅ Button container uses `mt-8` spacing

**Services page — full card grid redesign (`ServiceCategoriesGrid.tsx`):**
- ✅ Replaced alternating editorial layout with a dark-background floating card grid
- ✅ New component: `web/src/components/ServiceCategoriesGrid.tsx` (`'use client'`)
- ✅ Section: dark `bg-[#0d0d0d]` with optional full-bleed `bgImage` + `bg-black/75` overlay
- ✅ Horizontal accent strip: absolute-positioned, `h-36`, `w-screen`, `z-[1]`; supports `stripImage` (base layer) + `stripColor`/`stripOpacity` color tint overlay
- ✅ Cards: `flex flex-wrap justify-center` with `lg:w-[calc(25%-15px)]` so last row centres automatically; fixed `h-[440px]` with `overflow-hidden`; `rounded-2xl`; `shadow-xl`; `hover:scale-[1.03]` zoom
- ✅ Card image: padded `p-3 pb-2` square with `aspect-square rounded-xl`; `PlaceholderImage` when no image set
- ✅ Card content: `overflow-hidden` relative container; gradient fade at `bottom-[68px]`; "Read More" bar absolutely pinned `bottom-0` with solid white background and `border-t` — text fades behind it; no arrow icon; `cursor-pointer`
- ✅ Titles inside cards: pure black
- ✅ Clicking card or "Read More" opens a modal overlay with full image (aspect-video), full description, services tag pills, and Close button
- ✅ Body scroll locked when modal is open; Escape key closes modal
- ✅ Optional `sectionTitle` rendered above cards (color controlled by `sectionTitleColor` — white/black/grey options)
- ✅ Optional CTA button below grid

**Services page schema additions (`servicesCategories` section in `servicesPage.ts`):**
- ✅ `orderedCategories` — array of references to `serviceCategory` — drag-to-reorder in Studio; frontend prefers this over the separate global `SERVICE_CATEGORIES_QUERY`
- ✅ `bgImage` — background image for the section (dark overlay applied automatically)
- ✅ `sectionTitle`, `sectionTitleColor` — overarching title above cards + color radio picker
- ✅ `stripImage` — optional image for the accent strip base layer
- ✅ `stripColor`, `stripOpacity` — tint color + opacity (0–100) on the strip
- ✅ `buttonLabel`, `buttonUrl` — CTA button below the grid
- ✅ Schema deployed with `npx sanity@latest schema deploy`

**serviceCategory schema:**
- ✅ Added `image` field (type: `image`, hotspot + alt) — used as the card visual on the services page

**GROQ query updates:**
- ✅ `SERVICES_PAGE_QUERY`: added `bgImage`, `stripImage`, `orderedCategories[]->{ _id, title, shortDescription, services, image { asset->{ url }, alt } }` projections
- ✅ `SERVICE_CATEGORIES_QUERY`: added `image { asset->{ url }, alt }` projection

**Sanity content — shortDescriptions expanded:**
- ✅ All 10 service category `shortDescription` fields rewritten to be long enough to fade into the "Read More" bar on the card — encouraging clicks; published

**Sanity content — orderedCategories populated:**
- ✅ `servicesPage.servicesCategories.orderedCategories` patched with all 10 category references in display order; published

**Studios connector tree — drop line gap fix:**
- ✅ `HomeStudiosOverview.tsx`: drop lines extended from `y2="86"` to `y2="106"` and `overflow: 'visible'` added to SVG — eliminates the visible gap between the line ends and the studio card containers

---

### 2026-03-04 (Session 18) — About Page Title Scale & Mission Background

**Hero title enlarged further:**
- ✅ `AboutHero` h1: `text-6xl md:text-8xl` → `text-7xl md:text-[10rem] leading-none` — full-bleed impact scale

**Section label treatment upgraded:**
- ✅ "The Studio", "Founder", "Mission", "Core Values" labels: changed from `font-functional text-sm uppercase tracking-widest` (eyebrow style) to `font-brand text-xl md:text-2xl uppercase tracking-wide` — now rendered in Cormorant SC at subtitle scale
- ✅ Applies to `AboutOverview`, `AboutValues` (mission section), and `AboutValues` (core values grid)

**Mission section background image:**
- ✅ Added `missionBgImage` image field (hotspot + alt text) to `aboutValues` schema — optional background for the black mission statement section
- ✅ `ABOUT_PAGE_QUERY` updated: `missionBgImage{asset->{url}, alt}` projected
- ✅ Frontend: when `missionBgImage` is set, renders full-bleed behind the mission statement with `bg-black/65` overlay for text legibility
- ✅ Schema deployed

---

### 2026-03-04 (Session 17) — Testimonials Reorder, About Page Images & Layout

**homeTestimonials — stale field cleanup:**
- ✅ `homeTestimonials` section had orphaned `clientLogos` array data (old format with `clientName` strings) — not in current schema; caused "Unknown field found" warning in Studio
- ✅ MCP patch tools blocked by schema validation (unknown path); fixed via direct Sanity Mutations HTTP API call using Node.js — `unset` applied successfully, document re-published

**homeTestimonials — drag-to-reorder:**
- ✅ Added `testimonials[]` array (references to `testimonial` documents) to `homeTestimonials` schema — editors can drag-to-reorder directly in Sanity Studio
- ✅ `HOME_PAGE_QUERY` updated: `testimonials[]->{_id, quote, attribution, role, client->{name}}` resolved inside the section projection
- ✅ `page.tsx` updated: `HomeTestimonials` now receives `section.testimonials ?? []` from the page-level query; removed the separate global `TESTIMONIALS_QUERY` fetch
- ✅ All 12 testimonials populated in the section array and published

**aboutOverview — image containers:**
- ✅ Added `studioImage` (type: `image`, hotspot) to `aboutOverview` — wide horizontal rectangle displayed below "The Studio" label, above the overview text
- ✅ Added `founderImage` (titled "Founder Image (Top)") — wide horizontal rectangle displayed below "Founder" label, above the first founder text block
- ✅ Added `founderImage2` (titled "Founder Image (Middle)") — round-cropped image (`w-56 h-56 rounded-full`) displayed between founder text Part 1 and Part 2
- ✅ Split `mission` field into `mission` (Founder Text — Part 1) and `missionPart2` (Founder Text — Part 2) — allows `founderImage2` to sit between them
- ✅ Both image containers use `aspect-[3/1]` with `overflow-hidden rounded-sm`
- ✅ `ABOUT_PAGE_QUERY` updated: `studioImage{asset->{url}, alt}`, `founderImage{asset->{url}, alt}`, `founderImage2{asset->{url}, alt}` projected
- ✅ Schema deployed

**aboutOverview — column layout alignment:**
- ✅ Both columns use `flex flex-col`; grid has `md:items-stretch` — columns stretch to equal height
- ✅ `missionPart2` carries `mt-auto` — pins the second text block to the bottom of the founder column for visual baseline alignment

**aboutValues — mission statement section split:**
- ✅ `AboutValues` component now renders two `<section>` elements: mission statement on black background, core values grid on white background — no schema change required; `s.intro` drives both

**About page title enlargements (first pass):**
- ✅ Hero h1: `text-5xl md:text-7xl` → `text-6xl md:text-8xl`
- ✅ All section eyebrow labels: `text-xs` → `text-sm` (via `replace_all`)
- ✅ Founder name in `AboutFounder`: `text-3xl` → `text-5xl`
- ✅ Core Values card h3: `text-lg` → `text-2xl`
- ✅ How We Work step h3: `text-sm` → `text-base`

---

### 2026-03-01 (Session 16) — About Page Content Reorganisation

**`aboutOverview` section — Founder bio moved to right column:**
- ✅ `aboutOverview.mission` field repurposed to hold a shortened founder bio (1 paragraph) — "Rebekah-Breeze Johnson is the founder and lead creative of Breeze Motion Studio. With a background spanning video production, brand design, workflow architecture, and operational systems, she combines creative vision with technical precision — delivering work that is both visually compelling and operationally sound."
- ✅ Frontend `AboutOverview` right column label changed from "Mission" → "Founder"
- ✅ `aboutFounder` section set to `disabled: true` — bio is now represented in the overview section; full section content preserved in Sanity for future use

**`aboutValues` section — Mission statement integrated:**
- ✅ Added `intro` (type: `text`, rows: 3) field to `aboutValues` schema — a short mission statement field displayed above the values grid
- ✅ Schema deployed
- ✅ `aboutValues.intro` populated: "To create professional content and operational systems that help businesses communicate with clarity, build authority, and achieve measurable results — grounded in strategy, executed with precision, and built for the long term."
- ✅ Frontend `AboutValues` updated: when `s.intro` is present, renders a two-column block (label left, italic statement right with `border-l-2 border-[#535D66]` accent stripe) with `mb-20` breathing room before the values grid
- ✅ All content published

---

### 2026-03-01 (Session 15) — About Slideshow, Bug Fixes & Layout Refinements

**Testimonials scroll animation fix:**
- ✅ `HomeTestimonials.tsx` inner container was missing the `scroll-catchup` class — the `ScrollObserver` never picked up the section, leaving it unanimated; class added, section now animates on scroll like every other section

**Runtime error fix — `studios/[slug]/page.tsx`:**
- ✅ `studio.description` is `type: 'blockContent'` in the schema, but the slug page was rendering it raw with `{studio.description || studio.purpose}` — React threw "Objects are not valid as React child"
- ✅ Fixed: imported `PortableTextContent` and conditionally render `<PortableTextContent value={studio.description} />` when description exists; falls back to plain `<p>{studio.purpose}</p>` otherwise

**Home About — image slideshow system (schema + frontend):**
- ✅ Replaced `imageLeft` (single image) and `imageRight` (single image) fields in `homeAbout` schema with `imageLeftSlides[]` and `imageRightSlides[]` image arrays — editors can now upload multiple images per side
- ✅ Created `web/src/components/AboutSlideshow.tsx` — `'use client'` component; auto-advances right-to-left every 8 seconds; no arrows or manual controls; smooth `0.9s cubic-bezier(0.22, 1, 0.36, 1)` slide transition; silently resets to slide 0 after the last slide (double-rAF technique); static render for 1 image; placeholder for 0 images
- ✅ `HOME_PAGE_QUERY` updated: `imageLeftSlides[]{asset->{url}, alt}` and `imageRightSlides[]{asset->{url}, alt}`
- ✅ Schema deployed to Sanity Cloud
- ✅ Stale `imageLeft` and `imageRight` field data removed from the published `homePage` document via Sanity mutations API (direct HTTP patch) — resolved "Unknown fields found" warning in Studio

**Home About — hover scale animation:**
- ✅ Added `group` class to both left and right slideshow container divs in `HomeAbout`
- ✅ Added `group-hover:scale-105 transition-transform duration-500 ease-out` to all `<img>` elements inside `AboutSlideshow` — image scales up on hover, clipped neatly by the container's existing `overflow-hidden`; works correctly in both single-image and multi-image (slideshow) modes

**Home About — body text layout:**
- ✅ Removed `splitTextAtFounder()` text-splitting logic — body text no longer splits into two halves around the logo
- ✅ Logo (with horizontal rule dividers) now sits at the **top** of the centre column
- ✅ Full body text renders as a single unbroken `<p>` block directly below the logo

---

### 2026-02-28 (Session 14) — Scroll Animation Refinements & Testimonials Carousel

**Scroll reveal animation (`ScrollObserver.tsx` + `globals.css`):**
- ✅ Animation is slide-up only — no opacity/fade (user preference)
- ✅ Increased translateY from 48px → 64px for visibility, then reduced to 36px for subtlety
- ✅ Fixed hydration conflict: `ScrollObserver` now applies initial hidden state inside a `setTimeout(100ms)` so React client-component re-renders during hydration don't wipe the inline styles
- ✅ Fixed re-trigger behaviour: removed `observer.unobserve()` — sections now re-animate every time they are scrolled into view from below; elements already scrolled past (above viewport) are left visible (not reset)
- ✅ Initial hide is only applied to elements that start below the fold — no flicker for on-screen content
- ✅ `rootMargin` tightened to `0px 0px -40px 0px`, threshold raised to `0.08`
- ✅ `globals.css` keyframe updated to match 36px translate; `opacity` removed from keyframe and transition

**Scroll-catchup removed from specific sections (user preference — keep static):**
- ✅ `HomeClientLogos.tsx` — logo strip is now fully static
- ✅ `HomeCta` (`page.tsx`) — "Work With Us" CTA section is now fully static
- ✅ `HomeTestimonials.tsx` — section wrapper has no scroll-catchup

**Testimonials carousel — auto-scroll removed:**
- ✅ Removed `AUTO_MS`, `timerRef`, `pausedRef`, `restartTimer`, the `useEffect` timer, and `onMouseEnter`/`onMouseLeave` pause handlers
- ✅ Carousel is now manual-only — chevron arrows and step indicator dots remain fully functional
- ✅ All original visual design preserved (layout, chevrons, dots, wrap-back logic, styling)
- ✅ Removed unused imports (`useEffect`, `useCallback`)

---

### 2026-02-27 (Session 13) — Round Crop, Button Spacing & Studios Connector Animation

**Round crop — universal image field convention:**
- ✅ Added `roundCrop: boolean` sub-field (default `false`) to every image field across all schemas: `blockContent.ts`, `aboutPage.ts`, `client.ts`, `project.ts`, `caseStudy.ts`, `homePage.ts`, `studio.ts`, `siteSettings.ts`
- ✅ Standing rule established: all future Sanity image fields must include `roundCrop`; all future frontend image containers must support the `rounded-full overflow-hidden` variant
- ✅ Fixed round crop having no frontend effect on `homeAbout` logo — `roundCrop` was missing from `HOME_PAGE_QUERY` `aboutLogo` projection; added projection and applied conditional class in `page.tsx`
- ✅ Schema deployed after all changes; committed

**Button spacing presets:**
- ✅ Added `topSpacing` and `bottomSpacing` fields to `shared/ctaButton.ts` — 9-option horizontal radio presets from `neg-lg` (−mt-8) through `none` to `lg` (+mt-8)
- ✅ Created `web/src/lib/buttonSpacing.ts` — static lookup maps (`TOP_SPACING`, `BOTTOM_SPACING`) + `btnSpacingClass()` helper returning combined Tailwind class string
- ✅ Applied to all button render sites: `page.tsx` (4 sites), `HowWeWorkSection.tsx`, `services/page.tsx`
- ✅ Schema deployed; committed

**Studios Overview — parent logo + animated connector tree:**
- ✅ Added `parentLogo` image field (with `roundCrop`) to `homeStudiosOverview` section in `homePage.ts`
- ✅ `HOME_PAGE_QUERY` updated: `parentLogo{asset->{url}, alt, roundCrop}` projected
- ✅ Frontend: logo renders as a 160×160px clickable container (links to `/studios`) with `hover:scale-105` animation and optional `rounded-full` crop
- ✅ Animated SVG connector tree below the logo: stem → horizontal arms → drop lines sequentially extend on section hover; strict reverse sequencing on exit; `pathLength="1"` on all lines prevents gaps at joints regardless of viewBox scale
- ✅ Hover buffer (300ms) initially added, then **removed** — immediate retraction on cursor exit
- ✅ `HomeStudiosOverview` extracted from `page.tsx` into `web/src/components/HomeStudiosOverview.tsx` as a `'use client'` component — required for `useState`/`useRef`/event handlers
- ✅ SVG connector: desktop only (`lg:block`); mobile shows a simple vertical divider line
- ✅ Falls back to a chevron/arrow SVG when no `parentLogo` is set
- ✅ Fixed TypeScript error in `page.tsx` — added `as any` cast when passing `Section` to `HowWeWorkSection` (which uses its own narrower `SectionData` type)
- ✅ Schema deployed; committed

---

### 2026-02-25 (Session 12) — Strategy Studio Removed

**Business change:** Strategy Studio removed from the company profile pending a repositioning decision.

- ✅ Strategy Studio document permanently deleted from Sanity (`_id: 66113682-2214-4d67-905b-988263edad8f`) — unpublished then draft discarded
- ✅ Confirmed zero referencing documents before deletion (no projects, case studies, or clients were linked to it)
- ✅ No frontend code changes required — studios are fetched dynamically; the studio drops from all listings automatically
- ✅ Affected areas: homepage Studios Overview section, `/studios` page grid
- ⚠️ **Note:** `/studios/strategy` route now returns no data. If the slug is visited directly it will render an empty/error state — no hardcoded route exists so no code cleanup needed.

---

### 2026-02-25 (Session 11) — Homepage About & How We Work Image Fields

**homeAbout — flanking image columns:**
- ✅ Added `imageLeft` and `imageRight` image fields (both with hotspot + alt text) to `homeAbout` schema
- ✅ Added `imageAspectRatio` string field — radio picker with three options: `1:1 — Square`, `2:3 — Portrait`, `9:16 — Tall`; defaults to `1:1`; applies to both containers simultaneously
- ✅ `HomeAbout` component redesigned as a 3-column desktop grid (`[1fr 2fr 1fr]`); image columns hidden on mobile (`hidden md:block`)
- ✅ `AboutSideImage` helper component: renders the uploaded image or a visible dashed-border placeholder labelled "Left Image" / "Right Image" when no image is set
- ✅ All new images served via Sanity CDN with `?w=600&auto=format&q=80` — WebP optimisation + 80% quality; `loading="eager"` + `decoding="async"` for fast above-the-fold delivery
- ✅ `HOME_PAGE_QUERY` updated: `imageLeft{asset->{url}, alt}`, `imageRight{asset->{url}, alt}` explicitly dereferenced

**homeAbout — image container rounding:**
- ✅ Added `rounded-sm` (2px) corner rounding to both side image containers — softens corners without looking styled

**homeHowWeWork — section image:**
- ✅ Added `sectionImage` image field (hotspot + alt text) to `homeHowWeWork` schema
- ✅ Renders between the process steps grid and the CTA button; container uses `max-w-full h-auto` — fits the natural dimensions of the uploaded image exactly, no forced aspect ratio
- ✅ `rounded-sm` corner rounding on the image element
- ✅ Image optimised via Sanity CDN (`?auto=format&q=80`); `loading="eager"` + `decoding="async"`
- ✅ `HOME_PAGE_QUERY` updated: `sectionImage{asset->{url}, alt}` explicitly dereferenced
- ✅ `HowWeWorkSection.tsx` `SectionData` type updated to include `sectionImage`
- ✅ Schema deployed after all changes; committed as `47660ef` and `fc797fa`

---

### 2026-02-22 (Session 10) — Splash Graphics Refinements & Visual Editing Discussion

**Splash graphics — iterative refinements (4 rounds):**
- ✅ **Round 1 — Visibility:** Redesigned all 4 patterns to fill all 4 corners (was 1–2 per pattern); raised opacity values — dark: 0.22 dominant / 0.13 supporting / 0.08 tertiary; light: 0.14 / 0.09 / 0.06
- ✅ **Round 2 — Fully opaque, correct inversion:** Removed all opacity; consolidated to white-art PNGs only with `filter: invert(1)` for light backgrounds (no separate black-ink files needed); set `zIndex: 20` so accents render above all section overlays (`bg-black/55`) and content divs
- ✅ **Round 3 — Screen-edge positioning:** Changed from flush `top: 0, left: 0` to `-6vh` / `-18vw` negative offsets — graphics sit right at the screen edge, mostly outside the section boundary with only corner art peeking in; `overflow: hidden` on parent sections clips the bleed
- ✅ **Round 4 — Heroes cleared + pattern cycling:** Removed `<SplashAccents>` from all four hero sections (`HomeHero`, `AboutHero`, `StudiosHero`, `ContactHero`); re-sequenced pattern numbers across all pages so adjacent sections never repeat the same dominant corner
- Final pattern assignments — Homepage: FeaturedWork=0, StudiosOverview=1, HomeAbout=3, HowWeWork=2, Testimonials=0, Cta=1; About: Intro=2, Overview=3, Founder=0, Values=1, HowWeWork=2; Studios: Intro=2, Grid=3; Contact: Intro=3, Details=0

**Visual editing discussion:**
- Explained that Next.js/Tailwind does not have native drag-and-drop visual editing
- Recommended Browser DevTools (Inspect Element → live CSS scrubbing) for testing positional values before hardcoding
- Mentioned Framer as an alternative platform for fully visual web editing

---

### 2026-02-22 (Session 9) — Client Logo Upgrade, How We Work Experiments & Splash Graphics Foundation

**Client logo system upgrade:**
- ✅ `homeClientLogos` schema upgraded to a hybrid model: each entry now holds a `client` reference (links to an existing Client document, uses the client's logo automatically), a `logoOverride` image field (optional — overrides the client's own logo if set), and a `disabled` boolean toggle to hide individual logos without removing them
- ✅ `client.logo` image field updated: added hotspot (focal point for smart crops) and alt text sub-fields
- ✅ Logo bar background color updated to `#535D66` (BMS accent steel blue) — previously `bg-white`

**How We Work color experiments (reverted):**
- 🔄 Tried several background color/style variants for `HowWeWorkSection.tsx` — ultimately reverted to the original dark background; no code changes persisted

**Splash graphics system — foundation built:**
- ✅ 5 white-art PNG files added to `/web/public/splash/`: `splash-fg.png`, `splash-headphone.png`, `splash-cam-white.png` (plus two additional variants)
- ✅ Created `web/src/components/SplashAccents.tsx` — server-compatible React component; props: `pattern` (0–3) and `dark` (boolean); 4 patterns each filling all 4 corners; `CANVAS_RATIO = 4000/5781` computes image heights from widths; CSS `scaleX(-1)`/`scaleY(-1)` flips position non-dominant corner art; `filter: invert(1)` handles light backgrounds; no `'use client'` directive — works in both server and client components
- ✅ `siteSettings.splashAccentsEnabled` boolean field added to General group — global on/off toggle for all splash graphics across the site
- ✅ `SITE_SETTINGS_QUERY` updated to project `splashAccentsEnabled`
- ✅ `web/src/app/globals.css` — `.splash-off .splash-accent { display: none !important; }` CSS rule added
- ✅ `web/src/app/layout.tsx` — applies `splash-off` class to `<body>` when `settings?.splashAccentsEnabled === false`
- ✅ `<SplashAccents>` added to all content sections across all four pages (all hero sections excluded); all parent `<section>` elements confirmed `relative overflow-hidden`; all content wrapper divs confirmed `relative z-10`
- ✅ Schema deployed; `siteSettings.splashAccentsEnabled` set to `true` and published

---

### 2026-02-20 (Session 8) — Testimonials Carousel, Client Logo Strip & Footer Polish

**Testimonials section rebuilt as carousel (`HomeTestimonials.tsx`):**
- ✅ Replaced static grid with horizontal sliding carousel — 3 testimonials visible at a time
- ✅ Auto-advances every 5 seconds (pauses on hover); smooth `translateX` transition with instant wrap-back via double-`requestAnimationFrame`
- ✅ Wide chevron arrow buttons flank the carousel left/right, matching Studios section style — grey (#999) → white on hover, `scale-[1.125]` on hover (SVG `group-hover` pattern to separate color and transform transitions)
- ✅ Step indicator dots below carousel (one per scrollable position); active dot wider and brighter
- ✅ "View Our Case Studies" CTA button at bottom
- ✅ `restartTimer()` pattern — manual arrow interaction resets the auto-scroll interval

**How We Work SVG animation fixes:**
- ✅ SVG mask added (`<mask id="hww-line-mask">`) with a black rect over the heading bounding box — animated line is invisible behind heading text at all times
- ✅ Path endpoint corrected: final L-point now at `hRight + hOff` (arrowhead tip), not `hRight - hOff`; `len` calculation updated to match — eliminated 24px line stub visible past the arrowhead

**Client Logo Strip — standalone independent section:**
- ✅ Created `HomeClientLogos.tsx` — new client component; pure white background (`bg-white`); same 3-second auto-scroll with pause-on-hover; logos rendered `brightness(0)` at 35% opacity (dark on white); text fallback in `bms-grey-400`
- ✅ Added `homeClientLogos` section type to `schemaTypes/homePage.ts` with its own `clientLogos[]` array (`clientName` required, `logo` optional image)
- ✅ Removed `clientLogos[]` field from `homeTestimonials` schema — logos now live in their own dedicated section
- ✅ `ClientLogoStrip` sub-component, `ClientLogo` type, and logo-specific constants removed from `HomeTestimonials.tsx`
- ✅ `homeClientLogos` case added to `page.tsx` switch; `HomeClientLogos` imported
- ✅ 12 client logo placeholders migrated from `homeTestimonials` to new `homeClientLogos` section in Sanity; published
- ✅ Schema deployed
- ⚠️ **Manual step required:** In Studio → Home Page, drag "Client Logos" section to sit between "Testimonials" and "Call to Action" (currently at end of list), then publish

**Testimonial data corrections (Sanity):**
- ✅ Fixed 10 of 12 testimonials — corrected mismatched client references, roles, and two quote texts:
  - Justin: client IDD → Symec Digital, role → "Owner"
  - Erin & Hope (Cressi): client → Cressi, role → "Founders"
  - Emily May: role → "Owner", quote corrected
  - Johann (SAR): role → "Project Manager"
  - Mandy Berning (ROVD): role → "Founder"
  - Manuel (Trihedron): attribution → "Manuel da Silva", role → "Founder", quote corrected
  - Andre (IDD): client → IDD, role → "Founder"
  - Shannon (Bend Wellness): client → Bend Wellness, role → "Founder"
  - Lize Garrod (Equinox): role → "Marketing Manager"
  - Raylene: role → "Founder"

**Footer brand column and data wiring:**
- ✅ Brand column converted from left-aligned to `flex flex-col items-center text-center`
- ✅ Logo display order: round-crop shown first if `footerRoundLogo.enabled`; falls back to plain logo if only that is enabled — all three elements (logo, studio name, tagline) center-aligned
- ✅ `max-w-xs` constraint removed from tagline to prevent misalignment at narrow widths
- ✅ `siteTitle` prop added to `Footer` — footer studio name now comes from Sanity (`siteSettings.siteTitle`) instead of being hardcoded; falls back to "Breeze Motion Studio" if Sanity unavailable
- ✅ `layout.tsx` passes `settings?.siteTitle` to Footer

**Client Logo Strip refinements (`HomeClientLogos.tsx`):**
- ✅ Logos render in full color — removed `brightness(0)` filter and `opacity: 0.35`
- ✅ Logo height increased: 28px → 48px → 80px (`h-20`), max-width 120px → 200px
- ✅ Full-bleed layout — removed `max-w-6xl mx-auto px-6` container; strip runs edge to edge
- ✅ Visible logos increased from 5 → 7 per view; slot padding reduced `px-8` → `px-4`
- ✅ Section padding reduced `py-12` → `py-6` for a thinner white band

**Sanity content cleanup (siteSettings):**
- ✅ Removed 💥 emoji from `footerTagline` — now "Audio/Visual Content with an Edge"
- ✅ Removed 💥 emoji from global `tagline` field — same clean value
- ✅ Removed "Website" entry from `socialLinks` (own site URL listed as a social platform — redundant in a Follow section)
- ✅ Published

---

### 2026-02-20 (Session 7) — How We Work SVG Animation

**New component:** `web/src/components/HowWeWorkSection.tsx` — fully client-side animated "How We Work" section, consumed by `homeHowWeWork` in `web/src/app/page.tsx`.

**Animation overview:**
- SVG rectangle path draws from left edge of heading → left margin → down → across steps → up → right margin → back to right edge of heading, creating a "follow the steps" line
- `stroke-dashoffset`/`stroke-dasharray` draw-on animation using CSS `linear()` easing function (`linear(0, 0.27 20%, 0.74 78%, 1)`) — fast on entry/exit segments, slow across the steps sweep
- White `<rect>` cover elements per step column hide the line as it passes through text, making it appear to thread between steps; z-index layering (SVG at z-5, content at z-10) ensures text always renders above
- Cover rects sized with 36px height and 6% horizontal buffer per side to absorb hover `scale-[1.07]` without line bleed
- Polyline arrowhead at heading right edge; fades in on animation complete

**Interaction system:**
- Window-level `mousemove` + `scroll` listeners with `BUFFER = 56px` spatial zone — animation activates 56px before cursor enters section, not on section entry itself
- Delayed deactivation (`DEACTIVATE_DELAY_MS = 700`) — animation only resets 700ms after cursor leaves the buffer zone; prevents abrupt flicker on mouse leave
- `onEnterRef`/`onLeaveRef` ref pattern — stable window listener callbacks that always call the latest handler without re-registering the event listener
- SVG fade-in (0.4s) before stroke draw starts; fade-out (0.5s) on leave; `onSvgTransitionEnd` resets `done` state after fade-out completes

**Step scale animation (line-triggered):**
- `pathFractionToTime()` — mathematically inverts the CSS `linear()` easing to compute exact ms delays for each step
- `stepTriggerMs[]` stored in path state; `useEffect` schedules `setTimeout`s when animation activates, lighting up each step (`litSteps` Set) as the line reaches it
- Inline `transform: scale(1.07/1.08)` on step title + description when lit; Tailwind `group-hover` equivalents remain for direct hover

**Heading scale on completion:**
- `headingLit` state set in `onAnimEnd`; heading `<span>` transitions to `scale(1.04)` via inline style + Tailwind `transition-transform duration-500`
- Path start/end offset: `hOff = 12` — M point begins 12px inside left edge of heading text, final L ends 12px inside right edge, preventing visible line stubs at heading edges during scale

**CTA button:** `mt-28` bottom margin for visual separation from steps grid

---

### 2026-02-19 (Session 6) — Strategy Studio Rename

**Business change:** "Media Systems & Brand Optimization" has been formally renamed and repositioned as "Strategy Studio" — now an official fourth studio (rather than a cross-studio service), with an expanded scope and distinct positioning.

**Sanity CMS (published):**
- ✅ Studio document updated — title, slug (`media-systems` → `strategy`), tagline, purpose, industriesServed, and full description rewritten to reflect new profile
- ✅ URL route is now `/studios/strategy`
- ✅ Document published

**Frontend code:**
- ✅ `web/src/app/studios/page.tsx` — fallback SEO description updated to reference Strategy Studio

**Docs updated (all references across 5 files):**
- ✅ `CLAUDE.md` — site map route, studio structure description, content model summary
- ✅ `docs/CONTENT_MODEL.md` — studio entries list, content population status
- ✅ `docs/PROJECT_STATUS.md` — inline studio references
- ✅ `docs/SANITY_STUDIO_GUIDE.md` — sidebar reference, initial setup checklist, content inventory

**Note:** Any external links to `/studios/media-systems` will need updating to `/studios/strategy`.

---

### 2026-02-19 (Session 5) — Studio Cards, Homepage About Section & Button Polish

**Studio Card Redesign**
- ✅ Built `StudioCard.tsx` component — 2:3-style card with 1:1 square media container (top), black title bar, white description box (bottom)
- ✅ Title is light grey by default, transitions to white on hover; entire card has subtle scale pop (`hover:scale-[1.03]`) with `hover:z-10`
- ✅ YouTube URLs auto-detected and rendered as iframe with autoplay/mute/loop; `top: -62px` shift squares the 16:9 frame and hides the YouTube info overlay in one move
- ✅ Direct file URLs use `<video autoPlay muted loop playsInline>`; fallback to image or empty

**Studio Card Media — CMS-Editable from Homepage**
- ✅ Added `studioCards[]` array to `homeStudiosOverview` section in `homePage.ts` — each entry links a Studio document and holds its own `cardImage` and `cardVideoUrl`
- ✅ This is independent of the Studio documents themselves — editors set card-specific media inside Home Page → Studios Overview
- ✅ Query updated: `HOME_PAGE_QUERY` projects `studioCards[]` with `studioId`, `cardImage`, `cardVideoUrl`; frontend builds a `cardMediaMap` keyed by studio `_id` and falls back to the studio's own `heroImage`/`heroVideoUrl` if no card override is set
- ✅ Schema deployed

**Card Layout Centering**
- ✅ Switched from CSS grid to `flex flex-wrap justify-center` with explicit `calc()` widths on wrapper divs — top 3 cards form a row; lone bottom card (Strategy Studio) centers itself naturally

**Hero Subtitle Shadow**
- ✅ Soft radial gradient overlay placed behind hero subtitle text — `radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 40%, transparent 70%)` — no hard edges, melts into background

**Button Hover Zoom Animation**
- ✅ `hover:scale-105 transition duration-200` added to all CTA buttons site-wide (page.tsx CtaLink, Nav CTA)

**Homepage About Section**
- ✅ Added `homeAbout` section type to `homePage.ts` — fields: `heading`, `text`, `buttons[]`, `bgVideoUrl`, `bgImage`, `disabled`
- ✅ Section inserted at index 2 (between Featured Work and Studios Overview) in the live document
- ✅ Content: heading "About Breeze Motion Studio", brief description mentioning Rebekah-Breeze Johnson, "Find Out More" button → /about
- ✅ Schema deployed; document published

**How We Work — View Services Button**
- ✅ Added `buttons[]` array to `homeHowWeWork` section in `homePage.ts`
- ✅ "View Services" → /services button added to live document and published

**Studios Overview — Buttons Field**
- ✅ Added `buttons[]` array to `homeStudiosOverview` section (CMS-editable; was previously hardcoded)

**Featured Work — Disabled in CMS**
- ✅ `homeFeaturedWork` section manually disabled in Sanity Studio (`disabled: true`) — section excluded from frontend render; content preserved

---

### 2026-02-19 (Session 4) — Button Styling Refinements (Manual)
- ✅ Added `rounded-sm` to all buttons site-wide — subtle rounded corners on all CTA buttons (page.tsx, contact, services, nav)
- ✅ Experimented with button font weight (bold → semibold → reverted to default) — final state: default browser/Tailwind weight
- Affected files: `web/src/app/page.tsx`, `web/src/app/contact/page.tsx`, `web/src/app/services/page.tsx`, `web/src/components/layout/Nav.tsx`

---

### 2026-02-19 (Session 4) — Black Bar Investigation (Pending Fix)
- 🔄 Investigating a black bar visible below the Featured Work video on the homepage
- **Confirmed facts:** 0 featured projects in CMS (projects grid doesn't render); `homeFeaturedWork` has a YouTube video (`youtu.be/j4WTQYDiSrc`); `homeStudiosOverview` follows with a background image and heading "The Studio"
- **Section has `bg-black` and `-mt-[62px]`** — section pulls 62px above hero, hero (z-10) covers the first 62px of the section; visible video = container height − 62px
- **Next section** (`homeStudiosOverview`) has `bg-bms-dark-500` (#333333) with `py-24` (96px top padding) and a background image — the dark top padding area may be contributing to the visual "black bar" effect between the two sections
- **Likely root cause:** combination of `bg-black` on Featured Work section with `-mt-[62px]` geometry and possible YouTube letterboxing or embed bottom UI bar within the iframe
- **Pending:** CSS fix to clip any black overhang at the bottom of the YouTubeShowcase container and/or section

### 2026-02-19 (Session 3) — Section Disable/Enable Toggle
- ✅ Added `disabled` boolean field ("Hide this section") to **every** section type across all 6 page schemas (24 sections total)
- ✅ When ticked, the section is excluded at the GROQ query level (`sections[disabled != true]`) — never reaches the frontend
- ✅ Disabled sections show a `[HIDDEN]` prefix in the Studio section list for immediate visual clarity
- ✅ Defaults to `false` (visible) — all existing sections unaffected with no migration needed
- ✅ Schema deployed, committed

### 2026-02-19 (Session 3) — Dynamic CTA Buttons Array
- ✅ Replaced fixed `primaryCta` / `secondaryCta` fields with a `buttons[]` array in `homeHero` and `homeCta` (homePage)
- ✅ Replaced single `button` field with `buttons[]` array in `servicesCta` (servicesPage)
- ✅ Editors can now add, remove, and drag-reorder any number of CTA buttons directly in Sanity — no code changes required
- ✅ Migrated existing `primaryCta`/`secondaryCta` data from homePage to the new `buttons[]` format via MCP patch
- ✅ Frontend renders `s.buttons.map(...)` — primary/secondary styling is preserved via the `style` field on each button

### 2026-02-19 (Session 3) — Icon-Only Logo Option
- ✅ Added `iconLogo` object field to siteSettings (Header & Navigation group)
- ✅ Three sub-fields: `enabled` (boolean), `sizePreset` (small/medium/large), `customSize` (number override)
- ✅ Nav.tsx renders `/web/public/logo-icon.png` when `iconLogo.enabled` is true — the icon without the Breeze Motion Studio wordmark
- ✅ `SITE_SETTINGS_QUERY` updated; layout.tsx passes `iconLogo` prop to Nav
- **To activate:** place logo icon file at `/web/public/logo-icon.png`, then toggle on in Site Settings → Header & Navigation → Icon Only — No Wordmark

### 2026-02-19 — YouTube Embed Support
- ✅ Fixed Featured Work video field not displaying YouTube URLs
- **Root cause:** HTML `<video>` tag only plays direct file URLs — YouTube URLs require an `<iframe>` embed
- ✅ Added `getYouTubeEmbedUrl()` helper that detects YouTube URLs (`youtube.com/watch?v=...` and `youtu.be/...`)
- ✅ Featured Work section: YouTube URLs render as `<iframe>` with full player; direct file URLs still use `<video>` tag
- ✅ Section backgrounds: YouTube URLs render as scaled iframe with autoplay/mute/loop params + dark overlay
- Both URL types (YouTube and direct file) work interchangeably in the video URL fields

### 2026-02-19 — Page Builder / Sections Array Architecture
- ✅ Converted all 6 page singleton schemas from flat top-level fields to a draggable `sections[]` array
- ✅ Each section is a typed object (`homeHero`, `aboutFounder`, `contactDetails`, etc.) that can be reordered freely in Sanity Studio
- ✅ Frontend renders sections in whatever order they appear in the array (switch/case on `_type`)
- **Applies to:** homePage, aboutPage, contactPage, servicesPage, studiosPage, caseStudiesPage
- ✅ All existing content migrated to new structure via `migrate-to-sections.mjs`
- ✅ All 6 pages republished with migrated content
- ✅ Schema deployed to Sanity Cloud
- **How to reorder:** Open any page in Sanity Studio → drag section cards up/down → Publish → reflects on website immediately

### 2026-02-19 — Studios and Case Studies Singleton Restructure
- ✅ Created `studiosPage` singleton schema (Website Pages → Studio Page)
- ✅ Created `caseStudiesPage` singleton schema (Website Pages → Case Studies Page)
- ✅ Moved Studio and Case Study document type lists to Content Library in `structure.ts`
- ✅ Added `STUDIOS_PAGE_QUERY` and `CASE_STUDIES_PAGE_QUERY` to queries
- ✅ Rewrote `/studios` and `/case-studies` frontend pages to fetch from dedicated singleton documents
- ✅ Created and published `studiosPage` and `caseStudiesPage` singleton documents via Node.js script (required `createOrReplace` with exact IDs)
- ✅ Removed orphaned `studiosPageIntro` / `caseStudiesPageIntro` fields from siteSettings

### 2026-02-18 (Night) — All Content Published
- ✅ Successfully published all 75 documents to Sanity production dataset:
  - 33 clients (includes 21 additional clients from deliverables list)
  - 12 testimonials (all linked to clients with featured status)
  - 12 case studies (5 Machine Studio, 7 Commercial Studio)
  - 4 studios (Machine, Commercial, Creative, Strategy)
  - 10 service categories
  - 3 singleton pages (homePage, aboutPage, contactPage)
  - 1 siteSettings
- ✅ Resolved complex reference integrity issues during publishing workflow
- 🎉 **All foundational content now LIVE and ready for Next.js frontend consumption**

### 2026-02-18 (Late Evening) — Testimonials & Case Studies Complete
- ✅ Created 12 client testimonials with featured status and display order
- ✅ Created 12 case studies with rich narrative content (Challenge → Solution → Deliverables → Outcome)
- Studio assignments: Machine Studio (5): ROVD, SAR, Trihedron, Symec, IDD | Commercial Studio (7): Cressi, Emily May, Bend Wellness, Equinox, Death By Coffee, Raylene, SOGA Organic

### 2026-02-18 (Evening) — Content Population & Schema Deployment
- ✅ Deployed Sanity schemas to cloud
- ✅ Created all foundational documents: Site Settings, 4 Studios, 10 Service Categories, 12 Clients, Homepage, About Page, Contact Page

### 2026-02-18 (Morning) — Sanity Schemas & Homepage Implementation
- ✅ Implemented all Sanity document types with field groups and validation
- ✅ Built custom Studio structure with organized sidebar navigation
- ✅ Fully implemented homepage with all sections
- ✅ Configured design system colors and typography in Tailwind
- ✅ Set up Sanity client and GROQ queries for Next.js frontend

### 2026-02-17 — Project Initialization
- Created CLAUDE.md with full project documentation
- Created /docs tracking directory
- Scaffolded Next.js frontend at /web
- Confirmed both services run locally

---

## Next Steps (Priority Order)

1. **Add real project content** — Create `project` documents in Sanity → Content Library → Projects; fill client, year, cover image, deliverables, media; project pages auto-inherit the locked template
2. **Upload parent logo** — Add `parentLogo` in Sanity → Home Page → Studios Overview; the connector tree renders below it linking to the three sub-studio cards
3. **Upload About section slideshow images** — Add images to `imageLeftSlides` and `imageRightSlides` in Sanity → Home Page → About
4. **Upload How We Work section image** — Add `sectionImage` in Sanity → Home Page → How We Work
5. **Populate studio card media** — Add `cardImage` or `cardVideoUrl` per studio inside Home Page → Studios Overview → Studio Card Media
6. **Re-enable Featured Work** — Populate with real content and re-enable, or replace section; currently disabled in CMS
7. **Build case study detail pages** — `/case-studies/[slug]` narrative view
8. **Contact form** — Form implementation + email routing to rebekah@breezemotionstudio.com
9. **SEO implementation** — Meta tags, OG images, sitemap.xml, structured data
10. **Domain + deployment** — DNS config, Vercel production deployment
11. **Swap studio sub-page hero images for video** — `studios/[slug]/page.tsx` hero currently uses static images per studio; Rebekah wants these eventually replaced with video (noted 2026-07-17, not scheduled to a session yet)

---

## Key Decisions Pending

- [x] Sanity schema structure ✅ Finalized — sections array page builder pattern
- [x] Video hosting strategy ✅ Decided — URL field supports YouTube, Vimeo, and direct file URLs with automatic detection
- [ ] Contact form backend (Sanity form submissions vs. external service like Resend)
- [ ] Analytics platform choice (Google Analytics vs. privacy-focused alternative)
