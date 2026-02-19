import {defineField, defineType, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'pages', title: 'Page Intros'},
    {name: 'header', title: 'Header & Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'contact', title: 'Contact'},
    {name: 'social', title: 'Social Media'},
  ],
  fields: [
    // — General —
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'description',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      group: 'general',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'logoLight',
      title: 'Logo (Light / Dark Background Version)',
      type: 'image',
      group: 'general',
      description: 'For use on dark backgrounds',
    }),

    // — Page Intros —
    defineField({
      name: 'studiosPageIntro',
      title: 'Studios Listing Page Intro',
      type: 'text',
      rows: 3,
      group: 'pages',
      description: 'Brief intro shown on white below the heading on the Studios listing page',
    }),
    defineField({
      name: 'caseStudiesPageIntro',
      title: 'Case Studies Listing Page Intro',
      type: 'text',
      rows: 3,
      group: 'pages',
      description: 'Brief intro shown on white below the heading on the Case Studies listing page',
    }),

    // — Header & Navigation —
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      group: 'header',
      description: 'Controls the links shown in the top navigation bar',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL Path',
              type: 'string',
              description: 'e.g. /services or /about',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
          },
        }),
      ],
    }),
    defineField({
      name: 'navCta',
      title: 'Navigation CTA Button',
      type: 'object',
      group: 'header',
      description: 'Optional call-to-action button displayed on the right of the nav (e.g. Get In Touch)',
      fields: [
        defineField({name: 'label', title: 'Button Label', type: 'string'}),
        defineField({name: 'href', title: 'URL Path', type: 'string'}),
      ],
    }),

    // — Logo: Plain —
    defineField({
      name: 'plainLogo',
      title: 'Plain Logo',
      type: 'object',
      group: 'header',
      description: 'Unaltered logo displayed in the navigation bar',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show Plain Logo',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'sizePreset',
          title: 'Size Preset',
          type: 'string',
          options: {
            list: [
              {title: 'Small — 28px', value: 'small'},
              {title: 'Medium — 44px', value: 'medium'},
              {title: 'Large — 56px', value: 'large'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'large',
        }),
        defineField({
          name: 'customSize',
          title: 'Custom Size (px)',
          type: 'number',
          description: 'Enter a pixel value to override the preset above (e.g. 38). Leave blank to use the preset.',
          validation: (rule) => rule.min(16).max(120),
        }),
      ],
    }),

    // — Logo: Round Crop —
    defineField({
      name: 'roundLogo',
      title: 'Round Crop Logo',
      type: 'object',
      group: 'header',
      description: 'Logo displayed inside a circular crop in the navigation bar',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show Round Crop Logo',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'sizePreset',
          title: 'Size Preset',
          type: 'string',
          options: {
            list: [
              {title: 'Small — 28px', value: 'small'},
              {title: 'Medium — 36px', value: 'medium'},
              {title: 'Large — 48px', value: 'large'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'medium',
        }),
        defineField({
          name: 'customSize',
          title: 'Custom Size (px)',
          type: 'number',
          description: 'Enter a pixel value to override the preset above (e.g. 40). Leave blank to use the preset.',
          validation: (rule) => rule.min(16).max(120),
        }),
      ],
    }),

    // — Footer —

    // — Footer Logo: Plain —
    defineField({
      name: 'footerPlainLogo',
      title: 'Plain Logo',
      type: 'object',
      group: 'footer',
      description: 'Unaltered logo displayed in the footer brand column',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show Plain Logo',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'sizePreset',
          title: 'Size Preset',
          type: 'string',
          options: {
            list: [
              {title: 'Small — 28px', value: 'small'},
              {title: 'Medium — 44px', value: 'medium'},
              {title: 'Large — 56px', value: 'large'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'medium',
        }),
        defineField({
          name: 'customSize',
          title: 'Custom Size (px)',
          type: 'number',
          description: 'Enter a pixel value to override the preset above. Leave blank to use the preset.',
          validation: (rule) => rule.min(16).max(120),
        }),
      ],
    }),

    // — Footer Logo: Round Crop —
    defineField({
      name: 'footerRoundLogo',
      title: 'Round Crop Logo',
      type: 'object',
      group: 'footer',
      description: 'Logo displayed inside a circular crop in the footer brand column',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show Round Crop Logo',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'sizePreset',
          title: 'Size Preset',
          type: 'string',
          options: {
            list: [
              {title: 'Small — 28px', value: 'small'},
              {title: 'Medium — 36px', value: 'medium'},
              {title: 'Large — 48px', value: 'large'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'medium',
        }),
        defineField({
          name: 'customSize',
          title: 'Custom Size (px)',
          type: 'number',
          description: 'Enter a pixel value to override the preset above. Leave blank to use the preset.',
          validation: (rule) => rule.min(16).max(120),
        }),
      ],
    }),

    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
      group: 'footer',
      description: 'Short description shown under the logo in the footer',
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Quick Links',
      type: 'array',
      group: 'footer',
      description: 'Links shown in the footer navigation column',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL Path',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
          },
        }),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Copyright Notice',
      type: 'string',
      group: 'footer',
      description: 'e.g. © 2025 Breeze Motion Studio. All rights reserved.',
    }),

    // — Contact —
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Phone / WhatsApp',
      type: 'string',
      group: 'contact',
    }),

    // — Social Media —
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'platform', title: 'Platform', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
