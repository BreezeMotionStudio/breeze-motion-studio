import {defineField, defineType, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'
import {plainTextFromBlocks} from './shared/portableTextPreview'

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
              type: 'simpleRichText',
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: 'heroImage',
              title: 'Hero Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Displayed in the diagonal frame on the right side of the hero.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Hero' : 'Hero', subtitle: plainTextFromBlocks(title)}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'caseStudiesIntro',
          title: 'Intro Text',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'simpleRichText'}),
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
            defineField({name: 'heading', title: 'Heading', type: 'simpleRichText'}),
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
              return {title: disabled ? '[HIDDEN] Call to Action' : 'Call to Action', subtitle: plainTextFromBlocks(title)}
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'listingKickerLabel',
      title: 'Listing Card Kicker Label',
      type: 'string',
      group: 'sections',
      description: 'Small label shown above each case study title on the listing cards. Default: "Case Study".',
      placeholder: 'Case Study',
    }),
    defineField({
      name: 'listingCtaLabel',
      title: 'Listing Card "View Case Study" Button Text',
      type: 'string',
      group: 'sections',
      description: 'Button that opens the case study PDF preview. Default: "View Case Study".',
      placeholder: 'View Case Study',
    }),
    defineField({
      name: 'listingViewProjectLabel',
      title: 'Listing Card "View Project" Button Text',
      type: 'string',
      group: 'sections',
      description: 'Button that links to the full project page. Default: "View Project".',
      placeholder: 'View Project',
    }),
    defineField({
      name: 'listingSectionBg',
      title: 'Listings Section Background',
      type: 'sectionBackground',
      group: 'sections',
      description: 'Background for the case study listing cards below the page sections. Default: white.',
    }),
    defineField({
      name: 'listingSectionTitle',
      title: 'Listings Section Title',
      type: 'string',
      group: 'sections',
      description: 'Heading shown above the featured case study cards. Default: "Featured Case Studies".',
      placeholder: 'Featured Case Studies',
    }),
    defineField({
      name: 'viewMoreLabel',
      title: '"View More" Button Text',
      type: 'string',
      group: 'sections',
      description: 'Button shown below the featured cards that reveals every other project with a Case Study PDF, as small clickable thumbnails. Default: "View More Case Studies".',
      placeholder: 'View More Case Studies',
    }),
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Case Studies Page'}
    },
  },
})
