'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Project = {
  _id: string
  title: string
  slug?: { current: string }
  tagline?: string
  coverImage?: { asset?: { url: string }; alt?: string }
  client?: { name: string }
  studio?: { title: string; slug?: { current: string } }
}

type SectionData = { heading?: string; [key: string]: unknown }

type Props = {
  s: SectionData
  projects: Project[]
}

const PER_PAGE = 3
const AUTO_MS  = 3000

const PLACEHOLDERS: Project[] = Array.from({ length: 6 }, (_, i) => ({
  _id: `ph-${i}`,
  title: 'Project Title',
  tagline: 'Short project descriptor goes here',
  client: { name: 'Client Name' },
  studio: { title: 'Studio' },
}))

function ChevronLeft() {
  return (
    <svg width="16" height="56" viewBox="0 0 16 56" fill="none">
      <polyline points="14,2 2,28 14,54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="56" viewBox="0 0 16 56" fill="none">
      <polyline points="2,2 14,28 2,54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HighlightCard({ project, isPlaceholder }: { project: Project; isPlaceholder: boolean }) {
  const href = !isPlaceholder && project.slug?.current ? `/projects/${project.slug.current}` : null
  const inner = (<>
      <div className={`aspect-[3/2] overflow-hidden rounded-sm mb-3 ${isPlaceholder ? 'border border-dashed border-[#CCCCCC] bg-[#F5F5F5]' : 'bg-[#E6E6E6]'}`}>
        {project.coverImage?.asset?.url ? (
          <img
            src={`${project.coverImage.asset.url}?w=640&auto=format&q=80`}
            alt={project.coverImage.alt || project.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#CCCCCC]">
              <rect x="2" y="6" width="20" height="14" rx="2" />
              <circle cx="12" cy="13" r="3.5" />
              <path d="M7 6l1.5-2.5h5L15 6" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-1">
        <span className={`font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest ${isPlaceholder ? 'text-[#CCCCCC]' : 'text-bms-grey-400'}`}>
          {project.client?.name ?? ''}
        </span>
        <span className={`font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest ${isPlaceholder ? 'text-bms-accent/30' : 'text-bms-accent'}`}>
          {project.studio?.title ?? ''}
        </span>
      </div>

      <h3 className={`font-[family-name:var(--font-brand)] text-lg uppercase tracking-wide leading-tight transition-colors ${isPlaceholder ? 'text-[#CCCCCC]' : 'text-black group-hover:text-bms-accent'}`}>
        {project.title}
      </h3>

      {project.tagline && (
        <p className={`font-[family-name:var(--font-body)] text-xs mt-1 leading-relaxed line-clamp-2 ${isPlaceholder ? 'text-[#CCCCCC]' : 'text-[#4B4B4B]'}`}>
          {project.tagline}
        </p>
      )}
    </>)
  return href
    ? <Link href={href} className="group min-w-0 block">{inner}</Link>
    : <div className="group min-w-0">{inner}</div>
}

export function StudiosHighlights({ s, projects }: Props) {
  const [page, setPage]       = useState(0)
  const [transit, setTransit] = useState(true)
  const pageRef               = useRef(0)
  const pausedRef             = useRef(false)

  const isPlaceholder = projects.length === 0
  const source = isPlaceholder ? PLACEHOLDERS : projects

  const pages: Project[][] = []
  for (let i = 0; i < source.length; i += PER_PAGE) {
    pages.push(source.slice(i, i + PER_PAGE))
  }
  const totalPages = pages.length
  const maxPage    = totalPages - 1
  const canScroll  = totalPages > 1

  const handleNext = useCallback(() => {
    const cur = pageRef.current
    if (cur >= maxPage) {
      setTransit(false)
      pageRef.current = 0
      setPage(0)
      requestAnimationFrame(() => requestAnimationFrame(() => setTransit(true)))
    } else {
      setTransit(true)
      pageRef.current = cur + 1
      setPage(cur + 1)
    }
  }, [maxPage])

  const handlePrev = () => {
    setTransit(true)
    const next = pageRef.current <= 0 ? maxPage : pageRef.current - 1
    pageRef.current = next
    setPage(next)
  }

  const handleNextRef = useRef(handleNext)
  handleNextRef.current = handleNext

  useEffect(() => {
    if (!canScroll) return
    const id = setInterval(() => {
      if (!pausedRef.current) handleNextRef.current()
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [canScroll])

  return (
    <section
      className="relative bg-white py-14"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      {/* Section label */}
      <div className="max-w-6xl mx-auto px-6 mb-10 flex items-center gap-5">
        <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
          {s.heading || 'Highlights'}
        </span>
        <div className="flex-grow h-px bg-[#E6E6E6]" />
      </div>

      {/* Carousel — chevrons flanking track */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-6 md:gap-10">

          {/* Left chevron */}
          <button
            onClick={handlePrev}
            aria-label="Previous highlights"
            className={`shrink-0 text-bms-grey-200 hover:text-black group transition-colors duration-300 ${canScroll ? '' : 'invisible'}`}
          >
            <span className="block transition-transform duration-300 group-hover:scale-[1.125]">
              <ChevronLeft />
            </span>
          </button>

          {/* Sliding track */}
          <div className="flex-1 overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${page * 100}%)`,
                transition: transit ? 'transform 0.6s ease-in-out' : 'none',
              }}
            >
              {pages.map((pageCards, pageIdx) => (
                <div key={pageIdx} className="flex-none w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {pageCards.map((project, i) => (
                    <HighlightCard
                      key={`${project._id}-${i}`}
                      project={project}
                      isPlaceholder={isPlaceholder}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right chevron */}
          <button
            onClick={handleNext}
            aria-label="Next highlights"
            className={`shrink-0 text-bms-grey-200 hover:text-black group transition-colors duration-300 ${canScroll ? '' : 'invisible'}`}
          >
            <span className="block transition-transform duration-300 group-hover:scale-[1.125]">
              <ChevronRight />
            </span>
          </button>

        </div>

        {/* Line-dash indicators */}
        {canScroll && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => { setTransit(true); pageRef.current = i; setPage(i) }}
                aria-label={`Go to page ${i + 1}`}
                className={`h-px transition-all duration-300 ${i === page ? 'w-8 bg-bms-accent' : 'w-4 bg-[#E6E6E6]'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
