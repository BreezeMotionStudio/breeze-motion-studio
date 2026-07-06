'use client'

import { PortableText } from '@portabletext/react'
import { MARK_FONT_VARS, MARK_SIZE_VALUES, resolveMarkColor } from '@/lib/textMarkStyles'

const components = {
  block: {
    normal: ({ children }: any) => <>{children}</>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <span style={{ textDecoration: 'underline' }}>{children}</span>,
    textColor: ({ value, children }: any) => <span style={{ color: resolveMarkColor(value?.color) }}>{children}</span>,
    textFont: ({ value, children }: any) => <span style={{ fontFamily: value?.font ? MARK_FONT_VARS[value.font] : undefined }}>{children}</span>,
    textSize: ({ value, children }: any) => <span style={{ fontSize: value?.size ? MARK_SIZE_VALUES[value.size] : undefined }}>{children}</span>,
  },
}

export function SimpleRichText({ value }: { value: any }) {
  if (!value) return null
  if (typeof value === 'string') return <>{value}</>
  if (!Array.isArray(value) || value.length === 0) return null
  return <PortableText value={value} components={components} />
}
