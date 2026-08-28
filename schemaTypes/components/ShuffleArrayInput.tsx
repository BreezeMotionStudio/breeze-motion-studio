import React, {useCallback} from 'react'
import {set} from 'sanity'

type Props = {
  value?: unknown[]
  onChange: (patch: any) => void
  renderDefault: (props: any) => React.ReactElement
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function ShuffleArrayInput(props: Props) {
  const {value, onChange, renderDefault} = props
  const items = Array.isArray(value) ? value : []

  const handleShuffle = useCallback(() => {
    if (items.length < 2) return
    onChange(set(shuffle(items)))
  }, [items, onChange])

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      <div>
        <button
          type="button"
          onClick={handleShuffle}
          disabled={items.length < 2}
          title={items.length < 2 ? 'Add at least 2 images to shuffle' : 'Randomly reorder these images'}
          style={{
            padding: '6px 14px',
            fontSize: 13,
            border: '1px solid var(--card-border-color, #ccc)',
            borderRadius: 3,
            background: 'transparent',
            color: 'var(--card-fg-color, #111)',
            cursor: items.length < 2 ? 'default' : 'pointer',
            opacity: items.length < 2 ? 0.4 : 1,
          }}
        >
          🔀 Shuffle Order
        </button>
      </div>
      {renderDefault(props)}
    </div>
  )
}
