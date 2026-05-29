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
      type: 'string',
      group: 'media',
      description: 'Small uppercase label above the video gallery. Default: "Video Gallery".',
      placeholder: 'Video Gallery',
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
      type: 'string',
      group: 'media',
      description: 'Small uppercase label above the image gallery. Default: "Image Gallery".',
      placeholder: 'Image Gallery',
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
      type: 'string',
      group: 'media',
      description: 'Small uppercase label above BTS content. Default: "Behind the Scenes".',
      placeholder: 'Behind the Scenes',
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
      description: 'Default: white. The Challenge / Approach / Outcome section.',
    }),
    defineField({
      name: 'narrativeLabel',
      title: 'Narrative Section Label',
      type: 'string',
      group: 'narrative',
      description: 'Small uppercase label at the top of the narrative. Default: "Case Study".',
      placeholder: 'Case Study',
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
      type: 'string',
      group: 'cta',
      placeholder: 'Start a Project',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Body Text',
      type: 'text',
      rows: 2,
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
