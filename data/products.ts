export type ProductModel = {
  name: string;
  dimensions?: string;
  internalDimensions?: string;
  weight?: string;
  volume?: string;
  resistance?: string;
};

export type ProductFamily = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  models: ProductModel[];
};

export type ProductSubcategory = {
  id: string;
  name: string;
  slug: string;
  products: ProductFamily[];
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  subcategories?: ProductSubcategory[];
  products?: ProductFamily[];
};

export const productCategories: ProductCategory[] = [
  {
    id: "safes",
    name: "Сейфове",
    slug: "seyfove",

    subcategories: [
      {
        id: "freestanding",
        name: "Свободностоящи",
        slug: "svobodnostoyashti",

        products: [
          {
            id: "type-a",
            name: "Сейф Тип A",
            slug: "seyf-tip-a",
            description:
              "Висок клас сейф с IV степен на съпротивление по EN 1143-1.",
            image: "/products/safes/type-a.jpg",
            models: [
              { name: "A-801" },
              { name: "A-802" },
              { name: "A-803" },
              { name: "A-804" },
              { name: "A-805" },
              { name: "A-806" },
              { name: "A-807" },
            ],
          },

          {
            id: "type-b",
            name: "Сейф Тип B",
            slug: "seyf-tip-b",
            description:
              "Висок клас сейф с V степен на съпротивление по EN 1143-1.",
            image: "/products/safes/type-b.jpg",
            models: [
              { name: "B-801" },
              { name: "B-802" },
              { name: "B-803" },
              { name: "B-804" },
              { name: "B-805" },
              { name: "B-806" },
              { name: "B-807" },
              { name: "B-808" },
              { name: "B-809" },
              { name: "B-810" },
              { name: "B-811" },
              { name: "B-812" },
              { name: "B-813" },
              { name: "B-814" },
            ],
          },

          {
            id: "type-c",
            name: "Сейф Тип C",
            slug: "seyf-tip-c",
            description:
              "Висок клас сейф с модели, сертифицирани до VI степен по EN 1143-1.",
            image: "/products/safes/type-c.jpg",
            models: [
              { name: "C-801" },
              { name: "C-802" },
              { name: "C-803" },
              { name: "C-804" },
              { name: "C-805*" },
              { name: "C-806*" },
              { name: "C-807*" },
              { name: "C-808*" },
              { name: "C-809" },
              { name: "C-810" },
              { name: "C-811" },
              { name: "C-812" },
              { name: "C-813" },
              { name: "C-814" },
            ],
          },

          {
            id: "type-wv",
            name: "Сейф Тип WV",
            slug: "seyf-tip-wv",
            description:
              "Комбинация от два вертикални сейфа с V степен на съпротивление.",
            image: "/products/safes/type-wv.jpg",
            models: [
              { name: "WV1200" },
              { name: "WV1400" },
              { name: "WV1600" },
            ],
          },

          {
            id: "type-wh",
            name: "Сейф Тип WH",
            slug: "seyf-tip-wh",
            description:
              "Комбинация от два хоризонтални сейфа с V степен на съпротивление.",
            image: "/products/safes/type-wh.jpg",
            models: [
              { name: "WH1200" },
              { name: "WH1400" },
              { name: "WH1600" },
            ],
          },
        ],
      },

      {
        id: "home",
        name: "Домашен сейф",
        slug: "domashen-seyf",

        products: [
          {
            id: "home-safe",
            name: "Домашен сейф",
            slug: "domashen-seyf",
            description:
              "Компактно решение за съхранение на лични ценности и документи.",
            image: "/products/safes/home.jpg",
            models: [],
          },
        ],
      },

      {
        id: "deposit",
        name: "Депозитни сейфове",
        slug: "depozitni-seyfove",

        products: [
          {
            id: "deposit-swinger",
            name: "Депозит Сейф Тип Люлка",
            slug: "depozit-seyf-lyulka",
            description:
              "Решение за депозиране на пари и документи извън работното време.",
            image: "/products/bank/deposit-swinger.jpg",
            models: [],
          },
          {
            id: "deposit-swinger-internal",
            name: "Депозит Сейф Тип Люлка Вътрешен",
            slug: "depozit-seyf-lyulka-vutreshen",
            description:
              "Вътрешен вариант за депозиране на пари и документи.",
            image: "/products/bank/deposit-swinger-internal.jpg",
            models: [],
          },
          {
            id: "deposit-drawer",
            name: "Депозит Сейф Тип Чекмедже",
            slug: "depozit-seyf-chekmedzhe",
            description:
              "Депозитно решение с конструкция тип чекмедже.",
            image: "/products/bank/deposit-drawer.jpg",
            models: [],
          },
          {
            id: "deposit-drawer-internal",
            name: "Депозит Сейф Тип Чекмедже Вътрешен",
            slug: "depozit-seyf-chekmedzhe-vutreshen",
            description:
              "Вътрешен вариант на депозитен сейф тип чекмедже.",
            image: "/products/bank/deposit-drawer-internal.jpg",
            models: [],
          },
        ],
      },

      {
        id: "single-door",
        name: "Еднокрили трезорни сейфове",
        slug: "ednokrilni-trezorni-seyfove",

        products: [
          {
            id: "single-door-ed",
            name: "Тип ED",
            slug: "tip-ed",
            description:
              "Еднокрил сейф категория V за малки банкови офиси.",
            image: "/products/bank/single-door.jpg",
            models: [
              { name: "ED1" },
              { name: "ED2" },
            ],
          },
          {
            id: "single-door-et",
            name: "Тип ET",
            slug: "tip-et",
            description:
              "Еднокрил сейф категория V с усилени метални полици.",
            image: "/products/bank/single-door-et.jpg",
            models: [
              { name: "ET" },
            ],
          },
        ],
      },

      {
        id: "double-door",
        name: "Двукрилни трезорни сейфове",
        slug: "dvukrilni-trezorni-seyfove",

        products: [
          {
            id: "double-door-dd",
            name: "Тип DD",
            slug: "tip-dd",
            description:
              "Двукрил сейф категория V с модулни депозитни сейфове.",
            image: "/products/bank/double-door.jpg",
            models: [
              { name: "DD" },
            ],
          },
          {
            id: "double-door-dt",
            name: "Тип DT",
            slug: "tip-dt",
            description:
              "Двукрил сейф категория V с усилени метални полици.",
            image: "/products/bank/double-door-dt.jpg",
            models: [
              { name: "DT" },
            ],
          },
        ],
      },

      {
        id: "wall",
        name: "Стенни",
        slug: "stenni",

        products: [
          {
            id: "ctm",
            name: "Стенен Сейф Тип CTM",
            slug: "ctm",
            description:
              "Стенен сейф с II категория на съпротивление и механична брава клас A.",
            image: "/products/safes/ctm.jpg",
            models: [
              { name: "CTM-1" },
              { name: "CTM-2" },
              { name: "CTM-3" },
              { name: "CTM-4" },
              { name: "CTM-5" },
              { name: "CTM-6" },
            ],
          },

          {
            id: "ctmk",
            name: "Стенен Сейф Тип CTMK",
            slug: "ctmk",
            description:
              "Стенен сейф с II категория и електронна или механична кодова брава клас A.",
            image: "/products/safes/ctmk.jpg",
            models: [
              { name: "CTMK-1" },
              { name: "CTMK-2" },
              { name: "CTMK-3" },
              { name: "CTMK-4" },
              { name: "CTMK-5" },
              { name: "CTMK-6" },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "vault-solutions",
    name: "Трезорни решения",
    slug: "trezorni-resheniya",

    products: [
      {
        id: "vault-doors",
        name: "Трезорни врати",
        slug: "trezorni-vrati",
        description:
          "Многослойни трезорни врати за банкови трезори и защитени помещения.",
        image: "/products/vault/doors.jpg",
        models: [
          { name: "310" },
          { name: "320" },
        ],
      },

      {
        id: "vault-panels",
        name: "Трезорни панели",
        slug: "trezorni-paneli",
        description:
          "Многослойни панели за изграждане и повишаване на защитата на трезорни помещения.",
        image: "/products/vault/panels.jpg",
        models: [
          { name: "Тип T" },
          { name: "Тип E" },
          { name: "Тип Sx" },
        ],
      },

      {
        id: "vaults",
        name: "Трезори",
        slug: "trezori",
        description:
          "Модулни трезорни помещения, изградени със сертифицирани компоненти.",
        image: "/products/vault/vaults.jpg",
        models: [],
      },
    ],
  },

  {
    id: "bank-products",
    name: "Банкови продукти",
    slug: "bankovi-produkti",

    products: [
      {
        id: "keyholder",
        name: "Сейфове за ключове",
        slug: "seyfove-za-klyuchove",
        description:
          "Специално пригодени сейфове за съхранение на ключове.",
        image: "/products/bank/keyholder.jpg",
        models: [
          { name: "K-280" },
          { name: "K-420" },
        ],
      },

      {
        id: "block-safes",
        name: "Блок сейфове",
        slug: "blok-seyfove",
        description:
          "Лични сейфове за съхранение на ценности в охраняеми банкови трезори.",
        image: "/products/bank/block-safes.jpg",
        models: [],
      },

      {
        id: "deposit-station",
        name: "Приемна станция",
        slug: "priemna-stantsiya",
        description:
          "Решение за депозиране на пари и документи извън работното време на банката.",
        image: "/products/bank/deposit-station.jpg",
        models: [
          { name: "PL-1" },
          { name: "PL-2" },
        ],
      },
    ],
  },

  {
    id: "gun-cabinets",
    name: "Шкафове за оръжие",
    slug: "shkafove-za-orazhie",

    products: [
      {
        id: "gun-cabinets",
        name: "Оръжейни шкафове",
        slug: "orazheyni-shkafove",
        description:
          "Шкафове за съхранение на оръжие и боеприпаси.",
        image: "/products/gun-cabinets/gun-cabinets.jpg",
        models: [
          { name: "5P" },
          { name: "5PK" },
          { name: "F10HS" },
        ],
      },
    ],
  },

  {
    id: "locks",
    name: "Брави",
    slug: "bravi",

    products: [
      {
        id: "locks",
        name: "Брави и заключващи механизми",
        slug: "bravi-i-zaklyuchvashti-mehanizmi",
        description:
          "Механични ключови, механични кодови и електронни брави и механизми за сейфове.",
        image: "/products/locks/locks.jpg",
        models: [],
      },
    ],
  },
];