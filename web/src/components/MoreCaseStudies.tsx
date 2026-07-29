'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
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
}

export function MoreCaseStudies({ items, buttonLabel }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const active = items?.find((item) => item._id === activeId) || null

  return (
    <div className="mt-16 flex flex-col items-center">
      <Button variant="white" onClick={() => setExpanded((v) => !v)}>
        {buttonLabel || 'View More'}
      </Button>

      {expanded && items && items.length > 0 && (
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
