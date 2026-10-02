import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * One smoothed scroll position and one set of viewport dimensions, read every
 * frame by the 3D stage. Kept as plain mutable objects on purpose: the product
 * choreography must never cause a React render.
 */
export const view = {w: 0, h: 0};
export const scroll = {y: 0};

/**
 * Sections register themselves by name so the choreography can talk about
 * "the middle of the tasting section" instead of a magic pixel offset.
 */
const anchors = new Map<string, HTMLElement>();
const metrics = new Map<string, {top: number; height: number}>();

/** `ref={anchor('finish')}` — measured on every ScrollTrigger refresh. */
export function anchor(id: string) {
  return (el: HTMLElement | null) => {
    if (el) anchors.set(id, el);
    else anchors.delete(id);
  };
}

export function anchorEl(id: string) {
  return anchors.get(id) ?? null;
}

export function measure() {
  view.w = window.innerWidth;
  view.h = window.innerHeight;
  const sy = window.scrollY;
  for (const [id, el] of anchors) {
    const r = el.getBoundingClientRect();
    metrics.set(id, {top: r.top + sy, height: r.height});
  }
}

const topOf = (id: string) => metrics.get(id)?.top ?? 0;
const heightOf = (id: string) => metrics.get(id)?.height ?? 0;

/** Scroll position at which a section sits vertically centred in the viewport. */
export const centerOf = (id: string) => topOf(id) + heightOf(id) / 2 - view.h / 2;

let lenis: Lenis | null = null;

export function scrollTo(target: string | number, offset = 0) {
  if (lenis) lenis.scrollTo(target, {offset, duration: 1.4});
  else if (typeof target === 'number') window.scrollTo({top: target + offset});
  else document.querySelector(target)?.scrollIntoView();
}

/**
 * The preloader is a child of App, so its layout effect locks the page before
 * `initMotion` has created Lenis. Holding the intent separately and re-applying
 * it means the lock survives that handover either way round.
 */
let wantLock = false;

function applyLock() {
  if (lenis) {
    document.documentElement.style.overflow = '';
    if (wantLock) lenis.stop();
    else lenis.start();
  } else {
    document.documentElement.style.overflow = wantLock ? 'hidden' : '';
  }
}

export function lockScroll(locked: boolean) {
  wantLock = locked;
  applyLock();
}

/**
 * Boots the motion system. Returns a teardown so React strict-mode double
 * mounts do not leave two rAF loops fighting over the scroll position.
 */
export function initMotion(reduced: boolean) {
  measure();
  scroll.y = window.scrollY;

  const onResize = () => {
    measure();
    ScrollTrigger.refresh();
  };
  const onRefresh = () => measure();

  let tick: ((time: number) => void) | null = null;
  let onNativeScroll: (() => void) | null = null;

  if (reduced) {
    // No smoothing, no inertia — just keep the shared state honest.
    onNativeScroll = () => {
      scroll.y = window.scrollY;
    };
    window.addEventListener('scroll', onNativeScroll, {passive: true});
  } else {
    lenis = new Lenis({
      duration: 1.15,
      // Expo-out: catches the wheel hard, releases slowly. This single curve is
      // most of why the whole page feels heavy and expensive rather than floaty.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.7,
      smoothWheel: true,
    });

    lenis.on('scroll', (e: {scroll: number}) => {
      scroll.y = e.scroll;
      ScrollTrigger.update();
    });

    tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }

  ScrollTrigger.addEventListener('refresh', onRefresh);
  window.addEventListener('resize', onResize);

  applyLock();

  // Only now do the reveal start-states apply, so a JS failure leaves a
  // complete, readable page rather than a blank one.
  document.documentElement.dataset.motion = 'on';

  return () => {
    window.removeEventListener('resize', onResize);
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    if (onNativeScroll) window.removeEventListener('scroll', onNativeScroll);
    if (tick) gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
    delete document.documentElement.dataset.motion;
  };
}

export {gsap, ScrollTrigger};
