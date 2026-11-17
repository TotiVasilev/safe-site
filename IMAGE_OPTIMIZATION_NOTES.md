# TETRAEDAR – product image optimization

This patch is meant to be extracted **on top of project folder (7) plus the previous CMS-description/homepage-catalog update**. It only changes image loading and adds generated image files.

## Install and test

1. Copy all files from the patch ZIP into your project, keeping their folder paths.
2. In the project directory, run `npm install` (or `npm ci`, if you use a lockfile-only workflow). `sharp` is now a direct dependency of the build script.
3. Run `npm run build`. The `prebuild` script automatically runs `npm run optimize:images` before Next.js builds.
4. Continue testing via `npm run dev` as before. To test Cloudflare Functions, use the same Pages/Wrangler process as before.
5. Commit the generated files in `public/products/optimized/`, `data/optimized-images.json`, and the script along with the code changes. Cloudflare will also regenerate variants during future builds after CMS uploads.

## How it works

- The originals in `public/products/uploads/` are **never edited or deleted**.
- Product photographs have 320/640/960/1440/1920-pixel width variants, no upscaling, with WebP quality 95 and preserved alpha transparency.
- Source widths and file bytes decide whether a variant is worth serving. If the optimized file would be larger than the original, that variant is excluded.
- The browser chooses an appropriate file using `srcset` and `sizes`, including retina devices.
- Product gallery slides and catalog hover galleries load only the visible full-size photo, plus an on-demand adjacent preload. Gallery thumbnails use smaller versions and lazy loading.
- Exact technical diagrams (`skica`, `razmeri`, Bulgarian dimension names) and the three large illustration/certificate attachments stay on their original files. Product attachment modal previews also use originals.
- If a CMS image is added locally without regenerating variants, the site falls back to the original until `npm run optimize:images` or `npm run build` is run.
- This stays compatible with `output: "export"` and `images.unoptimized: true`; there is no new image server or Cloudflare Images subscription.

## Verify loading

Open Chrome/Firefox DevTools → Network → Img, enable Disable cache, reload a product page and compare transferred file sizes. Product cards should request WebP images from `/products/optimized/`; only the active image should be fetched in full-size, rather than every hidden gallery image. Technical drawings still use their PNG originals.
