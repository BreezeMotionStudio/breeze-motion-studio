import Image from 'next/image'

type Corner = 'tl' | 'tr' | 'bl' | 'br'

type SplashSpec = {
  src: string
  corner: Corner
  size?: number     // rendered width in px, default 460
  flipX?: boolean
  flipY?: boolean
}

// Canvas dimensions: 5781 × 4000
const CANVAS_RATIO = 4000 / 5781

// White-art PNGs only. When dark=false (light background), filter: invert(1) turns them black.
// Art sits in the upper-right quadrant of each canvas, so:
//   corner tr + no flip     → art at top-right
//   corner tl + flipX       → art at top-left
//   corner br + flipY       → art at bottom-right
//   corner bl + flipX+flipY → art at bottom-left
//
// All 4 corners are filled per pattern. First entry = dominant corner (largest).
const PATTERNS: SplashSpec[][] = [
  // Pattern 0 — top-right dominant
  [
    { src: '/splash/splash-fg.png',        corner: 'tr', size: 540 },
    { src: '/splash/splash-headphone.png', corner: 'tl', size: 440, flipX: true },
    { src: '/splash/splash-cam-white.png', corner: 'br', size: 460, flipY: true },
    { src: '/splash/splash-fg.png',        corner: 'bl', size: 380, flipX: true, flipY: true },
  ],

  // Pattern 1 — top-left dominant
  [
    { src: '/splash/splash-headphone.png', corner: 'tl', size: 540, flipX: true },
    { src: '/splash/splash-fg.png',        corner: 'tr', size: 440 },
    { src: '/splash/splash-cam-white.png', corner: 'bl', size: 460, flipX: true, flipY: true },
    { src: '/splash/splash-headphone.png', corner: 'br', size: 380, flipY: true },
  ],

  // Pattern 2 — bottom-right dominant
  [
    { src: '/splash/splash-cam-white.png', corner: 'br', size: 540, flipY: true },
    { src: '/splash/splash-headphone.png', corner: 'tl', size: 440, flipX: true },
    { src: '/splash/splash-fg.png',        corner: 'tr', size: 420 },
    { src: '/splash/splash-cam-white.png', corner: 'bl', size: 380, flipX: true, flipY: true },
  ],

  // Pattern 3 — bottom-left dominant
  [
    { src: '/splash/splash-fg.png',        corner: 'bl', size: 540, flipX: true, flipY: true },
    { src: '/splash/splash-headphone.png', corner: 'tr', size: 440 },
    { src: '/splash/splash-cam-white.png', corner: 'tl', size: 420, flipX: true },
    { src: '/splash/splash-fg.png',        corner: 'br', size: 380, flipY: true },
  ],
]

function cornerStyle(corner: Corner): React.CSSProperties {
  // Negative vw/vh offsets push graphics outside the section boundary so only
  // the art — which sits in the canvas corner — peeks in right at the screen edge.
  switch (corner) {
    case 'tl': return { top: '-6vh', left: '-18vw' }
    case 'tr': return { top: '-6vh', right: '-18vw' }
    case 'bl': return { bottom: '-6vh', left: '-18vw' }
    case 'br': return { bottom: '-6vh', right: '-18vw' }
  }
}

/**
 * Renders splash graphic accents flush in every section corner.
 *
 * - pattern: 0–3, determines which graphic combination is used
 * - dark:    true  = dark background → white art shown as-is
 *            false = light background → white art inverted to black via CSS filter
 *
 * Visibility is globally toggled by the `.splash-off` class on <body>
 * (set via the "Splash Accents" toggle in Sanity Site Settings).
 *
 * The parent section MUST have `position: relative` and `overflow: hidden`.
 */
export function SplashAccents({ pattern, dark }: { pattern: number; dark: boolean }) {
  const specs = PATTERNS[pattern % PATTERNS.length]
  if (!specs.length) return null

  return (
    <>
      {specs.map((spec, i) => {
        const w = spec.size ?? 460
        const h = Math.round(w * CANVAS_RATIO)
        const transforms: string[] = []
        if (spec.flipX) transforms.push('scaleX(-1)')
        if (spec.flipY) transforms.push('scaleY(-1)')

        return (
          <div
            key={i}
            className="splash-accent absolute pointer-events-none select-none"
            aria-hidden="true"
            style={{
              ...cornerStyle(spec.corner),
              zIndex: 20,
              filter: dark ? undefined : 'invert(1)',
              transform: transforms.length ? transforms.join(' ') : undefined,
            }}
          >
            <Image
              src={spec.src}
              alt=""
              width={w}
              height={h}
              sizes={`min(${w}px, 45vw)`}
              className="block h-auto"
              style={{ width: w, maxWidth: 'min(100%, 45vw)' }}
              loading="lazy"
              draggable={false}
            />
          </div>
        )
      })}
    </>
  )
}
