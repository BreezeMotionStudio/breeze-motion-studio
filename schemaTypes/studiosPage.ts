import {defineField, defineType, defineArrayMember} from 'sanity'
import {ComponentIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const studiosPage = defineType({
  name: 'studiosPage',
  title: 'Studio Page',
  type: 'document',
  icon: ComponentIcon,
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
          name: 'studiosHero',
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
          name: 'studiosIntro',
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
          name: 'studiosGrid',
          title: 'Studios Grid',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'string'}),
          ],
          preview: {
            prepare() {
              return {title: 'Studios Grid'}
            },
          },
        }),
      ],
    }),

    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Studio Page'}
    },
  },
})
