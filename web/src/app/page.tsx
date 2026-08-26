import Image from "next/image";
import { fetchSafe } from "@/lib/sanity/fetchSafe";
import {
  HOME_PAGE_QUERY,
  FEATURED_PROJECTS_QUERY,
  STUDIOS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";
import { StudioCard } from "@/components/StudioCard";
import { HomeStudiosOverview } from "@/components/HomeStudiosOverview";
import { SimpleRichText } from "@/components/ui/SimpleRichText";
import { HowWeWorkSection } from "@/components/HowWeWorkSection";
import { HomeTestimonials } from "@/components/HomeTestimonials";
import { HomeClientLogos } from "@/components/HomeClientLogos";
import { AboutSlideshow } from "@/components/AboutSlideshow";
import { resolveBg, resolveTextClass, resolveIsLight } from "@/lib/sectionBackground";
import { Button } from "@/components/ui/Button";
import { btnSpacingClass } from "@/lib/buttonSpacing";

type CtaButton = { _key?: string; label?: string; url?: string; style?: string; topSpacing?: string; bottomSpacing?: string };
type BgImage = { asset?: { url: string }; alt?: string };
type Section = Record<string, any> & { _type: string; _key: string };

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v") || u.pathname.split("/").pop() || null;
    }
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&iv_load_policy=3`;
  } catch {
    return null;
  }
}

/**
 * RULE: Use this component for every main/featured YouTube video on the site.
 * The iframe is shifted up 62px and the container clips it with overflow-hidden,
 * so YouTube's title bar (title, copy-link, playlist) is never visible.
 * The section above should have relative z-10 and the section containing this
 * should have -mt-[62px] so the transition is seamless.
 */
function YouTubeShowcase({ src }: { src: string }) {
  return (
    <div className="w-full aspect-video relative overflow-hidden">
      <iframe
        className="absolute left-0 w-full"
        style={{ border: 0, display: "block", outline: "none", top: "-62px", height: "calc(100% + 62px)" }}
        src={src}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function SectionBg({ videoUrl, image, priority = false }: { videoUrl?: string; image?: BgImage; priority?: boolean }) {
  if (videoUrl) {
    const ytEmbed = getYouTubeEmbedUrl(videoUrl);
    return (
      <>
        {ytEmbed ? (
          <iframe
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ border: 0, transform: "scale(1.5)", transformOrigin: "center" }}
            src={ytEmbed}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
          />
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
      </>
    );
  }
  if (image?.asset?.url) {
    return (
      <>
        <Image
          className="object-cover"
          src={image.asset.url}
          alt={image.alt || ""}
          fill
          sizes="100vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-black/55" />
      </>
    );
  }
  return null;
}

function HomeHero({ s, wordmarkUrl }: { s: Section; wordmarkUrl?: string }) {
  const onDark = !resolveIsLight(s.sectionBg, s.bgColor)
  return (
    <section
      className={`relative z-10 flex items-center justify-center min-h-[85svh] sm:min-h-screen bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} overflow-hidden`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} priority />
      {(s.title || s.subtitle || s.buttons?.length > 0) && (
        <div className="hero-catchup relative z-10 text-center max-w-4xl min-w-0 px-6">
          {s.title && (
            wordmarkUrl ? (
              <h1 className="mb-10 flex justify-center">
                <Image
                  src={wordmarkUrl}
                  alt="Breeze Motion Studio"
                  width={6973}
                  height={438}
                  className="w-full h-auto"
                  style={{ maxWidth: "min(100%, 850px)" }}
                  sizes="(min-width: 1024px) 850px, 90vw"
                  priority
                />
              </h1>
            ) : (
              <h1 className="font-[family-name:var(--font-brand)] text-[clamp(1.1rem,6vw,4.5rem)] uppercase tracking-wide whitespace-nowrap mb-10">
                <SimpleRichText value={s.title} />
              </h1>
            )
          )}
          {s.subtitle && !s.subtitleDisabled && (
            <div className="relative mb-10">
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: "-60px -80px",
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 40%, transparent 70%)",
                }}
              />
              <p className="relative text-lg md:text-xl text-bms-grey-300 font-[family-name:var(--font-body)]">
                <SimpleRichText value={s.subtitle} />
              </p>
            </div>
          )}
          {s.buttons && s.buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      )}
    </section>
  );
}

function HomeFeaturedWork({ s, projects }: { s: Section; projects: any[] }) {
  const hasMedia = !!(s.videoUrl || s.bgImage?.asset?.url);
  const ytEmbed = s.videoUrl ? getYouTubeEmbedUrl(s.videoUrl) : null;
  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} -mt-[62px]`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.videoUrl && (
        ytEmbed ? (
          <YouTubeShowcase src={ytEmbed} />
        ) : (
          <video
            className="w-full aspect-video object-cover"
            src={s.videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        )
      )}
      {!s.videoUrl && s.bgImage?.asset?.url && (
        <div className="relative w-full aspect-video">
          <Image className="object-cover" src={s.bgImage.asset.url} alt={s.bgImage.alt || ""} fill sizes="100vw" />
        </div>
      )}
      {projects && projects.length > 0 && (
        <div className={`scroll-catchup relative z-10 max-w-6xl mx-auto px-6 py-24 ${hasMedia ? "" : "pt-24"}`}>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold mb-12 text-center text-white">
            {s.heading ? <SimpleRichText value={s.heading} /> : 'Featured Work'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <a
                key={project._id}
                href={`/studios/${project.studio?.slug?.current}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] bg-bms-dark-500 mb-4 overflow-hidden">
                  {project.coverImage?.asset?.url && (
                    <Image
                      src={project.coverImage.asset.url}
                      alt={project.coverImage.alt || project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  )}
                </div>
                <h3 className="text-lg font-[family-name:var(--font-functional)] font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-sm text-bms-grey-400">
                  {project.client?.name}{" "}
                  {project.studio?.title && `— ${project.studio.title}`}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}


function splitTextAtFounder(text: string): [string, string] {
  const marker = 'Founded and operated by Rebekah-Breeze Johnson';
  const idx = text.indexOf(marker);
  if (idx !== -1) return [text.slice(0, idx).trim(), text.slice(idx).trim()];
  // Fallback: split at nearest sentence boundary to midpoint
  const mid = Math.floor(text.length / 2);
  const after = text.indexOf('. ', mid);
  const before = text.lastIndexOf('. ', mid);
  let cut: number;
  if (after === -1 && before === -1) cut = mid;
  else if (after === -1) cut = before + 2;
  else if (before === -1) cut = after + 2;
  else cut = (after - mid < mid - before ? after : before) + 2;
  return [text.slice(0, cut).trim(), text.slice(cut).trim()];
}

const ABOUT_ASPECT_CLASS: Record<string, string> = {
  '1:1':  'aspect-square',
  '2:3':  'aspect-[2/3]',
  '9:16': 'aspect-[9/16]',
}

function plainTextFromRichText(value: any): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .map((block: any) => (block.children || []).map((c: any) => c.text || '').join(''))
    .join(' ')
    .trim()
}

function HomeAbout({ s, logoUrl }: { s: Section; logoUrl?: string }) {
  const onDark = !resolveIsLight(s.sectionBg, s.bgColor)
  const aspectClass = ABOUT_ASPECT_CLASS[s.imageAspectRatio ?? '1:1'] ?? 'aspect-square'
  const headingText = plainTextFromRichText(s.heading)
  const [headingFirstWord, ...headingRestWords] = headingText.split(' ')
  const headingRest = headingRestWords.join(' ')
  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} py-24`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} />
      <div className="scroll-catchup relative z-10 max-w-6xl mx-auto px-6">
        {s.heading && (
          <h2 className="font-[family-name:var(--font-brand)] text-xl sm:text-3xl md:text-4xl uppercase tracking-wide mb-10 text-center">
            <span className="block">{headingFirstWord}</span>
            {headingRest && <span className="block">{headingRest}</span>}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8 items-center">
          {/* Left slideshow */}
          <div className={`group hidden md:block ${aspectClass} overflow-hidden rounded-sm`}>
            <AboutSlideshow images={s.imageLeftSlides} side="left" />
          </div>

          {/* Centre text */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-6 w-full pb-8">
              <hr className="flex-grow border-t border-white/15" />
              <div
                className="relative shrink-0 rounded-full overflow-hidden aspect-square"
                style={{ width: s.logoMaxWidth ? `${s.logoMaxWidth}px` : '256px' }}
              >
                <Image
                  src={logoUrl ?? '/logo.png'}
                  alt="Breeze Motion Studio"
                  fill
                  className="object-cover"
                  sizes={s.logoMaxWidth ? `${s.logoMaxWidth}px` : '256px'}
                />
              </div>
              <hr className="flex-grow border-t border-white/15" />
            </div>

            {s.text && (
              <p className="text-base md:text-lg text-bms-grey-300 font-[family-name:var(--font-body)] leading-relaxed">
                <SimpleRichText value={s.text} />
              </p>
            )}

            {s.buttons && s.buttons.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
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

          {/* Right slideshow */}
          <div className={`group hidden md:block ${aspectClass} overflow-hidden rounded-sm`}>
            <AboutSlideshow images={s.imageRightSlides} side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeCta({ s }: { s: Section }) {
  const onDark = !resolveIsLight(s.sectionBg, s.bgColor)
  return (
    <section
      className={`relative overflow-hidden bg-bms-dark-400 ${resolveTextClass(s.sectionBg, s.bgColor)} py-24`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {s.heading && (
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold mb-6"><SimpleRichText value={s.heading} /></h2>
        )}
        {s.text && (
          <p className="text-base md:text-lg text-bms-grey-300 mb-10 font-[family-name:var(--font-body)]">
            <SimpleRichText value={s.text} />
          </p>
        )}
        {s.buttons && s.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
  );
}

export const revalidate = 60;

export default async function HomePage() {
  const [page, featuredProjects, studios, settings] = await Promise.all([
    fetchSafe(HOME_PAGE_QUERY, {}, null),
    fetchSafe(FEATURED_PROJECTS_QUERY, {}, []),
    fetchSafe(STUDIOS_QUERY, {}, []),
    fetchSafe(SITE_SETTINGS_QUERY, {}, null),
  ]);
  const logoUrl = settings?.primaryLogo?.asset?.url;
  const wordmarkWhiteUrl = settings?.wordmarkWhite?.asset?.url;

  if (!page?.sections?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center max-w-2xl px-6">
          <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide mb-6">
            Breeze Motion Studio
          </h1>
          <p className="text-lg text-bms-grey-400 mb-4">
            Homepage content has not been published yet.
          </p>
          <p className="text-sm text-bms-grey-400">
            Open <strong>Sanity Studio → Website Pages → Home Page</strong>, add sections, and
            publish.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section: Section) => {
        switch (section._type) {
          case "homeHero":
            return <HomeHero key={section._key} s={section} wordmarkUrl={wordmarkWhiteUrl} />;
          case "homeFeaturedWork":
            return <HomeFeaturedWork key={section._key} s={section} projects={featuredProjects} />;
          case "homeAbout":
            return <HomeAbout key={section._key} s={section} logoUrl={logoUrl} />;
          case "homeStudiosOverview":
            return <HomeStudiosOverview key={section._key} s={section} studios={studios} logoUrl={logoUrl} />;
          case "homeHowWeWork":
            return <HowWeWorkSection key={section._key} s={section as any} />;
          case "homeTestimonials":
            return <HomeTestimonials key={section._key} s={section} testimonials={section.testimonials ?? []} />;
          case "homeClientLogos":
            return <HomeClientLogos key={section._key} s={section} />;
          case "homeCta":
            return <HomeCta key={section._key} s={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
