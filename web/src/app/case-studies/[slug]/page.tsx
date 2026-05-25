import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { CASE_STUDY_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import PortableTextContent from "@/components/ui/PortableTextContent";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { notFound } from "next/navigation";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

type DeliverableImage = { asset?: { url: string }; alt?: string; caption?: string }
type DeliverableVideo = { _key: string; title?: string; platform?: string; url?: string }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await client.fetch(CASE_STUDY_BY_SLUG_QUERY, { slug }).catch(() => null);
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: cs.seoTitle || cs.title,
    description: cs.seoDescription || cs.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await client.fetch(CASE_STUDY_BY_SLUG_QUERY, { slug }).catch(() => null);

  if (!cs) return notFound();

  const deliverableImages: DeliverableImage[] = cs.deliverableImages ?? []
  const deliverableVideos: DeliverableVideo[] = cs.deliverableVideos ?? []
  const btsVideos: DeliverableVideo[] = cs.btsVideos ?? []
  const hasBts = !!(cs.btsNote || cs.btsImages?.length || btsVideos.length)
  const hasCaseStudyNarrative = !!(cs.caseStudyOverview || cs.caseStudyChallenge || cs.caseStudyApproach || cs.caseStudyOutcome)

  // Sort media sections by their configured order (defaults: videos=1, images=2, bts=3)
  const mediaSections = [
    { order: cs.sectionOrderVideos ?? 1, key: 'videos' },
    { order: cs.sectionOrderImages ?? 2, key: 'images' },
    { order: cs.sectionOrderBts ?? 3, key: 'bts' },
  ].sort((a, b) => a.order - b.order)

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-black text-white py-24 md:py-40 overflow-hidden">
        {cs.coverImage?.asset?.url && (
          <img
            src={cs.coverImage.asset.url}
            alt={cs.coverImage.alt || cs.title}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="relative max-w-5xl mx-auto px-6">
          <Link
            href="/case-studies"
            className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors mb-10 inline-block"
          >
            ← Case Studies
          </Link>
          <div className="flex flex-wrap gap-3 mb-6">
            {cs.client?.name && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 border border-[#333] px-3 py-1">
                {cs.client.name}
              </span>
            )}
            {cs.client?.industry && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 border border-[#333] px-3 py-1">
                {cs.client.industry}
              </span>
            )}
            {cs.studio?.title && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-accent border border-bms-accent px-3 py-1">
                {cs.studio.title}
              </span>
            )}
            {cs.year && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 border border-[#333] px-3 py-1">
                {cs.year}
              </span>
            )}
          </div>
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
            {cs.title}
          </h1>
        </div>
      </section>

      {/* ── Summary + description ────────────────────────────────────────────── */}
      {(cs.summary || cs.description) && (
        <section className="bg-white text-black py-16 border-b border-[#E6E6E6]">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 items-start">
            {cs.coverImage?.asset?.url && (
              <div className="aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src={`${cs.coverImage.asset.url}?w=900&auto=format&q=80`}
                  alt={cs.coverImage.alt || cs.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              {cs.summary && (
                <p className="font-[family-name:var(--font-body)] text-lg text-[#4B4B4B] leading-relaxed mb-6">
                  {cs.summary}
                </p>
              )}
              {cs.description && (
                <PortableTextContent value={cs.description} className="text-[#4B4B4B] [&_p]:text-base [&_p]:leading-relaxed" />
              )}
              {cs.services?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {cs.services.map((svc: {_id: string; title: string}) => (
                    <span key={svc._id} className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-bms-grey-400 border border-[#E6E6E6] px-3 py-1">
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
            <section key="bts" className="bg-[#F5F5F5] py-16">
              <div className="max-w-5xl mx-auto px-6">
                <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-10">
                  Behind the Scenes
                </span>
                {cs.btsNote && (
                  <p className="font-[family-name:var(--font-body)] text-base text-[#4B4B4B] leading-relaxed max-w-2xl mb-10">
                    {cs.btsNote}
                  </p>
                )}
                {btsVideos.length > 0 && (
                  <div className="flex flex-col gap-10 mb-10">
                    {btsVideos.map((v: DeliverableVideo) => (
                      <div key={v._key}>
                        {v.url && <VideoEmbed url={v.url} platform={v.platform} title={v.title} />}
                        {v.title && (
                          <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400 mt-3">{v.title}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {cs.btsImages?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cs.btsImages.map((img: { asset?: { url: string }; alt?: string; caption?: string }, i: number) =>
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

      {/* ── Case Study narrative ─────────────────────────────────────────────── */}
      {hasCaseStudyNarrative && (
        <section className="bg-white text-black py-20">
          <div className="max-w-3xl mx-auto px-6">
            <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-12">
              Case Study
            </span>

            {cs.caseStudyOverview && (
              <p className="font-[family-name:var(--font-body)] text-xl text-[#4B4B4B] leading-relaxed mb-14">
                {cs.caseStudyOverview}
              </p>
            )}

            {cs.caseStudyChallenge && (
              <div className="mb-12">
                <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-black mb-5">
                  The Challenge
                </h2>
                <PortableTextContent value={cs.caseStudyChallenge} className="text-[#4B4B4B] [&_p]:leading-relaxed" />
              </div>
            )}

            {cs.caseStudyApproach && (
              <div className="mb-12">
                <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-black mb-5">
                  The Approach
                </h2>
                <PortableTextContent value={cs.caseStudyApproach} className="text-[#4B4B4B] [&_p]:leading-relaxed" />
              </div>
            )}

            {cs.caseStudyOutcome && (
              <div className="mb-12">
                <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-black mb-5">
                  The Outcome
                </h2>
                <PortableTextContent value={cs.caseStudyOutcome} className="text-[#4B4B4B] [&_p]:leading-relaxed" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Testimonial ──────────────────────────────────────────────────────── */}
      {cs.testimonial?.quote && (
        <section className="bg-black text-white py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <blockquote>
              <p className="font-[family-name:var(--font-body)] text-xl italic text-bms-grey-200 mb-6 leading-relaxed">
                &ldquo;{cs.testimonial.quote}&rdquo;
              </p>
              <footer className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
                — {cs.testimonial.attribution}
                {cs.testimonial.role && `, ${cs.testimonial.role}`}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {/* ── Back link ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-[#E6E6E6] py-8">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/case-studies"
            className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 hover:text-black transition-colors"
          >
            ← All Case Studies
          </Link>
        </div>
      </div>
    </div>
  );
}
