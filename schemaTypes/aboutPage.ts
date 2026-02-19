import {defineField, defineType, defineArrayMember} from 'sanity'
import {UserIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'founder', title: 'Founder'},
    {name: 'services', title: 'Services'},
    {name: 'process', title: 'How We Work'},
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
      name: 'studioOverview',
      title: 'Studio Overview',
      type: 'blockContent',
      group: 'content',
      description: 'What Breeze Motion Studio does — the parent entity overview',
    }),
    defineField({
      name: 'mission',
      title: 'Mission / Philosophy',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'values',
      title: 'Core Values',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),

    // — Founder —
    defineField({
      name: 'founderName',
      title: 'Founder Name',
      type: 'string',
      group: 'founder',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'founderBio',
      title: 'Founder Bio',
      type: 'blockContent',
      group: 'founder',
    }),
    defineField({
      name: 'founderImage',
      title: 'Founder Profile Photo',
      type: 'image',
      options: {hotspot: true},
      group: 'founder',
      description: 'Round-cropped in display',
    }),

    // — Services —
    defineField({
      name: 'servicesIntro',
      title: 'Services Section Intro',
      type: 'blockContent',
      group: 'services',
    }),

    // — How We Work —
    defineField({
      name: 'howWeWorkIntro',
      title: 'How We Work Intro',
      type: 'blockContent',
      group: 'process',
    }),
    defineField({
      name: 'howWeWorkSteps',
      title: 'Process Steps',
      type: 'array',
      group: 'process',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),

    // — SEO —
    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
