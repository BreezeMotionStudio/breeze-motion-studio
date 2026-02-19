import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { SERVICES_PAGE_QUERY, SERVICE_CATEGORIES_QUERY } from "@/lib/sanity/queries";

export const revalidate = 0;

type Section = Record<string, any> & { _type: string; _key: string };
type CtaButton = { _key?: string; label?: string; url?: string; style?: string };
type ServiceCategory = {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  services: string[];
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(SERVICES_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "Services",
    description:
      page?.seoDescription ||
      "Explore the full range of services offered by Breeze Motion Studio.",
  };
}

function ServicesHero({ s }: { s: Section }) {
  return (
    <section className="bg-black text-white py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide">
          {s.heading || "Services"}
        </h1>
      </div>
    </section>
  );
}

function ServicesIntro({ s }: { s: Section }) {
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

function ServicesCategories({
  categories,
}: {
  categories: ServiceCategory[];
}) {
  if (!categories || categories.length === 0) {
    return (
      <section className="bg-white text-black py-24">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#999999] font-[family-name:var(--font-body)]">
            Service listings will appear here once added in the CMS under{" "}
            <strong>Content Library → Service Categories</strong>.
          </p>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-white text-black py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="divide-y divide-[#E6E6E6]">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="py-16 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16"
            >
              <div>
                <span className="block font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-[#535D66] mb-3">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-[family-name:var(--font-brand)] text-2xl md:text-3xl uppercase tracking-wide">
                  {category.title}
                </h2>
              </div>
              <div>
                <p className="font-[family-name:var(--font-body)] text-base text-[#4B4B4B] mb-8 leading-relaxed">
                  {category.shortDescription}
                </p>
                {category.services && category.services.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {category.services.map((service) => (
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
  );
}

function ServicesCta({ s }: { s: Section }) {
  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-[family-name:var(--font-brand)] text-3xl md:text-4xl uppercase tracking-wide mb-6">
          {s.heading || "Ready to work together?"}
        </h2>
        {s.text && (
          <p className="text-bms-grey-300 font-[family-name:var(--font-body)] text-lg mb-10">
            {s.text}
          </p>
        )}
        {s.buttons && s.buttons.length > 0 ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {s.buttons.map((btn: CtaButton) => {
              const isPrimary = btn.style === "primary";
              return (
                <a
                  key={btn._key}
                  href={btn.url || "/contact"}
                  className={`inline-block px-10 py-4 rounded-sm font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest transition-colors ${
                    isPrimary
                      ? "bg-white text-black hover:bg-bms-grey-200"
                      : "border border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {btn.label}
                </a>
              );
            })}
          </div>
        ) : (
          <a
            href="/contact"
            className="inline-block px-10 py-4 rounded-sm border border-white text-white font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Get In Touch
          </a>
        )}
      </div>
    </section>
  );
}

export default async function ServicesPage() {
  const [page, categories] = await Promise.all([
    client.fetch(SERVICES_PAGE_QUERY).catch(() => null),
    client.fetch(SERVICE_CATEGORIES_QUERY).catch(() => []),
  ]);

  if (!page?.sections?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
          Services page content has not been published yet. Open{" "}
          <strong>Sanity Studio → Website Pages → Services Page</strong> to add content.
        </p>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section: Section) => {
        switch (section._type) {
          case "servicesHero":
            return <ServicesHero key={section._key} s={section} />;
          case "servicesIntro":
            return <ServicesIntro key={section._key} s={section} />;
          case "servicesCategories":
            return <ServicesCategories key={section._key} categories={categories} />;
          case "servicesCta":
            return <ServicesCta key={section._key} s={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
