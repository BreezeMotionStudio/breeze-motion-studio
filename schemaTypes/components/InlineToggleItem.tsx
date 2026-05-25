import React from 'react'
import {set} from 'sanity'
import type {ObjectItemProps} from 'sanity'

export function InlineToggleItem(props: ObjectItemProps) {
  const {value, onChange, renderDefault} = props
  const enabled = !!(value as any)?.enabled

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    onChange(set(!enabled, ['enabled']))
  }

  return (
    <div style={{position: 'relative'}}>
      {renderDefault(props)}
      <button
        type="button"
        onClick={handleToggle}
        style={{
          position: 'absolute',
          top: '12px',
          right: '68px',
          background: enabled ? '#535D66' : 'transparent',
          color: enabled ? '#fff' : '#777',
          border: `1px solid ${enabled ? '#535D66' : '#555'}`,
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
        {enabled ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}
