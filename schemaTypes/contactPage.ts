import {defineField, defineType, defineArrayMember} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
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
          name: 'contactHero',
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
          name: 'contactIntro',
          title: 'Intro Text',
          fields: [
            defineField({name: 'content', title: 'Content', type: 'blockContent'}),
          ],
          preview: {
            prepare() {
              return {title: 'Intro Text'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'contactDetails',
          title: 'Contact Details & Form',
          fields: [
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
              validation: (r) => r.required().email(),
            }),
            defineField({name: 'phone', title: 'Phone / WhatsApp', type: 'string'}),
            defineField({name: 'formHeading', title: 'Form Heading', type: 'string'}),
          ],
          preview: {
            prepare() {
              return {title: 'Contact Details & Form'}
            },
          },
        }),
      ],
    }),

    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Contact Page'}
    },
  },
})
