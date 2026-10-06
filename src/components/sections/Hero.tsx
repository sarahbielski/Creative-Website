import {useLayoutEffect, useRef} from 'react';
import {hero} from '../../lib/content';
import {anchor, gsap, scrollTo} from '../../lib/scroll';
import {GiantType} from '../GiantType';
import {Section} from '../Section';

/**
 * Deliberately shorter than the viewport: the wine section's headline and
 * analysis card should already be cut off at the fold on first paint, exactly
 * as they are in the reference, so the first scroll reveals rather than loads.
 */
export function Hero({entered}: {entered: boolean}) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!entered) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({defaults: {ease: 'expo.out'}})
        // y: 0 on both ends clears the pixel offset GSAP parses out of the
        // stylesheet's translateY(105%); without it yPercent alone cannot
        // bring the line back into its mask.
        .fromTo(
          '[data-intro-line]',
          {yPercent: 135, y: 0},
          {yPercent: 0, y: 0, duration: 1.35, stagger: 0.095},
        )
        .fromTo(
          '[data-intro-seal]',
          {opacity: 0, scale: 0.86, rotate: -14},
          {opacity: 1, scale: 1, rotate: 0, duration: 1.5},
          '-=1.1',
        )
        .fromTo(
          '[data-intro-fade]',
          {opacity: 0, y: 18},
          {opacity: 1, y: 0, duration: 1.05, stagger: 0.09},
          '-=1.15',
        );
    }, root);

    return () => ctx.revert();
  }, [entered]);

  return (
    <Section
      id="hero"
      z={10}
      className="flex min-h-[98vh] flex-col justify-center"
      style={{
        // The display type sits low on purpose, so it crosses the pinned
        // bottle nearer its waist than its shoulder. The block itself is a bit
        // over half the viewport tall, so the top padding is what places it.
        paddingTop: 'clamp(180px, 22vh, 240px)',
        paddingBottom: 'clamp(28px, 6vh, 80px)',
        paddingRight: 'calc(var(--frame) + clamp(16px, 2.4vw, 46px))',
      }}
    >
      <div ref={root} className="relative">
        <p data-intro-fade className="campaign-kicker hero-kicker">Google x NYC Patch Set · A little city. A lot of you.</p>
        <GiantType
          as="h1"
          lines={hero.giant}
          masked
          align="center"
          from={0}
          to={0}
          fill={0.995}
        />

        {/*
          Below `lg` the columns stack and there is no empty middle to stand
          in, so the bottle comes into the flow here instead of being pinned
          over the copy. display:none above `lg` zeroes the rect, which is how
          the choreography knows to ignore it.
        */}
        <div
          ref={anchor('slot-hero')}
          className="mt-[clamp(16px,4vh,40px)] h-[52vh] w-full lg:hidden"
          aria-hidden="true"
        />

        <div data-intro-fade className="hero-intro">
          <p className="t-body">Turn everyday essentials into your own little piece of New York.</p>
          <a className="btn-ink mt-5 inline-flex" href="#alloc"><span className="t-micro">Shop the NYC Collection</span></a>
        </div>
        <button
          type="button"
          data-intro-fade
          onClick={() => scrollTo('#wine')}
          className="group absolute -bottom-[56px] left-0 flex cursor-pointer items-center gap-3 text-ink"
        >
          <span className="relative block h-[26px] w-px overflow-hidden bg-ink/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.4s_ease-in-out_infinite] bg-ink" />
          </span>
          <span className="t-micro">{hero.cue}</span>
        </button>
      </div>
    </Section>
  );
}
