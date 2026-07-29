'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CaseStudyPdfViewer } from '@/components/CaseStudyPdfViewer'

type Props = {
  previewUrl: string
  previewAlt?: string
  pdfUrl: string
  filename?: string
  label: string
}

export function CaseStudyPdfButton({ previewUrl, previewAlt, pdfUrl, filename, label }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="white" size="lg" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <CaseStudyPdfViewer
          previewUrl={previewUrl}
          previewAlt={previewAlt}
          pdfUrl={pdfUrl}
          filename={filename}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
