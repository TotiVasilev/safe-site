import type { ProductDescriptionBlock } from "@/data/products";

/** Sanitize Decap CMS list entries. Unknown or empty blocks do not render. */
export function parseDescriptionBlocks(value: unknown): ProductDescriptionBlock[] {
  if (!Array.isArray(value)) return [];
  const kinds = new Set(["intro", "paragraph", "heading", "features", "certification"]);
  return value.flatMap((value): ProductDescriptionBlock[] => {
    if (!value || typeof value !== "object") return [];
    const item = value as Record<string, unknown>;
    const kind = item.kind;
    if (typeof kind !== "string" || !kinds.has(kind)) return [];
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const text = typeof item.text === "string" ? item.text.trim() : "";
    const items = Array.isArray(item.items)
      ? item.items.filter((entry): entry is string => typeof entry === "string").map((entry) => entry.trim()).filter(Boolean)
      : [];
    if (!title && !text && items.length === 0) return [];
    return [{ kind: kind as ProductDescriptionBlock["kind"], title: title || undefined, text: text || undefined, items }];
  });
}
