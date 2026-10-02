import {useCallback, useLayoutEffect, useRef} from 'react';
import {useParallax} from '../hooks/useReveal';

type GiantTypeProps = {
  lines: readonly string[];
  tone?: 'wine' | 'ink' | 'parchment';
  /** Fraction of viewport height the block is offset by on entry / exit. */
  from?: number;
  to?: number;
  className?: string;
  align?: 'left' | 'center' | 'right';
  as?: 'h1' | 'h2' | 'div';
  decorative?: boolean;
  /** Wrap each line in a clip so it can wipe up on the intro. */
  masked?: boolean;
  /** Fraction of the container each line should span. */
  fill?: number;
};

const TONE = {
  wine: 'text-wine',
  ink: 'text-ink',
  parchment: 'text-parchment',
} as const;

/**
 * The scroll ruler. Enormous letterpressed words that travel faster than the
 * page and pass behind the bottle — the thing that makes the product read as
 * fixed while everything else moves.
 *
 * Every line is measured and scaled to span the container exactly, the way the
 * reference sets two lines of different lengths to the same width. Guessing
 * with a vw clamp cannot do that, because the answer depends on the word.
 */
export function GiantType({
  lines,
  tone = 'wine',
  from = 0.17,
  to = -0.26,
  className = '',
  align = 'center',
  as: Tag = 'div',
  decorative = false,
  masked = false,
  fill = 1,
}: GiantTypeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lineEls = useRef<(HTMLSpanElement | null)[]>([]);
  useParallax(ref, {from, to});

  const setLine = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      lineEls.current[i] = el;
    },
    [],
  );

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    let lastWidth = -1;

    const run = (force = false) => {
      const width = container.clientWidth;
      if (width === 0) return;
      // Resizing the type changes the container's height, which re-fires the
      // observer. Only react to width.
      if (!force && width === lastWidth) return;
      lastWidth = width;

      // A short line fitted to the full width can get taller than the viewport,
      // so cap it — and budget per line, since a two-line block has to fit
      // twice. These numbers put the cap height where the reference sits it:
      // roughly a fifth of the viewport per line.
      const cap = window.innerHeight * (lineEls.current.length > 1 ? 0.3 : 0.44);

      for (const el of lineEls.current) {
        if (!el) continue;
        // Must be shrink-to-fit while measuring: a block-level span reports the
        // container's width, not the text's, and the fit would silently no-op.
        el.style.display = 'inline-block';
        el.style.fontSize = '100px';
        const natural = el.getBoundingClientRect().width;
        if (natural > 0) {
          const size = Math.min((width / natural) * 100 * fill, cap);
          el.style.fontSize = `${size.toFixed(2)}px`;
        }
      }
    };

    run(true);

    const ro = new ResizeObserver(() => run());
    ro.observe(container);

    // Bodoni will not have arrived on the first pass; refit when it does.
    document.fonts?.ready.then(() => run(true)).catch(() => {});

    return () => ro.disconnect();
  }, [fill, lines]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none select-none ${className}`}
      style={{textAlign: align}}
      aria-hidden={decorative || undefined}
    >
      <Tag className="m-0">
        {lines.map((line, i) => {
          const body = (
            <span
              ref={setLine(i)}
              data-intro-line={masked ? '' : undefined}
              className={`t-giant grit ${TONE[tone]}`}
              // Inline, so it beats the stylesheet's `.line-mask > span { block }`.
              style={{display: 'inline-block'}}
            >
              {line}
            </span>
          );

          return masked ? (
            <span key={line} className="line-mask">
              {body}
            </span>
          ) : (
            <span key={line} className="block">
              {body}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
