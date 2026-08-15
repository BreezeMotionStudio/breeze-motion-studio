import React, {useState} from 'react'
import {set} from 'sanity'

const OPTIONS = [
  'Brand / Company Video',
  'Product or Service Video',
  'Industrial / Technical Video',
  'Promotional / Marketing Video',
  'Social Media Video',
  'Event / Showcase Video',
  'Interview / Talking Head Video',
  'Recruitment Video',
  'Training Video',
  'Documentary-Style Video',
  'Behind-the-Scenes Footage',
  'Aerial / Drone Footage',
  'Motion Graphics Package',
  'Logo Animation',
  'Animated Title Sequence',
  'Lower Thirds Package',
  'Animated Subtitles / Captions',
  'Infographic Animation',
  'Social Media Motion Graphics',
  'Intro / Outro Animation',
  'Cinematic 3D Machine Showcase',
  '3D Process / Assembly Demonstration',
  'Technical Explainer with 3D Integration',
  'Brand / Company Photography',
  'Industrial / Technical Photography',
  'Product Photography',
  'Lifestyle / Environmental Photography',
  'Profile Photography',
  'Portfolio Photography',
  'Audio Cleanup and Enhancement',
  'Voiceover Editing and Integration',
  'Music Creation / Composition',
  'Sound Design',
  'Final Audio Mix and Master',
  'Field Recording Integration',
  'Social Media Graphics',
  'Marketing and Campaign Visuals',
  'Presentation Design',
  'Website Graphics',
  'Digital Product Packshots',
  'Business Cards',
  'Flyers / Pamphlets',
  'Posters / Signage',
  'Brochure / Print Collateral',
  'Logo Design',
  'Colour Palette',
  'Typography System',
  'Visual Brand Identity Development',
  'Brand Guideline Document',
  'Digital and Print Brand Assets',
  'Website Design and Configuration',
  'Social Platform Setup and Alignment',
  'Content Integration',
  'Media and File System Audit',
  'Workflow Design and Optimisation',
  'Folder Structure and Naming Conventions',
  'Software Stack Guidance',
  'Website Maintenance and Updates',
  'Ongoing Content and Visual Refreshes',
]

type Props = {
  value?: string[]
  onChange: (patch: any) => void
  renderDefault?: (props: any) => React.ReactElement
}

export function DeliverablesInput(props: Props) {
  const {value, onChange} = props
  const items: string[] = Array.isArray(value) ? value : []
  const [draft, setDraft] = useState('')

  function commit(text: string) {
    const v = text.trim()
    if (!v || items.includes(v)) return
    onChange(set([...items, v]))
    setDraft('')
  }

  function remove(i: number) {
    const next = items.filter((_, idx) => idx !== i)
    onChange(set(next))
  }

  function move(i: number, direction: -1 | 1) {
    const j = i + direction
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(set(next))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setDraft(v)
    // Auto-commit when user selects an exact match from the datalist
    if (OPTIONS.includes(v)) {
      commit(v)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit(draft)
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {/* Input row */}
      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <input
          list="bms-deliverables-options"
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type anything, or pick from suggestions…"
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 13,
            border: '1px solid var(--card-border-color, #ccc)',
            borderRadius: 3,
            background: 'var(--card-bg-color, #fff)',
            color: 'var(--card-fg-color, #111)',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => commit(draft)}
          style={{
            padding: '8px 14px',
            fontSize: 13,
            border: '1px solid var(--card-border-color, #ccc)',
            borderRadius: 3,
            background: 'transparent',
            color: 'var(--card-fg-color, #111)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Add
        </button>
        <datalist id="bms-deliverables-options">
          {OPTIONS.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      </div>

      {/* List — order matches display order on the site */}
      {items.length > 0 && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 8px 6px 10px',
                fontSize: 12,
                border: '1px solid var(--card-border-color, #ccc)',
                borderRadius: 3,
                background: 'var(--card-muted-bg-color, #f5f5f5)',
                color: 'var(--card-fg-color, #111)',
              }}
            >
              <span style={{flex: 1}}>{item}</span>
              <div style={{display: 'flex', gap: 2}}>
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: i === 0 ? 'default' : 'pointer',
                    padding: '0 4px',
                    fontSize: 13,
                    lineHeight: 1,
                    color: 'inherit',
                    opacity: i === 0 ? 0.2 : 0.6,
                  }}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  title="Move down"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: i === items.length - 1 ? 'default' : 'pointer',
                    padding: '0 4px',
                    fontSize: 13,
                    lineHeight: 1,
                    color: 'inherit',
                    opacity: i === items.length - 1 ? 0.2 : 0.6,
                  }}
                >
                  ▼
                </button>
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                title={`Remove "${item}"`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 15,
                  lineHeight: 1,
                  color: 'inherit',
                  opacity: 0.45,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
