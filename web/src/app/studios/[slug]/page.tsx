import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { STUDIO_BY_SLUG_QUERY, STUDIO_PAGE_TEMPLATE_QUERY } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import { HeroImageFrame } from '@/components/HeroImageFrame'
import { StudioProjectsGrid } from '@/components/StudioProjectsGrid'
import { Button } from '@/components/ui/Button'
import { SimpleRichText } from '@/components/ui/SimpleRichText'
import { resolveBg, resolveTextClass } from '@/lib/sectionBackground'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

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
  const [studio, tmpl] = await Promise.all([
    client.fetch(STUDIO_BY_SLUG_QUERY, { slug }).catch(() => null),
    client.fetch(STUDIO_PAGE_TEMPLATE_QUERY).catch(() => null),
  ])

  if (!studio) return notFound()


  return (
    <div>
      {/* Hero */}
      <section
        className={`relative bg-black overflow-hidden py-24 md:py-32 ${resolveTextClass(tmpl?.heroSectionBg)}`}
        style={resolveBg(tmpl?.heroSectionBg)}
      >
        <HeroImageFrame
          url={studio.heroImage?.asset?.url}
          videoUrl={studio.heroMediaType === 'video' ? (studio.heroVideo?.asset?.url || studio.heroVideoUrl) : undefined}
          alt={studio.heroImage?.alt || studio.title}
          overlay={false}
        />
        <div className="hero-catchup relative z-10 max-w-5xl mx-auto px-6">
          <Link
            href="/studios"
            className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors mb-8 inline-block"
          >
            {tmpl?.backLabel || '← Studios'}
          </Link>
          <div className="hero-text-underlay">
            <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide mb-4">
              {studio.title}
            </h1>
            {studio.tagline && (
              <p className="text-base md:text-lg text-bms-grey-300 font-[family-name:var(--font-body)]">
                {studio.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Purpose / Description */}
      {studio.purpose && (
        <section
          className={`bg-white border-b border-[#E6E6E6] ${resolveTextClass(tmpl?.overviewSectionBg, undefined, true)}`}
          style={resolveBg(tmpl?.overviewSectionBg)}
        >
          <div className="scroll-catchup max-w-5xl mx-auto px-6 py-12 md:py-16">
            <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-6">
              {tmpl?.overviewLabel ? <SimpleRichText value={tmpl.overviewLabel} /> : 'Studio Overview'}
            </span>
            <p className="font-[family-name:var(--font-body)] text-base md:text-lg text-[#4B4B4B] leading-relaxed max-w-2xl">
              {studio.purpose}
            </p>
            <p className="font-[family-name:var(--font-body)] text-base text-bms-grey-400 leading-relaxed mt-6">
              {tmpl?.overviewSubtext ? <SimpleRichText value={tmpl.overviewSubtext} /> : 'View the projects below.'}
            </p>
          </div>
        </section>
      )}

      {/* Projects */}
      <section
        className={`bg-black py-16 pb-28 ${resolveTextClass(tmpl?.projectsSectionBg)}`}
        style={resolveBg(tmpl?.projectsSectionBg)}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="scroll-catchup flex items-center gap-6 mb-14">
            <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
              {tmpl?.projectsLabel ? <SimpleRichText value={tmpl.projectsLabel} /> : 'Projects'}
            </span>
            <div className="flex-grow h-px bg-white/10" />
          </div>

          {studio.projects && studio.projects.length > 0 ? (
            <StudioProjectsGrid projects={studio.projects} />
          ) : (
            <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
              Projects will appear here once added in{' '}
              <strong>Sanity Studio → Content Library → Projects</strong>.
            </p>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section
        className={`relative overflow-hidden bg-bms-dark-400 text-white py-24 ${resolveTextClass(tmpl?.ctaSectionBg)}`}
        style={tmpl?.ctaSectionBg?.bgType && tmpl.ctaSectionBg.bgType !== 'image' ? resolveBg(tmpl.ctaSectionBg) : {}}
      >
        {(!tmpl?.ctaSectionBg?.bgType || tmpl.ctaSectionBg.bgType === 'image') && (
          <>
            <img
              src={tmpl?.ctaSectionBg?.bgType === 'image' && tmpl.ctaSectionBg.bgImage?.asset?.url
                ? `${tmpl.ctaSectionBg.bgImage.asset.url}?w=1920&auto=format&q=80`
                : 'https://cdn.sanity.io/images/ce9w3sdr/production/05b32c4153168a8465c443af641d1859f9389cac-6780x2160.jpg?w=1920&auto=format&q=80'}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/55" />
          </>
        )}
        <div className="scroll-catchup relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-brand)] text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-none mb-6">
            {tmpl?.ctaHeading ? <SimpleRichText value={tmpl.ctaHeading} /> : 'Start a Project'}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-bms-grey-400 text-base md:text-lg leading-relaxed mb-10">
            {tmpl?.ctaText ? <SimpleRichText value={tmpl.ctaText} /> : 'Get in touch to discuss your project.'}
          </p>
          <Button variant="white" size="lg" href={tmpl?.ctaButtonUrl || '/contact'}>
            {tmpl?.ctaButtonLabel || 'Contact'}
          </Button>
        </div>
      </section>
    </div>
  )
}
