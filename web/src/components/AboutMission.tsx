'use client'

import { useRef, useEffect } from 'react'
import PortableTextContent from '@/components/ui/PortableTextContent'
import { resolveBg } from '@/lib/sectionBackground'

type Props = {
  s: Record<string, any>
}

/**
 * Standalone mission statement section for the About page.
 * Mirrors the MissionReveal animation (line draws up, text slides in)
 * but renders Portable Text instead of a plain string, so the content
 * is fully editable — paragraphs, emphasis, links — in Sanity Studio.
 */
export function AboutMission({ s }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

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

      if (wrap.getBoundingClientRect().top > window.innerHeight) hide()

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) show()
          else if (entry.boundingClientRect.top > 0) hide()
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

  const bgImg = s.sectionBg?.bgType === 'image' ? s.sectionBg?.bgImage : s.bgImage
  const hasBgImage = !!bgImg?.asset?.url

  return (
    <section
      className="relative overflow-hidden bg-black py-20"
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {hasBgImage && (
        <>
          <img
            src={`${bgImg.asset.url}?w=1920&auto=format&q=80`}
            alt={bgImg.alt || ''}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div
        ref={wrapRef}
        className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 items-start"
      >
        <div>
          <h2 className="font-[family-name:var(--font-brand)] text-xl md:text-2xl uppercase tracking-wide text-white mb-6">
            {s.heading || 'Mission'}
          </h2>
        </div>

        <div className="relative pl-8">
          <span
            ref={lineRef}
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"
            style={{ transformOrigin: 'bottom' }}
          />
          <div ref={textRef}>
            <PortableTextContent
              value={s.text}
              className="[&_p]:font-[family-name:var(--font-body)] [&_p]:text-lg [&_p]:text-white [&_p]:leading-relaxed [&_p]:italic [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:text-white [&_em]:not-italic"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
