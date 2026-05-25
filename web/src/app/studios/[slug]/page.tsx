import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { STUDIO_BY_SLUG_QUERY } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import PortableTextContent from '@/components/ui/PortableTextContent'
import { HeroImageFrame } from '@/components/HeroImageFrame'
import { Button } from '@/components/ui/Button'

export const revalidate = 0

type Props = { params: Promise<{ slug: string }> }

type Project = {
  _id: string
  title: string
  slug?: { current: string }
  summary?: string
  coverImage?: { asset?: { url: string }; alt?: string }
  client?: { name: string; industry?: string }
  year?: string
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const studio = await client.fetch(STUDIO_BY_SLUG_QUERY, { slug }).catch(() => null)
  if (!studio) return { title: 'Studio Not Found' }
  return {
    title: studio.seoTitle || studio.title,
    description: studio.seoDescription || studio.purpose,
  }
}

export default async function StudioPage({ params }: Props) {
  const { slug } = await params
  const studio = await client.fetch(STUDIO_BY_SLUG_QUERY, { slug }).catch(() => null)

  if (!studio) return notFound()

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-black text-white py-24 md:py-32 overflow-hidden">
        <HeroImageFrame url={studio.heroImage?.asset?.url} alt={studio.heroImage?.alt || studio.title} />
        <div className="hero-catchup relative z-10 max-w-5xl mx-auto px-6">
          <Link
            href="/studios"
            className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors mb-8 inline-block"
          >
            ← Studios
          </Link>
          <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide mb-4">
            {studio.title}
          </h1>
          {studio.tagline && (
            <p className="text-lg text-bms-grey-300 font-[family-name:var(--font-body)] max-w-xl">
              {studio.tagline}
            </p>
          )}
        </div>
      </section>

      {/* Purpose / Description */}
      {(studio.purpose || studio.description) && (
        <section className="bg-white border-b border-[#E6E6E6]">
          <div className="scroll-catchup max-w-5xl mx-auto px-6 py-12 md:py-16">
            <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-6">
              Studio Overview
            </span>
            {studio.description ? (
              <PortableTextContent
                value={studio.description}
                className="text-[#4B4B4B] max-w-2xl [&_p]:text-lg [&_p]:leading-relaxed"
              />
            ) : (
              <p className="font-[family-name:var(--font-body)] text-lg text-[#4B4B4B] leading-relaxed max-w-2xl">
                {studio.purpose}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="bg-black text-white py-16 pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="scroll-catchup flex items-center gap-6 mb-14">
            <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
              Projects
            </span>
            <div className="flex-grow h-px bg-white/10" />
          </div>

          {studio.projects && studio.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studio.projects.map((project: Project, i: number) => (
                <Link
                  key={project._id}
                  href={project.slug?.current ? `/projects/${project.slug.current}` : '#'}
                  className="scroll-catchup group"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="aspect-[4/3] bg-white/5 mb-4 overflow-hidden rounded-sm">
                    {project.coverImage?.asset?.url ? (
                      <img
                        src={project.coverImage.asset.url}
                        alt={project.coverImage.alt || project.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
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
                  <h3 className="font-[family-name:var(--font-functional)] font-bold text-sm uppercase tracking-wide mb-1 text-white group-hover:text-bms-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400">
                    {project.client?.name}
                    {project.year && ` — ${project.year}`}
                  </p>
                  {project.summary && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-bms-grey-400 mt-2 leading-relaxed">
                      {project.summary}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
              Projects will appear here once added in{' '}
              <strong>Sanity Studio → Content Library → Projects</strong>.
            </p>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-[#2A3137] text-white py-20">
        <div className="scroll-catchup max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-brand)] text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-none mb-6">
            Start a Project
          </h2>
          <p className="font-[family-name:var(--font-body)] text-bms-grey-400 text-lg leading-relaxed mb-10">
            Every project begins with a conversation. Tell me what you're building.
          </p>
          <Button variant="white" size="lg" href="/contact">
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  )
}
