import { defineField, defineType } from "sanity";

export const productCategoryType = defineType({
  name: "productCategory",
  title: "Категории",
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
      name: "order",
      title: "Позиция",
      type: "number",
      description: "Определя реда на показване в каталога.",
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
      order: "order",
    },

    prepare({ title, order }) {
      return {
        title,
        subtitle: `Позиция: ${order ?? 0}`,
      };
    },
  },
});