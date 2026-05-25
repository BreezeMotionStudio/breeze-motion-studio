import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { PROJECT_BY_SLUG_QUERY } from '@/lib/sanity/queries'
import PortableTextContent from '@/components/ui/PortableTextContent'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { Button } from '@/components/ui/Button'
import { notFound } from 'next/navigation'

export const revalidate = 0

type Props = { params: Promise<{ slug: string }> }
type DeliverableImage = { asset?: { url: string }; alt?: string; caption?: string }
type DeliverableVideo = { _key: string; title?: string; platform?: string; url?: string }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await client.fetch(PROJECT_BY_SLUG_QUERY, { slug }).catch(() => null)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await client.fetch(PROJECT_BY_SLUG_QUERY, { slug }).catch(() => null)

  if (!project) return notFound()

  const deliverableImages: DeliverableImage[] = project.deliverableImages ?? []
  const deliverableVideos: DeliverableVideo[] = project.deliverableVideos ?? []
  const btsVideos: DeliverableVideo[] = project.btsVideos ?? []
  const hasBts = !!(project.btsNote || project.btsImages?.length || btsVideos.length)
  const hasCaseStudy = !!(project.caseStudyOverview || project.caseStudyChallenge || project.caseStudyApproach || project.caseStudyOutcome)

  // Sort media sections by their configured order (defaults: videos=1, images=2, bts=3)
  const mediaSections = [
    { order: project.sectionOrderVideos ?? 1, key: 'videos' },
    { order: project.sectionOrderImages ?? 2, key: 'images' },
    { order: project.sectionOrderBts ?? 3, key: 'bts' },
  ].sort((a, b) => a.order - b.order)

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-black text-white py-24 md:py-40 overflow-hidden">
        {project.coverImage?.asset?.url && (
          <img
            src={`${project.coverImage.asset.url}?w=1920&auto=format&q=75`}
            alt={project.coverImage.alt || project.title}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="relative max-w-5xl mx-auto px-6">
          {project.studio?.slug?.current && (
            <Link
              href={`/studios/${project.studio.slug.current}`}
              className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors mb-10 inline-block"
            >
              ← {project.studio.title}
            </Link>
          )}
          <div className="flex flex-wrap gap-3 mb-6">
            {project.client?.name && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 border border-[#333] px-3 py-1">
                {project.client.name}
              </span>
            )}
            {project.client?.industry && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 border border-[#333] px-3 py-1">
                {project.client.industry}
              </span>
            )}
            {project.studio?.title && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-accent border border-bms-accent px-3 py-1">
                {project.studio.title}
              </span>
            )}
            {project.year && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 border border-[#333] px-3 py-1">
                {project.year}
              </span>
            )}
          </div>
          <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide">
            {project.title}
          </h1>
        </div>
      </section>

      {/* ── Overview ─────────────────────────────────────────────────────────── */}
      {(project.summary || project.description || project.services?.length) && (
        <section className="bg-white text-black py-16 border-b border-[#E6E6E6]">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 items-start">
            {project.coverImage?.asset?.url && (
              <div className="aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src={`${project.coverImage.asset.url}?w=900&auto=format&q=80`}
                  alt={project.coverImage.alt || project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              {project.summary && (
                <p className="font-[family-name:var(--font-body)] text-lg text-[#4B4B4B] leading-relaxed mb-6">
                  {project.summary}
                </p>
              )}
              {project.description && (
                <PortableTextContent
                  value={project.description}
                  className="text-[#4B4B4B] [&_p]:text-base [&_p]:leading-relaxed"
                />
              )}
              {project.services?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.services.map((svc: { _id: string; title: string }) => (
                    <span
                      key={svc._id}
                      className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-bms-grey-400 border border-[#E6E6E6] px-3 py-1"
                    >
                      {svc.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Media sections in configured order ──────────────────────────────── */}
      {mediaSections.map(({ key }) => {
        if (key === 'videos' && deliverableVideos.length > 0) {
          const featuredVideo = deliverableVideos[0]
          const supportingVideos = deliverableVideos.slice(1)
          const supportingGridCols =
            supportingVideos.length === 1 ? 'grid-cols-1 max-w-sm' :
            supportingVideos.length === 2 ? 'grid-cols-2 max-w-2xl' :
            'grid-cols-3'
          return (
            <section key="videos" className="bg-black py-16">
              <div className="max-w-5xl mx-auto px-6">
                <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-10">
                  Video Gallery
                </span>
                {/* Featured video — full width */}
                <div className={supportingVideos.length > 0 ? 'mb-8' : ''}>
                  {featuredVideo.url && <VideoEmbed url={featuredVideo.url} platform={featuredVideo.platform} title={featuredVideo.title} />}
                  {featuredVideo.title && (
                    <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-3">
                      {featuredVideo.title}
                    </p>
                  )}
                </div>
                {/* Supporting videos — smaller grid, centered */}
                {supportingVideos.length > 0 && (
                  <div className={`grid gap-4 mx-auto ${supportingGridCols}`}>
                    {supportingVideos.map((item) => (
                      <div key={item._key}>
                        {item.url && <VideoEmbed url={item.url} platform={item.platform} title={item.title} />}
                        {item.title && (
                          <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-2">
                            {item.title}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )
        }

        if (key === 'images' && deliverableImages.length > 0) {
          return (
            <section key="images" className="bg-[#F5F5F5] py-16">
              <div className="max-w-5xl mx-auto px-6">
                <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-10">
                  Image Gallery
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliverableImages.map((item, i) =>
                    item.asset?.url ? (
                      <div key={i}>
                        <div className="rounded-sm overflow-hidden">
                          <img
                            src={`${item.asset.url}?w=1600&auto=format&q=85`}
                            alt={item.alt || ''}
                            className="w-full h-auto"
                          />
                        </div>
                        {item.caption && (
                          <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-2">
                            {item.caption}
                          </p>
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </section>
          )
        }

        if (key === 'bts' && hasBts) {
          return (
            <section key="bts" className="bg-black py-16">
              <div className="max-w-5xl mx-auto px-6">
                <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-10">
                  Behind the Scenes
                </span>
                {project.btsNote && (
                  <p className="font-[family-name:var(--font-body)] text-base text-white/70 leading-relaxed max-w-2xl mb-10">
                    {project.btsNote}
                  </p>
                )}
                {btsVideos.length > 0 && (
                  <div className="flex flex-col gap-10 mb-10">
                    {btsVideos.map((v) => (
                      <div key={v._key}>
                        {v.url && <VideoEmbed url={v.url} platform={v.platform} title={v.title} />}
                        {v.title && (
                          <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-3">{v.title}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {project.btsImages?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.btsImages.map((img: { asset?: { url: string }; alt?: string; caption?: string }, i: number) =>
                      img.asset?.url ? (
                        <div key={i}>
                          <div className="rounded-sm overflow-hidden">
                            <img
                              src={`${img.asset.url}?w=1600&auto=format&q=85`}
                              alt={img.alt || `Behind the scenes ${i + 1}`}
                              className="w-full h-auto"
                            />
                          </div>
                          {img.caption && (
                            <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-2">
                              {img.caption}
                            </p>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </section>
          )
        }

        return null
      })}

      {/* ── Case Study CTA ───────────────────────────────────────────────────── */}
      {hasCaseStudy && (
        <section className="bg-white border-b border-[#E6E6E6] py-12">
          <div className="max-w-5xl mx-auto px-6 flex items-center gap-6">
            <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 shrink-0">
              Case Study
            </span>
            <div className="flex-grow h-px bg-[#E6E6E6]" />
            <Button variant="black" size="sm" href={`/case-studies/${project.slug?.current}`}>
              View Case Study
            </Button>
          </div>
        </section>
      )}

      {/* ── Testimonial ──────────────────────────────────────────────────────── */}
      {project.testimonial?.quote && (
        <section className="bg-black text-white py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <blockquote>
              <p className="font-[family-name:var(--font-body)] text-xl italic text-bms-grey-200 mb-6 leading-relaxed">
                &ldquo;{project.testimonial.quote}&rdquo;
              </p>
              <footer className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
                — {project.testimonial.attribution}
                {project.testimonial.role && `, ${project.testimonial.role}`}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-[#2A3137] text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-brand)] text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-none mb-6">
            Start a Project
          </h2>
          <p className="font-[family-name:var(--font-body)] text-bms-grey-400 text-lg leading-relaxed mb-10">
            Every project begins with a conversation. Tell me what you&apos;re building.
          </p>
          <Button variant="white" size="lg" href="/contact">
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  )
}
