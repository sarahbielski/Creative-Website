import {useRef} from 'react';
import {pairings, SHOP_URL} from '../../lib/content';
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
            src="/img/nyc-patches.png"
            alt="Google New York Campus Patch Set: NYC, pizza, and New York designs"
            hint="The complete patch set"
            className="aspect-square w-full" fit="contain"
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

          <div className="style-list">
            <div><h3>Backpacks & totes</h3><p>Personalize compatible fabric. Follow the patch and bag care instructions.</p></div>
            <div><h3>Laptops & notebooks</h3><p>Make a fabric laptop sleeve or notebook cover your canvas.</p></div>
            <div><h3>Water bottles</h3><p>Dress up a fabric bottle sling. A little NYC for your daily refill.</p></div>
            <div><h3>More ways to make it yours</h3><p>Try a cap, denim jacket, or pencil pouch. Your rotation, remixed.</p></div>
          </div>
          <a href={SHOP_URL} data-reveal className="btn-ink mt-[clamp(18px,2.2vw,32px)]">
            <span className="t-micro">{pairings.action}</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
