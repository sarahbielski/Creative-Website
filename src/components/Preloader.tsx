import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {brand} from '../lib/content';
import {modelState} from '../lib/model';
import {gsap, lockScroll} from '../lib/scroll';

const MIN_MS = 1150;

/**
 * Holds the page until the model and the typefaces are actually in, then lifts
 * off as a single oxblood curtain. `onDone` fires partway through the lift so
 * the hero has already started moving by the time it is uncovered.
 */
export function Preloader({onDone}: {onDone: () => void}) {
  const [fontsDone, setFontsDone] = useState(false);
  const [modelDone, setModelDone] = useState(false);
  const [gone, setGone] = useState(false);

  const curtain = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const shown = useRef(0);
  const startedAt = useRef(0);
  const played = useRef(false);
  const sawModel = useRef(false);

  useLayoutEffect(() => {
    startedAt.current = performance.now();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    lockScroll(true);
  }, []);

  useEffect(() => {
    let done = false;
    document.fonts?.ready
      .then(() => !done && setFontsDone(true))
      .catch(() => !done && setFontsDone(true));
    // Never let a font CDN hold the whole page hostage.
    const bail = setTimeout(() => !done && setFontsDone(true), 3500);
    return () => {
      done = true;
      clearTimeout(bail);
    };
  }, []);

  // Ease the readout toward the real figure rather than snapping between the
  // handful of values a chunked download actually reports. The same loop polls
  // the model, which lives outside React.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (modelState.done && !sawModel.current) {
        sawModel.current = true;
        setModelDone(true);
      }

      const bytes = modelState.progress * 100;
      const target = fontsDone ? bytes : Math.min(bytes, 88);
      shown.current += (target - shown.current) * 0.08;

      const v = Math.min(100, Math.round(shown.current));
      if (counter.current) counter.current.textContent = String(v).padStart(3, '0');
      if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fontsDone]);

  // If the model 404s or the network stalls, the page still opens.
  const [forced, setForced] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForced(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (played.current) return;
    if (!forced && (!modelDone || !fontsDone)) return;

    const wait = Math.max(0, MIN_MS - (performance.now() - startedAt.current));

    // The guard lives inside the timeout, not around the effect: strict mode
    // mounts, tears down and remounts, and a guard set on the first pass would
    // make the second pass bail and strand the curtain up.
    const timer = setTimeout(() => {
      if (played.current) return;
      played.current = true;
      lockScroll(false);
      gsap
        .timeline({onComplete: () => setGone(true)})
        .to('[data-pre-fade]', {opacity: 0, y: -14, duration: 0.5, ease: 'power2.in', stagger: 0.04})
        .to(curtain.current, {yPercent: -100, duration: 1.15, ease: 'expo.inOut'}, '-=0.2')
        // Hand over while the curtain is still travelling, so the hero type is
        // already rising by the time the page is uncovered.
        .call(onDone, undefined, '-=0.78');
    }, wait);

    return () => clearTimeout(timer);
  }, [modelDone, fontsDone, forced, onDone]);

  if (gone) return null;

  return (
    <div
      ref={curtain}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-oxblood"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div data-pre-fade className="text-center">
        <p
          className="t-logo block leading-none text-parchment"
          style={{fontSize: 'clamp(2rem, 7vw, 5.5rem)', letterSpacing: '0.02em'}}
        >
          {brand.name}
        </p>
        <p className="t-micro mt-[1.1em] text-gold">{brand.sub}</p>
      </div>

      <div data-pre-fade className="mt-[clamp(28px,5vh,56px)] w-[min(260px,42vw)]">
        <div className="h-px w-full overflow-hidden bg-parchment/25">
          <div ref={bar} className="h-full w-full origin-left bg-gold" style={{transform: 'scaleX(0)'}} />
        </div>
        <p className="t-micro mt-3 flex justify-between text-parchment/60">
          <span>Decanting</span>
          <span ref={counter}>000</span>
        </p>
      </div>
    </div>
  );
}
