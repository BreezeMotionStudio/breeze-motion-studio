# Breeze Motion Studio - Website

## Standing Rules (Always Apply)

1. **CMS–Frontend synchronization is mandatory.** Any change to the frontend that introduces new editable content (new fields, new sections, new text) must be reflected in Sanity immediately — schema deployed, field populated with appropriate content, document published. No hardcoded text on the frontend if the content can reasonably be managed in Sanity. No empty fields left unpopulated after a change session.

2. **Schema changes require deployment.** After any edit to `schemaTypes/`, always run `npx sanity@latest schema deploy` before ending a work session. Never leave undeployed schema changes.

3. **No orphan drafts.** After creating or migrating content in Sanity, always publish the document. Never leave relevant content as an unpublished draft unless explicitly instructed otherwise.

---

## Project Overview

Breeze Motion Studio is a fully remote, founder-led multi-media production and digital systems studio. This repository contains both the **Sanity CMS Studio** (content management) and the **Next.js frontend website** (public-facing portfolio).

The website functions as a living, evolving portfolio and authority platform designed to attract inbound, high-quality clients. It is NOT a static brochure — it is a working system that grows as projects are completed.

**Founder:** Rebekah-Breeze Johnson
**Domain:** breezemotionstudio.com
**Contact:** rebekah@breezemotionstudio.com / info@breezemotionstudio.com

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| CMS | Sanity Studio | v5.9.0 |
| Frontend | Next.js | 15.x (App Router) |
| Language | TypeScript | 5.8 |
| Styling | Tailwind CSS | 4.x |
| Fonts | Cormorant SC (brand), Arial (functional), Calibri (body) |
| Deployment | Vercel (frontend) + Sanity Cloud (CMS) |
| Package Manager | npm |

---

## Repository Structure

```
breeze-motion-studio/
├── CLAUDE.md                    # This file — project documentation
├── docs/                        # Project development tracking
│   ├── PROJECT_STATUS.md        # Current status and progress log
│   ├── ARCHITECTURE.md          # Architecture decisions and rationale
│   ├── CONTENT_MODEL.md         # Sanity schema design and content model
│   └── DESIGN_SYSTEM.md         # Visual design system reference
│
├── sanity.config.ts             # Sanity Studio configuration
├── sanity.cli.ts                # Sanity CLI configuration
├── schemaTypes/                 # Sanity schema definitions
│   └── index.ts                 # Schema type exports
│
├── web/                         # Next.js frontend website
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # Reusable UI components
│   │   ├── lib/                 # Utilities, Sanity client, queries
│   │   └── styles/              # Global styles
│   └── public/                  # Static assets
│
├── static/                      # Sanity Studio static files
├── .env.local                   # Local environment variables (git-ignored)
├── package.json                 # Sanity Studio dependencies
├── tsconfig.json                # Sanity Studio TypeScript config
└── eslint.config.mjs            # Sanity Studio ESLint config
```

---

## Development Commands

### Running Locally (Both Services)

**Sanity Studio** (CMS — content editing interface):
```bash
# From project root
npm run dev
# Runs on http://localhost:3333
```

**Next.js Website** (public-facing frontend):
```bash
# From /web directory
cd web
npm run dev
# Runs on http://localhost:3000
```

**Run both simultaneously** — open two terminal windows/tabs:
- Terminal 1: `npm run dev` (Sanity Studio on :3333)
- Terminal 2: `cd web && npm run dev` (Website on :3000)

### Other Commands

```bash
# Sanity Studio
npm run build          # Build Studio for production
npm run deploy         # Deploy Studio to Sanity Cloud
npm run deploy-graphql # Deploy GraphQL API

# Next.js Website (from /web)
cd web
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
```

---

## Sanity Configuration

| Setting | Value |
|---------|-------|
| Project ID | `ce9w3sdr` |
| Dataset | `production` |
| Studio URL (local) | http://localhost:3333 |
| Plugins | Structure Tool, Vision Tool |
| Auto-updates | Enabled |

### Environment Variables

**Sanity Studio** (root `.env.local`):
```
# Managed by Vercel — do not edit manually
VERCEL_OIDC_TOKEN=...
```

