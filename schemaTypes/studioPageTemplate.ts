import {defineField, defineType} from 'sanity'
import {ControlsIcon} from '@sanity/icons'

export const studioPageTemplate = defineType({
  name: 'studioPageTemplate',
  title: 'Studio Page Template',
  type: 'document',
  icon: ControlsIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'overview', title: 'Overview'},
    {name: 'projects', title: 'Projects'},
    {name: 'cta', title: 'CTA'},
  ],
  fields: [
    // ─── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'backLabel',
      title: 'Back Navigation Label',
      type: 'string',
      group: 'hero',
      description: 'Text for the "← back" link at the top of each studio page. Default: "← Studios".',
      placeholder: '← Studios',
    }),
    defineField({
      name: 'heroSectionBg',
      title: 'Hero Background',
      type: 'sectionBackground',
      group: 'hero',
      description: 'Default: black. Controls the hero section at the top of every sub studio page.',
    }),

    // ─── Overview ──────────────────────────────────────────────────────────────
    defineField({
      name: 'overviewSectionBg',
      title: 'Overview Background',
      type: 'sectionBackground',
      group: 'overview',
      description: 'Default: white. Section showing the studio description and specialization tags.',
    }),
    defineField({
      name: 'overviewLabel',
      title: 'Overview Section Label',
      type: 'string',
      group: 'overview',
      description: 'Small uppercase label above the studio description. Default: "Studio Overview".',
      placeholder: 'Studio Overview',
    }),
    defineField({
      name: 'overviewSubtext',
      title: 'Overview Subtext',
      type: 'string',
      group: 'overview',
      description: 'Short line shown below the studio description. Default: "View the projects below."',
      placeholder: 'View the projects below.',
    }),

    // ─── Projects ──────────────────────────────────────────────────────────────
    defineField({
      name: 'projectsSectionBg',
      title: 'Projects Background',
      type: 'sectionBackground',
      group: 'projects',
      description: 'Default: black. Section showing the project grid.',
    }),
    defineField({
      name: 'projectsLabel',
      title: 'Projects Section Label',
      type: 'string',
      group: 'projects',
      description: 'Small uppercase label above the project grid. Default: "Projects".',
      placeholder: 'Projects',
    }),

    // ─── CTA ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'ctaSectionBg',
      title: 'CTA Background',
      type: 'sectionBackground',
      group: 'cta',
      description: 'Default: dark steel blue with the shared background image.',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      group: 'cta',
      description: 'Default: "Start a Project".',
      placeholder: 'Start a Project',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Body Text',
      type: 'text',
      rows: 2,
      group: 'cta',
      description: 'Default: "Every project begins with a conversation. Tell me what you\'re building."',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'CTA Button Label',
      type: 'string',
      group: 'cta',
      description: 'Default: "Get in Touch".',
      placeholder: 'Get in Touch',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA Button URL',
      type: 'string',
      group: 'cta',
      description: 'Default: "/contact".',
      placeholder: '/contact',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Studio Page Template'}
    },
  },
})
