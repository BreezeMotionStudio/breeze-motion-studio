import {defineField, defineType} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Person Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
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
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'attribution',
      subtitle: 'client.name',
      description: 'quote',
    },
    prepare({title, subtitle, description}) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle ? `${subtitle} — "${description?.substring(0, 60)}..."` : description?.substring(0, 80),
      }
    },
  },
})
