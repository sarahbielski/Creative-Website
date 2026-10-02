# NOCTURNE — image prompts

Each prompt is one self-contained line in a code block. Click the copy button (or select
inside the fence) and paste straight into your generator — no editing needed, and no
reading the rest of this file.

> **All sixteen are already generated and installed** in `public/img/`. Everything below
> is kept so any single asset can be regenerated in your own art direction and dropped
> back in — the site picks up a new file on reload with no code change.

Save the result to `public/img/` under the **exact filename** in each heading. The site
already points at all of these; a placeholder holds the space until the file appears, then
crossfades to the photograph on reload.

**Two files are used as CSS masks, not pictures**, and are converted on the way in:

- `stain-1/2/3.png` — flattened to gray+alpha, and the colour comes from the palette at
  runtime. That halves the bytes and guarantees the stains are exactly `#8E1B31` /
  `#171009` whatever the generator produced. Generate them in any colour you like.
- `texture-grit.png` — gray+alpha, cropped square from the middle of the speckle field so
  it tiles without a visible edge.

Re-run those conversions with ffmpeg: `-vf "scale=820:-2,format=ya8" -pred mixed`.

**Palette, already baked into every prompt below:**
oxblood `#4E0D1C` · parchment `#F4EEE3` · ink `#171009` · wine red `#8E1B31` · gold `#C2A15A`

---

## Do these five first

They carry the most visual weight and have the weakest fallbacks.

### 1. `pour.png` — 1400 × 1900 · transparent PNG

The only glass of wine on the site, since the 3D model is bottle-only. Worth the most effort.

```
Commercial product photograph of a single crystal Bordeaux wine glass, one third filled with deep garnet red wine, isolated on a fully transparent background with clean alpha edges. Three-quarter view from slightly above eye level. Dramatic studio lighting: a large soft key from the upper left throwing a long vertical specular highlight down the bowl, and a hard rim light from behind right igniting the wine to translucent ruby. Visible legs running down the inside of the glass, fine bead of liquid at the meniscus. Warm restrained colour, deep oxblood #4E0D1C in the darkest wine. No table, no ground plane, no reflection, no baked-in shadow, no background of any kind. Medium format, f/11, tack sharp throughout, cut out cleanly.
```

### 2. `winemaker.jpg` — 1600 × 1100 · 3:2

```
Editorial documentary photograph of a woman winemaker in her late forties standing in a dim stone barrel cellar, rows of French oak barriques receding behind her into soft focus. Simple charcoal apron over a white shirt, one hand resting on a barrel head, a glass thief of dark red wine in the other. Lit by a single warm tungsten bulb overhead plus faint cool daylight bleeding in from a cellar door off frame to the left. Deep shadows, candlelit warmth, dust motes hanging in the air. Colour graded toward oxblood #4E0D1C and warm parchment #F4EEE3, desaturated elsewhere. Shot on 50mm at f/2, Portra 400 grain, slight halation on the highlights. Calm, unposed, quietly proud. No text, no logos, no watermarks.
```

### 3. `pairing.jpg` — 1800 × 1200 · 3:2

```
Overhead food photograph on a dark walnut table: a rare-cooked cote de boeuf sliced and fanned across a chipped cream ceramic platter, charred rosemary, flaked sea salt, a smear of bone marrow butter. A half-full glass of dark red wine and the shoulder of a dark green wine bottle enter from the right edge, intentionally cropped by the frame. Moody chiaroscuro light raking in from the left with deep falloff into shadow at the corners. Warm restrained palette of oxblood #4E0D1C, burnt umber and parchment #F4EEE3. Fine film grain, matte surfaces, no plastic gloss, no styling props. No text, no hands, no cutlery.
```

### 4–6. `stain-1.png`, `stain-2.png`, `stain-3.png` — 1400 × 1400 each · transparent PNG

Generate three variations, then recolour: **stain-1** and **stain-2** to wine red `#8E1B31`,
**stain-3** to near-black ink `#171009`. Make stain-2 noticeably wider and flatter than stain-1.

```
A single organic wine-stain blot on a fully transparent background, the mark left by a glass of red wine tipped over onto thick cotton rag paper. Irregular ragged outline with fine capillary feathering creeping out from the edges, a darker concentrated ring pooled toward one side, and a scatter of small speckled spatter dots around the main mass. Flat graphic silhouette in a single solid colour, wine red #8E1B31. No gradients, no drop shadow, no paper texture, no background. High resolution with crisp clean alpha edges. Top-down, perfectly flat, no perspective.
```

### 7. `vineyard.jpg` — 2400 × 1200 · 2:1

