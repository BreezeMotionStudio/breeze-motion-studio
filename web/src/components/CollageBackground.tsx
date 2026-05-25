type CollageImage = {
  image?: {
    asset?: { url: string }
    alt?: string
  }
}

type Props = {
  images: CollageImage[]
  overlayOpacity?: number // 0-100, default 55
  variant?: 'services' | 'examples'
}

/*
  ─── SERVICES variant ────────────────────────────────────────────────────────
  Diagonal character running top-right → bottom-left.
  Interior vertices: A(58%,0) B(72%,28) C(100%,42) D(38%,68) E(32%,100) F(0%,55)

  Panel 1 — large irregular pentagon, top-left       bbox: 0%  0%  72% 68%
  Panel 2 — sharp narrow wedge, top-right            bbox: 58% 0%  42% 42%
  Panel 3 — broad irregular pentagon, right+bottom   bbox: 32% 28% 68% 72%
  Panel 4 — slim diagonal quad, bottom-left          bbox: 0%  55% 38% 45%

  ─── EXAMPLES variant ────────────────────────────────────────────────────────
  Wide horizontal band across the top, then diagonal cuts splitting the lower
  area into three zones. One panel is a true 3-corner triangle.
  Interior vertices: A(0%,32) B(62%,18) C(100%,35) D(68%,72) E(25%,100)

  Panel 1 — wide horizontal band, top (5 corners)    bbox: 0%  0%  100% 35%
  Panel 2 — large left-centre pentagon (5 corners)   bbox: 0%  18% 68%  82%
  Panel 3 — sharp right triangle (3 corners only)    bbox: 62% 18% 38%  54%
  Panel 4 — broad bottom-right sweep (4 corners)     bbox: 25% 35% 75%  65%
*/

const PANELS_SERVICES = [
  {
    clip: 'polygon(0% 0%, 58% 0%, 72% 28%, 38% 68%, 0% 55%)',
    img: { left: '0%', top: '0%', width: '72%', height: '68%' },
  },
  {
    clip: 'polygon(58% 0%, 100% 0%, 100% 42%, 72% 28%)',
    img: { left: '58%', top: '0%', width: '42%', height: '42%' },
  },
  {
    clip: 'polygon(72% 28%, 100% 42%, 100% 100%, 32% 100%, 38% 68%)',
    img: { left: '32%', top: '28%', width: '68%', height: '72%' },
  },
  {
    clip: 'polygon(0% 55%, 38% 68%, 32% 100%, 0% 100%)',
    img: { left: '0%', top: '55%', width: '38%', height: '45%' },
  },
]

const PANELS_EXAMPLES = [
  {
    // Wide horizontal band — straight top + right edges, diagonal bottom
    clip: 'polygon(0% 0%, 100% 0%, 100% 35%, 62% 18%, 0% 32%)',
    img: { left: '0%', top: '0%', width: '100%', height: '35%' },
  },
  {
    // Large left-centre pentagon — owns the majority of the lower-left
    clip: 'polygon(0% 32%, 62% 18%, 68% 72%, 25% 100%, 0% 100%)',
    img: { left: '0%', top: '18%', width: '68%', height: '82%' },
  },
  {
    // Pure triangle — the only 3-corner shape in either variant
    clip: 'polygon(62% 18%, 100% 35%, 68% 72%)',
    img: { left: '62%', top: '18%', width: '38%', height: '54%' },
  },
  {
    // Broad bottom-right sweep — 4 corners, wide base
    clip: 'polygon(68% 72%, 100% 35%, 100% 100%, 25% 100%)',
    img: { left: '25%', top: '35%', width: '75%', height: '65%' },
  },
]

export function CollageBackground({ images, overlayOpacity = 55, variant = 'services' }: Props) {
  const panels = variant === 'examples' ? PANELS_EXAMPLES : PANELS_SERVICES
  const filled = [...images, null, null, null, null].slice(0, 4)

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {panels.map(({ clip, img: bbox }, i) => {
        const src = filled[i]
        return (
          <div
            key={i}
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: clip }}
          >
            {src?.image?.asset?.url ? (
              <img
                src={src.image.asset.url}
                alt={src.image.alt || ''}
                style={{
                  position: 'absolute',
                  left: bbox.left,
                  top: bbox.top,
                  width: bbox.width,
                  height: bbox.height,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-[#1a1a1a]" />
            )}
          </div>
        )
      })}

      {/* Dark overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
      />
    </div>
  )
}
