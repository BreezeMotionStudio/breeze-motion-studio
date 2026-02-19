import {defineField, defineType, defineArrayMember} from 'sanity'
import {ComponentIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

const disabledField = defineField({
  name: 'disabled',
  title: 'Hide this section',
  type: 'boolean',
  description: 'When ticked, this section will not appear on the website.',
  initialValue: false,
})

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
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Hero' : 'Hero', subtitle: title}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'studiosIntro',
          title: 'Intro Text',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Intro Text' : 'Intro Text'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'studiosGrid',
          title: 'Studios Grid',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'string'}),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Studios Grid' : 'Studios Grid'}
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
