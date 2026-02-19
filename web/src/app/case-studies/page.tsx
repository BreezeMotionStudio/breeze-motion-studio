import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { CASE_STUDIES_QUERY } from "@/lib/sanity/queries";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Curated, narrative-driven deep dives into selected projects and client relationships.",
};

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

export default async function CaseStudiesPage() {
  const caseStudies = await client.fetch(CASE_STUDIES_QUERY).catch(() => []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
            Case Studies
          </h1>
        </div>
      </section>

      {/* Listings */}
      <section className="bg-white text-black py-20">
        <div className="max-w-5xl mx-auto px-6">
          {caseStudies && caseStudies.length > 0 ? (
            <div className="divide-y divide-[#E6E6E6]">
              {caseStudies.map((cs: CaseStudy, index: number) => (
                <Link
                  key={cs._id}
                  href={`/case-studies/${cs.slug?.current}`}
                  className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 py-14 hover:bg-[#F9F9F9] transition-colors px-2 -mx-2"
                >
                  {/* Left — number + meta */}
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

                  {/* Right — image + summary */}
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
              <strong>Sanity Studio → Website Pages → Case Studies</strong>.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
