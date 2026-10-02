/**
 * Ink splats for the flavour notes.
 *
 * The reference's blots are not blobs — they are splats: a lumpy, dense core
 * with tapering tendrils thrown outward in every direction, each ending in a
 * rounded tip, with satellite droplets flung further out. A smooth ellipse
 * with a few drips hanging off the bottom reads as clip art, which is exactly
 * what the first attempt looked like.
 *
 * Tapering is faked with three overlapping round-capped segments of
 * decreasing width. That is far cheaper than solving a real outline and, at
 * this size, indistinguishable.
 *
 * Drawn in a 120 x 100 viewBox, dense enough in the middle to carry reversed
 * type.
 */

const CX = 60;
const CY = 47;
const RX = 32;
const RY = 26;

function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export type Segment = {x1: number; y1: number; x2: number; y2: number; w: number};
export type Dot = {cx: number; cy: number; r: number};
export type Splat = {core: string; segments: Segment[]; dots: Dot[]};

/** Closed Catmull-Rom through jittered polar points, emitted as cubic beziers. */
function corePath(rnd: () => number, points: number) {
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const k = 0.74 + rnd() * 0.48;
    pts.push([CX + Math.cos(a) * RX * k, CY + Math.sin(a) * RY * k]);
  }

  const at = (i: number) => pts[(i + points) % points];
  let d = `M ${at(0)[0].toFixed(2)} ${at(0)[1].toFixed(2)}`;
  for (let i = 0; i < points; i++) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);
    d +=
      ` C ${(x1 + (x2 - x0) / 6).toFixed(2)} ${(y1 + (y2 - y0) / 6).toFixed(2)},` +
      ` ${(x2 - (x3 - x1) / 6).toFixed(2)} ${(y2 - (y3 - y1) / 6).toFixed(2)},` +
      ` ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  return `${d} Z`;
}

export function splat(seed: number): Splat {
  const rnd = rng(seed);
  const core = corePath(rnd, 22);

  const segments: Segment[] = [];
  const dots: Dot[] = [];

  const count = 11 + Math.floor(rnd() * 5);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (rnd() - 0.5) * 0.4;
    const dx = Math.cos(a);
    const dy = Math.sin(a);

    // Longer where gravity helps, but present all the way round.
    const down = Math.max(0, dy);
    const len = RX * (0.26 + rnd() * 0.46 + down * 0.5);
    const w = RX * (0.1 + rnd() * 0.1);

    // Start inside the core so a tendril never floats free of it.
    const sx = CX + dx * RX * 0.8;
    const sy = CY + dy * RY * 0.8;
    const ex = sx + dx * len;
    const ey = sy + dy * len * 1.12;

    const at = (t: number) => [sx + (ex - sx) * t, sy + (ey - sy) * t] as const;
    const [m1x, m1y] = at(0.52);
    const [m2x, m2y] = at(0.44);
    const [m3x, m3y] = at(0.82);
    const [m4x, m4y] = at(0.76);

    segments.push({x1: sx, y1: sy, x2: m1x, y2: m1y, w});
    segments.push({x1: m2x, y1: m2y, x2: m3x, y2: m3y, w: w * 0.6});
    segments.push({x1: m4x, y1: m4y, x2: ex, y2: ey, w: w * 0.34});
    dots.push({cx: ex, cy: ey, r: w * 0.34 + rnd() * 0.5});
  }

  // Satellite droplets, flung clear of the mass.
  const flung = 12 + Math.floor(rnd() * 7);
  for (let i = 0; i < flung; i++) {
    const a = rnd() * Math.PI * 2;
    const k = 1.08 + rnd() * 0.85;
    dots.push({
      cx: CX + Math.cos(a) * RX * k,
      cy: CY + Math.sin(a) * RY * k * 1.1,
      r: 0.5 + rnd() * 2.1,
    });
  }

  return {core, segments, dots};
}

/** Where the note sits, as a fraction of the splat's box. */
export const SPLAT_CENTER = {x: CX / 120, y: CY / 100};
export const SPLAT_ASPECT = '120 / 100';
