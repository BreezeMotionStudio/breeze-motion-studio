import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import PortableTextContent from "@/components/ui/PortableTextContent";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(CONTACT_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "Contact",
    description:
      page?.seoDescription ||
      "Get in touch with Breeze Motion Studio. All projects start with a conversation.",
  };
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    client.fetch(CONTACT_PAGE_QUERY).catch(() => null),
    client.fetch(SITE_SETTINGS_QUERY).catch(() => null),
  ]);

  const email = page?.email || settings?.contactEmail || "info@breezemotionstudio.com";
  const phone = page?.phone || settings?.contactPhone;
  const heading = page?.heading || "Contact";
  const formHeading = page?.formHeading || "Send a Message";

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide mb-6">
            {heading}
          </h1>
          {page?.introText && (
            <PortableTextContent
              value={page.introText}
              className="text-bms-grey-300 max-w-xl [&_p]:text-bms-grey-300 [&_p]:text-lg [&_p]:leading-relaxed"
            />
          )}
        </div>
      </section>

      {/* Contact body */}
      <section className="bg-white text-black py-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">

          {/* Left — contact details */}
          <div>
            <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-8">
              Get In Touch
            </h2>
            <ul className="flex flex-col gap-5">
              <li>
                <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${email}`}
                  className="font-[family-name:var(--font-body)] text-base text-black hover:text-bms-accent transition-colors"
                >
                  {email}
                </a>
              </li>
              {phone && (
                <li>
                  <span className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 block mb-1">
                    Phone / WhatsApp
                  </span>
                  <a
                    href={`tel:${phone}`}
                    className="font-[family-name:var(--font-body)] text-base text-black hover:text-bms-accent transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Right — form */}
          <div>
            <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-8">
              {formHeading}
            </h2>
            <form className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-transparent border border-[#E6E6E6] text-black placeholder-bms-grey-400 px-4 py-3 focus:outline-none focus:border-black font-[family-name:var(--font-body)]"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent border border-[#E6E6E6] text-black placeholder-bms-grey-400 px-4 py-3 focus:outline-none focus:border-black font-[family-name:var(--font-body)]"
              />
              <input
                type="text"
                placeholder="Company / Organisation (optional)"
                className="w-full bg-transparent border border-[#E6E6E6] text-black placeholder-bms-grey-400 px-4 py-3 focus:outline-none focus:border-black font-[family-name:var(--font-body)]"
              />
              <textarea
                placeholder="Tell us about your project"
                rows={6}
                className="w-full bg-transparent border border-[#E6E6E6] text-black placeholder-bms-grey-400 px-4 py-3 focus:outline-none focus:border-black font-[family-name:var(--font-body)] resize-none"
              />
              <div>
                <button
                  type="submit"
                  className="px-10 py-4 bg-black text-white font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest hover:bg-bms-accent transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
