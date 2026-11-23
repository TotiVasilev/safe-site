import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parseDescriptionBlocks } from "@/data/description-blocks";
import type { ProductCategory, ProductFamily } from "@/data/products";
import type { Homepage } from "@/data/cms-homepage";
import { getHomepage } from "@/data/cms-homepage";
import { getProductCategories } from "@/data/cms-products";

function translatedJson<T>(name: string, fallback: T): T {
  const filename = path.join(process.cwd(), "content", "en", name);
  if (!fs.existsSync(filename)) return fallback;
  return JSON.parse(fs.readFileSync(filename, "utf8")) as T;
}
export function getEnglishHomepage(): Homepage {
  return translatedJson("homepage.json", getHomepage());
}
export function getEnglishJson<T>(name: string, fallback: T): T {
  return translatedJson(name, fallback);
}
function md(folder: string, slug: string): Record<string, unknown> {
  const filename = path.join(process.cwd(), "content", "en", folder, `${slug}.md`);
  return fs.existsSync(filename) ? matter(fs.readFileSync(filename, "utf8")).data : {};
}
function localizeProduct(product: ProductFamily): ProductFamily {
  const entry = md("products", product.slug);
  return {
    ...product,
    name: typeof entry.title === "string" ? entry.title : product.name,
    description: typeof entry.description === "string" ? entry.description : product.description,
    // Never show untranslated Bulgarian blocks on the English product page.
    // Until the translation workflow writes English blocks, show legacy English text.
    descriptionBlocks: parseDescriptionBlocks(entry.descriptionBlocks),
    // Attachments are authored once in the BG product CMS. Each shared entry can
    // optionally specify its English phrase, while keeping one shared target file.
    // Legacy EN phrases continue to work until migrated into phraseEn.
    attachments: (product.attachments ?? []).map((attachment, index) => {
      const translatedEntries = Array.isArray(entry.attachments) ? entry.attachments : [];
      const matching = translatedEntries.find((item) =>
        item && typeof item === "object" &&
        (item as Record<string, unknown>).file === attachment.file
      ) ?? translatedEntries[index];
      const oldEnglishPhrase = matching && typeof matching === "object" &&
        typeof (matching as Record<string, unknown>).phrase === "string"
        ? (matching as Record<string, unknown>).phrase as string : "";
      return {
        phrase: attachment.phraseEn?.trim() || oldEnglishPhrase || attachment.phrase,
        file: attachment.file,
      };
    }),
    catalogDescription: typeof entry.catalogDescription === "string" ? entry.catalogDescription : product.catalogDescription,
    cardLabel: typeof entry.cardLabel === "string" ? entry.cardLabel : product.cardLabel,
    // Use translated model descriptions from the English CMS content while
    // retaining the original model images, technical data, and ordering.
    models: product.models.map((model, index) => {
      const translated = Array.isArray(entry.models) ? entry.models[index] : undefined;
      if (!translated || typeof translated !== "object") return model;
      const translatedName = (translated as Record<string, unknown>).name;
      const description = (translated as Record<string, unknown>).description;
      const translatedBlocks = (translated as Record<string, unknown>).descriptionBlocks;
      return {
        ...model,
        // Model identity comes from the BG record; names also serve as stable model IDs.

        ...(typeof description === "string" ? { description } : {}),
        ...(Array.isArray(translatedBlocks) ? { descriptionBlocks: translatedBlocks as typeof model.descriptionBlocks } : {}),
      };
    }),
  };
}
const categoryFallback: Record<string, string> = {
  "seyfove": "Safes", "trezorni-resheniya": "Vault solutions",
  "bankovi-produkti": "Banking products", "shkafove-za-orazhie": "Gun cabinets",
  "bravi": "Locks",
};
export function getEnglishCategories(): ProductCategory[] {
  return getProductCategories().map(category => ({
    ...category,
    name: String(md("categories", category.slug).title ?? categoryFallback[category.slug] ?? category.name),
    products: category.products?.map(localizeProduct) ?? [],
    subcategories: category.subcategories?.map(sub => ({
      ...sub,
      name: String(md("subcategories", sub.slug).title ?? sub.name),
      products: sub.products.map(localizeProduct),
    })),
  }));
}
export function getEnglishProducts() {
  return getEnglishCategories().flatMap(category => [
    ...(category.products ?? []).map(product => ({ ...product, category: { name: category.name }, subcategory: undefined })),
    ...(category.subcategories ?? []).flatMap(sub => sub.products.map(product => ({
      ...product, category: { name: category.name }, subcategory: { name: sub.name },
    }))),
  ]);
}