```
Wide landscape photograph of an old-vine hillside vineyard twenty minutes after sunset. Gnarled head-trained vines in long parallel rows running away to the horizon, autumn leaves turned rust and gold. A single cypress and a small stone chapel silhouetted on the ridge line. Sky graded from deep oxblood #4E0D1C at the horizon up to near-black indigo overhead, with one faint early star. Low mist pooling between the rows. Long exposure on a tripod, fine grain, painterly and completely still. Nothing modern in frame: no cars, no power lines, no buildings beyond the chapel, no people, no text.
```

---

## The allocation lineup

The centre slot is the live 3D bottle, so only these four are needed.

**Generate all four in one batch** with identical camera height, lighting and distance, or
they will not line up as a family. All transparent PNG.

### 8. `format-magnum.png` — 900 × 1900

```
Studio product photograph of a 1.5 litre magnum wine bottle, tall with broad shoulders, on a fully transparent background. Straight-on at eye level, dead centre, no perspective distortion. Dark forest-green glass, antique gold foil capsule over the neck, plain cream letterpress paper label with no legible text on it. Soft even beauty lighting from both sides with one subtle rim highlight running down the left edge of the glass. No shadow, no reflection, no ground plane, no background. Commercial catalogue photography, tack sharp, clean alpha cutout.
```

### 9. `format-half.png` — 700 × 1300

```
Studio product photograph of a 375ml half bottle of wine, the same classic Bordeaux silhouette scaled down, on a fully transparent background. Straight-on at eye level, dead centre, no perspective distortion. Dark forest-green glass, antique gold foil capsule over the neck, plain cream letterpress paper label with no legible text on it. Soft even beauty lighting from both sides with one subtle rim highlight running down the left edge of the glass. No shadow, no reflection, no ground plane, no background. Commercial catalogue photography, tack sharp, clean alpha cutout.
```

### 10. `format-case.png` — 1400 × 1100

```
Studio product photograph of a closed wooden six-bottle wine case on a fully transparent background, seen straight on at eye level. Pale unfinished pine boards, a blind-embossed crest burned into the lid, thin black metal strapping around the corners. Soft even beauty lighting from both sides with one subtle rim highlight down the left edge. No shadow, no reflection, no ground plane, no background, no legible text or branding. Commercial catalogue photography, tack sharp, clean alpha cutout.
```

### 11. `format-crate.png` — 1500 × 1200

```
Studio product photograph of an open twelve-bottle wooden wine crate on a fully transparent background, seen from a slight three-quarter angle. Pale unfinished pine, loose straw packing inside, four bottle necks with antique gold foil capsules visible above the straw. Soft even beauty lighting from both sides with one subtle rim highlight down the left edge. No shadow, no reflection, no ground plane, no background, no legible text or branding. Commercial catalogue photography, tack sharp, clean alpha cutout.
```

---

## Optional — these already have generated fallbacks

The site looks finished without them. Real files just make it better.

### 12. `seal.png` — 1000 × 1000 · transparent PNG

```
A circular estate seal in the style of an engraved rubber stamp, drawn in one flat colour, near-black ink #171009, on a fully transparent background. An outer double ring with words set around the circumference: NOCTURNE ESTATE AND CELLARS along the upper arc and EST. MCMVIII along the lower arc, both reading left to right and upright. Inside the ring, a fine line engraving of a crescent moon above a grapevine with three clustered bunches of grapes. Dense nineteenth-century banknote engraving line work, slightly broken and imperfect as though letterpress printed onto rough paper. No gradients, no shading, no background, perfectly circular and centred.
```

### 13. `texture-grit.png` — 1024 × 1024 · seamlessly tileable · transparent PNG

```
A seamless tileable letterpress ink-break texture on a fully transparent background: irregular speckles, pinholes and broken patches of pure black covering roughly fifteen percent of the area, like ink that failed to transfer evenly from a worn wood type block onto rough paper. Organic and random with no recognisable repeating motifs and no visible seam at any edge. Crisp clean alpha, no grey haze, no background, no gradients.
```

### 14. `texture-paper.jpg` — 1024 × 1024 · seamlessly tileable

```
A seamless tileable texture of heavy cream cotton rag paper in parchment #F4EEE3. Visible paper fibre, subtle cloudy mottling, a few faint darker flecks. Completely flat even lighting with no vignette, no shadow, no folds, no creases, no torn edges. Very low contrast, almost uniform, since this is a whisper-light overlay. Must tile perfectly with no visible seam at any edge.
```

### 15. `og.jpg` — 1200 × 630 · social share card

```
A moody cinematic product shot for a social share card. A single dark forest-green wine bottle with an antique gold foil capsule, centred against a flat deep oxblood #4E0D1C field. Dramatic single-source side light from the left carving a bright edge down the glass, everything else falling into deep shadow. Generous empty negative space across the lower third of the frame. Premium, restrained, expensive. No text, no logos, no props, no table.
```
