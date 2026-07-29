'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CaseStudyPdfViewer } from '@/components/CaseStudyPdfViewer'

type Props = {
  pdfUrl: string
  filename?: string
  label: string
}

export function CaseStudyPdfButton({ pdfUrl, filename, label }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="white" size="lg" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && <CaseStudyPdfViewer pdfUrl={pdfUrl} filename={filename} onClose={() => setOpen(false)} />}
    </>
  )
}
