import ProductsCatalog from "@/components/ui/ProductsCatalog";
import { getEnglishCategories } from "@/data/english";

export default function ProductsPage() {
  const categories = getEnglishCategories();

  return (
    <main className="min-h-screen bg-white">
      <ProductsCatalog categories={categories} locale="en" />
    </main>
  );
}
