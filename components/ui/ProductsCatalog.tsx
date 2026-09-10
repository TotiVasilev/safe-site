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

  const [floatingMenu, setFloatingMenu] =
    useState(false);

  const [menuHovered, setMenuHovered] =
    useState(false);

  const [mobileStickyMenu, setMobileStickyMenu] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const navigationMarkerRef =
    useRef<HTMLDivElement | null>(null);

  const currentCategory =
    categories.find(
      (category) =>
        category.slug === activeCategory
    ) ?? categories[0];

  const currentSubcategory =
    currentCategory?.subcategories?.find(
      (subcategory) =>
        subcategory.id === activeSubcategory
    ) ?? null;

  /* =========================================================
     CLOSE PRODUCT MENU WHEN MAIN HEADER MENU OPENS
  ========================================================= */

  useEffect(() => {
    function handleMainMenuOpen() {
      setMobileMenuOpen(false);
    }

    window.addEventListener(
      "tetraedar:main-menu-open",
      handleMainMenuOpen
    );

    return () => {
      window.removeEventListener(
        "tetraedar:main-menu-open",
        handleMainMenuOpen
      );
    };
  }, []);

  /* =========================================================
     LOCK BODY WHEN PRODUCT IS OPEN
  ========================================================= */

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

  /* =========================================================
     ESC CLOSE
  ========================================================= */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (selected) {
        setSelected(null);
        return;
      }

      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selected, mobileMenuOpen]);

  /* =========================================================
     REAL DOCUMENT TOP

     offsetTop ignores Motion's temporary translateY,
     unlike getBoundingClientRect().
  ========================================================= */

  function getDocumentTop(element: HTMLElement) {
    let top = 0;
    let current: HTMLElement | null = element;

    while (current) {
      top += current.offsetTop;
      current = current.offsetParent as HTMLElement | null;
    }

    return top;
  }

  /* =========================================================
     HOMEPAGE HASH NAVIGATION FIX

     Example:
     /produkti#category-trezorni-reshenia

     Browser may jump too early by itself, so after the catalog
     mounts we correct the position using the real layout position.
  ========================================================= */

  useEffect(() => {
    const rawHash = window.location.hash;

    if (!rawHash) return;

    const elementId = decodeURIComponent(
      rawHash.slice(1)
    );

    if (!elementId) return;

    let frame1 = 0;
    let frame2 = 0;
    let timer = 0;

    function correctHashPosition() {
      const element =
        document.getElementById(elementId);

      if (!element) return;

      const isMobile =
        window.innerWidth < 1024;

      /*
      | MOBILE:
      | 80px main header
      | + room for sticky category bar
      | + small visual breathing space
      |
      | DESKTOP:
      | 80px header
      | + comfortable gap
      */

      const offset =
        isMobile ? 150 : 120;

      const targetTop =
        getDocumentTop(element) -
        offset;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "auto",
      });
    }

    /*
    | First correction after layout.
    */

    frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        correctHashPosition();
      });
    });

    /*
    | Second correction after the entrance animations/layout
    | have had a moment to settle.
    */

    timer = window.setTimeout(() => {
      correctHashPosition();
    }, 180);

    return () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
      window.clearTimeout(timer);
    };
  }, [categories]);

  /* =========================================================
     DESKTOP FLOATING MENU + MOBILE STICKY MENU
  ========================================================= */

  useEffect(() => {
    function updateNavigationState() {
      const marker =
        navigationMarkerRef.current;

      if (!marker) return;

      const rect =
        marker.getBoundingClientRect();

      if (window.innerWidth < 1024) {
        setFloatingMenu(false);

        setMobileStickyMenu(
          rect.bottom < 70
        );

        return;
      }

      setMobileStickyMenu(false);
      setMobileMenuOpen(false);

      setFloatingMenu(
        rect.bottom < 80
      );
    }

    updateNavigationState();

    window.addEventListener(
      "scroll",
      updateNavigationState,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      updateNavigationState
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateNavigationState
      );

      window.removeEventListener(
        "resize",
        updateNavigationState
      );
    };
  }, []);

  /* =========================================================
     ACTIVE CATEGORY DETECTION
  ========================================================= */

  useEffect(() => {
    function updateActiveSection() {
      const detectionLine =
        window.innerWidth < 1024
          ? 155
          : 170;

      let currentCategorySlug =
        categories[0]?.slug ?? "";

      let currentSubcategoryId:
        | string
        | null = null;

      for (const category of categories) {
        const categoryElement =
          document.getElementById(
            `category-${category.slug}`
          );

        if (!categoryElement) continue;

        const categoryRect =
          categoryElement.getBoundingClientRect();

        if (
          categoryRect.top <=
          detectionLine
        ) {
          currentCategorySlug =
            category.slug;

          currentSubcategoryId = null;

          if (category.subcategories) {
            for (
              const subcategory of
              category.subcategories
            ) {
              const subcategoryElement =
                document.getElementById(
                  `subcategory-${category.slug}-${subcategory.id}`
                );

              if (!subcategoryElement) {
                continue;
              }

              const subcategoryRect =
                subcategoryElement.getBoundingClientRect();

              if (
                subcategoryRect.top <=
                detectionLine
              ) {
                currentSubcategoryId =
                  subcategory.id;
              }
            }
          }
        }
      }

      const atBottom =
        window.innerHeight +
          window.scrollY >=
        document.documentElement
          .scrollHeight -
          8;

      if (
        atBottom &&
        categories.length > 0
      ) {
        const lastCategory =
          categories[
            categories.length - 1
          ];

        currentCategorySlug =
          lastCategory.slug;

        if (
          lastCategory.subcategories &&
          lastCategory.subcategories
            .length > 0
        ) {
          currentSubcategoryId =
            lastCategory.subcategories[
              lastCategory
                .subcategories.length - 1
            ].id;
        } else {
          currentSubcategoryId = null;
        }
      }

      setActiveCategory(
        currentCategorySlug
      );

      setActiveSubcategory(
        currentSubcategoryId
      );
    }

    updateActiveSection();

    window.addEventListener(
      "scroll",
      updateActiveSection,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      updateActiveSection
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateActiveSection
      );

      window.removeEventListener(
        "resize",
        updateActiveSection
      );
    };
  }, [categories]);

  /* =========================================================
     JUMP HELPERS
  ========================================================= */

  function jumpToElement(
    elementId: string
  ) {
    const element =
      document.getElementById(
        elementId
      );

    if (!element) return;

    const isMobile =
      window.innerWidth < 1024;

    const headerOffset =
      isMobile ? 150 : 120;

    const top =
      getDocumentTop(element) -
      headerOffset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "auto",
    });
  }

  function jumpToCategory(
    slug: string
  ) {
    setActiveCategory(slug);
    setActiveSubcategory(null);
    setMobileMenuOpen(false);

    jumpToElement(
      `category-${slug}`
    );
  }

  function jumpToSubcategory(
    categorySlug: string,
    subcategoryId: string
  ) {
    setActiveCategory(
      categorySlug
    );

    setActiveSubcategory(
      subcategoryId
    );

    setMobileMenuOpen(false);

    jumpToElement(
      `subcategory-${categorySlug}-${subcategoryId}`
    );
  }

  return (
    <LayoutGroup>
      {/* =========================================================
          MAIN CATALOG
      ========================================================= */}

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pb-32 sm:pt-32 lg:px-12">
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
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="max-w-3xl"
        >
          <p className="text-[10px] uppercase tracking-[0.28em] text-black/35 sm:text-xs sm:tracking-[0.3em]">
            Каталог
          </p>

          <h1 className="mt-4 text-[2.8rem] font-medium leading-none tracking-[-0.045em] sm:mt-5 sm:text-6xl lg:text-7xl">
            Продукти
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-black/55 sm:mt-6 sm:text-lg sm:leading-8">
            Разгледайте нашите решения за
            сигурност, съхранение и защита.
          </p>
        </motion.header>

        {/* =======================================================
            CATEGORY NAVIGATION
        ======================================================= */}

        <div
          ref={navigationMarkerRef}
        >
          <motion.nav
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: floatingMenu
                ? 0
                : 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.6,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="mt-10 border-y border-black/10 py-3 sm:mt-16 sm:py-4"
          >
            {/* MOBILE GRID */}

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 lg:hidden">
              {categories.map(
                (category) => {
                  const active =
                    activeCategory ===
                    category.slug;

                  return (
                    <button
                      key={
                        category.id
                      }
                      type="button"
                      onClick={() =>
                        jumpToCategory(
                          category.slug
                        )
                      }
                      className={`relative flex min-h-[44px] w-full items-center rounded-lg px-2 py-2 text-left text-[13px] leading-[1.25] transition-colors ${
                        active
                          ? "bg-[#3f7edb]/[0.07] font-medium text-[#3f7edb]"
                          : "text-black/50"
                      }`}
                    >
                      {
                        category.name
                      }

                      {active && (
                        <motion.span
                          layoutId="mobile-top-category-indicator"
                          className="absolute bottom-0 left-2 right-2 h-px bg-[#3f7edb]"
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {/* DESKTOP NAV */}

            <div className="hidden flex-wrap gap-x-6 gap-y-3 lg:flex">
              {categories.map(
                (category) => {
                  const active =
                    activeCategory ===
                    category.slug;

                  return (
                    <button
                      key={
                        category.id
                      }
                      type="button"
                      onClick={() =>
                        jumpToCategory(
                          category.slug
                        )
                      }
                      className={`relative shrink-0 whitespace-nowrap py-1 text-sm transition-colors duration-200 ${
                        active
                          ? "text-[#3f7edb]"
                          : "text-black/45 hover:text-black"
                      }`}
                    >
                      {
                        category.name
                      }

                      {active && (
                        <motion.span
                          layoutId="top-category-indicator"
                          className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-[#3f7edb]"
                          transition={{
                            duration:
                              0.25,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </motion.nav>
        </div>

        {/* =======================================================
            PRODUCTS
        ======================================================= */}

        <motion.div
          animate={{
            paddingLeft:
              floatingMenu
                ? 150
                : 0,
          }}
          transition={{
            duration: 0.35,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="mt-20 space-y-24 max-lg:!pl-0 sm:mt-24 sm:space-y-32"
        >
          {categories.map(
            (category) => (
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
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="scroll-mt-[150px] lg:scroll-mt-[120px]"
              >
                {/* CATEGORY HEADER */}

                <div className="border-b border-black/10 pb-5 sm:flex sm:items-end sm:justify-between sm:pb-6">
                  <div>
                    <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-black/30 sm:mb-3 sm:text-xs">
                      Категория
                    </p>

                    <h2 className="text-[2rem] font-medium leading-tight tracking-[-0.035em] sm:text-4xl">
                      {
                        category.name
                      }
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
                  <div className="mt-8 space-y-14 sm:mt-12 sm:space-y-20">
                    {category.subcategories.map(
                      (
                        subcategory
                      ) => (
                        <div
                          key={
                            subcategory.id
                          }
                          id={`subcategory-${category.slug}-${subcategory.id}`}
                          className="scroll-mt-[150px] lg:scroll-mt-[120px]"
                        >
                          <div className="mb-5 sm:mb-7">
                            <h3 className="text-lg font-medium tracking-tight sm:text-xl">
                              {
                                subcategory.name
                              }
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                            {subcategory.products.map(
                              (
                                product,
                                productIndex
                              ) => (
                                <ProductCard
                                  key={
                                    product.id
                                  }
                                  product={
                                    product
                                  }
                                  category={
                                    category.name
                                  }
                                  subcategory={
                                    subcategory.name
                                  }
                                  index={
                                    productIndex
                                  }
                                  onOpen={() =>
                                    setSelected(
                                      {
                                        product,
                                        category:
                                          category.name,
                                        subcategory:
                                          subcategory.name,
                                      }
                                    )
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
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                    {category.products.map(
                      (
                        product,
                        productIndex
                      ) => (
                        <ProductCard
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                          category={
                            category.name
                          }
                          index={
                            productIndex
                          }
                          onOpen={() =>
                            setSelected(
                              {
                                product,
                                category:
                                  category.name,
                              }
                            )
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </motion.section>
            )
          )}
        </motion.div>
      </div>

      {/* =========================================================
          MOBILE STICKY NAV
      ========================================================= */}

      <AnimatePresence>
        {mobileStickyMenu &&
          !selected && (
            <>
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.button
                    type="button"
                    aria-label="Затвори менюто"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    onClick={() =>
                      setMobileMenuOpen(
                        false
                      )
                    }
                    className="fixed inset-0 z-[30] bg-black/10 lg:hidden"
                  />
                )}
              </AnimatePresence>

              <motion.div
                initial={{
                  opacity: 0,
                  y: -15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                }}
                transition={{
                  duration: 0.28,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="fixed left-0 right-0 top-[70px] z-[40] border-b border-black/10 bg-white/95 shadow-[0_4px_18px_rgba(0,0,0,0.035)] backdrop-blur-xl lg:hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(
                      (open) =>
                        !open
                    )
                  }
                  className="relative flex min-h-[52px] w-full items-center px-3 text-left sm:px-6"
                >
                  {currentSubcategory ? (
                    <>
                      <div className="min-w-0 flex-1 pr-12">
                        <p className="truncate text-[9px] font-medium uppercase tracking-[0.24em] text-[#3f7edb]">
                          {currentCategory?.name ??
                            "Каталог"}
                        </p>

                        <p className="mt-1 truncate text-[13px] font-medium leading-none text-black">
                          {
                            currentSubcategory.name
                          }
                        </p>
                      </div>

                      <motion.span
                        animate={{
                          rotate:
                            mobileMenuOpen
                              ? 180
                              : 0,
                        }}
                        transition={{
                          duration:
                            0.25,
                        }}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-lg text-black/40 sm:right-6"
                      >
                        ↓
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <div className="flex min-h-[52px] w-full items-center pr-12 text-left">
                        <p className="truncate text-[9px] font-medium uppercase tracking-[0.24em] text-[#3f7edb]">
                          {currentCategory?.name ??
                            "Каталог"}
                        </p>
                      </div>

                      <motion.span
                        animate={{
                          rotate:
                            mobileMenuOpen
                              ? 180
                              : 0,
                        }}
                        transition={{
                          duration:
                            0.25,
                        }}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-lg text-black/40 sm:right-6"
                      >
                        ↓
                      </motion.span>
                    </>
                  )}
                </button>

                <AnimatePresence
                  initial={false}
                >
                  {mobileMenuOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height:
                          "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration:
                          0.32,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      className="overflow-hidden border-t border-black/10 bg-white"
                    >
                      <div className="max-h-[65vh] overflow-y-auto px-4 pb-5 pt-3 sm:px-6">
                        {categories.map(
                          (
                            category
                          ) => {
                            const categoryActive =
                              activeCategory ===
                              category.slug;

                            return (
                              <div
                                key={
                                  category.id
                                }
                                className="border-b border-black/[0.07] last:border-b-0"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    jumpToCategory(
                                      category.slug
                                    )
                                  }
                                  className="flex w-full items-center justify-between py-4 text-left"
                                >
                                  <span
                                    className={`text-[15px] font-medium transition-colors ${
                                      categoryActive
                                        ? "text-[#3f7edb]"
                                        : "text-black"
                                    }`}
                                  >
                                    {
                                      category.name
                                    }
                                  </span>

                                  {categoryActive && (
                                    <span className="h-2 w-2 rounded-full bg-[#3f7edb]" />
                                  )}
                                </button>

                                {category.subcategories &&
                                  category
                                    .subcategories
                                    .length >
                                    0 && (
                                    <div className="mb-3 border-l border-black/10 pl-4">
                                      {category.subcategories.map(
                                        (
                                          subcategory
                                        ) => {
                                          const subcategoryActive =
                                            categoryActive &&
                                            activeSubcategory ===
                                              subcategory.id;

                                          return (
                                            <button
                                              key={
                                                subcategory.id
                                              }
                                              type="button"
                                              onClick={() =>
                                                jumpToSubcategory(
                                                  category.slug,
                                                  subcategory.id
                                                )
                                              }
                                              className={`flex w-full items-center justify-between py-2.5 text-left text-sm transition-colors ${
                                                subcategoryActive
                                                  ? "font-medium text-[#3f7edb]"
                                                  : "text-black/45"
                                              }`}
                                            >
                                              <span>
                                                {
                                                  subcategory.name
                                                }
                                              </span>

                                              {subcategoryActive && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#3f7edb]" />
                                              )}
                                            </button>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          )}
      </AnimatePresence>

      {/* =========================================================
          DESKTOP FLOATING NAV
      ========================================================= */}

      <AnimatePresence>
        {floatingMenu &&
          !selected && (
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
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              onMouseEnter={() =>
                setMenuHovered(
                  true
                )
              }
              onMouseLeave={() =>
                setMenuHovered(
                  false
                )
              }
              className="fixed left-4 top-28 z-40 hidden lg:block"
            >
              <motion.div
                animate={{
                  width: menuHovered
                    ? 245
                    : 200,
                }}
                transition={{
                  duration: 0.3,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.07)] backdrop-blur-xl"
              >
                {categories.map(
                  (category) => {
                    const categoryActive =
                      activeCategory ===
                      category.slug;

                    const showSubcategories =
                      categoryActive ||
                      menuHovered;

                    return (
                      <div
                        key={
                          category.id
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            jumpToCategory(
                              category.slug
                            )
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
                            {
                              category.name
                            }
                          </span>
                        </button>

                        <AnimatePresence
                          initial={
                            false
                          }
                        >
                          {category.subcategories &&
                            category
                              .subcategories
                              .length >
                              0 &&
                            showSubcategories && (
                              <motion.div
                                initial={{
                                  height:
                                    0,
                                  opacity:
                                    0,
                                }}
                                animate={{
                                  height:
                                    "auto",
                                  opacity:
                                    1,
                                }}
                                exit={{
                                  height:
                                    0,
                                  opacity:
                                    0,
                                }}
                                transition={{
                                  duration:
                                    0.28,
                                  ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                  ],
                                }}
                                className="overflow-hidden"
                              >
                                <div className="relative mb-2 ml-[19px] mt-1 border-l border-black/10 pl-5">
                                  {category.subcategories.map(
                                    (
                                      subcategory
                                    ) => {
                                      const subcategoryActive =
                                        categoryActive &&
                                        activeSubcategory ===
                                          subcategory.id;

                                      return (
                                        <button
                                          key={
                                            subcategory.id
                                          }
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

                                          {
                                            subcategory.name
                                          }
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
                  }
                )}
              </motion.div>
            </motion.nav>
          )}
      </AnimatePresence>

      {/* =========================================================
          PRODUCT OVERLAY
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
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                },
              }}
              className="fixed inset-2 z-[100] overflow-hidden rounded-[22px] bg-white shadow-2xl sm:inset-5 sm:rounded-[28px] lg:inset-8"
            >
              <div className="h-full overflow-y-auto">
                <ExpandedProduct
                  selected={
                    selected
                  }
                  onClose={() =>
                    setSelected(
                      null
                    )
                  }
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

/* ===============================================================
   PRODUCT CARD
================================================================ */

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
        y: 25,
        scale: 0.98,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        delay: index * 0.05,
        duration: 0.55,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="min-w-0 overflow-hidden rounded-[18px] border border-black/10 bg-white sm:rounded-2xl"
    >
      <button
        type="button"
        onClick={onOpen}
        className="group block h-full w-full text-left"
      >
        <div className="relative aspect-[1/1.03] overflow-hidden bg-neutral-100 sm:aspect-[4/3]">
          <div className="flex h-full items-center justify-center">
            <span className="text-[8px] uppercase tracking-[0.3em] text-black/20 sm:text-xs">
              SAFETY
            </span>
          </div>

          <div className="absolute right-5 top-5 hidden h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100 lg:flex">
            →
          </div>
        </div>

        <div className="p-3.5 sm:p-6">
          <p className="truncate text-[8px] uppercase tracking-[0.18em] text-black/30 sm:text-xs sm:tracking-[0.2em]">
            {subcategory ??
              category}
          </p>

          <h4 className="mt-2 line-clamp-2 text-[15px] font-medium leading-[1.25] tracking-tight sm:mt-3 sm:text-lg">
            {product.name}
          </h4>

          <p className="mt-3 hidden line-clamp-2 text-sm leading-6 text-black/50 sm:block">
            {
              product.description
            }
          </p>

          <div className="mt-4 border-t border-black/10 pt-3 sm:mt-6 sm:flex sm:items-center sm:justify-between sm:pt-4">
            <span className="block text-[9px] text-black/35 sm:text-xs">
              {
                product.models
                  .length
              }{" "}
              {product.models
                .length === 1
                ? "модел"
                : "модела"}
            </span>

            <span className="mt-2 block text-[10px] font-medium leading-4 sm:mt-0 sm:text-xs">
              Виж продукта
              <span className="ml-1">
                →
              </span>
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

/* ===============================================================
   EXPANDED PRODUCT
================================================================ */

type ExpandedProductProps = {
  selected: SelectedProduct;
  onClose: () => void;
};

function ExpandedProduct({
  selected,
  onClose,
}: ExpandedProductProps) {
  const {
    product,
    category,
    subcategory,
  } = selected;

  return (
    <div className="relative min-h-full bg-white">
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
        className="fixed right-5 top-5 z-[120] flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/90 shadow-lg backdrop-blur transition-transform hover:scale-105 sm:right-10 sm:top-10 sm:h-12 sm:w-12 lg:right-14 lg:top-14"
      >
        <span className="text-2xl font-light leading-none">
          ×
        </span>
      </motion.button>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-12 lg:pb-28 lg:pt-28">
        <div className="grid gap-9 sm:gap-12 lg:grid-cols-2 lg:gap-20">
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
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="aspect-[1/0.9] overflow-hidden rounded-[22px] bg-neutral-100 sm:aspect-square sm:rounded-3xl"
          >
            <div className="flex h-full items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-black/20 sm:text-xs">
                SAFETY
              </span>
            </div>
          </motion.div>

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
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="flex flex-col justify-center"
          >
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/40 sm:text-xs sm:tracking-[0.3em]">
              {category}
              {subcategory &&
                ` / ${subcategory}`}
            </p>

            <h1 className="mt-4 text-[2.6rem] font-medium leading-[0.98] tracking-[-0.045em] sm:mt-5 sm:text-6xl lg:text-7xl">
              {product.name}
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-black/60 sm:mt-7 sm:text-lg sm:leading-8">
              {
                product.description
              }
            </p>

            <div className="mt-7 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
              {product.models
                .length > 0 && (
                <span className="rounded-full bg-black px-4 py-2 text-xs text-white sm:text-sm">
                  {
                    product.models
                      .length
                  }{" "}
                  {product.models
                    .length === 1
                    ? "модел"
                    : "модела"}
                </span>
              )}

              <span className="rounded-full border border-black/10 px-4 py-2 text-xs sm:text-sm">
                Професионална сигурност
              </span>
            </div>
          </motion.div>
        </div>

        {product.models.length >
          0 && (
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
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="mt-20 sm:mt-28 lg:mt-32"
          >
            <div className="border-b border-black/10 pb-5 sm:pb-6">
              <p className="text-[9px] uppercase tracking-[0.25em] text-black/40 sm:text-xs sm:tracking-[0.3em]">
                Модели
              </p>

              <h2 className="mt-3 text-[2rem] font-medium tracking-tight sm:text-4xl">
                Налични модели
              </h2>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 sm:mt-8">
              {product.models.map(
                (
                  model,
                  index
                ) => (
                  <motion.button
                    type="button"
                    key={
                      model.name
                    }
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        0.5 +
                        index *
                          0.04,
                      duration:
                        0.4,
                    }}
                    className="group flex w-full items-center justify-between border-b border-black/10 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-black/[0.025] sm:px-6 sm:py-5"
                  >
                    <span className="text-sm font-medium sm:text-base">
                      {
                        model.name
                      }
                    </span>

                    <span className="text-sm text-black/25 transition-transform duration-300 group-hover:translate-x-1">
                      +
                    </span>
                  </motion.button>
                )
              )}
            </div>
          </motion.section>
        )}

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
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="mt-20 rounded-[22px] bg-black px-5 py-10 text-white sm:mt-28 sm:rounded-3xl sm:px-12 sm:py-16 lg:mt-32 lg:px-16"
        >
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 sm:text-xs sm:tracking-[0.3em]">
            Имате въпроси?
          </p>

          <h2 className="mt-4 max-w-2xl text-[2rem] font-medium leading-[1.05] tracking-[-0.035em] sm:mt-5 sm:text-4xl">
            Нека намерим правилното решение за вашите нужди
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            Свържете се с нас за повече информация относно
            моделите, характеристиките и възможностите за
            доставка и монтаж.
          </p>

          <button
            type="button"
            className="mt-7 flex min-h-14 w-full items-center justify-between bg-white px-5 text-sm font-medium text-black sm:mt-8 sm:inline-flex sm:w-auto sm:rounded-full sm:px-6 sm:py-3"
          >
            Свържете се с нас

            <span className="sm:hidden">
              →
            </span>
          </button>
        </motion.section>
      </div>
    </div>
  );
}