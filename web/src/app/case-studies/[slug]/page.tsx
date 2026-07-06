import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { CASE_STUDY_BY_SLUG_QUERY, CASE_STUDY_PAGE_TEMPLATE_QUERY } from '@/lib/sanity/queries'
import { resolveBg } from '@/lib/sectionBackground'
import PortableTextContent from '@/components/ui/PortableTextContent'
import { SimpleRichText } from '@/components/ui/SimpleRichText'
import { Button } from '@/components/ui/Button'
import { AnimatedLine } from '@/components/AnimatedLine'
import { notFound } from 'next/navigation'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cs = await client.fetch(CASE_STUDY_BY_SLUG_QUERY, { slug }).catch(() => null)
  if (!cs) return { title: 'Case Study Not Found' }
  return {
    title: cs.seoTitle || cs.title,
    description: cs.seoDescription || cs.summary,
  }
}

function deliverableAnchor(label: string): 'videos' | 'images' | 'bts' | null {
  const s = label.toLowerCase()
  if (/video|film|animation|motion|reel|promo|commercial|documentary|cinematic|footage|edit/.test(s)) return 'videos'
  if (/photo|image|still|portrait|headshot|product shot|picture|print|graphic design|illustration/.test(s)) return 'images'
  if (/bts|behind the scenes|making of|process/.test(s)) return 'bts'
  return null
}

