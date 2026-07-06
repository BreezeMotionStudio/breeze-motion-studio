import {defineField, defineType} from 'sanity'
import {COLOR_LIST} from './sectionBackground'

// Brand fonts only — must stay in sync with the three fonts loaded in web/src/app/layout.tsx
export const FONT_LIST = [
  {title: 'Brand — Cormorant SC', value: 'brand'},
  {title: 'Functional — Arial', value: 'functional'},
  {title: 'Body — Calibri', value: 'body'},
]

export const SIZE_LIST = [
  {title: 'XS', value: 'xs'},
  {title: 'Small', value: 'sm'},
  {title: 'Base', value: 'base'},
  {title: 'Large', value: 'lg'},
  {title: 'XL', value: 'xl'},
  {title: '2XL', value: '2xl'},
  {title: '3XL', value: '3xl'},
  {title: '4XL', value: '4xl'},
  {title: '5XL', value: '5xl'},
  {title: '6XL', value: '6xl'},
  {title: '7XL', value: '7xl'},
]

// Portable text annotations — added to simpleRichText and blockContent so any
// selected text can have its color, font, or size overridden from the default.
export const textColor = defineType({
  name: 'textColor',
  title: 'Text Color',
  type: 'object',
  fields: [defineField({name: 'color', title: 'Color', type: 'string', options: {list: COLOR_LIST}})],
})

export const textFont = defineType({
  name: 'textFont',
  title: 'Font',
  type: 'object',
  fields: [defineField({name: 'font', title: 'Font', type: 'string', options: {list: FONT_LIST}})],
})

export const textSize = defineType({
  name: 'textSize',
  title: 'Size',
  type: 'object',
  fields: [defineField({name: 'size', title: 'Size', type: 'string', options: {list: SIZE_LIST}})],
})

// Plain (non-rich-text) style control for fields that must stay plain strings
// because their value also drives behavior (e.g. mailto:/tel: links, validation).
export const textStyle = defineType({
  name: 'textStyle',
  title: 'Text Style',
  type: 'object',
  options: {columns: 3},
  fields: [
    defineField({name: 'color', title: 'Color', type: 'string', options: {list: COLOR_LIST}}),
    defineField({name: 'font', title: 'Font', type: 'string', options: {list: FONT_LIST}}),
    defineField({name: 'size', title: 'Size', type: 'string', options: {list: SIZE_LIST}}),
  ],
})
