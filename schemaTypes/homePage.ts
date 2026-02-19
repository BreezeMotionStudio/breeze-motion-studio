import {defineField, defineType, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

const disabledField = defineField({
  name: 'disabled',
  title: 'Hide this section',
  type: 'boolean',
  description: 'When ticked, this section will not appear on the website.',
  initialValue: false,
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
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
          name: 'homeHero',
          title: 'Hero',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2}),
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            defineField({
              name: 'buttons',
              title: 'Buttons',
              type: 'array',
              description: 'Add, remove, or reorder CTA buttons.',
              of: [defineArrayMember({type: 'ctaButton'})],
            }),
            disabledField,
          ],
          preview: {
            select: {title: 'title', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Hero' : 'Hero', subtitle: title}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeFeaturedWork',
          title: 'Featured Work',
          fields: [
            defineField({name: 'videoUrl', title: 'Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Featured Work' : 'Featured Work'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeStudiosOverview',
          title: 'Studios Overview',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Studios Overview' : 'Studios Overview', subtitle: title}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeHowWeWork',
          title: 'How We Work',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({
              name: 'steps',
              title: 'Process Steps',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'stepNumber', title: 'Step Number', type: 'string'}),
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
                  ],
                  preview: {
                    select: {title: 'title', subtitle: 'stepNumber'},
                    prepare({title, subtitle}) {
                      return {title: subtitle ? `${subtitle}. ${title}` : title}
                    },
                  },
                }),
              ],
            }),
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] How We Work' : 'How We Work', subtitle: title}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeTestimonials',
          title: 'Testimonials',
          fields: [
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Testimonials' : 'Testimonials'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeCta',
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
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Call to Action' : 'Call to Action', subtitle: title}
            },
          },
        }),
      ],
    }),

    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
