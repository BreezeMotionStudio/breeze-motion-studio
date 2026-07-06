import {defineField, defineType, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

const disabledField = defineField({
  name: 'disabled',
  title: 'Hide this section',
  type: 'boolean',
  description: 'When ticked, this section will not appear on the website.',
  initialValue: false,
})

export const caseStudiesPage = defineType({
  name: 'caseStudiesPage',
  title: 'Case Studies Page',
  type: 'document',
  icon: DocumentTextIcon,
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
          name: 'caseStudiesHero',
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
          name: 'caseStudiesIntro',
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
          name: 'caseStudiesCta',
          title: 'Call to Action',
          description: 'Always appears at the very bottom of the page, below the case study listings, regardless of its position in this list.',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({name: 'text', title: 'Supporting Text', type: 'simpleRichText'}),
            defineField({
              name: 'buttons',
              title: 'Buttons',
              type: 'array',
              description: 'Add, remove, or reorder CTA buttons.',
              of: [defineArrayMember({type: 'ctaButton'})],
            }),
            defineField({
              name: 'sectionBg',
              title: 'Background',
              type: 'sectionBackground',
              description: 'Solid color, gradient, or image. Leave blank to use the default (black).',
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

    defineField({
      name: 'listingCtaLabel',
      title: 'Listing Card CTA Text',
      type: 'string',
      group: 'sections',
      description: 'Text shown at the bottom of each case study card. Default: "Read Case Study →".',
      placeholder: 'Read Case Study →',
    }),
    defineField({
      name: 'listingSectionBg',
      title: 'Listings Section Background',
      type: 'sectionBackground',
      group: 'sections',
      description: 'Background for the case study listing cards below the page sections. Default: white.',
    }),
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Case Studies Page'}
    },
  },
})
