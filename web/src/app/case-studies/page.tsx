import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { CASE_STUDIES_QUERY, CASE_STUDIES_PAGE_QUERY } from "@/lib/sanity/queries";
import { resolveBg, resolveTextClass, resolveIsLight } from "@/lib/sectionBackground";
import { SimpleRichText } from "@/components/ui/SimpleRichText";
import { Button } from "@/components/ui/Button";
import { btnSpacingClass } from "@/lib/buttonSpacing";

export const revalidate = 60;

type CtaButton = { _key?: string; label?: string; url?: string; style?: string; topSpacing?: string; bottomSpacing?: string };
type Section = Record<string, any> & { _type: string; _key: string };
type CaseStudy = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  year?: string;
  coverImage?: { asset?: { url: string }; alt?: string };
  client?: { name: string };
  studio?: { title: string; slug: { current: string } };
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(CASE_STUDIES_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "Case Studies",
    description:
      page?.seoDescription ||
      "Curated, narrative-driven deep dives into selected projects and client relationships.",
  };
}

function CaseStudiesHero({ s }: { s: Section }) {
  return (
    <section className="bg-black text-white py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide">
          {s.heading ? <SimpleRichText value={s.heading} /> : "Case Studies"}
        </h1>
      </div>
    </section>
  );
}

function CaseStudiesIntro({ s }: { s: Section }) {
  if (!s.text) return null;
  return (
    <section className="bg-white border-b border-[#E6E6E6]">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-14">
        <p className="text-[#4B4B4B] text-lg leading-relaxed max-w-2xl font-[family-name:var(--font-body)]">
          <SimpleRichText value={s.text} />
        </p>
      </div>
    </section>
  );
}

function CaseStudiesListings({ caseStudies, listingCtaLabel, sectionBg }: { caseStudies: CaseStudy[]; listingCtaLabel?: string; sectionBg?: Section }) {
  return (
    <section
      className={`bg-white py-20 ${resolveTextClass(sectionBg, undefined, true)}`}
      style={resolveBg(sectionBg)}
    >
      <div className="max-w-5xl mx-auto px-6">
        {caseStudies && caseStudies.length > 0 ? (
          <div className="divide-y divide-[#E6E6E6]">
            {caseStudies.map((cs) => (
              <Link
                key={cs._id}
                href={`/case-studies/${cs.slug?.current}`}
                className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 py-14"
              >
                <div>
                  <h2 className="font-[family-name:var(--font-brand)] text-2xl md:text-3xl uppercase tracking-wide mb-3">
                    {cs.title}
                  </h2>
                  <div className="flex flex-col gap-1">
                    {cs.client?.name && (
                      <span className="font-[family-name:var(--font-functional)] text-xs text-bms-grey-400 uppercase tracking-wide">
                        {cs.client.name}
                      </span>
                    )}
                    {cs.year && (
                      <span className="font-[family-name:var(--font-functional)] text-xs text-bms-grey-400 uppercase tracking-wide">
                        {cs.year}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-4">
                  {cs.coverImage?.asset?.url && (
                    <div className="aspect-[16/6] overflow-hidden rounded-sm">
                      <img
                        src={cs.coverImage.asset.url}
                        alt={cs.coverImage.alt || cs.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {cs.summary && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-bms-grey-400 leading-relaxed">
                      {cs.summary}
                    </p>
                  )}
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-black underline transition-colors duration-300 group-hover:text-black/60">
                    {listingCtaLabel || 'Read Case Study →'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
            Case studies will appear here once added in{" "}
            <strong>Sanity Studio → Content Library → Case Studies</strong>.
          </p>
        )}
      </div>
    </section>
  );
}

function CaseStudiesCta({ s }: { s: Section }) {
  const onDark = !resolveIsLight(s.sectionBg);
  const bgImg = s.sectionBg?.bgType === 'image' ? s.sectionBg?.bgImage : undefined;
  const hasBgImage = !!bgImg?.asset?.url;
  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg)} py-24`}
      style={hasBgImage ? {} : resolveBg(s.sectionBg)}
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
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {s.heading && (
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold mb-6"><SimpleRichText value={s.heading} /></h2>
        )}
        {s.text && (
          <p className="text-lg text-bms-grey-300 mb-10 font-[family-name:var(--font-body)]">
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

export default async function CaseStudiesPage() {
  const [caseStudies, page] = await Promise.all([
    client.fetch(CASE_STUDIES_QUERY).catch(() => []),
    client.fetch(CASE_STUDIES_PAGE_QUERY).catch(() => null),
  ]);

  if (!page?.sections?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
          Case Studies page content has not been published yet. Open{" "}
          <strong>Sanity Studio → Website Pages → Case Studies Page</strong> to add content.
        </p>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section: Section) => {
        switch (section._type) {
          case "caseStudiesHero":
            return <CaseStudiesHero key={section._key} s={section} />;
          case "caseStudiesIntro":
            return <CaseStudiesIntro key={section._key} s={section} />;
          default:
            return null;
        }
      })}
      {/* Listings always appear after sections */}
      <CaseStudiesListings caseStudies={caseStudies} listingCtaLabel={page?.listingCtaLabel} sectionBg={page?.listingSectionBg} />
      {/* Call to Action always appears at the very bottom, after the listings */}
      {page.sections
        .filter((section: Section) => section._type === "caseStudiesCta")
        .map((section: Section) => (
          <CaseStudiesCta key={section._key} s={section} />
        ))}
    </div>
  );
}
