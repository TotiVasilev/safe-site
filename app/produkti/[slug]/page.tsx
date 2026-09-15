import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ProductModel = {
  name: string;
  dimensions?: string;
  internalDimensions?: string;
  weight?: string;
  volume?: string;
  resistance?: string;
};

type Product = {
  name: string;
  slug: string;
  description: string;
  image?: string;
  models: ProductModel[];
  category?: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
};

const PRODUCT_QUERY = `
  *[
    _type == "product" &&
    slug.current == $slug
  ][0] {
    name,
    "slug": slug.current,
    description,
    "image": image.asset->url,

    "category": category->{
      name
    },

    "subcategory": subcategory->{
      name
    },

    models[] {
      name,
      dimensions,
      internalDimensions,
      weight,
      volume,
      resistance
    }
  }
`;

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

  const product = await client.fetch<Product | null>(
    PRODUCT_QUERY,
    { slug }
  );

  if (!product) {
    notFound();
  }

  const parentCategory = product.category?.name ?? "";
  const parentSubcategory = product.subcategory?.name ?? "";
  const models = product.models ?? [];

  return (
    <main className="min-h-screen bg-white px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
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

        <section className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-xs uppercase tracking-[0.3em] text-black/20">
                  SAFETY
                </span>
              </div>
            )}
          </div>

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
                {models.length}{" "}
                {models.length === 1
                  ? "модел"
                  : "модела"}
              </span>

              <span className="rounded-full border border-black/10 px-4 py-2 text-sm">
                Професионална сигурност
              </span>
            </div>
          </div>
        </section>

        {models.length > 0 && (
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
              {models.map((model, index) => (
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