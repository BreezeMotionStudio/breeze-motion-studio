import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

export function focalYToObjectPosition(focalY?: number): string {
  return `50% ${typeof focalY === "number" ? focalY : 50}%`;
}
