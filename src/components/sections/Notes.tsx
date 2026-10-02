import type {CSSProperties} from 'react';
import {useRef} from 'react';
import {notes} from '../../lib/content';
import {useParallax} from '../../hooks/useReveal';
import {Figure} from '../Figure';
import {Section} from '../Section';
import {Spill} from '../Spill';
import {Stain} from '../Stain';

/**
 * Flavour notes spilled across the panel. Each blot drifts at its own rate, so
 * the group reads as something that landed there rather than as a row.
 *
 * Laid out down both edges with the middle third left clear — that column
 * belongs to the bottle, which is pinned over it. Below `lg` the positioning is
 * dropped and everything stacks, because at that width the bottle is docked
 * into the flow elsewhere and is not here at all.
 */
type Placement = {
  left?: string;
  right?: string;
  top: string;
  width: string;
  from: number;
  to: number;
};

const PLACEMENT: Placement[] = [
  {left: '-2%', top: '1%', width: 'clamp(250px, 30vw, 470px)', from: 0.2, to: -0.28},
  {left: '11%', top: '39%', width: 'clamp(225px, 27vw, 420px)', from: 0.07, to: -0.13},
  {right: '-2%', top: '18%', width: 'clamp(255px, 31vw, 480px)', from: 0.25, to: -0.33},
];

export function Notes() {
  const pour = useRef<HTMLDivElement>(null);
  useParallax(pour, {from: 0.06, to: -0.12});

  return (
    <Section id="notes" className="py-[clamp(56px,9vh,110px)] lg:min-h-[158vh] lg:py-0">
      <div className="relative flex flex-col gap-[clamp(44px,7vh,86px)] lg:block lg:min-h-[158vh]">
        <h2 className="t-micro text-ink/45 lg:absolute lg:left-0 lg:top-0">Tasting notes</h2>

        {/* A real spill, bleeding in behind the notes. */}
        <Spill
          index={1}
          tone="wine"
          opacity={0.9}
          from={0.3}
          to={-0.38}
          className="hidden lg:absolute lg:block"
          style={{right: '3%', top: '60%', width: 'clamp(200px, 24vw, 370px)'}}
        />

        {notes.map((note, i) => {
          const p = PLACEMENT[i];
          return (
            <Stain
              key={note.title}
              note={note}
              index={i}
              from={p.from}
              to={p.to}
              className="w-full lg:absolute lg:w-[var(--stain-w)]"
              style={
                {left: p.left, right: p.right, top: p.top, '--stain-w': p.width} as CSSProperties
              }
            />
          );
        })}

        <div
          ref={pour}
          className="mx-auto w-full max-w-[300px] lg:absolute lg:mx-0 lg:w-[var(--pour-w)] lg:max-w-none"
          style={{left: '-1%', top: '66%', '--pour-w': 'clamp(180px, 20vw, 320px)'} as CSSProperties}
        >
          <Figure
            src="/img/pour.png"
            alt="A glass of Nocturne Reserve, poured"
            hint="Poured glass, cut out"
            fit="contain"
            shadow
            className="aspect-[3/4] w-full"
          />
        </div>
      </div>
    </Section>
  );
}
