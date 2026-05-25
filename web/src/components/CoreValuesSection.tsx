'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { getBgStyle, getTextClass } from '@/lib/sectionColors'
import { SimpleRichText } from '@/components/ui/SimpleRichText'

type Value = { _key?: string; title: string; description?: any }

// CSS easing constants — must stay in sync with the stroke-dashoffset transition below.
const EASE_P1 = 0.27, EASE_T1 = 0.20
const EASE_P2 = 0.74, EASE_T2 = 0.78
const ANIM_MS = 3000
const DELAY_MS = 300

// px above/below section where the animation activates early
const BUFFER = 56
// ms the mouse must stay outside the buffer before the animation deactivates
const DEACTIVATE_DELAY_MS = 700


/** Invert linear(0, 0.27 20%, 0.74 78%, 1): path progress fraction → time fraction */
function pathFractionToTime(p: number): number {
  if (p <= EASE_P1) return (p / EASE_P1) * EASE_T1
  if (p <= EASE_P2) return EASE_T1 + ((p - EASE_P1) / (EASE_P2 - EASE_P1)) * (EASE_T2 - EASE_T1)
  return EASE_T2 + ((p - EASE_P2) / (1 - EASE_P2)) * (1 - EASE_T2)
}

type Rect = { x: number; y: number; w: number; h: number }
type PathState = {
  d: string
  len: number
  covers: Rect[]
  headingCover: Rect
  valueTriggerMs: number[]
} | null

