import {defineField, defineType} from 'sanity'
import {ComponentIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const studio = defineType({
  name: 'studio',
  title: 'Studio',
  type: 'document',
  icon: ComponentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Studio Name',
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
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'purpose',
      title: 'Purpose',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'What this studio does — shown on the studios overview page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'industriesServed',
      title: 'Industries Served',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    }),
    defineField({
      name: 'whatWeDoNot',
      title: 'What This Studio Does NOT Do',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Studio Page — Hero Image',
      type: 'image',
      options: {hotspot: true},
      group: 'media',
      description: 'Full-width image for the top of the individual studio page.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
        defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false}),
      ],
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Studio Page — Hero Video URL',
      type: 'url',
      group: 'media',
      description: 'Showcase video for the top of the individual studio page.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.required().integer().min(0),
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'tagline', media: 'heroImage'},
  },
})
