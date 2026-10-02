import type {Spec} from '../lib/content';

/**
 * The ruled analysis card. Big Didone figures against very small notes — the
 * same tension the display type sets up, at a tenth of the size.
 */
export function SpecCard({specs, rows}: {specs: Spec[]; rows?: number}) {
  const shown = rows ? specs.slice(0, rows) : specs;

  return (
    <div
      data-reveal
      className="relative bg-parchment"
      style={{border: '1px solid color-mix(in srgb, var(--color-ink) 45%, transparent)'}}
    >
      <div className="px-[clamp(18px,1.9vw,32px)] py-[clamp(18px,1.9vw,30px)]">
        {shown.map((spec, i) => (
          <div key={spec.key} className={i > 0 ? 'mt-[clamp(20px,2.2vw,32px)]' : undefined}>
            <p className="t-micro text-ink">{spec.key}</p>
            <p className="t-body-xs mt-[2px] text-ink/55">{spec.label}</p>

            {/* The reference rules under the label, not between the rows. */}
            <div
              className="mt-[clamp(7px,0.8vw,12px)] h-px w-full"
              style={{background: 'color-mix(in srgb, var(--color-ink) 28%, transparent)'}}
            />

            <div className="mt-[clamp(8px,0.9vw,14px)] flex items-start gap-[clamp(12px,1.4vw,22px)]">
              <p className="t-figure shrink-0 text-ink">{spec.value}</p>
              <p className="t-body-xs max-w-[24ch] pt-[2px]">
                {spec.note}{' '}
                <a href="#top" className="link-rule t-micro ml-[2px] align-baseline">
                  Read more
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
