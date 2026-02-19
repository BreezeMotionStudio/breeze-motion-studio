import {defineField, defineType, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

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
            defineField({name: 'primaryCta', title: 'Primary Button', type: 'ctaButton'}),
            defineField({name: 'secondaryCta', title: 'Secondary Button', type: 'ctaButton'}),
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {title: 'Hero', subtitle: title}
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
          ],
          preview: {
            prepare() {
              return {title: 'Featured Work'}
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
          ],
          preview: {
            select: {title: 'heading'},
            prepare({title}) {
              return {title: 'Studios Overview', subtitle: title}
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
          ],
          preview: {
            select: {title: 'heading'},
            prepare({title}) {
              return {title: 'How We Work', subtitle: title}
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
          ],
          preview: {
            prepare() {
              return {title: 'Testimonials'}
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
            defineField({name: 'primaryCta', title: 'Primary Button', type: 'ctaButton'}),
            defineField({name: 'secondaryCta', title: 'Secondary Button', type: 'ctaButton'}),
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
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
      return {title: 'Home Page'}
    },
  },
})
