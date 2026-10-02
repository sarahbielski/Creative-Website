import * as THREE from 'three';

/**
 * A soft shadow in the shape of the bottle.
 *
 * A radial blob reads as a smudge, not a shadow. The reference throws the
 * product's own silhouette onto the backdrop, and because this bottle is a
 * surface of revolution its silhouette is fully described by one number per
 * height: the largest radius at that height. So we walk the geometry once,
 * build that profile, stroke it into a canvas and let the 2D context blur it.
 *
 * Done once at load — nothing here runs per frame.
 */

const BINS = 180;
const CANVAS_H = 1024;

export type BottleShadow = {
  texture: THREE.CanvasTexture;
  /** Plane size, in the model's own units, including the blur margin. */
  width: number;
  height: number;
  /** Centre of the silhouette in model space, to line the plane up. */
  centerY: number;
};

export function createBottleShadow(geometries: (THREE.BufferGeometry | undefined)[]): BottleShadow {
  const geos = geometries.filter(Boolean) as THREE.BufferGeometry[];

  let minY = Infinity;
  let maxY = -Infinity;
  for (const g of geos) {
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    minY = Math.min(minY, bb.min.y);
    maxY = Math.max(maxY, bb.max.y);
  }
  const span = Math.max(maxY - minY, 1e-6);

  // Largest radius per height band.
  const radii = new Float32Array(BINS);
  let maxR = 0;
  for (const g of geos) {
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getZ(i));
      const bin = Math.min(BINS - 1, Math.max(0, Math.floor(((pos.getY(i) - minY) / span) * BINS)));
      if (r > radii[bin]) radii[bin] = r;
      if (r > maxR) maxR = r;
    }
  }

  // Bands with no vertices in them would pinch the outline; carry the last
  // known radius across the gap.
  let last = radii[0] || maxR * 0.5;
  for (let i = 0; i < BINS; i++) {
    if (radii[i] === 0) radii[i] = last;
    else last = radii[i];
  }
  // Light smoothing so faceting in the mesh does not show as a rippled edge.
  const smoothed = Float32Array.from(radii);
  for (let i = 1; i < BINS - 1; i++) {
    smoothed[i] = radii[i - 1] * 0.25 + radii[i] * 0.5 + radii[i + 1] * 0.25;
  }

  // Room around the silhouette for the blur to spread into.
  const margin = maxR * 1.25;
  const width = maxR * 2 + margin * 2;
  const height = span + margin * 2;

  const canvasW = Math.round((CANVAS_H * width) / height);
  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d')!;

  const scale = CANVAS_H / height;
  const cx = canvasW / 2;
  const yAt = (worldY: number) => CANVAS_H - margin * scale - (worldY - minY) * scale;

  const path = new Path2D();
  // Down the right edge...
  for (let i = 0; i < BINS; i++) {
    const y = yAt(minY + ((i + 0.5) / BINS) * span);
    const x = cx + smoothed[i] * scale;
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  }
  // ...and back up the left.
  for (let i = BINS - 1; i >= 0; i--) {
    path.lineTo(cx - smoothed[i] * scale, yAt(minY + ((i + 0.5) / BINS) * span));
  }
  path.closePath();

  ctx.filter = `blur(${(margin * scale * 0.4).toFixed(1)}px)`;
  ctx.fillStyle = 'rgba(32,18,11,0.62)';
  ctx.fill(path);
  ctx.filter = 'none';

  // A cast shadow is weakest where the object is furthest from the surface.
  // Fading the top keeps it from reading as a flat cut-out.
  const fade = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  fade.addColorStop(0, 'rgba(0,0,0,0.28)');
  fade.addColorStop(0.42, 'rgba(0,0,0,0.85)');
  fade.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, canvasW, CANVAS_H);
  ctx.globalCompositeOperation = 'source-over';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return {texture, width, height, centerY: (minY + maxY) / 2};
}
