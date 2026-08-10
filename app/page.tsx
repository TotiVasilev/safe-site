import Link from "next/link";
import { productCategories } from "@/data/products";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="flex min-h-[80vh] items-center px-6 py-32 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-sm uppercase tracking-[0.3em] text-black/50">
            Сигурност без компромис
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-medium tracking-tight sm:text-6xl lg:text-8xl">
            Защита на това,
            <br />
            което има значение.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/60">
            Професионални решения за сигурност — сейфове, трезорни системи,
            банково оборудване и специализирани продукти.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/produkti"
              className="rounded-full bg-black px-7 py-4 text-sm font-medium text-white transition-transform hover:scale-105"
            >
              Разгледайте продуктите
            </Link>

            <Link
              href="/uslugi"
              className="rounded-full border border-black/15 px-7 py-4 text-sm font-medium transition-colors hover:bg-black hover:text-white"
            >
              Услуги и сервиз
            </Link>
          </div>
        </div>
      </section>

      {/* Product categories preview */}
      <section className="border-t border-black/10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Каталог
            </p>

            <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
              Решения за сигурност
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {productCategories.map((category) => (
              <Link
                key={category.id}
                href={`/produkti#${category.slug}`}
                className="group rounded-2xl border border-black/10 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                      Каталог
                    </p>

                    <h3 className="mt-3 text-2xl font-medium">
                      {category.name}
                    </h3>
                  </div>

                  <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>

                {category.subcategories && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {category.subcategories.map((subcategory) => (
                      <span
                        key={subcategory.id}
                        className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-black/60"
                      >
                        {subcategory.name}
                      </span>
                    ))}
                  </div>
                )}

                {category.products && (
                  <p className="mt-8 text-sm text-black/50">
                    {category.products.length} продуктови групи
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}