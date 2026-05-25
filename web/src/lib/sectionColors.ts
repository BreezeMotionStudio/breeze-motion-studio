import type {CSSProperties} from 'react'

/** Colors in the brand palette considered "light" — pair with dark text. */
const LIGHT_COLORS = new Set([
  '#ffffff',
  '#f5f5f5',
  '#e6e6e6',
  '#cccccc',
  '#b3b3b3',
  '#999999',
])

/** Returns true if the given bgColor is a light colour (dark text should be used). */
export function isLightBg(bgColor?: string | null): boolean {
  if (!bgColor) return false
  return LIGHT_COLORS.has(bgColor.toLowerCase())
}

/** Returns an inline backgroundColor style, or undefined when no custom colour is set. */
export function getBgStyle(bgColor?: string | null): CSSProperties | undefined {
  if (!bgColor) return undefined
  return {backgroundColor: bgColor}
}

/**
 * Returns the appropriate outer text-colour Tailwind class for a section.
 * @param bgColor        Custom colour from Sanity (undefined = use page default).
 * @param defaultIsLight Whether the section's built-in default bg is light (default: false = dark).
 */
export function getTextClass(bgColor?: string | null, defaultIsLight = false): string {
  if (!bgColor) return defaultIsLight ? 'text-black' : 'text-white'
  return isLightBg(bgColor) ? 'text-black' : 'text-white'
}
