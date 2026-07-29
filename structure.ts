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
  ControlsIcon,
  WarningOutlineIcon,
} from '@sanity/icons'
import {CaseStudyPane} from './components/CaseStudyPane'

// Singleton document types (excluded from generic lists)
const SINGLETONS = [
  'siteSettings',
  'homePage',
  'aboutPage',
  'contactPage',
  'servicesPage',
  'studiosPage',
  'caseStudiesPage',
  'projectPageTemplate',
  'caseStudyPageTemplate',
  'studioPageTemplate',
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

              S.divider(),

              S.listItem()
                .title('Sub Page Templates')
                .icon(ControlsIcon)
                .child(
                  S.list()
                    .title('Sub Page Templates')
                    .items([
                      S.listItem()
                        .title('Project Page Template')
                        .icon(ControlsIcon)
                        .child(
                          S.document()
                            .schemaType('projectPageTemplate')
                            .documentId('projectPageTemplate')
                            .title('Project Page Template'),
                        ),

                      S.listItem()
                        .title('Case Study Page Template')
                        .icon(ControlsIcon)
                        .child(
                          S.document()
                            .schemaType('caseStudyPageTemplate')
                            .documentId('caseStudyPageTemplate')
                            .title('Case Study Page Template'),
                        ),

                      S.listItem()
                        .title('Studio Page Template')
                        .icon(ControlsIcon)
                        .child(
                          S.document()
                            .schemaType('studioPageTemplate')
                            .documentId('studioPageTemplate')
                            .title('Studio Page Template'),
                        ),
                    ]),
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

              // Featured Case Studies — projects with the full dedicated-page treatment
              S.listItem()
                .title('Featured Case Studies')
                .icon(DocumentTextIcon)
                .child(
                  S.documentList()
                    .title('Featured Case Studies')
                    .filter('_type == "project" && showAsCaseStudy == true')
                    .defaultOrdering([{field: 'caseStudyOrder', direction: 'asc'}])
                    .child((docId: string) =>
                      S.document()
                        .documentId(docId)
                        .schemaType('project')
                        .views([
                          S.view.component(CaseStudyPane).title('Case Study'),
                          S.view.form().title('Full Project'),
                        ]),
                    ),
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

              S.divider(),

              // Archive
              S.listItem()
                .title('Archive — Pending Migration')
                .icon(WarningOutlineIcon)
                .child(
                  S.list()
                    .title('Archive — Pending Migration')
                    .items([
                      S.listItem()
                        .title('Case Studies (Old System)')
                        .icon(DocumentTextIcon)
                        .child(
                          S.documentTypeList('caseStudy')
                            .title('Case Studies — Migrate to Projects'),
                        ),
                    ]),
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
          !['studio', 'project', 'client', 'testimonial', 'serviceCategory', 'serviceCombination', 'caseStudy'].includes(
            id,
          )
        )
      }),
    ])
