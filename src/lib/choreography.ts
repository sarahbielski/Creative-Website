import {anchorEl, centerOf, scroll, view} from './scroll';

/**
 * Where the bottle is, at any scroll position.
 *
 * The reference pins its product dead centre of the viewport for the whole
 * journey and scrolls everything else past it, then — at the availability
 * section — lets it shrink and slot into the row of formats. We do the same,
 * but the product is a real model, so "pinned" costs nothing: the canvas is
 * fixed and we simply pose the object inside it.
 *
 * Three regimes:
 *   A. Keyframed — a hand-authored track of poses along the scroll.
 *   B. Docked    — the pose is read straight off a DOM slot, so it tracks that
 *                  element exactly, at any viewport size, for free.
 *   C. Narrow    — below the point where the columns stack there is no empty
 *                  middle to stand in, so pinning would put the bottle on top
 *                  of the copy. It docks to in-flow slots instead and simply
 *                  scrolls with the page.
 */

export type Pose = {
  /** Screen position of the bottle's centre, 0..1 of viewport. */
  sx: number;
  sy: number;
  /** Bottle height as a fraction of viewport height. */
  hFrac: number;
  rotY: number;
  rotZ: number;
  shadow: number;
  /**
   * Which regime produced this pose. When it changes the bottle has been
   * handed between two places that may be viewports apart, so the renderer
   * snaps instead of easing it across the screen.
   */
  key: string;
};

type Key = Omit<Pose, 'key'> & {at: () => number};

const PI = Math.PI;

/** Matches Tailwind's `lg`, where every column layout on the page stacks. */
const NARROW = 1024;

/**
 * rotY is measured so that PI puts the label square to camera; drifting either
 * side of it turns the label without ever losing it. The bottle is centred
 * because the columns either side of it are narrow and the middle third of the
 * panel is left empty for exactly this.
 */
const track: Key[] = [
  {at: () => 0, sx: 0.5, sy: 0.5, hFrac: 0.78, rotY: PI + 0.4, rotZ: -0.34, shadow: 1},
  {at: () => view.h * 0.62, sx: 0.5, sy: 0.5, hFrac: 0.8, rotY: PI + 0.28, rotZ: -0.08, shadow: 1},
  {at: () => centerOf('wine'), sx: 0.5, sy: 0.5, hFrac: 0.82, rotY: PI + 0.15, rotZ: 0, shadow: 1},
  {at: () => centerOf('finish'), sx: 0.5, sy: 0.5, hFrac: 0.8, rotY: PI - 0.02, rotZ: 0, shadow: 1},
  {at: () => centerOf('notes'), sx: 0.5, sy: 0.5, hFrac: 0.76, rotY: PI - 0.2, rotZ: 0, shadow: 1},
];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type Slot = {sx: number; sy: number; hFrac: number; distance: number};

/** Screen-space centre and height of a registered slot, or null if unusable. */
function slotRect(id: string): Slot | null {
  const el = anchorEl(id);
  if (!el) return null;

  const r = el.getBoundingClientRect();
  if (r.height === 0) return null;

  const sy = (r.top + r.height / 2) / view.h;
  return {
    sx: (r.left + r.width / 2) / view.w,
    sy,
    hFrac: r.height / view.h,
    distance: Math.abs(sy - 0.5),
  };
}

const out: Pose = {sx: 0.5, sy: 0.5, hFrac: 0.78, rotY: PI, rotZ: 0, shadow: 1, key: 'track'};

function assign(
  sx: number, sy: number, hFrac: number, rotY: number, rotZ: number, shadow: number, key: string,
) {
  out.sx = sx;
  out.sy = sy;
  out.hFrac = hFrac;
  out.rotY = rotY;
  out.rotZ = rotZ;
  out.shadow = shadow;
  out.key = key;
  return out;
}

export function samplePose(): Pose {
  // --- C. narrow: stand in whichever in-flow slot is nearest --------------
  if (view.w > 0 && view.w < NARROW) {
    const heroSlot = slotRect('slot-hero');
    const allocSlot = slotRect('slot');

    let id = 'slot-hero';
    let best = heroSlot;
    if (allocSlot && (!heroSlot || allocSlot.distance < heroSlot.distance)) {
      id = 'slot';
      best = allocSlot;
    }

    if (best) {
      const inLineup = id === 'slot';
      return assign(
        best.sx,
        best.sy,
        best.hFrac,
        // Tie a gentle turn to how far the slot has travelled up the screen, so
        // the label still moves rather than standing flat.
        PI + (inLineup ? 0 : (0.5 - best.sy) * 0.5),
        0,
        inLineup ? 0.35 : 0.85,
        id,
      );
    }
  }

  const y = scroll.y;

  // --- A. keyframed track -------------------------------------------------
  let i = 0;
  while (i < track.length - 2 && y >= track[i + 1].at()) i++;

  const a = track[i];
  const b = track[i + 1];
  const a0 = a.at();
  const span = b.at() - a0;
  const t = span > 0 ? smooth(clamp01((y - a0) / span)) : 0;

  assign(
    mix(a.sx, b.sx, t),
    mix(a.sy, b.sy, t),
    mix(a.hFrac, b.hFrac, t),
    mix(a.rotY, b.rotY, t),
    mix(a.rotZ, b.rotZ, t),
    mix(a.shadow, b.shadow, t),
    'track',
  );

  // --- B. dock into the lineup -------------------------------------------
  const dock = slotRect('slot');
  if (dock) {
    // Hand over as the slot rises from just below the fold to its resting place.
    const k = smooth(clamp01((1.28 - dock.sy) / (1.28 - 0.66)));
    if (k > 0) {
      out.sx = mix(out.sx, dock.sx, k);
      out.sy = mix(out.sy, dock.sy, k);
      out.hFrac = mix(out.hFrac, dock.hFrac, k);
      out.rotY = mix(out.rotY, PI, k);
      out.rotZ = mix(out.rotZ, 0, k);
      out.shadow = mix(out.shadow, 0.35, k);
    }
  }

  return out;
}
