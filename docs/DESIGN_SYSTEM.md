# Design System — Breeze Motion Studio

**Last Updated:** 2026-02-18

## Aesthetic

Minimal, cinematic, technical, editorial. Monochrome-led with controlled atmospheric depth. High-contrast, precision-driven, project-first presentation.

**The website should feel precise, confident, and premium — never loud, never busy.**

---

## Color Palette

### Primary Core (Monochrome Base)

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Pure Black | `#000000` | `--color-black` | Primary text, headers, authority elements |
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
| Hover (buttons) | Color inversion + slight scale-up |
| Hover (nav) | Instant color change (no transition) |
| Hover (cards) | Subtle highlight or lift |
| Image load | Fade in |
| Click | No animation |
| Cursor | Standard system cursor (no custom) |

**Rules:**
- No flashy or gimmicky animation
- Motion supports clarity and polish, not spectacle
- Smooth fades, slide-ins, hover states, highlights only
- Gentle transitions between sections

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

## Implementation Status (as of 2026-02-18)

### ✅ Implemented

**Color System:**
- All color palette values configured in `web/src/app/globals.css` using Tailwind v4's `@theme inline` directive
- Custom CSS properties (e.g., `--color-bms-accent`, `--color-bms-grey-400`)
- Accessible via Tailwind utilities (e.g., `bg-bms-accent`, `text-bms-grey-300`, `border-bms-dark-500`)

**Typography:**
- Font stack configured with CSS custom properties:
  - `--font-brand`: Cormorant SC (serif fallbacks)
  - `--font-functional`: Arial (sans-serif fallbacks)
  - `--font-body`: Calibri (sans-serif fallbacks)
- Base typography styles applied:
  - H1-H3: Brand font, uppercase, letter-spacing
  - H4-H6: Functional font
  - Body: Calibri font family
- Font utilities available via `font-[family-name:var(--font-brand)]` syntax

**Layout:**
- Root layout structure in place (`layout.tsx`)
- Basic metadata configured (site title, description)
- Antialiasing enabled for smooth text rendering
- Placeholders for navigation and footer components

**Homepage Sections:**
- Hero section with brand typography and CTA buttons
- Featured work grid with hover effects
- Studios overview cards with accent border styling
- Process steps display
- Testimonials section with quote styling
- Final CTA section with dual button layout
- Responsive grid layouts (mobile, tablet, desktop)

### 🔄 In Progress

**Components:**
- Navigation (structure defined, needs implementation)
- Footer (structure defined, needs implementation)
- Button variants (basic styling complete, needs full system)
- Card components (basic implementation on homepage)

**Design System:**
- Spacing scale (using Tailwind defaults, needs custom scale)
- Component variants (primary/secondary states)
- Animation definitions (subtle hover states implemented)
- Responsive breakpoints (using Tailwind defaults)

### ⏳ Pending

- Navigation component with dropdown for Studios
- Footer with social icons and contact information
- Complete button system (all variants and states)
- Studio and project card components
- Form components (contact form styling)
- Icon system integration
- Modal/overlay components
- Loading states and skeleton screens
- Error state designs
- Dark section variants for portfolio showcase
- Custom responsive breakpoints (if needed beyond Tailwind defaults)

### Technical Notes

- **Tailwind CSS v4:** Using the new `@import "tailwindcss"` syntax with inline theme configuration
- **CSS Variables:** All design tokens are available as both CSS custom properties and Tailwind utilities
- **Font Loading:** Fonts are loaded via system defaults; may need Google Fonts integration for Cormorant SC
- **Color Naming:** `bms-` prefix used for all brand colors to avoid conflicts with Tailwind defaults
- **Responsive Strategy:** Mobile-first approach with breakpoints at sm (640px), md (768px), lg (1024px), xl (1280px)

### Files

```
web/src/
├── app/
│   ├── globals.css          # ✅ Design system tokens + base styles
│   ├── layout.tsx           # ✅ Root layout structure
│   └── page.tsx             # ✅ Homepage with design system applied
└── components/              # ⏳ To be created
    ├── layout/
    │   ├── Navigation.tsx
    │   └── Footer.tsx
    ├── ui/
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   └── ...
    └── sections/
        ├── Hero.tsx
        └── ...
```
\n- STANDING RULE (Images): All future image components or UI containers with crop options must support a 'round crop' variant (e.g., rounded-full).
