import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Client / Company Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Brief Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'logo',
      title: 'Client Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the logo for screen readers and SEO.',
        }),
        defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false}),
      ],
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'contactName',
      title: 'Primary Contact Name',
      type: 'string',
    }),
    defineField({
      name: 'contactRole',
      title: 'Contact Role / Title',
      type: 'string',
    }),
    defineField({
      name: 'studioAlignment',
      title: 'Studio Alignment',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'studio'}]}],
      description: 'Which studios does this client work with?',
    }),
    defineField({
      name: 'individual',
      title: 'Individual / Personal Client',
      type: 'boolean',
      description:
        'Turn on for a personal client (not a company). Hides their name from the large hero heading on their project page and shows the project title there instead — the name still appears everywhere else (client lists, case study byline, etc).',
      initialValue: false,
    }),
    defineField({
      name: 'approved',
      title: 'Approved for Public Display',
      type: 'boolean',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'industry', media: 'logo'},
  },
})
