'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type ClientLogo = {
  _key: string
  client?: {
    name?: string
    logo?: { asset?: { url: string }; alt?: string }
  }
  logoOverride?: { asset?: { url: string }; alt?: string }
}

const LOGO_AUTO_MS = 3000

function useVisibleCount() {
  const [visible, setVisible] = useState(7)
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      setVisible(w < 640 ? 2 : w < 1024 ? 4 : 7)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])
  return visible
}

export function HomeClientLogos({ s }: { s: any }) {
  const logos: ClientLogo[] = s.clientLogos || []

  const logoVisible = useVisibleCount()
  const count    = logos.length
  const maxIdx   = Math.max(0, count - logoVisible)
  const widthPct = count > logoVisible ? 100 / logoVisible : 100 / count
  const trackPct = count * widthPct

  const [idx, setIdx]         = useState(0)
  const [transit, setTransit] = useState(true)
  const idxRef                = useRef(0)
  const pausedRef             = useRef(false)

  useEffect(() => {
    if (idxRef.current > maxIdx) {
      idxRef.current = maxIdx
      setIdx(maxIdx)
    }
  }, [maxIdx])

  const advance = useCallback(() => {
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

  const advanceRef = useRef(advance)
  useEffect(() => {
    advanceRef.current = advance
  }, [advance])

  useEffect(() => {
    if (count <= logoVisible) return
    const id = setInterval(() => { if (!pausedRef.current) advanceRef.current() }, LOGO_AUTO_MS)
    return () => clearInterval(id)
  }, [count, logoVisible])

  if (count === 0) return null

  return (
    <section
      className="py-6"
      style={{ backgroundColor: s.bgColor || '#535D66' }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className="overflow-hidden w-full">
          <div
            className="flex items-center"
            style={{
              width: `${trackPct}%`,
              transform: `translateX(-${idx * 100 / count}%)`,
              transition: transit ? `transform ${LOGO_AUTO_MS * 0.2}ms ease-in-out` : 'none',
            }}
          >
            {logos.map((logo) => (
              <div
                key={logo._key}
                style={{ width: `${100 / count}%` }}
                className="flex items-center justify-center px-4 py-2"
              >
                {(() => {
                  const img = logo.logoOverride?.asset?.url
                    ? logo.logoOverride
                    : logo.client?.logo?.asset?.url
                      ? logo.client.logo
                      : null
                  return img?.asset?.url ? (
                    <img
                      src={img.asset.url}
                      alt={img.alt || logo.client?.name || ''}
                      className="h-20 w-auto max-w-[200px] object-contain"
                    />
                  ) : (
                    <span className="text-xs font-[family-name:var(--font-functional)] uppercase tracking-widest text-bms-grey-400 whitespace-nowrap">
                      {logo.client?.name}
                    </span>
                  )
                })()}
              </div>
            ))}
          </div>
      </div>
    </section>
  )
}
