import {defineField, defineType, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
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
      name: 'splashAccentsEnabled',
      title: 'Splash Accents',
      type: 'boolean',
      description: 'Show decorative camera splash graphics in section corners across all pages.',
      initialValue: true,
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
      name: 'primaryLogo',
      title: 'Primary Logo',
      type: 'image',
      group: 'general',
      description:
        'The logo used everywhere on the site: navigation bar, footer, browser tab icon, and social share preview images. Has its own white background built in, so it displays cleanly no matter what page background sits behind it. Update this one field and the new logo appears everywhere automatically (favicon excepted — that\'s a static file and needs a manual regenerate).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'primaryLogoTransparent',
      title: 'Primary Logo (Transparent)',
      type: 'image',
      group: 'general',
      description:
        'Optional. A transparent PNG of the primary (dark ink) logo, with no white backdrop baked in. For placements on a light background where a white box behind the logo isn\'t wanted. Not used anywhere on the site by default.',
    }),
    defineField({
      name: 'invertedLogo',
      title: 'Inverted Logo (Transparent)',
      type: 'image',
      group: 'general',
      description:
        'Optional. A transparent PNG of the light/inverted logo version, reserved for future use on dark or black backgrounds where a white backdrop isn\'t wanted. Not used anywhere on the site by default.',
    }),
    defineField({
      name: 'invertedLogoBlackBg',
      title: 'Inverted Logo (Black Background)',
      type: 'image',
      group: 'general',
      description:
        'Optional. The inverted (light ink) logo with a solid black background baked in. Not used anywhere on the site by default.',
    }),
    defineField({
      name: 'wordmarkBlack',
      title: 'Wordmark (Black)',
      type: 'image',
      group: 'general',
      description:
        'Transparent PNG of the "BREEZE MOTION STUDIO" wordmark in black, for placement on light backgrounds. Not used anywhere on the site by default until placements are specified.',
      options: {accept: 'image/png'},
    }),
    defineField({
      name: 'wordmarkWhite',
      title: 'Wordmark (White)',
      type: 'image',
      group: 'general',
      description:
        'Transparent PNG of the "BREEZE MOTION STUDIO" wordmark in white, for placement on dark backgrounds. Not used anywhere on the site by default until placements are specified.',
      options: {accept: 'image/png'},
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
    defineField({name: 'footerLinksHeading', title: 'Links Column Heading', type: 'string', group: 'footer', description: 'Heading above the quick links column. Default: "Quick Links".', initialValue: 'Quick Links'}),
    defineField({name: 'footerContactHeading', title: 'Contact Column Heading', type: 'string', group: 'footer', description: 'Heading above the contact column. Default: "Get In Touch".', initialValue: 'Get In Touch'}),
    defineField({name: 'footerFollowHeading', title: 'Social Column Heading', type: 'string', group: 'footer', description: 'Heading above the social media column. Default: "Follow".', initialValue: 'Follow'}),
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
