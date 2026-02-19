import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'Call to Action',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Link URL',
      type: 'string',
      description: 'Use relative paths for internal links (e.g. /studios) or full URLs for external',
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          {title: 'Primary (Solid)', value: 'primary'},
          {title: 'Secondary (Outline)', value: 'secondary'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'url'},
  },
})
