const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const matter = require("gray-matter");

const root = process.cwd();

const sourcePath = path.join(root, "data", "products.ts");
const outputDirectory = path.join(root, "content", "products");

if (!fs.existsSync(sourcePath)) {
  console.error("Cannot find data/products.ts");
  process.exit(1);
}

const source = fs.readFileSync(sourcePath, "utf8");

const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});

const moduleObject = { exports: {} };

try {
  const loadModule = new Function(
    "module",
    "exports",
    "require",
    compiled.outputText
  );

  loadModule(
    moduleObject,
    moduleObject.exports,
    require
  );
} catch (error) {
  console.error("Could not read the product data:", error);
  process.exit(1);
}

const categories = moduleObject.exports.productCategories;

if (!Array.isArray(categories)) {
  console.error("productCategories was not found.");
  process.exit(1);
}

const products = [];

for (const category of categories) {
  products.push(...(category.products ?? []));

  for (const subcategory of category.subcategories ?? []) {
    products.push(...(subcategory.products ?? []));
  }
}

fs.mkdirSync(outputDirectory, { recursive: true });

let created = 0;
let skipped = 0;

for (const product of products) {
  if (!/^[a-z0-9-]+$/.test(product.slug)) {
    console.error("Invalid product slug:", product.slug);
    process.exit(1);
  }

  const filename = `${product.slug}.md`;
  const destination = path.join(outputDirectory, filename);

  if (fs.existsSync(destination)) {
    console.log(`SKIPPED: ${filename} (already exists)`);
    skipped++;
    continue;
  }

  const data = {
    title: product.name,
    slug: product.slug,
    description: product.description ?? "",
    image: product.image ?? "",
    models: (product.models ?? []).map((model) => ({
      name: model.name,
      ...(model.dimensions && {
        dimensions: model.dimensions,
      }),
      ...(model.internalDimensions && {
        internalDimensions: model.internalDimensions,
      }),
      ...(model.weight && {
        weight: model.weight,
      }),
      ...(model.volume && {
        volume: model.volume,
      }),
      ...(model.resistance && {
        resistance: model.resistance,
      }),
    })),
  };

  const markdown = matter.stringify("", data);

  fs.writeFileSync(destination, markdown, {
    encoding: "utf8",
    flag: "wx",
  });

  console.log(`CREATED: ${filename}`);
  created++;
}

console.log("");
console.log("================================");
console.log(`Total products: ${products.length}`);
console.log(`Files created: ${created}`);
console.log(`Existing files preserved: ${skipped}`);
console.log("================================");
console.log("Your product content is ready for Decap CMS.");
