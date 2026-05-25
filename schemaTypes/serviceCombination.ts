import {defineField, defineType, defineArrayMember} from 'sanity'
import {ComponentIcon} from '@sanity/icons'

export const serviceCombination = defineType({
  name: 'serviceCombination',
  title: 'Service Combination',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'simpleRichText'}),
    defineField({
      name: 'items',
      title: 'Typically Includes',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'caseStudySlug',
      title: 'Case Study Slug',
      type: 'string',
      description: 'Slug of the linked case study (e.g. "brand-starter-rovd"). Leave blank until the case study is published.',
    }),
    defineField({
      name: 'bgImage',
      title: 'Card Background Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Optional photo shown as the card background. A dark overlay is applied automatically.',
    }),
    defineField({
      name: 'images',
      title: 'Preview Images (up to 3)',
      type: 'array',
      of: [defineArrayMember({
        type: 'image',
        options: {hotspot: true},
        fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      })],
      validation: (r) => r.max(3),
      description: 'Up to 3 images shown as small thumbnails on the card.',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
  },
})
