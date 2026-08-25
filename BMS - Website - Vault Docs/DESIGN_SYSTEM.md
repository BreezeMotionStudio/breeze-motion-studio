# Design System — Breeze Motion Studio

**Last Updated:** 2026-04-18 (Session 24)

## Aesthetic

Minimal, cinematic, technical, editorial. Monochrome-led with controlled atmospheric depth. High-contrast, precision-driven, project-first presentation.

**The website should feel precise, confident, and premium — never loud, never busy.**

---

## Color Palette

### Primary Core (Monochrome Base)

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Pure Black | `#000000` | `--color-black` | Primary text, headers, authority elements |
| Deep Black | `#0d0d0d` | *(no variable — used as literal)* | Dark section backgrounds (e.g. StudiosHighlights, ServiceCategoriesGrid) |
| Pure White | `#FFFFFF` | `--color-white` | Primary background, negative space, contrast |
| Light Grey | `#E6E6E6` | `--color-grey-100` | Dividers, secondary backgrounds |
| Mid Grey | `#CCCCCC` | `--color-grey-200` | Hierarchy, dividers |
| Grey | `#B3B3B3` | `--color-grey-300` | Secondary text, subtle elements |
| Dark Grey | `#999999` | `--color-grey-400` | Supporting text |

### Secondary Accent

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Muted Steel Blue | `#535D66` | `--color-accent` | **PRIMARY ACCENT** — section dividers, borders, studio cards, nav accents, hover states, subtle background panels |
| Dark Grey 1 | `#4B4B4B` | `--color-dark-100` | Depth, layering |
| Dark Grey 2 | `#444E57` | `--color-dark-200` | Tonal separation |
| Dark Grey 3 | `#3F3F3F` | `--color-dark-300` | Layering |
| Dark Grey 4 | `#363F47` | `--color-dark-400` | Depth |
| Dark Grey 5 | `#333333` | `--color-dark-500` | Deep backgrounds |

### Color Rules
- High contrast only (dark on light or light on dark)
- Steel blue is structural, never decorative noise
- Project visuals always take priority over color

### Section Background Color Presets (`sectionBackground` COLOR_LIST)

All 13 brand swatches are available as a dropdown on every section background field (solid, gradient start, gradient end):

`#000000` Pure Black · `#0d0d0d` Deep Black · `#333333` Near Black · `#363F47` Steel Blue Dark · `#3F3F3F` Charcoal Dark · `#444E57` Dark Blue-Grey · `#4B4B4B` Charcoal · `#535D66` Steel Blue — Accent · `#999999` Dark Grey · `#CCCCCC` Mid Grey · `#E6E6E6` Light Grey · `#F5F5F5` Off-White · `#FFFFFF` Pure White

---

## Typography

### Font Stack

| Role | Font | Fallback | Style | Usage |
|------|------|----------|-------|-------|
| Brand / Display | Cormorant SC | Cormorant, serif | ALL CAPS / Small Caps | Hero headers, studio titles, key statements |
| Functional | Arial | Helvetica, sans-serif | Regular & Bold | Descriptions, briefs, technical clarity |
| Body | Calibri | Carlito, sans-serif | Regular | Website body copy, supporting text blocks |

### Typography Scale (Suggested)

| Element | Font | Size (desktop) | Weight | Transform |
|---------|------|----------------|--------|-----------|
| Hero Title | Cormorant SC | 48-64px | 600 | uppercase |
| Page Title | Cormorant SC | 36-48px | 600 | uppercase |
| Section Heading | Cormorant SC | 28-36px | 600 | uppercase |
| Subsection Heading | Arial | 20-24px | 700 | none |
| Body Text | Calibri | 16-18px | 400 | none |
| Small / Caption | Arial | 14px | 400 | none |
| Navigation | Arial | 14-16px | 400 | uppercase |
| Button Text | Arial | 14-16px | 700 | uppercase |

