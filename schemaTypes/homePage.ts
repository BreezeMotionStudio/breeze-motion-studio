import {defineField, defineType, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero Section', default: true},
    {name: 'studios', title: 'Studios Overview'},
    {name: 'services', title: 'What We Do'},
    {name: 'process', title: 'How We Work'},
    {name: 'cta', title: 'Final CTA'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // — Hero Section —
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero Video URL',
      type: 'url',
      group: 'hero',
      description: 'Background or showcase video for the hero section',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (Fallback)',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
      description: 'Used when no video is provided or as a poster frame',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Primary CTA',
      type: 'ctaButton',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Secondary CTA',
      type: 'ctaButton',
      group: 'hero',
    }),

    // — Studios Overview Section —
    defineField({
      name: 'studiosHeading',
      title: 'Studios Section Heading',
      type: 'string',
      group: 'studios',
    }),
    defineField({
      name: 'studiosText',
      title: 'Studios Intro Text',
      type: 'blockContent',
      group: 'studios',
    }),

    // — What We Do Section —
    defineField({
      name: 'whatWeDoHeading',
      title: 'What We Do Heading',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'whatWeDoText',
      title: 'What We Do Content',
      type: 'blockContent',
      group: 'services',
    }),

    // — How We Work Section —
    defineField({
      name: 'howWeWorkHeading',
      title: 'How We Work Heading',
      type: 'string',
      group: 'process',
    }),
    defineField({
      name: 'howWeWorkText',
      title: 'How We Work Content',
      type: 'blockContent',
      group: 'process',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      group: 'process',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'stepNumber',
              title: 'Step Number',
              type: 'string',
            }),
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Step Description',
              type: 'text',
              rows: 2,
            }),
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

    // — Final CTA —
    defineField({
      name: 'finalCtaHeading',
      title: 'Final CTA Heading',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'finalCtaText',
      title: 'Final CTA Supporting Text',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'finalCtaPrimaryCta',
      title: 'Final CTA Primary Button',
      type: 'ctaButton',
      group: 'cta',
    }),
    defineField({
      name: 'finalCtaSecondaryCta',
      title: 'Final CTA Secondary Button',
      type: 'ctaButton',
      group: 'cta',
    }),

    // — SEO —
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
