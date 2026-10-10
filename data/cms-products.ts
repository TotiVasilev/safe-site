import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  ProductCategory,
  ProductFamily,
  ProductModel,
  ProductSubcategory,
} from "@/data/products";

export type ProductWithParents = ProductFamily & {
  category: { name: string };
  subcategory?: { name: string };
};

type Entry = Record<string, unknown> & { _id: string };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function number(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 9999;
}

function entries(folder: string): Entry[] {
  const directory = path.join(process.cwd(), "content", folder);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => ({
      ...matter(fs.readFileSync(path.join(directory, name), "utf8")).data,
      _id: name.slice(0, -3),
    }));
}

function sortEntries<T extends Entry>(items: T[]): T[] {
  return items.sort((a, b) => number(a.order) - number(b.order) || a._id.localeCompare(b._id));
}

function models(value: unknown): ProductModel[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const name = text(item.name);
    if (!name) return [];
    return [{
      name,
      dimensions: text(item.dimensions) || undefined,
      height: text(item.height) || undefined,
      width: text(item.width) || undefined,
      depth: text(item.depth) || undefined,
      innerHeight: text(item.innerHeight) || undefined,
      innerWidth: text(item.innerWidth) || undefined,
      innerDepth: text(item.innerDepth) || undefined,
      internalDimensions: text(item.internalDimensions) || undefined,
      weight: text(item.weight) || undefined,
      volume: text(item.volume) || undefined,
      resistance: text(item.resistance) || undefined,
    }];
  });
}

function product(entry: Entry): ProductFamily {
  return {
    id: entry._id,
    slug: entry._id,
    name: text(entry.title) || entry._id,
    description: text(entry.description),
    attachments: Array.isArray(entry.attachments)
      ? entry.attachments.flatMap((raw) => {
          if (!raw || typeof raw !== "object") return [];
          const item = raw as Record<string, unknown>;
          const phrase = text(item.phrase);
          const file = text(item.file);
          return phrase && file ? [{ phrase, file }] : [];
        })
      : [],
    image: text(entry.image) || undefined,
    cardLabel: text(entry.cardLabel) || undefined,
    modelDrawing: text(entry.modelDrawing) || undefined,
    images: Array.isArray(entry.images)
      ? entry.images.map(text).filter(Boolean)
      : [],
    models: models(entry.models),
  };
}

export function getProductCategories(): ProductCategory[] {
  const categoryEntries = sortEntries(entries("categories"));
  const subcategoryEntries = sortEntries(entries("subcategories"));
  const productEntries = sortEntries(entries("products"));
  const knownCategories = new Set(categoryEntries.map((entry) => entry._id));
  const knownSubcategories = new Map(subcategoryEntries.map((entry) => [entry._id, entry]));
  const slugs = new Set<string>();

  for (const entry of productEntries) {
    if (slugs.has(entry._id)) throw new Error(`Duplicate product slug: ${entry._id}`);
    slugs.add(entry._id);
    const category = text(entry.category);
    const subcategory = text(entry.subcategory);
    if (!knownCategories.has(category)) {
      throw new Error(`Product ${entry._id} has an invalid category: ${category}`);
    }
    if (subcategory) {
      const parent = knownSubcategories.get(subcategory);
      if (!parent || text(parent.category) !== category) {
        throw new Error(`Product ${entry._id} has a subcategory outside its category: ${subcategory}`);
      }
    }
  }

  return categoryEntries.map((category): ProductCategory => {
    const categorySlug = category._id;
    const subs: ProductSubcategory[] = subcategoryEntries
      .filter((sub) => text(sub.category) === categorySlug)
      .map((sub) => ({
        id: sub._id,
        slug: sub._id,
        name: text(sub.title) || sub._id,
        products: productEntries
          .filter((item) => text(item.category) === categorySlug && text(item.subcategory) === sub._id)
          .map(product),
      }));
    return {
      id: categorySlug,
      slug: categorySlug,
      name: text(category.title) || categorySlug,
      subcategories: subs.length ? subs : undefined,
      products: productEntries
        .filter((item) => text(item.category) === categorySlug && !text(item.subcategory))
        .map(product),
    };
  });
}

export function getAllProducts(): ProductWithParents[] {
  return getProductCategories().flatMap((category) => [
    ...(category.products ?? []).map((item) => ({
      ...item,
      category: { name: category.name },
    })),
    ...(category.subcategories ?? []).flatMap((subcategory) =>
      subcategory.products.map((item) => ({
        ...item,
        category: { name: category.name },
        subcategory: { name: subcategory.name },
      }))
    ),
  ]);
}
