'use client'

import { useState, useRef, useEffect } from 'react'
import { resolveBg, resolveTextClass, resolveIsLight } from '@/lib/sectionBackground'
import { Button } from '@/components/ui/Button'
import { SimpleRichText } from '@/components/ui/SimpleRichText'

type Testimonial = {
  _id: string
  quote?: string
  attribution?: string
  role?: string
  client?: { name?: string }
}

function useVisibleCount() {
  const [visible, setVisible] = useState(3)
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      setVisible(w < 640 ? 1 : w < 1024 ? 2 : 3)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])
  return visible
}

export function HomeTestimonials({ s, testimonials }: { s: any; testimonials: Testimonial[] }) {
  const list = testimonials || []
  const count      = list.length
  const visible    = useVisibleCount()
  const maxIdx     = Math.max(0, count - visible)
  const canScroll  = count > visible

  const cardWidthPct  = count > visible ? 100 / visible : 100 / Math.max(count, 1)
  const trackWidthPct = count * cardWidthPct

  const [idx, setIdx]         = useState(0)
  const [transit, setTransit] = useState(true)
  const idxRef                = useRef(0)

  useEffect(() => {
    if (idxRef.current > maxIdx) {
      idxRef.current = maxIdx
      setIdx(maxIdx)
    }
  }, [maxIdx])

  const handlePrev = () => {
    setTransit(true)
    const next = idxRef.current <= 0 ? maxIdx : idxRef.current - 1
    idxRef.current = next
    setIdx(next)
  }

  const handleNext = () => {
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
  }

  const translatePct = idx * 100 / count
  const onDark = !resolveIsLight(s.sectionBg, s.bgColor)

  const touchStartX = useRef<number | null>(null)
  const SWIPE_THRESHOLD = 40

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (deltaX > SWIPE_THRESHOLD) handlePrev()
    else if (deltaX < -SWIPE_THRESHOLD) handleNext()
  }

  if (count === 0) return null

  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} py-24`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.bgVideoUrl && (
        <video className="absolute inset-0 w-full h-full object-cover" src={s.bgVideoUrl} autoPlay muted loop playsInline />
      )}
      {!s.bgVideoUrl && s.bgImage?.asset?.url && (
        <>
          <img className="absolute inset-0 w-full h-full object-cover" src={s.bgImage.asset.url} alt={s.bgImage.alt || ''} />
          <div className="absolute inset-0 bg-black/55" />
        </>
      )}

      <div className="scroll-catchup relative z-10 max-w-6xl mx-auto px-6">

        {s.heading && (
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-center mb-14">
            <SimpleRichText value={s.heading} />
          </h2>
        )}

        <div className="flex items-center gap-3 sm:gap-10">

          <button
            onClick={handlePrev}
            aria-label="Previous testimonials"
            className={`hidden sm:block shrink-0 px-2 text-[#999999] hover:text-white group cursor-pointer transition-colors duration-300${canScroll ? '' : ' invisible'}`}
          >
            <svg width="16" height="56" viewBox="0 0 16 56" fill="none" className="transition-transform duration-300 group-hover:scale-[1.125]">
              <polyline points="14,2 2,28 14,54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex-1 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div
              className="flex"
              style={{
                width: `${trackWidthPct}%`,
                transform: `translateX(-${translatePct}%)`,
                transition: transit ? 'transform 0.6s ease-in-out' : 'none',
              }}
            >
              {list.map((t) => (
                <div
                  key={t._id}
                  style={{ width: `${100 / count}%` }}
                  className="px-5"
                >
                  <blockquote className="text-center">
                    <p className="text-base italic text-bms-grey-200 mb-4 font-[family-name:var(--font-body)] leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="text-sm text-bms-grey-400 tracking-wide uppercase leading-none">
                      {t.attribution}
                      {t.role && ` · ${t.role}`}
                      {t.client?.name && ` · ${t.client.name}`}
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next testimonials"
            className={`hidden sm:block shrink-0 px-2 text-[#999999] hover:text-white group cursor-pointer transition-colors duration-300${canScroll ? '' : ' invisible'}`}
          >
            <svg width="16" height="56" viewBox="0 0 16 56" fill="none" className="transition-transform duration-300 group-hover:scale-[1.125]">
              <polyline points="2,2 14,28 2,54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>

        {canScroll && (
          <div className="flex justify-center gap-2 mt-0">
            {Array.from({ length: maxIdx + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => { setTransit(true); idxRef.current = i; setIdx(i) }}
                aria-label={`Jump to position ${i + 1}`}
                className={`h-px transition-all duration-300 ${i === idx ? 'w-8 bg-white' : 'w-4 bg-white/25'}`}
              />
            ))}
          </div>
        )}

        {s.buttons && s.buttons.length > 0 && (
          <div className="text-center mt-14 flex flex-wrap justify-center gap-4">
            {s.buttons.map((btn: { _key?: string; label?: string; url?: string }) => (
              <Button key={btn._key} variant={onDark ? 'white' : 'black'} href={btn.url}>
                {btn.label}
              </Button>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
