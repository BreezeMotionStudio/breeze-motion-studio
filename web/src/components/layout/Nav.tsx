"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavLink = { label: string; href: string };
type NavCta = { label?: string; href?: string };
type Studio = { _id: string; title: string; slug: { current: string } };

type NavProps = {
  navLinks?: NavLink[];
  navCta?: NavCta;
  logoUrl?: string;
  studios?: Studio[];
};

const defaultLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/studios" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

const LOGO_SIZE = 44;

function ChevronDown() {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="ml-1 inline-block">
      <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Nav({ navLinks, navCta, logoUrl, studios = [] }: NavProps) {
  const [open, setOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const pathname = usePathname();

  const links = navLinks && navLinks.length > 0 ? navLinks : defaultLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-full overflow-hidden shrink-0 border border-[#2a2a2a]"
            style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          >
            <Image
              src={logoUrl ?? "/logo.png"}
              alt="Breeze Motion Studio"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className="w-full h-full object-cover"
              unoptimized={!logoUrl}
              priority
            />
          </div>
          <span className="font-[family-name:var(--font-brand)] text-white uppercase tracking-widest text-sm">
            Breeze Motion Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const isStudio = href === "/studios" && studios.length > 0;

            if (isStudio) {
              return (
                <div
                  key={href}
                  className="relative"
                  onMouseEnter={() => setStudioOpen(true)}
                  onMouseLeave={() => setStudioOpen(false)}
                >
                  {/* Trigger */}
                  <Link
                    href={href}
                    className={`font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest transition-colors flex items-center ${
                      active ? "text-white" : "text-bms-grey-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>

                  {/* Transparent bridge prevents gap-triggered close */}
                  <div className="absolute top-full left-0 w-full h-3" />

                  {/* Dropdown panel */}
                  <div
                    className={`absolute top-[calc(100%+12px)] left-0 transition-all duration-200 ${
                      studioOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
                    }`}
                  >
                    <div className="bg-black border border-[#2a2a2a] py-2 min-w-[180px]">
                      {studios.map((studio) => {
                        const studioActive = pathname === `/studios/${studio.slug.current}`;
                        return (
                          <Link
                            key={studio._id}
                            href={`/studios/${studio.slug.current}`}
                            onClick={() => setStudioOpen(false)}
                            className={`block px-5 py-2.5 font-[family-name:var(--font-functional)] text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap ${
                              studioActive
                                ? "text-white bg-white/5"
                                : "text-bms-grey-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {studio.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

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
              className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-center rounded-sm bg-white text-black px-4 py-2 hover:bg-gray-200 hover:scale-105 transition duration-200"
            >
              {navCta.label}
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden -mr-2.5 p-2.5 flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="flex flex-col justify-center gap-1.5 w-6 h-6">
            <span className={`block h-px bg-white transition-transform origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-px bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-white transition-transform origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-black border-t border-[#1a1a1a] px-6 py-8 flex flex-col gap-6">
          {links.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const isStudio = href === "/studios" && studios.length > 0;

            return (
              <div key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest transition-colors ${
                    active ? "text-white" : "text-bms-grey-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>

                {/* Studio sub-links in mobile */}
                {isStudio && (
                  <div className="mt-4 flex flex-col gap-4 pl-4 border-l border-[#2a2a2a]">
                    {studios.map((studio) => (
                      <Link
                        key={studio._id}
                        href={`/studios/${studio.slug.current}`}
                        onClick={() => setOpen(false)}
                        className={`font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest transition-colors ${
                          pathname === `/studios/${studio.slug.current}`
                            ? "text-white"
                            : "text-bms-grey-400 hover:text-white"
                        }`}
                      >
                        {studio.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {navCta?.label && navCta?.href && (
            <Link
              href={navCta.href}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest rounded-sm bg-white text-black px-4 py-3 text-center hover:bg-gray-200 hover:scale-105 transition duration-200"
            >
              {navCta.label}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
