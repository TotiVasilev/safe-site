"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from "motion/react";

import type {
  ProductCategory,
  ProductFamily,
} from "@/data/products";

type ProductsCatalogProps = {
  categories: ProductCategory[];
};

type SelectedProduct = {
  product: ProductFamily;
  category: string;
  subcategory?: string;
};

export default function ProductsCatalog({
  categories,
}: ProductsCatalogProps) {
  const [selected, setSelected] =
    useState<SelectedProduct | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Disable background scrolling while product is expanded
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  /*
  |--------------------------------------------------------------------------
  | Close with ESC
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <LayoutGroup>
      {/* MAIN CATALOG */}
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-32 lg:px-12">
        {/* PAGE HEADER */}
        <motion.header
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-3xl"
        >
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
        </motion.header>

        {/* CATEGORY NAVIGATION */}
        <motion.nav
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-16 overflow-x-auto border-y border-black/10 py-4"
        >
          <div className="flex min-w-max gap-6">
            {categories.map((category, index) => (
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
        </motion.nav>

        {/* CATEGORIES */}
        <div className="mt-24 space-y-32">
          {categories.map((category, categoryIndex) => (
            <motion.section
              key={category.id}
              id={category.slug}
              initial={{
                opacity: 0,
                y: 35,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.08,
              }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="scroll-mt-28"
            >
              {/* CATEGORY HEADER */}
              <div className="flex items-end justify-between border-b border-black/10 pb-6">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-black/30">
                    Категория{" "}
                    {String(categoryIndex + 1).padStart(2, "0")}
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

              {/* SUBCATEGORIES */}
              {category.subcategories && (
                <div className="mt-12 space-y-20">
                  {category.subcategories.map(
                    (subcategory, subcategoryIndex) => (
                      <div key={subcategory.id}>
                        <div className="mb-7 flex items-center gap-4">
                          <span className="text-xs text-black/25">
                            {String(
                              subcategoryIndex + 1
                            ).padStart(2, "0")}
                          </span>

                          <h3 className="text-xl font-medium tracking-tight">
                            {subcategory.name}
                          </h3>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {subcategory.products.map(
                            (product, productIndex) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                category={category.name}
                                subcategory={subcategory.name}
                                index={productIndex}
                                onOpen={() =>
                                  setSelected({
                                    product,
                                    category: category.name,
                                    subcategory:
                                      subcategory.name,
                                  })
                                }
                              />
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* DIRECT PRODUCTS */}
              {category.products && (
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.products.map(
                    (product, productIndex) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        category={category.name}
                        index={productIndex}
                        onOpen={() =>
                          setSelected({
                            product,
                            category: category.name,
                          })
                        }
                      />
                    )
                  )}
                </div>
              )}
            </motion.section>
          ))}
        </div>
      </div>

      {/* EXPANDED PRODUCT */}
      <AnimatePresence>
        {selected && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
              }}
              className="fixed inset-0 z-[90] bg-black/25 backdrop-blur-[3px]"
            />

            {/* EXPANDED CARD */}
            <motion.div
              layoutId={`product-${selected.product.id}`}
              transition={{
                layout: {
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="fixed inset-3 z-[100] overflow-hidden rounded-[28px] bg-white shadow-2xl sm:inset-5 lg:inset-8"
            >
              <div className="h-full overflow-y-auto">
                <ExpandedProduct
                  selected={selected}
                  onClose={() => setSelected(null)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

/*
|--------------------------------------------------------------------------
| PRODUCT CARD
|--------------------------------------------------------------------------
*/

type ProductCardProps = {
  product: ProductFamily;
  category: string;
  subcategory?: string;
  index: number;
  onOpen: () => void;
};

function ProductCard({
  product,
  category,
  subcategory,
  index,
  onOpen,
}: ProductCardProps) {
  return (
    <motion.div
      layoutId={`product-${product.id}`}
      initial={{
        opacity: 0,
        y: 35,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        delay: index * 0.07,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="overflow-hidden rounded-2xl border border-black/10 bg-white"
    >
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full text-left"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <div className="flex h-full items-center justify-center">
            <span className="text-xs uppercase tracking-[0.3em] text-black/20">
              SAFETY
            </span>
          </div>

          <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100">
            →
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-black/30">
            {subcategory ?? category}
          </p>

          <h4 className="mt-3 text-lg font-medium tracking-tight">
            {product.name}
          </h4>

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
      </button>
    </motion.div>
  );
}

/*
|--------------------------------------------------------------------------
| EXPANDED PRODUCT
|--------------------------------------------------------------------------
*/

type ExpandedProductProps = {
  selected: SelectedProduct;
  onClose: () => void;
};

function ExpandedProduct({
  selected,
  onClose,
}: ExpandedProductProps) {
  const { product, category, subcategory } = selected;

  return (
    <div className="relative min-h-full bg-white">
      {/* CLOSE */}
      <motion.button
        type="button"
        onClick={onClose}
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.35,
          duration: 0.3,
        }}
        aria-label="Затвори продукта"
        className="fixed right-7 top-7 z-[120] flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/90 shadow-lg backdrop-blur transition-transform hover:scale-105 sm:right-10 sm:top-10 lg:right-14 lg:top-14"
      >
        <span className="text-2xl font-light leading-none">
          ×
        </span>
      </motion.button>

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 sm:pt-24 lg:px-12 lg:pb-28 lg:pt-28">
        {/* PRODUCT HERO */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* IMAGE */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.25,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="aspect-square overflow-hidden rounded-3xl bg-neutral-100"
          >
            <div className="flex h-full items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] text-black/20">
                SAFETY
              </span>
            </div>
          </motion.div>

          {/* INFO */}
          <motion.div
            initial={{
              opacity: 0,
              x: 35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.28,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              {category}
              {subcategory && ` / ${subcategory}`}
            </p>

            <h1 className="mt-5 text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
              {product.name}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-black/60">
              {product.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {product.models.length > 0 && (
                <span className="rounded-full bg-black px-4 py-2 text-sm text-white">
                  {product.models.length}{" "}
                  {product.models.length === 1
                    ? "модел"
                    : "модела"}
                </span>
              )}

              <span className="rounded-full border border-black/10 px-4 py-2 text-sm">
                Професионална сигурност
              </span>
            </div>
          </motion.div>
        </div>

        {/* MODELS */}
        {product.models.length > 0 && (
          <motion.section
            initial={{
              opacity: 0,
              y: 45,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.45,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-28 lg:mt-32"
          >
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
                <motion.button
                  type="button"
                  key={model.name}
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.04,
                    duration: 0.4,
                  }}
                  className="group flex w-full items-center justify-between border-b border-black/10 px-6 py-5 text-left transition-colors last:border-b-0 hover:bg-black/[0.025]"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-xs text-black/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-medium">
                      {model.name}
                    </span>
                  </div>

                  <span className="text-sm text-black/25 transition-transform duration-300 group-hover:translate-x-1">
                    +
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {/* CONTACT AREA — SAME IDEA AS OLD PRODUCT PAGE */}
        <motion.section
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.55,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-28 rounded-3xl bg-black px-8 py-16 text-white sm:px-12 lg:mt-32 lg:px-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Имате въпроси?
          </p>

          <h2 className="mt-5 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
            Нека намерим правилното решение за вашите нужди.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-white/60">
            Свържете се с нас за повече информация относно
            моделите, характеристиките и възможностите за доставка
            и монтаж.
          </p>

          <button
            type="button"
            className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            Свържете се с нас
          </button>
        </motion.section>
      </div>
    </div>
  );
}