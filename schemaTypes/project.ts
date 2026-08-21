import {defineField, defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'
import {DeliverablesInput} from './components/DeliverablesInput'

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
      description: 'Shown on project cards and the case studies listing page (max 500 characters)',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'blockContent',
      group: 'basics',
      description: 'Full project narrative — shown on the Case Study page only, not on the project page.',
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      group: 'deliverables',
      description: 'Type any deliverable or pick from the suggestions — press Enter or click Add to confirm.',
      components: {input: DeliverablesInput as any},
      of: [defineArrayMember({type: 'string'})],
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
      name: 'btsImages',
      title: 'Behind the Scenes Images',
      type: 'array',
      group: 'bts',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          validation: (r) => r.required(),
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
      title: 'Feature on Case Studies Page',
      type: 'boolean',
      group: 'caseStudy',
      description:
        'Only for the handful of specially designed, full-page case studies. When enabled, this project appears on the public Case Studies listing page with its own dedicated page. Most projects should leave this off and use the Case Study PDF field instead. The case study fields below are always visible so you can fill them in regardless of this toggle.',
      initialValue: false,
    }),
    defineField({
      name: 'caseStudyPdf',
      title: 'Case Study PDF',
      type: 'file',
      group: 'caseStudy',
      options: {accept: 'application/pdf'},
      description:
        'Upload the one-page A4 case study PDF for this project. Shown as a "View Case Study" link on the project page for projects that are not featured above.',
    }),
    defineField({
      name: 'caseStudyPdfPreview',
      title: 'Case Study PDF — Thumbnail Preview',
      type: 'image',
      group: 'caseStudy',
      options: {hotspot: true, accept: 'image/png'},
      description:
        'A PNG image preview of the Case Study PDF — shown to visitors when they click "View Case Study", with a Download PDF button alongside it. Export at high resolution (2x) so the text stays sharp when enlarged. Required whenever a Case Study PDF is uploaded above.',
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {caseStudyPdf?: unknown} | undefined
          if (parent?.caseStudyPdf && !value) {
            return 'Required when a Case Study PDF is uploaded above'
          }
          return true
        }),
    }),
    defineField({
      name: 'caseStudyOrder',
      title: 'Display Order on Case Studies Page',
      type: 'number',
      group: 'caseStudy',
      description: 'Lower numbers appear first. Only relevant when featured above.',
      initialValue: 0,
    }),
    defineField({
      name: 'caseStudyOverview',
      title: 'Overview',
      type: 'text',
      rows: 4,
      group: 'caseStudy',
      description: 'One paragraph framing the project for the reader',
    }),
    defineField({
      name: 'caseStudyChallenge',
      title: 'The Challenge',
      type: 'blockContent',
      group: 'caseStudy',
    }),
    defineField({
      name: 'caseStudyChallengeImage',
      title: 'The Challenge — Image',
      type: 'image',
      options: {hotspot: true},
      group: 'caseStudy',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'caseStudyApproach',
      title: 'The Approach',
      type: 'blockContent',
      group: 'caseStudy',
    }),
    defineField({
      name: 'caseStudyApproachImage',
      title: 'The Approach — Image',
      type: 'image',
      options: {hotspot: true},
      group: 'caseStudy',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'caseStudyOutcome',
      title: 'The Outcome',
      type: 'blockContent',
      group: 'caseStudy',
    }),
    defineField({
      name: 'caseStudyOutcomeImage',
      title: 'The Outcome — Image',
      type: 'image',
      options: {hotspot: true},
      group: 'caseStudy',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'reference',
      to: [{type: 'testimonial'}],
      group: 'caseStudy',
    }),
    defineField({
      name: 'caseStudySliderImages',
      title: 'Case Study Image Slider — Custom Selection',
      type: 'array',
      group: 'caseStudy',
      description: 'By default, the image slider at the bottom of the Case Study page automatically shows every image from "Deliverable Images" above, in the same order. To customize what appears in the slider specifically — remove an image, swap one out, add a different one, or reorder — add images here. Once this list has at least one image, it fully replaces the automatic pull for the slider only; the Deliverable Images gallery itself is never affected.',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
          ],
        }),
      ],
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
