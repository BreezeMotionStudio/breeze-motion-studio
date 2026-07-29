'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Project = {
  _id: string
  title: string
  slug?: { current: string }
  coverImage?: { asset?: { url: string }; alt?: string }
  client?: { name: string; industry?: string }
  year?: string
}

const PAGE_SIZE = 6

function ChevronDown() {
  return (
    <svg width="56" height="28" viewBox="0 0 56 28" fill="none">
      <polyline points="2,2 28,24 54,2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.slug?.current ? `/projects/${project.slug.current}` : '#'}
      className="group"
    >
      <div className="relative aspect-[4/3] bg-white/5 mb-4 overflow-hidden rounded-sm">
        {project.coverImage?.asset?.url ? (
          <Image
            src={project.coverImage.asset.url}
            alt={project.coverImage.alt || project.title}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-white/20"
            >
              <rect x="2" y="6" width="20" height="14" rx="2" />
              <circle cx="12" cy="13" r="3.5" />
              <path d="M7 6l1.5-2.5h5L15 6" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="font-[family-name:var(--font-functional)] font-bold text-sm uppercase tracking-wide mb-1 text-white group-hover:underline decoration-white/40 decoration-1 underline-offset-2">
        {project.title}
      </h3>
      <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400">
        {project.client?.name}
        {project.year && ` — ${project.year}`}
      </p>
    </Link>
  )
}

export function StudioProjectsGrid({ projects }: { projects: Project[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visible = projects.slice(0, visibleCount)
  const hasMore = visibleCount < projects.length

  return (
    <>
      {/* Mobile: capped at 6 with a load-more arrow */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-8">
          {visible.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-20 -mb-16">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              aria-label="Show more projects"
              className="text-[#999999] hover:text-white group cursor-pointer transition-colors duration-300"
            >
              <span className="block transition-transform duration-300 group-hover:scale-[1.125]">
                <ChevronDown />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop/tablet: every project, rows just keep adding */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </>
  )
}
