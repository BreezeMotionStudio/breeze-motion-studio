import {defineField, defineType, defineArrayMember} from 'sanity'
import {UserIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

const disabledField = defineField({
  name: 'disabled',
  title: 'Hide this section',
  type: 'boolean',
  description: 'When ticked, this section will not appear on the website.',
  initialValue: false,
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UserIcon,
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
          name: 'aboutHero',
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
          name: 'aboutIntro',
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
          name: 'aboutOverview',
          title: 'Studio Overview & Mission',
          fields: [
            defineField({name: 'overview', title: 'Studio Overview', type: 'blockContent'}),
            defineField({name: 'mission', title: 'Mission', type: 'blockContent'}),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Studio Overview & Mission' : 'Studio Overview & Mission'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'aboutFounder',
          title: 'Founder',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({name: 'bio', title: 'Bio', type: 'blockContent'}),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            disabledField,
          ],
          preview: {
            select: {title: 'name', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Founder' : 'Founder', subtitle: title}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'aboutValues',
          title: 'Core Values',
          fields: [
            defineField({
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
                  ],
                  preview: {select: {title: 'title'}},
                }),
              ],
            }),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Core Values' : 'Core Values'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'aboutHowWeWork',
          title: 'How We Work',
          fields: [
            defineField({name: 'intro', title: 'Intro', type: 'blockContent'}),
            defineField({
              name: 'steps',
              title: 'Steps',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
                  ],
                  preview: {select: {title: 'title'}},
                }),
              ],
            }),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] How We Work' : 'How We Work'}
            },
          },
        }),
      ],
    }),

    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
