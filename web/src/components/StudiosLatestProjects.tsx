'use client'

import Link from 'next/link'
import Image from 'next/image'
import { sectionBgStyle } from '@/lib/sectionBackground'
import { SimpleRichText } from '@/components/ui/SimpleRichText'
import { CardCarousel } from '@/components/ui/CardCarousel'

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

type SectionData = { heading?: any; sectionBg?: any; [key: string]: unknown }

type Props = {
  s: SectionData
  projects: Project[]
}

function ProjectCard({ project }: { project: Project }) {
  const href = project.slug?.current ? `/projects/${project.slug.current}` : null
  const inner = (
    <>
      <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-white/5 group">
        {project.coverImage?.asset?.url ? (
          <Image
            src={project.coverImage.asset.url}
            alt={project.coverImage.alt || project.title}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            sizes="(min-width: 768px) 33vw, 100vw"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {project.client?.name && (
            <p className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-white/60 leading-tight mb-1">
              {project.client.name}
            </p>
          )}
          {project.tagline && (
            <p className="font-[family-name:var(--font-body)] text-xs leading-relaxed line-clamp-2 text-white/70">
              {project.tagline}
            </p>
          )}
        </div>
      </div>
      <h3 className="font-[family-name:var(--font-brand)] text-lg uppercase tracking-wide leading-tight text-white mt-3">
        {project.title}
      </h3>
    </>
  )
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  )
}

export function StudiosLatestProjects({ s, projects }: Props) {
  const bgStyle = s.sectionBg ? sectionBgStyle(s.sectionBg) : undefined
  const source = projects.slice(0, 6)

  return (
    <section className="bg-black text-white py-20" style={bgStyle}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-5 mb-14">
          <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
            {s.heading ? <SimpleRichText value={s.heading} /> : 'Latest Projects'}
          </span>
          <div className="flex-grow h-px bg-white/10" />
        </div>
      </div>

      {source.length > 0 && (
        <CardCarousel
          items={source}
          keyFor={(project) => project._id}
          renderItem={(project) => <ProjectCard project={project} />}
          ariaLabel="latest projects"
        />
      )}
    </section>
  )
}