### Typography Rules
- Branding fonts are never overused
- Readability always wins over stylization
- Strong hierarchy, restrained expression
- Uniform typography across entire website

---

## Spacing

**Preference:** Balanced to Airy

- Generous whitespace throughout
- Clear separation between sections
- Content never feels cramped
- Visual breathing room around projects and media

### Spacing Scale (Suggested)

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Minimal gaps |
| sm | 8px | Tight spacing |
| md | 16px | Standard spacing |
| lg | 24px | Component spacing |
| xl | 32px | Section padding (inner) |
| 2xl | 48px | Section gaps |
| 3xl | 64px | Major section separation |
| 4xl | 96px | Hero / major gaps |
| 5xl | 128px | Page-level breathing room |

---

## Layout

### Global

- **Max content width:** 1280px (centered)
- **Page padding:** 24px (mobile), 48px (tablet), 64px+ (desktop)
- **Background:** Custom steel-blue to black gradient graphic (brand hero background). Fallback: solid black or dark grey.
- **Same background logic across all pages** — simple, restrained, lets media stand out

### Navigation

- **Position:** Top, horizontal, fixed
- **Background:** Black with slight transparency
- **Logo:** Top-left, clicks to home
- **Menu text (default):** Light grey
- **Menu hover:** White (instant, no animation)
- **Menu click:** No animation, immediate page load
- **Standard system cursor only** — no custom cursors

### Menu Structure

```
Home | About | Studios ▾ | Case Studies | Contact
                  │
                  ├── Machine Studio
                  ├── Commercial Studio
                  └── Creative Studio
```

- Services / "What We Do" lives inside the About page
- Studios dropdown: simple, clean, no animation beyond instant visibility

### Footer

- **Background:** Black or dark grey
- **Content:** Logo, contact details, social icons, optional expanded nav
- **Social icons:** Pure white, light transparent square background with rounded corners, subtle hover highlight
- Appears on every page

---

## Components

### Buttons

**Strict Rule: All buttons must be solid black with white text or solid white with black text. Outlines, transparent backgrounds, and other variants are strictly prohibited.**

Two variants only, implemented via `web/src/components/ui/Button.tsx`:

| Variant | Background | Text | Hover |
|---------|-----------|------|-------|
| `black` | `#000000` | `#FFFFFF` | Inverts to white bg / black text |
| `white` | `#FFFFFF` | `#000000` | Inverts to black bg / white text |

- Use `white` variant on dark section backgrounds (hero, CTA, testimonials, studios overview)
- Use `black` variant on light section backgrounds (contact form, services intro)
- Hover: slight color dulling + `scale-105` (subtle scale increase)
- All buttons use Arial, uppercase, tracked-widest, `rounded-sm`

**Button hover rule: Hover states must never invert colors. They use a slight color dulling effect (`hover:bg-neutral-800` for black buttons, `hover:bg-gray-200` for white buttons) alongside a slight scale increase (`hover:scale-105`). Color inversion on hover is strictly prohibited.**

### Hero Image Frame

All page hero sections (About, Contact, Services, Studios overview, individual Studios) include a diagonal parallelogram image frame on the right side of the hero.

**Shape:** Right 57% of the hero section, with a diagonal slash left edge. CSS `clip-path: polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)`. The hard diagonal edge is softened by a `linear-gradient` overlay fading `rgba(0,0,0,0.72)` → transparent from left to right.

**Empty state:** When no image is uploaded in Sanity, the frame renders with a faint `bg-white/[0.04]` fill and a camera icon + "Hero Image" label centred in the visible area — confirming the slot exists without breaking the layout.

**Sanity field:** `heroImage` (image, hotspot + alt) on each page's hero section type. Upload via Studio → relevant page → Hero section → Hero Image.

**Image optimisation:** Served via Sanity CDN at `?w=1400&auto=format&q=80` (WebP). `fetchPriority="high"` + `loading="eager"` since it is an LCP element.

