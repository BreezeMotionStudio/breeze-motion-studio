// Extracts plain text from a portable text array for use in Studio list previews,
// where `select` can only pull raw field values (arrays render as blank/[object]).
export function plainTextFromBlocks(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return undefined
  return value
    .map((block: any) => (Array.isArray(block?.children) ? block.children.map((c: any) => c?.text || '').join('') : ''))
    .join(' ')
    .trim()
}
