"use client";

import { useEffect, useRef, useState } from "react";
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

  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug ?? ""
  );

  const [activeSubcategory, setActiveSubcategory] =
    useState<string | null>(null);

  const [floatingMenu, setFloatingMenu] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);

  const navigationMarkerRef = useRef<HTMLDivElement | null>(null);

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
  | Close expanded product with ESC
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

  /*
  |--------------------------------------------------------------------------
  | Normal navigation -> floating navigation
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function updateFloatingMenu() {
      const marker = navigationMarkerRef.current;

      if (!marker) return;

      const rect = marker.getBoundingClientRect();

      setFloatingMenu(rect.bottom < 80);
    }

    updateFloatingMenu();

    window.addEventListener("scroll", updateFloatingMenu, {
      passive: true,
    });

    window.addEventListener("resize", updateFloatingMenu);

    return () => {
      window.removeEventListener("scroll", updateFloatingMenu);
      window.removeEventListener("resize", updateFloatingMenu);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Detect active category + subcategory
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function updateActiveSection() {
      const detectionLine = 170;

      let currentCategory = categories[0]?.slug ?? "";
      let currentSubcategory: string | null = null;

      for (const category of categories) {
        const categoryElement = document.getElementById(
          `category-${category.slug}`
        );

        if (!categoryElement) continue;

        const categoryRect =
          categoryElement.getBoundingClientRect();

        if (categoryRect.top <= detectionLine) {
          currentCategory = category.slug;
          currentSubcategory = null;

          if (category.subcategories) {
            for (const subcategory of category.subcategories) {
              const subcategoryElement = document.getElementById(
                `subcategory-${category.slug}-${subcategory.id}`
              );

              if (!subcategoryElement) continue;

              const subcategoryRect =
                subcategoryElement.getBoundingClientRect();

              if (subcategoryRect.top <= detectionLine) {
                currentSubcategory = subcategory.id;
              }
            }
          }
        }
      }

      /*
       * Fix for the final category / final subcategory.
       * The final heading sometimes cannot physically reach the detection
       * line because the page ends first.
       */
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;

      if (atBottom && categories.length > 0) {
        const lastCategory = categories[categories.length - 1];

        currentCategory = lastCategory.slug;

        if (
          lastCategory.subcategories &&
          lastCategory.subcategories.length > 0
        ) {
          currentSubcategory =
            lastCategory.subcategories[
              lastCategory.subcategories.length - 1
            ].id;
        } else {
          currentSubcategory = null;
        }
      }

      setActiveCategory(currentCategory);
      setActiveSubcategory(currentSubcategory);
    }

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [categories]);

  /*
  |--------------------------------------------------------------------------
  | Instant navigation
  |--------------------------------------------------------------------------
  */

  function jumpToElement(elementId: string) {
    const element = document.getElementById(elementId);

    if (!element) return;

    const headerOffset = 105;

    const top =
      element.getBoundingClientRect().top +
      window.scrollY -
      headerOffset;

    window.scrollTo({
      top,
      behavior: "auto",
    });
  }

  function jumpToCategory(slug: string) {
    setActiveCategory(slug);
    setActiveSubcategory(null);

    jumpToElement(`category-${slug}`);
  }

  function jumpToSubcategory(
    categorySlug: string,
    subcategoryId: string
  ) {
    setActiveCategory(categorySlug);
    setActiveSubcategory(subcategoryId);

    jumpToElement(
      `subcategory-${categorySlug}-${subcategoryId}`
    );
  }

  return (
    <LayoutGroup>
      {/* =========================================================
          MAIN CATALOG
      ========================================================= */}

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-32 lg:px-12">
        {/* =======================================================
            PAGE HEADER
        ======================================================= */}

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

        {/* =======================================================
            ORIGINAL CATEGORY NAVIGATION
        ======================================================= */}

        <div ref={navigationMarkerRef}>
          <motion.nav
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: floatingMenu ? 0 : 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-16 border-y border-black/10 py-4"
          >
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {categories.map((category) => {
                const active =
                  activeCategory === category.slug;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      jumpToCategory(category.slug)
                    }
                    className={`relative py-1 text-sm transition-colors duration-200 ${
                      active
                        ? "text-[#3f7edb]"
                        : "text-black/45 hover:text-black"
                    }`}
                  >
                    {category.name}

                    {active && (
                      <motion.span
                        layoutId="top-category-indicator"
                        className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-[#3f7edb]"
                        transition={{
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        </div>

        {/* =======================================================
            CATEGORIES

            IMPORTANT:
            When the floating menu appears, the catalog shifts right.
            This keeps the menu from covering product cards/headings.
        ======================================================= */}

        <motion.div
          animate={{
            paddingLeft: floatingMenu ? 150 : 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-24 space-y-32"
        >
          {categories.map((category) => (
            <motion.section
              key={category.id}
              id={`category-${category.slug}`}
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
            >
              {/* CATEGORY HEADER */}

              <div className="flex items-end justify-between border-b border-black/10 pb-6">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-black/30">
                    Категория
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
                    (subcategory) => (
                      <div
                        key={subcategory.id}
                        id={`subcategory-${category.slug}-${subcategory.id}`}
                      >
                        <div className="mb-7 flex items-center gap-4">
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
                                    category:
                                      category.name,
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
                            category:
                              category.name,
                          })
                        }
                      />
                    )
                  )}
                </div>
              )}
            </motion.section>
          ))}
        </motion.div>
      </div>

      {/* =========================================================
          FLOATING CATEGORY NAVIGATION
      ========================================================= */}

      <AnimatePresence>
        {floatingMenu && !selected && (
          <motion.nav
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -30,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setMenuHovered(true)}
            onMouseLeave={() => setMenuHovered(false)}
            className="fixed left-4 top-28 z-40 hidden lg:block"
          >
            <motion.div
              animate={{
                width: menuHovered ? 245 : 200,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.07)] backdrop-blur-xl"
            >
              {categories.map((category) => {
                const categoryActive =
                  activeCategory === category.slug;

                const showSubcategories =
                  categoryActive || menuHovered;

                return (
                  <div key={category.id}>
                    {/* CATEGORY BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        jumpToCategory(category.slug)
                      }
                      className="group flex w-full items-center rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/[0.025]"
                    >
                      <span
                        className={`mr-3 block shrink-0 rounded-full transition-all duration-300 ${
                          categoryActive
                            ? "h-2.5 w-2.5 bg-[#3f7edb] shadow-[0_0_0_4px_rgba(63,126,219,0.10)]"
                            : "h-1.5 w-1.5 bg-black/20 group-hover:bg-black/45"
                        }`}
                      />

                      <span
                        className={`whitespace-nowrap text-sm transition-colors duration-200 ${
                          categoryActive
                            ? "font-medium text-[#3f7edb]"
                            : "text-black/45 group-hover:text-black/75"
                        }`}
                      >
                        {category.name}
                      </span>
                    </button>

                    {/* SUBCATEGORIES */}

                    <AnimatePresence initial={false}>
                      {category.subcategories &&
                        category.subcategories.length > 0 &&
                        showSubcategories && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.28,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="relative mb-2 ml-[19px] mt-1 border-l border-black/10 pl-5">
                              {category.subcategories.map(
                                (subcategory) => {
                                  const subcategoryActive =
                                    categoryActive &&
                                    activeSubcategory ===
                                      subcategory.id;

                                  return (
                                    <button
                                      key={subcategory.id}
                                      type="button"
                                      onClick={() =>
                                        jumpToSubcategory(
                                          category.slug,
                                          subcategory.id
                                        )
                                      }
                                      className={`relative block w-full py-2 pr-2 text-left text-xs leading-5 transition-colors duration-200 ${
                                        subcategoryActive
                                          ? "font-medium text-[#3f7edb]"
                                          : "text-black/35 hover:text-black/70"
                                      }`}
                                    >
                                      {subcategoryActive && (
                                        <motion.span
                                          layoutId="active-subcategory-dot"
                                          className="absolute -left-[23px] top-[14px] h-[5px] w-[5px] rounded-full bg-[#3f7edb]"
                                        />
                                      )}

                                      {subcategory.name}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* =========================================================
          EXPANDED PRODUCT
      ========================================================= */}

      <AnimatePresence>
        {selected && (
          <>
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

        {/* CONTACT */}

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
            Свържете се с нас за повече информация относно моделите,
            характеристиките и възможностите за доставка и монтаж.
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