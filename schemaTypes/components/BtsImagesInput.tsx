import React, {useEffect, useState} from 'react'
import {useClient} from 'sanity'

type ProjectBts = {
  _id: string
  title: string
  firstBtsImage: {asset: {url: string}; alt?: string} | null
}

// Props we need — typed loosely since ArrayInputProps isn't in Sanity's public API
type Props = {
  value?: unknown[]
  renderDefault: (props: any) => React.ReactElement
}

export function BtsImagesInput(props: Props) {
  const {value, renderDefault} = props
  const client = useClient({apiVersion: '2025-01-01'})
  const [unmanagedProjects, setUnmanagedProjects] = useState<ProjectBts[]>([])

  // Collect managed project refs so we know which to exclude from the preview
  const managedRefs = new Set(
    ((value ?? []) as any[])
      .filter((item) => item?._type === 'projectBts' && item?.project?._ref)
      .map((item) => item.project._ref as string),
  )

  useEffect(() => {
    client
      .fetch<ProjectBts[]>(
        `*[_type == "project" && defined(btsImages[0])] | order(completedAt desc, _createdAt desc){
          _id,
          title,
          "firstBtsImage": btsImages[0]{ asset->{url}, alt }
        }`,
      )
      .then((all) => setUnmanagedProjects(all.filter((p) => !managedRefs.has(p._id))))
      .catch(() => {})
  // Re-run when managed refs change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([...managedRefs].sort())])

  return (
    <div>
      {unmanagedProjects.length > 0 && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 14px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#888',
              margin: '0 0 10px 0',
            }}
          >
            Auto-displayed from projects &mdash; {unmanagedProjects.length} image
            {unmanagedProjects.length !== 1 ? 's' : ''}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
              gap: '8px',
            }}
          >
            {unmanagedProjects.map((p) =>
              p.firstBtsImage?.asset?.url ? (
                <div key={p._id}>
                  <img
                    src={`${p.firstBtsImage.asset.url}?w=180&h=135&fit=crop&auto=format&q=70`}
                    alt={p.firstBtsImage.alt || p.title}
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      objectFit: 'cover',
                      borderRadius: '3px',
                      display: 'block',
                    }}
                  />
                  <p
                    style={{
                      fontSize: '9px',
                      color: '#666',
                      margin: '3px 0 0 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.title}
                  </p>
                </div>
              ) : null,
            )}
          </div>

          <p style={{fontSize: '10px', color: '#555', margin: '10px 0 0 0', lineHeight: 1.5}}>
            These appear automatically on the website. Add a{' '}
            <strong style={{color: '#888'}}>From Project</strong> entry below to reorder, replace,
            or hide any of these.
          </p>
        </div>
      )}

      {renderDefault(props)}
    </div>
  )
}
