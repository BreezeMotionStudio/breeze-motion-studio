'use client'

import { useEffect, useRef } from 'react'

export function AnimatedLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    setTimeout(() => {
      el.style.transformOrigin = 'left'
      el.style.transform = 'scaleX(0)'

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.transition = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
            void el.offsetWidth
            el.style.transform = 'scaleX(1)'
            observer.disconnect()
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
      )

      observer.observe(el)
      return () => observer.disconnect()
    }, 100)
  }, [])

  return <div ref={ref} className={className} />
}
