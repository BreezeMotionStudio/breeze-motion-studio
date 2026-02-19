"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-[family-name:var(--font-body)] text-base leading-relaxed mb-4">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-[family-name:var(--font-brand)] text-2xl uppercase tracking-wide mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-[family-name:var(--font-functional)] text-lg font-bold uppercase tracking-wide mb-3 mt-6">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="font-[family-name:var(--font-body)] text-base">{children}</li>
    ),
  },
};

export default function PortableTextContent({
  value,
  className = "",
}: {
  value: any;
  className?: string;
}) {
  if (!value) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
