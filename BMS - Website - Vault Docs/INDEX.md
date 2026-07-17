# Docs Index — Breeze Motion Studio

Read this file first to identify which doc you need. Load only the specific file — do not load all docs.

---

- **`PROJECT_STATUS.md`** — Session-by-session development log, current next steps, pending decisions, and overall progress tracker.

- **`ARCHITECTURE.md`** — System architecture decisions (21 decisions: monorepo, App Router, page builder, video strategy, section disable/enable, CTA buttons, button spacing, round crop, splash accents, SVG connector tree, universal `sectionBackground` type, automated bug-prevention system, portable-text style marks, content override patterns, sitewide hero title animation, mobile responsiveness/fixed-count carousels, full mobile responsiveness pass, hero text-shadow→soft-underlay redesign), data flow, deployment config (Vercel project ID `prj_4gOS5f8whFepZKtL84dlIioD07eX`, org ID `team_wmY0g6EXdsf08mWS9gMta19q`), full component inventory including `HeroImageFrame`, `AboutMission`, `CollageBackground`, `ServiceCategoriesGrid`, `StudioProjectsGrid`, and actual directory structure. Last updated Session 35.

- **`CONTENT_MODEL.md`** — Complete Sanity schema reference: all document types with every field defined, section types for all 6 page singletons, shared types including `sectionBackground` (universal background type — 13-swatch COLOR_LIST, solid/gradient/image, `resolveBg`/`resolveTextClass` helpers), `simpleRichText` and the `textColor`/`textFont`/`textSize`/`textStyle` marks system, `ctaButton` with spacing presets, relationships diagram, approved clients list, and content population status. Last updated Session 34.

- **`DESIGN_SYSTEM.md`** — Full design spec: color palette with hex values and CSS variables (`bms-` prefix), typography scale (Cormorant SC / Arial / Calibri), spacing scale, layout rules, component specs (buttons, cards, contact form), motion and animation rules, responsive breakpoints, and implementation status.
