import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { STUDIOS_QUERY } from "@/lib/sanity/queries";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Studio",
  description: "Explore our specialized studios — Machine Studio, Commercial Studio, Creative Studio, and Media Systems.",
};

type Studio = {
  _id: string;
  title: string;
  slug: { current: string };
  tagline?: string;
  purpose?: string;
  heroImage?: { asset?: { url: string }; alt?: string };
};

export default async function StudiosPage() {
  const studios = await client.fetch(STUDIOS_QUERY).catch(() => []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
            Studio
          </h1>
        </div>
      </section>

      {/* Studios grid */}
      <section className="bg-white text-black py-20">
        <div className="max-w-5xl mx-auto px-6">
          {studios && studios.length > 0 ? (
            <div className="divide-y divide-[#E6E6E6]">
              {studios.map((studio: Studio, index: number) => (
                <Link
                  key={studio._id}
                  href={`/studios/${studio.slug?.current}`}
                  className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 py-14 hover:bg-[#F9F9F9] transition-colors px-2 -mx-2"
                >
                  {/* Left — number + title */}
                  <div>
                    <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-3">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-[family-name:var(--font-brand)] text-2xl md:text-3xl uppercase tracking-wide group-hover:text-bms-accent transition-colors">
                      {studio.title}
                    </h2>
                  </div>

                  {/* Right — cover image + purpose */}
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
    </div>
  );
}
