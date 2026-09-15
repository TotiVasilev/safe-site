import { defineField, defineType } from "sanity";

export const productSubcategoryType = defineType({
  name: "productSubcategory",
  title: "Подкатегории",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Име",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "URL адрес",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "category",
      title: "Категория",
      type: "reference",
      to: [{ type: "productCategory" }],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "order",
      title: "Позиция",
      type: "number",
      description: "Определя реда на показване в категорията.",
      initialValue: 0,
    }),
  ],

  orderings: [
    {
      title: "Позиция",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: "name",
      category: "category.name",
      order: "order",
    },

    prepare({ title, category, order }) {
      return {
        title,
        subtitle: category
          ? `${category} · Позиция: ${order ?? 0}`
          : `Позиция: ${order ?? 0}`,
      };
    },
  },
});