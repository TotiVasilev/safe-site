import ProductsCatalog from "@/components/ui/ProductsCatalog";
import { getProductCategories } from "@/data/cms-products";

export default function ProductsPage() {
  const categories = getProductCategories();

  return (
    <main className="min-h-screen bg-white">
      <ProductsCatalog categories={categories} />
    </main>
  );
}
