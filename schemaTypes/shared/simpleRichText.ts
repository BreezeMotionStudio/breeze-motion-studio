import {defineArrayMember, defineType} from 'sanity'

export const simpleRichText = defineType({
  title: 'Simple Rich Text',
  name: 'simpleRichText',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [],
      },
    }),
  ],
})
