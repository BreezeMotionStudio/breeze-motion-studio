import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { CASE_STUDIES_QUERY, CASE_STUDIES_PAGE_QUERY } from "@/lib/sanity/queries";

export const revalidate = 0;

type Section = Record<string, any> & { _type: string; _key: string };
type CaseStudy = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  industry?: string;
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
        <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
          {s.heading || "Case Studies"}
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
          {s.text}
        </p>
      </div>
    </section>
  );
}

function CaseStudiesListings({ caseStudies }: { caseStudies: CaseStudy[] }) {
  return (
    <section className="bg-white text-black py-20">
      <div className="max-w-5xl mx-auto px-6">
        {caseStudies && caseStudies.length > 0 ? (
          <div className="divide-y divide-[#E6E6E6]">
            {caseStudies.map((cs, index) => (
              <Link
                key={cs._id}
                href={`/case-studies/${cs.slug?.current}`}
                className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 py-14 hover:bg-[#F9F9F9] transition-colors px-2 -mx-2"
              >
                <div>
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-3">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-[family-name:var(--font-brand)] text-2xl md:text-3xl uppercase tracking-wide group-hover:text-bms-accent transition-colors mb-3">
                    {cs.title}
                  </h2>
                  <div className="flex flex-col gap-1">
                    {cs.client?.name && (
                      <span className="font-[family-name:var(--font-functional)] text-xs text-bms-grey-400 uppercase tracking-wide">
                        {cs.client.name}
                      </span>
                    )}
                    {cs.industry && (
                      <span className="font-[family-name:var(--font-functional)] text-xs text-bms-grey-400 uppercase tracking-wide">
                        {cs.industry}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-4">
                  {cs.coverImage?.asset?.url && (
                    <div className="aspect-[16/6] overflow-hidden">
                      <img
                        src={cs.coverImage.asset.url}
                        alt={cs.coverImage.alt || cs.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {cs.summary && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B] leading-relaxed">
                      {cs.summary}
                    </p>
                  )}
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-accent">
                    Read Case Study →
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
      <CaseStudiesListings caseStudies={caseStudies} />
    </div>
  );
}
