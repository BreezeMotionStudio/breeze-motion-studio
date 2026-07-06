import {defineField, defineType, defineArrayMember} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

const disabledField = defineField({
  name: 'disabled',
  title: 'Hide this section',
  type: 'boolean',
  description: 'When ticked, this section will not appear on the website.',
  initialValue: false,
})

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
            defineField({
              name: 'heroImage',
              title: 'Hero Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Displayed in the diagonal frame on the right side of the hero.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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
          name: 'servicesIntro',
          title: 'Intro Text',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'simpleRichText'}),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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
          name: 'servicesCategories',
          title: 'Service Categories',
          fields: [
            defineField({name: 'sectionBg', title: 'Section Background', type: 'sectionBackground'}),
            defineField({
              name: 'orderedCategories',
              title: 'Services (Drag to Reorder)',
              type: 'array',
              description: 'Drag items to reorder. Click any service to edit its title, description, and service list.',
              of: [defineArrayMember({type: 'reference', to: [{type: 'serviceCategory'}]})],
            }),
            defineField({
              name: 'sectionTitle',
              title: 'Section Heading',
              type: 'string',
              description: 'Heading displayed above the service cards.',
            }),
            defineField({
              name: 'sectionTitleColor',
              title: 'Section Title Color',
              type: 'string',
              options: {
                list: [
                  {title: 'White', value: '#ffffff'},
                  {title: 'Black', value: '#000000'},
                  {title: 'Light Grey', value: '#E6E6E6'},
                  {title: 'Dark Grey', value: '#535D66'},
                ],
                layout: 'radio',
              },
              initialValue: '#ffffff',
            }),
            defineField({
              name: 'collageImages',
              title: 'Collage Background Images (4)',
              type: 'array',
              of: [defineArrayMember({
                type: 'object',
                name: 'collageSlot',
                fields: [
                  defineField({
                    name: 'image',
                    title: 'Image',
                    type: 'image',
                    options: { hotspot: true },
                    fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
                  }),
                ],
                preview: {
                  select: { media: 'image' },
                  prepare({ media }) {
                    return { title: 'Panel Image', media }
                  },
                },
              })],
              validation: (r) => r.max(4),
              description: 'Upload up to 4 images. Drag rows to reorder — position 1 fills panel 1, position 2 fills panel 2, etc. Rearranging changes which image appears in which shaped section of the collage.',
            }),
            defineField({name: 'readMoreLabel', title: '"Read More" Button Label', type: 'string', description: 'Text on the expand button of each service card. Default: "Read More".', initialValue: 'Read More'}),
            defineField({name: 'servicesIncludeLabel', title: '"Services Include" Modal Heading', type: 'string', description: 'Heading inside the service details modal. Default: "Services Include:".', initialValue: 'Services Include:'}),
            defineField({name: 'closeLabel', title: 'Modal Close Button Label', type: 'string', description: 'Text on the close button inside the modal. Default: "Close".', initialValue: 'Close'}),
            defineField({
              name: 'buttonLabel',
              title: 'Button Label',
              type: 'string',
              description: 'Label for the button below the cards (e.g. "Get In Touch").',
            }),
            defineField({
              name: 'buttonUrl',
              title: 'Button URL',
              type: 'string',
            }),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Service Categories' : 'Service Categories'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'servicesStrip',
          title: 'Statement Strip',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'string', description: 'Heading shown to the left of the statement text. Default: "Services".', initialValue: 'Services'}),
            defineField({
              name: 'text',
              title: 'Statement Text',
              type: 'simpleRichText',
              validation: (r) => r.required(),
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Statement Strip' : 'Statement Strip'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'serviceCombinations',
          title: 'Service Combinations',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'string'}),
            defineField({name: 'intro', title: 'Intro Text', type: 'simpleRichText'}),
            defineField({name: 'typicallyIncludesLabel', title: '"Typically Includes" Label', type: 'string', description: 'Label above each combination\'s item list. Default: "Typically Includes".', initialValue: 'Typically Includes'}),
            defineField({name: 'viewCaseStudyLabel', title: '"View Case Study" Button Label', type: 'string', description: 'Text on the button linking to each combination\'s case study. Default: "View Case Study".', initialValue: 'View Case Study'}),
            defineField({name: 'sectionBg', title: 'Section Background', type: 'sectionBackground'}),
            defineField({
              name: 'collageImages',
              title: 'Collage Background Images (4)',
              type: 'array',
              of: [defineArrayMember({
                type: 'object',
                name: 'collageSlot',
                fields: [
                  defineField({
                    name: 'image',
                    title: 'Image',
                    type: 'image',
                    options: { hotspot: true },
                    fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
                  }),
                ],
                preview: {
                  select: { media: 'image' },
                  prepare({ media }) {
                    return { title: 'Panel Image', media }
                  },
                },
              })],
              validation: (r) => r.max(4),
              description: 'Upload up to 4 images. Drag rows to reorder — position 1 fills panel 1, position 2 fills panel 2, etc. Rearranging changes which image appears in which shaped section of the collage.',
            }),
            defineField({
              name: 'combinations',
              title: 'Combinations',
              type: 'array',
              description: 'Select and reorder combinations from the content library. Edit each combination under Content Library → Service Combinations.',
              of: [defineArrayMember({type: 'reference', to: [{type: 'serviceCombination'}]})],
            }),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Service Combinations' : 'Service Combinations'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'servicesCta',
          title: 'Call to Action',
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
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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
      return {title: 'Services Page'}
    },
  },
})
