import type { CSSProperties } from 'react'

// Must stay in sync with schemaTypes/shared/textMarks.ts
export const MARK_FONT_VARS: Record<string, string> = {
  brand: 'var(--font-brand)',
  functional: 'var(--font-functional)',
  body: 'var(--font-body)',
}

export const MARK_SIZE_VALUES: Record<string, string> = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
}

export function resolveMarkColor(color?: string): string | undefined {
  if (!color) return undefined
  return color.startsWith('#') ? color : `#${color}`
}

type TextStyleValue = { color?: string; font?: string; size?: string } | undefined

export function textStyleToCss(style: TextStyleValue): CSSProperties {
  if (!style) return {}
  return {
    color: resolveMarkColor(style.color),
    fontFamily: style.font ? MARK_FONT_VARS[style.font] : undefined,
    fontSize: style.size ? MARK_SIZE_VALUES[style.size] : undefined,
  }
}