**Component:** `web/src/components/HeroImageFrame.tsx` — accepts optional `url` and `alt` props; renders placeholder if `url` is absent.

### Cards (Studio / Project)

- Clean, bordered containers
- Steel blue for outlines or subtle background panels
- Large image representation with clear text overlay or below
- Click behavior: opens dedicated sub-page

### Contact Form

- **Container:** Dark grey background
- **Placeholder text:** Grey
- **User-entered text:** White
- **Submit button:** White with black text → inverts on hover
- **Fields:** Minimal required fields to reduce friction
- **Confirmation:** Clear, calm message on submission

---

## Motion & Animation

**Approach:** Subtle, intentional, precise

| Interaction | Animation |
|-------------|-----------|
| Page transitions | None (instant load) |
| Section reveal | Smooth fade-in on scroll |
| Hover (buttons) | Color dulling + slight scale-up (never inversion) |
| Hover (nav) | Instant color change (no transition) |
| Hover (cards) | Subtle highlight or lift |
| Image load | Fade in |
| Click | No animation |
| Cursor | Standard system cursor (no custom) |

**Scroll reveal rules:**
- Slide-up only (`translateY`) — no opacity fade
- 36px translate distance — subtle, not dramatic
- Re-triggers every time a section is scrolled into view from below
- Sections already scrolled past (above viewport) stay visible — no reset on upward scroll
- Applied via `scroll-catchup` class; initial state set by `ScrollObserver.tsx` after a 100ms hydration delay

**Sections excluded from scroll reveal (static, no animation):**
- Client logo strip (`HomeClientLogos`)
- "Work With Us" CTA (`HomeCta`)
- Testimonials section (`HomeTestimonials`)

**Carousel rules:**
- Testimonials carousel is manual-only — no auto-advance
- Chevron arrows + step indicator dots for navigation

**General rules:**
- No flashy or gimmicky animation
- Motion supports clarity and polish, not spectacle
- Slide-ups and hover states only — no fades on scroll reveal
- Gentle transitions between sections

### SVG Connector Tree Animation (Studios Overview + Services Page)

Used in two places: `HomeStudiosOverview.tsx` (homepage studios section) and `ServiceCategoriesGrid.tsx` (services page). Same `lineStyle()` helper and `pathLength="1"` technique in both.

**Technique:** `stroke-dashoffset` animation. `pathLength="1"` normalises all dash values to 0–1 regardless of actual SVG dimensions. Branch arm + drop combined into a single `<path>` with `strokeLinejoin="round"` — produces a smooth rounded corner at the junction. Individual `<line>` elements use `strokeLinecap="round"`.

**Studios Overview (homepage) timing:**
- Stem 250ms, arms 500ms, drops 200ms
- Enter delays: 0 / 200 / 500ms; exit delays: 750 / 500 / 300ms
- Drops end at `y2=82` — do not touch studio card tops
- Responsive: connector visible `lg:block` only; mobile shows a simple vertical divider line

**Services Page (`ServiceCategoriesGrid`) timing:**
- Stem 250ms, arms 500ms, drops 300ms
- Enter delays: 0 / 100 / 100ms; exit delays: 600 / 400 / 400ms — activates faster than homepage
- Drops end at `y=62` — do not touch service card tops
- Positioned `top: 118px` (below section title), desktop only (`hidden lg:flex`)
- Title uses a radial gradient shadow (`radial-gradient(ellipse 40% 80% at 50% 10%, ...)`) instead of a hard box

**Hover state:** React `useState` in each component (`'use client'`); section `onMouseEnter/onMouseLeave` sets `hovered` boolean passed to `lineStyle(hovered, enterDelay, exitDelay, duration)`.

---

## Image & Media Rules

- Projects are the hero — no stock filler
- Large, high-impact visuals where possible
- Cinematic framing and strong composition
- Consistent cropping and aspect ratios
- Visuals are allowed to dominate sections when needed
- Intelligent media optimization (compression, lazy loading, responsive assets)

