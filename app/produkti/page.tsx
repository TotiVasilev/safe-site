import { products } from "@/data/products";

export default function ProductsPage() {
  const categories = [
    "Сейфове",
    "Трезорни врати",
    "Трезорни панели",
    "Трезори",
    "Депозитни касети",
    "Депозитни станции",
    "Шкафове за оръжие",
    "Брави",
  ];

  return (
    <main className="min-h-screen px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Каталог
          </p>

          <h1 className="mt-5 text-5xl font-medium tracking-tight sm:text-6xl">
            Продукти
          </h1>

          <p className="mt-6 text-lg leading-8 text-black/60">
            Разгледайте нашата колекция от сейфове, трезорни решения,
            депозитни системи и брави.
          </p>
        </div>

        {/* Categories */}
        <div className="mt-24 space-y-24">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category === category
            );

            return (
              <section key={category}>
                <div className="flex items-baseline justify-between border-b border-black/10 pb-4">
                  <h2 className="text-2xl font-medium tracking-tight">
                    {category}
                  </h2>

                  <span className="text-sm text-black/40">
                    {categoryProducts.length}
                  </span>
                </div>

                <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryProducts.map((product) => (
                    <article key={product.id} className="group">
                      <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                        <div className="flex h-full items-center justify-center text-sm text-black/30">
                          Снимка на продукта
                        </div>
                      </div>

                      <div className="mt-5">
                        {product.subcategory && (
                          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                            {product.subcategory}
                          </p>
                        )}

                        <h3 className="mt-2 text-xl font-medium">
                          {product.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-black/60">
                          {product.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}