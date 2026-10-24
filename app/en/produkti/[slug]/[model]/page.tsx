import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnglishProducts } from "@/data/english";

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

export function generateStaticParams() {
  return getEnglishProducts().flatMap((product) =>
    (product.models ?? []).map((model) => ({
      slug: product.slug,
      model: createSlug(model.name),
    }))
  );
}

export const dynamicParams = false;

export default async function ModelPage({
  params,
}: ModelPageProps) {
  const { slug, model: modelSlug } = await params;

  const product = getEnglishProducts().find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  const model = (product.models ?? []).find(
    (item) => createSlug(item.name) === modelSlug
  );

  if (!model) {
    notFound();
  }

  const parentCategory = product.category?.name ?? "";
  const parentSubcategory =
    product.subcategory?.name ?? "";

  return (
    <main className="min-h-screen bg-white px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-center gap-2 text-sm text-black/40">
          <Link
            href="/en/"
            className="transition-colors hover:text-black"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/en/produkti"
            className="transition-colors hover:text-black"
          >
            Products
          </Link>

          <span>/</span>

          <Link
            href={`/en/produkti/${product.slug}`}
            className="transition-colors hover:text-black"
          >
            {product.name}
          </Link>

          <span>/</span>

          <span className="text-black">
            {model.name}
          </span>
        </div>

        <section className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            <div className="flex h-full items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] text-black/20">
                {model.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#3f7edb]">
              {parentSubcategory || parentCategory}
            </p>

            <p className="mt-5 text-sm text-black/40">
              {product.name}
            </p>

            <h1 className="mt-3 text-5xl font-medium tracking-tight sm:text-6xl">
              {model.name}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-black/60">
              Technical specifications and information for model{" "}
              {model.name}.
            </p>
          </div>
        </section>

        <section className="mt-32">
          <div className="border-b border-black/10 pb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#3f7edb]">
              Specifications
            </p>

            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Technical specifications
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10">
            {model.dimensions && (
              <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  External dimensions
                </span>

                <span className="font-medium">
                  {model.dimensions}
                </span>
              </div>
            )}

            {model.internalDimensions && (
              <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Internal dimensions
                </span>

                <span className="font-medium">
                  {model.internalDimensions}
                </span>
              </div>
            )}

            {model.volume && (
              <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Volume
                </span>

                <span className="font-medium">
                  {model.volume}
                </span>
              </div>
            )}

            {model.weight && (
              <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Weight
                </span>

                <span className="font-medium">
                  {model.weight}
                </span>
              </div>
            )}

            {model.resistance && (
              <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-black/50">
                  Resistance grade
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
                  Technical specifications will be added.
                </div>
              )}
          </div>
        </section>

        <section className="mt-32 rounded-3xl bg-black px-8 py-16 text-white sm:px-12 lg:px-16">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Need more information?
          </p>

          <h2 className="mt-5 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
            Contact us for more information.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-white/60">
            Our team can help you choose the right model and provide additional information.
          </p>

          <Link
            href="/en/uslugi"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            Contact us
          </Link>
        </section>

        <div className="mt-16">
          <Link
            href={`/en/produkti/${product.slug}`}
            className="text-sm font-medium underline underline-offset-4"
          >
            ← Back to {product.name}
          </Link>
        </div>
      </div>
    </main>
  );
}