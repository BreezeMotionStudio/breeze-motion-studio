'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

type SliderImage = {
  _key?: string
  asset?: { url: string; metadata?: { dimensions?: { width: number; height: number } } }
  alt?: string
  caption?: string
}

type LightboxState = { src: string; alt: string }

const AUTO_MS = 4000
const SCROLL_STEP = 420

export function CaseStudyImageSlider({ images }: { images: SliderImage[] }) {
  const valid = images.filter((img) => !!img.asset?.url)
  const count = valid.length

  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const stoppedRef = useRef(false)
  const programmaticRef = useRef(false)
  const programmaticTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const [canScroll, setCanScroll] = useState(false)

  const checkScrollable = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScroll(el.scrollWidth > el.clientWidth + 4)
  }, [])

  const handleScroll = useCallback(() => {
    checkScrollable()
    // Only a scroll we didn't trigger ourselves counts as the user taking over.
    if (!programmaticRef.current) stoppedRef.current = true
  }, [checkScrollable])

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

    programmaticRef.current = true
    if (programmaticTimeoutRef.current) clearTimeout(programmaticTimeoutRef.current)
    programmaticTimeoutRef.current = setTimeout(() => { programmaticRef.current = false }, 700)

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
      if (!pausedRef.current && !stoppedRef.current) scrollByStepRef.current(1)
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
          onScroll={handleScroll}
          className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {valid.map((img, i) => (
            <div
              key={img._key || i}
              className="h-72 md:h-96 shrink-0 cursor-pointer overflow-hidden group"
              onClick={() => setLightbox({ src: `${img.asset!.url}?auto=format&q=92`, alt: img.alt || img.caption || '' })}
            >
              <Image
                src={img.asset!.url}
                alt={img.alt || img.caption || ''}
                width={img.asset!.metadata?.dimensions?.width || 1200}
                height={img.asset!.metadata?.dimensions?.height || 800}
                className="h-full w-auto object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                onLoad={checkScrollable}
              />
            </div>
          ))}
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
