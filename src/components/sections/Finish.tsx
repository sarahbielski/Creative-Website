import {useRef} from 'react';
import {finish} from '../../lib/content';
import {useParallax} from '../../hooks/useReveal';
import {Figure} from '../Figure';
import {GiantType} from '../GiantType';
import {Section} from '../Section';

function PlayButton() {
  return (
    <span className="absolute left-1/2 top-1/2 z-[2] flex h-[clamp(44px,4.4vw,64px)] w-[clamp(44px,4.4vw,64px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-wine text-parchment transition-transform duration-500 group-hover:scale-110">
      <svg width="13" height="15" viewBox="0 0 13 15" aria-hidden="true">
        <path
          d="M12 6.63a1 1 0 0 1 0 1.74l-10.5 6A1 1 0 0 1 0 13.5v-12A1 1 0 0 1 1.5.63Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

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
          <a href="#top" className="group block" aria-label="Play: a word from our winemaker">
            <div className="relative">
              <Figure
                src="/img/winemaker.jpg"
                alt="Élise Marchand in the barrel cellar"
                hint="Winemaker portrait"
                className="aspect-[4/3] w-full"
              />
              <PlayButton />
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
