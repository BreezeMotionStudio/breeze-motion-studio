import type { Metadata } from "next";
import { sectionBgStyle as cardBgStyleFn, resolveBg, resolveTextClass } from "@/lib/sectionBackground";
import { client } from "@/lib/sanity/client";
import { ABOUT_PAGE_QUERY } from "@/lib/sanity/queries";
import PortableTextContent from "@/components/ui/PortableTextContent";
import { SimpleRichText } from "@/components/ui/SimpleRichText";
import { CoreValuesSection } from "@/components/CoreValuesSection";
import { HeroImageFrame } from "@/components/HeroImageFrame";
import { AboutMission } from "@/components/AboutMission";
import { Button } from "@/components/ui/Button";
import { btnSpacingClass } from "@/lib/buttonSpacing";

export const revalidate = 60;

type Section = Record<string, any> & { _type: string; _key: string };

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(ABOUT_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "About",
    description:
      page?.seoDescription ||
      "Learn about Breeze Motion Studio — a fully remote, founder-led multi-media production and digital systems studio.",
  };
}

function AboutHero({ s }: { s: Section }) {
  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} py-24 md:py-32`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <img src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <HeroImageFrame url={s.heroImage?.asset?.url} alt={s.heroImage?.alt} />
      <div className="scroll-catchup relative z-10 max-w-5xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide leading-none">
          {s.heading ? <SimpleRichText value={s.heading} /> : "About"}
        </h1>
      </div>
    </section>
  );
}

function AboutIntro({ s }: { s: Section }) {
  if (!s.text) return null;
  return (
    <section
      className={`relative overflow-hidden bg-white border-b border-[#E6E6E6] ${resolveTextClass(s.sectionBg, s.bgColor, true)}`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <img src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-14">
        <p className="text-[#4B4B4B] text-lg leading-relaxed max-w-2xl font-[family-name:var(--font-body)]">
          <SimpleRichText value={s.text} />
        </p>
      </div>
    </section>
  );
}

const cardBgStyle = cardBgStyleFn

