import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
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
      title: 'Introductory Copy',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'email',
      title: 'Display Email',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone / WhatsApp',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'formHeading',
      title: 'Form Section Heading',
      type: 'string',
      group: 'content',
    }),
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Contact Page'}
    },
  },
})
