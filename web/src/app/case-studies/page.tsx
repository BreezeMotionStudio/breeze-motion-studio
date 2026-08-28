import type { Metadata } from "next";
import Image from "next/image";
import { fetchSafe } from "@/lib/sanity/fetchSafe";
import { CASE_STUDIES_QUERY, CASE_STUDIES_PAGE_QUERY, MORE_CASE_STUDIES_QUERY } from "@/lib/sanity/queries";
import { resolveBg, resolveTextClass, resolveIsLight } from "@/lib/sectionBackground";
import { SimpleRichText } from "@/components/ui/SimpleRichText";
import { Button } from "@/components/ui/Button";
import { btnSpacingClass } from "@/lib/buttonSpacing";
import { HeroImageFrame } from "@/components/HeroImageFrame";
import { MoreCaseStudies } from "@/components/MoreCaseStudies";
import { CaseStudyPdfButton } from "@/components/CaseStudyPdfButton";
import { buildMetadata } from "@/lib/openGraph";
import { focalYToObjectPosition } from "@/lib/sanity/image";

export const revalidate = 60;

type CtaButton = { _key?: string; label?: string; url?: string; style?: string; topSpacing?: string; bottomSpacing?: string };
type Section = Record<string, any> & { _type: string; _key: string };
type CaseStudy = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  year?: string;
  coverImage?: { asset?: { url: string }; alt?: string; focalY?: number };
  client?: { name: string };
  studio?: { title: string; slug: { current: string } };
  caseStudyPdf?: { asset?: { url: string; originalFilename?: string } };
  caseStudyPdfPreview?: { asset?: { url: string }; alt?: string };
};
type MoreCaseStudy = {
  _id: string;
  title: string;
  caseStudyPdf?: { asset?: { url: string; originalFilename?: string } };
  caseStudyPdfPreview?: { asset?: { url: string }; alt?: string };
};
type MoreCaseStudyItem = {
  _id: string;
  title: string;
  previewUrl: string;
  previewAlt?: string;
  pdfUrl: string;
  filename?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSafe(CASE_STUDIES_PAGE_QUERY, {}, null);
  const hero = page?.sections?.find((s: Section) => s._type === "caseStudiesHero");
  return buildMetadata({
    title: page?.seoTitle || "Case Studies",
    description:
      page?.seoDescription ||
      "Curated, narrative-driven deep dives into selected projects and client relationships.",
    path: "/case-studies",
    imageUrl: hero?.heroImage?.asset?.url,
    imageAlt: hero?.heroImage?.alt,
  });
}

function CaseStudiesHero({ s }: { s: Section }) {
  return (
    <section className="relative overflow-hidden bg-black text-white py-24 md:py-32">
      <HeroImageFrame url={s.heroImage?.asset?.url} alt={s.heroImage?.alt} overlay={false} />
      <div className="hero-catchup relative z-10 max-w-5xl mx-auto px-6">
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
        <p className="text-[#4B4B4B] text-base md:text-lg leading-relaxed max-w-2xl font-[family-name:var(--font-body)]">
          <SimpleRichText value={s.text} />
        </p>
      </div>
    </section>
  );
}

