import Link from "next/link";
import { notFound } from "next/navigation";
import { productCategories } from "@/data/products";

type ModelPageProps = {
  params: Promise<{
    slug: string;
    model: string;
  }>;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export default async function ModelPage({
  params,
}: ModelPageProps) {
  const { slug, model: modelSlug } = await params;

  let product = null;
  let model = null;
  let parentCategory = "";
  let parentSubcategory = "";

  for (const category of productCategories) {
    if (category.products) {
      const foundProduct = category.products.find(
        (item) => item.slug === slug
      );

      if (foundProduct) {
        const foundModel = foundProduct.models.find(
          (item) => createSlug(item.name) === modelSlug
        );

        if (foundModel) {
          product = foundProduct;
          model = foundModel;
          parentCategory = category.name;
          break;
        }
      }
    }

    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        const foundProduct = subcategory.products.find(
          (item) => item.slug === slug
        );

        if (foundProduct) {
          const foundModel = foundProduct.models.find(
            (item) => createSlug(item.name) === modelSlug
          );

          if (foundModel) {
            product = foundProduct;
            model = foundModel;
            parentCategory = category.name;
            parentSubcategory = subcategory.name;
            break;
          }
        }
      }
    }

    if (model) {
      break;
    }
  }

  if (!product || !model) {
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

          <Link
            href={`/produkti/${product.slug}`}
            className="transition-colors hover:text-black"
          >
            {product.name}
          </Link>

          <span>/</span>

          <span className="text-black">
            {model.name}
          </span>
        </div>

        {/* Model hero */}
        <section className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image placeholder */}
          <div className="aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            <div className="flex h-full items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] text-black/20">
                {model.name}
              </span>
            </div>
          </div>

          {/* Model information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              {parentSubcategory || parentCategory}
            </p>

            <p className="mt-5 text-sm text-black/40">
              {product.name}
            </p>

            <h1 className="mt-3 text-5xl font-medium tracking-tight sm:text-6xl">
              {model.name}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-black/60">
              Технически характеристики и информация за модел{" "}
              {model.name}.
            </p>
          </div>
        </section>

        {/* Specifications */}
        <section className="mt-32">
          <div className="border-b border-black/10 pb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Характеристики
            </p>

            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Технически характеристики
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10">
            {model.dimensions && (
              <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Външни размери
                </span>

                <span className="font-medium">
                  {model.dimensions}
                </span>
              </div>
            )}

            {model.internalDimensions && (
              <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Вътрешни размери
                </span>

                <span className="font-medium">
                  {model.internalDimensions}
                </span>
              </div>
            )}

            {model.volume && (
              <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Обем
                </span>

                <span className="font-medium">
                  {model.volume}
                </span>
              </div>
            )}

            {model.weight && (
              <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Тегло
                </span>

                <span className="font-medium">
                  {model.weight}
                </span>
              </div>
            )}

            {model.resistance && (
              <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Степен на съпротивление
                </span>

                <span className="font-medium">
                  {model.resistance}
                </span>
              </div>
            )}

            {!model.dimensions &&
              !model.internalDimensions &&
              !model.volume &&
              !model.weight &&
              !model.resistance && (
                <div className="px-6 py-10 text-center text-sm text-black/40">
                  Техническите характеристики ще бъдат добавени.
                </div>
              )}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-32 rounded-3xl bg-black px-8 py-16 text-white sm:px-12 lg:px-16">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Нуждаете се от информация?
          </p>

          <h2 className="mt-5 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
            Свържете се с нас за повече информация.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-white/60">
            Нашият екип може да ви помогне с избора на подходящ
            модел и да предостави допълнителна информация.
          </p>

          <Link
            href="/uslugi"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            Свържете се с нас
          </Link>
        </section>

        {/* Back */}
        <div className="mt-16">
          <Link
            href={`/produkti/${product.slug}`}
            className="text-sm font-medium underline underline-offset-4"
          >
            ← Назад към {product.name}
          </Link>
        </div>
      </div>
    </main>
  );
}