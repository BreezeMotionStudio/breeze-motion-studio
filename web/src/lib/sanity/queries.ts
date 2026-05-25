import { defineQuery } from "next-sanity";

// — Singleton Pages —

export const HOME_PAGE_QUERY = defineQuery(
  `*[_type == "homePage"][0]{
    sections[disabled != true]{
      ...,
      bgImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
      imageLeftSlides[]{asset->{url}, alt},
      imageRightSlides[]{asset->{url}, alt},
      sectionImage{asset->{url}, alt},
      aboutLogo{asset->{url}, roundCrop},
      parentLogo{asset->{url}, alt, roundCrop},
      steps[]{_key, stepNumber, title, description},
      studioCards[]{
        _key,
        "studioId": studio._ref,
        cardImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
        cardVideoUrl
      },
      clientLogos[disabled != true]{_key, client->{name, logo{asset->{url}, alt}}, logoOverride{asset->{url}, alt}},
      testimonials[]->{_id, quote, attribution, role, client->{name}}
    },
    seoTitle,
    seoDescription
  }`
);

export const ABOUT_PAGE_QUERY = defineQuery(
  `*[_type == "aboutPage"][0]{
    sections[disabled != true]{
      ...,
      heroImage{asset->{url}, alt},
      bgImage{asset->{url}, alt},
      image{asset->{url}, alt},
      studioImage{asset->{url}, alt},
      founderImage{asset->{url}, alt},
      founderImage2{asset->{url}, alt},
      overviewImage{asset->{url}, alt},
      founderCard{ bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage{asset->{url}, alt} },
      studioCard{ bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage{asset->{url}, alt} },
      missionBgImage{asset->{url}, alt},
      values[]{_key, title, description},
      steps[]{_key, title, description},
      buttons[]{_key, label, url, style, topSpacing, bottomSpacing},
    },
    seoTitle,
    seoDescription
  }`
);

export const CONTACT_PAGE_QUERY = defineQuery(
  `*[_type == "contactPage"][0]{
    sections[disabled != true]{
      ...,
      heroImage{asset->{url}, alt},
      formBg { bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt } },
    },
    seoTitle,
    seoDescription
  }`
);

export const SERVICES_PAGE_QUERY = defineQuery(
  `*[_type == "servicesPage"][0]{
    sections[disabled != true]{
      ...,
      heroImage{asset->{url}, alt},
      bgImage{asset->{url}, alt},
      sectionBg { bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt } },
      stripImage { asset->{ url }, alt },
      collageImages[]{ image { asset->{ url }, alt } },
      orderedCategories[]->{ _id, title, shortDescription, services, serviceGroups[]{ _key, subheading, description, items }, image { asset->{ url }, alt } },
      combinations[]{ _key, ...@->{ _id, title, subtitle, description, items, caseStudySlug, bgImage { asset->{ url }, alt }, images[]{ asset->{ url }, alt } } }
    },
    seoTitle,
    seoDescription
  }`
);

export const STUDIOS_PAGE_QUERY = defineQuery(
  `*[_type == "studiosPage"][0]{
    sections[disabled != true]{
      ...,
      heroImage{asset->{url}, alt},
      sectionBg{ bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage{ asset->{ url }, alt } },
      buttons[]{_key, label, url, style, topSpacing, bottomSpacing},
      cards[]{
        _key,
        studio->{_id, title, slug, tagline, heroImage{asset->{url}, alt}},
        imageOverride{asset->{url}, alt},
        taglineOverride
      }
    },
    seoTitle,
    seoDescription
  }`
);

export const STUDIOS_HIGHLIGHTS_QUERY = defineQuery(
  `*[_type == "project" && isHighlight == true] | order(highlightOrder asc){
    _id,
    title,
    slug,
    tagline,
    coverImage{asset->{url}, alt},
    client->{name},
    studio->{title, slug}
  }`
);

export const STUDIOS_LATEST_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && status == "complete"] | order(completedAt desc)[0...6]{
    _id,
    title,
    slug,
    tagline,
    completedAt,
    coverImage{asset->{url}, alt},
    client->{name},
    studio->{title, slug}
  }`
);

export const STUDIOS_BTS_QUERY = defineQuery(
  `*[_type == "project" && count(btsImages) > 0] | order(completedAt desc)[0...6]{
    _id,
    title,
    slug,
    studio->{title, slug},
    btsImages[0...2]{asset->{url}, alt}
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
    "projects": *[_type == "project" && references(^._id)] | order(select(manualOrder == true => displayOrder, 9999) asc, completedAt desc){
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

export const PROJECT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    summary,
    description,
    year,
    status,
    coverImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    deliverableImages[]{asset->{_id, url, metadata{lqip, dimensions}}, alt, caption},
    deliverableVideos[]{_key, platform, url, title},
    btsNote,
    btsImages[]{asset->{_id, url, metadata{lqip, dimensions}}, alt, caption},
    btsVideos[]{_key, platform, url, title},
    sectionOrderVideos,
    sectionOrderImages,
    sectionOrderBts,
    showAsCaseStudy,
    caseStudyOverview,
    caseStudyChallenge,
    caseStudyApproach,
    caseStudyOutcome,
    services[]->{_id, title},
    client->{name, industry, logo{asset->{url}, alt}},
    studio->{title, slug},
    testimonial->{quote, attribution, role},
    seoTitle,
    seoDescription
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
  `*[_type == "project" && showAsCaseStudy == true] | order(caseStudyOrder asc){
    _id,
    title,
    slug,
    summary,
    coverImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    client->{name, industry},
    studio->{title, slug}
  }`
);

export const CASE_STUDY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    summary,
    description,
    year,
    coverImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    deliverableImages[]{asset->{_id, url, metadata{lqip, dimensions}}, alt, caption},
    deliverableVideos[]{_key, platform, url, title},
    btsNote,
    btsImages[]{asset->{_id, url, metadata{lqip, dimensions}}, alt, caption},
    btsVideos[]{_key, platform, url, title},
    sectionOrderVideos,
    sectionOrderImages,
    sectionOrderBts,
    showAsCaseStudy,
    caseStudyOverview,
    caseStudyChallenge,
    caseStudyApproach,
    caseStudyOutcome,
    services[]->{_id, title},
    client->{name, industry, logo{asset->{url}, alt}},
    studio->{title, slug},
    testimonial->{quote, attribution, role},
    seoTitle,
    seoDescription
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
    services,
    serviceGroups[]{ _key, subheading, description, items },
    image { asset->{ url }, alt }
  }`
);
