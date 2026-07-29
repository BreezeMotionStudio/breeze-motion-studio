'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { isLightBg } from '@/lib/sectionColors'
import { resolveBg, resolveIsLight } from '@/lib/sectionBackground'
import { Button } from '@/components/ui/Button'
import { btnSpacingClass } from '@/lib/buttonSpacing'
import { SimpleRichText } from '@/components/ui/SimpleRichText'

type Step = { _key?: string; stepNumber?: string; title?: any; description?: any }
type CtaButton = { _key?: string; label?: string; url?: string; style?: string; topSpacing?: string; bottomSpacing?: string }
type SectionData = {
  heading?: any
  bgVideoUrl?: string
  bgImage?: { asset?: { url: string }; alt?: string }
  bgColor?: string
  sectionBg?: any
  steps?: Step[]
  sectionImage?: {
    asset?: { url: string; metadata?: { dimensions?: { width: number; height: number } } }
    alt?: string
  }
  buttons?: CtaButton[]
}

type Rect = { x: number; y: number; w: number; h: number }
type Arrow = { tip: [number, number]; w1: [number, number]; w2: [number, number] }
type PathState = {
  d: string
  len: number
  covers: Rect[]
  headingCover: Rect
  arrow: Arrow
  // ms after onEnter at which the line first reaches each step's left edge.
  // Derived by inverting the CSS easing: linear(0, 0.27 20%, 0.74 78%, 1) × 4500ms + 400ms delay.
  stepTriggerMs: number[]
} | null

// CSS easing constants — must stay in sync with the stroke-dashoffset transition below.
const EASE_P1 = 0.27, EASE_T1 = 0.20
const EASE_P2 = 0.74, EASE_T2 = 0.78
const ANIM_MS  = 4500
const DELAY_MS = 400

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

