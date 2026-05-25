import type {StructureResolver} from 'sanity/structure'
import {
  CogIcon,
  HomeIcon,
  UserIcon,
  EnvelopeIcon,
  ComponentIcon,
  ImageIcon,
  DocumentTextIcon,
  UsersIcon,
  BlockquoteIcon,
  BulbOutlineIcon,
  EarthGlobeIcon,
  ArchiveIcon,
  SparklesIcon,
  FolderIcon,
} from '@sanity/icons'

// Singleton document types (excluded from generic lists)
const SINGLETONS = [
  'siteSettings',
  'homePage',
  'aboutPage',
  'contactPage',
  'servicesPage',
  'studiosPage',
  'caseStudiesPage',
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Breeze Motion Studio')
    .items([
      // — Website Pages —
      S.listItem()
        .title('Website Pages')
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title('Website Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .icon(HomeIcon)
                .child(
                  S.document().schemaType('homePage').documentId('homePage').title('Home Page'),
                ),

              S.listItem()
                .title('About Page')
                .icon(UserIcon)
                .child(
                  S.document().schemaType('aboutPage').documentId('aboutPage').title('About Page'),
                ),

              S.listItem()
                .title('Contact Page')
                .icon(EnvelopeIcon)
                .child(
                  S.document()
                    .schemaType('contactPage')
                    .documentId('contactPage')
                    .title('Contact Page'),
                ),

              S.listItem()
                .title('Services Page')
                .icon(SparklesIcon)
                .child(
                  S.document()
                    .schemaType('servicesPage')
                    .documentId('servicesPage')
                    .title('Services Page'),
                ),

              S.listItem()
                .title('Studio Page')
                .icon(ComponentIcon)
                .child(
                  S.document()
                    .schemaType('studiosPage')
                    .documentId('studiosPage')
                    .title('Studio Page'),
                ),

              S.listItem()
                .title('Case Studies Page')
                .icon(DocumentTextIcon)
                .child(
                  S.document()
                    .schemaType('caseStudiesPage')
                    .documentId('caseStudiesPage')
                    .title('Case Studies Page'),
                ),
            ]),
        ),

      S.divider(),

      // — Content Library —
      S.listItem()
        .title('Content Library')
        .icon(ArchiveIcon)
        .child(
          S.list()
            .title('Content Library')
            .items([
              // Studios
              S.listItem()
                .title('Studios')
                .icon(ComponentIcon)
                .child(S.documentTypeList('studio').title('Studios')),

              // Case Studies — all projects with any case study content
              S.listItem()
                .title('Case Studies')
                .icon(DocumentTextIcon)
                .child(
                  S.documentList()
                    .title('Case Studies')
                    .filter('_type == "project" && (defined(caseStudyOverview) || defined(caseStudyChallenge) || defined(caseStudyApproach) || defined(caseStudyOutcome))')
                    .defaultOrdering([{field: 'caseStudyOrder', direction: 'asc'}]),
                ),

              S.divider(),

              // Project Library — grouped by client
              S.listItem()
                .title('Project Library')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Project Library')
                    .items([
                      S.listItem()
                        .title('All Projects')
                        .icon(ImageIcon)
                        .child(S.documentTypeList('project').title('All Projects')),

                      S.divider(),

                      S.listItem()
                        .title('By Client')
                        .icon(UsersIcon)
                        .child(
                          S.documentTypeList('client')
                            .title('Select a Client')
                            .child((clientId) =>
                              S.documentList()
                                .title('Projects')
                                .filter('_type == "project" && client._ref == $id')
                                .params({id: clientId})
                                .defaultOrdering([{field: 'completedAt', direction: 'desc'}]),
                            ),
                        ),
                    ]),
                ),

              // Clients
              S.listItem()
                .title('Clients')
                .icon(UsersIcon)
                .child(S.documentTypeList('client').title('Clients')),

              S.divider(),

              // Testimonials
              S.listItem()
                .title('Testimonials')
                .icon(BlockquoteIcon)
                .child(S.documentTypeList('testimonial').title('Testimonials')),

              // Service Categories
              S.listItem()
                .title('Service Categories')
                .icon(BulbOutlineIcon)
                .child(S.documentTypeList('serviceCategory').title('Service Categories')),

              // Services Combination Examples
              S.listItem()
                .title('Services Combination Examples')
                .icon(SparklesIcon)
                .child(
                  S.documentTypeList('serviceCombination').title('Services Combination Examples'),
                ),
            ]),
        ),

      S.divider(),

      // — Configuration —
      S.listItem()
        .title('Configuration')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
        ),

      // Filter out singletons and already-listed types from the auto-generated list
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return (
          id !== undefined &&
          !SINGLETONS.includes(id) &&
          !['studio', 'project', 'client', 'testimonial', 'serviceCategory', 'serviceCombination'].includes(
            id,
          )
        )
      }),
    ])
