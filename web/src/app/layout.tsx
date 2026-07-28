import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { ScrollObserver } from "@/components/ScrollObserver";
import { fetchSafe } from "@/lib/sanity/fetchSafe";
import { SITE_SETTINGS_QUERY, STUDIOS_QUERY } from "@/lib/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSafe(SITE_SETTINGS_QUERY, {}, null)
  const siteTitle = settings?.siteTitle || 'Breeze Motion Studio'
  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description:
      settings?.description ||
      'High-end audio-visual content and structured digital solutions for corporate, commercial, industrial, and creative clients.',
  }
}

export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, studios] = await Promise.all([
    fetchSafe(SITE_SETTINGS_QUERY, {}, null),
    fetchSafe(STUDIOS_QUERY, {}, []),
  ]);

  return (
    <html lang="en">
      <body className="antialiased">
        <Nav
          navLinks={settings?.navLinks}
          navCta={settings?.navCta}
          plainLogo={settings?.plainLogo}
          roundLogo={settings?.roundLogo}
          iconLogo={settings?.iconLogo}
          studios={studios}
        />
        <ScrollObserver />
        <main className="pt-16">{children}</main>
        <Footer
          siteTitle={settings?.siteTitle}
          tagline={settings?.footerTagline}
          copyright={settings?.footerText}
          email={settings?.contactEmail}
          phone={settings?.contactPhone}
          footerLinks={settings?.footerLinks}
          socialLinks={settings?.socialLinks}
          plainLogo={settings?.footerPlainLogo}
          roundLogo={settings?.footerRoundLogo}
          footerLinksHeading={settings?.footerLinksHeading}
          footerContactHeading={settings?.footerContactHeading}
          footerFollowHeading={settings?.footerFollowHeading}
        />
      </body>
    </html>
  );
}
