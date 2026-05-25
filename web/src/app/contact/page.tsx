import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import PortableTextContent from "@/components/ui/PortableTextContent";
import { sectionBgStyle, resolveBg, resolveTextClass } from "@/lib/sectionBackground";
import { Button } from "@/components/ui/Button";
import { HeroImageFrame } from "@/components/HeroImageFrame";

export const revalidate = 0;

type Section = Record<string, any> & { _type: string; _key: string };

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(CONTACT_PAGE_QUERY).catch(() => null);
  return {
    title: page?.seoTitle || "Contact",
    description:
      page?.seoDescription ||
      "Get in touch with Breeze Motion Studio. All projects start with a conversation.",
  };
}

function ContactHero({ s }: { s: Section }) {
  return (
    <section
      className={`relative overflow-hidden bg-black ${resolveTextClass(s.sectionBg, s.bgColor)} py-24 md:py-32`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <img src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <HeroImageFrame url={s.heroImage?.asset?.url} alt={s.heroImage?.alt} />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-brand)] text-3xl sm:text-5xl md:text-7xl uppercase tracking-wide">
          {s.heading || "Contact"}
        </h1>
      </div>
    </section>
  );
}

function ContactIntro({ s }: { s: Section }) {
  if (!s.content) return null;
  return (
    <section
      className={`relative overflow-hidden bg-white border-b border-[#E6E6E6] ${resolveTextClass(s.sectionBg, s.bgColor, true)}`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <img src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-14">
        <PortableTextContent
          value={s.content}
          className="text-[#4B4B4B] max-w-2xl [&_p]:text-[#4B4B4B] [&_p]:text-lg [&_p]:leading-relaxed"
        />
      </div>
    </section>
  );
}

function ContactDetailsForm({
  s,
  fallbackEmail,
  fallbackPhone,
}: {
  s: Section;
  fallbackEmail: string;
  fallbackPhone?: string;
}) {
  const email = s.email || fallbackEmail;
  const phone = s.phone || fallbackPhone;
  const formHeading = s.formHeading || "Send Us a Message";

  return (
    <section
      className={`relative overflow-hidden bg-white ${resolveTextClass(s.sectionBg, s.bgColor, true)} py-20`}
      style={resolveBg(s.sectionBg, s.bgColor)}
    >
      {s.sectionBg?.bgType === 'image' && s.sectionBg?.bgImage?.asset?.url && (
        <>
          <img src={s.sectionBg.bgImage.asset.url} alt={s.sectionBg.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16">
        <div>
          <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-black mb-8">
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
          {s.note && (
            <p className="font-[family-name:var(--font-body)] text-[#4B4B4B] text-base leading-relaxed mt-10 max-w-[260px]">
              {s.note}
            </p>
          )}
        </div>
        <div
          className="relative rounded-xl overflow-hidden p-8 md:p-10"
          style={s.formBg ? sectionBgStyle(s.formBg) : { backgroundColor: '#000000' }}
        >
          {s.formBg?.bgType === 'image' && s.formBg?.bgImage?.asset?.url && (
            <>
              <img src={s.formBg.bgImage.asset.url} alt={s.formBg.bgImage.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60" />
            </>
          )}
          <div className="relative z-10">
            <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-white mb-8">
              {formHeading}
            </h2>
            <form className="flex flex-col gap-5">
              <input
                type="text"
                placeholder={s.namePlaceholder || 'Your name'}
                className="w-full bg-transparent border border-white/30 text-white placeholder-white/70 px-4 py-3 focus:outline-none focus:border-white font-[family-name:var(--font-body)]"
              />
              <input
                type="email"
                placeholder={s.emailPlaceholder || 'Your email'}
                className="w-full bg-transparent border border-white/30 text-white placeholder-white/70 px-4 py-3 focus:outline-none focus:border-white font-[family-name:var(--font-body)]"
              />
              <input
                type="text"
                placeholder={s.companyPlaceholder || 'Company / Organisation (optional)'}
                className="w-full bg-transparent border border-white/30 text-white placeholder-white/70 px-4 py-3 focus:outline-none focus:border-white font-[family-name:var(--font-body)]"
              />
              <textarea
                placeholder={s.messagePlaceholder || 'Tell us about your project'}
                rows={6}
                className="w-full bg-transparent border border-white/30 text-white placeholder-white/70 px-4 py-3 focus:outline-none focus:border-white font-[family-name:var(--font-body)] resize-none"
              />
              <div>
                <Button type="submit" variant="white" size="lg">
                  {s.submitLabel || 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    client.fetch(CONTACT_PAGE_QUERY).catch(() => null),
    client.fetch(SITE_SETTINGS_QUERY).catch(() => null),
  ]);

  const fallbackEmail = settings?.contactEmail || "info@breezemotionstudio.com";
  const fallbackPhone = settings?.contactPhone;

  if (!page?.sections?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
          Contact page content has not been published yet. Open{" "}
          <strong>Sanity Studio → Website Pages → Contact Page</strong> to add content.
        </p>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section: Section) => {
        switch (section._type) {
          case "contactHero":
            return <ContactHero key={section._key} s={section} />;
          case "contactIntro":
            return <ContactIntro key={section._key} s={section} />;
          case "contactDetails":
            return (
              <ContactDetailsForm
                key={section._key}
                s={section}
                fallbackEmail={fallbackEmail}
                fallbackPhone={fallbackPhone}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
