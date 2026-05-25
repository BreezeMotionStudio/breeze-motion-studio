// Shared types
import {ctaButton} from './shared/ctaButton'
import {blockContent} from './blockContent'
import {simpleRichText} from './shared/simpleRichText'
import {sectionBackground} from './shared/sectionBackground'

// Document types
import {siteSettings} from './siteSettings'
import {homePage} from './homePage'
import {aboutPage} from './aboutPage'
import {contactPage} from './contactPage'
import {servicesPage} from './servicesPage'
import {studiosPage} from './studiosPage'
import {caseStudiesPage} from './caseStudiesPage'
import {studio} from './studio'
import {project} from './project'
import {caseStudy} from './caseStudy'
import {client} from './client'
import {testimonial} from './testimonial'
import {serviceCategory} from './serviceCategory'
import {serviceCombination} from './serviceCombination'

export const schemaTypes = [
  // Shared / Object types
  ctaButton,
  blockContent,
  simpleRichText,
  sectionBackground,

  // Singleton pages
  siteSettings,
  homePage,
  aboutPage,
  contactPage,
  servicesPage,
  studiosPage,
  caseStudiesPage,

  // Content documents
  studio,
  project,
  caseStudy,
  client,
  testimonial,
  serviceCategory,
  serviceCombination,
]