export function CoreValuesSection({ values, bgColor }: { values: Value[]; bgColor?: string }) {
  const sectionRef    = useRef<HTMLElement>(null)
  const headingRef    = useRef<HTMLSpanElement>(null)
  const gridRef       = useRef<HTMLDivElement>(null)

  const stepTimeoutsRef    = useRef<ReturnType<typeof setTimeout>[]>([])
  const deactivateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isNearRef  = useRef(false)
  const lastXRef   = useRef(0)
  const lastYRef   = useRef(0)

  const [path, setPath]             = useState<PathState>(null)
  const [active, setActive]         = useState(false)
  const [done, setDone]             = useState(false)
  const [visible, setVisible]       = useState(false)
  const [litValues, setLitValues]   = useState<ReadonlySet<number>>(new Set())
  const [headingLit, setHeadingLit] = useState(false)

  const clearStepTimeouts = () => {
    stepTimeoutsRef.current.forEach(clearTimeout)
    stepTimeoutsRef.current = []
  }

  // Refs let the window listener always call the latest handlers without re-registering.
  const onEnterRef = useRef<() => void>(() => {})
  const onLeaveRef = useRef<() => void>(() => {})

  onEnterRef.current = () => {
    clearStepTimeouts()
    setLitValues(new Set())
    setDone(false)
    setVisible(true)
    setActive(true)
  }
  onLeaveRef.current = () => {
    clearStepTimeouts()
    setActive(false)
    setVisible(false)
    setLitValues(new Set())
    setHeadingLit(false)
  }

  const buildPath = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setPath(null)
      return
    }

    const sec  = sectionRef.current
    const hdg  = headingRef.current
    const grid = gridRef.current
    if (!sec || !hdg || !grid) return

    // Temporarily clear any active scroll-catchup transform so that
    // getBoundingClientRect returns natural layout coordinates.
    const contentDiv     = hdg.closest<HTMLElement>('.scroll-catchup')
    const savedTransform = contentDiv?.style.transform ?? ''
    if (contentDiv && savedTransform) {
      contentDiv.style.transition = 'none'
      contentDiv.style.transform  = ''
    }

    const sR = sec.getBoundingClientRect()
    const hR = hdg.getBoundingClientRect()
    const gR = grid.getBoundingClientRect()

    const hLeft = hR.left - sR.left
    const hMidY = hR.top  - sR.top + hR.height / 2
    // Small inset from the heading's left edge — the headingCover mask
    // hides this segment, making the line appear to exit from the left side.
    const hOff  = 8
    const startX = hLeft + hOff

    // Symmetric margins past each grid edge — mirror of HowWeWorkSection
    const margin = 72
    const lx = Math.max(4, gR.left - sR.left - margin)
    const rx = Math.min(sR.width - 4, gR.right - sR.left + margin)

    const hRight = hR.right - sR.left

    // lineY: passed through the values grid, aimed at the description area
    const gTop = gR.top - sR.top
    let lineY  = gTop + gR.height * 0.55
    const descEl = grid.querySelector('[data-valdesc]') as HTMLElement | null
    if (descEl) {
      const dR = descEl.getBoundingClientRect()
      lineY = dR.top - sR.top - 20
    }

    const valueEls = Array.from(grid.children) as HTMLElement[]
    if (valueEls.length === 0) return

    // Full rectangular path matching HowWeWorkSection:
    // exit left of heading → left → down → right → up → left back to heading right side
    const d = [
      `M ${startX.toFixed(1)} ${hMidY.toFixed(1)}`,
      `L ${lx.toFixed(1)} ${hMidY.toFixed(1)}`,
      `L ${lx.toFixed(1)} ${lineY.toFixed(1)}`,
      `L ${rx.toFixed(1)} ${lineY.toFixed(1)}`,
      `L ${rx.toFixed(1)} ${hMidY.toFixed(1)}`,
      `L ${(hRight + hOff).toFixed(1)} ${hMidY.toFixed(1)}`,
    ].join(' ')

    const len =
      (startX - lx) +
      (lineY - hMidY) +
      (rx - lx) +
      (lineY - hMidY) +
      (rx - hRight - hOff)

    // Cover rects mask the line where it overlaps value card columns (matches HowWeWorkSection)
    // bufLeft > bufRight shifts the visible connector segments leftward for better visual balance
    const coverH = 36
    const covers: Rect[] = valueEls.map(el => {
      const r       = el.getBoundingClientRect()
      const colW    = r.width
      const bufLeft  = colW * 0.14
      const bufRight = colW * 0.00
      return { x: r.left - sR.left - bufLeft, y: lineY - coverH / 2, w: colW + bufLeft + bufRight, h: coverH }
    })

    // Cover rect for the heading text
    const coverPad = 8
    const headingCover: Rect = {
      x: hLeft - coverPad,
      y: hMidY - hR.height / 2 - coverPad,
      w: hR.width + coverPad * 2,
      h: hR.height + coverPad * 2,
    }

    // ms after activation at which the line reaches each value's left edge (matches HowWeWorkSection)
    const cumulBeforeGrid = (startX - lx) + (lineY - hMidY)
    const valueTriggerMs  = valueEls.map(el => {
      const r            = el.getBoundingClientRect()
      const distIntoGrid = Math.max(0, r.left - sR.left - lx)
      const fraction     = Math.min(1, (cumulBeforeGrid + distIntoGrid) / len)
      return pathFractionToTime(fraction) * ANIM_MS + DELAY_MS
    })

    setPath({ d, len, covers, headingCover, valueTriggerMs })

    // Restore the transform after measurements
    if (contentDiv && savedTransform) {
      contentDiv.style.transform  = savedTransform
      contentDiv.style.transition = 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)'
    }
  }, [values])

  useEffect(() => {
    buildPath()
    window.addEventListener('resize', buildPath)
    return () => window.removeEventListener('resize', buildPath)
  }, [buildPath])

  // Window-level proximity detection
  useEffect(() => {
    function check(x: number, y: number) {
      const sec = sectionRef.current
      if (!sec) return
      const r    = sec.getBoundingClientRect()
      const near =
        x >= r.left && x <= r.right &&
        y >= r.top - BUFFER && y <= r.bottom + BUFFER

      if (near) {
        if (deactivateTimerRef.current) {
          clearTimeout(deactivateTimerRef.current)
          deactivateTimerRef.current = null
        }
        if (!isNearRef.current) {
          isNearRef.current = true
          onEnterRef.current()
        }
      } else if (isNearRef.current && !deactivateTimerRef.current) {
        deactivateTimerRef.current = setTimeout(() => {
          isNearRef.current          = false
          deactivateTimerRef.current = null
          onLeaveRef.current()
        }, DEACTIVATE_DELAY_MS)
      }
    }

    function onMove(e: MouseEvent) {
      lastXRef.current = e.clientX
      lastYRef.current = e.clientY
      check(e.clientX, e.clientY)
    }
    function onScroll() { check(lastXRef.current, lastYRef.current) }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      if (deactivateTimerRef.current) clearTimeout(deactivateTimerRef.current)
    }
  }, [])

  // Schedule value scale-ups as the line passes through each card
  useEffect(() => {
    if (!active || !path) return
    clearStepTimeouts()
    stepTimeoutsRef.current = path.valueTriggerMs.map((ms, i) =>
      setTimeout(() => setLitValues(prev => new Set([...prev, i])), ms)
    )
    return clearStepTimeouts
  }, [active, path])

  const onAnimEnd = () => {
    setDone(true)
    setActive(false)
    setHeadingLit(true)
  }

  const onSvgTransitionEnd = (e: React.TransitionEvent<SVGSVGElement>) => {
    if (e.target === e.currentTarget && e.propertyName === 'opacity' && !visible) {
      setDone(false)
    }
  }

  const offset    = active || done ? 0 : (path?.len ?? 9999)
  const coverFill = bgColor || '#FFFFFF'

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-white py-20`}
      style={getBgStyle(bgColor)}
    >
      {path && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            zIndex: 5,
            opacity: visible ? 1 : 0,
            transition: visible ? 'opacity 0.4s ease' : 'opacity 0.5s ease',
          }}
          onTransitionEnd={onSvgTransitionEnd}
        >
          <defs>
            <mask id="cv-line-mask">
              <rect x="0" y="0" width="10000" height="10000" fill="white" />
              <rect
                x={path.headingCover.x} y={path.headingCover.y}
                width={path.headingCover.w} height={path.headingCover.h}
                fill="black"
              />
            </mask>
          </defs>
          <path
            d={path.d}
            fill="none"
            stroke="#535D66"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={path.len}
            strokeDashoffset={offset}
            style={{
              transition: active
                ? `stroke-dashoffset ${ANIM_MS}ms linear(0, 0.27 20%, 0.74 78%, 1) ${DELAY_MS}ms`
                : 'none',
            }}
            onTransitionEnd={onAnimEnd}
            mask="url(#cv-line-mask)"
          />
          {path.covers.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={coverFill} />
          ))}
        </svg>
      )}

      <div className="scroll-catchup relative z-10 max-w-5xl mx-auto px-6">
        <h2 className="font-[family-name:var(--font-brand)] text-xl md:text-2xl uppercase tracking-wide text-black/60 mb-12">
          <span
            ref={headingRef}
            className="inline-block transition-transform duration-500 ease-out"
            style={headingLit ? { transform: 'scale(1.04)' } : undefined}
          >
            Core Values
          </span>
        </h2>
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          {values.map((v, i) => {
            const lit = litValues.has(i)
            return (
              <div key={v._key || i} className={`group cursor-default${i === 1 ? ' pl-6' : ''}`}>
                <div
                  className="transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                  style={lit ? { transform: 'scale(1.04)' } : undefined}
                >
                  <h3
                    className="font-[family-name:var(--font-brand)] text-2xl uppercase tracking-wide mb-3 leading-tight transition-transform duration-300 ease-out group-hover:scale-[1.05] text-black"
                    style={lit ? { transform: 'scale(1.05)' } : undefined}
                  >
                    {v.title.split(' ').map((word, wi) => (
                      <span key={wi} className="block">{word}</span>
                    ))}
                  </h3>
                  {v.description && (
                    <p
                      data-valdesc={i === 0 ? '' : undefined}
                      className="font-[family-name:var(--font-body)] text-sm text-bms-grey-400 leading-relaxed"
                    >
                      <SimpleRichText value={v.description} />
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
