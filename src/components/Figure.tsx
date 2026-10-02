import {useAsset} from '../lib/assets';

type FigureProps = {
  src: string;
  alt: string;
  /** What the placeholder should say it is waiting for. */
  hint?: string;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
  /** `cover` for photography, `contain` for cut-out product shots. */
  fit?: 'cover' | 'contain';
  /** Use `dark` wherever reversed type sits over the image. */
  tone?: 'light' | 'dark';
  /** Cast a silhouette shadow. For cut-outs on a flat ground. */
  shadow?: boolean;
};

/**
 * An image that holds its own space. Until the file exists at `src` the slot
 * renders a drawn plate — ruled, labelled, deliberately part of the design —
 * and crossfades to the photograph the moment one is dropped in.
 */
export function Figure({
  src,
  alt,
  hint,
  className = '',
  imgClassName = '',
  style,
  fit = 'cover',
  tone = 'light',
  shadow = false,
}: FigureProps) {
  const ready = useAsset(src);
  const name = src.split('/').pop();
  const dark = tone === 'dark';
  const rule = dark
    ? 'color-mix(in srgb, var(--color-parchment) 26%, transparent)'
    : 'color-mix(in srgb, var(--color-ink) 22%, transparent)';
  const hair = dark
    ? 'color-mix(in srgb, var(--color-parchment) 11%, transparent)'
    : 'color-mix(in srgb, var(--color-ink) 9%, transparent)';

  return (
    <div
      // The shadow only makes sense once a real cut-out is in; on the drawn
      // placeholder it would just outline a rectangle.
      className={`relative ${shadow && ready ? 'cast-shadow' : 'overflow-hidden'} ${className}`}
      style={style}
    >
      {!ready && (
        <div
          className={`absolute inset-0 ${dark ? 'bg-oxblood' : 'bg-parchment-shade'}`}
          aria-hidden="true"
        >
          <div className="absolute inset-[7px] border border-dashed" style={{borderColor: rule}} />
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke={hair} />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke={hair} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span className={`t-micro ${dark ? 'text-parchment/45' : 'text-ink/45'}`}>
              {hint ?? 'Photography'}
            </span>
            <span className={`t-body-xs ${dark ? 'text-parchment/35' : 'text-ink/35'}`}>{name}</span>
          </div>
        </div>
      )}

      {ready && (
        <img
          src={ready}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`fig-in h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${imgClassName}`}
        />
      )}
    </div>
  );
}
