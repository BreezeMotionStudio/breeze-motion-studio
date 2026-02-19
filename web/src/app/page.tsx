import { client } from "@/lib/sanity/client";
import {
  HOME_PAGE_QUERY,
  FEATURED_PROJECTS_QUERY,
  STUDIOS_QUERY,
  TESTIMONIALS_QUERY,
} from "@/lib/sanity/queries";

type CtaButton = { label?: string; url?: string; style?: string };
type BgImage = { asset?: { url: string }; alt?: string };
type Section = Record<string, any> & { _type: string; _key: string };

function getYouTubeEmbedUrl(url: string, mode: "showcase" | "background" = "showcase"): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v") || u.pathname.split("/").pop() || null;
    }
    if (!id) return null;
    // Common: no related videos, no info cards/annotations, minimal branding
    const common = `rel=0&iv_load_policy=3&modestbranding=1`;
    if (mode === "background") {
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&${common}`;
    }
    // Showcase: max quality hints, controls on for play/pause, no autoplay
    return `https://www.youtube.com/embed/${id}?${common}&vq=hd2160&hd=1&controls=1&playsinline=1`;
  } catch {
    return null;
  }
}

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

function SectionBg({ videoUrl, image }: { videoUrl?: string; image?: BgImage }) {
  if (videoUrl) {
    const ytEmbed = getYouTubeEmbedUrl(videoUrl, "background");
    return (
      <>
        {ytEmbed ? (
          <iframe
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ border: 0, transform: "scale(1.5)", transformOrigin: "center" }}
            src={ytEmbed}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
          />
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
      </>
    );
  }
  if (image?.asset?.url) {
    return (
      <>
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={image.asset.url}
          alt={image.alt || ""}
        />
        <div className="absolute inset-0 bg-black/55" />
      </>
    );
  }
  return null;
}

function HomeHero({ s }: { s: Section }) {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} />
      {(s.title || s.primaryCta || s.secondaryCta) && (
        <div className="relative z-10 text-center max-w-4xl px-6">
          {s.title && (
            <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide mb-6">
              {s.title}
            </h1>
          )}
          {s.subtitle && (
            <p className="text-lg md:text-xl text-bms-grey-300 mb-10 font-[family-name:var(--font-body)]">
              {s.subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {s.primaryCta && <CtaLink cta={s.primaryCta} />}
            {s.secondaryCta && <CtaLink cta={s.secondaryCta} />}
          </div>
        </div>
      )}
    </section>
  );
}

function HomeFeaturedWork({ s, projects }: { s: Section; projects: any[] }) {
  const hasMedia = !!(s.videoUrl || s.bgImage?.asset?.url);
  const ytEmbed = s.videoUrl ? getYouTubeEmbedUrl(s.videoUrl, "showcase") : null;
  return (
    <section className="bg-black text-white">
      {s.videoUrl && (
        ytEmbed ? (
          <div className="w-full aspect-video">
            <iframe
              className="w-full h-full"
              style={{ border: 0 }}
              src={ytEmbed}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video
            className="w-full aspect-video object-cover"
            src={s.videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        )
      )}
      {!s.videoUrl && s.bgImage?.asset?.url && (
        <img
          className="w-full aspect-video object-cover"
          src={s.bgImage.asset.url}
          alt={s.bgImage.alt || ""}
        />
      )}
      {projects && projects.length > 0 && (
        <div className={`max-w-6xl mx-auto px-6 py-24 ${hasMedia ? "" : "pt-24"}`}>
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center text-white">
            Featured Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
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
                <h3 className="text-lg font-[family-name:var(--font-functional)] font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-sm text-bms-grey-400">
                  {project.client?.name}{" "}
                  {project.studio?.title && `— ${project.studio.title}`}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function HomeStudiosOverview({ s, studios }: { s: Section; studios: any[] }) {
  return (
    <section className="relative overflow-hidden bg-bms-dark-500 text-white py-24">
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {s.heading && (
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">{s.heading}</h2>
        )}
        {studios && studios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studios.map((studio: any) => (
              <a
                key={studio._id}
                href={`/studios/${studio.slug?.current}`}
                className="group border border-bms-accent p-6 hover:bg-bms-accent transition-colors"
              >
                <h3 className="text-xl font-[family-name:var(--font-brand)] uppercase tracking-wide mb-3">
                  {studio.title}
                </h3>
                <p className="text-sm text-bms-grey-300 group-hover:text-white transition-colors">
                  {studio.purpose}
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
  );
}

function HomeHowWeWork({ s }: { s: Section }) {
  const hasBg = !!(s.bgVideoUrl || s.bgImage?.asset?.url);
  return (
    <section
      className={`relative overflow-hidden py-24 ${hasBg ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {s.heading && (
          <h2 className="text-3xl md:text-4xl font-semibold mb-16 text-center">{s.heading}</h2>
        )}
        {s.steps && s.steps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {s.steps.map((step: any, i: number) => (
              <div key={step._key || i} className="text-center">
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
                  <p
                    className={`text-sm font-[family-name:var(--font-body)] ${hasBg ? "text-bms-grey-300" : "text-bms-grey-400"}`}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function HomeTestimonials({ s, testimonials }: { s: Section; testimonials: any[] }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-black text-white py-24">
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
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
  );
}

function HomeCta({ s }: { s: Section }) {
  return (
    <section className="relative overflow-hidden bg-bms-dark-400 text-white py-24">
      <SectionBg videoUrl={s.bgVideoUrl} image={s.bgImage} />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {s.heading && (
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">{s.heading}</h2>
        )}
        {s.text && (
          <p className="text-lg text-bms-grey-300 mb-10 font-[family-name:var(--font-body)]">
            {s.text}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {s.primaryCta && <CtaLink cta={s.primaryCta} />}
          {s.secondaryCta && <CtaLink cta={s.secondaryCta} />}
        </div>
      </div>
    </section>
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

  if (!page?.sections?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center max-w-2xl px-6">
          <h1 className="font-[family-name:var(--font-brand)] text-5xl md:text-7xl uppercase tracking-wide mb-6">
            Breeze Motion Studio
          </h1>
          <p className="text-lg text-bms-grey-400 mb-4">
            Homepage content has not been published yet.
          </p>
          <p className="text-sm text-bms-grey-400">
            Open <strong>Sanity Studio → Website Pages → Home Page</strong>, add sections, and
            publish.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {page.sections.map((section: Section) => {
        switch (section._type) {
          case "homeHero":
            return <HomeHero key={section._key} s={section} />;
          case "homeFeaturedWork":
            return (
              <HomeFeaturedWork key={section._key} s={section} projects={featuredProjects} />
            );
          case "homeStudiosOverview":
            return <HomeStudiosOverview key={section._key} s={section} studios={studios} />;
          case "homeHowWeWork":
            return <HomeHowWeWork key={section._key} s={section} />;
          case "homeTestimonials":
            return (
              <HomeTestimonials key={section._key} s={section} testimonials={testimonials} />
            );
          case "homeCta":
            return <HomeCta key={section._key} s={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
