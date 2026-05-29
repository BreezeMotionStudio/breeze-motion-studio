import React from 'react'

export function MigrationBanner() {
  return (
    <div
      style={{
        background: '#FFF8E1',
        border: '1px solid #F59E0B',
        borderRadius: 4,
        padding: '12px 16px',
        fontSize: 13,
        lineHeight: 1.6,
        color: '#78350F',
      }}
    >
      <strong style={{display: 'block', marginBottom: 4}}>
        ⚠ Archive — Pending Migration
      </strong>
      This case study was created under the old system. When you officially upload the
      corresponding project, transfer this content to the Case Study fields on that Project
      document, then this record can be deleted.
    </div>
  )
}
