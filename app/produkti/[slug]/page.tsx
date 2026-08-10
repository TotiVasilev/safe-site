import Link from "next/link";
import { notFound } from "next/navigation";
import { productCategories } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  let product = null;
  let parentCategory = "";
  let parentSubcategory = "";

  for (const category of productCategories) {
    if (category.products) {
      const found = category.products.find(
        (item) => item.slug === slug
      );

      if (found) {
        product = found;
        parentCategory = category.name;
        break;
      }
    }

    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        const found = subcategory.products.find(
          (item) => item.slug === slug
        );

        if (found) {
          product = found;
          parentCategory = category.name;
          parentSubcategory = subcategory.name;
          break;
        }
      }
    }

    if (product) {
      break;
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-12 flex flex-wrap items-center gap-2 text-sm text-black/40">
          <Link
            href="/"
            className="transition-colors hover:text-black"
          >
            Начало
          </Link>

          <span>/</span>

          <Link
            href="/produkti"
            className="transition-colors hover:text-black"
          >
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

          <span className="text-black">
            {product.name}
          </span>
        </div>

        {/* Product hero */}
        <section className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image placeholder */}
          <div className="aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            <div className="flex h-full items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] text-black/20">
                SAFETY
              </span>
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              {parentSubcategory || parentCategory}
            </p>

            <h1 className="mt-5 text-5xl font-medium tracking-tight sm:text-6xl">
              {product.name}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-black/60">
              {product.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-black px-4 py-2 text-sm text-white">
                {product.models.length}{" "}
                {product.models.length === 1
                  ? "модел"
                  : "модела"}
              </span>

              <span className="rounded-full border border-black/10 px-4 py-2 text-sm">
                Професионална сигурност
              </span>
            </div>
          </div>
        </section>

        {/* Models */}
        {product.models.length > 0 && (
          <section className="mt-32">
            <div className="border-b border-black/10 pb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                Модели
              </p>

              <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
                Налични модели
              </h2>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-black/10">
              {product.models.map((model, index) => (
                <Link
                  key={model.name}
                  href={`/produkti/${product.slug}/${createSlug(
                    model.name
                  )}`}
                  className="group flex items-center justify-between border-b border-black/10 px-6 py-5 transition-colors last:border-b-0 hover:bg-black/[0.02]"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-xs text-black/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-medium">
                      {model.name}
                    </span>
                  </div>

                  <span className="text-sm text-black/30 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
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