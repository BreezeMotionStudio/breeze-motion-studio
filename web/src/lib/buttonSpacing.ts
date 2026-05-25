export const TOP_SPACING: Record<string, string> = {
  'neg-lg': '-mt-8',
  'neg-md': '-mt-6',
  'neg-sm': '-mt-4',
  'neg-xs': '-mt-2',
  'none':   '',
  'xs':     'mt-2',
  'sm':     'mt-4',
  'md':     'mt-6',
  'lg':     'mt-8',
}

export const BOTTOM_SPACING: Record<string, string> = {
  'neg-lg': '-mb-8',
  'neg-md': '-mb-6',
  'neg-sm': '-mb-4',
  'neg-xs': '-mb-2',
  'none':   '',
  'xs':     'mb-2',
  'sm':     'mb-4',
  'md':     'mb-6',
  'lg':     'mb-8',
}

export function btnSpacingClass(topSpacing?: string, bottomSpacing?: string): string {
  return [
    TOP_SPACING[topSpacing ?? 'none'] ?? '',
    BOTTOM_SPACING[bottomSpacing ?? 'none'] ?? '',
  ].filter(Boolean).join(' ')
}
