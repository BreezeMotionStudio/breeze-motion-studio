import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchSafe } from '@/lib/sanity/fetchSafe'
import { PROJECT_BY_SLUG_QUERY, PROJECT_PAGE_TEMPLATE_QUERY } from '@/lib/sanity/queries'
import { resolveBg } from '@/lib/sectionBackground'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { SimpleRichText } from '@/components/ui/SimpleRichText'
import { CaseStudyPdfButton } from '@/components/CaseStudyPdfButton'
import { ProjectImageGrid } from '@/components/ProjectImageGrid'
import { notFound } from 'next/navigation'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }
type DeliverableImage = { asset?: { url: string }; alt?: string; caption?: string }
type DeliverableVideo = { _key: string; title?: string; platform?: string; url?: string }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await fetchSafe(PROJECT_BY_SLUG_QUERY, { slug }, null)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, tmpl] = await Promise.all([
    fetchSafe(PROJECT_BY_SLUG_QUERY, { slug }, null),
    fetchSafe(PROJECT_PAGE_TEMPLATE_QUERY, {}, null),
  ])

  if (!project) return notFound()

  const deliverableImages: DeliverableImage[] = project.deliverableImages ?? []
  const deliverableVideos: DeliverableVideo[] = project.deliverableVideos ?? []
  const btsVideos: DeliverableVideo[] = project.btsVideos ?? []
  const hasBts = !!(project.btsImages?.length || btsVideos.length)
  const caseStudyPdfUrl = project.caseStudyPdf?.asset?.url
  const hasCaseStudy = !!caseStudyPdfUrl

  const mediaSections = [
    { order: project.sectionOrderVideos ?? 1, key: 'videos' },
    { order: project.sectionOrderImages ?? 2, key: 'images' },
    { order: project.sectionOrderBts ?? 3, key: 'bts' },
  ].sort((a, b) => a.order - b.order)

  const heroStyle = resolveBg(tmpl?.heroSectionBg)
  const showCoverImage = tmpl?.heroShowCoverImage ?? false
  const coverOpacity = (tmpl?.heroCoverImageOpacity ?? 25) / 100

  const videoLabel = tmpl?.videoSectionLabel ? <SimpleRichText value={tmpl.videoSectionLabel} /> : 'Video Gallery'
  const imageLabel = tmpl?.imageSectionLabel ? <SimpleRichText value={tmpl.imageSectionLabel} /> : 'Image Gallery'
  const btsLabel = tmpl?.btsSectionLabel ? <SimpleRichText value={tmpl.btsSectionLabel} /> : 'Behind the Scenes'

  const caseStudyBgImg = tmpl?.caseStudySectionBg?.bgType === 'image' ? tmpl.caseStudySectionBg.bgImage : null
  const hasCaseStudyBgImage = !!caseStudyBgImg?.asset?.url

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-white text-black py-6 md:py-8 border-b border-[#E6E6E6] overflow-hidden"
        style={heroStyle}
      >
        {showCoverImage && project.coverImage?.asset?.url && (
          <img
            src={`${project.coverImage.asset.url}?w=1920&auto=format&q=75`}
            alt={project.coverImage.alt || project.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: coverOpacity }}
          />
        )}
        <div className="hero-catchup relative max-w-5xl mx-auto px-6">
          {project.studio?.slug?.current && (
            <Link
              href={`/studios/${project.studio.slug.current}`}
              className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-black/40 hover:text-black/70 transition-colors mb-4 inline-block"
            >
              ← {project.studio.title}
            </Link>
          )}
          <div className="flex flex-wrap gap-3 mb-4">
            {project.title && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest bg-black text-white px-3 py-1">
                {project.title}
              </span>
            )}
            {project.year && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest bg-black text-white px-3 py-1">
                {project.year}
              </span>
            )}
          </div>
          <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide text-black">
            {project.client?.name || project.title}
          </h1>
        </div>
      </section>

      {/* ── Overview ─────────────────────────────────────────────────────────── */}
      {(project.summary || project.deliverables?.length || project.services?.length) && (
        <section
          className="bg-white text-black py-16 border-b border-[#E6E6E6]"
          style={resolveBg(tmpl?.overviewSectionBg)}
        >
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
                <p className="font-[family-name:var(--font-body)] text-base md:text-lg text-[#4B4B4B] leading-relaxed mb-8">
                  {project.summary}
                </p>
              )}
              {project.deliverables?.length > 0 && (
                <div className="mb-8">
                  <span className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-bms-grey-400 block mb-4">
                    {tmpl?.deliverablesLabel ? <SimpleRichText value={tmpl.deliverablesLabel} /> : 'Deliverables'}
                  </span>
                  <ul className="list-disc pl-5 space-y-2">
                    {project.deliverables.filter((item: string) => item?.trim()).map((item: string, i: number) => (
                      <li key={i} className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B]">
                        {item}
                      </li>
                    ))}
                  </ul>
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
            supportingVideos.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl' :
            'grid-cols-1 sm:grid-cols-3'
          return (
            <section key="videos" id="videos" className="bg-black py-16" style={resolveBg(tmpl?.videoSectionBg)}>
              <div className="max-w-5xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-10">
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 shrink-0">
                    {videoLabel}
                  </span>
                  <div className="flex-grow h-px bg-bms-grey-400/30" />
                </div>
                <div className={supportingVideos.length > 0 ? 'mb-8' : ''}>
                  {featuredVideo.url && <VideoEmbed url={featuredVideo.url} platform={featuredVideo.platform} title={featuredVideo.title} />}
                  {featuredVideo.title && (
                    <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-3">
                      {featuredVideo.title}
                    </p>
                  )}
                </div>
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
            <section key="images" id="images" className="bg-[#F5F5F5] py-16" style={resolveBg(tmpl?.imageSectionBg)}>
              <div className="max-w-5xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-10">
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 shrink-0">
                    {imageLabel}
                  </span>
                  <div className="flex-grow h-px bg-bms-grey-400/30" />
                </div>
                <ProjectImageGrid images={deliverableImages} />
              </div>
            </section>
          )
        }

        if (key === 'bts' && hasBts) {
          return (
            <section key="bts" id="bts" className="bg-black py-16" style={resolveBg(tmpl?.btsSectionBg)}>
              <div className="max-w-5xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-10">
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 shrink-0">
                    {btsLabel}
                  </span>
                  <div className="flex-grow h-px bg-bms-grey-400/30" />
                </div>
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
                  <ProjectImageGrid images={project.btsImages} />
                )}
              </div>
            </section>
          )
        }

        return null
      })}

      {/* ── View Case Study ──────────────────────────────────────────────────── */}
      {hasCaseStudy && (
        <section
          className="relative overflow-hidden bg-black text-white py-24"
          style={tmpl?.caseStudySectionBg?.bgType && tmpl.caseStudySectionBg.bgType !== 'image' ? resolveBg(tmpl.caseStudySectionBg) : {}}
        >
          {(!tmpl?.caseStudySectionBg?.bgType || tmpl.caseStudySectionBg.bgType === 'image') && (
            <>
              <img
                src={hasCaseStudyBgImage
                  ? `${caseStudyBgImg!.asset.url}?w=1920&auto=format&q=80`
                  : 'https://cdn.sanity.io/images/ce9w3sdr/production/05b32c4153168a8465c443af641d1859f9389cac-6780x2160.jpg?w=1920&auto=format&q=80'}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/55" />
            </>
          )}
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <CaseStudyPdfButton
              pdfUrl={caseStudyPdfUrl}
              filename={project.caseStudyPdf?.asset?.originalFilename}
              label={tmpl?.viewCaseStudyLabel || 'View Case Study'}
            />
          </div>
        </section>
      )}

    </div>
  )
}
