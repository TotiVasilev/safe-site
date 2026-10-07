import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import {
  productCategories,
  type ProductCategory,
  type ProductFamily,
  type ProductModel,
} from "@/data/products";

export type ProductWithParents = ProductFamily & {
  category: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
};

type CmsModel = {
  name?: unknown;
  dimensions?: unknown;
  internalDimensions?: unknown;
  weight?: unknown;
  volume?: unknown;
  resistance?: unknown;
};

type CmsProduct = {
  slug?: unknown;
  description?: unknown;
  image?: unknown;
  cardLabel?: unknown;
  images?: unknown;
  models?: unknown;
};

const contentDirectory = path.join(process.cwd(), "content", "products");

function optionalText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function optionalTextArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const values = value
    .map(optionalText)
    .filter((item): item is string => Boolean(item));

  return values.length > 0 ? values : undefined;
}

function readCmsProduct(slug: string): CmsProduct | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  const filePath = path.join(contentDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  return matter(fs.readFileSync(filePath, "utf8")).data as CmsProduct;
}

function mergeModels(
  originalModels: ProductModel[],
  cmsModels: unknown
): ProductModel[] {
  if (!Array.isArray(cmsModels)) return originalModels;

  const cmsByName = new Map<string, CmsModel>();

  for (const item of cmsModels) {
    if (
      item &&
      typeof item === "object" &&
      typeof item.name === "string"
    ) {
      cmsByName.set(item.name, item as CmsModel);
    }
  }

  return originalModels.map((original) => {
    const edited = cmsByName.get(original.name);

    if (!edited) return original;

    return {
      ...original,
      dimensions:
        optionalText(edited.dimensions) ?? original.dimensions,
      internalDimensions:
        optionalText(edited.internalDimensions) ??
        original.internalDimensions,
      weight: optionalText(edited.weight) ?? original.weight,
      volume: optionalText(edited.volume) ?? original.volume,
      resistance:
        optionalText(edited.resistance) ?? original.resistance,
    };
  });
}

function mergeProduct(product: ProductFamily): ProductFamily {
  const edited = readCmsProduct(product.slug);

  if (!edited) return product;

  return {
    ...product,
    description:
      optionalText(edited.description) ?? product.description,
    image: optionalText(edited.image) ?? product.image,
    cardLabel:
      optionalText(edited.cardLabel) ?? product.cardLabel,
    images:
      optionalTextArray(edited.images) ?? product.images,
    models: mergeModels(product.models, edited.models),
  };
}

export function getProductCategories(): ProductCategory[] {
  return productCategories.map((category) => ({
    ...category,
    products: category.products?.map(mergeProduct),
    subcategories: category.subcategories?.map((subcategory) => ({
      ...subcategory,
      products: subcategory.products.map(mergeProduct),
    })),
  }));
}

export function getAllProducts(): ProductWithParents[] {
  return getProductCategories().flatMap((category) => {
    const directProducts = (category.products ?? []).map((product) => ({
      ...product,
      category: { name: category.name },
    }));

    const subcategoryProducts = (category.subcategories ?? []).flatMap(
      (subcategory) =>
        subcategory.products.map((product) => ({
          ...product,
          category: { name: category.name },
          subcategory: { name: subcategory.name },
        }))
    );

    return [...directProducts, ...subcategoryProducts];
  });
}
