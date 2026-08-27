import {defineField, defineType, defineArrayMember} from 'sanity'
import {ComponentIcon} from '@sanity/icons'

export const serviceCombination = defineType({
  name: 'serviceCombination',
  title: 'Service Combination',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'simpleRichText'}),
    defineField({
      name: 'items',
      title: 'Typically Includes',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'caseStudy',
      title: 'Featured Case Study',
      type: 'reference',
      to: [{type: 'project'}],
      options: {
        filter: 'showAsCaseStudy == true',
      },
      description: 'Pick the published case study to link this example to. Leave blank until the case study is published.',
    }),
    defineField({
      name: 'bgImage',
      title: 'Card Background Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Optional photo shown as the card background. A dark overlay is applied automatically.',
    }),
    defineField({
      name: 'thumbnailOverride1',
      title: 'Thumbnail 1 Override',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Leave blank to auto-pull the linked case study\'s first Behind the Scenes image. Click "Select" to reuse one of that project\'s own images instead, or upload a new one.',
    }),
    defineField({
      name: 'thumbnailOverride2',
      title: 'Thumbnail 2 Override',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Leave blank to auto-pull the linked case study\'s first Deliverable image. Click "Select" to reuse one of that project\'s own images instead, or upload a new one.',
    }),
    defineField({
      name: 'thumbnailOverride3',
      title: 'Thumbnail 3 Override',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Leave blank to auto-pull the linked case study\'s second Deliverable image. Click "Select" to reuse one of that project\'s own images instead, or upload a new one.',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
  },
})
