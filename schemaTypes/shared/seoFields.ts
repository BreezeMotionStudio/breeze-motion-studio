import {defineField} from 'sanity'

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
    group: 'seo',
    validation: (rule) => rule.max(70).warning('Keep under 70 characters for best SEO'),
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 3,
    group: 'seo',
    validation: (rule) => rule.max(160).warning('Keep under 160 characters for best SEO'),
  }),
  defineField({
    name: 'seoImage',
    title: 'SEO / Open Graph Image',
    type: 'image',
    group: 'seo',
    description: 'Image displayed when sharing on social media (1200x630 recommended)',
  }),
]
