'use client'

import { useState } from 'react'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

type BtsProject = {
  _id: string
  title: string
  slug?: { current: string }
  studio?: { title: string; slug?: { current: string } }
  btsImages?: Array<{ asset?: { url: string }; alt?: string }>
}

type SectionData = { heading?: string; [key: string]: unknown }

type BtsItem = {
  url: string
  alt?: string
  projectTitle: string
  projectSlug?: string
  studioTitle?: string
}

type LightboxState = {
  src: string
  alt: string
  projectHref?: string
}

export function StudiosBts({ s, projects }: { s: SectionData; projects: BtsProject[] }) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const items: BtsItem[] = projects
    .flatMap((p) =>
      (p.btsImages ?? [])
        .filter((img) => !!img.asset?.url)
        .slice(0, 2)
        .map((img) => ({
          url: img.asset!.url,
          alt: img.alt,
          projectTitle: p.title,
          projectSlug: p.slug?.current,
          studioTitle: p.studio?.title,
        })),
    )
    .slice(0, 9)

  return (
    <section className="bg-[#111] py-20">
      {/* Label row */}
      <div className="max-w-5xl mx-auto px-6 mb-10 flex items-center gap-5">
        <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
          {s.heading || 'Behind the Scenes'}
        </span>
        <div className="flex-grow h-px bg-white/10" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {items.length === 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] border border-dashed border-white/10 rounded-sm" />
              ))}
            </div>
            <p className="text-bms-grey-400/40 font-[family-name:var(--font-functional)] text-[11px] uppercase tracking-widest mt-8 text-center">
              Behind the scenes content will appear here once projects have BTS images added.
            </p>
          </>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-sm group cursor-pointer"
                onClick={() =>
                  setLightbox({
                    src: `${item.url}?auto=format&q=92`,
                    alt: item.alt || item.projectTitle,
                    projectHref: item.projectSlug ? `/projects/${item.projectSlug}` : undefined,
                  })
                }
              >
                <img
                  src={`${item.url}?w=640&auto=format&q=80`}
                  alt={item.alt || item.projectTitle}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-[family-name:var(--font-brand)] text-sm uppercase tracking-wide text-white leading-tight">
                    {item.projectTitle}
                  </p>
                  {item.studioTitle && (
                    <p className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-bms-accent mt-1">
                      {item.studioTitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
          viewProjectHref={lightbox.projectHref}
        />
      )}
    </section>
  )
}
