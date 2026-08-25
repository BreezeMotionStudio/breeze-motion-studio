'use client'

import Image from 'next/image'
import { useState } from 'react'
import { SimpleRichText } from '@/components/ui/SimpleRichText'
import { sectionBgStyle } from '@/lib/sectionBackground'
import { CaseStudyPdfViewer } from '@/components/CaseStudyPdfViewer'

type CombinationImage = {
  asset?: { url: string }
  alt?: string
}

type Combination = {
  _key: string
  title: string
  subtitle?: string
  description?: any
  items?: string[]
  caseStudy?: {
    caseStudyPdf?: { asset?: { url: string; originalFilename?: string } }
    caseStudyPdfPreview?: { asset?: { url: string }; alt?: string }
  }
  bgImage?: { asset?: { url: string }; alt?: string }
  images?: CombinationImage[]
}

type Props = {
  heading?: any
  intro?: any
  combinations?: Combination[]
  collageImages?: { asset?: { url: string }; alt?: string }[]
  sectionBg?: any
  typicallyIncludesLabel?: string
  viewCaseStudyLabel?: string
}

function ImagePlaceholder() {
  return (
    <div className="flex-1 aspect-square bg-[#1e1e1e] rounded-md flex items-center justify-center border border-[#2a2a2a]">
      <svg className="text-[#333333]" width="14" height="14" viewBox="0 0 40 40" fill="none">
        <rect x="3" y="8" width="34" height="24" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        <path d="M27 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white/70 hover:text-white text-3xl leading-none transition-colors"
        aria-label="Close"
      >
        ×
      </button>
      <div
        className="max-w-[90vw] max-h-[90vh] rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="max-w-[90vw] max-h-[90vh] object-contain" />
      </div>
    </div>
  )
}

