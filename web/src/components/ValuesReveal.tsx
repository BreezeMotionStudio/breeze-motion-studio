'use client'

import { useRef, useEffect } from 'react'

type Value = { _key?: string; title: string; description?: string }

const LINE_DURATION = 500 // ms per line draw
const STAGGER = 380       // ms between each card starting

/**
 * Staggered reveal for core value cards:
 *   1. Each line draws left → right (scaleX 0→1), cards one at a time
 *
 * Same IntersectionObserver settings as ScrollObserver so they fire in sync.
 * Initial hidden state applied by JS only (SSR-safe).
 */
export function ValuesReveal({ values }: { values: Value[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const lines = lineRefs.current
    let timeouts: ReturnType<typeof setTimeout>[] = []

    const clearPending = () => {
      timeouts.forEach(clearTimeout)
      timeouts = []
    }

    const hideAll = () => {
      clearPending()
      lines.forEach(el => {
        if (!el) return
        el.style.transition = 'none'
        el.style.transform = 'scaleX(0)'
      })
    }

    const showStaggered = () => {
      values.forEach((_, i) => {
        const t1 = setTimeout(() => {
          const line = lines[i]
          if (!line) return
          // Force reflow so the browser commits scaleX(0) as the starting state
          // before the transition property is applied — without this the browser
          // batches the style changes and skips the animation entirely.
          line.style.transition = `transform ${LINE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
          void line.offsetWidth
          line.style.transform = 'scaleX(1)'
        }, i * STAGGER)

        timeouts.push(t1)
      })
    }

    let observer: IntersectionObserver | null = null

    const timer = setTimeout(() => {
      hideAll()

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            showStaggered()
          } else if (entry.boundingClientRect.top > 0) {
            hideAll()
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )

      observer.observe(wrap)
    }, 100)

    return () => {
      clearTimeout(timer)
      clearPending()
      observer?.disconnect()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrapRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {values.map((v, i) => (
        <div key={v._key || i}>
          <span
            ref={el => { lineRefs.current[i] = el }}
            className="block h-px bg-[#E6E6E6] mb-6"
            style={{ transformOrigin: 'left' }}
          />
          <div>
            <h3 className="font-[family-name:var(--font-brand)] text-2xl uppercase tracking-wide mb-3 leading-tight">
              {v.title.split(' ').map((word, wi) => (
                <span key={wi} className="block">{word}</span>
              ))}
            </h3>
            {v.description && (
              <p className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B] leading-relaxed">
                {v.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
