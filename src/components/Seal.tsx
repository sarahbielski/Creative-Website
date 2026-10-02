import {useAsset} from '../lib/assets';

/**
 * The estate stamp. Characters are placed around the ring by hand rather than
 * with textPath, because textPath silently flips glyphs on a bottom arc and
 * the fix is less code than the workaround.
 */
function ring(text: string, radius: number, spreadDeg: number, side: 'top' | 'bottom') {
  const chars = [...text];
  const step = spreadDeg / Math.max(chars.length - 1, 1);

  return chars.map((char, i) => {
    // Top runs left to right over the crown; bottom runs left to right under
    // the base, which means sweeping the angle the other way.
    const deg =
      side === 'top'
        ? -90 - spreadDeg / 2 + i * step
        : 90 + spreadDeg / 2 - i * step;

    const rad = (deg * Math.PI) / 180;
    return {
      char,
      x: 100 + Math.cos(rad) * radius,
      y: 100 + Math.sin(rad) * radius,
      rotate: side === 'top' ? deg + 90 : deg - 90,
    };
  });
}

export function Seal({className = ''}: {className?: string}) {
  const photo = useAsset('/img/seal.png');

  if (photo) {
    return <img src={photo} alt="" aria-hidden="true" className={`fig-in ${className}`} />;
  }

  const top = ring('NOCTURNE ESTATE', 76, 148, 'top');
  const bottom = ring('EST. MCMVIII', 76, 86, 'bottom');

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke="var(--color-ink)">
        <circle cx="100" cy="100" r="94" strokeWidth="1.6" />
        <circle cx="100" cy="100" r="88" strokeWidth="0.7" />
        <circle cx="100" cy="100" r="58" strokeWidth="0.7" />
      </g>

      <g fill="var(--color-ink)" fontFamily="Inter, sans-serif" fontSize="9.5" fontWeight="500">
        {[...top, ...bottom].map((c, i) => (
          <text
            key={i}
            x={c.x}
            y={c.y}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${c.rotate} ${c.x} ${c.y})`}
          >
            {c.char}
          </text>
        ))}
      </g>

      {/* Crescent over a vine — the same mark that sits on the label. */}
      <g fill="var(--color-ink)">
        <path
          d="M100 58 a20 20 0 1 0 0 40 a16 16 0 1 1 0-40 Z"
          transform="rotate(-18 100 78)"
        />
        <path
          d="M100 104 q-3 12 0 22"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.6"
        />
        {[
          [88, 112, 0.8],
          [112, 112, 0.8],
          [100, 126, 1],
        ].map(([bx, by, s], gi) =>
          [
            [-1, 0],
            [0, 0],
            [1, 0],
            [-0.5, 1],
            [0.5, 1],
            [0, 2],
          ].map(([c, r], di) => (
            <circle
              key={`${gi}-${di}`}
              cx={bx + c * 5.4 * s}
              cy={by + r * 5 * s}
              r={2.6 * s}
            />
          )),
        )}
      </g>
    </svg>
  );
}
