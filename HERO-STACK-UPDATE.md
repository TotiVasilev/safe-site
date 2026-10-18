# Hero carousel — three-image layered stack

The latest aligned/refined homepage is retained. Only the hero image area has been replaced with a three-image stacked carousel.

- Three uploaded user images, optimized to local WebP under `public/hero/stack/`.
- Automatically rotates every 3 seconds.
- Clicking either exposed rear image brings it to the front.
- No dots, arrows, numbers, or other visible controls.
- Rear images extend to the lower right. Blue remains the site's highlight color.
- Hover or keyboard focus pauses auto-rotation. Reduced-motion setting removes animated transitions.
- Original headline, CTAs, CMS, header, section structure, and routes unchanged.

Source: `components/ui/HeroImageStack.tsx`; styling appended to `app/blue-home.css`.

Test locally with `npm install && npm run dev`. Do not replace production until checked on desktop and mobile.
