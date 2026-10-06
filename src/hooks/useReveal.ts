import {useLayoutEffect} from 'react';
import {gsap, ScrollTrigger, view} from '../lib/scroll';

/**
 * One reveal system for the whole page.
 *
 * `[data-reveal]` fades and lifts as it crosses the fold, batched so anything
 * arriving together staggers together. `[data-lines]` runs the masked
 * line-by-line reveal used on display headings. Both are gated on `enabled`
 * so nothing fires while the preloader is still up.
 */
export function useRevealSystem(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('[data-reveal]', {opacity:1,y:0});
      gsap.set('[data-lines] .line-mask > span', {yPercent:0,y:0});
      return;
    }

    const ctx = gsap.context(() => {
      // Start state before any trigger can fire, or elements already past the
      // threshold snap in from nowhere.
      gsap.set('[data-reveal]', {y: 26});

      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
            stagger: 0.075,
            overwrite: true,
          }),
      });

      /**
       * The masked lines start at translateY(105%) from the stylesheet. GSAP
       * reads a stylesheet transform back off the computed matrix, where the
       * percentage has already resolved to pixels — so it records y: 210px and
       * yPercent: 0, and animating yPercent to 0 leaves the pixel offset in
       * place, clipped out of sight forever. Re-assert the start state through
       * GSAP so yPercent is the only thing moving the line.
       *
       * Scoped to [data-lines]: the hero's display type is masked too, but it
       * is driven by the hero's own intro timeline.
       */
      gsap.set('[data-lines] .line-mask > span', {yPercent: 125, y: 0});

      document.querySelectorAll<HTMLElement>('[data-lines]').forEach((heading) => {
        const spans = heading.querySelectorAll('.line-mask > span');
        if (!spans.length) return;
        gsap.to(spans, {
          yPercent: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.085,
          scrollTrigger: {trigger: heading, start: 'top 88%', once: true},
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [enabled]);
}

type ParallaxOptions = {
  /** Offset at the moment the element enters, as a fraction of viewport height. */
  from?: number;
  /** Offset as it leaves. More negative = travels faster than the page. */
  to?: number;
  enabled?: boolean;
};

/**
 * Scrubbed vertical parallax. Values are fractions of viewport height resolved
 * at refresh time, so the effect holds its proportions at any window size.
 */
export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  {from = 0.12, to = -0.12, enabled = true}: ParallaxOptions = {},
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {y: () => view.h * from},
        {
          y: () => view.h * to,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [ref, from, to, enabled]);
}
