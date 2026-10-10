import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ui/ProductGallery";
import ModelSelector from "@/components/ui/ModelSelector";
import { getAllProducts } from "@/data/cms-products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllProducts().map((product) => ({
    slug: product.slug,
  }));
}

export const dynamicParams = false;

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = getAllProducts().find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  const parentCategory = product.category?.name ?? "";
  const parentSubcategory =
    product.subcategory?.name ?? "";
  const models = product.models ?? [];

  return (
    <main className="min-h-screen bg-white px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-center gap-2 text-sm text-black/40">
          <Link href="/" className="transition-colors hover:text-black">
            Начало
          </Link>
          <span>/</span>
          <Link href="/produkti" className="transition-colors hover:text-black">
            Продукти
          </Link>
          <span>/</span>

          {parentCategory && (
            <>
              <span>{parentCategory}</span>
              <span>/</span>
            </>
          )}

          {parentSubcategory && (
            <>
              <span>{parentSubcategory}</span>
              <span>/</span>
            </>
          )}

          <span className="text-black">{product.name}</span>
        </div>

        <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-16">
          <ProductGallery
            productName={product.name}
            mainImage={product.image}
            images={product.images}
          />

          <div className="flex flex-col justify-center lg:sticky lg:top-28 lg:pt-4">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              {product.cardLabel ||
                parentSubcategory ||
                parentCategory}
            </p>

            <h1 className="mt-5 text-5xl font-medium tracking-tight sm:text-6xl">
              {product.name}
            </h1>

            <p className="mt-7 max-w-xl whitespace-pre-line text-lg leading-8 text-black/60">
              {product.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-black px-4 py-2 text-sm text-white">
                {models.length} {models.length === 1 ? "модел" : "модела"}
              </span>

              <span className="rounded-full border border-black/10 px-4 py-2 text-sm">
                Професионална сигурност
              </span>
            </div>
          </div>
        </section>

        {models.length > 0 && (
          <ModelSelector models={models} drawing={product.modelDrawing} productName={product.name} />
        )}

        <section className="mt-32 rounded-3xl bg-black px-8 py-16 text-white sm:px-12 lg:px-16">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Имате въпроси?
          </p>

          <h2 className="mt-5 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
            Нека намерим правилното решение за вашите нужди.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-white/60">
            Свържете се с нас за повече информация относно
            моделите, характеристиките и възможностите за
            доставка и монтаж.
          </p>

          <Link
            href="/uslugi"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            Свържете се с нас
          </Link>
        </section>
      </div>
    </main>
  );
}
