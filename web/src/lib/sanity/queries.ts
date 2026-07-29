import { defineQuery } from "next-sanity";

// — Singleton Pages —

export const HOME_PAGE_QUERY = defineQuery(
  `*[_type == "homePage"][0]{
    sections[disabled != true]{
      ...,
      bgImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
      sectionBg { bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt } },
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
      image{asset->{url}, alt},
      studioImage{asset->{url}, alt},
      founderImage{asset->{url}, alt},
      founderImage2{asset->{url}, alt},
      overviewImage{asset->{url}, alt},
      bgImage { asset->{ url }, alt },
      founderCard{ bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage{asset->{url}, alt} },
      studioCard{ bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage{asset->{url}, alt} },
      sectionBg { bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt } },
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
      sectionBg { bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt } },
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
        taglineOverride,
        overlayOpacity,
        overlayDirection
      },
      highlights[]{
        _key,
        enabled,
        project->{ _id, title, slug, tagline, coverImage{asset->{url}, alt}, client->{name}, studio->{title, slug} }
      },
      btsImages[]{
        _type,
        _key,
        enabled,
        project->{ _id, title, client->{name}, "firstBtsImage": btsImages[defined(asset)][0]{ asset->{url}, alt, caption } },
        imageOverride{ asset->{url}, alt },
        image{ asset->{url}, alt },
        label,
        caption
      },
      _type == "studiosBts" => {
        "allProjectBts": *[_type == "project" && count(btsImages[defined(asset)]) > 0] | order(completedAt desc, _createdAt desc){
          _id,
          title,
          client->{name},
          "firstBtsImage": btsImages[defined(asset)][0]{ asset->{url}, alt, caption }
        }
      },
      latestProjects[]{
        _key,
        enabled,
        project->{ _id, title, slug, tagline, completedAt, coverImage{asset->{url}, alt}, client->{name}, studio->{title, slug} }
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
  `*[_id == "caseStudiesPage"][0]{
    sections[disabled != true]{
      ...,
      heroImage { asset->{ url }, alt },
      sectionBg { bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt } }
    },
    listingKickerLabel,
    listingCtaLabel,
    listingSectionBg { bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt } },
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
    description,
    footerPlainLogo{enabled, sizePreset, customSize, logoImage{asset->{url}}},
    footerRoundLogo{enabled, sizePreset, customSize, logoImage{asset->{url}}},
    footerLinksHeading,
    footerContactHeading,
    footerFollowHeading,
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
    heroVideo{asset->{_id, url, mimeType}},
    "projects": *[_type == "project" && references(^._id)] | order(select(manualOrder == true => displayOrder, 9999) asc, completedAt desc){
      _id,
      title,
      slug,
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
    caseStudyPdf{asset->{url, originalFilename}},
    deliverables,
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
    year,
    coverImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
    client->{name},
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
    coverImage{asset->{url}, alt},
    caseStudyOverview,
    caseStudyChallenge,
    caseStudyChallengeImage{asset->{url}, alt},
    caseStudyApproach,
    caseStudyApproachImage{asset->{url}, alt},
    caseStudyOutcome,
    caseStudyOutcomeImage{asset->{url}, alt},
    deliverables,
    deliverableImages[]{_key, asset->{url}, alt, caption},
    caseStudySliderImages[]{_key, asset->{url}, alt, caption},
    client->{name},
    testimonial->{quote, attribution, role, client->{name}},
    seoTitle,
    seoDescription
  }`
);

// — Page Templates —

const sectionBgFragment = `bgType, bgColor, gradientFrom, gradientTo, gradientDirection, gradientStop, bgImage { asset->{ url }, alt }`

export const PROJECT_PAGE_TEMPLATE_QUERY = defineQuery(
  `*[_id == "projectPageTemplate"][0]{
    heroSectionBg { ${sectionBgFragment} },
    heroShowCoverImage,
    heroCoverImageOpacity,
    overviewSectionBg { ${sectionBgFragment} },
    videoSectionBg { ${sectionBgFragment} },
    videoSectionLabel,
    imageSectionBg { ${sectionBgFragment} },
    imageSectionLabel,
    btsSectionBg { ${sectionBgFragment} },
    btsSectionLabel,
    testimonialSectionBg { ${sectionBgFragment} },
    caseStudySectionBg { ${sectionBgFragment} },
    deliverablesLabel,
    viewCaseStudyLabel
  }`
)

export const CASE_STUDY_PAGE_TEMPLATE_QUERY = defineQuery(
  `*[_id == "caseStudyPageTemplate"][0]{
    backLabel,
    heroSectionBg { ${sectionBgFragment} },
    heroShowCoverImage,
    heroCoverImageOpacity,
    summarySectionBg { ${sectionBgFragment} },
    videoSectionBg { ${sectionBgFragment} },
    videoSectionLabel,
    imageSectionBg { ${sectionBgFragment} },
    imageSectionLabel,
    btsSectionBg { ${sectionBgFragment} },
    btsSectionLabel,
    testimonialSectionBg { ${sectionBgFragment} },
    narrativeSectionBg { ${sectionBgFragment} },
    narrativeLabel,
    overviewHeading,
    deliverablesLabel,
    challengeLabel,
    approachLabel,
    outcomeLabel,
    ctaSectionBg { ${sectionBgFragment} },
    ctaHeading,
    ctaText,
    ctaButtonLabel,
    ctaButtonUrl
  }`
)

export const STUDIO_PAGE_TEMPLATE_QUERY = defineQuery(
  `*[_id == "studioPageTemplate"][0]{
    backLabel,
    heroSectionBg { ${sectionBgFragment} },
    overviewSectionBg { ${sectionBgFragment} },
    overviewLabel,
    overviewSubtext,
    projectsSectionBg { ${sectionBgFragment} },
    projectsLabel,
    ctaSectionBg { ${sectionBgFragment} },
    ctaHeading,
    ctaText,
    ctaButtonLabel,
    ctaButtonUrl
  }`
)

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
