import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { SERVICES_PAGE_QUERY, SERVICE_CATEGORIES_QUERY } from "@/lib/sanity/queries";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(SERVICES_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "Services",
    description:
      page?.seoDescription ||
      "Explore the full range of services offered by Breeze Motion Studio.",
  };
}

type ServiceCategory = {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  services: string[];
};

type CtaButton = {
  label?: string;
  url?: string;
  style?: string;
};

export default async function ServicesPage() {
  const [page, categories] = await Promise.all([
    client.fetch(SERVICES_PAGE_QUERY).catch(() => null),
    client.fetch(SERVICE_CATEGORIES_QUERY).catch(() => []),
  ]);

  const cta: CtaButton | undefined = page?.ctaButton;

  return (
    <div>
      {/* — Hero — */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
            {page?.heading || "Services"}
          </h1>
        </div>
      </section>

      {/* — Intro text — */}
      {page?.introText && (
        <section className="bg-white border-b border-[#E6E6E6]">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-14">
            <p className="text-[#4B4B4B] text-lg leading-relaxed max-w-2xl font-[family-name:var(--font-body)]">
              {page.introText}
            </p>
          </div>
        </section>
      )}

      {/* — Service Categories — */}
      {categories && categories.length > 0 ? (
        <section className="bg-white text-black py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="divide-y divide-[#E6E6E6]">
              {categories.map((category: ServiceCategory, index: number) => (
                <div
                  key={category._id}
                  className="py-16 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16"
                >
                  {/* Left: category title + number */}
                  <div>
                    <span className="block font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-[#535D66] mb-3">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-[family-name:var(--font-brand)] text-2xl md:text-3xl uppercase tracking-wide">
                      {category.title}
                    </h2>
                  </div>

                  {/* Right: description + services list */}
                  <div>
                    <p className="font-[family-name:var(--font-body)] text-base text-[#4B4B4B] mb-8 leading-relaxed">
                      {category.shortDescription}
                    </p>
                    {category.services && category.services.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        {category.services.map((service: string) => (
                          <li
                            key={service}
                            className="flex items-start gap-3 font-[family-name:var(--font-functional)] text-sm text-black"
                          >
                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-[#535D66] shrink-0" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white text-black py-24">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-[#999999] font-[family-name:var(--font-body)]">
              Service listings will appear here once added in the CMS under{" "}
              <strong>Content Library → Service Categories</strong>.
            </p>
          </div>
        </section>
      )}

      {/* — CTA — */}
      <section className="bg-black text-white py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-brand)] text-3xl md:text-4xl uppercase tracking-wide mb-6">
            {page?.ctaHeading || "Ready to work together?"}
          </h2>
          {page?.ctaText && (
            <p className="text-bms-grey-300 font-[family-name:var(--font-body)] text-lg mb-10">
              {page.ctaText}
            </p>
          )}
          <a
            href={cta?.url || "/contact"}
            className="inline-block px-10 py-4 border border-white text-white font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            {cta?.label || "Get In Touch"}
          </a>
        </div>
      </section>
    </div>
  );
}
