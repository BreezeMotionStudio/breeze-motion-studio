import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

export const serviceCategory = defineType({
  name: 'serviceCategory',
  title: 'Service Category',
  type: 'document',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
      description: 'One-line summary for cards and previews',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      description: 'Detailed explanation of the service category (2-3 paragraphs)',
    }),
    defineField({
      name: 'services',
      title: 'Services Included',
      type: 'array',
      of: [{type: 'string'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'shortDescription'},
  },
})
