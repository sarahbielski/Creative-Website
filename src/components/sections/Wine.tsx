import {specs, wine} from '../../lib/content';
import {Lines, Section} from '../Section';
import {SpecCard} from '../SpecCard';

/**
 * Text down the left, analysis down the right, the bottle pinned in the gap
 * between them. The columns are narrow on purpose — the empty middle third is
 * what the product occupies.
 */
export function Wine() {
  return (
    <Section id="wine" className="flex min-h-screen items-center">
      <div className="grid w-full grid-cols-1 gap-[clamp(28px,4vw,64px)] lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p data-reveal className="t-eyebrow text-ink/80">
            {wine.eyebrow}
          </p>

          <Lines lines={wine.headline} className="t-display mt-[clamp(10px,1.2vw,18px)] text-ink" />

          <p data-reveal className="t-body mt-[clamp(16px,1.8vw,26px)] max-w-[38ch]">
            {wine.body}
          </p>

          <a href="#alloc" data-reveal className="btn-ink mt-[clamp(20px,2.4vw,34px)]">
            <span className="t-micro">{wine.action}</span>
          </a>
        </div>

        {/* The empty middle is the bottle's. */}
        <div className="hidden lg:col-span-4 lg:block" aria-hidden="true" />

        <div className="lg:col-span-4">
          <SpecCard specs={specs} />
        </div>
      </div>
    </Section>
  );
}
