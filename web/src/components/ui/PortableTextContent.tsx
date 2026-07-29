"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getImageDimensions } from "@sanity/asset-utils";
import { urlFor } from "@/lib/sanity/image";
import { MARK_FONT_VARS, MARK_SIZE_VALUES, resolveMarkColor } from "@/lib/textMarkStyles";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).fit("max").url();
      const { width, height } = getImageDimensions(value);
      return (
        <figure className="my-8">
          {value.roundCrop ? (
            <div className="relative rounded-full aspect-square max-w-md mx-auto overflow-hidden">
              <Image src={url} alt={value.alt || ""} fill className="object-cover" sizes="448px" />
            </div>
          ) : (
            <Image
              src={url}
              alt={value.alt || ""}
              width={width}
              height={height}
              className="w-full h-auto"
              sizes="(min-width: 768px) 700px, 100vw"
            />
          )}
          {value.caption && (
            <figcaption className="text-sm text-bms-grey-400 mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
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
    underline: ({ children }) => <span style={{ textDecoration: "underline" }}>{children}</span>,
    textColor: ({ value, children }) => <span style={{ color: resolveMarkColor(value?.color) }}>{children}</span>,
    textFont: ({ value, children }) => <span style={{ fontFamily: value?.font ? MARK_FONT_VARS[value.font] : undefined }}>{children}</span>,
    textSize: ({ value, children }) => <span style={{ fontSize: value?.size ? MARK_SIZE_VALUES[value.size] : undefined }}>{children}</span>,
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
