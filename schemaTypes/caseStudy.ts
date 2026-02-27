import {defineField, defineType, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'details', title: 'Details'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Case Study Title',
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
      title: 'Studio Alignment',
      type: 'reference',
      to: [{type: 'studio'}],
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Industry Label',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown on the case studies listing page',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'body',
      title: 'Full Narrative',
      type: 'blockContent',
      group: 'content',
      validation: (rule) => rule.required(),
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
        }),
        defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false}),
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
            defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false}),
          ],
        }),
      ],
      group: 'media',
    }),
    defineField({
      name: 'servicesProvided',
      title: 'Services Provided',
      type: 'array',
      of: [{type: 'string'}],
      group: 'details',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'reference',
      to: [{type: 'testimonial'}],
      group: 'content',
    }),
    defineField({
      name: 'year',
      title: 'Project Year(s)',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
      group: 'details',
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
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
