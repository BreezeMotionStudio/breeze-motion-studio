import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { ABOUT_PAGE_QUERY } from "@/lib/sanity/queries";
import PortableTextContent from "@/components/ui/PortableTextContent";

export const revalidate = 0;

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
    <section className="bg-black text-white py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
          {s.heading || "About"}
        </h1>
      </div>
    </section>
  );
}

function AboutIntro({ s }: { s: Section }) {
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

function AboutOverview({ s }: { s: Section }) {
  if (!s.overview && !s.mission) return null;
  return (
    <section className="bg-white text-black py-20">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        {s.overview && (
          <div>
            <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-6">
              The Studio
            </h2>
            <PortableTextContent value={s.overview} className="text-[#4B4B4B]" />
          </div>
        )}
        {s.mission && (
          <div>
            <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-6">
              Mission
            </h2>
            <PortableTextContent value={s.mission} className="text-[#4B4B4B]" />
          </div>
        )}
      </div>
    </section>
  );
}

function AboutFounder({ s }: { s: Section }) {
  if (!s.name) return null;
  return (
    <section className="bg-[#F5F5F5] text-black py-20">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
        {s.image?.asset?.url && (
          <div className="aspect-square overflow-hidden">
            <img
              src={s.image.asset.url}
              alt={s.image.alt || s.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-3 block">
            Founder
          </span>
          <h2 className="font-[family-name:var(--font-brand)] text-3xl uppercase tracking-wide mb-6">
            {s.name}
          </h2>
          {s.bio && <PortableTextContent value={s.bio} className="text-[#4B4B4B]" />}
        </div>
      </div>
    </section>
  );
}

function AboutValues({ s }: { s: Section }) {
  if (!s.values || s.values.length === 0) return null;
  return (
    <section className="bg-white text-black py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-12">
          Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {s.values.map((v: { _key?: string; title: string; description?: string }, i: number) => (
            <div key={v._key || i} className="border-t border-[#E6E6E6] pt-6">
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
  );
}

function AboutHowWeWork({ s }: { s: Section }) {
  if (!s.steps || s.steps.length === 0) return null;
  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-12">
          How We Work
        </h2>
        {s.intro && (
          <PortableTextContent
            value={s.intro}
            className="text-bms-grey-300 mb-12 max-w-2xl"
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {s.steps.map((step: { _key?: string; title: string; description?: string }, i: number) => (
            <div key={step._key || i}>
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
  );
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
          case "aboutFounder":
            return <AboutFounder key={section._key} s={section} />;
          case "aboutValues":
            return <AboutValues key={section._key} s={section} />;
          case "aboutHowWeWork":
            return <AboutHowWeWork key={section._key} s={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
