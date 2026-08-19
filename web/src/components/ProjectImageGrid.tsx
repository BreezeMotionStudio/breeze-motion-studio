'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

type GalleryImage = {
  asset?: { url: string; metadata?: { dimensions?: { width: number; height: number } } }
  alt?: string
  caption?: string
}

const URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g

function linkifyCaption(caption: string) {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  URL_PATTERN.lastIndex = 0
  while ((match = URL_PATTERN.exec(caption)) !== null) {
    if (match.index > lastIndex) nodes.push(caption.slice(lastIndex, match.index))
    const matchedText = match[0]
    const href = matchedText.startsWith('http') ? matchedText : `https://${matchedText}`
    nodes.push(
      <a
        key={key++}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-bms-accent hover:underline"
      >
        {matchedText}
      </a>
    )
    lastIndex = match.index + matchedText.length
  }
  if (lastIndex < caption.length) nodes.push(caption.slice(lastIndex))

  return nodes
}

export function ProjectImageGrid({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  const valid = images.filter((img) => !!img.asset?.url)
  if (valid.length === 0) return null

  const isLoneLast = (i: number) => valid.length % 2 !== 0 && i === valid.length - 1

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {valid.map((item, i) => (
          <div key={i} className={isLoneLast(i) ? 'md:col-span-2' : ''}>
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
                sizes={isLoneLast(i) ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
              />
            </div>
            {item.caption && (
              <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-2">
                {linkifyCaption(item.caption)}
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
