"use client";

import Link from "next/link";
import { motion } from "motion/react";

type ProductCategory = {
  id: string;
  name: string;
  slug: string;

  subcategories?: {
    id: string;
    name: string;
  }[];

  products?: {
    id: string;
    name: string;
  }[];
};

type ProductGridProps = {
  categories: ProductCategory[];
};

export default function ProductGrid({
  categories,
}: ProductGridProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.1,
      }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className="mt-16 grid gap-6 md:grid-cols-2"
    >
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          variants={{
            hidden: {
              opacity: 0,
              y: 45,
              scale: 0.96,
            },

            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        >
          <Link
            href={`/produkti#category-${category.slug}`}
            className="group block h-full rounded-2xl border border-black/10 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs text-black/30">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-4 text-2xl font-medium tracking-tight">
                  {category.name}
                </h3>
              </div>

              <span className="text-2xl text-black/40 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>

            {category.subcategories && (
              <div className="mt-8 flex flex-wrap gap-2">
                {category.subcategories.map((subcategory) => (
                  <span
                    key={subcategory.id}
                    className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-black/55"
                  >
                    {subcategory.name}
                  </span>
                ))}
              </div>
            )}

            {category.products && (
              <p className="mt-8 text-sm text-black/45">
                {category.products.length} продуктови групи
              </p>
            )}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}