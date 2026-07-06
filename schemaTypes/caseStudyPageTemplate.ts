import {defineField, defineType} from 'sanity'
import {ControlsIcon} from '@sanity/icons'

export const caseStudyPageTemplate = defineType({
  name: 'caseStudyPageTemplate',
  title: 'Case Study Page Template',
  type: 'document',
  icon: ControlsIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'summary', title: 'Summary'},
    {name: 'media', title: 'Media Sections'},
    {name: 'narrative', title: 'Case Study Narrative'},
    {name: 'cta', title: 'CTA Footer'},
  ],
  fields: [
    // ─── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'backLabel',
      title: 'Back Navigation Label',
      type: 'string',
      group: 'hero',
      description: 'Text for the "← back" link at the top of the page. Default: "← Case Studies".',
      placeholder: '← Case Studies',
    }),
    defineField({
      name: 'heroSectionBg',
      title: 'Hero Background',
      type: 'sectionBackground',
      group: 'hero',
      description: 'Default: black with cover image at 20% opacity.',
    }),
    defineField({
      name: 'heroShowCoverImage',
      title: 'Show cover image as background',
      type: 'boolean',
      group: 'hero',
      description: 'When enabled, the project cover image appears faded behind the hero text.',
      initialValue: true,
    }),
    defineField({
      name: 'heroCoverImageOpacity',
      title: 'Cover image opacity (%)',
      type: 'number',
      group: 'hero',
      description: 'How visible the cover image is (0 = invisible, 100 = full). Default: 20.',
      initialValue: 20,
      validation: (r) => r.min(0).max(100),
      hidden: ({document}: any) => !document?.heroShowCoverImage,
    }),

    // ─── Summary ───────────────────────────────────────────────────────────────
    defineField({
      name: 'summarySectionBg',
      title: 'Summary Background',
      type: 'sectionBackground',
      group: 'summary',
      description: 'Default: white. Section with cover image, summary text, description, and service tags.',
    }),

    // ─── Media Sections ────────────────────────────────────────────────────────
    defineField({
      name: 'videoSectionBg',
      title: 'Video Gallery Background',
      type: 'sectionBackground',
      group: 'media',
      description: 'Default: black.',
    }),
    defineField({
      name: 'videoSectionLabel',
      title: 'Video Gallery Label',
      type: 'simpleRichText',
      group: 'media',
      description: 'Small uppercase label above the video gallery. Default: "Video Gallery".',
    }),
    defineField({
      name: 'imageSectionBg',
      title: 'Image Gallery Background',
      type: 'sectionBackground',
      group: 'media',
      description: 'Default: off-white (#F5F5F5).',
    }),
    defineField({
      name: 'imageSectionLabel',
      title: 'Image Gallery Label',
      type: 'simpleRichText',
      group: 'media',
      description: 'Small uppercase label above the image gallery. Default: "Image Gallery".',
    }),
    defineField({
      name: 'btsSectionBg',
      title: 'Behind the Scenes Background',
      type: 'sectionBackground',
      group: 'media',
      description: 'Default: black.',
    }),
    defineField({
      name: 'btsSectionLabel',
      title: 'Behind the Scenes Label',
      type: 'simpleRichText',
      group: 'media',
      description: 'Small uppercase label above BTS content. Default: "Behind the Scenes".',
    }),
    defineField({
      name: 'testimonialSectionBg',
      title: 'Testimonial Background',
      type: 'sectionBackground',
      group: 'media',
      description: 'Default: black.',
    }),

    // ─── Narrative ─────────────────────────────────────────────────────────────
    defineField({
      name: 'narrativeSectionBg',
      title: 'Case Study Narrative Background',
      type: 'sectionBackground',
      group: 'narrative',
      description: 'Default: dark gradient (black → steel blue). The Challenge / Approach / Outcome section.',
    }),
    defineField({
      name: 'narrativeLabel',
      title: 'Narrative Section Label',
      type: 'simpleRichText',
      group: 'narrative',
      description: 'Small uppercase label at the top of the narrative. Default: "Case Study".',
    }),
    defineField({
      name: 'overviewHeading',
      title: 'Overview Panel Heading',
      type: 'simpleRichText',
      group: 'narrative',
      description: 'Heading inside the dark overview panel. Default: "Project Overview".',
    }),
    defineField({
      name: 'deliverablesLabel',
      title: 'Deliverables Label',
      type: 'simpleRichText',
      group: 'narrative',
      description: 'Label above the deliverables list in the overview panel. Default: "Deliverables".',
    }),
    defineField({
      name: 'challengeLabel',
      title: 'Challenge Section Heading',
      type: 'simpleRichText',
      group: 'narrative',
      description: 'Default: "The Challenge".',
    }),
    defineField({
      name: 'approachLabel',
      title: 'Approach Section Heading',
      type: 'simpleRichText',
      group: 'narrative',
      description: 'Default: "The Approach".',
    }),
    defineField({
      name: 'outcomeLabel',
      title: 'Outcome Section Heading',
      type: 'simpleRichText',
      group: 'narrative',
      description: 'Default: "The Outcome".',
    }),

    // ─── CTA Footer ────────────────────────────────────────────────────────────
    defineField({
      name: 'ctaSectionBg',
      title: 'CTA Background',
      type: 'sectionBackground',
      group: 'cta',
      description: 'Default: dark steel blue (#2A3137).',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'simpleRichText',
      group: 'cta',
      description: 'Default: "Start a Project".',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Body Text',
      type: 'simpleRichText',
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'CTA Button Label',
      type: 'string',
      group: 'cta',
      placeholder: 'Get in Touch',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA Button URL',
      type: 'string',
      group: 'cta',
      placeholder: '/contact',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Case Study Page Template'}
    },
  },
})
