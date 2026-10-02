import {useRef} from 'react';
import {pairings} from '../../lib/content';
import {useParallax} from '../../hooks/useReveal';
import {Figure} from '../Figure';
import {Lines, Section} from '../Section';

export function Pairings() {
  const photo = useRef<HTMLDivElement>(null);
  useParallax(photo, {from: 0.1, to: -0.1});

  return (
    <Section id="pairings" className="flex min-h-[85vh] items-center">
      <div className="grid w-full grid-cols-1 items-center gap-[clamp(24px,4vw,70px)] lg:grid-cols-12">
        <div ref={photo} className="lg:col-span-6">
          <Figure
            src="/img/pairing.jpg"
            alt="Rib of beef, bone marrow butter and a glass of Nocturne Reserve"
            hint="Table, overhead"
            className="aspect-[3/2] w-full"
          />
        </div>

        <div className="lg:col-span-6 lg:pl-[clamp(0px,2.4vw,52px)]">
          <p data-reveal className="t-eyebrow text-ink/80">
            {pairings.eyebrow}
          </p>

          <Lines
            lines={pairings.headline}
            className="t-display mt-[clamp(8px,1vw,16px)] text-ink"
          />

          <p data-reveal className="t-body mt-[clamp(14px,1.6vw,24px)] max-w-[40ch]">
            {pairings.body}
          </p>

          <button data-reveal type="button" className="btn-ink mt-[clamp(18px,2.2vw,32px)]">
            <span className="t-micro">{pairings.action}</span>
          </button>
        </div>
      </div>
    </Section>
  );
}