function NarrativeImage({ url, alt }: { url?: string; alt?: string }) {
  if (url) {
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-sm">
        <img
          src={`${url}?w=700&auto=format&q=85`}
          alt={alt || ''}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }
  return (
    <div className="hidden md:flex aspect-[4/3] items-center justify-center border border-dashed border-white/15 rounded-sm bg-white/5">
      <span className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-white/25">
        Image
      </span>
    </div>
  )
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const [cs, tmpl] = await Promise.all([
    client.fetch(CASE_STUDY_BY_SLUG_QUERY, { slug }).catch(() => null),
    client.fetch(CASE_STUDY_PAGE_TEMPLATE_QUERY).catch(() => null),
  ])

  if (!cs) return notFound()

  const imageUrl = cs.coverImage?.asset?.url
  const imageAlt = cs.coverImage?.alt || cs.title

  const overviewHeading = tmpl?.overviewHeading ? <SimpleRichText value={tmpl.overviewHeading} /> : 'Project Overview'
  const deliverablesLabel = tmpl?.deliverablesLabel ? <SimpleRichText value={tmpl.deliverablesLabel} /> : 'Deliverables'
  const challengeLabel = tmpl?.challengeLabel ? <SimpleRichText value={tmpl.challengeLabel} /> : 'The Challenge'
  const approachLabel = tmpl?.approachLabel ? <SimpleRichText value={tmpl.approachLabel} /> : 'The Approach'
  const outcomeLabel = tmpl?.outcomeLabel ? <SimpleRichText value={tmpl.outcomeLabel} /> : 'The Outcome'

  const ctaHeading = tmpl?.ctaHeading ? <SimpleRichText value={tmpl.ctaHeading} /> : 'Start a Project'
  const ctaText = tmpl?.ctaText ? <SimpleRichText value={tmpl.ctaText} /> : 'Get in touch to discuss your project.'
  const ctaButtonLabel = tmpl?.ctaButtonLabel || 'Contact'
  const ctaButtonUrl = tmpl?.ctaButtonUrl || '/contact'

  const ctaBg = tmpl?.ctaSectionBg
  const ctaBgImageUrl = ctaBg?.bgType === 'image' ? ctaBg?.bgImage?.asset?.url : null
  const fallbackCtaImageUrl = 'https://cdn.sanity.io/images/ce9w3sdr/production/05b32c4153168a8465c443af641d1859f9389cac-6780x2160.jpg'

  return (
    <div>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-12 md:py-16 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/case-studies"
            className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white/35 hover:text-white/65 transition-colors mb-8 inline-block"
          >
            {tmpl?.backLabel || '← Case Studies'}
          </Link>
          <h1 className="font-[family-name:var(--font-brand)] text-4xl sm:text-6xl md:text-7xl uppercase tracking-wide leading-none mb-6">
            {cs.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {cs.client?.name && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white/40">
                {cs.client.name}
              </span>
            )}
            {cs.year && (
              <>
                <span className="text-white/15">·</span>
                <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white/40">
                  {cs.year}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Split panel ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">

        {/* Image — right side, underlaps dark panel */}
        {imageUrl && (
          <div
            className="hidden md:block absolute inset-y-0 right-0"
            style={{ left: '42%' }}
          >
            <img
              src={`${imageUrl}?w=1600&auto=format&q=85`}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, #1a1a1a 0%, transparent 18%)' }}
            />
          </div>
        )}

        {/* Dark panel — exactly half on desktop */}
        <div className={`relative z-10 bg-[#1a1a1a] text-white py-14 px-8 md:px-12 lg:px-14 ${imageUrl ? 'md:w-1/2' : 'w-full'}`}>

          <div className="inline-flex flex-col mb-8">
            <h2 className="font-[family-name:var(--font-brand)] text-2xl uppercase tracking-wide text-white mb-3">
              {overviewHeading}
            </h2>
            <AnimatedLine className="h-[2px] bg-white rounded-full" />
          </div>

          {/* Summary */}
          {cs.summary && (
            <p className="font-[family-name:var(--font-body)] text-lg text-white/70 leading-relaxed mb-8">
              {cs.summary}
            </p>
          )}

          {/* Overview */}
          {cs.caseStudyOverview && (
            <p className={`font-[family-name:var(--font-body)] text-lg text-white/70 leading-relaxed ${cs.summary ? 'pt-8 border-t border-white/8' : ''}`}>
              {cs.caseStudyOverview}
            </p>
          )}

          {/* Description fallback */}
          {!cs.summary && !cs.caseStudyOverview && cs.description && (
            <PortableTextContent
              value={cs.description}
              className="text-white/60 [&_p]:font-[family-name:var(--font-body)] [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-3"
            />
          )}

          {/* Deliverables */}
          {cs.deliverables?.length > 0 && (
            <div className="mt-10 pt-8 border-t border-white/8">
              <span className="font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest text-white/35 block mb-4">
                {deliverablesLabel}
              </span>
              <ul className="flex flex-col gap-2">
                {cs.deliverables.filter((d: string) => d?.trim()).map((d: string, i: number) => {
                  const anchor = deliverableAnchor(d)
                  const href = anchor ? `/projects/${cs.slug?.current}#${anchor}` : null
                  const cls = 'font-[family-name:var(--font-functional)] text-[11px] uppercase tracking-widest text-white/55 border border-white/10 px-3 py-2 w-fit hover:bg-black hover:text-white/80 hover:border-white/20 transition-colors duration-200'
                  return href ? (
                    <li key={i}>
                      <Link href={href} className={cls}>
                        {d}
                      </Link>
                    </li>
                  ) : (
                    <li key={i} className={`${cls} cursor-default`}>
                      {d}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

        </div>

        {/* Mobile: image below the panel */}
        {imageUrl && (
          <div className="md:hidden aspect-video overflow-hidden">
            <img
              src={`${imageUrl}?w=900&auto=format&q=85`}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        )}

      </section>

      {/* ── Narrative ────────────────────────────────────────────────────────── */}
      {(cs.caseStudyChallenge || cs.caseStudyApproach || cs.caseStudyOutcome) && (
        <section
          className="py-20 md:py-28"
          style={tmpl?.narrativeSectionBg?.bgType ? resolveBg(tmpl.narrativeSectionBg) : { background: 'linear-gradient(to top right, #000000 20%, #363F47)' }}
        >
          <div className="max-w-5xl mx-auto px-6 [&>div:first-child]:border-t-0">

            {cs.caseStudyChallenge && (
              <div className="scroll-catchup grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 md:gap-12 py-14 border-t border-white/10">
                <div>
                  <h2 className="font-[family-name:var(--font-brand)] text-2xl uppercase tracking-wide text-white mb-5">
                    {challengeLabel}
                  </h2>
                  <PortableTextContent
                    value={cs.caseStudyChallenge}
                    className="[&_p]:font-[family-name:var(--font-body)] [&_p]:text-lg [&_p]:text-white/70 [&_p]:leading-relaxed [&_p]:mb-4"
                  />
                </div>
                <NarrativeImage url={cs.caseStudyChallengeImage?.asset?.url} alt={cs.caseStudyChallengeImage?.alt} />
              </div>
            )}

            {cs.caseStudyApproach && (
              <div className="scroll-catchup grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 md:gap-12 py-14 border-t border-white/10">
                <div>
                  <h2 className="font-[family-name:var(--font-brand)] text-2xl uppercase tracking-wide text-white mb-5">
                    {approachLabel}
                  </h2>
                  <PortableTextContent
                    value={cs.caseStudyApproach}
                    className="[&_p]:font-[family-name:var(--font-body)] [&_p]:text-lg [&_p]:text-white/70 [&_p]:leading-relaxed [&_p]:mb-4"
                  />
                </div>
                <NarrativeImage url={cs.caseStudyApproachImage?.asset?.url} alt={cs.caseStudyApproachImage?.alt} />
              </div>
            )}

            {cs.caseStudyOutcome && (
              <div className="scroll-catchup grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 md:gap-12 py-14 border-t border-white/10">
                <div>
                  <h2 className="font-[family-name:var(--font-brand)] text-2xl uppercase tracking-wide text-white mb-5">
                    {outcomeLabel}
                  </h2>
                  <PortableTextContent
                    value={cs.caseStudyOutcome}
                    className="[&_p]:font-[family-name:var(--font-body)] [&_p]:text-lg [&_p]:text-white/70 [&_p]:leading-relaxed [&_p]:mb-4"
                  />
                </div>
                <NarrativeImage url={cs.caseStudyOutcomeImage?.asset?.url} alt={cs.caseStudyOutcomeImage?.alt} />
              </div>
            )}

          </div>
        </section>
      )}

      {/* ── Testimonial ──────────────────────────────────────────────────────── */}
      {cs.testimonial?.quote && (
        <section
          className="bg-black text-white py-20 border-t border-white/5"
          style={resolveBg(tmpl?.testimonialSectionBg)}
        >
          <div className="scroll-catchup max-w-3xl mx-auto px-6 text-center">
            <blockquote>
              <p className="font-[family-name:var(--font-body)] text-xl text-white/75 leading-relaxed mb-6 italic">
                &ldquo;{cs.testimonial.quote}&rdquo;
              </p>
              <footer className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
                {cs.testimonial.attribution}
                {cs.testimonial.role && `, ${cs.testimonial.role}`}
                {cs.testimonial.client?.name && `, ${cs.testimonial.client.name}`}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-black text-white py-24"
        style={ctaBg?.bgType && ctaBg.bgType !== 'image' ? resolveBg(ctaBg) : {}}
      >
        {(!ctaBg?.bgType || ctaBg.bgType === 'image') && (
          <>
            <img
              src={`${ctaBgImageUrl || fallbackCtaImageUrl}?w=1920&auto=format&q=80`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/55" />
          </>
        )}
        <div className="scroll-catchup relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-brand)] text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-none mb-6">
            {ctaHeading}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-bms-grey-400 text-lg leading-relaxed mb-10">
            {ctaText}
          </p>
          <Button variant="white" size="lg" href={ctaButtonUrl}>
            {ctaButtonLabel}
          </Button>
        </div>
      </section>

    </div>
  )
}
