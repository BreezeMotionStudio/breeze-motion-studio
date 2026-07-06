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

const VISIBLE = 4
const AUTO_MS = 4000

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

  const [idx, setIdx] = useState(0)
  const [transit, setTransit] = useState(true)
  const idxRef = useRef(0)
  const pausedRef = useRef(false)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const maxIdx = Math.max(0, count - VISIBLE)
  const canScroll = count > VISIBLE
  const widthPct = count > VISIBLE ? 100 / VISIBLE : 100 / Math.max(count, 1)
  const trackPct = count * widthPct

  const handleNext = useCallback(() => {
    const cur = idxRef.current
    if (cur >= maxIdx) {
      setTransit(false)
      idxRef.current = 0
      setIdx(0)
      requestAnimationFrame(() => requestAnimationFrame(() => setTransit(true)))
    } else {
      setTransit(true)
      idxRef.current = cur + 1
      setIdx(cur + 1)
    }
  }, [maxIdx])

  const handlePrev = () => {
    setTransit(true)
    const next = idxRef.current <= 0 ? maxIdx : idxRef.current - 1
    idxRef.current = next
    setIdx(next)
  }

  const handleNextRef = useRef(handleNext)
  useEffect(() => {
    handleNextRef.current = handleNext
  }, [handleNext])

  useEffect(() => {
    if (!canScroll) return
    const id = setInterval(() => {
      if (!pausedRef.current) handleNextRef.current()
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [canScroll])

  if (count === 0) return null

  const translatePct = idx * 100 / count

  return (
    <section
      className="bg-black py-16"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 md:gap-6">

          <button
            onClick={handlePrev}
            aria-label="Previous images"
            className={`shrink-0 text-[#555] hover:text-white group transition-colors duration-300 ${canScroll ? '' : 'invisible'}`}
          >
            <span className="block transition-transform duration-300 group-hover:scale-[1.125]">
              <ChevronLeft />
            </span>
          </button>

          <div className="flex-1 overflow-hidden">
            <div
              className="flex"
              style={{
                width: `${trackPct}%`,
                transform: `translateX(-${translatePct}%)`,
                transition: transit ? 'transform 0.6s ease-in-out' : 'none',
              }}
            >
              {valid.map((img, i) => (
                <div
                  key={img._key || i}
                  style={{ width: `${100 / count}%` }}
                  className="h-72 md:h-96 shrink-0 cursor-pointer overflow-hidden group"
                  onClick={() => setLightbox({ src: `${img.asset!.url}?auto=format&q=92`, alt: img.alt || img.caption || '' })}
                >
                  <img
                    src={`${img.asset!.url}?w=800&auto=format&q=80`}
                    alt={img.alt || img.caption || ''}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next images"
            className={`shrink-0 text-[#555] hover:text-white group transition-colors duration-300 ${canScroll ? '' : 'invisible'}`}
          >
            <span className="block transition-transform duration-300 group-hover:scale-[1.125]">
              <ChevronRight />
            </span>
          </button>

        </div>
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
