import * as THREE from 'three';

/**
 * The bottle arrives with a stock "Red wine 2003" label baked into it, so we
 * paint our own onto a canvas and hand that to the material instead.
 *
 * Two conventions to respect:
 *  - the source art is mirrored, because the label plane faces -Z and its UVs
 *    run backwards, so we mirror our drawing to match;
 *  - glTF textures use flipY = false, so the top of the canvas is the top of
 *    the label.
 */

const W = 1024;
const H = 1024;

const PARCHMENT = '#f1e7d5';
const INK = '#191108';
const GOLD = '#a8863f';
const WINE = '#7d1628';

/** Canvas letter-spacing is Chromium-only, so track by hand. */
function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  spacing: number,
) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let x = cx - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => {
    ctx.fillText(c, x, y);
    x += widths[i] + spacing;
  });
  ctx.textAlign = prev;
}

function rule(ctx: CanvasRenderingContext2D, y: number, halfWidth: number, color = GOLD) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - halfWidth, y);
  ctx.lineTo(W / 2 + halfWidth, y);
  ctx.stroke();
}

/** A small engraved crescent over a three-bunch vine, drawn not typeset. */
function crest(ctx: CanvasRenderingContext2D, cy: number) {
  const cx = W / 2;

  ctx.save();
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = 3;

  // Crescent: a disc with a second disc bitten out of it. Each arc needs its
  // own moveTo or the two circles join into a single closed path.
  ctx.beginPath();
  ctx.moveTo(cx + 30, cy - 34);
  ctx.arc(cx, cy - 34, 30, 0, Math.PI * 2);
  ctx.moveTo(cx + 15 + 28, cy - 40);
  ctx.arc(cx + 15, cy - 40, 28, 0, Math.PI * 2);
  ctx.fill('evenodd');

  // Vine: a stem and three descending bunches.
  ctx.beginPath();
  ctx.moveTo(cx, cy + 6);
  ctx.quadraticCurveTo(cx - 4, cy + 26, cx, cy + 44);
  ctx.stroke();

  const bunch = (bx: number, by: number, s: number) => {
    const rows = [
      [-1, 0, 1],
      [-0.5, 0.5],
      [0],
    ];
    rows.forEach((row, ri) => {
      row.forEach((c) => {
        ctx.beginPath();
        ctx.arc(bx + c * 9 * s, by + ri * 8.5 * s, 4.4 * s, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  };

  bunch(cx - 30, cy + 22, 0.82);
  bunch(cx + 30, cy + 22, 0.82);
  bunch(cx, cy + 44, 1);

  ctx.restore();
}

function paint(ctx: CanvasRenderingContext2D) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);

  // Mirror everything: the label's UVs run right to left.
  ctx.translate(W, 0);
  ctx.scale(-1, 1);

  ctx.fillStyle = PARCHMENT;
  ctx.fillRect(0, 0, W, H);

  // Aged paper: darker toward the edges.
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.78);
  vignette.addColorStop(0, 'rgba(120,88,40,0)');
  vignette.addColorStop(1, 'rgba(96,66,28,0.2)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Double border.
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.strokeRect(54, 54, W - 108, H - 108);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(72, 72, W - 144, H - 144);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = INK;
  ctx.font = '500 26px Inter, sans-serif';
  tracked(ctx, 'ESTATE BOTTLED', W / 2, 168, 11);

  crest(ctx, 268);

  ctx.fillStyle = INK;
  ctx.font = '900 132px "Bodoni Moda", Didot, serif';
  tracked(ctx, 'NOCTURNE', W / 2, 470, 3);

  rule(ctx, 512, 210);
  ctx.fillStyle = GOLD;
  ctx.save();
  ctx.translate(W / 2, 512);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-7, -7, 14, 14);
  ctx.restore();

  ctx.fillStyle = WINE;
  ctx.font = '500 34px Inter, sans-serif';
  tracked(ctx, 'CABERNET SAUVIGNON', W / 2, 586, 6);

  ctx.fillStyle = INK;
  ctx.font = 'italic 400 40px "Cormorant Garamond", Garamond, serif';
  ctx.fillText('Single vineyard — Block ix', W / 2, 654);

  ctx.font = '700 84px "Bodoni Moda", Didot, serif';
  tracked(ctx, 'MMXVIII', W / 2, 774, 8);

  rule(ctx, 838, 150, 'rgba(25,17,8,0.35)');

  // The mirror is already in force, and the UV flip undoes it, so canvas x
  // reads left-to-right on the bottle. Nothing extra to do here.
  ctx.font = '400 26px Inter, sans-serif';
  ctx.fillStyle = INK;
  ctx.textAlign = 'left';
  ctx.fillText('14,5% vol', 168, 906);
  ctx.textAlign = 'right';
  ctx.fillText('750 ml', W - 168, 906);
  ctx.textAlign = 'center';
  ctx.font = '500 20px Inter, sans-serif';
  tracked(ctx, 'NOCTURNE ESTATE & CELLARS — EST. MCMVIII', W / 2, 962, 3);
}

export function createLabelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  paint(ctx);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false; // glTF convention
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  // Bodoni and Inter almost certainly are not ready on the first paint, so
  // redraw once they are and push the pixels up again.
  if (typeof document !== 'undefined' && document.fonts) {
    document.fonts.ready
      .then(() => {
        paint(ctx);
        texture.needsUpdate = true;
      })
      .catch(() => {});
  }

  return texture;
}
