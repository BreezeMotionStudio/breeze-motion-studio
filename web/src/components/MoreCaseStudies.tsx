'use client'

import { useState } from 'react'
import { CaseStudyPdfViewer } from '@/components/CaseStudyPdfViewer'

type Item = {
  _id: string
  title: string
  previewUrl: string
  previewAlt?: string
  pdfUrl: string
  filename?: string
}

type Props = {
  items: Item[]
  buttonLabel?: string
  onDark?: boolean
}

export function MoreCaseStudies({ items, buttonLabel, onDark = false }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  if (!items || items.length === 0) return null

  const active = items.find((item) => item._id === activeId) || null

  return (
    <div className="mt-16 flex flex-col items-center">
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest border px-8 py-3 rounded-sm transition-colors duration-200 cursor-pointer ${
          onDark
            ? 'text-white border-white hover:bg-white hover:text-black'
            : 'text-black border-black hover:bg-black hover:text-white'
        }`}
      >
        {expanded ? 'Show Less' : buttonLabel || 'View More Case Studies'}
      </button>

      {expanded && (
        <div className="mt-10 flex flex-wrap justify-center gap-4 max-w-4xl">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => setActiveId(item._id)}
              className="w-24 sm:w-28 aspect-[1/1.4142] overflow-hidden rounded-sm border border-[#E6E6E6] shadow-sm hover:scale-105 hover:shadow-md transition-transform duration-200 cursor-pointer"
              aria-label={`View case study: ${item.title}`}
            >
              <img
                src={`${item.previewUrl}?w=240&auto=format&q=70`}
                alt={item.previewAlt || item.title}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {active && (
        <CaseStudyPdfViewer
          previewUrl={active.previewUrl}
          previewAlt={active.previewAlt}
          pdfUrl={active.pdfUrl}
          filename={active.filename}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  )
}
