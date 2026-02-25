# Breeze Motion Studio — Website

## Standing Rules (Always Apply)

1. **CMS–Frontend sync is mandatory.** Any new editable content on the frontend must be reflected in Sanity immediately — schema deployed, field populated, document published. No hardcoded text if it can be managed in Sanity. No empty fields left unpopulated after a change session.
2. **Schema changes require deployment.** After any edit to `schemaTypes/`, always run `npx sanity@latest schema deploy` before ending a session. Never leave undeployed schema changes.
3. **No orphan drafts.** After creating content in Sanity, always publish. Never leave relevant content as an unpublished draft unless explicitly instructed.

---

## Project

Fully remote, founder-led multi-media production and digital systems studio. This repo contains the Sanity CMS Studio and the Next.js frontend website (public portfolio).

**Founder:** Rebekah-Breeze Johnson | **Domain:** breezemotionstudio.com | **Contact:** rebekah@breezemotionstudio.com

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| CMS | Sanity Studio v5.9.0 |
| Frontend | Next.js 15.x (App Router) |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS 4.x |
| Fonts | Cormorant SC (brand), Arial (functional), Calibri (body) |
| Package Manager | npm |

---

## Sanity Config

| Setting | Value |
|---------|-------|
| Project ID | `ce9w3sdr` |
| Dataset | `production` |
| Studio (local) | http://localhost:3333 |

`web/.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID=ce9w3sdr` · `NEXT_PUBLIC_SANITY_DATASET=production` · `NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01`

---

## Dev Commands

```bash
# Sanity Studio (root)
npm run dev                         # Runs on :3333
npx sanity@latest schema deploy     # Deploy schema changes after edits to schemaTypes/

# Next.js website (web/)
cd web && npm run dev               # Runs on :3000
npm run build / lint
```

---

## Site Map

```
/                           → Homepage
/about                      → About (services + how we work)
/studios                    → Studios overview
/studios/[machine|commercial|creative|strategy]
/case-studies               → Listing
/case-studies/[slug]        → Detail
/contact                    → Contact form
```

---

## Key Business Rules

- **No public pricing** — consultation-based only
- **AI Studio is NOT public** — internal only, not on the website
- **Contact-first** — all CTAs lead to conversation, not checkout
- **Studios are portfolio categories** — portfolio-first pages
- **No stock imagery** — real projects only

---

## Code Style

- Prettier: no semicolons, single quotes, 100 char print width, no bracket spacing
- Main branch: `master` | Commit messages: imperative mood
- Components: PascalCase | Utilities: camelCase | Pages: kebab-case (App Router)
- Sanity schemas: camelCase

---

## Reference Docs

> Read `docs/INDEX.md` first to identify the right file. Load only what's needed.

- `docs/PROJECT_STATUS.md` — Progress log, next steps, pending decisions
- `docs/ARCHITECTURE.md` — Architecture decisions, deployment config, data flow
- `docs/CONTENT_MODEL.md` — Full schema reference, all 12 document types, approved clients
- `docs/DESIGN_SYSTEM.md` — Colors, typography, spacing, components, animation rules
