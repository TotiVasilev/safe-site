import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ui/ProductGallery";
import Image from "next/image";
import ProductDescription from "@/components/ui/ProductDescription";
import ModelSelector from "@/components/ui/ModelSelector";
import { getEnglishProducts, getEnglishCategories } from "@/data/english";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getEnglishProducts().map((product) => ({
    slug: product.slug,
  }));
}

export const dynamicParams = false;

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = getEnglishProducts().find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  const parentCategory = product.category?.name ?? "";
  const parentSubcategory =
    product.subcategory?.name ?? "";
  const models = product.models ?? [];
  const category = getEnglishCategories().find((item) => item.name === parentCategory);
  const subcategory = category?.subcategories?.find((item) => item.name === parentSubcategory);


  if (product.lockCollection) {
    return (
      <main className="min-h-screen bg-white px-6 py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/en/produkti#category-bravi" className="text-sm text-black/50 hover:text-black">← Locks</Link>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[#3f7edb]">{product.cardLabel || "Locks"}</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-5 max-w-3xl text-black/60"><ProductDescription description={product.description} attachments={product.attachments} /></p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(product.lockItems || []).map((item, index) => <article key={`${item.name}-${index}`} className="overflow-hidden rounded-2xl border border-black/10 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-[4/3] bg-neutral-50">{item.image ? <Image src={item.image} alt={item.name} fill unoptimized sizes="(max-width: 640px) 100vw, 33vw" className="object-contain p-5"/> : <div className="flex h-full items-center justify-center text-sm text-black/35">No image available</div>}</div>
              <div className="p-6">{item.cardLabel && <p className="text-xs uppercase tracking-widest text-[#3f7edb]">{item.cardLabel}</p>}<h2 className="mt-2 text-xl font-medium">{item.name}</h2>{item.description && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-black/60">{item.description}</p>}</div>
            </article>)}
          </div>
          {!(product.lockItems?.length) && <p className="mt-12 text-sm text-black/50">Add locks in Content Manager to display them here.</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-center gap-2 text-sm text-black/40">
          <Link href="/en/" className="transition-colors hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/en/produkti" className="transition-colors hover:text-black">
            Products
          </Link>
          <span>/</span>

          {parentCategory && (
            <>
              {category ? (
                <Link href={`/en/produkti#category-${category.slug}`} className="transition-colors hover:text-black">{parentCategory}</Link>
              ) : <span>{parentCategory}</span>}
              <span>/</span>
            </>
          )}

          {parentSubcategory && (
            <>
              {category && subcategory ? (
                <Link href={`/en/produkti#subcategory-${category.slug}-${subcategory.id}`} className="transition-colors hover:text-black">{parentSubcategory}</Link>
              ) : <span>{parentSubcategory}</span>}
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
            <p className="text-xs uppercase tracking-[0.3em] text-[#3f7edb]">
              {product.cardLabel ||
                parentSubcategory ||
                parentCategory}
            </p>

            <h1 className="mt-5 text-5xl font-medium tracking-tight sm:text-6xl">
              {product.name}
            </h1>

            <p className="mt-7 max-w-xl whitespace-pre-line text-lg leading-8 text-black/60">
              <ProductDescription description={product.description} attachments={product.attachments} />
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-black px-4 py-2 text-sm text-white">
                {models.length} {models.length === 1 ? "model" : "models"}
              </span>

              <span className="rounded-full border border-black/10 px-4 py-2 text-sm">
                Professional security
              </span>
            </div>

            <div className="mt-7 flex justify-end sm:block">
              <a
                href="mailto:info@tetraedar.com"
                className="inline-flex items-center gap-3 rounded-full bg-[#3f7edb] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#326bc1]"
              >
                Contact us <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        {models.length > 0 && (
          <ModelSelector models={models} drawing={product.modelDrawing} productName={product.name} locale="en" />
        )}

        <section className="mt-32 rounded-3xl bg-black px-8 py-16 text-white sm:px-12 lg:px-16">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Have questions?
          </p>

          <h2 className="mt-5 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
            Let us find the right solution for your needs.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-white/60">
            Contact us for more information about the models, their specifications, and delivery and installation options.
          </p>

          <Link
            href="mailto:info@tetraedar.com"
            className="mt-8 flex w-fit ml-auto sm:ml-0 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            Contact us
          </Link>
        </section>
      </div>
    </main>
  );
}
