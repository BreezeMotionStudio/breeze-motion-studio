import Link from "next/link";
import Image from "next/image";

type FooterLink = { label: string; href: string };
type SocialLink = { platform: string; url: string };

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 md:w-6 md:h-6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-6 md:h-6">
      <path d="M14 8.5h-1.2c-.6 0-.8.3-.8.9V11H14l-.3 2.5h-1.7V21h-3v-7.5H7V11h2V9.1C9 6.6 10.4 5 12.9 5H14v3.5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 md:w-6 md:h-6">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="7.5" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <line x1="7.5" y1="11" x2="7.5" y2="17" strokeLinecap="round" />
      <path d="M11 17v-4c0-1.5 1-2.5 2.3-2.5S16 11.5 16 13v4" strokeLinecap="round" />
    </svg>
  );
}

function SoundCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 md:w-6 md:h-6">
      <path d="M7 17h10a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 8 9.06 3 3 0 0 0 7 17z" strokeLinejoin="round" />
      <line x1="3" y1="13.5" x2="3" y2="17" strokeLinecap="round" />
      <line x1="5" y1="11.5" x2="5" y2="17" strokeLinecap="round" />
    </svg>
  );
}

function GenericSocialIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 md:w-6 md:h-6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" />
    </svg>
  );
}

function socialIconFor(platform: string) {
  const key = platform.trim().toLowerCase();
  if (key.includes("instagram")) return <InstagramIcon />;
  if (key.includes("facebook")) return <FacebookIcon />;
  if (key.includes("linkedin")) return <LinkedInIcon />;
  if (key.includes("soundcloud")) return <SoundCloudIcon />;
  return <GenericSocialIcon />;
}
type LogoSettings = {
  enabled?: boolean;
  sizePreset?: "small" | "medium" | "large";
  customSize?: number;
};

type FooterProps = {
  siteTitle?: string;
  tagline?: string;
  copyright?: string;
  email?: string;
  phone?: string;
  footerLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  plainLogo?: LogoSettings & { logoImage?: { asset?: { url: string } } };
  roundLogo?: LogoSettings & { logoImage?: { asset?: { url: string } } };
  footerLinksHeading?: string;
  footerContactHeading?: string;
  footerFollowHeading?: string;
};

const defaultFooterLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/studios" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

const PLAIN_PRESETS = { small: 28, medium: 44, large: 56 };
const ROUND_PRESETS = { small: 28, medium: 36, large: 48 };

function resolveSize(
  settings: LogoSettings | undefined,
  presets: Record<string, number>,
  fallback: number
): number {
  if (settings?.customSize) return settings.customSize;
  if (settings?.sizePreset) return presets[settings.sizePreset] ?? fallback;
  return fallback;
}

export default function Footer({
  siteTitle,
  tagline,
  copyright,
  email,
  phone,
  footerLinks,
  socialLinks,
  plainLogo,
  roundLogo,
  footerLinksHeading,
  footerContactHeading,
  footerFollowHeading,
}: FooterProps) {
  const links =
    footerLinks && footerLinks.length > 0 ? footerLinks : defaultFooterLinks;
  const year = new Date().getFullYear();
  const copyrightText =
    copyright || `© ${year} Breeze Motion Studio. All rights reserved.`;

  const showPlain = plainLogo ? plainLogo.enabled !== false : true;
  const showRound = roundLogo?.enabled === true;
  const plainSize = resolveSize(plainLogo, PLAIN_PRESETS, 44);
  const roundSize = resolveSize(roundLogo, ROUND_PRESETS, 36);

  return (
    <footer className="bg-black text-white border-t border-[#1a1a1a]">
      {/* Main footer body — 4 columns: Brand | Quick Links | Get In Touch | Follow */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-6 md:gap-10">

        {/* Col 1 — Brand */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-5 hover:opacity-80 transition-opacity">
            {showRound ? (
              <div
                className="rounded-full overflow-hidden border border-[#2a2a2a]"
                style={{ width: roundSize, height: roundSize }}
              >
                <Image
                  src={roundLogo?.logoImage?.asset?.url || "/logo-roundcrop.png"}
                  alt={siteTitle || "Breeze Motion Studio"}
                  width={roundSize}
                  height={roundSize}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : showPlain ? (
              <Image
                src={plainLogo?.logoImage?.asset?.url || "/logo.png"}
                alt={siteTitle || "Breeze Motion Studio"}
                width={plainSize}
                height={plainSize}
                style={{ height: plainSize, width: "auto" }}
                className="shrink-0"
              />
            ) : null}
          </Link>
          <p className="font-[family-name:var(--font-brand)] text-white uppercase tracking-widest text-sm mb-3">
            {siteTitle || "Breeze Motion Studio"}
          </p>
          {tagline && (
            <p className="font-[family-name:var(--font-body)] text-bms-grey-400 text-xs leading-relaxed">
              {tagline}
            </p>
          )}
        </div>

        {/* Col 2 — Quick Links */}
        <div className="hidden md:block text-center md:text-left">
          <h3 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-5">
            {footerLinksHeading || 'Quick Links'}
          </h3>
          <ul className="flex flex-col items-center md:items-start gap-3">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-[family-name:var(--font-functional)] text-sm text-bms-grey-300 hover:text-white transition-colors uppercase tracking-wide"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Get In Touch */}
        <div className="hidden md:block text-center md:text-left">
          <h3 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-5">
            {footerContactHeading || 'Get In Touch'}
          </h3>
          <ul className="flex flex-col items-center md:items-start gap-3">
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="font-[family-name:var(--font-body)] text-sm text-bms-grey-300 hover:text-white transition-colors"
                >
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a
                  href={`tel:${phone}`}
                  className="font-[family-name:var(--font-body)] text-sm text-bms-grey-300 hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Col 4 — Follow */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="text-center md:text-left">
            <h3 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-5">
              {footerFollowHeading || 'Follow'}
            </h3>
            <ul className="flex flex-row flex-wrap justify-center md:justify-start gap-4">
              {socialLinks.map(({ platform, url }) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="block text-white hover:opacity-70 transition-opacity duration-200"
                  >
                    {socialIconFor(platform)}
                  </a>
                </li>
              ))}
            </ul>
            {email && (
              <a
                href={`mailto:${email}`}
                className="md:hidden block mt-5 font-[family-name:var(--font-body)] text-sm text-bms-grey-300 hover:text-white transition-colors"
              >
                {email}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Copyright bar */}
      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-[family-name:var(--font-functional)] text-xs text-bms-grey-400">
            {copyrightText}
          </p>
          <p className="font-[family-name:var(--font-functional)] text-xs text-bms-grey-400">
            breezemotionstudio.com
          </p>
        </div>
      </div>
    </footer>
  );
}
