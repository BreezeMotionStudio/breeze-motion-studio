import React, {useEffect, useState} from 'react'
import {set, useClient, useFormValue} from 'sanity'

type ProjectImage = {
  key: string
  url: string
  alt?: string
  assetId: string
  label: string
}

type Props = {
  value?: {asset?: {_ref?: string}}
  onChange: (patch: unknown) => void
  renderDefault: (props: Props) => React.ReactElement
  [key: string]: unknown
}

// Lets an editor pick a thumbnail straight from the linked case study project's
// own Behind the Scenes / Deliverable images, instead of hunting through the
// whole dataset's asset library. The normal image input still renders below,
// so uploading a brand-new file works exactly as before.
export function ThumbnailOverrideInput(props: Props) {
  const {value, onChange, renderDefault} = props
  const client = useClient({apiVersion: '2025-01-01'})
  const caseStudyRef = useFormValue(['caseStudy', '_ref']) as string | undefined
  const [images, setImages] = useState<ProjectImage[]>([])

  useEffect(() => {
    if (!caseStudyRef) {
      setImages([])
      return
    }
    client
      .fetch<{bts: {assetId: string; url: string; alt?: string}[]; deliverables: {assetId: string; url: string; alt?: string}[]}>(
        `*[_id == $id][0]{
          "bts": btsImages[defined(asset)]{ "assetId": asset._ref, "url": asset->url, alt },
          "deliverables": deliverableImages[defined(asset)]{ "assetId": asset._ref, "url": asset->url, alt }
        }`,
        {id: caseStudyRef},
      )
      .then((res) => {
        const bts = (res?.bts ?? []).map((img, i) => ({
          key: `bts-${i}`,
          url: img.url,
          alt: img.alt,
          assetId: img.assetId,
          label: `Behind the Scenes ${i + 1}`,
        }))
        const deliverables = (res?.deliverables ?? []).map((img, i) => ({
          key: `deliverable-${i}`,
          url: img.url,
          alt: img.alt,
          assetId: img.assetId,
          label: `Deliverable ${i + 1}`,
        }))
        setImages([...bts, ...deliverables])
      })
      .catch(() => setImages([]))
  }, [caseStudyRef, client])

  const currentAssetId = value?.asset?._ref

  function pick(img: ProjectImage) {
    onChange(set({_type: 'image', asset: {_type: 'reference', _ref: img.assetId}}))
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      {!caseStudyRef && (
        <div style={{fontSize: 12, opacity: 0.6}}>
          Link a Featured Case Study above to pick from that project&apos;s own images here.
        </div>
      )}
      {caseStudyRef && images.length === 0 && (
        <div style={{fontSize: 12, opacity: 0.6}}>
          The linked project has no Behind the Scenes or Deliverable images yet.
        </div>
      )}
      {images.length > 0 && (
        <div>
          <div style={{fontSize: 12, opacity: 0.6, marginBottom: 6}}>
            Pick from this project&apos;s own images:
          </div>
          <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
            {images.map((img) => (
              <button
                key={img.key}
                type="button"
                onClick={() => pick(img)}
                title={img.label}
                style={{
                  width: 56,
                  height: 56,
                  padding: 0,
                  borderRadius: 4,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border:
                    currentAssetId === img.assetId
                      ? '2px solid #2276fc'
                      : '1px solid var(--card-border-color, #ccc)',
                  background: 'transparent',
                }}
              >
                <img
                  src={`${img.url}?w=100&h=100&fit=crop`}
                  alt={img.alt || ''}
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {renderDefault(props)}
    </div>
  )
}
