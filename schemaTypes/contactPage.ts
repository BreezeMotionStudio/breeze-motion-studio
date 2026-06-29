import {defineField, defineType, defineArrayMember} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'
import {seoFields} from './shared/seoFields'

const disabledField = defineField({
  name: 'disabled',
  title: 'Hide this section',
  type: 'boolean',
  description: 'When ticked, this section will not appear on the website.',
  initialValue: false,
})

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'sections', title: 'Sections', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'sections',
      description: 'Drag to reorder sections. Click + to add a new section.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactHero',
          title: 'Hero',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'heroImage',
              title: 'Hero Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Displayed in the diagonal frame on the right side of the hero.',
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
            }),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {title: 'heading', disabled: 'disabled'},
            prepare({title, disabled}) {
              return {title: disabled ? '[HIDDEN] Hero' : 'Hero', subtitle: title}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'contactIntro',
          title: 'Intro Text',
          fields: [
            defineField({name: 'content', title: 'Content', type: 'blockContent'}),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Intro Text' : 'Intro Text'}
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'contactDetails',
          title: 'Contact Details & Form',
          fields: [
            defineField({name: 'getInTouchLabel', title: 'Section Heading', type: 'string', description: 'Heading above the contact details. Default: "Get In Touch".', initialValue: 'Get In Touch'}),
            defineField({name: 'emailLabel', title: 'Email Field Label', type: 'string', description: 'Label above the email address. Default: "Email".', initialValue: 'Email'}),
            defineField({name: 'phoneLabel', title: 'Phone Field Label', type: 'string', description: 'Label above the phone number. Default: "Phone / WhatsApp".', initialValue: 'Phone / WhatsApp'}),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
              validation: (r) => r.required().email(),
            }),
            defineField({name: 'phone', title: 'Phone / WhatsApp', type: 'string'}),
            defineField({name: 'note', title: 'Contact Note', type: 'text', rows: 3, description: 'Short note shown below the email/phone, above the form.'}),
            defineField({name: 'formHeading', title: 'Form Heading', type: 'string'}),
            defineField({name: 'namePlaceholder', title: 'Name Field Placeholder', type: 'string', initialValue: 'Your name'}),
            defineField({name: 'emailPlaceholder', title: 'Email Field Placeholder', type: 'string', initialValue: 'Your email'}),
            defineField({name: 'companyPlaceholder', title: 'Company Field Placeholder', type: 'string', initialValue: 'Company / Organisation (optional)'}),
            defineField({name: 'messagePlaceholder', title: 'Message Field Placeholder', type: 'string', initialValue: 'Tell us about your project'}),
            defineField({name: 'submitLabel', title: 'Submit Button Label', type: 'string', description: 'Text on the form submit button, e.g. "Send Message".', initialValue: 'Send Message'}),
            defineField({name: 'formBg', title: 'Form Container Background', type: 'sectionBackground'}),
            defineField({name: 'sectionBg', title: 'Background', type: 'sectionBackground', description: 'Solid color, gradient, or image. Leave blank to use the default.'}),
            disabledField,
          ],
          preview: {
            select: {disabled: 'disabled'},
            prepare({disabled}) {
              return {title: disabled ? '[HIDDEN] Contact Details & Form' : 'Contact Details & Form'}
            },
          },
        }),
      ],
    }),

    ...seoFields,
  ],
  preview: {
    prepare() {
      return {title: 'Contact Page'}
    },
  },
})
