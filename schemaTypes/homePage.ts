import {defineField, defineType, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'
import {plainTextFromBlocks} from './shared/portableTextPreview'

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
            defineField({name: 'title', title: 'Title', type: 'simpleRichText'}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'simpleRichText'}),
            defineField({
              name: 'subtitleDisabled',
              title: 'Hide the subtitle text',
              type: 'boolean',
              description: 'When ticked, the subtitle paragraph is hidden but the rest of the Hero (title, background, buttons) still shows.',
              initialValue: false,
            }),
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
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
            select: {title: 'title', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Hero' : 'Hero', subtitle: plainTextFromBlocks(title)}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeFeaturedWork',
          title: 'Featured Work',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'simpleRichText', description: 'Heading above the project grid. Default: "Featured Work".'}),
            defineField({name: 'videoUrl', title: 'Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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
            defineField({name: 'heading', title: 'Heading', type: 'simpleRichText'}),
            defineField({name: 'description', title: 'Description', type: 'simpleRichText', description: 'Short description shown below the section heading.'}),
            defineField({
              name: 'parentLogo',
              title: 'Parent Studio Logo',
              type: 'image',
              options: {hotspot: true},
              description: 'Centered logo displayed above the connector tree linking to sub-studios.',
              fields: [
                defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
                defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false}),
              ],
            }),
            defineField({
              name: 'studioCards',
              title: 'Studio Card Media',
              type: 'array',
              description:
                'Set the image or video displayed in the square container of each studio card on the homepage. Add one entry per studio and pick the media to show.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'studioCardMedia',
                  title: 'Studio Card',
                  fields: [
                    defineField({
                      name: 'studio',
                      title: 'Studio',
                      type: 'reference',
                      to: [{type: 'studio'}],
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'cardImage',
                      title: 'Card Image',
                      type: 'image',
                      options: {hotspot: true},
                      description: 'Image shown in the square 1:1 container of this studio\'s card.',
                      fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
                    }),
                    defineField({
                      name: 'cardVideoUrl',
                      title: 'Card Video URL',
                      type: 'url',
                      description: 'Video shown in the square container. If set, takes priority over the card image.',
                    }),
                  ],
                  preview: {
                    select: {studioTitle: 'studio.title', media: 'cardImage'},
                    prepare({studioTitle, media}) {
                      return {
                        title: studioTitle ? `${studioTitle}` : 'Studio Card',
                        subtitle: 'Card media',
                        media,
                      }
                    },
                  },
                }),
              ],
            }),
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
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Studios Overview' : 'Studios Overview', subtitle: plainTextFromBlocks(title)}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeAbout',
          title: 'About',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'simpleRichText'}),
            defineField({name: 'text', title: 'Body Text', type: 'simpleRichText'}),
            defineField({
              name: 'imageLeftSlides',
              title: 'Left Slideshow Images',
              type: 'array',
              description: 'Images for the left side slideshow. Add multiple images to enable auto-sliding (right to left, 8s per slide).',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: {hotspot: true},
                  fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
                }),
              ],
            }),
            defineField({
              name: 'imageRightSlides',
              title: 'Right Slideshow Images',
              type: 'array',
              description: 'Images for the right side slideshow. Add multiple images to enable auto-sliding (right to left, 8s per slide).',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: {hotspot: true},
                  fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
                }),
              ],
            }),
            defineField({
              name: 'imageAspectRatio',
              title: 'Image Container Ratio',
              type: 'string',
              description: 'Aspect ratio applied to both left and right image containers.',
              options: {
                list: [
                  {title: '1:1 — Square', value: '1:1'},
                  {title: '2:3 — Portrait', value: '2:3'},
                  {title: '9:16 — Tall', value: '9:16'},
                ],
                layout: 'radio',
              },
              initialValue: '1:1',
            }),
            defineField({
              name: 'buttons',
              title: 'Buttons',
              type: 'array',
              description: 'Add, remove, or reorder CTA buttons.',
              of: [defineArrayMember({type: 'ctaButton'})],
            }),
            defineField({
              name: 'aboutLogo',
              title: 'About Section Logo',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
            defineField({
              name: 'logoMaxWidth',
              title: 'Logo Max Width (px)',
              type: 'number',
              description: 'Set the maximum width of the logo in pixels, e.g., 150, 250, 400',
              validation: (rule) => rule.positive(),
            }),
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] About' : 'About', subtitle: plainTextFromBlocks(title)}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeHowWeWork',
          title: 'How We Work',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'simpleRichText'}),
            defineField({
              name: 'sectionImage',
              title: 'Section Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Displayed between the process steps and the button below. Container fits the natural dimensions of the image.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
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
                      type: 'simpleRichText',
                      validation: (r) => r.required().min(1),
                    }),
                    defineField({name: 'description', title: 'Description', type: 'simpleRichText'}),
                  ],
                  preview: {
                    select: {title: 'title', subtitle: 'stepNumber'},
                    prepare({title, subtitle}) {
                      const plainTitle = plainTextFromBlocks(title)
                      return {title: subtitle ? `${subtitle}. ${plainTitle}` : plainTitle}
                    },
                  },
                }),
              ],
            }),
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
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] How We Work' : 'How We Work', subtitle: plainTextFromBlocks(title)}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeTestimonials',
          title: 'Testimonials',
          fields: [
            defineField({name: 'heading', title: 'Section Heading', type: 'simpleRichText', description: 'e.g. "What Our Clients Say"'}),
            defineField({
              name: 'testimonials',
              title: 'Testimonials',
              type: 'array',
              description: 'Drag to reorder. The order here is reflected on the website.',
              of: [
                defineArrayMember({
                  type: 'reference',
                  to: [{type: 'testimonial'}],
                }),
              ],
            }),
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
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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
          name: 'homeClientLogos',
          title: 'Client Logos',
          fields: [
            defineField({
              name: 'clientLogos',
              title: 'Client Logos',
              type: 'array',
              description: 'Logos in the scrolling strip. Select clients — their logo is pulled automatically from the Client record. Upload logos via Content Library → Clients.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'clientLogo',
                  title: 'Client Logo',
                  fields: [
                    defineField({
                      name: 'client',
                      title: 'Client',
                      type: 'reference',
                      to: [{type: 'client'}],
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'logoOverride',
                      title: 'Logo Override (Homepage Strip)',
                      type: 'image',
                      options: {hotspot: true},
                      description:
                        'Optional. Upload a version of this logo tuned for the white homepage bar (e.g. cropped, darkened, or differently sized). This image is used only here and never changes the master logo in the Client record. Leave blank to use the master logo.',
                      fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
                    }),
                    defineField({
                      name: 'disabled',
                      title: 'Hide from homepage strip',
                      type: 'boolean',
                      description: 'When ticked, this client will not appear in the scrolling logo bar.',
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'client.name',
                      overrideMedia: 'logoOverride',
                      masterMedia: 'client.logo',
                      disabled: 'disabled',
                    },
                    prepare({title, overrideMedia, masterMedia, disabled}) {
                      const media = overrideMedia || masterMedia
                      const logoNote = overrideMedia
                        ? 'Using homepage override logo'
                        : masterMedia
                          ? 'Using master client logo'
                          : 'No logo — name shown as text'
                      return {
                        title: disabled ? `[HIDDEN] ${title || 'Select a client'}` : (title || 'Select a client'),
                        subtitle: logoNote,
                        media,
                      }
                    },
                  },
                }),
              ],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Client Logos' : 'Client Logos'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'homeCta',
          title: 'Call to Action',
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
            defineField({name: 'bgVideoUrl', title: 'Background Video URL', type: 'url'}),
            defineField({
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', description: 'Display this image with a circular crop', initialValue: false})],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
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

    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
