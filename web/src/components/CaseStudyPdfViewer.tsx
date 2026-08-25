'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  previewUrl: string
  previewAlt?: string
  pdfUrl: string
  filename?: string
  onClose: () => void
}

export function CaseStudyPdfViewer({ previewUrl, previewAlt, pdfUrl, filename, onClose }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const downloadUrl = `${pdfUrl}?dl=${encodeURIComponent(filename || 'case-study.pdf')}`
  const displayUrl = `${previewUrl}?w=1700&auto=format&q=85`

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-black/90 backdrop-blur-sm p-4 pt-16 overflow-y-auto"
      onClick={onClose}
    >
      <button
        className="fixed top-2.5 right-2.5 p-2.5 text-white/50 hover:text-white cursor-pointer transition-colors duration-200"
        onClick={onClose}
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="relative flex flex-col items-center gap-4 mx-auto" onClick={(e) => e.stopPropagation()}>
        <img
          src={displayUrl}
          alt={previewAlt || 'Case Study Preview'}
          className="w-[80vw] max-w-[850px] h-auto object-contain rounded-sm"
          style={{ display: 'block' }}
        />
        <a
          href={downloadUrl}
          className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-black bg-white hover:bg-gray-200 px-6 py-3 rounded-sm transition-colors duration-200 mb-8"
        >
          Download PDF
        </a>
      </div>
    </div>,
    document.body
  )
}
