import Image from 'next/image'

type HeroImageFrameProps = {
  url?: string
  videoUrl?: string
  alt?: string
  overlay?: boolean
}

const CLIP = 'polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)'

/**
 * Diagonal parallelogram frame for page hero sections.
 * Covers the right ~57% of the containing section.
 * The left edge is a diagonal slash; right/top/bottom edges are straight.
 * The containing section must be `relative overflow-hidden`.
 * Renders a visible placeholder when no image URL is provided.
 * When `videoUrl` is set it takes priority over `url` and plays on loop.
 */
export function HeroImageFrame({ url, videoUrl, alt = '', overlay = true }: HeroImageFrameProps) {
  if (!url && !videoUrl) {
    return (
      <div
        className="absolute inset-y-0 right-0 w-[57%]"
        style={{ clipPath: CLIP }}
      >
        <div className="relative w-full h-full bg-white/[0.04]">
          {/* indicator centred in the visible parallelogram area */}
          <div className="absolute left-[59%] top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 text-white/30 select-none pointer-events-none">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="2" y="6" width="20" height="14" rx="2" />
              <circle cx="12" cy="13" r="3.5" />
              <path d="M7 6l1.5-2.5h5L15 6" />
            </svg>
            <span
              className="text-[9px] uppercase tracking-[0.2em] font-[family-name:var(--font-functional)]"
              style={{ whiteSpace: 'nowrap' }}
            >
              Hero Image
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="absolute inset-y-0 right-0 w-[57%]"
        style={{ clipPath: CLIP }}
      >
        {videoUrl ? (
          <video
            className="w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={url!}
            alt={alt}
            fill
            className="object-cover"
            sizes="57vw"
            priority
          />
        )}
      </div>
      {overlay && (
        <>
          {/* flat scrim keeps hero title/description legible over the image regardless of its brightness */}
          <div
            className="absolute inset-y-0 right-0 w-[57%] bg-black/55 pointer-events-none z-[1]"
            style={{ clipPath: CLIP }}
          />
          {/* gradient softens the hard diagonal edge into the dark bg */}
          <div
            className="absolute inset-y-0 right-0 w-[57%] pointer-events-none z-[1]"
            style={{
              clipPath: CLIP,
              background:
                'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 40%, transparent 70%)',
            }}
          />
        </>
      )}
    </>
  )
}