### Icon Usage

- Minimal and functional
- Simple, line-based or geometric
- Neutral colors only (black, white, steel blue)
- Used sparingly for navigation or structural clarity
- Never decorative or illustrative

---

## Light / Dark Modes

**Approach:** Mixed, context-driven (not a user toggle)

- Light backgrounds for clarity, reading, and browsing
- Dark sections for impact, portfolio showcases, and cinematic emphasis
- Designers decide section-by-section, not user-controlled

---

## Responsive Design

**Priority:** Dual — desktop and mobile are equally important

- Scale intelligently across screen sizes
- Preserve visual impact and clarity on large displays
- Maintain usability, performance, and polish on mobile
- The site should communicate advanced adaptability, not a "mobile fallback" experience

### Breakpoints (Suggested)

| Name | Width | Context |
|------|-------|---------|
| sm | 640px | Mobile |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Wide screens |

---

## Implementation Status (as of 2026-02-28)

### ✅ Implemented

**Color System:**
- All color palette values configured in `web/src/app/globals.css` using Tailwind v4's `@theme inline` directive
- Custom CSS properties (e.g., `--color-bms-accent`, `--color-bms-grey-400`)
- Accessible via Tailwind utilities (`bg-bms-accent`, `text-bms-grey-300`, `border-bms-dark-500`, etc.)
- `sectionColors.ts` utility — `getBgStyle()`, `getTextClass()`, `isLightBg()` for CMS-driven section backgrounds

**Typography:**
- Font stack configured with CSS custom properties:
  - `--font-brand`: Cormorant SC (serif fallbacks)
  - `--font-functional`: Arial (sans-serif fallbacks)
  - `--font-body`: Calibri (sans-serif fallbacks)
- Applied via `font-[family-name:var(--font-brand)]` Tailwind syntax throughout all components
- Consistent scale applied across all pages (H1 hero → body copy)

**Layout:**
- Root layout (`layout.tsx`) with Nav + Footer, splash toggle, metadata
- All 6 page routes implemented with correct section layouts
- Responsive grids across all pages (mobile-first, md/lg breakpoints)

**Navigation:**
- `Nav.tsx` — fixed top, black bg, border-bottom `#1a1a1a`
- Logo: `siteSettings.primaryLogo`, round-cropped, 44px, fixed size in code
- Links: Arial uppercase tracking-widest, grey default → white on hover/active (no transition on hover — instant color change per spec)
- Mobile: hamburger (3 lines → X animation), slide-down nav panel
- CTA button: white bg, black text, `hover:bg-gray-200 hover:scale-105`
- **⚠️ PENDING:** Studios dropdown (Machine / Commercial / Creative sub-links) — not yet implemented; Nav links directly to `/studios`

**Footer:**
- `Footer.tsx` — dark background, CMS-driven links, social icons
- Brand column: logo → `siteTitle` → `footerTagline`, center-aligned
- Logo: `siteSettings.primaryLogo`, round-cropped, 80px (same source asset as Nav)

**Buttons — `web/src/components/ui/Button.tsx`:**
- Two variants only: `black` (bg-black text-white) and `white` (bg-white text-black)
- Hover: `hover:bg-neutral-800` (black) / `hover:bg-gray-200` (white) — **no color inversion**
- All buttons: `cursor-pointer`, `hover:scale-105 transition duration-200`, `rounded-sm`, Arial uppercase tracking-widest
- Button spacing: `topSpacing`/`bottomSpacing` presets via `btnSpacingClass()` helper

