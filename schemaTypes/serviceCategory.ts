import {defineField, defineType, defineArrayMember} from 'sanity'
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
      type: 'simpleRichText',
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
      title: 'Services Included (legacy flat list)',
      type: 'array',
      of: [{type: 'string'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'serviceGroups',
      title: 'Service Groups',
      description: 'Grouped service lists with optional sub-headings, displayed in the modal.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceGroup',
          title: 'Group',
          fields: [
            defineField({name: 'subheading', title: 'Sub-heading', type: 'string', description: 'Optional label above this group of services.'}),
            defineField({name: 'description', title: 'Description', type: 'simpleRichText', description: 'Short description shown above the service blocks in the modal.'}),
            defineField({name: 'items', title: 'Services', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (r) => r.required().min(1)}),
          ],
          preview: {
            select: {title: 'subheading', items: 'items'},
            prepare({title, items}) {
              return {title: title || '(No sub-heading)', subtitle: `${items?.length ?? 0} items`}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Category Image / Video Thumbnail',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
      description: 'Used as the visual for this category on the services page.',
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
