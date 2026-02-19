import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { ABOUT_PAGE_QUERY } from "@/lib/sanity/queries";
import PortableTextContent from "@/components/ui/PortableTextContent";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(ABOUT_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "About",
    description:
      page?.seoDescription ||
      "Learn about Breeze Motion Studio — a fully remote, founder-led multi-media production and digital systems studio.",
  };
}

export default async function AboutPage() {
  const page = await client.fetch(ABOUT_PAGE_QUERY).catch(() => null);

  if (!page) {
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
      {/* Hero */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
            {page.heading || "About"}
          </h1>
        </div>
      </section>

      {/* Intro text */}
      {page.introText && (
        <section className="bg-white border-b border-[#E6E6E6]">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-14">
            <p className="text-[#4B4B4B] text-lg leading-relaxed max-w-2xl font-[family-name:var(--font-body)]">
              {page.introText}
            </p>
          </div>
        </section>
      )}

      {/* Studio Overview + Mission */}
      {(page.studioOverview || page.mission) && (
        <section className="bg-white text-black py-20">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
            {page.studioOverview && (
              <div>
                <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-6">
                  The Studio
                </h2>
                <PortableTextContent value={page.studioOverview} className="text-[#4B4B4B]" />
              </div>
            )}
            {page.mission && (
              <div>
                <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-6">
                  Mission
                </h2>
                <PortableTextContent value={page.mission} className="text-[#4B4B4B]" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Founder */}
      {page.founderName && (
        <section className="bg-[#F5F5F5] text-black py-20">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
            {page.founderImage?.asset?.url && (
              <div className="aspect-square overflow-hidden">
                <img
                  src={page.founderImage.asset.url}
                  alt={page.founderImage.alt || page.founderName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-3 block">
                Founder
              </span>
              <h2 className="font-[family-name:var(--font-brand)] text-3xl uppercase tracking-wide mb-6">
                {page.founderName}
              </h2>
              {page.founderBio && (
                <PortableTextContent value={page.founderBio} className="text-[#4B4B4B]" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {page.values && page.values.length > 0 && (
        <section className="bg-white text-black py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-12">
              Core Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.values.map((v: { title: string; description?: string }, i: number) => (
                <div key={i} className="border-t border-[#E6E6E6] pt-6">
                  <h3 className="font-[family-name:var(--font-brand)] text-lg uppercase tracking-wide mb-3">
                    {v.title}
                  </h3>
                  {v.description && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B] leading-relaxed">
                      {v.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How We Work */}
      {page.howWeWorkSteps && page.howWeWorkSteps.length > 0 && (
        <section className="bg-black text-white py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-12">
              How We Work
            </h2>
            {page.howWeWorkIntro && (
              <PortableTextContent value={page.howWeWorkIntro} className="text-bms-grey-300 mb-12 max-w-2xl" />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.howWeWorkSteps.map((step: { title: string; description?: string }, i: number) => (
                <div key={i}>
                  <span className="font-[family-name:var(--font-brand)] text-3xl text-bms-accent mb-4 block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest font-bold mb-3">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-bms-grey-400 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
