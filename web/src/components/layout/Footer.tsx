import Link from "next/link";
import Image from "next/image";

type FooterLink = { label: string; href: string };
type SocialLink = { platform: string; url: string };
type LogoSettings = {
  enabled?: boolean;
  sizePreset?: "small" | "medium" | "large";
  customSize?: number;
};

type FooterProps = {
  tagline?: string;
  copyright?: string;
  email?: string;
  phone?: string;
  footerLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  plainLogo?: LogoSettings;
  roundLogo?: LogoSettings;
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
  tagline,
  copyright,
  email,
  phone,
  footerLinks,
  socialLinks,
  plainLogo,
  roundLogo,
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
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">

        {/* Col 1 — Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3 mb-5 hover:opacity-80 transition-opacity">
            {showPlain && (
              <Image
                src="/logo.png"
                alt="Breeze Motion Studio"
                width={plainSize}
                height={plainSize}
                style={{ height: plainSize, width: "auto" }}
                className="shrink-0"
              />
            )}
            {showRound && (
              <div
                className="rounded-full overflow-hidden shrink-0 border border-[#2a2a2a]"
                style={{ width: roundSize, height: roundSize }}
              >
                <Image
                  src="/logo-roundcrop.png"
                  alt="Breeze Motion Studio"
                  width={roundSize}
                  height={roundSize}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </Link>
          <p className="font-[family-name:var(--font-brand)] text-white uppercase tracking-widest text-sm mb-3">
            Breeze Motion Studio
          </p>
          {tagline && (
            <p className="font-[family-name:var(--font-body)] text-bms-grey-400 text-sm leading-relaxed max-w-xs">
              {tagline}
            </p>
          )}
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h3 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-5">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3">
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
        <div>
          <h3 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-5">
            Get In Touch
          </h3>
          <ul className="flex flex-col gap-3">
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
          <div>
            <h3 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-5">
              Follow
            </h3>
            <ul className="flex flex-col gap-3">
              {socialLinks.map(({ platform, url }) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-functional)] text-sm text-bms-grey-300 hover:text-white transition-colors uppercase tracking-wide"
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
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
