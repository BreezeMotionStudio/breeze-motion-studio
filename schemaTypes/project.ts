import {defineField, defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ImageIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'details', title: 'Details'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'studio',
      title: 'Studio',
      type: 'reference',
      to: [{type: 'studio'}],
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services Provided',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'serviceCategory'}]})],
      group: 'details',
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      group: 'media',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) => rule.required().warning('Alt text is important for accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
          ],
        }),
      ],
      group: 'media',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'media',
    }),
    defineField({
      name: 'year',
      title: 'Project Year',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Featured Display Order',
      type: 'number',
      group: 'details',
      hidden: ({parent}) => !parent?.featured,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order (within studio)',
      type: 'number',
      group: 'details',
      initialValue: 0,
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
    {
      title: 'Year (Newest)',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client.name',
      media: 'coverImage',
    },
  },
})
