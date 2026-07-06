import {defineField, defineType} from 'sanity'
import {ControlsIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const projectPageTemplate = defineType({
  name: 'projectPageTemplate',
  title: 'Project Page Template',
  type: 'document',
  icon: ControlsIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'overview', title: 'Overview'},
    {name: 'media', title: 'Media Sections'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ─── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroSectionBg',
      title: 'Hero Background',
      type: 'sectionBackground',
      group: 'hero',
      description: 'Default: white. Controls the thin title strip at the top of every project page.',
    }),
    defineField({
      name: 'heroShowCoverImage',
      title: 'Show cover image as background',
      type: 'boolean',
      group: 'hero',
      description: 'When enabled, the project cover image appears as a faded background behind the hero text.',
      initialValue: false,
    }),
    defineField({
      name: 'heroCoverImageOpacity',
      title: 'Cover image opacity (%)',
      type: 'number',
      group: 'hero',
      description: 'How visible the cover image is (0 = invisible, 100 = full). Default: 25.',
      initialValue: 25,
      validation: (r) => r.min(0).max(100),
      hidden: ({document}: any) => !document?.heroShowCoverImage,
    }),

    // ─── Overview ──────────────────────────────────────────────────────────────
    defineField({
      name: 'overviewSectionBg',
      title: 'Overview Background',
      type: 'sectionBackground',
      group: 'overview',
      description: 'Default: white. Section showing cover image, summary, description, and service tags.',
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
    defineField({
      name: 'caseStudySectionBg',
      title: 'Case Study Section Background',
      type: 'sectionBackground',
      group: 'media',
      description: 'Background for the "View Case Study" button section. Set to an image to match the About page mission section aesthetic.',
    }),
    defineField({
      name: 'deliverablesLabel',
      title: 'Deliverables Label',
      type: 'string',
      group: 'overview',
      description: 'Label above the deliverables list. Default: "Deliverables".',
      placeholder: 'Deliverables',
    }),
    defineField({
      name: 'viewCaseStudyLabel',
      title: 'View Case Study Button',
      type: 'string',
      group: 'media',
      description: 'Text on the button linking to the case study. Default: "View Case Study".',
      placeholder: 'View Case Study',
    }),

    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Project Page Template'}
    },
  },
})
