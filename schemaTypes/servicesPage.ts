import {defineField, defineType, defineArrayMember} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'sections', title: 'Sections', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'sections',
      description: 'Drag to reorder sections. Click + to add a new section.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'servicesHero',
          title: 'Hero',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: {title: 'heading'},
            prepare({title}) {
              return {title: 'Hero', subtitle: title}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'servicesIntro',
          title: 'Intro Text',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
          ],
          preview: {
            prepare() {
              return {title: 'Intro Text'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'servicesCategories',
          title: 'Service Categories',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'string'}),
          ],
          preview: {
            prepare() {
              return {title: 'Service Categories'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'servicesCta',
          title: 'Call to Action',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({name: 'text', title: 'Supporting Text', type: 'text', rows: 2}),
            defineField({
              name: 'buttons',
              title: 'Buttons',
              type: 'array',
              description: 'Add, remove, or reorder CTA buttons.',
              of: [defineArrayMember({type: 'ctaButton'})],
            }),
          ],
          preview: {
            select: {title: 'heading'},
            prepare({title}) {
              return {title: 'Call to Action', subtitle: title}
            },
          },
        }),
      ],
    }),

    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Services Page'}
    },
  },
})
