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
          name: 'aboutIntro',
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
          name: 'aboutOverview',
          title: 'Studio Overview',
          fields: [
            defineField({
              name: 'studioImage',
              title: 'Studio Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Wide horizontal image displayed above the studio overview text.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            defineField({name: 'overview', title: 'Studio Overview', type: 'blockContent'}),
            defineField({
              name: 'founderImage',
              title: 'Founder Image (Top)',
              type: 'image',
              options: {hotspot: true},
              description: 'Displayed below the Founder title, above the first text block.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            defineField({name: 'mission', title: 'Founder Text — Part 1', type: 'blockContent'}),
            defineField({
              name: 'founderImage2',
              title: 'Founder Image (Middle)',
              type: 'image',
              options: {hotspot: true},
              description: 'Displayed between the two founder text blocks.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            defineField({name: 'missionPart2', title: 'Founder Text — Part 2', type: 'blockContent'}),
            defineField({
              name: 'overviewImage',
              title: 'Overview Image (Full Width)',
              type: 'image',
              options: {hotspot: true},
              description: 'Large image displayed below the Studio and Founder columns.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            defineField({name: 'founderHeading', title: 'Founder Card Heading', type: 'string', description: 'Heading above the founder card. Default: "The Founder".', initialValue: 'The Founder'}),
            defineField({name: 'studioHeading', title: 'Studio Card Heading', type: 'string', description: 'Heading above the studio card. Default: "The Studio".', initialValue: 'The Studio'}),
            defineField({name: 'founderCard', title: 'Founder Card Background', type: 'sectionBackground'}),
            defineField({name: 'studioCard', title: 'Studio Card Background', type: 'sectionBackground'}),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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
          name: 'aboutMission',
          title: 'Mission Statement',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Label shown above the statement. Defaults to "Mission" if left blank.',
              initialValue: 'Mission',
            }),
            defineField({
              name: 'text',
              title: 'Mission Statement',
              type: 'blockContent',
              description: 'The mission statement text. Supports multiple paragraphs, bold, italic, and links.',
              validation: (r) => r.required(),
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Mission Statement' : 'Mission Statement', subtitle: title}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'aboutValues',
          title: 'Core Values',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'string', description: 'Heading above the values grid. Default: "Core Values".', initialValue: 'Core Values'}),
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
                    defineField({name: 'description', title: 'Description', type: 'simpleRichText'}),
                  ],
                  preview: {select: {title: 'title'}},
                }),
              ],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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
          name: 'aboutCta',
          title: 'Call to Action',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({name: 'text', title: 'Supporting Text', type: 'simpleRichText'}),
            defineField({
              name: 'buttons',
              title: 'Buttons',
              type: 'array',
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

        defineArrayMember({
          type: 'object',
          name: 'aboutHowWeWork',
          title: 'How We Work',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'string', description: 'Label shown above the steps. Default: "How We Work".', initialValue: 'How We Work'}),
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
                    defineField({name: 'description', title: 'Description', type: 'simpleRichText'}),
                  ],
                  preview: {select: {title: 'title'}},
                }),
              ],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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
