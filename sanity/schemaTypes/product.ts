import { defineArrayMember, defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Продукти",
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
      name: "description",
      title: "Описание",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "image",
      title: "Основна снимка",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "category",
      title: "Категория",
      type: "reference",
      to: [{ type: "productCategory" }],
    }),

    defineField({
      name: "subcategory",
      title: "Подкатегория",
      type: "reference",
      to: [{ type: "productSubcategory" }],
    }),

    defineField({
      name: "models",
      title: "Модели",
      type: "array",

      of: [
        defineArrayMember({
          type: "object",
          name: "productModel",
          title: "Модел",

          fields: [
            defineField({
              name: "name",
              title: "Име на модела",
              type: "string",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "dimensions",
              title: "Външни размери",
              type: "string",
            }),

            defineField({
              name: "internalDimensions",
              title: "Вътрешни размери",
              type: "string",
            }),

            defineField({
              name: "weight",
              title: "Тегло",
              type: "string",
            }),

            defineField({
              name: "volume",
              title: "Обем",
              type: "string",
            }),

            defineField({
              name: "resistance",
              title: "Клас на съпротивление",
              type: "string",
            }),
          ],

          preview: {
            select: {
              title: "name",
              dimensions: "dimensions",
            },

            prepare({ title, dimensions }) {
              return {
                title,
                subtitle: dimensions || "Без въведени размери",
              };
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "image",
    },
  },
});