function CaseStudiesListings({ caseStudies, listingKickerLabel, listingCtaLabel, listingViewProjectLabel, listingSectionTitle, sectionBg, moreCaseStudies, viewMoreLabel }: { caseStudies: CaseStudy[]; listingKickerLabel?: string; listingCtaLabel?: string; listingViewProjectLabel?: string; listingSectionTitle?: string; sectionBg?: Section; moreCaseStudies: MoreCaseStudyItem[]; viewMoreLabel?: string }) {
  return (
    <section
      className={`bg-white py-20 ${resolveTextClass(sectionBg, undefined, true)}`}
      style={resolveBg(sectionBg)}
    >
      <div className="max-w-5xl mx-auto px-6">
        {caseStudies && caseStudies.length > 0 && (
          <h2 className="font-[family-name:var(--font-brand)] text-2xl md:text-3xl uppercase tracking-wide text-center mb-12">
            {listingSectionTitle || 'Featured Case Studies'}
          </h2>
        )}
        {caseStudies && caseStudies.length > 0 ? (
          <div className="flex flex-col gap-8">
            {caseStudies.map((cs) => {
              const pdfUrl = cs.caseStudyPdf?.asset?.url
              const previewUrl = cs.caseStudyPdfPreview?.asset?.url
              const hasPdf = !!(pdfUrl && previewUrl)
              return (
                <div
                  key={cs._id}
                  className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-lg transition-transform duration-300 ease-out hover:scale-[1.02]"
                >
                  <div>
                    <span className="block font-[family-name:var(--font-functional)] text-xs text-[#535D66] uppercase tracking-widest mb-2">
                      {listingKickerLabel || 'Case Study'}
                    </span>
                    <h2 className="font-[family-name:var(--font-brand)] text-2xl md:text-3xl uppercase tracking-wide mb-3 text-black">
                      {cs.title}
                    </h2>
                    <div className="flex flex-col gap-1">
                      {cs.client?.name && (
                        <span className="font-[family-name:var(--font-functional)] text-xs text-[#4B4B4B] uppercase tracking-wide">
                          {cs.client.name}
                        </span>
                      )}
                      {cs.year && (
                        <span className="font-[family-name:var(--font-functional)] text-xs text-[#4B4B4B] uppercase tracking-wide">
                          {cs.year}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-4">
                    {cs.coverImage?.asset?.url && (
                      <div className="relative aspect-[16/6] overflow-hidden rounded-xl">
                        <Image
                          src={cs.coverImage.asset.url}
                          alt={cs.coverImage.alt || cs.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ objectPosition: focalYToObjectPosition(cs.coverImage.focalY) }}
                          sizes="(min-width: 768px) 66vw, 100vw"
                        />
                      </div>
                    )}
                    {cs.summary && (
                      <p className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B] leading-relaxed">
                        {cs.summary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {hasPdf && (
                        <CaseStudyPdfButton
                          previewUrl={previewUrl!}
                          previewAlt={cs.caseStudyPdfPreview?.alt}
                          pdfUrl={pdfUrl!}
                          filename={cs.caseStudyPdf?.asset?.originalFilename}
                          label={listingCtaLabel || 'View Case Study'}
                          variant="black"
                          size="md"
                        />
                      )}
                      <Button variant="black" href={`/projects/${cs.slug?.current}`}>
                        {listingViewProjectLabel || 'View Project'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
            Case studies will appear here once added in{" "}
            <strong>Sanity Studio → Content Library → Case Studies</strong>.
          </p>
        )}
        <MoreCaseStudies items={moreCaseStudies} buttonLabel={viewMoreLabel} />
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
          <Image
            src={bgImg.asset.url}
            alt={bgImg.alt || ''}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
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

export default async function CaseStudiesPage() {
  const [caseStudies, page, moreCaseStudiesRaw] = await Promise.all([
    fetchSafe(CASE_STUDIES_QUERY, {}, []),
    fetchSafe(CASE_STUDIES_PAGE_QUERY, {}, null),
    fetchSafe(MORE_CASE_STUDIES_QUERY, {}, []),
  ]);

  const moreCaseStudies = (moreCaseStudiesRaw as MoreCaseStudy[])
    .filter((cs) => cs.caseStudyPdf?.asset?.url && cs.caseStudyPdfPreview?.asset?.url)
    .map((cs) => ({
      _id: cs._id,
      title: cs.title,
      previewUrl: cs.caseStudyPdfPreview!.asset!.url,
      previewAlt: cs.caseStudyPdfPreview?.alt,
      pdfUrl: cs.caseStudyPdf!.asset!.url,
      filename: cs.caseStudyPdf?.asset?.originalFilename,
    }));

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
      <CaseStudiesListings
        caseStudies={caseStudies}
        listingKickerLabel={page?.listingKickerLabel}
        listingCtaLabel={page?.listingCtaLabel}
        listingViewProjectLabel={page?.listingViewProjectLabel}
        listingSectionTitle={page?.listingSectionTitle}
        sectionBg={page?.listingSectionBg}
        moreCaseStudies={moreCaseStudies}
        viewMoreLabel={page?.viewMoreLabel}
      />
      {/* Call to Action always appears at the very bottom, after the listings */}
      {page.sections
        .filter((section: Section) => section._type === "caseStudiesCta")
        .map((section: Section) => (
          <CaseStudiesCta key={section._key} s={section} />
        ))}
    </div>
  );
}
