'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/ImageLightbox'
import { SimpleRichText } from '@/components/ui/SimpleRichText'
import { sectionBgStyle } from '@/lib/sectionBackground'

type BtsImage = {
  _key?: string
  image?: { asset?: { url: string }; alt?: string }
  label?: string
  caption?: string
  projectTitle?: string
  clientName?: string
  imageCaption?: string
}

type SectionData = { heading?: any; sectionBg?: any; [key: string]: unknown }

type LightboxState = { src: string; alt: string }

export function StudiosBts({ s, btsImages }: { s: SectionData; btsImages: BtsImage[] }) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const valid = btsImages.filter((item) => !!item.image?.asset?.url)
  const bgStyle = s.sectionBg ? sectionBgStyle(s.sectionBg) : undefined

  const labelRow = (
    <div className="max-w-5xl mx-auto px-6 mb-10 flex items-center gap-5">
      <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
        {s.heading ? <SimpleRichText value={s.heading} /> : 'Behind the Scenes'}
      </span>
      <div className="flex-grow h-px bg-white/10" />
    </div>
  )

  if (valid.length === 0) {
    return (
      <section className="bg-[#111] py-20" style={bgStyle}>
        {labelRow}
      </section>
    )
  }

  return (
    <section className="bg-[#111] py-20" style={bgStyle}>
      {labelRow}

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {valid.map((item, i) => (
              <div
                key={item._key || i}
                className="relative aspect-[4/3] overflow-hidden rounded-sm group cursor-pointer"
                onClick={() =>
                  setLightbox({
                    src: `${item.image!.asset!.url}?auto=format&q=92`,
                    alt: item.image?.alt || item.label || '',
                  })
                }
              >
                <Image
                  src={item.image!.asset!.url}
                  alt={item.image?.alt || item.label || ''}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {(item.projectTitle || item.clientName || item.imageCaption || item.label) && (
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {item.clientName && (
                      <p className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-white/60 leading-tight mb-0.5">
                        {item.clientName}
                      </p>
                    )}
                    {(item.label || item.projectTitle) && (
                      <p className="font-[family-name:var(--font-brand)] text-sm uppercase tracking-wide text-white leading-tight">
                        {item.label || item.projectTitle}
                      </p>
                    )}
                    {item.imageCaption && (
                      <p className="font-[family-name:var(--font-functional)] text-[9px] uppercase tracking-widest text-white/60 leading-tight mt-0.5">
                        {item.imageCaption}
                      </p>
                    )}
                  </div>
                )}
              </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}
