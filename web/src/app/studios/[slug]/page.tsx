import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { STUDIO_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import { notFound } from "next/navigation";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

type Project = {
  _id: string;
  title: string;
  slug?: { current: string };
  summary?: string;
  coverImage?: { asset?: { url: string }; alt?: string };
  client?: { name: string; industry?: string };
  year?: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const studio = await client.fetch(STUDIO_BY_SLUG_QUERY, { slug }).catch(() => null);
  if (!studio) return { title: "Studio Not Found" };
  return {
    title: studio.seoTitle || studio.title,
    description: studio.seoDescription || studio.purpose,
  };
}

export default async function StudioPage({ params }: Props) {
  const { slug } = await params;
  const studio = await client.fetch(STUDIO_BY_SLUG_QUERY, { slug }).catch(() => null);

  if (!studio) return notFound();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-black text-white py-24 md:py-40 overflow-hidden">
        {studio.heroImage?.asset?.url && (
          <img
            src={studio.heroImage.asset.url}
            alt={studio.heroImage.alt || studio.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative max-w-5xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide mb-4">
            {studio.title}
          </h1>
          {studio.tagline && (
            <p className="text-lg text-bms-grey-300 font-[family-name:var(--font-body)] max-w-xl">
              {studio.tagline}
            </p>
          )}
        </div>
      </section>

      {/* Purpose / Description */}
      {(studio.purpose || studio.description) && (
        <section className="bg-white text-black py-16">
          <div className="max-w-5xl mx-auto px-6 max-w-2xl">
            <p className="font-[family-name:var(--font-body)] text-lg text-[#4B4B4B] leading-relaxed">
              {studio.description || studio.purpose}
            </p>
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="bg-white text-black py-10 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 mb-12">
            Projects
          </h2>
          {studio.projects && studio.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studio.projects.map((project: Project) => (
                <div key={project._id} className="group">
                  <div className="aspect-[4/3] bg-[#E6E6E6] mb-4 overflow-hidden">
                    {project.coverImage?.asset?.url ? (
                      <img
                        src={project.coverImage.asset.url}
                        alt={project.coverImage.alt || project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#CCCCCC]" />
                    )}
                  </div>
                  <h3 className="font-[family-name:var(--font-functional)] font-bold text-sm uppercase tracking-wide mb-1">
                    {project.title}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-xs text-bms-grey-400">
                    {project.client?.name}
                    {project.year && ` — ${project.year}`}
                  </p>
                  {project.summary && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#4B4B4B] mt-2 leading-relaxed">
                      {project.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-bms-grey-400 font-[family-name:var(--font-body)]">
              Projects will appear here once added in{" "}
              <strong>Sanity Studio → Content Library → Projects</strong>.
            </p>
          )}
        </div>
      </section>

      {/* Back link */}
      <div className="bg-white border-t border-[#E6E6E6] py-8">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/studios"
            className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-grey-400 hover:text-black transition-colors"
          >
            ← All Studios
          </Link>
        </div>
      </div>
    </div>
  );
}
