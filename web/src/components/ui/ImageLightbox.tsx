'use client'

import { useEffect } from 'react'

type Props = {
  src: string
  alt: string
  onClose: () => void
  viewProjectHref?: string
}

export function ImageLightbox({ src, alt, onClose, viewProjectHref }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute top-2.5 right-2.5 p-2.5 text-white/50 hover:text-white cursor-pointer transition-colors duration-200"
        onClick={onClose}
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[88vh] object-contain rounded-sm"
          style={{ display: 'block' }}
        />
        {viewProjectHref && (
          <a
            href={viewProjectHref}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 left-4 font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-black bg-white hover:bg-black hover:text-white px-3 py-2 transition-colors duration-200"
          >
            View Project
          </a>
        )}
      </div>
    </div>
  )
}
