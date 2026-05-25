import {defineField, defineType, defineArrayMember} from 'sanity'
import {ComponentIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'
import {InlineToggleItem} from './components/InlineToggleItem'

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
            defineField({
              name: 'highlights',
              title: 'Project List',
              type: 'array',
              description: 'All projects listed here. Toggle each one on or off to control what appears in the carousel.',
              of: [defineArrayMember({
                type: 'object',
                name: 'highlightEntry',
                components: {item: InlineToggleItem},
                fields: [
                  defineField({
                    name: 'project',
                    title: 'Project',
                    type: 'reference',
                    to: [{type: 'project'}],
                    validation: (r) => r.required(),
                  }),
                  defineField({
                    name: 'enabled',
                    title: 'Show in Highlights',
                    type: 'boolean',
                    initialValue: false,
                    description: 'Toggle on to display this project in the highlights carousel.',
                  }),
                ],
                preview: {
                  select: {title: 'project.title', subtitle: 'project.client.name', enabled: 'enabled', media: 'project.coverImage'},
                  prepare({title, subtitle, enabled, media}: {title?: string; subtitle?: string; enabled?: boolean; media?: unknown}) {
                    return {title: `${enabled ? '✓ ' : '○ '}${title || 'Untitled Project'}`, subtitle: subtitle || '', media}
                  },
                },
              })],
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
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Defaults to dark when left blank.'}),
            defineField({
              name: 'autoPullEnabled',
              title: 'Auto-pull from Latest Project',
              type: 'boolean',
              initialValue: true,
              description: 'When on, the first BTS image from your most recent project is automatically added at the top of the grid.',
            }),
            defineField({
              name: 'autoPullOverride',
              title: 'Replace Auto-pulled Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Upload an image here to swap out the auto-pulled one. Leave blank to use the original.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
              hidden: ({parent}: any) => parent?.autoPullEnabled === false,
            }),
            defineField({
              name: 'btsImages',
              title: 'Additional BTS Images',
              type: 'array',
              description: 'Manually upload extra BTS images. These appear after the auto-pulled image. Drag to reorder.',
              of: [defineArrayMember({
                type: 'object',
                name: 'btsImageEntry',
                fields: [
                  defineField({
                    name: 'image',
                    title: 'Image',
                    type: 'image',
                    options: {hotspot: true},
                    fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
                    validation: (r) => r.required(),
                  }),
                  defineField({name: 'label', title: 'Hover Label', type: 'string', description: 'Optional text shown on hover (e.g. project name)'}),
                  defineField({name: 'caption', title: 'Caption', type: 'string'}),
                ],
                preview: {
                  select: {label: 'label', caption: 'caption', media: 'image'},
                  prepare({label, caption, media}: {label?: string; caption?: string; media?: unknown}) {
                    return {title: label || caption || 'BTS Image', media}
                  },
                },
              })],
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
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Defaults to dark when left blank.'}),
            defineField({
              name: 'latestProjects',
              title: 'Projects',
              type: 'array',
              description: 'Projects shown in the Latest Projects strip. Toggle on/off to control visibility. Drag to reorder. Only use the toggle — do not change project references.',
              of: [defineArrayMember({
                type: 'object',
                name: 'latestEntry',
                components: {item: InlineToggleItem},
                fields: [
                  defineField({
                    name: 'project',
                    title: 'Project',
                    type: 'reference',
                    to: [{type: 'project'}],
                  }),
                  defineField({
                    name: 'enabled',
                    title: 'Show',
                    type: 'boolean',
                    initialValue: true,
                    description: 'Toggle off to hide this project without removing it from the list.',
                  }),
                ],
                preview: {
                  select: {title: 'project.title', subtitle: 'project.client.name', enabled: 'enabled', media: 'project.coverImage'},
                  prepare({title, subtitle, enabled, media}: {title?: string; subtitle?: string; enabled?: boolean; media?: unknown}) {
                    return {title: `${enabled !== false ? '✓ ' : '○ '}${title || 'Untitled Project'}`, subtitle: subtitle || '', media}
                  },
                },
              })],
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
