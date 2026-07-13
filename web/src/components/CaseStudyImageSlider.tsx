'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

type SliderImage = {
  _key?: string
  asset?: { url: string }
  alt?: string
  caption?: string
}

type LightboxState = { src: string; alt: string }

const AUTO_MS = 4000
const SCROLL_STEP = 420

function ChevronLeft() {
  return (
    <svg width="16" height="56" viewBox="0 0 16 56" fill="none">
      <polyline points="14,2 2,28 14,54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="56" viewBox="0 0 16 56" fill="none">
      <polyline points="2,2 14,28 2,54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CaseStudyImageSlider({ images }: { images: SliderImage[] }) {
  const valid = images.filter((img) => !!img.asset?.url)
  const count = valid.length

  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const [canScroll, setCanScroll] = useState(false)

  const checkScrollable = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScroll(el.scrollWidth > el.clientWidth + 4)
  }, [])

  useEffect(() => {
    checkScrollable()
    window.addEventListener('resize', checkScrollable)
    return () => window.removeEventListener('resize', checkScrollable)
  }, [checkScrollable])

  const scrollByStep = useCallback((dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const atEnd = dir === 1 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    const atStart = dir === -1 && el.scrollLeft <= 4
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else if (atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' })
    }
  }, [])

  const scrollByStepRef = useRef(scrollByStep)
  useEffect(() => {
    scrollByStepRef.current = scrollByStep
  }, [scrollByStep])

  useEffect(() => {
    if (!canScroll) return
    const id = setInterval(() => {
      if (!pausedRef.current) scrollByStepRef.current(1)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [canScroll])

  if (count === 0) return null

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className="relative">

        <div
          ref={trackRef}
          onScroll={checkScrollable}
          className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {valid.map((img, i) => (
            <div
              key={img._key || i}
              className="h-72 md:h-96 shrink-0 cursor-pointer overflow-hidden group"
              onClick={() => setLightbox({ src: `${img.asset!.url}?auto=format&q=92`, alt: img.alt || img.caption || '' })}
            >
              <img
                src={`${img.asset!.url}?w=800&auto=format&q=80`}
                alt={img.alt || img.caption || ''}
                className="h-full w-auto object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                loading="lazy"
                onLoad={checkScrollable}
              />
            </div>
          ))}
        </div>

        {/* Left/right white fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-white/85 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-white/85 to-transparent" />

        <button
          onClick={() => scrollByStep(-1)}
          aria-label="Previous images"
          className={`absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 text-black/35 hover:text-black group transition-colors duration-300 ${canScroll ? '' : 'invisible'}`}
        >
          <span className="block transition-transform duration-300 group-hover:scale-[1.125]">
            <ChevronLeft />
          </span>
        </button>

        <button
          onClick={() => scrollByStep(1)}
          aria-label="Next images"
          className={`absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 text-black/35 hover:text-black group transition-colors duration-300 ${canScroll ? '' : 'invisible'}`}
        >
          <span className="block transition-transform duration-300 group-hover:scale-[1.125]">
            <ChevronRight />
          </span>
        </button>

      </div>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}
