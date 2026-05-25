'use client'

import { useState } from 'react'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

type BtsImage = {
  _key?: string
  image?: { asset?: { url: string }; alt?: string }
  label?: string
  caption?: string
}

type SectionData = { heading?: string; [key: string]: unknown }

type LightboxState = { src: string; alt: string }

export function StudiosBts({ s, btsImages }: { s: SectionData; btsImages: BtsImage[] }) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const valid = btsImages.filter((item) => !!item.image?.asset?.url)

  const labelRow = (
    <div className="max-w-5xl mx-auto px-6 mb-10 flex items-center gap-5">
      <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
        {s.heading || 'Behind the Scenes'}
      </span>
      <div className="flex-grow h-px bg-white/10" />
    </div>
  )

  if (valid.length === 0) {
    return (
      <section className="bg-[#111] py-20">
        {labelRow}
      </section>
    )
  }

  return (
    <section className="bg-[#111] py-20">
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
                <img
                  src={`${item.image!.asset!.url}?w=640&auto=format&q=80`}
                  alt={item.image?.alt || item.label || ''}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                {item.label && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-[family-name:var(--font-brand)] text-sm uppercase tracking-wide text-white leading-tight">
                      {item.label}
                    </p>
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
