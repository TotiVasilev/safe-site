# Tetraedar website

Corporate website and product catalog for **Tetraedar**, with Bulgarian and English pages, a Git-backed content management interface, and an interactive 3D services section.

## Technology

- **Next.js 16** (App Router), **React 19**, **TypeScript** and **Tailwind CSS 4**
- **Three.js**, React Three Fiber and Drei for the services safe model
- **Motion** for interface transitions
- **Decap CMS** for editing content stored in GitHub
- **Cloudflare Pages** for hosting the statically exported site
- **Cloudflare Worker** for GitHub OAuth authentication used by the CMS
- **GitHub Actions** and Argos Translate for Bulgarian-to-English content generation

The site is configured as a static export (`output: "export"` in `next.config.ts`). It does not require a running Next.js server in production.

## Local development

Prerequisites: Node.js compatible with Next.js 16 (Node.js **20.9+**), npm and access to this repository.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The CMS admin interface is available at `/admin/`, but GitHub authentication and publishing depend on the external OAuth Worker and configured GitHub access.

Useful commands:

```bash
npm run dev      # Local development
npm run build    # Generate the static site in out/
npm run lint     # Run ESLint
npm run start    # Next.js production server (not used for static hosting)
```

For this project, **`npm run build`** is the production build command. The generated `out/` directory is the deployable artifact. The `start` command is included in the package scripts but is not the deployment method for a static export.

## Repository structure

| Path | Purpose |
| --- | --- |
| `app/` | App Router pages, localized routes, global styles and metadata |
| `components/ui/` | Navigation, product catalog, galleries and reusable UI |
| `components/ui/services/` | 3D safe scene and six-step services presentation |
| `data/` | Content readers, product types and fallback product data |
| `content/` | Bulgarian CMS-managed JSON and Markdown |
| `content/en/` | English content, translation cache and manual overrides |
| `public/` | Images, product drawings, model assets and Decap CMS UI |
| `public/admin/config.yml` | CMS collections and GitHub backend configuration |
| `scripts/` | Content migration and translation utilities |
| `.github/workflows/` | Translation automation |

### Content and localization

Bulgarian is the source language. The CMS edits JSON and Markdown files under `content/`; product categories, subcategories and products are represented as Markdown files with front matter. Server-side content readers in `data/` load these files during the static build.

English pages live under `/en/`. Translation scripts generate English counterparts in `content/en/` and use a cache and explicit overrides to avoid unnecessary retranslations and to correct terminology. **Review technical product specifications, security terminology and legal text before publishing translated content.**

The main translation workflow is `.github/workflows/translate-all.yml`. It runs on relevant content changes to `master`/`main` and can also be started manually. The older homepage-only workflow is manual. These workflows commit generated English content back to the repository, so their GitHub Actions permissions must remain enabled.

## Content management

Decap CMS is served from `public/admin/index.html`, configured by `public/admin/config.yml`, and uses the GitHub backend.

Current configuration in this archive:

- Repository: `TotiVasilev/safe-site`
- Branch: `master`
- Authentication endpoint: `https://tetraedar-cms-auth.todorvasilev0144.workers.dev`
- CMS site domain: `tetraedar.pages.dev`
- Uploaded media: `public/products/uploads/`

**These values describe the current setup, not permanent company-owned identifiers.** When the GitHub repository or public domain changes, review `public/admin/config.yml`, the Worker configuration, the GitHub OAuth application, and any allowed origins or callback URLs.

The **Worker source code, OAuth client secret and Cloudflare account configuration are not included in this archive**. They must be reviewed separately in Cloudflare and the associated GitHub OAuth application. Do not commit OAuth secrets or Cloudflare API tokens to the repository.

## Deployment

The current site is hosted on Cloudflare Pages. For a Git-connected Pages project, changes pushed to the configured production branch trigger a build and deployment.

Expected static-site build settings:

| Setting | Value |
| --- | --- |
| Framework | Next.js (static export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Production branch | `master` (per CMS configuration; verify in Cloudflare) |

Cloudflare dashboard settings are not stored in this repository; confirm the actual build configuration in the Pages project before changing it. The public domain is managed in the Pages project's **Custom domains** settings. Preserve existing email-related DNS records during any nameserver or DNS migration.

## Handover checklist

1. Give the client appropriate access to the **GitHub repository** and **Cloudflare account**.
2. Confirm access to the **Pages project** and the separate **CMS authentication Worker**.
3. Identify the owner of the **GitHub OAuth application** and confirm access to its credentials and callback settings.
4. Record the **official domain**, DNS administrator and required email DNS records.
5. If repository ownership changes, update the CMS `repo` value, check OAuth permissions and verify/reconfigure the Pages Git integration. A GitHub repository transfer can interrupt the existing Cloudflare Pages connection.
6. Verify a test deployment and a CMS login, edit and publish cycle before removing the original developer's access.
7. Review English translations and confirm both `/` and `/en/` routes on the final domain.

## Maintenance notes

- Product URLs depend on content filenames/slugs; changing a slug can break existing links.
- Product media is referenced by paths in the CMS files; retain those files when moving content.
- The 3D services page loads `/models/safe_model.glb`. Keep the model's object names and pivots compatible with `SafeScene.tsx` when replacing the asset.
- Static builds must run after CMS content changes to publish updates.
- Avoid editing generated English content directly unless intentionally applying a correction; use translation overrides for durable changes.

## Scope of this archive

This repository contains the website application and CMS configuration. It does **not** include the deployed Cloudflare Worker source, private Cloudflare settings, DNS zone, GitHub OAuth secrets, or a copy of the live GitHub/Cloudflare account permissions. Those are separate handover items.
