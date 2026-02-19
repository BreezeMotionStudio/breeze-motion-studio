import { client } from "@/lib/sanity/client";
import {
  HOME_PAGE_QUERY,
  FEATURED_PROJECTS_QUERY,
  STUDIOS_QUERY,
  TESTIMONIALS_QUERY,
} from "@/lib/sanity/queries";

type CtaButton = {
  label?: string;
  url?: string;
  style?: string;
};

type ProcessStep = {
  _key?: string;
  stepNumber?: string;
  title?: string;
  description?: string;
};

function CtaLink({ cta }: { cta: CtaButton }) {
  if (!cta?.label || !cta?.url) return null;
  const isPrimary = cta.style === "primary";
  return (
    <a
      href={cta.url}
      className={`inline-block px-8 py-3 font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest transition-colors ${
        isPrimary
          ? "bg-white text-black hover:bg-bms-grey-200"
          : "border border-white text-white hover:bg-white hover:text-black"
      }`}
    >
      {cta.label}
    </a>
  );
}

export const revalidate = 0;

export default async function HomePage() {
  const [page, featuredProjects, studios, testimonials] = await Promise.all([
    client.fetch(HOME_PAGE_QUERY).catch(() => null),
    client.fetch(FEATURED_PROJECTS_QUERY).catch(() => []),
    client.fetch(STUDIOS_QUERY).catch(() => []),
    client.fetch(TESTIMONIALS_QUERY).catch(() => []),
  ]);

  // No CMS content yet — show setup message
  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-wide mb-6">
            Breeze Motion Studio
          </h1>
          <p className="text-lg text-bms-grey-400 mb-4">
            Homepage content has not been published yet.
          </p>
          <p className="text-sm text-bms-grey-400">
            Open Sanity Studio at{" "}
            <a href="http://localhost:3333" className="underline text-white">
              localhost:3333
            </a>
            , click <strong>Home Page</strong>, fill in the fields, and hit{" "}
            <strong>Publish</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-wide mb-6">
            {page.heroTitle}
          </h1>
          {page.heroSubtitle && (
            <p className="text-lg md:text-xl text-bms-grey-300 mb-10 font-[family-name:var(--font-body)]">
              {page.heroSubtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {page.heroPrimaryCta && <CtaLink cta={page.heroPrimaryCta} />}
            {page.heroSecondaryCta && <CtaLink cta={page.heroSecondaryCta} />}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
            Featured Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project: any) => (
              <a
                key={project._id}
                href={`/studios/${project.studio?.slug?.current}`}
                className="group block"
              >
                <div className="aspect-[4/3] bg-bms-dark-500 mb-4 overflow-hidden">
                  {project.coverImage?.asset?.url && (
                    <img
                      src={project.coverImage.asset.url}
                      alt={project.coverImage.alt || project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <h3 className="text-lg font-[family-name:var(--font-functional)] font-bold">
                  {project.title}
                </h3>
                <p className="text-sm text-bms-grey-400">
                  {project.client?.name} {project.studio?.title && `— ${project.studio.title}`}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Studios Overview */}
      {page.studiosHeading && (
        <section className="bg-bms-dark-500 text-white py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              {page.studiosHeading}
            </h2>
            {studios && studios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {studios.map((s: any) => (
                  <a
                    key={s._id}
                    href={`/studios/${s.slug?.current}`}
                    className="group border border-bms-accent p-6 hover:bg-bms-accent transition-colors"
                  >
                    <h3 className="text-xl font-[family-name:var(--font-brand)] uppercase tracking-wide mb-3">
                      {s.title}
                    </h3>
                    <p className="text-sm text-bms-grey-300 group-hover:text-white transition-colors">
                      {s.purpose}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-center text-bms-grey-400">
                Studios will appear here once added in the CMS.
              </p>
            )}
            <div className="text-center mt-12">
              <a
                href="/studios"
                className="inline-block px-8 py-3 border border-white text-white font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Explore All Studios
              </a>
            </div>
          </div>
        </section>
      )}

      {/* How We Work */}
      {page.howWeWorkHeading && (
        <section className="bg-white text-black py-24">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-semibold mb-16 text-center">
              {page.howWeWorkHeading}
            </h2>
            {page.processSteps && page.processSteps.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {page.processSteps.map((step: ProcessStep, index: number) => (
                  <div key={step._key || index} className="text-center">
                    {step.stepNumber && (
                      <div className="text-4xl font-[family-name:var(--font-brand)] text-bms-accent mb-4">
                        {step.stepNumber}
                      </div>
                    )}
                    {step.title && (
                      <h3 className="text-lg font-[family-name:var(--font-functional)] font-bold mb-2 uppercase tracking-wide">
                        {step.title}
                      </h3>
                    )}
                    {step.description && (
                      <p className="text-sm text-bms-grey-400 font-[family-name:var(--font-body)]">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-black text-white py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              What Our Clients Say
            </h2>
            <div className="space-y-12">
              {testimonials.map((t: any) => (
                <blockquote key={t._id} className="text-center">
                  <p className="text-lg md:text-xl italic text-bms-grey-200 mb-4 font-[family-name:var(--font-body)]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="text-sm text-bms-grey-400">
                    &mdash; {t.attribution}
                    {t.role && `, ${t.role}`}
                    {t.client?.name && ` | ${t.client.name}`}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      {page.finalCtaHeading && (
        <section className="bg-bms-dark-400 text-white py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              {page.finalCtaHeading}
            </h2>
            {page.finalCtaText && (
              <p className="text-lg text-bms-grey-300 mb-10 font-[family-name:var(--font-body)]">
                {page.finalCtaText}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {page.finalCtaPrimaryCta && <CtaLink cta={page.finalCtaPrimaryCta} />}
              {page.finalCtaSecondaryCta && <CtaLink cta={page.finalCtaSecondaryCta} />}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