function AboutOverview({ s }: { s: Section }) {
  if (!s.overview && !s.mission) return null;
  return (
    <section
      className={`relative overflow-hidden bg-white ${resolveTextClass(s.sectionBg, s.bgColor, true)} py-20`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <img src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:items-stretch">
          {s.mission && (
            <div className="scroll-catchup h-full">
              <div className="relative flex flex-col text-center transition-transform duration-500 ease-out hover:scale-[1.02] h-full">
              <div className="absolute -inset-y-8 -inset-x-7 -z-10 rounded-xl overflow-hidden" style={cardBgStyle(s.founderCard)}>
                {s.founderCard?.bgType === 'image' && s.founderCard?.bgImage?.asset?.url && (
                  <img src={s.founderCard.bgImage.asset.url} alt={s.founderCard.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <h2 className="font-[family-name:var(--font-brand)] text-xl md:text-2xl uppercase tracking-wide text-white mb-6">
                {s.founderHeading ? <SimpleRichText value={s.founderHeading} /> : 'The Founder'}
              </h2>
              {s.founderImage?.asset?.url && (
                <div className="w-full aspect-[3/1] overflow-hidden rounded-sm mb-8">
                  <img
                    src={s.founderImage.asset.url}
                    alt={s.founderImage.alt || 'Founder'}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.05]"
                  />
                </div>
              )}
              <PortableTextContent value={s.mission} className="text-white" />
              {s.founderImage2?.asset?.url && (
                <div className="flex justify-center my-8">
                  <div className="w-56 h-56 rounded-full overflow-hidden transition-transform duration-700 ease-out hover:scale-[1.08]">
                    <img
                      src={s.founderImage2.asset.url}
                      alt={s.founderImage2.alt || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              {s.missionPart2 && (
                <PortableTextContent value={s.missionPart2} className="text-white mt-auto" />
              )}
              </div>
            </div>
          )}
          {s.overview && (
            <div className="scroll-catchup h-full" style={{ transitionDelay: '300ms' }}>
              <div className="relative flex flex-col text-center transition-transform duration-500 ease-out hover:scale-[1.02] h-full">
              <div className="absolute -inset-y-8 -inset-x-7 -z-10 rounded-xl overflow-hidden" style={cardBgStyle(s.studioCard)}>
                {s.studioCard?.bgType === 'image' && s.studioCard?.bgImage?.asset?.url && (
                  <img src={s.studioCard.bgImage.asset.url} alt={s.studioCard.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <h2 className="font-[family-name:var(--font-brand)] text-xl md:text-2xl uppercase tracking-wide text-white mb-6">
                {s.studioHeading ? <SimpleRichText value={s.studioHeading} /> : 'The Studio'}
              </h2>
              {s.studioImage?.asset?.url && (
                <div className="w-full aspect-[3/1] overflow-hidden rounded-sm mb-8">
                  <img
                    src={s.studioImage.asset.url}
                    alt={s.studioImage.alt || ''}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.05]"
                  />
                </div>
              )}
              <PortableTextContent value={s.overview} className="text-white" />
              </div>
            </div>
          )}
        </div>
        {s.overviewImage?.asset?.url && (
          <div className="scroll-catchup -mx-7 mt-20">
            <img
              src={`${s.overviewImage.asset.url}?auto=format&q=80`}
              alt={s.overviewImage.alt || ''}
              className="w-full h-auto rounded-sm transition-transform duration-700 ease-out hover:scale-[1.08]"
              loading="eager"
              decoding="async"
            />
          </div>
        )}
      </div>
    </section>
  );
}



function AboutValues({ s }: { s: Section }) {
  if (!s.values || s.values.length === 0) return null;
  return <CoreValuesSection values={s.values} bgColor={s.bgColor} sectionBg={s.sectionBg} heading={s.heading} />;
}

function AboutHowWeWork({ s }: { s: Section }) {
  if (!s.steps || s.steps.length === 0) return null;
  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} py-20`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <img src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div className="scroll-catchup relative z-10 max-w-5xl mx-auto px-6">
        <h2 className="font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest text-bms-grey-400 mb-12">
          {s.heading ? <SimpleRichText value={s.heading} /> : 'How We Work'}
        </h2>
        {s.intro && (
          <PortableTextContent
            value={s.intro}
            className="text-bms-grey-300 mb-12 max-w-2xl"
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {s.steps.map((step: { _key?: string; title: any; description?: string }, i: number) => (
            <div key={step._key || i}>
              <span className="font-[family-name:var(--font-brand)] text-3xl text-bms-accent mb-4 block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-[family-name:var(--font-functional)] text-base uppercase tracking-widest font-bold mb-3">
                <SimpleRichText value={step.title} />
              </h3>
              {step.description && (
                <p className="font-[family-name:var(--font-body)] text-sm text-bms-grey-400 leading-relaxed">
                  <SimpleRichText value={step.description} />
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutCta({ s }: { s: Section }) {
  const bgImg = s.sectionBg?.bgType === 'image' ? s.sectionBg?.bgImage : s.bgImage
  const hasBgImage = !!bgImg?.asset?.url
  return (
    <section
      className={`relative overflow-hidden py-24 ${resolveTextClass(s.sectionBg, s.bgColor)} ${!s.sectionBg?.bgType && !s.bgColor ? 'bg-[#2A3137]' : ''}`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {hasBgImage && (
        <>
          <img
            src={`${bgImg.asset.url}?w=1920&auto=format&q=80`}
            alt={bgImg.alt || ''}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
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
          <p className="font-[family-name:var(--font-body)] text-bms-grey-400 text-lg leading-relaxed mb-10">
            <SimpleRichText value={s.text} />
          </p>
        )}
        {s.buttons?.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {s.buttons.map((btn: { _key: string; label?: string; url?: string; style?: string; topSpacing?: string; bottomSpacing?: string }) => (
              <Button
                key={btn._key}
                href={btn.url}
                variant="white"
                className={btnSpacingClass(btn.topSpacing, btn.bottomSpacing)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default async function AboutPage() {
  const page = await client.fetch(ABOUT_PAGE_QUERY).catch(() => null);

  if (!page?.sections?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
          About page content has not been published yet. Open{" "}
          <strong>Sanity Studio → Website Pages → About Page</strong> to add content.
        </p>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section: Section) => {
        switch (section._type) {
          case "aboutHero":
            return <AboutHero key={section._key} s={section} />;
          case "aboutIntro":
            return <AboutIntro key={section._key} s={section} />;
          case "aboutOverview":
            return <AboutOverview key={section._key} s={section} />;

          case "aboutMission":
            return <AboutMission key={section._key} s={section} />;
          case "aboutValues":
            return <AboutValues key={section._key} s={section} />;
          case "aboutHowWeWork":
            return <AboutHowWeWork key={section._key} s={section} />;
          case "aboutCta":
            return <AboutCta key={section._key} s={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
