import { getCliClient } from "sanity/cli";
import { productCategories } from "../data/products";

const client = getCliClient({
  apiVersion: "2026-09-15",
});

function categoryDocumentId(id: string) {
  return `productCategory-${id}`;
}

function subcategoryDocumentId(id: string) {
  return `productSubcategory-${id}`;
}

function productDocumentId(id: string) {
  return `product-${id}`;
}

async function importCatalog() {
  console.log("Starting product catalog import...");

  let categoryCount = 0;
  let subcategoryCount = 0;
  let productCount = 0;

  for (const [categoryIndex, category] of productCategories.entries()) {
    const categoryId = categoryDocumentId(category.id);

    await client.createOrReplace({
      _id: categoryId,
      _type: "productCategory",
      name: category.name,
      slug: {
        _type: "slug",
        current: category.slug,
      },
      order: categoryIndex,
    });

    categoryCount += 1;
    console.log(`Category: ${category.name}`);

    if (category.subcategories) {
      for (const [
        subcategoryIndex,
        subcategory,
      ] of category.subcategories.entries()) {
        const subcategoryId = subcategoryDocumentId(subcategory.id);

        await client.createOrReplace({
          _id: subcategoryId,
          _type: "productSubcategory",
          name: subcategory.name,
          slug: {
            _type: "slug",
            current: subcategory.slug,
          },
          category: {
            _type: "reference",
            _ref: categoryId,
          },
          order: subcategoryIndex,
        });

        subcategoryCount += 1;
        console.log(`  Subcategory: ${subcategory.name}`);

        for (const product of subcategory.products) {
          await client.createOrReplace({
            _id: productDocumentId(product.id),
            _type: "product",
            name: product.name,
            slug: {
              _type: "slug",
              current: product.slug,
            },
            description: product.description,
            category: {
              _type: "reference",
              _ref: categoryId,
            },
            subcategory: {
              _type: "reference",
              _ref: subcategoryId,
            },
            models: product.models.map((model, modelIndex) => ({
              _key: `${product.id}-model-${modelIndex}`,
              _type: "productModel",
              name: model.name,
              ...(model.dimensions
                ? { dimensions: model.dimensions }
                : {}),
              ...(model.internalDimensions
                ? { internalDimensions: model.internalDimensions }
                : {}),
              ...(model.weight ? { weight: model.weight } : {}),
              ...(model.volume ? { volume: model.volume } : {}),
              ...(model.resistance
                ? { resistance: model.resistance }
                : {}),
            })),
          });

          productCount += 1;
          console.log(`    Product: ${product.name}`);
        }
      }
    }

    if (category.products) {
      for (const product of category.products) {
        await client.createOrReplace({
          _id: productDocumentId(product.id),
          _type: "product",
          name: product.name,
          slug: {
            _type: "slug",
            current: product.slug,
          },
          description: product.description,
          category: {
            _type: "reference",
            _ref: categoryId,
          },
          models: product.models.map((model, modelIndex) => ({
            _key: `${product.id}-model-${modelIndex}`,
            _type: "productModel",
            name: model.name,
            ...(model.dimensions
              ? { dimensions: model.dimensions }
              : {}),
            ...(model.internalDimensions
              ? { internalDimensions: model.internalDimensions }
              : {}),
            ...(model.weight ? { weight: model.weight } : {}),
            ...(model.volume ? { volume: model.volume } : {}),
            ...(model.resistance
              ? { resistance: model.resistance }
              : {}),
          })),
        });

        productCount += 1;
        console.log(`  Product: ${product.name}`);
      }
    }
  }

  console.log("");
  console.log("Catalog import complete.");
  console.log(`Categories: ${categoryCount}`);
  console.log(`Subcategories: ${subcategoryCount}`);
  console.log(`Products: ${productCount}`);
}

importCatalog().catch((error) => {
  console.error("Catalog import failed.");
  console.error(error);
  process.exit(1);
});