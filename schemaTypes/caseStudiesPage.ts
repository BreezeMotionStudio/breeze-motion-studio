import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const caseStudiesPage = defineType({
  name: 'caseStudiesPage',
  title: 'Case Studies Page',
  type: 'document',
  icon: DocumentTextIcon,
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
      return {title: 'Case Studies Page'}
    },
  },
})
