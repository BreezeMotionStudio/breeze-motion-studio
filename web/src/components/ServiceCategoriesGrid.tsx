'use client'

import { useState, useEffect, useRef } from 'react'
import { sectionBgStyle } from '@/lib/sectionBackground'
import { Button } from '@/components/ui/Button'
import { CollageBackground } from '@/components/CollageBackground'

import { SimpleRichText } from '@/components/ui/SimpleRichText'

type ServiceGroup = {
  _key: string
  subheading?: string
  description?: any
  items: string[]
}

type Category = {
  _id: string
  title: string
  shortDescription: any
  services: string[]
  serviceGroups?: ServiceGroup[]
  image?: { asset?: { url: string }; alt?: string }
}


function AnimatedLine() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setActive(true), 80); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ height: '1px', marginTop: '8px', width: 'calc(100% + 1.25rem)', marginLeft: '-0.625rem', marginRight: '-0.625rem' }}>
      <div style={{ height: '1px', background: '#B3B3B3', width: active ? '100%' : '0', transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }} />
    </div>
  )
}


function PlaceholderImage() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1e1e1e] rounded-xl">
      <div className="text-center">
        <svg className="mx-auto mb-3 text-[#444]" width="36" height="36" viewBox="0 0 40 40" fill="none">
          <rect x="3" y="8" width="34" height="24" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="1.5" fill="currentColor" />
          <path d="M27 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-[#444]">
          Image / Video
        </span>
      </div>
    </div>
  )
}


export function ServiceCategoriesGrid({
  categories,
  sectionBg,
  collageImages,
  sectionTitle,
  sectionTitleColor,
  buttonLabel,
  buttonUrl,
  readMoreLabel,
  servicesIncludeLabel,
  closeLabel,
}: {
  categories: Category[]
  sectionBg?: any
  collageImages?: { image?: { asset?: { url: string }; alt?: string } }[]
  sectionTitle?: string
  sectionTitleColor?: string
  buttonLabel?: string
  buttonUrl?: string
  readMoreLabel?: string
  servicesIncludeLabel?: string
  closeLabel?: string
}) {
  const [open, setOpen] = useState<Category | null>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <section className="relative bg-[#0d0d0d] pb-32 overflow-hidden" style={sectionBgStyle(sectionBg)}>

      {/* Section background */}
      {sectionBg?.bgType === 'image' && sectionBg?.bgImage?.asset?.url ? (
        <>
          <img
            src={sectionBg.bgImage.asset.url}
            alt={sectionBg.bgImage.alt || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </>
      ) : collageImages && collageImages.length > 0 ? (
        <CollageBackground images={collageImages} />
      ) : null}

      {/* Title with radial shadow blending into background */}
      {sectionTitle && (
        <div
          className="absolute top-0 inset-x-0 z-[2] flex items-start justify-center pt-16 pointer-events-none"
          style={{
            height: '340px',
            background: 'radial-gradient(ellipse 40% 80% at 50% 10%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, transparent 100%)',
          }}
        >
          <h2
            className="font-[family-name:var(--font-brand)] text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide pointer-events-auto"
            style={{ color: sectionTitleColor ?? '#ffffff' }}
          >
            {sectionTitle}
          </h2>
        </div>
      )}


      <div className={`relative z-10 max-w-6xl mx-auto px-6 ${sectionTitle ? 'pt-48' : 'pt-24'}`}>

        {/* Cards — flex so last row centres automatically */}
        <div className="flex flex-wrap justify-center gap-5">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl flex flex-col cursor-pointer shadow-xl transition-transform duration-300 ease-out hover:scale-[1.03] w-full sm:w-[calc(50%-10px)] lg:w-[calc((100%-2.5rem)/3)] aspect-[2/3] overflow-hidden"
              onClick={() => setOpen(cat)}
            >
              {/* Image — full width square */}
              <div className="p-3 pb-2">
                <div className="w-full aspect-square overflow-hidden rounded-xl">
                  {cat.image?.asset?.url ? (
                    <img
                      src={cat.image.asset.url}
                      alt={cat.image.alt || cat.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PlaceholderImage />
                  )}
                </div>
              </div>

              {/* Content — description flows freely, Read More pinned absolutely */}
              <div className="px-4 pt-3 flex-1 relative overflow-hidden text-center">
                <h3 className="font-[family-name:var(--font-brand)] text-lg uppercase tracking-wide mb-2 leading-snug text-black font-semibold">
                  {cat.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B] leading-relaxed">
                  <SimpleRichText value={cat.shortDescription} />
                </p>

                {/* Gradient fades text into Read More bar */}
                <div className="absolute bottom-[68px] left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                {/* Read More — flush to bottom, no gap */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-8 bg-white border-t border-[#F0F0F0] flex justify-end">
                  <button
                    className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-[#535D66] hover:text-black transition-colors cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setOpen(cat) }}
                  >
                    {readMoreLabel || 'Read More'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button below grid */}
        {buttonLabel && buttonUrl && (
          <div className="flex justify-center mt-16">
            <Button variant="white" size="lg" href={buttonUrl}>
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>

      {/* Bottom shadow — depth bleed toward statement strip */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none z-20" />

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 pb-0">
              <div className="w-full aspect-video overflow-hidden rounded-xl">
                {open.image?.asset?.url ? (
                  <img
                    src={open.image.asset.url}
                    alt={open.image.alt || open.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaceholderImage />
                )}
              </div>
            </div>
            <div className="p-8 md:p-10 text-center">
              <h2 className="font-[family-name:var(--font-brand)] text-3xl md:text-4xl uppercase tracking-wide mb-4">
                {open.title}
              </h2>
              <p className="font-[family-name:var(--font-body)] text-base text-[#4B4B4B] leading-relaxed mb-8 max-w-lg mx-auto">
                <SimpleRichText value={open.shortDescription} />
              </p>
              {(open.serviceGroups?.length ?? 0) > 0 && (
                <div className="mb-10">
                  <p className="font-[family-name:var(--font-brand)] text-lg uppercase tracking-widest text-[#535D66] mb-6 text-center">
                    {servicesIncludeLabel || 'Services Include:'}
                  </p>
                  {open.serviceGroups!.map((group) => (
                    <div key={group._key} className="mb-12 last:mb-0 text-center">
                      {group.subheading && (
                        <div className="flex justify-center overflow-visible mb-5">
                          <div className="inline-flex flex-col items-center overflow-visible">
                            <p className="font-[family-name:var(--font-brand)] text-base uppercase tracking-wide text-black font-bold whitespace-nowrap mb-0">
                              {group.subheading}
                            </p>
                            <AnimatedLine />
                          </div>
                        </div>
                      )}
                      {group.description && (
                        <p className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B] leading-relaxed mb-4 max-w-md mx-auto">
                          <SimpleRichText value={group.description} />
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {group.items.map((item, i) => (
                          <div
                            key={i}
                            className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest bg-[#535D66] text-white px-4 py-2.5 border border-[#535D66] transition-colors duration-200 hover:bg-black hover:border-black hover:text-white cursor-default"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setOpen(null)}
                className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest bg-black text-white px-6 py-3 rounded-md transition-transform duration-200 hover:scale-[1.06] cursor-pointer"
              >
                {closeLabel || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
