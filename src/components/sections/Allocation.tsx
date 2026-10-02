import type {CSSProperties} from 'react';
import {allocation} from '../../lib/content';
import {anchor} from '../../lib/scroll';
import {Figure} from '../Figure';
import {Spill} from '../Spill';
import {Section} from '../Section';

/**
 * Where the bottle stops being the hero and becomes one of the formats.
 *
 * The live slot is an empty, bottom-aligned box in the row. The choreography
 * reads its rect every frame and flies the model into it, which means the dock
 * lands correctly at any viewport width without a single tuned number — and
 * keeps tracking the row as it scrolls away afterwards.
 *
 * Every item is [box of height h][caption]. Bottom-aligning the list therefore
 * lines the captions up *and* stands all five products on the same floor.
 */
export function Allocation() {
  return (
    <Section id="alloc" className="relative flex min-h-screen flex-col justify-center">
      <Spill
        index={3}
        tone="ink"
        opacity={0.92}
        from={0.34}
        to={-0.3}
        className="pointer-events-none hidden lg:absolute lg:block"
        style={{right: '-4%', top: '-14%', width: 'clamp(220px, 26vw, 400px)'}}
      />

      <div className="relative text-center">
        <p data-reveal className="t-eyebrow text-ink/80">
          {allocation.eyebrow}
        </p>
        <h2 data-reveal className="t-display mt-[0.1em] text-ink">
          {allocation.giant} <span className="text-wine">{allocation.giantSub}</span>
        </h2>
      </div>

      <ul
        className="mt-[clamp(26px,5vh,64px)] flex w-full items-end justify-center gap-[clamp(6px,2.4vw,44px)]"
        style={{'--row': 'clamp(104px, 24vh, 292px)'} as CSSProperties}
      >
        {allocation.formats.map((format) => {
          const height = `calc(var(--row) * ${format.h})`;

          return (
            <li key={format.id} className="flex min-w-0 flex-1 flex-col items-center">
              {format.live ? (
                /* Deliberately empty — the live model occupies this box. */
                <div ref={anchor('slot')} className="w-full" style={{height}} />
              ) : (
                <Figure
                  src={format.src!}
                  alt={`${format.caption} — ${format.detail}`}
                  hint={format.caption}
                  fit="contain"
                  shadow
                  className="w-full"
                  imgClassName="object-bottom"
                  style={{height}}
                />
              )}

              <p data-reveal className="t-micro mt-[clamp(10px,1.4vw,20px)] text-center text-ink">
                {format.caption}
              </p>
              <p data-reveal className="t-body-xs mt-[3px] text-center">
                {format.detail}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
