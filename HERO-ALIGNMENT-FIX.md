# Hero alignment correction

The previous version accidentally stretched the hero layout instead of just its background.

This revision restores the same centered, max-1440px content container used by the other sections, puts the hero copy back inside its left boundary, and restores the image to 550px height with the original 55/45 split. Only the hero background/section retains the additional 920px height. All other sections and routes are unchanged.

Preview locally with npm install and npm run dev. Browser/build validation was not performed.
