# TETRAEDAR website

Source code and content for the TETRAEDAR website, including the Bulgarian and English pages, product catalog, services section and content editor.

## Project setup

The site uses Next.js 16, React 19, TypeScript and Tailwind CSS 4. The services section uses Three.js and React Three Fiber. Content is managed with Decap CMS and stored in GitHub. Cloudflare Pages hosts the site, with a separate Cloudflare Worker handling GitHub login for the editor.

The site is built as a static export. It does not need a running Next.js server in production.

To run it locally, install Node.js 20.9 or later and npm, then run:

```bash
npm ci
npm run dev
```

The development site opens at `http://localhost:3000`.

To build the deployable site:

```bash
npm run build
```

The build output is in `out/`. The build also runs the image optimization script. `npm run lint` checks the source code. `npm run start` is not used for this static deployment.

## Main directories

| Path | Contents |
| --- | --- |
| `app/` | Pages, routes, styles and metadata |
| `components/ui/` | Site components, navigation, catalog and galleries |
| `components/ui/services/` | 3D model and services presentation |
| `data/` | Content loading, product data and types |
| `content/` | Bulgarian content managed through the CMS |
| `content/en/` | English content and translation support files |
| `public/` | Images, 3D assets and CMS admin files |
| `public/admin/config.yml` | CMS settings and editable collections |
| `scripts/` | Translation and image processing scripts |
| `.github/workflows/` | GitHub Actions for translations |
| `functions/api/contact.ts` | Contact form email handler |

## Editing website content

The content editor is available at `/admin/`. On the current test site, the address is `https://tetraedar.pages.dev/admin/`. Once the official domain is connected, editors should use the same path on that domain.

Editors sign in with a GitHub account that has access to the repository. The CMS writes changes directly to GitHub; it does not have a separate content database.

To update content:

1. Sign in at `/admin/`.
2. Open the relevant section, such as the homepage, services, product categories or products.
3. Edit the text, images or product information. Use the built-in preview where available.
4. Save or publish the changes. The CMS commits the updated files to GitHub.
5. Wait for the Cloudflare Pages build to finish, then check the public site.

The CMS preview is not the published site. If an edit does not appear online, check the latest GitHub commit and the Cloudflare deployment log.

Bulgarian is the source language. Content is stored in `content/`, mainly as JSON and Markdown files. The English version is under `content/en/`. GitHub Actions translates relevant Bulgarian changes and commits the resulting English content. The main workflow is `.github/workflows/translate-all.yml`; it also supports manual runs. Technical descriptions and product specifications should be checked after translation.

Images uploaded through the editor are stored in `public/products/uploads/`. During a build, `scripts/optimize-product-images.cjs` creates optimized images in `public/products/optimized/` and updates `data/optimized-images.json`. Keep the original uploads as well as the generated assets.

The CMS interface is defined in `public/admin/index.html`, `public/admin/config.yml` and the scripts in `public/admin/`. The custom previews use `public/admin/visual-preview.js`. Changes to these files can affect the editing interface even if the public pages still work.

## CMS login and GitHub configuration

The supplied configuration currently uses:

| Setting | Current value |
| --- | --- |
| GitHub repository | `TotiVasilev/safe-site` |
| Content branch | `master` |
| CMS authentication Worker | `https://tetraedar-cms-auth.todorvasilev0144.workers.dev` |
| Test site | `tetraedar.pages.dev` |
| Media uploads | `public/products/uploads/` |

These values will need reviewing if the repository or domain is moved to company-controlled accounts.

The CMS login depends on a separate Cloudflare Worker and a GitHub OAuth application. The Worker source, its settings and the OAuth secret are not included in this repository. Whoever takes over maintenance will need the appropriate access to both services. After changing the domain or repository, check the CMS configuration, GitHub OAuth callback, Worker settings and permitted origins. Test login and publishing from the final domain before removing the original administrator's access.

## Deployment and domain

The current hosting arrangement is Cloudflare Pages connected to GitHub. Changes to the production branch trigger a new deployment. The expected build settings are:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `out` |
| Production branch | `master` |

Confirm these settings in Cloudflare, since the dashboard configuration is not part of the repository.

The official domain is configured under Custom domains in Cloudflare Pages. The domain administrator should apply the DNS records requested by Cloudflare. The exact records depend on whether the site uses the root domain or a `www` hostname and where DNS is hosted. Existing mail records and other DNS services must be preserved.

Once the domain is connected, check HTTPS, the homepage, product and services pages, `/en/`, `/admin/` and the contact form. Also check any redirect between the root and `www` hostnames.

Pointing a domain to Cloudflare does not require GitHub repository access. Repository and Cloudflare access are separate matters for ongoing maintenance and ownership transfer.

## Contact form

The contact form is handled by `functions/api/contact.ts`, a Cloudflare Pages Function using Resend. The Pages environment needs these variables:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API credential |
| `CONTACT_EMAIL_TO` | Recipient address |
| `CONTACT_EMAIL_FROM` | Approved sender address |

The local `.dev.vars` file is not included in this handover because it contains a private credential. Set the variables securely in Cloudflare Pages and verify the sending domain in Resend. Send a test message after the handover or any domain change.

## Handover checks

1. Confirm who owns and administers the GitHub repository, Cloudflare Pages project and domain DNS.
2. Arrange access to the CMS authentication Worker and its GitHub OAuth application.
3. Confirm the production branch, GitHub integration and build settings in Cloudflare.
4. If the repository is transferred, update the CMS repository setting and reconnect any integrations that require it.
5. Connect the official domain without disrupting existing email DNS records.
6. Test CMS login on the official domain with the intended editor's GitHub account.
7. Make a small CMS edit, publish it, verify the live page and restore the original content.
8. Confirm that a Bulgarian content change triggers the translation workflow and that the English version is deployed.
9. Test the contact form and confirm the recipient receives the message.
10. Check the main pages on desktop and mobile in both languages.
11. Confirm access to Resend and any other external services needed for maintenance.
12. Record account owners, project names and recovery contacts privately. Do not put passwords, API keys or recovery codes in Git.
13. Remove the previous administrator's access only after the site, CMS and integrations have been tested.

## Maintenance notes

- Product URLs depend on content filenames and slugs. Renaming them may break existing links.
- Product images are referenced by paths in the content files. Keep those assets when moving or editing content.
- The services section uses `/models/safe_model.glb`. Replacing the model may require changes to `SafeScene.tsx` if its object structure differs.
- English translations can be adjusted through the translation override files. Direct changes to generated English content may be overwritten by later runs.
- A successful CMS save does not guarantee a successful deployment. Check the GitHub and Cloudflare logs if content is missing.

This archive contains the site source and content, but not the live Cloudflare account settings, DNS configuration, OAuth Worker source or private service credentials. Those need to be handed over separately through the relevant accounts.
