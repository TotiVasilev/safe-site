import ProductsCatalog from "@/components/ui/ProductsCatalog";
import { client } from "@/sanity/lib/client";
import type { ProductCategory } from "@/data/products";

const PRODUCTS_QUERY = `
  *[_type == "productCategory"] | order(order asc) {
    "id": _id,
    name,
    "slug": slug.current,

    "subcategories": *[
      _type == "productSubcategory" &&
      references(^._id)
    ] | order(order asc) {
      "id": _id,
      name,
      "slug": slug.current,

      "products": *[
        _type == "product" &&
        references(^._id)
      ] | order(_createdAt asc) {
        "id": _id,
        name,
        "slug": slug.current,
        description,
        "image": image.asset->url,

        models[] {
          name,
          dimensions,
          internalDimensions,
          weight,
          volume,
          resistance
        }
      }
    },

    "products": *[
      _type == "product" &&
      references(^._id) &&
      !defined(subcategory)
    ] | order(_createdAt asc) {
      "id": _id,
      name,
      "slug": slug.current,
      description,
      "image": image.asset->url,

      models[] {
        name,
        dimensions,
        internalDimensions,
        weight,
        volume,
        resistance
      }
    }
  }
`;

export default async function ProductsPage() {
  const productCategories = await client.fetch<ProductCategory[]>(
    PRODUCTS_QUERY
  );

  return (
    <main className="min-h-screen bg-white">
      <ProductsCatalog categories={productCategories} />
    </main>
  );
}