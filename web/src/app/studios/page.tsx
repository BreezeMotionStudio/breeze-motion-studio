import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { fetchSafe } from '@/lib/sanity/fetchSafe'
import {
  STUDIOS_QUERY,
  STUDIOS_PAGE_QUERY,
} from '@/lib/sanity/queries'
import { sectionBgStyle, resolveBg, resolveTextClass } from '@/lib/sectionBackground'
import { HeroImageFrame } from '@/components/HeroImageFrame'
import { SimpleRichText } from '@/components/ui/SimpleRichText'
import { StudiosHighlights } from '@/components/StudiosHighlights'
import { StudiosBts } from '@/components/StudiosBts'
import { StudiosLatestProjects } from '@/components/StudiosLatestProjects'
import { Button } from '@/components/ui/Button'
import { btnSpacingClass } from '@/lib/buttonSpacing'
import { buildMetadata } from '@/lib/openGraph'

export const revalidate = 60

type Section = Record<string, any> & { _type: string; _key: string }
type CtaButton = { _key?: string; label?: string; url?: string; topSpacing?: string; bottomSpacing?: string }
type Studio = {
  _id: string
  title: string
  slug: { current: string }
  tagline?: string
  heroImage?: { asset?: { url: string }; alt?: string }
  overlayOpacity?: number
  overlayDirection?: string
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSafe(STUDIOS_PAGE_QUERY, {}, null)
  const hero = page?.sections?.find((s: Section) => s._type === 'studiosHero')
  return buildMetadata({
    title: page?.seoTitle || 'Studios',
    description:
      page?.seoDescription ||
      'Explore our specialized studios — Machine Studio, Commercial Studio, Creative Studio, and Strategy Studio.',
    path: '/studios',
    imageUrl: hero?.heroImage?.asset?.url,
    imageAlt: hero?.heroImage?.alt,
  })
}

// ── Fixed section components ────────────────────────────────────────────────

function StudiosHero({ s }: { s: Section }) {
  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} py-24 md:py-32`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <Image src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <HeroImageFrame url={s.heroImage?.asset?.url} alt={s.heroImage?.alt} overlay={false} />
      <div className="hero-catchup relative z-10 max-w-5xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide">
          {s.heading ? <SimpleRichText value={s.heading} /> : 'Studios'}
        </h1>
      </div>
    </section>
  )
}

function StudiosIntro({ s }: { s: Section }) {
  if (!s.text) return null
  return (
    <section
      className={`relative overflow-hidden bg-white border-b border-[#E6E6E6] ${resolveTextClass(s.sectionBg, s.bgColor, true)}`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <Image src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div className="scroll-catchup relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-14">
        <p className="text-[#4B4B4B] text-base md:text-lg leading-relaxed max-w-2xl font-[family-name:var(--font-body)]">
          <SimpleRichText value={s.text} />
        </p>
      </div>
    </section>
  )
}

