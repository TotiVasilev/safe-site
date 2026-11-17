/**
 * Static, incremental product image optimization for Cloudflare Pages.
 * Run automatically before `next build`, or manually with `npm run optimize:images`.
 * Original CMS uploads are never edited. Technical drawings and documents
 * keep their original pixels and are served directly.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const inputDir = path.join(root, 'public', 'products', 'uploads');
const outputDir = path.join(root, 'public', 'products', 'optimized');
const manifestFile = path.join(root, 'data', 'optimized-images.json');
const widths = [320, 640, 960, 1440, 1920];
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
// Diagrams contain measurement numbers and fine lines; keep the originals.
const preserveOriginal = /(?:skica|razmeri|размер|сейф-тип-а|safe-а|модулни-панели|employment-job-application)/iu;

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const previous = fs.existsSync(manifestFile)
    ? JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
    : {};
  const manifest = {};
  const produced = new Set();
  let created = 0;
  let reused = 0;
  let originalBytes = 0;
  let optimizedBytes = 0;

  const filenames = fs.readdirSync(inputDir).sort();
  for (const filename of filenames) {
    const ext = path.extname(filename).toLowerCase();
    if (!imageExtensions.has(ext) || preserveOriginal.test(filename)) continue;
    const fullPath = path.join(inputDir, filename);
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) continue;
    const originalUrl = `/products/uploads/${filename}`;
    const content = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
    const metadata = await sharp(content, { failOn: 'error' }).metadata();
    if (!metadata.width || !metadata.height) continue;
    const possibleWidths = [...widths.filter(w => w < metadata.width), metadata.width];
    const variants = [];
    for (const width of possibleWidths) {
      const optimizedName = `${hash}-w${width}.webp`;
      const optimizedPath = path.join(outputDir, optimizedName);
      const existing = previous[originalUrl]?.variants?.find(
        entry => entry.width === width && entry.src === `/products/optimized/${optimizedName}`
      );
      if (!fs.existsSync(optimizedPath) || !existing) {
        await sharp(content, { failOn: 'error' })
          .rotate()
          .resize({ width, withoutEnlargement: true })
          // Quality 95 prioritizes fidelity; alpha remains transparent.
          .webp({ quality: 95, effort: 5, alphaQuality: 100 })
          .toFile(optimizedPath);
        created++;
      } else {
        reused++;
      }
      const fileSize = fs.statSync(optimizedPath).size;
      // Avoid a converted image larger than the original when it offers no benefit.
      if (fileSize < stat.size) {
        variants.push({ width, src: `/products/optimized/${optimizedName}` });
        produced.add(optimizedName);
      }
    }
    if (variants.length) {
      manifest[originalUrl] = { variants };
      originalBytes += stat.size;
      // Compare one representative variant at native width, not sum of all variants.
      const largestPath = path.join(root, 'public', variants[variants.length - 1].src.slice(1));
      optimizedBytes += fs.statSync(largestPath).size;
    }
  }
  // Remove obsolete copies only from our own generated asset directory.
  for (const file of fs.readdirSync(outputDir)) {
    if (/^[a-f0-9]{16}-w\d+\.webp$/.test(file) && !produced.has(file)) {
      fs.rmSync(path.join(outputDir, file));
    }
  }
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  const mb = n => (n / 1024 / 1024).toFixed(1);
  console.log(`[images] ${Object.keys(manifest).length} responsive image sources; ${created} variants created, ${reused} reused`);
  console.log(`[images] Selected full-size images: ${mb(originalBytes)} MB original → ${mb(optimizedBytes)} MB WebP`);
  console.log('[images] Original files, diagrams, attachments and CMS paths remain untouched.');
}

main().catch((error) => { console.error('[images] Optimization failed:', error); process.exitCode = 1; });
