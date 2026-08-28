import React, {useMemo} from 'react'
import imageUrlBuilder from '@sanity/image-url'
import {set, useClient, useFormValue} from 'sanity'

// Matches the aspect-[16/6] container the frontend uses for the featured
// case study thumbnail, so this preview is a true WYSIWYG of that crop.
const PREVIEW_ASPECT_RATIO = '16 / 6'

type Props = {
  value?: number
  path: (string | number | {_key: string})[]
  onChange: (patch: any) => void
}

export function CoverImageFocalYInput(props: Props) {
  const {value, path, onChange} = props
  const client = useClient({apiVersion: '2025-01-01'})
  const builder = useMemo(() => imageUrlBuilder(client), [client])
  const imageValue = useFormValue(path.slice(0, -1)) as {asset?: {_ref: string}} | undefined

  const previewUrl = imageValue?.asset ? builder.image(imageValue as any).width(900).url() : null
  const focalY = typeof value === 'number' ? value : 50

  function handleSlide(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(set(Number(e.target.value)))
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {previewUrl ? (
        <div
          style={{
            position: 'relative',
            aspectRatio: PREVIEW_ASPECT_RATIO,
            overflow: 'hidden',
            borderRadius: 4,
            border: '1px solid var(--card-border-color, #ccc)',
          }}
        >
          <img
            src={previewUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: `50% ${focalY}%`,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            padding: 12,
            fontSize: 13,
            borderRadius: 4,
            border: '1px solid var(--card-border-color, #ccc)',
            background: 'var(--card-muted-bg-color, #f5f5f5)',
            color: 'var(--card-fg-color, #111)',
          }}
        >
          Upload an image above to preview and adjust its crop position.
        </div>
      )}
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={focalY}
        onChange={handleSlide}
        disabled={!previewUrl}
        style={{width: '100%'}}
      />
      <span style={{fontSize: 12, color: 'var(--card-fg-color, #111)', opacity: 0.65}}>
        Vertical position: {focalY}%
        {' — '}
        {focalY === 50 ? 'centered' : focalY < 50 ? 'shows more of the top' : 'shows more of the bottom'}
      </span>
    </div>
  )
}
