import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { SERVICES_PAGE_QUERY, SERVICE_CATEGORIES_QUERY } from "@/lib/sanity/queries";
import { Button } from "@/components/ui/Button";
import { btnSpacingClass } from "@/lib/buttonSpacing";
import { SimpleRichText } from "@/components/ui/SimpleRichText";
import { ServiceCategoriesGrid } from "@/components/ServiceCategoriesGrid";
import { ServiceCombinationsSection } from "@/components/ServiceCombinationsSection";
import { MissionReveal } from "@/components/MissionReveal";
import { HeroImageFrame } from "@/components/HeroImageFrame";
import { resolveBg, resolveTextClass } from "@/lib/sectionBackground";

export const revalidate = 60;

type Section = Record<string, any> & { _type: string; _key: string };
type CtaButton = { _key?: string; label?: string; url?: string; style?: string; topSpacing?: string; bottomSpacing?: string };
type ServiceCategory = {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  services: string[];
  image?: { asset?: { url: string }; alt?: string };
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(SERVICES_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "Services",
    description:
      page?.seoDescription ||
      "Explore the full range of services offered by Breeze Motion Studio.",
  };
}

function ServicesHero({ s }: { s: Section }) {
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
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide">
          {s.heading || "Services"}
        </h1>
      </div>
    </section>
  );
}

function ServicesIntro({ s }: { s: Section }) {
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

function ServicesCta({ s }: { s: Section }) {
  const bgImg = s.sectionBg?.bgType === 'image' ? s.sectionBg?.bgImage : s.bgImage
  const hasBgImage = !!bgImg?.asset?.url
  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} py-24`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {hasBgImage && (
        <>
          <img
            src={bgImg.asset.url}
            alt={bgImg.alt || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-[family-name:var(--font-brand)] text-3xl md:text-4xl uppercase tracking-wide mb-6">
          {s.heading || "Ready to work together?"}
        </h2>
        {s.text && (
          <p className="text-bms-grey-300 font-[family-name:var(--font-body)] text-lg mb-8">
            <SimpleRichText value={s.text} />
          </p>
        )}
        {s.buttons && s.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {s.buttons.map((btn: CtaButton) =>
              btn.label && btn.url ? (
                <Button key={btn._key} variant="white" size="lg" href={btn.url} className={btnSpacingClass(btn.topSpacing, btn.bottomSpacing)}>
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

export default async function ServicesPage() {
  const [page, categories] = await Promise.all([
    client.fetch(SERVICES_PAGE_QUERY).catch(() => null),
    client.fetch(SERVICE_CATEGORIES_QUERY).catch(() => []),
  ]);

  if (!page?.sections?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
          Services page content has not been published yet. Open{" "}
          <strong>Sanity Studio → Website Pages → Services Page</strong> to add content.
        </p>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section: Section) => {
        switch (section._type) {
          case "servicesHero":
            return <ServicesHero key={section._key} s={section} />;
          case "servicesIntro":
            return <ServicesIntro key={section._key} s={section} />;
          case "servicesCategories":
            return (
              <ServiceCategoriesGrid
                key={section._key}
                categories={(section.orderedCategories?.length ? section.orderedCategories : categories) as ServiceCategory[]}
                sectionBg={section.sectionBg}
                collageImages={section.collageImages}
                sectionTitle={section.sectionTitle}
                sectionTitleColor={section.sectionTitleColor}
                stripImage={section.stripImage}
                stripColor={section.stripColor}
                stripOpacity={section.stripOpacity}
                buttonLabel={section.buttonLabel}
                buttonUrl={section.buttonUrl}
              />
            );
          case "servicesStrip": {
            const stripBgImg = section.sectionBg?.bgType === 'image' ? section.sectionBg?.bgImage : section.bgImage
            return (
              <section
                key={section._key}
                className={`relative overflow-hidden bg-black py-20 ${resolveTextClass(section.sectionBg, section.bgColor)}`}
                style={resolveBg(section.sectionBg, section.bgColor)}
              >
                {stripBgImg?.asset?.url && (
                  <>
                    <img
                      src={stripBgImg.asset.url}
                      alt={stripBgImg.alt || ""}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/65" />
                  </>
                )}
<div className="scroll-catchup relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 items-start">
                  <div>
                    <h2 className="font-[family-name:var(--font-brand)] text-xl md:text-2xl uppercase tracking-wide text-white mb-6">
                      Services
                    </h2>
                  </div>
                  {section.text && <MissionReveal text={section.text} />}
                </div>
              </section>
            );
          }
          case "serviceCombinations":
            return (
              <ServiceCombinationsSection
                key={section._key}
                heading={section.heading}
                intro={section.intro}
                combinations={section.combinations}
                collageImages={section.collageImages}
                sectionBg={section.sectionBg}
              />
            );
          case "servicesCta":
            return <ServicesCta key={section._key} s={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
