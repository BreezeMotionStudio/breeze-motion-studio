import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { STUDIOS_QUERY, STUDIOS_PAGE_QUERY } from "@/lib/sanity/queries";

export const revalidate = 0;

type Section = Record<string, any> & { _type: string; _key: string };
type Studio = {
  _id: string;
  title: string;
  slug: { current: string };
  tagline?: string;
  purpose?: string;
  heroImage?: { asset?: { url: string }; alt?: string };
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(STUDIOS_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "Studio",
    description:
      page?.seoDescription ||
      "Explore our specialized studios — Machine Studio, Commercial Studio, Creative Studio, and Media Systems.",
  };
}

function StudiosHero({ s }: { s: Section }) {
  return (
    <section className="bg-black text-white py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
          {s.heading || "Studio"}
        </h1>
      </div>
    </section>
  );
}

function StudiosIntro({ s }: { s: Section }) {
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

function StudiosGridSection({ studios }: { studios: Studio[] }) {
  return (
    <section className="bg-white text-black py-20">
      <div className="max-w-5xl mx-auto px-6">
        {studios && studios.length > 0 ? (
          <div className="divide-y divide-[#E6E6E6]">
            {studios.map((studio, index) => (
              <Link
                key={studio._id}
                href={`/studios/${studio.slug?.current}`}
                className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 py-14 hover:bg-[#F9F9F9] transition-colors px-2 -mx-2"
              >
                <div>
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-3">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-[family-name:var(--font-brand)] text-2xl md:text-3xl uppercase tracking-wide group-hover:text-bms-accent transition-colors">
                    {studio.title}
                  </h2>
                </div>
                <div className="flex flex-col justify-center gap-4">
                  {studio.heroImage?.asset?.url && (
                    <div className="aspect-[16/6] overflow-hidden">
                      <img
                        src={studio.heroImage.asset.url}
                        alt={studio.heroImage.alt || studio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {studio.purpose && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B] leading-relaxed">
                      {studio.purpose}
                    </p>
                  )}
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-accent">
                    View Studio →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
            Studios will appear here once added in{" "}
            <strong>Sanity Studio → Content Library → Studios</strong>.
          </p>
        )}
      </div>
    </section>
  );
}

export default async function StudiosPage() {
  const [studios, page] = await Promise.all([
    client.fetch(STUDIOS_QUERY).catch(() => []),
    client.fetch(STUDIOS_PAGE_QUERY).catch(() => null),
  ]);

  if (!page?.sections?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
          Studio page content has not been published yet. Open{" "}
          <strong>Sanity Studio → Website Pages → Studio Page</strong> to add content.
        </p>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section: Section) => {
        switch (section._type) {
          case "studiosHero":
            return <StudiosHero key={section._key} s={section} />;
          case "studiosIntro":
            return <StudiosIntro key={section._key} s={section} />;
          case "studiosGrid":
            return <StudiosGridSection key={section._key} studios={studios} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
