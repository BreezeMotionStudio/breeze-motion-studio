'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sectionBgStyle } from '@/lib/sectionBackground'

type Project = {
  _id: string
  title: string
  slug?: { current: string }
  tagline?: string
  completedAt?: string
  coverImage?: { asset?: { url: string }; alt?: string }
  client?: { name: string }
  studio?: { title: string; slug?: { current: string } }
}

type SectionData = { heading?: string; sectionBg?: any; [key: string]: unknown }

type Props = {
  s: SectionData
  projects: Project[]
}

const PER_PAGE = 3

function ProjectCard({ project }: { project: Project }) {
  const href = project.slug?.current ? `/projects/${project.slug.current}` : null
  const inner = (<>
      {/* Image */}
      <div className="aspect-[3/2] mb-4 overflow-hidden rounded-sm bg-white/5">
        {project.coverImage?.asset?.url ? (
          <img
            src={`${project.coverImage.asset.url}?w=640&auto=format&q=80`}
            alt={project.coverImage.alt || project.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-white/20">
              <rect x="2" y="6" width="20" height="14" rx="2" />
              <circle cx="12" cy="13" r="3.5" />
              <path d="M7 6l1.5-2.5h5L15 6" />
            </svg>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="mb-1">
        <span className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-bms-grey-400">
          {project.client?.name ?? ''}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-[family-name:var(--font-brand)] text-xl uppercase tracking-wide leading-tight transition-colors text-white group-hover:text-bms-accent">
        {project.title}
      </h3>

      {/* Tagline */}
      {project.tagline && (
        <p className="font-[family-name:var(--font-body)] text-sm mt-1 leading-relaxed line-clamp-2 text-bms-grey-400">
          {project.tagline}
        </p>
      )}
    </>)
  return href
    ? <Link href={href} className="group block">{inner}</Link>
    : <div className="group">{inner}</div>
}

export function StudiosLatestProjects({ s, projects }: Props) {
  const [page, setPage] = useState(0)
  const bgStyle = s.sectionBg ? sectionBgStyle(s.sectionBg) : undefined

  const source = projects.slice(0, 6)
  const totalPages = Math.ceil(source.length / PER_PAGE)
  const visible = source.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  function nextPage() {
    setPage((p) => (p + 1) % Math.max(1, totalPages))
  }

  return (
    <section className="bg-black text-white py-20" style={bgStyle}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-5">
            <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
              {s.heading || 'Latest Projects'}
            </span>
            <div className="w-16 h-px bg-white/10" />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {Array.from({length: totalPages}).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      i === page ? 'bg-bms-accent' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextPage}
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-bms-accent hover:text-bms-accent transition-colors duration-200"
                aria-label="Next projects"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 2l5 5-5 5" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visible.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
