import type {CSSProperties} from 'react';
import {useRef} from 'react';
import type {Note} from '../lib/content';
import {SPLAT_ASPECT, SPLAT_CENTER, splat} from '../lib/blob';
import {useParallax} from '../hooks/useReveal';

type StainProps = {
  note: Note;
  index: number;
  /** Fraction of viewport height this blot drifts by — vary it per stain. */
  from?: number;
  to?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * A flavour note set inside an ink splat, the way the reference does it.
 *
 * The splat is generated rather than photographed: it has to be one dense mass
 * for reversed type to hold, and a known shape so the note can be centred on
 * it. The photographed wine stains are used elsewhere as spill marks, which is
 * what a ring-with-splatter is actually good for.
 *
 * `grit` is the other half of it — the same letterpress speckle that breaks up
 * the display type, painted over the splat so it reads as ink on paper rather
 * than as flat vector.
 *
 * No `relative` on the root: the caller positions this, and adding one would
 * collide with an `absolute` passed in through className.
 */
export function Stain({note, index, from = 0.14, to = -0.2, className = '', style}: StainProps) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, {from, to});

  const fill = note.tone === 'wine' ? 'var(--color-wine)' : 'var(--color-ink)';
  const {core, segments, dots} = splat(1013 * (index + 1) + 7);

  return (
    <div ref={ref} className={className} style={style}>
      <div className="relative w-full" style={{aspectRatio: SPLAT_ASPECT}}>
        <div className="grit absolute inset-0">
          <svg viewBox="0 0 120 100" className="h-full w-full" aria-hidden="true">
            <g fill={fill}>
              <path d={core} />
              {dots.map((d, i) => (
                <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
              ))}
            </g>
            <g stroke={fill} strokeLinecap="round" fill="none">
              {segments.map((s, i) => (
                <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeWidth={s.w} />
              ))}
            </g>
          </svg>
        </div>

        <div
          className="absolute z-[2] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
          style={{
            left: `${SPLAT_CENTER.x * 100}%`,
            top: `${SPLAT_CENTER.y * 100}%`,
            // The dense core is only about half the box wide, so the note has
            // to stay well inside it or the last words fall off the ink.
            width: '45%',
          }}
        >
          <span aria-hidden="true" className="mb-[0.45em] text-[0.78rem] leading-none text-parchment">
            {note.glyph}
          </span>
          {/* Title above body in the hierarchy — the default scale has the
              fine print larger than the label, which reads backwards. */}
          <h3 className="t-micro text-[0.7rem] text-parchment">{note.title}</h3>
          <p className="t-body-xs mt-[0.6em] text-[0.6rem] leading-[1.55] text-parchment/90">
            {note.body}
          </p>
        </div>
      </div>
    </div>
  );
}
