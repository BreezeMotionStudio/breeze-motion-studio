import type { CSSProperties } from 'react'

export function toColor(val?: string | null): string {
  if (!val) return '#000000'
  return val.startsWith('#') ? val : `#${val}`
}

export function sectionBgStyle(bg?: any): CSSProperties {
  if (!bg?.bgType || bg.bgType === 'solid') return bg?.bgColor ? { backgroundColor: toColor(bg.bgColor) } : {}
  if (bg.bgType === 'gradient') {
    return {
      background: `linear-gradient(${bg.gradientDirection || 'to bottom'}, ${toColor(bg.gradientFrom)} ${bg.gradientStop ?? 56}%, ${toColor(bg.gradientTo)})`,
    }
  }
  return {}
}

/** Resolves inline background style from sectionBg (new) or legacy bgColor string. */
export function resolveBg(sectionBg?: any, legacyBgColor?: string): CSSProperties {
  if (sectionBg?.bgType) return sectionBgStyle(sectionBg)
  if (legacyBgColor) return { backgroundColor: legacyBgColor }
  return {}
}

const LIGHT_HEX = new Set(['#ffffff', '#f5f5f5', '#e6e6e6', '#cccccc', '#b3b3b3', '#999999'])

/**
 * Returns 'text-white' or 'text-black' based on the resolved background.
 * defaultIsLight: whether the section's hardcoded default bg is light.
 */
export function resolveTextClass(sectionBg?: any, legacyBgColor?: string, defaultIsLight = false): string {
  if (sectionBg?.bgType === 'solid') {
    return LIGHT_HEX.has((sectionBg.bgColor || '').toLowerCase()) ? 'text-black' : 'text-white'
  }
  if (sectionBg?.bgType) return 'text-white' // gradient / image = dark
  if (legacyBgColor) return LIGHT_HEX.has(legacyBgColor.toLowerCase()) ? 'text-black' : 'text-white'
  return defaultIsLight ? 'text-black' : 'text-white'
}

/** True if resolved background is light (so dark text is appropriate). */
export function resolveIsLight(sectionBg?: any, legacyBgColor?: string): boolean {
  if (sectionBg?.bgType === 'solid') return LIGHT_HEX.has((sectionBg.bgColor || '').toLowerCase())
  if (sectionBg?.bgType) return false
  if (legacyBgColor) return LIGHT_HEX.has(legacyBgColor.toLowerCase())
  return false
}
