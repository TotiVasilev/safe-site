# TETRAEDAR homepage integration

**Base:** earlier original `safe-showcase(6).zip`. **Reference:** user-uploaded `safe-showcase(7).zip`.

Only homepage TSX, its scoped CSS, the needed KineticMotion component and the referenced services image were introduced into the original project. Existing Header, layout, catalog, services, CMS content, admin, routes, and product assets are retained from the original base.

The section structure, copy, icons and CTA arrangement follow the uploaded redesign. Typography was explicitly returned to the original homepage scale (desktop hero 68px, section titles 60px; mobile hero 46px, section titles 42px). The redesign uses the original CMS links and `/produkti#category-${slug}` anchors; these anchors are present in the existing ProductsCatalog.

The uploaded redesign does not define new destinations; no new route was invented. All external partner logos/links are still sourced from the CMS.

**Testing:** Run `npm install && npm run build` or `npm run dev` locally. Review CMS preview, mobile navigation and category anchors before deployment. This is a separate experimental folder; production has not been modified.
