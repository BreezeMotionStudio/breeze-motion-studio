import React, {useState} from 'react'
import {useFormValue, useClient} from 'sanity'
import type {ObjectItemProps, Path} from 'sanity'

// Converts a Sanity Path array to a dot/bracket string for client.patch()
// e.g. ['sections', {_key:'abc'}, 'highlights', {_key:'xyz'}] → 'sections[_key=="abc"].highlights[_key=="xyz"]'
function toSanityPatchPath(path: Path, field: string): string {
  let result = ''
  for (const segment of path) {
    if (typeof segment === 'string') {
      result = result ? `${result}.${segment}` : segment
    } else if (typeof segment === 'number') {
      result = `${result}[${segment}]`
    } else if (segment && typeof (segment as any)._key === 'string') {
      result = `${result}[_key=="${(segment as {_key: string})._key}"]`
    }
  }
  return result ? `${result}.${field}` : field
}

export function InlineToggleItem(props: ObjectItemProps) {
  const {value, path, renderDefault} = props
  const enabled = !!(value as any)?.enabled
  const autoPulled = !!(value as any)?.autoPulled
  const [pending, setPending] = useState<boolean | null>(null)
  const display = pending !== null ? pending : enabled

  const docId = useFormValue(['_id']) as string | undefined
  const client = useClient({apiVersion: '2025-01-01'})

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (!docId) return
    const next = !display
    setPending(next)
    client
      .patch(docId)
      .set({[toSanityPatchPath(path, 'enabled')]: next})
      .commit({returnDocuments: false})
      .then(() => setPending(null))
      .catch(() => setPending(null))
  }

  return (
    <div style={{position: 'relative'}}>
      {renderDefault(props)}
      {autoPulled && (
        <span
          style={{
            position: 'absolute',
            top: '14px',
            right: '118px',
            background: '#c0392b',
            color: '#fff',
            borderRadius: '3px',
            padding: '2px 6px',
            fontSize: '9px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: 'ui-monospace, monospace',
            lineHeight: '1.6',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          autopulled
        </span>
      )}
      <button
        type="button"
        onClick={handleToggle}
        style={{
          position: 'absolute',
          top: '12px',
          right: '68px',
          background: display ? '#535D66' : 'transparent',
          color: display ? '#fff' : '#777',
          border: `1px solid ${display ? '#535D66' : '#555'}`,
          borderRadius: '3px',
          padding: '2px 8px',
          fontSize: '10px',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          zIndex: 10,
          lineHeight: '1.6',
          fontFamily: 'ui-monospace, monospace',
          userSelect: 'none',
        }}
      >
        {display ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}
