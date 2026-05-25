'use client'

import { useEffect } from 'react'

/**
 * Wires up an IntersectionObserver for every element with `.scroll-catchup`.
 *
 * Initial hidden state (opacity + translateY) is applied here (not in CSS)
 * so server-rendered HTML is never invisible — no layout shift or hydration flash.
 *
 * Behaviour:
 * - Element enters viewport from below → animates in (opacity 1, translateY 0)
 * - Element is still below viewport → stays in reset state (hidden)
 * - Element already scrolled past (above viewport) → stays visible, not reset
 * This means the animation re-fires every time you scroll down to a section.
 */
export function ScrollObserver() {
  useEffect(() => {
    const hide = (el: HTMLElement) => {
      el.style.transform = 'translateY(36px)'
    }
    const show = (el: HTMLElement) => {
      el.style.transform = 'translateY(0)'
    }

    // Use a short delay so client-component hydration settles before we apply
    // the initial hidden state — prevents React re-renders wiping our styles.
    const timer = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.scroll-catchup'))
      if (els.length === 0) return

      // Hide everything that is currently below the viewport fold
      for (const el of els) {
        const rect = el.getBoundingClientRect()
        if (rect.top > window.innerHeight) {
          hide(el)
        }
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement
            if (entry.isIntersecting) {
              show(el)
            } else if (entry.boundingClientRect.top > 0) {
              // Element is below the viewport — reset so it re-animates next visit
              hide(el)
            }
            // If above viewport (already scrolled past), leave it visible
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )

      for (const el of els) {
        observer.observe(el)
      }

      // Store cleanup on the timer scope
      ;(window as any).__scrollObserverDisconnect = () => observer.disconnect()
    }, 100)

    return () => {
      clearTimeout(timer)
      ;(window as any).__scrollObserverDisconnect?.()
    }
  }, [])

  return null
}
