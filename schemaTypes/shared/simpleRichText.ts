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
          {title: 'Underline', value: 'underline'},
        ],
        annotations: [
          defineArrayMember({type: 'textColor'}),
          defineArrayMember({type: 'textFont'}),
          defineArrayMember({type: 'textSize'}),
        ],
      },
    }),
  ],
})
