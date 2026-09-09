import ProductsCatalog from "@/components/ui/ProductsCatalog";
import { productCategories } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <ProductsCatalog categories={productCategories} />
    </main>
  );
}