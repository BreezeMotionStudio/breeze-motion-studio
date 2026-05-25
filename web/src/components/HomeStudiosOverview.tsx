'use client'

import {useState, useCallback} from 'react'
import {StudioCard} from '@/components/StudioCard'
import {Button} from '@/components/ui/Button'
import {btnSpacingClass} from '@/lib/buttonSpacing'
import {getBgStyle, getTextClass, isLightBg} from '@/lib/sectionColors'
import {SimpleRichText} from '@/components/ui/SimpleRichText'

type CtaButton = {_key?: string; label?: string; url?: string; style?: string; topSpacing?: string; bottomSpacing?: string}
type Section = Record<string, any> & {_type: string; _key: string}

// ─── enter timing ────────────────────────────────────────────────
// stem:        0ms delay, 250ms → done at 250ms
// arms:      200ms delay, 300ms → done at 500ms
// drops:     500ms delay, 200ms → drops start exactly when arms finish → done at 700ms
//
// ─── exit timing (300ms hover buffer, strict sequencing) ─────────
// drops:     300ms delay, 200ms → done at 500ms
// arms:      500ms delay, 300ms → arms start exactly when drops finish → done at 800ms
// stem:      750ms delay, 250ms → done at 1000ms

function lineStyle(hovered: boolean, enterDelay: number, exitDelay: number, duration: number): React.CSSProperties {
  return {
    strokeDasharray: 1,
    strokeDashoffset: hovered ? 0 : 1,
    transition: `stroke-dashoffset ${duration}ms ease-out ${hovered ? enterDelay : exitDelay}ms`,
  }
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    let id: string | null = null
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1)
    else if (u.hostname.includes('youtube.com')) id = u.searchParams.get('v') || u.pathname.split('/').pop() || null
    if (!id) return null
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&iv_load_policy=3`
  } catch {
    return null
  }
}

function SectionBg({videoUrl, image}: {videoUrl?: string; image?: {asset?: {url: string}; alt?: string}}) {
  if (videoUrl) {
    const ytEmbed = getYouTubeEmbedUrl(videoUrl)
    return (
      <>
        {ytEmbed ? (
          <iframe className="absolute inset-0 w-full h-full pointer-events-none" style={{border: 0, transform: 'scale(1.5)', transformOrigin: 'center'}} src={ytEmbed} allow="autoplay; encrypted-media" allowFullScreen={false} />
        ) : (
          <video className="absolute inset-0 w-full h-full object-cover" src={videoUrl} autoPlay muted loop playsInline />
        )}
        <div className="absolute inset-0 bg-black/55" />
      </>
    )
  }
  if (image?.asset?.url) {
    return (
      <>
        <img className="absolute inset-0 w-full h-full object-cover" src={image.asset.url} alt={image.alt || ''} />
        <div className="absolute inset-0 bg-black/55" />
      </>
    )
  }
  return null
}

export function HomeStudiosOverview({s, studios}: {s: Section; studios: any[]}) {
  const [hovered, setHovered] = useState(false)

  const handleEnter = useCallback(() => {
    setHovered(true)
  }, [])

  const handleLeave = useCallback(() => {
    setHovered(false)
  }, [])

  const cardMediaMap: Record<string, {cardImage?: any; cardVideoUrl?: string}> = {}
  if (s.studioCards) {
    for (const card of s.studioCards) {
      if (card.studioId) cardMediaMap[card.studioId] = card
    }
  }
  const onDark = !isLightBg(s.bgColor)

  return (
    <section
      className={`relative overflow-hidden bg-bms-dark-500 ${getTextClass(s.bgColor)} py-24`}
      style={getBgStyle(s.bgColor)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} />
      <div className="scroll-catchup relative z-10 max-w-6xl mx-auto px-6">
        {s.heading && (
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold mb-4 text-center">{s.heading}</h2>
        )}
        {s.description && (
          <p className="text-base md:text-lg text-bms-grey-300 font-[family-name:var(--font-body)] text-center max-w-2xl mx-auto mb-8">
            <SimpleRichText value={s.description} />
          </p>
        )}

        {s.parentLogo?.asset?.url ? (
          <div className="flex flex-col items-center mt-6">
            <a href="/studios" className={`block w-40 h-40 overflow-hidden bg-[#111111] border border-white/15 flex items-center justify-center transition-transform duration-300 hover:scale-105${s.parentLogo.roundCrop ? ' rounded-full' : ' rounded-lg'}`}>
              <img src={s.parentLogo.asset.url} alt={s.parentLogo.alt || ''} className="w-full h-full object-cover" />
            </a>
            {/* Connector tree — desktop only */}
            <div className="w-full hidden lg:block">
              <svg viewBox="0 0 1000 96" preserveAspectRatio="none" className="w-full" style={{height: '96px', overflow: 'visible'}} fill="none">
                {/* Stem */}
                <line x1="500" y1="10" x2="500" y2="48" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" pathLength="1"
                  style={lineStyle(hovered, 0, 750, 250)} />
                {/* Left branch — arm + drop as one path, rounded corner */}
                <path d="M 500 48 L 157 48 L 157 82" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1"
                  style={lineStyle(hovered, 200, 500, 500)} />
                {/* Center drop */}
                <line x1="500" y1="48" x2="500" y2="82" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" pathLength="1"
                  style={lineStyle(hovered, 500, 300, 200)} />
                {/* Right branch — arm + drop as one path, rounded corner */}
                <path d="M 500 48 L 843 48 L 843 82" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1"
                  style={lineStyle(hovered, 200, 500, 500)} />
              </svg>
            </div>
            <div className="lg:hidden h-10 w-px bg-[#999999]/40 mt-4 mb-8" />
          </div>
        ) : (
          <div className="flex flex-col items-center mb-10">
            <svg width="56" height="16" viewBox="0 0 56 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="2,2 28,14 54,2" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {!s.description && !s.heading && !s.parentLogo?.asset?.url && <div className="mb-12" />}

        {studios && studios.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {studios.map((studio: any) => {
              const cardMedia = cardMediaMap[studio._id] || {}
              const videoUrl = cardMedia.cardVideoUrl || studio.heroVideoUrl
              const image = cardMedia.cardImage || studio.heroImage
              return (
                <div key={studio._id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
                  <StudioCard
                    href={`/studios/${studio.slug?.current}`}
                    title={studio.title}
                    purpose={studio.purpose}
                    videoUrl={videoUrl}
                    image={image}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-bms-grey-400">
            Studios will appear here once added in the CMS.
          </p>
        )}
        {s.buttons && s.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            {s.buttons.map((btn: CtaButton) =>
              btn.label && btn.url ? (
                <Button key={btn._key} variant={onDark ? 'white' : 'black'} href={btn.url} className={btnSpacingClass(btn.topSpacing, btn.bottomSpacing)}>
                  {btn.label}
                </Button>
              ) : null
            )}
          </div>
        )}
      </div>
    </section>
  )
}
