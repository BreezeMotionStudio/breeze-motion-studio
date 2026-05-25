import React, {useCallback} from 'react'
import {useDocumentOperation} from 'sanity'

interface DocumentViewProps {
  document: {
    displayed: Record<string, any> | null
    draft: Record<string, any> | null
    published: Record<string, any> | null
  }
  documentId: string
  documentType: string
}

function blockText(blocks: any[] | null | undefined): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c: {text?: string}) => c.text || '').join(''))
    .join('\n\n')
    .slice(0, 500)
}

export function CaseStudyPane({
  documentId,
  documentType,
  document: {displayed},
}: DocumentViewProps) {
  const {patch} = useDocumentOperation(documentId, documentType)
  const doc = displayed as Record<string, any> | null

  const patchField = useCallback(
    (field: string, value: unknown) => {
      if (value === undefined || value === '') {
        patch.execute([{unset: [field]}])
      } else {
        patch.execute([{set: {[field]: value}}])
      }
    },
    [patch],
  )

  if (!doc) return <div style={{padding: '2rem', color: '#888'}}>Loading…</div>

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#6b7280',
    marginBottom: '6px',
  }
  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '3px',
    fontSize: '14px',
    background: '#fff',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: '#111827',
  }
  const fieldWrap: React.CSSProperties = {marginBottom: '24px'}
  const lockedStyle: React.CSSProperties = {
    padding: '10px 14px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '3px',
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: 1.65,
    minHeight: '48px',
    whiteSpace: 'pre-wrap',
  }
  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '9px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9ca3af',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '3px',
    padding: '1px 5px',
    marginLeft: '8px',
    verticalAlign: 'middle',
  }

  return (
    <div
      style={{
        padding: '2rem 2.5rem',
        maxWidth: '720px',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px'}}>
        {doc.title}
      </div>
      <div
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#9ca3af',
          marginBottom: '32px',
        }}
      >
        Case Study
      </div>

      {/* Feature toggle */}
      <div style={fieldWrap}>
        <label style={{display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer'}}>
          <input
            type="checkbox"
            checked={Boolean(doc.showAsCaseStudy)}
            onChange={(e) => patchField('showAsCaseStudy', e.target.checked)}
            style={{marginTop: '2px', width: '15px', height: '15px', cursor: 'pointer', flexShrink: 0}}
          />
          <div>
            <div style={{fontSize: '14px', fontWeight: 600, color: '#111827'}}>
              Feature on Case Studies Page
            </div>
            <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '2px'}}>
              Appears on the public Case Studies listing when enabled
            </div>
          </div>
        </label>
      </div>

      {doc.showAsCaseStudy && (
        <div style={fieldWrap}>
          <label style={labelStyle}>Display Order</label>
          <input
            type="number"
            value={doc.caseStudyOrder ?? 0}
            onChange={(e) => patchField('caseStudyOrder', Number(e.target.value))}
            style={{...inputStyle, width: '100px'}}
          />
          <div style={{fontSize: '11px', color: '#9ca3af', marginTop: '4px'}}>
            Lower numbers appear first
          </div>
        </div>
      )}

      <hr style={{border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0 24px'}} />

      {/* Overview */}
      <div style={fieldWrap}>
        <label style={labelStyle}>Overview</label>
        <textarea
          value={doc.caseStudyOverview || ''}
          onChange={(e) => patchField('caseStudyOverview', e.target.value || undefined)}
          rows={4}
          placeholder="One paragraph framing the project for the reader…"
          style={{...inputStyle, resize: 'vertical'}}
        />
      </div>

      {/* Challenge — locked */}
      <div style={fieldWrap}>
        <div style={{...labelStyle, display: 'flex', alignItems: 'center'}}>
          The Challenge
          <span style={badgeStyle}>Edit in Full Project tab</span>
        </div>
        <div style={lockedStyle}>
          {blockText(doc.caseStudyChallenge) || (
            <span style={{color: '#d1d5db', fontStyle: 'italic'}}>No content yet</span>
          )}
        </div>
      </div>

      {/* Approach — locked */}
      <div style={fieldWrap}>
        <div style={{...labelStyle, display: 'flex', alignItems: 'center'}}>
          The Approach
          <span style={badgeStyle}>Edit in Full Project tab</span>
        </div>
        <div style={lockedStyle}>
          {blockText(doc.caseStudyApproach) || (
            <span style={{color: '#d1d5db', fontStyle: 'italic'}}>No content yet</span>
          )}
        </div>
      </div>

      {/* Outcome — locked */}
      <div style={fieldWrap}>
        <div style={{...labelStyle, display: 'flex', alignItems: 'center'}}>
          The Outcome
          <span style={badgeStyle}>Edit in Full Project tab</span>
        </div>
        <div style={lockedStyle}>
          {blockText(doc.caseStudyOutcome) || (
            <span style={{color: '#d1d5db', fontStyle: 'italic'}}>No content yet</span>
          )}
        </div>
      </div>

      {/* Testimonial — locked */}
      <div style={fieldWrap}>
        <div style={{...labelStyle, display: 'flex', alignItems: 'center'}}>
          Client Testimonial
          <span style={badgeStyle}>Edit in Full Project tab</span>
        </div>
        <div style={lockedStyle}>
          {doc.testimonial?._ref ? (
            <span style={{color: '#9ca3af', fontStyle: 'italic'}}>
              Testimonial linked — view in Full Project tab
            </span>
          ) : (
            <span style={{color: '#d1d5db', fontStyle: 'italic'}}>No testimonial linked</span>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: '8px',
          padding: '14px 16px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#9ca3af',
          lineHeight: 1.6,
        }}
      >
        Rich text and references are editable in the{' '}
        <strong style={{color: '#6b7280'}}>Full Project</strong> tab. Deliverables, BTS content,
        and settings are managed there too.
      </div>
    </div>
  )
}
