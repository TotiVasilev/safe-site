import Link from "next/link";
import { productCategories } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-32 lg:px-12">
        {/* Page header */}
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            Каталог
          </p>

          <h1 className="mt-5 text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
            Продукти
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
            Разгледайте нашите решения за сигурност, съхранение и
            защита.
          </p>
        </header>

        {/* Category navigation */}
        <nav className="mt-16 overflow-x-auto border-y border-black/10 py-4">
          <div className="flex min-w-max gap-6">
            {productCategories.map((category, index) => (
              <a
                key={category.id}
                href={`#${category.slug}`}
                className="text-sm text-black/50 transition-colors hover:text-black"
              >
                <span className="mr-2 text-xs text-black/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {category.name}
              </a>
            ))}
          </div>
        </nav>

        {/* Categories */}
        <div className="mt-24 space-y-32">
          {productCategories.map((category, categoryIndex) => (
            <section
              key={category.id}
              id={category.slug}
              className="scroll-mt-28"
            >
              {/* Category heading */}
              <div className="flex items-end justify-between border-b border-black/10 pb-6">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-black/30">
                    Категория {String(categoryIndex + 1).padStart(2, "0")}
                  </p>

                  <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                    {category.name}
                  </h2>
                </div>

                <span className="hidden text-sm text-black/40 sm:block">
                  {category.subcategories
                    ? `${category.subcategories.length} категории`
                    : `${category.products?.length ?? 0} продукта`}
                </span>
              </div>

              {/* Subcategories */}
              {category.subcategories && (
                <div className="mt-12 space-y-20">
                  {category.subcategories.map(
                    (subcategory, subcategoryIndex) => (
                      <div key={subcategory.id}>
                        {/* Subcategory title */}
                        <div className="mb-7 flex items-center gap-4">
                          <span className="text-xs text-black/25">
                            {String(subcategoryIndex + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <h3 className="text-xl font-medium tracking-tight">
                            {subcategory.name}
                          </h3>
                        </div>

                        {/* Products */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {subcategory.products.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Direct products */}
              {category.products && (
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image?: string;
    models: {
      name: string;
    }[];
  };
}) {
  return (
    <Link
      href={`/produkti/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-black/20 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs uppercase tracking-[0.3em] text-black/20">
              SAFETY
            </span>
          </div>
        )}

        {/* Arrow */}
        <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100">
          →
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-5">
          <h4 className="text-lg font-medium tracking-tight">
            {product.name}
          </h4>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/50">
          {product.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
          <span className="text-xs text-black/35">
            {product.models.length}{" "}
            {product.models.length === 1
              ? "модел"
              : "модела"}
          </span>

          <span className="text-xs font-medium transition-transform duration-300 group-hover:translate-x-1">
            Виж продукта →
          </span>
        </div>
      </div>
    </Link>
  );
}