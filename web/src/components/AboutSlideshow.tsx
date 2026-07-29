'use client'

import {useState, useEffect, useRef} from 'react'
import Image from 'next/image'

type SlideImage = {asset?: {url: string}; alt?: string}

export function AboutSlideshow({images, side}: {images?: SlideImage[]; side: 'left' | 'right'}) {
  const count = images?.length ?? 0
  const [idx, setIdx] = useState(0)
  const [transit, setTransit] = useState(true)
  const idxRef = useRef(0)

  useEffect(() => {
    if (count <= 1) return
    const timer = setInterval(() => {
      const cur = idxRef.current
      if (cur >= count - 1) {
        setTransit(false)
        idxRef.current = 0
        setIdx(0)
        requestAnimationFrame(() => requestAnimationFrame(() => setTransit(true)))
      } else {
        setTransit(true)
        idxRef.current = cur + 1
        setIdx(cur + 1)
      }
    }, 8000)
    return () => clearInterval(timer)
  }, [count])

  if (!images || count === 0) {
    return (
      <div className="w-full h-full border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-white/25 text-xs uppercase tracking-widest select-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span>{side === 'left' ? 'Left Images' : 'Right Images'}</span>
      </div>
    )
  }

  if (count === 1) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={images[0].asset?.url ?? ''}
          alt={images[0].alt ?? ''}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(min-width: 768px) 25vw, 100vw"
        />
      </div>
    )
  }

  return (
    <div
      className="flex h-full"
      style={{
        width: `${count * 100}%`,
        transform: `translateX(-${(idx * 100) / count}%)`,
        transition: transit ? 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
      }}
    >
      {images.map((img, i) => (
        <div key={i} style={{width: `${100 / count}%`}} className="relative h-full shrink-0">
          <Image
            src={img.asset?.url ?? ''}
            alt={img.alt ?? ''}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(min-width: 768px) 25vw, 100vw"
          />
        </div>
      ))}
    </div>
  )
}
