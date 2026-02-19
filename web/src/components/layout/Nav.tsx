"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavLink = { label: string; href: string };
type NavCta = { label?: string; href?: string };
type LogoSettings = {
  enabled?: boolean;
  sizePreset?: "small" | "medium" | "large";
  customSize?: number;
};

type NavProps = {
  navLinks?: NavLink[];
  navCta?: NavCta;
  plainLogo?: LogoSettings;
  roundLogo?: LogoSettings;
};

const defaultLinks: NavLink[] = [
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

export default function Nav({ navLinks, navCta, plainLogo, roundLogo }: NavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = navLinks && navLinks.length > 0 ? navLinks : defaultLinks;

  // Logo visibility — plain logo shows by default if no settings configured
  const showPlain = plainLogo ? plainLogo.enabled !== false : true;
  const showRound = roundLogo?.enabled === true;

  const plainSize = resolveSize(plainLogo, PLAIN_PRESETS, 56);
  const roundSize = resolveSize(roundLogo, ROUND_PRESETS, 36);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          onClick={() => setOpen(false)}
        >
          {/* Plain logo */}
          {showPlain && (
            <Image
              src="/logo.png"
              alt="Breeze Motion Studio"
              width={plainSize}
              height={plainSize}
              style={{ height: plainSize, width: "auto" }}
              className="shrink-0"
              priority
            />
          )}

          {/* Round crop logo */}
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
                priority
              />
            </div>
          )}

          <span className="font-[family-name:var(--font-brand)] text-white uppercase tracking-widest text-sm">
            Breeze Motion Studio
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest transition-colors ${
                  active ? "text-white" : "text-bms-grey-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {navCta?.label && navCta?.href && (
            <Link
              href={navCta.href}
              className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest border border-[#535D66] text-white px-4 py-2 hover:bg-[#535D66] transition-colors"
            >
              {navCta.label}
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-6 h-6"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className={`block h-px bg-white transition-transform origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-px bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px bg-white transition-transform origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-black border-t border-[#1a1a1a] px-6 py-8 flex flex-col gap-6">
          {links.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest transition-colors ${
                  active ? "text-white" : "text-bms-grey-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {navCta?.label && navCta?.href && (
            <Link
              href={navCta.href}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest text-white border border-[#535D66] px-4 py-3 text-center hover:bg-[#535D66] transition-colors"
            >
              {navCta.label}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
