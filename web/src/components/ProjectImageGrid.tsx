'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

type GalleryImage = {
  asset?: { url: string; metadata?: { dimensions?: { width: number; height: number } } }
  alt?: string
  caption?: string
}

export function ProjectImageGrid({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  const valid = images.filter((img) => !!img.asset?.url)
  if (valid.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {valid.map((item, i) => (
          <div key={i}>
            <div
              className="rounded-sm overflow-hidden cursor-pointer group"
              onClick={() => setLightbox({ src: `${item.asset!.url}?auto=format&q=92`, alt: item.alt || '' })}
            >
              <Image
                src={item.asset!.url}
                alt={item.alt || ''}
                width={item.asset!.metadata?.dimensions?.width || 1600}
                height={item.asset!.metadata?.dimensions?.height || 1067}
                className="w-full h-auto group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            {item.caption && (
              <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-2">
                {item.caption}
              </p>
            )}
          </div>
        ))}
      </div>
      {lightbox && (
        <ImageLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}