export function HowWeWorkSection({ s }: { s: SectionData }) {
  const hasMediaBg = !!(s.bgVideoUrl || s.bgImage?.asset?.url)
  // Treat a custom dark bgColor / sectionBg the same as a media background (dark section)
  const isOnDarkBg = hasMediaBg || (s.sectionBg?.bgType && !resolveIsLight(s.sectionBg)) || (!s.sectionBg?.bgType && !!s.bgColor && !isLightBg(s.bgColor))
  const hasBg = isOnDarkBg

  const sectionRef      = useRef<HTMLElement>(null)
  const headingSpanRef  = useRef<HTMLSpanElement>(null)
  const stepsGridRef    = useRef<HTMLDivElement>(null)
  const pathRef         = useRef<SVGPathElement>(null)
  const stepTimeoutsRef    = useRef<ReturnType<typeof setTimeout>[]>([])
  const deactivateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Proximity tracking — updated by the window mousemove/scroll listener
  const isNearRef  = useRef(false)
  const lastYRef   = useRef(0)
  const lastXRef   = useRef(0)

  const [path, setPath]           = useState<PathState>(null)
  const [active, setActive]       = useState(false)
  const [done, setDone]           = useState(false)
  const [visible, setVisible]     = useState(false)
  const [litSteps, setLitSteps]     = useState<ReadonlySet<number>>(new Set())
  const [headingLit, setHeadingLit] = useState(false)

  const clearStepTimeouts = () => {
    stepTimeoutsRef.current.forEach(clearTimeout)
    stepTimeoutsRef.current = []
  }

  // These refs let the window listener call the latest enter/leave without needing
  // to re-register the event listener every render.
  const onEnterRef = useRef<() => void>(() => {})
  const onLeaveRef = useRef<() => void>(() => {})

  useEffect(() => {
    onEnterRef.current = () => {
      clearStepTimeouts()
      setLitSteps(new Set())
      setDone(false)
      setVisible(true)
      setActive(true)
    }
    onLeaveRef.current = () => {
      clearStepTimeouts()
      setActive(false)
      setVisible(false)
      setLitSteps(new Set())
      setHeadingLit(false)
    }
  })

  const buildPath = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setPath(null)
      return
    }

    const sec   = sectionRef.current
    const hSpan = headingSpanRef.current
    const grid  = stepsGridRef.current
    if (!sec || !hSpan || !grid) return

    // Temporarily clear any active scroll-catchup transform so that
    // getBoundingClientRect returns natural layout coordinates.
    const contentDiv = hSpan.closest<HTMLElement>('.scroll-catchup')
    const savedTransform = contentDiv?.style.transform ?? ''
    if (contentDiv && savedTransform) {
      contentDiv.style.transition = 'none'
      contentDiv.style.transform = ''
    }

    const sR = sec.getBoundingClientRect()
    const hR = hSpan.getBoundingClientRect()
    const gR = grid.getBoundingClientRect()

    const hLeft  = hR.left  - sR.left
    const hRight = hR.right - sR.left
    const hMidY  = hR.top   - sR.top + hR.height / 2
    const hOff   = 12

    const gLeft  = gR.left  - sR.left
    const gRight = gR.right - sR.left

    const stepEls    = Array.from(grid.children) as HTMLElement[]
    const stepBounds = stepEls.map(el => {
      const r = el.getBoundingClientRect()
      return { left: r.left - sR.left, right: r.right - sR.left }
    })

    const descEl = grid.querySelector('[data-stepdesc]')
    let lineY = gR.top - sR.top + gR.height * 0.68
    if (descEl) {
      const dR = descEl.getBoundingClientRect()
      lineY = dR.top - sR.top + dR.height * 0.45
    }

    const margin = 24
    const lx = Math.max(4, gLeft  - margin)
    const rx = Math.min(sR.width - 4, gRight + margin)

    const d = [
      `M ${(hLeft + hOff).toFixed(1)} ${hMidY.toFixed(1)}`,
      `L ${lx.toFixed(1)}    ${hMidY.toFixed(1)}`,
      `L ${lx.toFixed(1)}    ${lineY.toFixed(1)}`,
      `L ${rx.toFixed(1)}    ${lineY.toFixed(1)}`,
      `L ${rx.toFixed(1)}    ${hMidY.toFixed(1)}`,
      `L ${(hRight + hOff).toFixed(1)} ${hMidY.toFixed(1)}`,
    ].join(' ')

    const len =
      (hLeft + hOff - lx) +
      (lineY - hMidY) +
      (rx - lx) +
      (lineY - hMidY) +
      (rx - hRight - hOff)

    const coverH = 36
    const covers: Rect[] = stepBounds.map(sb => {
      const colW = sb.right - sb.left
      const buf  = colW * 0.06
      return { x: sb.left - buf, y: lineY - coverH / 2, w: colW + buf * 2, h: coverH }
    })

    const sz = 7
    const tip: [number, number] = [hRight + hOff, hMidY]
    const w1:  [number, number] = [hRight + hOff + sz, hMidY - sz * 0.55]
    const w2:  [number, number] = [hRight + hOff + sz, hMidY + sz * 0.55]

    const coverPad = 8
    const headingCover: Rect = {
      x: hLeft - coverPad,
      y: hMidY - hR.height / 2 - coverPad,
      w: hR.width + coverPad * 2,
      h: hR.height + coverPad * 2,
    }

    const cumulBeforeCD = (hLeft + hOff - lx) + (lineY - hMidY)
    const stepTriggerMs = stepBounds.map(sb => {
      const distIntoCD   = Math.max(0, sb.left - lx)
      const pathFraction = (cumulBeforeCD + distIntoCD) / len
      return pathFractionToTime(pathFraction) * ANIM_MS + DELAY_MS
    })

    setPath({ d, len, covers, headingCover, arrow: { tip, w1, w2 }, stepTriggerMs })

    // Restore the transform after measurements are done
    if (contentDiv && savedTransform) {
      contentDiv.style.transform = savedTransform
      contentDiv.style.transition = 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)'
    }
  }, [])

  useEffect(() => {
    buildPath()
    window.addEventListener('resize', buildPath)
    return () => window.removeEventListener('resize', buildPath)
  }, [buildPath])

  // Window-level proximity detection — fires BUFFER px before the section boundary
  useEffect(() => {
    function check(x: number, y: number) {
      const sec = sectionRef.current
      if (!sec) return
      const r    = sec.getBoundingClientRect()
      const near =
        x >= r.left &&
        x <= r.right &&
        y >= r.top    - BUFFER &&
        y <= r.bottom + BUFFER

      if (near) {
        // Cancel any pending deactivation and activate immediately
        if (deactivateTimerRef.current) {
          clearTimeout(deactivateTimerRef.current)
          deactivateTimerRef.current = null
        }
        if (!isNearRef.current) {
          isNearRef.current = true
          onEnterRef.current()
        }
      } else {
        // Only deactivate after the mouse has stayed outside for the delay
        if (isNearRef.current && !deactivateTimerRef.current) {
          deactivateTimerRef.current = setTimeout(() => {
            isNearRef.current        = false
            deactivateTimerRef.current = null
            onLeaveRef.current()
          }, DEACTIVATE_DELAY_MS)
        }
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
  }, []) // Empty deps — always uses latest handlers via refs

  // When the line starts drawing, schedule each step's scale-up
  useEffect(() => {
    if (!active || !path) return
    clearStepTimeouts()
    stepTimeoutsRef.current = path.stepTriggerMs.map((ms, i) =>
      setTimeout(() => setLitSteps(prev => new Set([...prev, i])), ms)
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

  const offset      = active || done ? 0 : (path?.len ?? 9999)
  const strokeColor = hasBg ? 'rgba(255,255,255,0.5)' : '#535D66'
  const coverFill   = hasBg ? 'transparent' : (s.sectionBg?.bgType === 'solid' ? (s.sectionBg?.bgColor || '#ffffff') : (s.bgColor || '#ffffff'))

  const sectionBgClass = hasMediaBg
    ? 'bg-black'
    : s.bgColor
      ? ''
      : 'bg-white'
  const sectionTextClass = hasBg ? 'text-white' : 'text-black'

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden py-24 ${sectionBgClass} ${sectionTextClass}`}
      style={resolveBg(s.sectionBg, s.bgColor && !hasMediaBg ? s.bgColor : undefined)}
    >
      {s.bgVideoUrl && (
        <video className="absolute inset-0 w-full h-full object-cover" src={s.bgVideoUrl} autoPlay muted loop playsInline />
      )}
      {!s.bgVideoUrl && s.bgImage?.asset?.url && (
        <>
          <Image src={s.bgImage.asset.url} alt={s.bgImage.alt || ''} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/55" />
        </>
      )}

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
            <mask id="hww-line-mask">
              <rect x="0" y="0" width="10000" height="10000" fill="white" />
              <rect x={path.headingCover.x} y={path.headingCover.y} width={path.headingCover.w} height={path.headingCover.h} fill="black" />
            </mask>
          </defs>
          <path
            ref={pathRef}
            d={path.d}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={path.len}
            strokeDashoffset={offset}
            style={{
              transition: active
                ? 'stroke-dashoffset 4.5s linear(0, 0.27 20%, 0.74 78%, 1) 0.4s'
                : 'none',
            }}
            onTransitionEnd={onAnimEnd}
            mask="url(#hww-line-mask)"
          />

          {path.covers.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={coverFill} />
          ))}

          <polyline
            points={`${path.arrow.w1[0]},${path.arrow.w1[1]} ${path.arrow.tip[0]},${path.arrow.tip[1]} ${path.arrow.w2[0]},${path.arrow.w2[1]}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: done ? 1 : 0, transition: 'opacity 0.25s ease' }}
          />
        </svg>
      )}

      <div className="scroll-catchup relative z-10 max-w-5xl mx-auto px-6">
        {s.heading && (
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold mb-16 text-center">
            <span
              ref={headingSpanRef}
              className="inline-block transition-transform duration-500 ease-out"
              style={headingLit ? { transform: 'scale(1.04)' } : undefined}
            ><SimpleRichText value={s.heading} /></span>
          </h2>
        )}
        {s.steps && s.steps.length > 0 && (
          <div ref={stepsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {s.steps.map((step, i) => {
              const lit = litSteps.has(i)
              return (
                <div key={step._key || i} className="text-center group cursor-default">
                  {step.stepNumber && (
                    <div className="text-4xl font-[family-name:var(--font-brand)] text-bms-accent mb-4">
                      {step.stepNumber}
                    </div>
                  )}
                  <div
                    className="transition-transform duration-300 ease-out group-hover:scale-[1.07]"
                    style={lit ? { transform: 'scale(1.07)' } : undefined}
                  >
                    {step.title && (
                      <h3
                        className="text-lg font-[family-name:var(--font-functional)] font-bold mb-2 uppercase tracking-wide transition-transform duration-300 ease-out group-hover:scale-[1.08]"
                        style={lit ? { transform: 'scale(1.08)' } : undefined}
                      >
                        <SimpleRichText value={step.title} />
                      </h3>
                    )}
                    {step.description && (
                      <p
                        data-stepdesc={i === 0 ? '' : undefined}
                        className={`text-sm font-[family-name:var(--font-body)] ${hasBg ? 'text-bms-grey-300' : 'text-bms-grey-400'}`}
                      >
                        <SimpleRichText value={step.description} />
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {s.sectionImage?.asset?.url && (
          <div className="flex justify-center mt-16">
            <Image
              src={s.sectionImage.asset.url}
              alt={s.sectionImage.alt || ''}
              width={s.sectionImage.asset.metadata?.dimensions?.width || 1200}
              height={s.sectionImage.asset.metadata?.dimensions?.height || 800}
              className="max-w-full h-auto rounded-sm transition-transform duration-700 ease-out hover:scale-[1.08]"
            />
          </div>
        )}
        {s.buttons && s.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-16">
            {s.buttons.map((btn) =>
              btn.label && btn.url ? (
                <Button key={btn._key} variant={hasBg ? 'white' : 'black'} href={btn.url} className={btnSpacingClass(btn.topSpacing, btn.bottomSpacing)}>
                  {btn.label}
                </Button>
              ) : null
            )}
          </div>
        )}
      </div>
    </section>
  )
}
