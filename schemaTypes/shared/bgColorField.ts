import {defineField} from 'sanity'

export const bgColorField = defineField({
  name: 'bgColor',
  title: 'Background Color',
  type: 'string',
  description:
    'Solid background color for this section. Leave blank to use the page default. Background video or image takes visual priority when also set.',
  options: {
    list: [
      {title: 'Pure Black', value: '#000000'},
      {title: 'Near Black', value: '#333333'},
      {title: 'Navy Grey', value: '#363F47'},
      {title: 'Charcoal Dark', value: '#3F3F3F'},
      {title: 'Dark Blue-Grey', value: '#444E57'},
      {title: 'Charcoal', value: '#4B4B4B'},
      {title: 'Steel Blue — Accent', value: '#535D66'},
      {title: 'Dark Grey', value: '#999999'},
      {title: 'Mid Grey', value: '#CCCCCC'},
      {title: 'Light Grey', value: '#E6E6E6'},
      {title: 'Off-White', value: '#F5F5F5'},
      {title: 'Pure White', value: '#FFFFFF'},
    ],
  },
})
