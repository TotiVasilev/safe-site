# Free Bulgarian → English translation pilot

This is **a pilot, not a completed bilingual site**. It adds an opt-in GitHub Actions workflow that translates the CMS homepage text from `content/homepage.json` and commits a saved English copy at `content/en/homepage.json`.

## Run
1. Copy the files from this ZIP into the project at the indicated paths.
2. Push them to GitHub. Under **Actions → Free English translation pilot → Run workflow**, trigger the job manually.
3. Review the generated English file, especially security terminology, before displaying it on the public site.

No translation API subscription is required. The workflow downloads an open-source Argos Translate model during the run, which needs internet access and may be slow or fail if the model repository is unavailable. GitHub Actions usage limits still apply. The script only translates named homepage text fields and shares images, URLs and other non-text values unchanged. It caches exact Bulgarian strings to avoid re-translating unchanged content. It does **not** currently translate products, services, legal policy, or create English routes / activate the EN switcher. Those require further integration and testing. It is intentionally manual so unreviewed translations are not published automatically.
