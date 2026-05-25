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
        // ── Hero ──────────────────────────────────────────────────────────
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

        // ── Intro Text ────────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'studiosIntro',
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

        // ── Highlights Strip ──────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'studiosHighlights',
          title: 'Highlights Strip',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Label',
              type: 'string',
              initialValue: 'Highlights',
              description: 'Small label shown above the carousel (e.g. "Highlights")',
            }),
            defineField({
              name: 'sectionBg',
              title: 'Background',
              type: 'sectionBackground',
              description: 'Solid color, gradient, or image. Defaults to dark when left blank.',
            }),
            disabledField,
          ],
          preview: {
            select: {heading: 'heading', disabled: 'disabled'},
            prepare({heading, disabled}) {
              return {
                title: disabled ? '[HIDDEN] Highlights Strip' : 'Highlights Strip',
                subtitle: 'Auto-pulls projects marked as highlights — light strip',
              }
            },
          },
        }),

        // ── Studio Cards ──────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'studiosGrid',
          title: 'Studio Cards',
          fields: [
            defineField({
              name: 'sectionBg',
              title: 'Background',
              type: 'sectionBackground',
              description: 'Solid color, gradient, or image. Defaults to black when left blank.',
            }),
            defineField({
              name: 'cards',
              title: 'Studio Cards',
              type: 'array',
              description:
                'One card per studio. Drag to reorder. Leave empty to show all studios automatically.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'studioGridCard',
                  title: 'Studio Card',
                  fields: [
                    defineField({
                      name: 'studio',
                      title: 'Studio',
                      type: 'reference',
                      to: [{type: 'studio'}],
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'imageOverride',
                      title: 'Card Image Override',
                      type: 'image',
                      options: {hotspot: true},
                      description:
                        'Replaces the studio\'s hero image on this card. Leave blank to use the default.',
                      fields: [
                        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
                      ],
                    }),
                    defineField({
                      name: 'taglineOverride',
                      title: 'Tagline Override',
                      type: 'string',
                      description:
                        'Replaces the studio\'s default tagline on this card. Leave blank to use the default.',
                      validation: (r) => r.max(120),
                    }),
                    defineField({
                      name: 'overlayOpacity',
                      title: 'Gradient Strength',
                      type: 'number',
                      description:
                        'Controls how dark the gradient is. 0 = no gradient, 100 = full black. Default: 70.',
                      initialValue: 70,
                      validation: (r) => r.min(0).max(100),
                    }),
                    defineField({
                      name: 'overlayDirection',
                      title: 'Gradient Direction',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Bottom → Top', value: 'to top'},
                          {title: 'Top → Bottom', value: 'to bottom'},
                          {title: 'Left → Right', value: 'to right'},
                          {title: 'Right → Left', value: 'to left'},
                          {title: 'Diagonal ↗', value: 'to top right'},
                          {title: 'Diagonal ↖', value: 'to top left'},
                          {title: 'Diagonal ↘', value: 'to bottom right'},
                          {title: 'Diagonal ↙', value: 'to bottom left'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'to top right',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'studio.title',
                      subtitle: 'taglineOverride',
                      defaultTagline: 'studio.tagline',
                      media: 'imageOverride',
                    },
                    prepare({
                      title,
                      subtitle,
                      defaultTagline,
                      media,
                    }: {
                      title?: string
                      subtitle?: string
                      defaultTagline?: string
                      media?: unknown
                    }) {
                      return {
                        title: title || 'Studio Card',
                        subtitle: subtitle || defaultTagline || '',
                        media,
                      }
                    },
                  },
                }),
              ],
            }),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {
                title: disabled ? '[HIDDEN] Studio Cards' : 'Studio Cards',
                subtitle: 'Drag to reorder, override image or tagline per card',
              }
            },
          },
        }),

        // ── Behind the Scenes ────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'studiosBts',
          title: 'Behind the Scenes',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Label',
              type: 'string',
              initialValue: 'Behind the Scenes',
              description: 'Small label shown above the image grid',
            }),
            disabledField,
          ],
          preview: {
            select: {heading: 'heading', disabled: 'disabled'},
            prepare({heading, disabled}) {
              return {
                title: disabled ? '[HIDDEN] Behind the Scenes' : 'Behind the Scenes',
                subtitle: 'Auto-pulls BTS images from recent projects — dark strip',
              }
            },
          },
        }),

        // ── Latest Projects Strip ─────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'studiosLatestProjects',
          title: 'Latest Projects Strip',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Label',
              type: 'string',
              initialValue: 'Latest Projects',
              description: 'Small label shown above the project grid',
            }),
            disabledField,
          ],
          preview: {
            select: {heading: 'heading', disabled: 'disabled'},
            prepare({heading, disabled}) {
              return {
                title: disabled ? '[HIDDEN] Latest Projects' : 'Latest Projects Strip',
                subtitle: 'Auto-pulls 6 most recent completed projects — dark strip',
              }
            },
          },
        }),

        // ── CTA ───────────────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'studiosCta',
          title: 'Call to Action',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'text',
              title: 'Body Text',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'buttons',
              title: 'Buttons',
              type: 'array',
              of: [defineArrayMember({type: 'ctaButton'})],
            }),
            defineField({
              name: 'sectionBg',
              title: 'Background',
              type: 'sectionBackground',
              description: 'Solid color, gradient, or image. Defaults to black when left blank.',
            }),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] CTA' : 'Call to Action', subtitle: title}
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