export function ServiceCombinationsSection({ heading, intro, combinations, collageImages, sectionBg, typicallyIncludesLabel, viewCaseStudyLabel }: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const [activePdfKey, setActivePdfKey] = useState<string | null>(null)

  if (!combinations?.length) return null

  const activeCombo = combinations.find((c) => c._key === activePdfKey)
  const activePdf = activeCombo?.caseStudy?.caseStudyPdf?.asset?.url
    ? { url: activeCombo.caseStudy.caseStudyPdf.asset.url, filename: activeCombo.caseStudy.caseStudyPdf.asset.originalFilename }
    : null
  const activePreview = activeCombo?.caseStudy?.caseStudyPdfPreview?.asset?.url
    ? { url: activeCombo.caseStudy.caseStudyPdfPreview.asset.url, alt: activeCombo.caseStudy.caseStudyPdfPreview.alt }
    : null

  return (
    <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden bg-white" style={sectionBgStyle(sectionBg)}>
      {sectionBg?.bgType === 'image' && sectionBg?.bgImage?.asset?.url && (
        <>
          <Image src={sectionBg.bgImage.asset.url} alt={sectionBg.bgImage.alt || ''} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/55" />
        </>
      )}
      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        {(heading || intro) && (
          <div className="max-w-2xl mb-4">
            {heading && (
              <h2 className="font-[family-name:var(--font-brand)] text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide mb-6 text-white">
                <SimpleRichText value={heading} />
              </h2>
            )}
            {intro && (
              <p className="font-[family-name:var(--font-body)] text-base md:text-lg leading-relaxed text-white/50">
                <SimpleRichText value={intro} />
              </p>
            )}
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {combinations.map((combo, index) => (
            <div
              key={combo._key}
              className="relative rounded-2xl overflow-hidden group/card transition-transform duration-300 hover:scale-[1.015] shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
            >
              {combo.bgImage?.asset?.url ? (
                <>
                  <Image
                    src={combo.bgImage.asset.url}
                    alt={combo.bgImage.alt || ''}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-[1.06]"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/70" />
                </>
              ) : (
                <div className="absolute inset-0 bg-[#141414] transition-transform duration-500 group-hover/card:scale-[1.06]" />
              )}
              <div className="relative z-10 p-8 md:p-12">
              {/* Number + title — side by side on mobile */}
              <div className="flex items-start gap-4 mb-6 md:hidden">
                <span className="font-[family-name:var(--font-brand)] text-5xl text-white leading-none select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-[family-name:var(--font-brand)] text-lg uppercase tracking-wide text-white leading-snug">
                  {combo.title}
                </h3>
              </div>
              {/* Main row */}
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-8 md:gap-12">

                {/* Number */}
                <div className="hidden md:flex items-start">
                  <span className="font-[family-name:var(--font-brand)] text-5xl md:text-6xl text-white leading-none select-none w-16 inline-block transition-transform duration-300 group-hover/card:scale-[1.08] origin-left">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Title + description + image thumbnails */}
                <div className="flex flex-col">
                  <h3 className="hidden md:block font-[family-name:var(--font-brand)] text-2xl uppercase tracking-wide text-white mb-2 leading-snug transition-transform duration-300 group-hover/card:scale-[1.04] origin-left">
                    {combo.title}
                  </h3>
                  {combo.subtitle && (
                    <p className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-[#B3B3B3] mb-5">
                      {combo.subtitle}
                    </p>
                  )}
                  {combo.description && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#B3B3B3] leading-relaxed mb-6">
                      <SimpleRichText value={combo.description} />
                    </p>
                  )}
                  {/* Small image row */}
                  <div className="flex gap-2 mt-auto">
                    {[0, 1, 2].map((i) => {
                      const img = combo.images?.[i]
                      return img?.asset?.url ? (
                        <button
                          key={i}
                          onClick={() => setLightbox({ src: img.asset!.url, alt: img.alt || '' })}
                          className="flex-1 aspect-square rounded-md overflow-hidden cursor-pointer group/thumb relative"
                          aria-label={`View image ${i + 1}`}
                        >
                          <Image
                            src={img.asset.url}
                            alt={img.alt || ''}
                            fill
                            className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                            sizes="150px"
                          />
                        </button>
                      ) : (
                        <ImagePlaceholder key={i} />
                      )
                    })}
                  </div>
                </div>

                {/* Items + button */}
                <div className="flex flex-col">
                  {combo.items && combo.items.length > 0 && (
                    <div className="mb-8">
                      <p className="font-[family-name:var(--font-brand)] font-bold text-sm uppercase tracking-widest text-white mb-4">
                        {typicallyIncludesLabel || 'Typically Includes'}
                      </p>
                      <ul className="space-y-2">
                        {combo.items.map((item, i) => (
                          <li
                            key={i}
                            className="font-[family-name:var(--font-body)] text-sm text-[#B3B3B3] flex gap-2"
                          >
                            <span className="text-[#B3B3B3] shrink-0 mt-[5px] text-[6px]">●</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto">
                    {combo.caseStudy?.caseStudyPdf?.asset?.url && combo.caseStudy?.caseStudyPdfPreview?.asset?.url ? (
                      <button
                        onClick={() => setActivePdfKey(combo._key)}
                        className="inline-flex items-center gap-2 font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest bg-[#ffffff] text-black px-5 py-2.5 rounded-md hover:scale-[1.05] transition-transform duration-200 cursor-pointer"
                      >
                        {viewCaseStudyLabel || 'View Case Study'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest bg-[#ffffff] text-black px-5 py-2.5 rounded-md opacity-80 cursor-not-allowed"
                      >
                        {viewCaseStudyLabel || 'View Case Study'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}

      {activePdf && activePreview && (
        <CaseStudyPdfViewer
          previewUrl={activePreview.url}
          previewAlt={activePreview.alt}
          pdfUrl={activePdf.url}
          filename={activePdf.filename}
          onClose={() => setActivePdfKey(null)}
        />
      )}
    </section>
  )
}
