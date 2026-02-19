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
