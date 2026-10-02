/**
 * Turns the downloaded Sketchfab asset into the one the site actually ships.
 *
 *  - drops the tumbler and its wine, so only the bottle remains;
 *  - drops the stock "Red wine 2003" label bitmap, which is 1.5MB of an image
 *    we never show — the label is painted onto a canvas at runtime instead;
 *  - prunes and dedups whatever that orphans.
 *
 * The source is already through `gltf-transform metalrough`, because the
 * original uses KHR_materials_pbrSpecularGlossiness and three dropped support
 * for that extension in r160 — left alone it would load untextured white.
 *
 *   npm run model
 */
import {NodeIO} from '@gltf-transform/core';
import {dedup, prune} from '@gltf-transform/functions';

const SOURCE = 'model-src/wine-metalrough.glb';
const OUT = 'public/model/wine.glb';

const DROP = /polySurface3_standardSurface2_0|polySurface4_Wine_0/;

const io = new NodeIO();
const doc = await io.read(SOURCE);
const root = doc.getRoot();

let dropped = 0;
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (mesh && DROP.test(mesh.getName())) {
    node.dispose();
    dropped++;
  }
}

for (const material of root.listMaterials()) {
  if (material.getName().includes('Label')) material.setBaseColorTexture(null);
}

// The runtime-painted label still needs UVs after its stock bitmap is removed.
await doc.transform(prune({keepAttributes: true}), dedup());
await io.write(OUT, doc);

const before = (await import('node:fs')).statSync(SOURCE).size;
const after = (await import('node:fs')).statSync(OUT).size;
console.log(
  `dropped ${dropped} node(s) · ${(before / 1e6).toFixed(2)}MB -> ${(after / 1e6).toFixed(2)}MB`,
);
console.log('meshes:', root.listMeshes().map((m) => m.getName()).join(', '));
