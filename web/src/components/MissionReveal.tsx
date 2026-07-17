'use client'

import { useRef, useEffect } from 'react'
import { SimpleRichText } from '@/components/ui/SimpleRichText'

/**
 * Animates the mission quote on scroll:
 *   1. Left line draws from bottom → top (scaleY 0→1)
 *   2. Text fades in and slides from the line left → right
 *
 * Initial hidden state is applied by JS (not CSS) so SSR renders
 * are never invisible — same pattern as ScrollObserver.
 * Uses identical IntersectionObserver settings so it fires in sync.
 */
export function MissionReveal({ text }: { text: any }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const line = lineRef.current
    const txt = textRef.current
    if (!wrap || !line || !txt) return

    const hide = () => {
      line.style.transform = 'scaleY(0)'
      txt.style.opacity = '0'
      txt.style.transform = 'translateX(-24px)'
      txt.style.transitionDelay = '0s'
    }

    const show = () => {
      line.style.transform = 'scaleY(1)'
      txt.style.transitionDelay = '0.5s'
      txt.style.opacity = '1'
      txt.style.transform = 'translateX(0)'
    }

    let observer: IntersectionObserver | null = null

    const timer = setTimeout(() => {
      line.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
      txt.style.transition = 'opacity 1.4s ease, transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)'

      if (wrap.getBoundingClientRect().top > window.innerHeight) {
        hide()
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            show()
          } else if (entry.boundingClientRect.top > 0) {
            hide()
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )

      observer.observe(wrap)
    }, 100)

    return () => {
      clearTimeout(timer)
      observer?.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative pl-8">
      <span
        ref={lineRef}
        className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"
        style={{ transformOrigin: 'bottom' }}
      />
      <p
        ref={textRef}
        className="font-[family-name:var(--font-body)] text-base md:text-lg text-white leading-relaxed italic"
      >
        <SimpleRichText value={text} />
      </p>
    </div>
  )
}
