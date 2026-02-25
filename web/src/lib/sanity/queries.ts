import { defineQuery } from "next-sanity";

// — Singleton Pages —

export const HOME_PAGE_QUERY = defineQuery(
  `*[_type == "homePage"][0]{
    sections[disabled != true]{
      ...,
      bgImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
      imageLeft{asset->{url}, alt},
      imageRight{asset->{url}, alt},
      sectionImage{asset->{url}, alt},
      aboutLogo{asset->{url}},
      steps[]{_key, stepNumber, title, description},
      studioCards[]{
        _key,
        "studioId": studio._ref,
        cardImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
        cardVideoUrl
      },
      clientLogos[disabled != true]{_key, client->{name, logo{asset->{url}, alt}}, logoOverride{asset->{url}, alt}}
    },
    seoTitle,
    seoDescription
  }`
);

export const ABOUT_PAGE_QUERY = defineQuery(
  `*[_type == "aboutPage"][0]{
    sections[disabled != true]{
      ...,
      image{asset->{url}, alt},
      values[]{_key, title, description},
      steps[]{_key, title, description},
    },
    seoTitle,
    seoDescription
  }`
);

export const CONTACT_PAGE_QUERY = defineQuery(
  `*[_type == "contactPage"][0]{
    sections[disabled != true]{...},
    seoTitle,
    seoDescription
  }`
);

export const SERVICES_PAGE_QUERY = defineQuery(
  `*[_type == "servicesPage"][0]{
    sections[disabled != true]{...},
    seoTitle,
    seoDescription
  }`
);

export const STUDIOS_PAGE_QUERY = defineQuery(
  `*[_type == "studiosPage"][0]{
    sections[disabled != true]{...},
    seoTitle,
    seoDescription
  }`
);

export const CASE_STUDIES_PAGE_QUERY = defineQuery(
  `*[_type == "caseStudiesPage"][0]{
    sections[disabled != true]{...},
    seoTitle,
    seoDescription
  }`
);

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{
    siteTitle,
    tagline,
    navLinks[]{label, href},
    navCta{label, href},
    plainLogo{enabled, sizePreset, customSize, logoImage{asset->{url}}},
    roundLogo{enabled, sizePreset, customSize, logoImage{asset->{url}}},
    iconLogo{enabled, sizePreset, customSize, logoImage{asset->{url}}},
    footerPlainLogo{enabled, sizePreset, customSize},
    footerRoundLogo{enabled, sizePreset, customSize},
    footerTagline,
    footerLinks[]{label, href},
    footerText,
    contactEmail,
    contactPhone,
    socialLinks[]{platform, url},
    splashAccentsEnabled
  }`
);


// — Studios —

export const STUDIOS_QUERY = defineQuery(
  `*[_type == "studio"] | order(displayOrder asc){
    _id,
    title,
    slug,
    tagline,
    purpose,
    heroImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    heroVideoUrl,
    displayOrder
  }`
);

export const STUDIO_BY_SLUG_QUERY = defineQuery(
  `*[_type == "studio" && slug.current == $slug][0]{
    ...,
    heroImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    "projects": *[_type == "project" && references(^._id)] | order(displayOrder asc){
      _id,
      title,
      slug,
      summary,
      coverImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
      client->{name, industry},
      year
    }
  }`
);

// — Projects —

export const FEATURED_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && featured == true] | order(featuredOrder asc){
    _id,
    title,
    slug,
    summary,
    coverImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    client->{name},
    studio->{title, slug}
  }`
);

// — Case Studies —

export const CASE_STUDIES_QUERY = defineQuery(
  `*[_type == "caseStudy"] | order(_createdAt desc){
    _id,
    title,
    slug,
    summary,
    industry,
    coverImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    client->{name},
    studio->{title, slug}
  }`
);

export const CASE_STUDY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "caseStudy" && slug.current == $slug][0]{
    ...,
    coverImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    gallery[]{asset->{_id, url, metadata{lqip, dimensions}}, alt, caption},
    client->{name, industry, logo{asset->{url}, alt}},
    studio->{title, slug},
    testimonial->{quote, attribution, role}
  }`
);

// — Testimonials —

export const TESTIMONIALS_QUERY = defineQuery(
  `*[_type == "testimonial" && featured == true] | order(displayOrder asc){
    _id,
    quote,
    attribution,
    role,
    client->{name}
  }`
);

// — Service Categories —

export const SERVICE_CATEGORIES_QUERY = defineQuery(
  `*[_type == "serviceCategory"] | order(displayOrder asc){
    _id,
    title,
    slug,
    shortDescription,
    services
  }`
);