**Components Built:**
- `PortableTextContent.tsx` — Portable Text renderer
- `StudioCard.tsx` — 2:3 card with 1:1 media container, YouTube iframe or `<video>`
- `HowWeWorkSection.tsx` — animated SVG draw-on line, step lighting, window buffer hover detection
- `HomeTestimonials.tsx` — 3-visible carousel, 5s auto-advance, chevron nav, step dots
- `HomeClientLogos.tsx` — horizontal scroll logo strip, 3s auto-advance, `#535D66` background
- `HomeStudiosOverview.tsx` — parent logo + animated SVG connector tree (see SVG spec above); drop lines extended to `y2=106` with `overflow: visible` on SVG so they visually enter the card containers with no gap
- `ServiceCategoriesGrid.tsx` — `'use client'`; dark-bg card grid for services page; optional full-bleed bgImage + dark overlay; horizontal accent strip (stripImage + color tint overlay); floating white cards (`rounded-2xl`, `h-[440px]`, `hover:scale-[1.03]`); padded square image per card with PlaceholderImage fallback; gradient fade + absolute "Read More" bar with solid white bg; modal on click (full image, description, services tags, Close); body scroll lock + Escape key handler; `flex flex-wrap justify-center` for auto-centred last row; optional sectionTitle + CTA button
- `SplashAccents.tsx` — 4-pattern decorative corner graphics, global CMS toggle
- `ScrollObserver.tsx` — scroll-based reveal utility

**Motion:**
- HowWeWork SVG animation: CSS `linear()` easing, `stroke-dashoffset`/`stroke-dasharray`, window-level mouse/scroll detection, 56px buffer zone, 700ms deactivation delay
- Testimonials carousel: `translateX` with instant wrap-back via double-`requestAnimationFrame`
- Studios connector tree: sequential `stroke-dashoffset` with `pathLength="1"`, enter/exit reverse sequencing
- Splash accents: static (no animation — positioned via CSS)
- Studio cards: `hover:scale-[1.03] hover:z-10`
- Hero subtitle: soft radial gradient overlay behind text

### 🔄 In Progress

- Nav Studios dropdown (sub-studio links for Machine / Commercial / Creative)
- Contact form styling and implementation

### ⏳ Pending

- Nav Studios dropdown with animated sub-menu
- Contact form component (dark grey bg, white input text, white submit button)
- SEO meta tags and OG image templates
- Loading states / skeleton screens
- Error state designs
- Image lazy loading and Next.js `<Image>` component adoption

### Technical Notes

- **Tailwind CSS v4:** `@import "tailwindcss"` with `@theme inline` configuration in `globals.css`
- **CSS Variables:** All design tokens available as both custom properties and Tailwind utilities
- **Font Loading:** System fonts (Arial, Calibri); Cormorant SC loaded via CSS `font-face` or fallback serif
- **Color Naming:** `bms-` prefix for all brand colors
- **Responsive Strategy:** Mobile-first, breakpoints: sm 640px / md 768px / lg 1024px / xl 1280px
- **Button Hover Rule:** Never invert colors on hover — use dulling (`hover:bg-neutral-800` / `hover:bg-gray-200`) + scale

### Files

```
web/src/
├── app/
│   ├── globals.css          # ✅ Design system tokens + base styles
│   ├── layout.tsx           # ✅ Root layout + splash toggle
│   └── page.tsx             # ✅ Homepage (all sections)
└── components/
    ├── layout/
    │   ├── Nav.tsx           # ✅ Fixed nav (dropdown pending)
    │   └── Footer.tsx        # ✅ Footer
    ├── ui/
    │   ├── Button.tsx        # ✅ black/white variants
    │   └── PortableTextContent.tsx  # ✅
    ├── StudioCard.tsx        # ✅
    ├── HowWeWorkSection.tsx  # ✅
    ├── HomeTestimonials.tsx  # ✅
    ├── HomeClientLogos.tsx   # ✅
    ├── HomeStudiosOverview.tsx # ✅
    ├── ServiceCategoriesGrid.tsx # ✅
    ├── SplashAccents.tsx     # ✅
    └── ScrollObserver.tsx    # ✅
```
\n- STANDING RULE (Images): All future image components or UI containers with crop options must support a 'round crop' variant (e.g., rounded-full).
