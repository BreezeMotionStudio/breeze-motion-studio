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
    {name: 'featuredWork', title: 'Featured Work'},
    {name: 'studios', title: 'Studios Overview'},
    {name: 'services', title: 'What We Do'},
    {name: 'process', title: 'How We Work'},
    {name: 'testimonials', title: 'Testimonials'},
    {name: 'cta', title: 'Final CTA'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — Hero 1: Visual / Media (top) —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    defineField({
      name: 'heroTitle',
      title: 'Hero 1 — Title',
      type: 'string',
      group: 'hero',
      description: 'Leave blank to show only the background media with no overlay text',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero 1 — Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero 1 — Background Video URL',
      type: 'url',
      group: 'hero',
      description: 'Full-screen background video. Takes priority over the image if both are set.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero 1 — Background Image (Fallback)',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
      description: 'Used when no video is provided, or as the video poster frame.',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Hero 1 — Primary CTA',
      type: 'ctaButton',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Hero 1 — Secondary CTA',
      type: 'ctaButton',
      group: 'hero',
    }),

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — Hero 2: Content Hero (below) —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    defineField({
      name: 'hero2Title',
      title: 'Hero 2 — Title',
      type: 'string',
      group: 'hero',
      description: 'Main heading for the content hero section directly below the media hero',
    }),
    defineField({
      name: 'hero2Subtitle',
      title: 'Hero 2 — Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'hero2VideoUrl',
      title: 'Hero 2 — Background Video URL',
      type: 'url',
      group: 'hero',
      description: 'Background video for the content hero section.',
    }),
    defineField({
      name: 'hero2Image',
      title: 'Hero 2 — Background Image (Fallback)',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),
    defineField({
      name: 'hero2PrimaryCta',
      title: 'Hero 2 — Primary CTA',
      type: 'ctaButton',
      group: 'hero',
    }),
    defineField({
      name: 'hero2SecondaryCta',
      title: 'Hero 2 — Secondary CTA',
      type: 'ctaButton',
      group: 'hero',
    }),

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — Featured Work Section —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    defineField({
      name: 'featuredWorkBgVideoUrl',
      title: 'Featured Work — Background Video URL',
      type: 'url',
      group: 'featuredWork',
      description: 'Background video behind the Featured Work section',
    }),
    defineField({
      name: 'featuredWorkBgImage',
      title: 'Featured Work — Background Image',
      type: 'image',
      options: {hotspot: true},
      group: 'featuredWork',
      description: 'Background image behind the Featured Work section (used when no video is set)',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — Studios Overview Section —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
    defineField({
      name: 'studiosBgVideoUrl',
      title: 'Studios Section — Background Video URL',
      type: 'url',
      group: 'studios',
      description: 'Background video behind the Studios section',
    }),
    defineField({
      name: 'studiosBgImage',
      title: 'Studios Section — Background Image',
      type: 'image',
      options: {hotspot: true},
      group: 'studios',
      description: 'Background image behind the Studios section (used when no video is set)',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — What We Do Section —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — How We Work Section —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
    defineField({
      name: 'howWeWorkBgVideoUrl',
      title: 'How We Work — Background Video URL',
      type: 'url',
      group: 'process',
      description: 'Background video behind the How We Work section',
    }),
    defineField({
      name: 'howWeWorkBgImage',
      title: 'How We Work — Background Image',
      type: 'image',
      options: {hotspot: true},
      group: 'process',
      description: 'Background image behind the How We Work section (used when no video is set)',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — Testimonials Section —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    defineField({
      name: 'testimonialsBgVideoUrl',
      title: 'Testimonials — Background Video URL',
      type: 'url',
      group: 'testimonials',
      description: 'Background video behind the Testimonials section',
    }),
    defineField({
      name: 'testimonialsBgImage',
      title: 'Testimonials — Background Image',
      type: 'image',
      options: {hotspot: true},
      group: 'testimonials',
      description: 'Background image behind the Testimonials section (used when no video is set)',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — Final CTA —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
    defineField({
      name: 'finalCtaBgVideoUrl',
      title: 'Final CTA — Background Video URL',
      type: 'url',
      group: 'cta',
      description: 'Background video behind the Final CTA section',
    }),
    defineField({
      name: 'finalCtaBgImage',
      title: 'Final CTA — Background Image',
      type: 'image',
      options: {hotspot: true},
      group: 'cta',
      description: 'Background image behind the Final CTA section (used when no video is set)',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
      ],
    }),

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // — SEO —
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
