import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'cta', title: 'Call to Action'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Brief intro shown beneath the page heading',
    }),

    // — Call to Action —
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      group: 'cta',
      description: 'e.g. "Ready to work together?"',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Supporting Text',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'ctaButton',
      group: 'cta',
    }),

    // — SEO —
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Services Page'}
    },
  },
})
