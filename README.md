# Google x NYC Patch Set — student relaunch campaign

A NYC-first adaptation of the Vesper template for a marketing class project.
Retains Vite, React, TypeScript, Tailwind, the seven-section composition, GSAP / Lenis,
and the fixed React Three Fiber stage with responsive DOM docking. The wine bottle
is replaced by a textured plane showing the real patch set photograph.

## Run and deploy

```sh
npm ci
npm run dev -- --configLoader runner
npm run lint
npm run build -- --configLoader runner
npm run preview -- --configLoader runner
```

Open `/Creative-Website/`. The existing GitHub Pages workflow deploys main.

## Content and sources

- Product image: https://your.merch.google/media/catalog/product/g/g/ggl1823.png
- Product description / attachment guidance: https://your.merch.google/nyc-campus-patch.html
- City photograph: Y M, https://unsplash.com/photos/a-taxi-cab-driving-down-a-street-next-to-tall-buildings-jW310-nIQqo
- Shop destination: https://shop.merch.google/

The campaign name is a student repositioning of the New York Campus Patch Set,
not an assertion of a new official collaboration. No invented price, stock,
reviews, or purchase transaction. Shop CTAs lead to the official US storefront;
product-specific current availability has not been verified. Hard-surface uses
are qualified: fabric covers / sleeves, or suitable adhesive purchased separately.
No newsletter form collects personal data. Existing wine assets remain unused
in source control to preserve the supplied template reference.
