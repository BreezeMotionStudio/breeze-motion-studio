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
    defineField({
      name: 'topSpacing',
      title: 'Top Spacing',
      type: 'string',
      description: 'Extra space above this button',
      options: {
        list: [
          {title: '−Large', value: 'neg-lg'},
          {title: '−Medium', value: 'neg-md'},
          {title: '−Small', value: 'neg-sm'},
          {title: '−XSmall', value: 'neg-xs'},
          {title: 'None', value: 'none'},
          {title: '+XSmall', value: 'xs'},
          {title: '+Small', value: 'sm'},
          {title: '+Medium', value: 'md'},
          {title: '+Large', value: 'lg'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'bottomSpacing',
      title: 'Bottom Spacing',
      type: 'string',
      description: 'Extra space below this button',
      options: {
        list: [
          {title: '−Large', value: 'neg-lg'},
          {title: '−Medium', value: 'neg-md'},
          {title: '−Small', value: 'neg-sm'},
          {title: '−XSmall', value: 'neg-xs'},
          {title: 'None', value: 'none'},
          {title: '+XSmall', value: 'xs'},
          {title: '+Small', value: 'sm'},
          {title: '+Medium', value: 'md'},
          {title: '+Large', value: 'lg'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'url'},
  },
})
