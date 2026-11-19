# TETRAEDAR

## English

Next.js 16 / React 19 / TypeScript project with static export to Cloudflare Pages. Bulgarian is the source language for Decap CMS; English content is maintained through a GitHub Actions translation workflow.

### Local development

Requires Node.js 20.9+.

```bash
npm ci
npm run dev
npm run build
```

`npm run build` generates `out/` and runs image optimization.

### Project files

| Path | Purpose |
| --- | --- |
| `app/` | Routes and pages |
| `components/ui/` | Interface, product catalog and services components |
| `content/` | Bulgarian source content |
| `content/en/` | English translations |
| `public/admin/config.yml` | Decap CMS collections, GitHub repository and authentication configuration |
| `public/admin/visual-preview.js` | CMS preview logic |
| `.github/workflows/translate-all.yml` | Bulgarian-to-English translation workflow |
| `scripts/optimize-product-images.cjs` | Image optimization |
| `functions/api/contact.ts` | Cloudflare Pages contact form function |

### Content management

CMS: `/admin/` (current test URL: `https://tetraedar.pages.dev/admin/`).

Decap CMS saves published changes as commits to GitHub. The repository update triggers Cloudflare Pages deployment. Bulgarian content is edited in the CMS; the translation workflow updates `content/en/`.

Current configuration in `public/admin/config.yml`:

- Repository: `TotiVasilev/safe-site`
- Branch: `master`
- OAuth endpoint: `https://tetraedar-cms-auth.todorvasilev0144.workers.dev`
- Media uploads: `public/products/uploads/`

The GitHub OAuth Worker is a separate Cloudflare resource, not included in this repository. If the repository ownership or domain changes, review `public/admin/config.yml`, the OAuth Worker, GitHub OAuth app callback settings and Cloudflare Git integration.

### Deployment and domain

Cloudflare Pages build command: `npm run build`; output: `out/`. The expected production branch is `master`; confirm in the Pages dashboard.

Add the final domain in Cloudflare Pages > Custom domains. The domain administrator handles the required DNS changes. Preserve existing email DNS records. Connecting the domain does not require access to the source repository.

### Contact form

`functions/api/contact.ts` uses Resend. Cloudflare Pages environment variables:

- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO`
- `CONTACT_EMAIL_FROM`

The local `.dev.vars` file is not included. Check sender-domain verification in Resend.

### Handover checks

- GitHub repository and Cloudflare Pages access
- CMS OAuth Worker and GitHub OAuth app access
- Repository, OAuth callback and CMS configuration after any ownership/domain change
- GitHub-to-Cloudflare deployment from `master`
- CMS login, content editing and publishing on the final domain
- BG-to-EN translation workflow
- Contact form and Resend variables
- Domain, HTTPS and existing email DNS records

### Additional paths

- Product URLs depend on content filenames/slugs.
- CMS uploads: `public/products/uploads/`; optimized images: `public/products/optimized/`.
- Services 3D model: `public/models/safe_model.glb`; related components: `components/ui/services/`.
- Cloudflare account settings, DNS, OAuth Worker source and credentials are managed outside this repository.

## Български

Проект на Next.js 16 / React 19 / TypeScript със static export към Cloudflare Pages. Българското съдържание е основното за Decap CMS, а английската версия се поддържа чрез translation workflow в GitHub Actions.

### Локална среда

Необходим е Node.js 20.9+.

```bash
npm ci
npm run dev
npm run build
```

`npm run build` генерира `out/` и изпълнява image optimization.

### Основни файлове

| Път | Предназначение |
| --- | --- |
| `app/` | Routes и страници |
| `components/ui/` | UI компоненти, продуктов каталог и услуги |
| `content/` | Основно съдържание на български |
| `content/en/` | Английски преводи |
| `public/admin/config.yml` | Decap CMS collections, GitHub repository и authentication настройки |
| `public/admin/visual-preview.js` | CMS preview логика |
| `.github/workflows/translate-all.yml` | Translation workflow от български към английски |
| `scripts/optimize-product-images.cjs` | Image optimization |
| `functions/api/contact.ts` | Contact form функция за Cloudflare Pages |

### Управление на съдържанието

CMS: `/admin/` (текущ тестов адрес: `https://tetraedar.pages.dev/admin/`).

При публикуване Decap CMS записва промените като commits в GitHub. Това задейства нов deployment в Cloudflare Pages. Българското съдържание се редактира през CMS, а translation workflow обновява `content/en/`.

Текущи настройки в `public/admin/config.yml`:

- Repository: `TotiVasilev/safe-site`
- Branch: `master`
- OAuth endpoint: `https://tetraedar-cms-auth.todorvasilev0144.workers.dev`
- Media uploads: `public/products/uploads/`

GitHub OAuth Worker е отделен ресурс в Cloudflare и не е включен в repository. При промяна на собствеността на repository или домейна трябва да се проверят `public/admin/config.yml`, OAuth Worker, callback настройките на GitHub OAuth app и Cloudflare Git integration.

### Deployment и домейн

Cloudflare Pages build command: `npm run build`; output: `out/`. Очакваният production branch е `master`; настройките се проверяват в Pages dashboard.

Крайният домейн се добавя в Cloudflare Pages > Custom domains. Необходимите DNS промени се правят от администратора на домейна, като се запазват съществуващите email DNS записи. За самото насочване на домейна не е необходим достъп до source repository.

### Контактна форма

`functions/api/contact.ts` използва Resend. Environment variables в Cloudflare Pages:

- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO`
- `CONTACT_EMAIL_FROM`

Локалният `.dev.vars` не е включен. Трябва да се провери sender-domain verification в Resend.

### Проверки при предаване

- Достъп до GitHub repository и Cloudflare Pages
- Достъп до CMS OAuth Worker и GitHub OAuth app
- Repository, OAuth callback и CMS настройки при смяна на собственост или домейн
- GitHub-to-Cloudflare deployment от `master`
- CMS login, редактиране и публикуване през крайния домейн
- BG-to-EN translation workflow
- Contact form и Resend variables
- Домейн, HTTPS и съществуващи email DNS записи

### Допълнителни пътища

- Product URLs зависят от имената на content файловете и slugs.
- CMS uploads: `public/products/uploads/`; optimized images: `public/products/optimized/`.
- 3D модел за услугите: `public/models/safe_model.glb`; компоненти: `components/ui/services/`.
- Cloudflare account settings, DNS, OAuth Worker source и credentials се управляват извън repository.
