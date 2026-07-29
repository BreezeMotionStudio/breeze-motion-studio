'use client'

import { useEffect } from 'react'

type Props = {
  pdfUrl: string
  filename?: string
  onClose: () => void
}

export function CaseStudyPdfViewer({ pdfUrl, filename, onClose }: Props) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="absolute top-2.5 right-2.5 flex items-center gap-3">
        <a
          href={downloadUrl}
          onClick={(e) => e.stopPropagation()}
          className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-sm transition-colors duration-200"
        >
          Download
        </a>
        <button
          className="p-2.5 text-white/50 hover:text-white cursor-pointer transition-colors duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className="relative w-full max-w-3xl h-[92vh] bg-white rounded-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe src={pdfUrl} title="Case Study PDF" className="w-full h-full" />
      </div>
    </div>
  )
}