**Next.js Website** (`web/.env.local`):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=ce9w3sdr
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=<your-read-token>
```

---

## Website Architecture

### Site Map

```
/                           → Homepage
/about                      → About / Studio Overview (includes Services + How We Work)
/studios                    → Studios master page (overview of all studios)
/studios/machine            → Machine Studio (industrial/technical portfolio)
/studios/commercial         → Commercial Studio (corporate/brand portfolio)
/studios/creative           → Creative Studio (artistic/experimental portfolio)
/studios/media-systems      → Media Systems & Brand Optimization
/case-studies               → Case Studies listing
/case-studies/[slug]        → Individual case study
/contact                    → Contact page with form
```

### Studio Structure (Business Model)

Breeze Motion Studio is a parent entity with three sub-studios and one cross-studio service:

1. **Machine Studio** — Industrial manufacturing, automation, engineering, robotics
2. **Commercial Studio** — Corporate, professional services, consumer brands, digital platforms
3. **Creative Studio** — Artistic, experiential, stylized creative work
4. **Media Systems & Brand Optimization** — Cross-studio operational and workflow services

### Content Model Summary

Primary document types in Sanity:
- **Project** — Portfolio entries (linked to studios, clients, services)
- **CaseStudy** — Narrative deep-dives into selected projects
- **Studio** — Studio definitions (Machine, Commercial, Creative, Media Systems)
- **Service** — Service categories and descriptions
- **ServiceCategory** — Grouping for services
- **Client** — Client profiles with testimonials
- **Testimonial** — Client testimonials (linked to clients and projects)
- **SiteSettings** — Global site configuration (SEO, contact info, social links)
- **HomePage** — Homepage content blocks (hero, featured work, CTAs)
- **AboutPage** — About page content (founder bio, mission, how we work)
- **ContactPage** — Contact page content

---

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Pure Black | `#000000` | Primary text, headers, authority elements |
| Pure White | `#FFFFFF` | Primary background, negative space |
| Light Grey | `#E6E6E6` | Dividers, secondary backgrounds |
| Mid Grey | `#CCCCCC` | Hierarchy, secondary text |
| Grey | `#B3B3B3` | Subtle elements |
| Dark Grey | `#999999` | Supporting text |
| Muted Steel Blue | `#535D66` | **PRIMARY ACCENT** — dividers, borders, cards, hover states |
| Supporting Dark Greys | `#4B4B4B`, `#444E57`, `#3F3F3F`, `#363F47`, `#333333` | Depth, layering |

### Typography

| Role | Font | Style |
|------|------|-------|
| Brand / Hero | Cormorant SC | ALL CAPS / Small Caps — elegant, authoritative |
| Functional / Reading | Arial | Regular & Bold — neutral, legible |
| Body Copy | Calibri | Regular — clean, modern, readable |

### Design Principles

- Minimal, cinematic, technical, editorial aesthetic
- Monochrome-led with controlled atmospheric depth
- High-contrast, precision-driven, project-first presentation
- Generous whitespace, clear section separation
- Subtle animations only (smooth fades, slide-ins, hover states)
- No stock imagery — real projects only
- Standard system cursor — no custom cursors

---

## Brand Voice

- **Tone:** Professional, precise, confident, calm, human, grounded
- **Voice:** First person ("We design...", "We work with...")
- **Spelling:** US English
- **Avoid:** Hype language, buzzwords, salesy phrasing, vague promises
- **Style:** Short to medium sentences, declarative, no fluff

---

## Key Business Rules

1. **No public pricing** — All services are consultation-based and project-specific
2. **AI is a tool, not a headline** — AI usage is internal; no AI-specific marketing yet
3. **AI Studio is NOT public** — Exists internally but not launched on the website
4. **Portfolio is the product** — The website itself is the primary portfolio
5. **Contact-first model** — All CTAs lead to conversation, not checkout
6. **Studios are portfolio categories** — Each studio page is a portfolio-first page
7. **Case studies are selective** — Not every project gets a case study

### Approved Clients for Display

ROVD Group, SAR Electronics SA, Trihedron, Symec Digital, Industrial Design & Detailing (IDD), SOGA Organic, Cressi, Emily May Aesthetics, Bend Wellness, Equinox Consulting, Death By Coffee Roastery, Raylene Pilates

### Industries to Highlight

- Industrial manufacturing, simulation, automation, engineering
- Corporate and professional services
- Technology companies and digital platforms
- Established consumer brands

### Industries to Downplay

- Private events (weddings, celebrations)
- Personal/family shoots (maternity, baby, lifestyle)

---

## Deployment

| Service | Platform | Details |
|---------|----------|---------|
| Sanity Studio | Sanity Cloud | `npm run deploy` from root |
| Next.js Website | Vercel | Auto-deploys from git, linked project |
| Domain | Namecheap | breezemotionstudio.com — DNS managed by studio |

**Vercel Project:**
- Project ID: `prj_4gOS5f8whFepZKtL84dlIioD07eX`
- Org ID: `team_wmY0g6EXdsf08mWS9gMta19q`

---

## Development Conventions

### Code Style
- **Prettier:** No semicolons, single quotes, 100 char print width, no bracket spacing
- **ESLint:** Sanity Studio config (`@sanity/eslint-config-studio`)
- **TypeScript:** Strict mode enabled

### Git Practices
- Main branch: `master`
- Commit messages: Clear, descriptive, imperative mood
- No secrets in commits (`.env*.local` is gitignored)

### File Naming
- Components: PascalCase (`StudioCard.tsx`)
- Utilities: camelCase (`sanityClient.ts`)
- Pages: lowercase with hyphens (Next.js App Router conventions)
- Sanity schemas: camelCase (`caseStudy.ts`)

---

## Reference Documents

- **Build Input Document:** `BREEZE MOTION STUDIO - WEBSITE BUILD INPUT DOCUMENT.txt` (on Desktop)
- **Project Tracking:** `docs/PROJECT_STATUS.md`
- **Architecture Decisions:** `docs/ARCHITECTURE.md`
- **Content Model Design:** `docs/CONTENT_MODEL.md`
- **Design System Details:** `docs/DESIGN_SYSTEM.md`
- **Workflow Guide:** `docs/WORKFLOW_GUIDE.md` — Session startup, Claude usage, closing procedures
- **Tools Integration:** `docs/TOOLS_INTEGRATION.md` — How Warp, Claude, Sanity, GitHub, and Vercel connect
- **Sanity Studio Guide:** `docs/SANITY_STUDIO_GUIDE.md` — Complete interface walkthrough and content editing guide
