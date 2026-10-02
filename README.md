# Nocturne — Estate & Cellars

A single-product wine site: oxblood frame, parchment panel, enormous Didone display type,
and one real 3D bottle that stays pinned dead centre while the whole page moves past it.

```bash
npm install
npm run dev      # http://localhost:3003
npm run build
npm run lint     # tsc --noEmit
npm run model    # re-derive public/model/wine.glb from model-src/
```

## GitHub Pages deployment

Repository: https://github.com/sarahbielski/Creative-Website

Website: https://sarahbielski.github.io/Creative-Website/

The Vite base is `/Creative-Website/`. Runtime image and model requests use that
base; Vite rewrites CSS texture paths during the build. The model-generation
script preserves label UVs so the runtime-painted artwork remains visible.

Use Node.js 22 or newer and `npm ci` for reproducible installation. The deployment
workflow runs TypeScript checks and `npm run build -- --configLoader runner`.
The runner avoids a configuration-bundling stall observed on the local Mac while
preserving the supplied build script and output. For the same local preview, use
`npm run preview -- --configLoader runner`, then open the `/Creative-Website/` path.

In repository Settings → Pages → Build and deployment, choose **GitHub Actions**.
Pushes to `main` deploy automatically. To retry after enabling Pages, open Actions
→ Deploy website to GitHub Pages → Run workflow → main.

The template's purchase, search, video, and newsletter controls are demonstration
elements as supplied; no commerce, mailing-list, or video backend is included.

## How the motion works

The reference this was built from pins its product in the middle of the viewport for the
entire scroll, runs giant type behind it at a faster rate, and finally lets the product
shrink into a row of pack formats. Three ideas carry all of that:

**The canvas never scrolls.** `Stage` is `position: fixed`, full-bleed, `pointer-events:
none`. Nothing is pinned, unpinned or re-laid-out, so there is nothing to jump or fight
with the smooth scroller. "Where the bottle is" is purely a pose computed per frame.

**`lib/choreography.ts` is the single source of that pose.** It has three regimes:

| Regime | When | How the pose is decided |
| --- | --- | --- |
| Keyframed | hero → tasting notes | a hand-authored track, interpolated against scroll position |
| Docked | the allocation lineup | read straight off the DOM slot's `getBoundingClientRect()` |
| Narrow | below `lg` | the nearest in-flow slot, so the bottle never covers stacked copy |

The docked regime is the important one: the lineup slot is an *empty div* in the row, and
the model is flown into whatever rectangle that div happens to occupy. The landing is
correct at every viewport width with no tuned numbers, and it keeps tracking the row as it
scrolls away. `Pose.key` names the regime — when it changes, `Product` snaps instead of
easing, because the two places can be viewports apart.

**Nothing in the 3D path touches React.** `samplePose()` returns a single mutable object,
and `Product`'s `useFrame` damps toward it. Scroll never triggers a render.

DOM motion is GSAP ScrollTrigger over Lenis: scrubbed parallax (`useParallax`), batched
fade-ups and masked line reveals (`useRevealSystem`). Lenis' expo-out curve is most of why
the page feels heavy rather than floaty.

## The model

The supplied `wine_bottle_and_glass.glb` needed two passes before it was usable:

1. **Spec-gloss → metal-rough.** It shipped with `KHR_materials_pbrSpecularGlossiness`,
   which three.js dropped in r160. Loaded as-is it renders untextured white.
2. **`npm run model`** removes the tumbler and its wine, and removes the stock
   "Red wine 2003" label bitmap — 1.5 MB of an image that is never shown. 2.41 MB → 193 KB.

The label is painted onto a canvas at runtime instead (`lib/label.ts`), so the bottle
carries real branding. Two conventions that are easy to get backwards and are verified
against the mesh's own UVs: the art is **mirrored** (local +X maps to increasing `u`, and
the group is turned to face camera, so `u` runs right-to-left on screen), and
`flipY = false` per glTF.

Materials are art-directed rather than inherited. The body is **opaque** dark-green glass
with a clearcoat: a wine bottle is not see-through, and transmission over a transparent
canvas has nothing behind it to refract, so it comes out muddy. The label gets a
`polygonOffset` because it sits only 0.015 units proud of a 2.3-unit radius.

Lighting is a local `<Environment>` built from `<Lightformer>` cards — no HDRI fetch, and
every highlight on the bottle is placed by hand.

## Assets

Every photograph is optional. `lib/assets.ts` probes each file; until it exists the layout
holds its exact space with a drawn placeholder, and crossfades to the real image the
moment one appears in `public/img/`. The wine stains, the estate seal, the letterpress
grit and the paper grain all have generated fallbacks, so the site is complete with zero
photography. **[ASSETS.md](ASSETS.md) has a ready-to-use generation prompt for each file.**

CSS is the one place that cannot fall back on its own — a missing mask image would paint a
solid block over the display type — so the two textures are probed in JS and the
stylesheet only reaches for them once `has-grit` / `has-paper` is set on `<html>`.

## Things worth knowing before editing

- **Custom classes live in `@layer components`.** Unlayered rules beat every layered one
  regardless of specificity, so `.t-body { color }` outside a layer would silently win over
  `text-parchment/75` and leave all the reversed copy dark on dark.
- **`GiantType` measures and fits each line to the container width.** A `vw` clamp cannot
  do this, because the right size depends on the word. The measuring span must be
  `inline-block`: a block-level span reports the *container's* width and the fit no-ops.
- **All copy is in `lib/content.ts`.** Sections read from it; rewriting the wine does not
  touch a layout or motion decision.
- **Reveal start-states are gated behind `[data-motion='on']`**, which the motion system
  sets only once it is actually driving. If the JS fails the page renders complete rather
  than blank.
- `prefers-reduced-motion` drops Lenis, the parallax and the reveals; the bottle keeps its
  pose but loses the smoothing.
