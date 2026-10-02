import type {CSSProperties} from 'react';
import {useRef} from 'react';
import {useAsset} from '../lib/assets';
import {useParallax} from '../hooks/useReveal';

type SpillProps = {
  /** 1-3, matching /img/stain-N.png */
  index: number;
  tone?: 'wine' | 'ink';
  opacity?: number;
  from?: number;
  to?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * A photographed wine stain used as what it actually is — a spill mark.
 *
 * These carry no type, so the ring-and-splatter silhouette that made them
 * unusable behind a note is exactly right here. Applied as a CSS mask so the
 * colour comes from the palette, and simply absent until the file exists.
 */
export function Spill({
  index,
  tone = 'wine',
  opacity = 1,
  from = 0.16,
  to = -0.22,
  className = '',
  style,
}: SpillProps) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, {from, to});

  const photo = useAsset(`/img/stain-${index}.png`);
  if (!photo) return null;

  return (
    <div ref={ref} className={className} style={style} aria-hidden="true">
      <div
        className="fig-in w-full"
        style={{
          aspectRatio: '3 / 2',
          opacity,
          backgroundColor: tone === 'wine' ? 'var(--color-wine)' : 'var(--color-ink)',
          WebkitMaskImage: `url(${photo})`,
          maskImage: `url(${photo})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    </div>
  );
}
