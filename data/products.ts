export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  // Сейфове — Свободностоящи
  {
    id: "safe-001",
    name: "Модел 1",
    slug: "model-1",
    category: "Сейфове",
    subcategory: "Свободностоящи",
    description: "Описание на продукта.",
    image: "/products/safe-001.jpg",
  },
  {
    id: "safe-002",
    name: "Модел 2",
    slug: "model-2",
    category: "Сейфове",
    subcategory: "Свободностоящи",
    description: "Описание на продукта.",
    image: "/products/safe-002.jpg",
  },
  {
    id: "safe-003",
    name: "Модел 3",
    slug: "model-3",
    category: "Сейфове",
    subcategory: "Свободностоящи",
    description: "Описание на продукта.",
    image: "/products/safe-003.jpg",
  },
  {
    id: "safe-004",
    name: "Модел 4",
    slug: "model-4",
    category: "Сейфове",
    subcategory: "Свободностоящи",
    description: "Описание на продукта.",
    image: "/products/safe-004.jpg",
  },
  {
    id: "safe-005",
    name: "Модел 5",
    slug: "model-5",
    category: "Сейфове",
    subcategory: "Свободностоящи",
    description: "Описание на продукта.",
    image: "/products/safe-005.jpg",
  },

  // Сейфове — Домашни
  {
    id: "safe-006",
    name: "Модел 6",
    slug: "model-6",
    category: "Сейфове",
    subcategory: "Домашни",
    description: "Описание на продукта.",
    image: "/products/safe-006.jpg",
  },

  // Сейфове — Еднокрили трезорни
  {
    id: "safe-007",
    name: "Модел 7",
    slug: "model-7",
    category: "Сейфове",
    subcategory: "Еднокрили трезорни",
    description: "Описание на продукта.",
    image: "/products/safe-007.jpg",
  },
  {
    id: "safe-008",
    name: "Модел 8",
    slug: "model-8",
    category: "Сейфове",
    subcategory: "Еднокрили трезорни",
    description: "Описание на продукта.",
    image: "/products/safe-008.jpg",
  },

  // Сейфове — Двукрилни трезорни
  {
    id: "safe-009",
    name: "Модел 9",
    slug: "model-9",
    category: "Сейфове",
    subcategory: "Двукрилни трезорни",
    description: "Описание на продукта.",
    image: "/products/safe-009.jpg",
  },
  {
    id: "safe-010",
    name: "Модел 10",
    slug: "model-10",
    category: "Сейфове",
    subcategory: "Двукрилни трезорни",
    description: "Описание на продукта.",
    image: "/products/safe-010.jpg",
  },

  // Сейфове — Стенни
  {
    id: "safe-011",
    name: "Модел 11",
    slug: "model-11",
    category: "Сейфове",
    subcategory: "Стенни",
    description: "Описание на продукта.",
    image: "/products/safe-011.jpg",
  },
  {
    id: "safe-012",
    name: "Модел 12",
    slug: "model-12",
    category: "Сейфове",
    subcategory: "Стенни",
    description: "Описание на продукта.",
    image: "/products/safe-012.jpg",
  },

  // Други продукти
  {
    id: "door-001",
    name: "Трезорна врата",
    slug: "trezorna-vrata",
    category: "Трезорни врати",
    description: "Описание на продукта.",
    image: "/products/door-001.jpg",
  },
  {
    id: "panel-001",
    name: "Трезорен панел",
    slug: "trezoren-panel",
    category: "Трезорни панели",
    description: "Описание на продукта.",
    image: "/products/panel-001.jpg",
  },
  {
    id: "vault-001",
    name: "Трезор",
    slug: "trezor",
    category: "Трезори",
    description: "Описание на продукта.",
    image: "/products/vault-001.jpg",
  },
  {
    id: "deposit-box-001",
    name: "Депозитна касета",
    slug: "depozitna-kaseta",
    category: "Депозитни касети",
    description: "Описание на продукта.",
    image: "/products/deposit-box-001.jpg",
  },
  {
    id: "deposit-station-001",
    name: "Депозитна станция",
    slug: "depozitna-stantsiya",
    category: "Депозитни станции",
    description: "Описание на продукта.",
    image: "/products/deposit-station-001.jpg",
  },
  {
    id: "gun-cabinet-001",
    name: "Шкаф за оръжие",
    slug: "shkaf-za-orazhie",
    category: "Шкафове за оръжие",
    description: "Описание на продукта.",
    image: "/products/gun-cabinet-001.jpg",
  },
  {
    id: "lock-001",
    name: "Брава",
    slug: "brava",
    category: "Брави",
    description: "Описание на продукта.",
    image: "/products/lock-001.jpg",
  },
];