import {defineField, defineType} from 'sanity'
import {ComponentIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const studiosPage = defineType({
  name: 'studiosPage',
  title: 'Studio Page',
  type: 'document',
  icon: ComponentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
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
      title: 'Page Intro',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Brief intro shown on white below the hero heading',
    }),
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Studio Page'}
    },
  },
})
