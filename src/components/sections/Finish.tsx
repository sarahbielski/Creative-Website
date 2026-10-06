import {useRef} from 'react';
import {finish} from '../../lib/content';
import {useParallax} from '../../hooks/useReveal';
import {Figure} from '../Figure';
import {GiantType} from '../GiantType';
import {Section} from '../Section';

/**
 * The tasting section. One enormous word runs the width of the panel with the
 * bottle standing in the middle of it, splitting it — the strongest gesture in
 * the reference, and the reason the product sits on top of the type rather
 * than behind it.
 */
export function Finish() {
  const video = useRef<HTMLDivElement>(null);
  useParallax(video, {from: 0.15, to: -0.17});

  return (
    <Section id="finish" className="flex min-h-[125vh] flex-col justify-center">
      <GiantType lines={[finish.giant]} decorative align="center" from={0.28} to={-0.36} />

      <div className="mt-[clamp(26px,5vh,72px)] grid w-full grid-cols-1 items-start gap-[clamp(28px,4vw,64px)] lg:grid-cols-12">
        <div ref={video} className="lg:col-span-4">
          <a href="#pairings" className="group block" aria-label="Explore ways to style the patches">
            <div className="relative">
              <Figure
                src="/img/nyc-street.jpg"
                alt="Yellow taxi on a New York City street"
                hint="NYC street scene"
                className="aspect-[4/3] w-full"
              />

            </div>
          </a>

          <p className="t-eyebrow mt-[clamp(10px,1.1vw,16px)] text-ink/80">
            {finish.videoCaption.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        {/* The empty middle is the bottle's. */}
        <div className="hidden lg:col-span-4 lg:block" aria-hidden="true" />

        <div className="lg:col-span-4">
          <p data-reveal className="t-body max-w-[40ch]">
            {finish.lead}
          </p>

          <h3 data-reveal className="t-display-sm mt-[clamp(20px,2.4vw,34px)] text-ink">
            {finish.styleHeading}
          </h3>

          {finish.styleBody.map((para) => (
            <p
              key={para}
              data-reveal
              className="t-body-xs mt-[clamp(10px,1.1vw,16px)] max-w-[44ch]"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
