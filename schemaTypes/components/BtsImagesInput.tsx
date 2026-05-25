import React, {useEffect} from 'react'
import {useFormValue, useClient} from 'sanity'

type Props = {
  value?: unknown
  path?: unknown[]
  renderDefault: (props: any) => React.ReactElement
  [key: string]: unknown
}

// Converts a Sanity Path array to a patch path string
// e.g. ['sections', {_key:'abc'}, 'btsImages'] → 'sections[_key=="abc"].btsImages'
function pathToString(path: unknown[]): string {
  let result = ''
  for (const segment of path) {
    if (typeof segment === 'string') {
      result = result ? `${result}.${segment}` : segment
    } else if (typeof segment === 'number') {
      result = `${result}[${segment}]`
    } else if (segment && typeof (segment as any)._key === 'string') {
      result = `${result}[_key=="${(segment as any)._key}"]`
    }
  }
  return result
}

export function BtsImagesInput(props: Props) {
  const {value, path, renderDefault} = props
  const client = useClient({apiVersion: '2025-01-01'})
  const docId = useFormValue(['_id']) as string | undefined

  useEffect(() => {
    if (!docId || !path) return

    const currentItems = (value as any[]) ?? []
    const existingRefs = new Set(
      currentItems
        .filter((item: any) => item?._type === 'projectBts' && item?.project?._ref)
        .map((item: any) => item.project._ref as string),
    )

    client
      .fetch<{_id: string}[]>(
        `*[_type == "project" && defined(btsImages[0])] | order(completedAt desc, _createdAt desc){ _id }`,
      )
      .then((projects) => {
        const newProjects = projects.filter((p) => !existingRefs.has(p._id))
        if (!newProjects.length) return

        const newItems = newProjects.map((p) => ({
          _type: 'projectBts',
          _key: `auto${p._id.replace(/-/g, '').slice(0, 12)}`,
          project: {_type: 'reference', _ref: p._id},
          enabled: true,
          autoPulled: true,
        }))

        const fieldPath = pathToString(path as unknown[])
        client
          .patch(docId)
          .set({[fieldPath]: [...currentItems, ...newItems]})
          .commit({returnDocuments: false})
          .catch(console.error)
      })
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return renderDefault(props)
}
