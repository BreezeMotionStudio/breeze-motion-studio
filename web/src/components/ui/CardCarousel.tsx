'use client'

import { useEffect, useRef, useState } from 'react'

const SWIPE_THRESHOLD = 40

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

type Props<T> = {
  items: T[]
  keyFor: (item: T, i: number) => string
  renderItem: (item: T) => React.ReactNode
  ariaLabel: string
  itemClassName?: string
}

export function CardCarousel<T>({ items, keyFor, renderItem, ariaLabel, itemClassName = 'px-4' }: Props<T>) {
  const count = items.length
  const visible = useVisibleCount()
  const maxIdx = Math.max(0, count - visible)
  const canScroll = count > visible

  const cardWidthPct = 100 / visible
  const trackWidthPct = count * cardWidthPct

  const [idx, setIdx] = useState(0)
  const [transit, setTransit] = useState(true)
  const idxRef = useRef(0)

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

  const translatePct = count > 0 ? (idx * 100) / count : 0

  const touchStartX = useRef<number | null>(null)
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
    <div className="relative">
      <button
        onClick={handlePrev}
        aria-label={`Previous ${ariaLabel}`}
        className="hidden sm:block absolute left-12 md:left-24 lg:left-36 top-1/2 -translate-y-1/2 z-10 shrink-0 px-2 text-[#999999] hover:text-white group cursor-pointer transition-colors duration-300"
      >
        <svg width="16" height="56" viewBox="0 0 16 56" fill="none" className="transition-transform duration-300 group-hover:scale-[1.125]">
          <polyline points="14,2 2,28 14,54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="max-w-5xl mx-auto px-6">
        <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div
            className="flex"
            style={{
              width: `${trackWidthPct}%`,
              transform: `translateX(-${translatePct}%)`,
              transition: transit ? 'transform 0.6s ease-in-out' : 'none',
            }}
          >
            {items.map((item, i) => (
              <div key={keyFor(item, i)} style={{ width: `${100 / count}%` }} className={itemClassName}>
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>

        {canScroll && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIdx + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setTransit(true)
                  idxRef.current = i
                  setIdx(i)
                }}
                aria-label={`Jump to position ${i + 1}`}
                className={`h-px transition-all duration-300 ${i === idx ? 'w-8 bg-white' : 'w-4 bg-white/25'}`}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        aria-label={`Next ${ariaLabel}`}
        className="hidden sm:block absolute right-12 md:right-24 lg:right-36 top-1/2 -translate-y-1/2 z-10 shrink-0 px-2 text-[#999999] hover:text-white group cursor-pointer transition-colors duration-300"
      >
        <svg width="16" height="56" viewBox="0 0 16 56" fill="none" className="transition-transform duration-300 group-hover:scale-[1.125]">
          <polyline points="2,2 14,28 2,54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
