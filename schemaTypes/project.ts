import {defineField, defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ImageIcon,
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'deliverables', title: 'Deliverables'},
    {name: 'bts', title: 'Behind the Scenes'},
    {name: 'caseStudy', title: 'Case Study'},
    {name: 'settings', title: 'Settings'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ─── Basics ────────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'basics',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'studio',
      title: 'Studio',
      type: 'reference',
      to: [{type: 'studio'}],
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services Provided',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'serviceCategory'}]})],
      group: 'basics',
    }),
    defineField({
      name: 'year',
      title: 'Project Year',
      type: 'string',
      group: 'basics',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'basics',
      description: 'One-line descriptor shown on project cards (max 100 characters)',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      group: 'basics',
      description: 'Shown on project cards and the case studies listing page (max 300 characters)',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'blockContent',
      group: 'basics',
      description: 'Full project intro — shown at the top of the project detail page',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      group: 'basics',
      description: 'Used as the thumbnail on all project cards site-wide',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) => rule.required().warning('Alt text is important for accessibility'),
        }),
        defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', initialValue: false}),
      ],
    }),

    // ─── Deliverables ──────────────────────────────────────────────────────────
    defineField({
      name: 'deliverableImages',
      title: 'Deliverable Images',
      type: 'array',
      group: 'deliverables',
      description: 'Drag and drop your final finished images. Displayed as the main portfolio gallery on the project page.',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
            defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', initialValue: false}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'deliverableVideos',
      title: 'Deliverable Videos',
      type: 'array',
      group: 'deliverables',
      description: 'YouTube or Vimeo embeds for final finished video deliverables.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'deliverableVideo',
          title: 'Video Embed',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Vimeo', value: 'vimeo'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'radio',
              },
              initialValue: 'youtube',
            }),
            defineField({
              name: 'url',
              title: 'Video URL',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({name: 'title', type: 'string', title: 'Title / Label'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'platform', url: 'url'},
            prepare({title, subtitle, url}: {title?: string; subtitle?: string; url?: string}) {
              return {title: title || url || 'Video', subtitle}
            },
          },
        }),
      ],
    }),

    // ─── Behind the Scenes ─────────────────────────────────────────────────────
    defineField({
      name: 'btsNote',
      title: 'Behind the Scenes Note',
      type: 'text',
      rows: 3,
      group: 'bts',
      description: 'Optional paragraph about process, context, or making-of',
    }),
    defineField({
      name: 'btsImages',
      title: 'Behind the Scenes Images',
      type: 'array',
      group: 'bts',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
            defineField({name: 'roundCrop', type: 'boolean', title: 'Round Crop', initialValue: false}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'btsVideos',
      title: 'Behind the Scenes Videos',
      type: 'array',
      group: 'bts',
      description: 'YouTube or Vimeo embeds for behind the scenes footage.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'btsVideo',
          title: 'Video Embed',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Vimeo', value: 'vimeo'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'radio',
              },
              initialValue: 'youtube',
            }),
            defineField({
              name: 'url',
              title: 'Video URL',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({name: 'title', type: 'string', title: 'Title / Label'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'platform', url: 'url'},
            prepare({title, subtitle, url}: {title?: string; subtitle?: string; url?: string}) {
              return {title: title || url || 'Video', subtitle}
            },
          },
        }),
      ],
    }),

    // ─── Case Study ────────────────────────────────────────────────────────────
    defineField({
      name: 'showAsCaseStudy',
      title: 'Feature as Case Study',
      type: 'boolean',
      group: 'caseStudy',
      description: 'When enabled, this project appears on the Case Studies page with a full narrative.',
      initialValue: false,
    }),
    defineField({
      name: 'caseStudyOrder',
      title: 'Case Study Display Order',
      type: 'number',
      group: 'caseStudy',
      description: 'Lower numbers appear first on the Case Studies page.',
      initialValue: 0,
      hidden: ({parent}) => !parent?.showAsCaseStudy,
    }),
    defineField({
      name: 'caseStudyOverview',
      title: 'Overview',
      type: 'text',
      rows: 4,
      group: 'caseStudy',
      description: 'One paragraph framing the project for the reader',
      hidden: ({parent}) => !parent?.showAsCaseStudy,
    }),
    defineField({
      name: 'caseStudyChallenge',
      title: 'The Challenge',
      type: 'blockContent',
      group: 'caseStudy',
      hidden: ({parent}) => !parent?.showAsCaseStudy,
    }),
    defineField({
      name: 'caseStudyApproach',
      title: 'The Approach',
      type: 'blockContent',
      group: 'caseStudy',
      hidden: ({parent}) => !parent?.showAsCaseStudy,
    }),
    defineField({
      name: 'caseStudyOutcome',
      title: 'The Outcome',
      type: 'blockContent',
      group: 'caseStudy',
      hidden: ({parent}) => !parent?.showAsCaseStudy,
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'reference',
      to: [{type: 'testimonial'}],
      group: 'caseStudy',
      hidden: ({parent}) => !parent?.showAsCaseStudy,
    }),

    // ─── Settings ──────────────────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'In Progress', value: 'inProgress'},
          {title: 'Complete', value: 'complete'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'completedAt',
      title: 'Completion Date',
      type: 'date',
      group: 'settings',
      description: 'Sets position in the "Latest Projects" strip — newest first. Only relevant when status is Complete.',
      hidden: ({parent}) => parent?.status !== 'complete',
    }),
    defineField({
      name: 'isHighlight',
      title: 'Show in Highlights Strip',
      type: 'boolean',
      group: 'settings',
      description: 'Display this project in the auto-scrolling highlights carousel on the Studios page.',
      initialValue: false,
    }),
    defineField({
      name: 'highlightOrder',
      title: 'Highlight Display Order',
      type: 'number',
      group: 'settings',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      hidden: ({parent}) => !parent?.isHighlight,
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Featured Display Order',
      type: 'number',
      group: 'settings',
      initialValue: 0,
      hidden: ({parent}) => !parent?.featured,
    }),
    defineField({
      name: 'manualOrder',
      title: 'Override Sort Order Manually',
      type: 'boolean',
      group: 'settings',
      description: 'By default projects sort by completion date (newest first). Enable this to pin a project to a specific position.',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Manual Position',
      type: 'number',
      group: 'settings',
      description: 'Lower numbers appear first. Pinned projects sort before all date-ordered projects.',
      hidden: ({parent}) => !parent?.manualOrder,
    }),
    defineField({
      name: 'sectionOrderVideos',
      title: 'Section Position — Video Deliverables',
      type: 'number',
      group: 'settings',
      description: 'Default: 1 (appears first). Lower number = higher on the page.',
      initialValue: 1,
    }),
    defineField({
      name: 'sectionOrderImages',
      title: 'Section Position — Image Deliverables',
      type: 'number',
      group: 'settings',
      description: 'Default: 2 (appears second). Lower number = higher on the page.',
      initialValue: 2,
    }),
    defineField({
      name: 'sectionOrderBts',
      title: 'Section Position — Behind the Scenes',
      type: 'number',
      group: 'settings',
      description: 'Default: 3 (appears last). Lower number = higher on the page.',
      initialValue: 3,
    }),

    ...seoFields,
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'completedDesc',
      by: [{field: 'completedAt', direction: 'desc'}],
    },
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client.name',
      media: 'coverImage',
    },
  },
})
