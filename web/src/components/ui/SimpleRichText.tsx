'use client'

import { PortableText } from '@portabletext/react'

const components = {
  block: {
    normal: ({ children }: any) => <>{children}</>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
}

export function SimpleRichText({ value }: { value: any }) {
  if (!value) return null
  if (typeof value === 'string') return <>{value}</>
  if (!Array.isArray(value) || value.length === 0) return null
  return <PortableText value={value} components={components} />
}
