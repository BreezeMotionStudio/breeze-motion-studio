import {defineField, defineType} from 'sanity'

// Brand color palette — shared by solid and gradient fields, and by text color marks
export const COLOR_LIST = [
  {title: 'Pure Black', value: '#000000'},
  {title: 'Deep Black', value: '#0d0d0d'},
  {title: 'Near Black', value: '#333333'},
  {title: 'Steel Blue (Dark)', value: '#363F47'},
  {title: 'Charcoal Dark', value: '#3F3F3F'},
  {title: 'Dark Blue-Grey', value: '#444E57'},
  {title: 'Charcoal', value: '#4B4B4B'},
  {title: 'Steel Blue — Accent', value: '#535D66'},
  {title: 'Dark Grey', value: '#999999'},
  {title: 'Mid Grey', value: '#CCCCCC'},
  {title: 'Light Grey', value: '#E6E6E6'},
  {title: 'Off-White', value: '#F5F5F5'},
  {title: 'Pure White', value: '#FFFFFF'},
]

export const sectionBackground = defineType({
  name: 'sectionBackground',
  title: 'Background',
  type: 'object',
  fields: [
    defineField({
      name: 'bgType',
      title: 'Background Type',
      type: 'string',
      options: {
        list: [
          {title: 'Solid Color', value: 'solid'},
          {title: 'Gradient', value: 'gradient'},
          {title: 'Image', value: 'image'},
        ],
        layout: 'radio',
      },
      initialValue: 'solid',
    }),
    defineField({
      name: 'bgColor',
      title: 'Color',
      type: 'string',
      options: {list: COLOR_LIST},
      hidden: ({parent}: any) => parent?.bgType !== 'solid',
    }),
    defineField({
      name: 'gradientFrom',
      title: 'Gradient Start Color',
      type: 'string',
      options: {list: COLOR_LIST},
      hidden: ({parent}: any) => parent?.bgType !== 'gradient',
    }),
    defineField({
      name: 'gradientTo',
      title: 'Gradient End Color',
      type: 'string',
      options: {list: COLOR_LIST},
      hidden: ({parent}: any) => parent?.bgType !== 'gradient',
    }),
    defineField({
      name: 'gradientDirection',
      title: 'Gradient Direction',
      type: 'string',
      options: {
        list: [
          {title: 'Top → Bottom', value: 'to bottom'},
          {title: 'Bottom → Top', value: 'to top'},
          {title: 'Left → Right', value: 'to right'},
          {title: 'Right → Left', value: 'to left'},
          {title: 'Diagonal ↘', value: 'to bottom right'},
          {title: 'Diagonal ↗', value: 'to top right'},
          {title: 'Diagonal ↙', value: 'to bottom left'},
          {title: 'Diagonal ↖', value: 'to top left'},
        ],
        layout: 'radio',
      },
      initialValue: 'to bottom',
      hidden: ({parent}: any) => parent?.bgType !== 'gradient',
    }),
    defineField({
      name: 'gradientStop',
      title: 'Start Color Weight (%)',
      type: 'number',
      description: 'How far the start color extends before fading into the end color (0–100). Default 56.',
      initialValue: 56,
      validation: (r) => r.min(0).max(100),
      hidden: ({parent}: any) => parent?.bgType !== 'gradient',
    }),
    defineField({
      name: 'bgImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
      hidden: ({parent}: any) => parent?.bgType !== 'image',
    }),
  ],
})
