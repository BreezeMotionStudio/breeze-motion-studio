import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { CASE_STUDY_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import PortableTextContent from "@/components/ui/PortableTextContent";
import { notFound } from "next/navigation";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await client.fetch(CASE_STUDY_BY_SLUG_QUERY, { slug }).catch(() => null);
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: cs.seoTitle || cs.title,
    description: cs.seoDescription || cs.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await client.fetch(CASE_STUDY_BY_SLUG_QUERY, { slug }).catch(() => null);

  if (!cs) return notFound();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-black text-white py-24 md:py-40 overflow-hidden">
        {cs.coverImage?.asset?.url && (
          <img
            src={cs.coverImage.asset.url}
            alt={cs.coverImage.alt || cs.title}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {cs.client?.name && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 border border-[#333] px-3 py-1">
                {cs.client.name}
              </span>
            )}
            {cs.industry && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 border border-[#333] px-3 py-1">
                {cs.industry}
              </span>
            )}
            {cs.studio?.title && (
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-accent border border-bms-accent px-3 py-1">
                {cs.studio.title}
              </span>
            )}
          </div>
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
            {cs.title}
          </h1>
        </div>
      </section>

      {/* Summary + Cover image */}
      {(cs.summary || cs.coverImage?.asset?.url) && (
        <section className="bg-white text-black py-16">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {cs.summary && (
              <p className="font-[family-name:var(--font-body)] text-lg text-[#4B4B4B] leading-relaxed">
                {cs.summary}
              </p>
            )}
            {cs.coverImage?.asset?.url && (
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={cs.coverImage.asset.url}
                  alt={cs.coverImage.alt || cs.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main body content */}
      {cs.body && (
        <section className="bg-white text-black pb-16">
          <div className="max-w-3xl mx-auto px-6">
            <PortableTextContent value={cs.body} className="text-[#4B4B4B]" />
          </div>
        </section>
      )}

      {/* Gallery */}
      {cs.gallery && cs.gallery.length > 0 && (
        <section className="bg-[#F5F5F5] py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-10">
              Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cs.gallery.map((img: any, i: number) => (
                <div key={i} className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.asset?.url}
                    alt={img.alt || `Gallery image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {cs.testimonial?.quote && (
        <section className="bg-black text-white py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <blockquote>
              <p className="font-[family-name:var(--font-body)] text-xl italic text-bms-grey-200 mb-6 leading-relaxed">
                &ldquo;{cs.testimonial.quote}&rdquo;
              </p>
              <footer className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400">
                — {cs.testimonial.attribution}
                {cs.testimonial.role && `, ${cs.testimonial.role}`}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="bg-white border-t border-[#E6E6E6] py-8">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/case-studies"
            className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 hover:text-black transition-colors"
          >
            ← All Case Studies
          </Link>
        </div>
      </div>
    </div>
  );
}