function StudiosGrid({ studios, sectionBg, exploreLabel }: { studios: Studio[]; sectionBg?: any; exploreLabel?: string }) {
  const bgStyle = sectionBg ? sectionBgStyle(sectionBg) : undefined
  if (!studios.length) {
    return (
      <section className="bg-black py-20" style={bgStyle}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
            Studios will appear here once added in{' '}
            <strong>Sanity Studio → Content Library → Studios</strong>.
          </p>
        </div>
      </section>
    )
  }
  return (
    <section className="bg-black px-3 md:px-4 lg:px-6 xl:px-8 py-10 md:py-4 lg:py-6 xl:py-8" style={bgStyle}>
      <div className="flex flex-wrap justify-center gap-6 md:gap-3">
        {studios.map((studio) => (
          <Link
            key={studio._id}
            href={`/studios/${studio.slug?.current}`}
            className="group relative block overflow-hidden rounded-xl w-full md:w-[calc(50%-6px)]"
            style={{ aspectRatio: '4/3' }}
          >
            {studio.heroImage?.asset?.url ? (
              <Image
                src={studio.heroImage.asset.url}
                alt={studio.heroImage.alt || studio.title}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#1a1a1a]" />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${studio.overlayDirection ?? 'to top right'}, rgba(0,0,0,${((studio.overlayOpacity ?? 70) / 100).toFixed(2)}) 0%, rgba(0,0,0,0) 65%)`,
              }}
            />
            {/* Fixed scrim behind the text — keeps title/tagline legible regardless of what's in the bottom of the photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <h2 className="font-[family-name:var(--font-brand)] text-3xl md:text-4xl uppercase tracking-wide text-white mb-2 leading-none">
                {studio.title}
              </h2>
              {studio.tagline && (
                <p className="font-[family-name:var(--font-body)] text-sm text-bms-grey-300 max-w-xs leading-relaxed mb-4">
                  {studio.tagline}
                </p>
              )}
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-accent group-hover:tracking-[0.18em] transition-all duration-300">
                {exploreLabel || 'Explore Studio →'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function StudiosCta({ s }: { s: Section }) {
  const hasBgImage = s.sectionBg?.bgType === 'image' && !!s.sectionBg?.bgImage?.asset?.url
  return (
    <section
      className="relative overflow-hidden bg-black py-24"
      style={s.sectionBg ? sectionBgStyle(s.sectionBg) : undefined}
    >
      {hasBgImage && (
        <>
          <Image
            src={s.sectionBg.bgImage.asset.url}
            alt={s.sectionBg.bgImage.alt || ''}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div className="scroll-catchup relative z-10 max-w-3xl mx-auto px-6 text-center">
        {s.heading && (
          <h2 className="font-[family-name:var(--font-brand)] text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-none mb-6 text-white">
            <SimpleRichText value={s.heading} />
          </h2>
        )}
        {s.text && (
          <p className="font-[family-name:var(--font-body)] text-bms-grey-400 text-base md:text-lg leading-relaxed mb-10">
            <SimpleRichText value={s.text} />
          </p>
        )}
        {s.buttons?.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {s.buttons.map((btn: CtaButton) =>
              btn.label && btn.url ? (
                <Button
                  key={btn._key}
                  variant="white"
                  size="lg"
                  href={btn.url}
                  className={btnSpacingClass(btn.topSpacing, btn.bottomSpacing)}
                >
                  {btn.label}
                </Button>
              ) : null,
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function StudiosPage() {
  const [studios, page] = await Promise.all([
    fetchSafe(STUDIOS_QUERY, {}, []),
    fetchSafe(STUDIOS_PAGE_QUERY, {}, null),
  ])

  // Pull section configs from Sanity if present (for heading/disabled control),
  // but the strips always render regardless — no need to add them in Studio first.
  const sections: Section[] = page?.sections ?? []
  const heroSection = sections.find((s) => s._type === 'studiosHero')
  const introSection = sections.find((s) => s._type === 'studiosIntro')
  const gridSection = sections.find((s) => s._type === 'studiosGrid')
  const highlightsSection = sections.find((s) => s._type === 'studiosHighlights')
  const btsSection = sections.find((s) => s._type === 'studiosBts')
  const latestSection = sections.find((s) => s._type === 'studiosLatestProjects')
  const ctaSection = sections.find((s) => s._type === 'studiosCta')

  // Highlights: managed entries (in curated order) + any other project marked
  // isHighlight on its own document but not yet added to the curated list —
  // same managed-plus-auto-fallback pattern used for BTS and Latest Projects.
  const highlights = (() => {
    const managed = ((highlightsSection?.highlights as any[] | undefined) ?? [])
      .filter((h) => h.enabled !== false)
      .map((h) => h.project)
      .filter(Boolean)

    const managedProjectIds = new Set<string>(managed.map((p: any) => p._id))
    const allHighlights = (highlightsSection?.allHighlights as any[] | undefined) ?? []
    const unmanaged = allHighlights.filter((p: any) => !managedProjectIds.has(p._id))

    return [...managed, ...unmanaged]
  })()

  // Build BTS images: managed entries (in array order) + unmanaged project BTS images appended
  const btsManaged = (btsSection?.btsImages as any[] | undefined) ?? []
  const allProjectBts = (btsSection?.allProjectBts as any[] | undefined) ?? []

  // Track which project IDs are already managed (to avoid duplicating them)
  const managedProjectIds = new Set<string>(
    btsManaged
      .filter((item: any) => item._type === 'projectBts' && item.project?._id)
      .map((item: any) => item.project._id)
  )

  // Resolve each managed item to a { _key, image, label, caption, projectTitle } shape
  type BtsImageItem = { _key: string; image: { asset: { url: string }; alt?: string }; label?: string; caption?: string; projectTitle?: string; clientName?: string; imageCaption?: string; projectSlug?: string }
  const resolvedManaged: BtsImageItem[] = btsManaged
    .filter((item: any) => {
      if (item._type === 'projectBts') return item.enabled !== false
      return true  // manualBts always shown
    })
    .flatMap((item: any): BtsImageItem[] => {
      if (item._type === 'projectBts') {
        const imgUrl = item.imageOverride?.asset?.url || item.project?.firstBtsImage?.asset?.url
        if (!imgUrl) return []
        return [{ _key: item._key, image: { asset: { url: imgUrl }, alt: item.imageOverride?.alt || item.project?.firstBtsImage?.alt || '' }, label: item.label || '', caption: item.caption || '', projectTitle: item.project?.title || '', clientName: item.project?.client?.name || '', imageCaption: item.imageOverride ? '' : (item.project?.firstBtsImage?.caption || ''), projectSlug: item.project?.slug?.current || '' }]
      }
      // manualBts
      if (!item.image?.asset?.url) return []
      return [{ _key: item._key, image: { asset: { url: item.image.asset.url }, alt: item.image.alt || '' }, label: item.label || '', caption: item.caption || '' }]
    })

  // Append unmanaged project BTS images (newest first — auto-display for any project not yet in the list)
  const unmanagedAuto: BtsImageItem[] = allProjectBts
    .filter((p: any) => !managedProjectIds.has(p._id) && p.firstBtsImage?.asset?.url)
    .map((p: any) => ({
      _key: `__auto__${p._id}`,
      image: { asset: { url: p.firstBtsImage.asset.url }, alt: p.firstBtsImage.alt || '' },
      label: '',
      caption: '',
      projectTitle: p.title || '',
      clientName: p.client?.name || '',
      imageCaption: p.firstBtsImage?.caption || '',
      projectSlug: p.slug?.current || '',
    }))

  const allBtsImages = [...resolvedManaged, ...unmanagedAuto]

  // Latest projects: managed entries (in curated order) + any other completed
  // projects not yet added to the curated list, newest first — same
  // managed-plus-auto-fallback pattern used for Behind the Scenes above.
  const latestProjects = (() => {
    const managed = ((latestSection?.latestProjects as any[] | undefined) ?? [])
      .filter((p) => p.enabled !== false)
      .map((p) => p.project)
      .filter(Boolean)

    const managedProjectIds = new Set<string>(managed.map((p: any) => p._id))
    const allLatest = (latestSection?.allLatestProjects as any[] | undefined) ?? []
    const unmanaged = allLatest.filter((p: any) => !managedProjectIds.has(p._id))

    return [...managed, ...unmanaged]
  })()

  // Build grid studio list — use configured cards (with overrides) or fall back to all studios
  type CardStudio = typeof studios[number]
  const gridStudios: CardStudio[] = (() => {
    const cards = gridSection?.cards
    if (Array.isArray(cards) && cards.length > 0) {
      return cards
        .filter((c: any) => c.studio?._id)
        .map((c: any) => ({
          _id: c.studio._id,
          title: c.studio.title,
          slug: c.studio.slug,
          tagline: c.taglineOverride || c.studio.tagline,
          heroImage: c.imageOverride?.asset?.url ? c.imageOverride : c.studio.heroImage,
          overlayOpacity: c.overlayOpacity ?? 70,
          overlayDirection: c.overlayDirection ?? 'to top right',
        }))
    }
    return studios
  })()

  // Respect the disabled flag when set from Sanity
  const gridDisabled = gridSection?.disabled === true
  const highlightsDisabled = highlightsSection?.disabled === true
  const btsDisabled = btsSection?.disabled === true
  const latestDisabled = latestSection?.disabled === true

  if (!page && !studios.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
          Studio page content has not been published yet. Open{' '}
          <strong>Sanity Studio → Website Pages → Studio Page</strong> to add sections.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Hero — from Sanity */}
      {heroSection && <StudiosHero s={heroSection} />}

      {/* Intro / page description — from Sanity */}
      {introSection && <StudiosIntro s={introSection} />}

      {/* Studios grid — uses configured cards with overrides, falls back to all studios */}
      {!gridDisabled && <StudiosGrid studios={gridStudios} sectionBg={gridSection?.sectionBg} exploreLabel={gridSection?.exploreLabel} />}

      {/* Highlights strip — sits between studio cards and BTS */}
      {!highlightsDisabled && (
        <StudiosHighlights
          s={highlightsSection ?? {}}
          projects={highlights}
        />
      )}

      {/* Behind the Scenes — always visible, config from Sanity when present */}
      {!btsDisabled && (
        <StudiosBts
          s={btsSection ?? {}}
          btsImages={allBtsImages}
        />
      )}

      {/* Latest projects strip — always visible, config from Sanity when present */}
      {!latestDisabled && (
        <StudiosLatestProjects
          s={latestSection ?? {}}
          projects={latestProjects}
        />
      )}

      {/* CTA — only if configured in Sanity */}
      {ctaSection && !ctaSection.disabled && <StudiosCta s={ctaSection} />}
    </div>
  )
}
