import {useRef} from 'react';
import {estate} from '../../lib/content';
import {useParallax} from '../../hooks/useReveal';
import {Figure} from '../Figure';
import {Lines, Section} from '../Section';

/**
 * A full-bleed breath between the product and the footer. Padding collapses to
 * the frame so the photograph runs the whole width of the panel.
 */
export function Estate() {
  const image = useRef<HTMLDivElement>(null);
  useParallax(image, {from: 0.1, to: -0.1});

  return (
    <Section
      id="estate"
      className="pt-[clamp(40px,9vh,120px)]"
      style={{paddingLeft: 'var(--frame)', paddingRight: 'var(--frame)'}}
    >
      <div className="relative">
        <div ref={image} className="will-change-transform">
          <Figure
            src="/img/nyc-street.jpg"
            alt="Yellow taxi crossing a lively New York City intersection"
            hint="New York City"
            tone="dark"
            className="aspect-[2/1] w-full"
          />
        </div>

        {/* Ink wash so the type holds whatever the photograph turns out to be. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(23,16,9,0.78) 0%, rgba(23,16,9,0.34) 40%, rgba(23,16,9,0) 74%)',
          }}
          aria-hidden="true"
        />

        <div
          className="absolute bottom-0 left-0 right-0"
          style={{padding: 'clamp(20px, 3.4vw, 60px)'}}
        >
          <p data-reveal className="t-eyebrow text-parchment/85">
            {estate.eyebrow}
          </p>
          <Lines
            lines={estate.headline}
            className="t-display mt-[0.12em] text-parchment"
          />
          <p data-reveal className="t-body mt-[clamp(12px,1.4vw,20px)] max-w-[46ch] text-parchment/80">
            {estate.body}
          </p>
        </div>
      </div>
    </Section>
  );
}
