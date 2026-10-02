import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {brand} from '../lib/content';
import {gsap, lockScroll} from '../lib/scroll';

function Wordmark({tone = 'ink'}: {tone?: 'ink' | 'parchment'}) {
  const color = tone === 'ink' ? 'text-ink' : 'text-parchment';
  return (
    <a href="#top" className={`block leading-none ${color}`} aria-label={`${brand.name} — home`}>
      <span
        className="t-logo block"
        style={{fontSize: 'clamp(15px, 1.5vw, 21px)', letterSpacing: '0.04em'}}
      >
        {brand.name}
      </span>
      <span
        className="mt-[0.35em] block opacity-70"
        style={{fontSize: '0.4375rem', letterSpacing: '0.34em', fontWeight: 500}}
      >
        {brand.sub.toUpperCase()}
      </span>
    </a>
  );
}

function MenuIcon({open}: {open: boolean}) {
  return (
    <span className="relative block h-[11px] w-[17px]" aria-hidden="true">
      <span
        className="absolute left-0 block h-px w-full bg-current transition-all duration-500"
        style={{
          top: open ? '5px' : '0px',
          transform: open ? 'rotate(45deg)' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <span
        className="absolute left-0 top-[5px] block h-px w-full bg-current transition-opacity duration-300"
        style={{opacity: open ? 0 : 1}}
      />
      <span
        className="absolute left-0 block h-px w-full bg-current transition-all duration-500"
        style={{
          top: open ? '5px' : '10px',
          transform: open ? 'rotate(-45deg)' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </span>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="6.4" cy="6.4" r="4.9" stroke="currentColor" strokeWidth="1" />
      <path d="M10.1 10.1L13.6 13.6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** The rail's hairline doubles as the page's progress track. */
function Rail({open, onToggle}: {open: boolean; onToggle: () => void}) {
  const fill = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = fill.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {scaleY: 0},
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.45,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="fixed z-[60] flex flex-col items-center"
      style={{
        left: 'var(--frame)',
        top: 'var(--frame)',
        bottom: 'var(--frame)',
        width: 'var(--rail)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className={`mt-[clamp(26px,3.2vw,44px)] cursor-pointer p-2 transition-colors duration-500 ${
          open ? 'text-parchment' : 'text-ink'
        }`}
      >
        <MenuIcon open={open} />
      </button>

      <button
        type="button"
        aria-label="Search"
        className={`mt-[clamp(14px,1.4vw,20px)] cursor-pointer p-2 transition-colors duration-500 ${
          open ? 'text-parchment' : 'text-ink'
        }`}
      >
        <SearchIcon />
      </button>

      <div className="relative mt-[clamp(16px,2vw,26px)] w-px flex-1 overflow-hidden">
        <div className="hairline absolute inset-0" />
        <div
          ref={fill}
          className="absolute inset-0 origin-top bg-wine"
          style={{transform: 'scaleY(0)'}}
        />
      </div>
    </div>
  );
}

function Overlay({open, onClose}: {open: boolean; onClose: () => void}) {
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  const tl = useRef<gsap.core.Timeline | null>(null);

  // Built once. `fromTo` renders its start state immediately, which doubles as
  // the closed state, so there is nothing to set up separately.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({paused: true})
        .fromTo(sheet.current, {yPercent: -100}, {yPercent: 0, duration: 0.85, ease: 'expo.inOut'})
        .fromTo(
          '.menu-line > span',
          {yPercent: 110},
          {yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.055},
          '-=0.42',
        )
        .fromTo(
          '.menu-meta',
          {opacity: 0, y: 14},
          {opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07},
          '-=0.5',
        );
    }, root);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const t = tl.current;
    if (!t) return;
    // Closing wants to be quicker than opening, or it feels like a stall.
    if (open) t.timeScale(1).play();
    else t.timeScale(1.55).reverse();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[55]"
      style={{pointerEvents: open ? 'auto' : 'none'}}
      aria-hidden={!open}
    >
      <div
        ref={sheet}
        className="absolute inset-0 bg-oxblood"
        style={{transform: 'translateY(-100%)'}}
      >
        <div
          className="flex h-full flex-col justify-between"
          style={{
            padding:
              'calc(var(--frame) + clamp(78px,10vh,130px)) calc(var(--frame) + var(--gutter)) calc(var(--frame) + clamp(28px,4vh,56px)) calc(var(--frame) + var(--rail) + clamp(10px,1.4vw,26px))',
          }}
        >
          <nav>
            <ul className="space-y-[clamp(2px,0.6vh,10px)]">
              {brand.nav.map((item) => (
                <li key={item} className="menu-line overflow-hidden">
                  <span className="block">
                    <a
                      href="#top"
                      onClick={onClose}
                      className="t-display block text-parchment transition-colors duration-500 hover:text-gold"
                      style={{textTransform: 'none'}}
                    >
                      {item}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="menu-meta">
              <p className="t-micro text-gold">Cellar door</p>
              <p className="t-body mt-3 max-w-[30ch] text-parchment/75">
                Thursday to Sunday, eleven until late. Block IX, by the old chapel road.
              </p>
            </div>
            <div className="menu-meta">
              <p className="t-micro text-gold">Written to</p>
              <a
                href="#top"
                className="t-eyebrow mt-2 block text-parchment hover:text-gold"
              >
                hello@nocturne.estate
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Chrome() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  return (
    <>
      <Overlay open={open} onClose={() => setOpen(false)} />

      <Rail open={open} onToggle={() => setOpen((v) => !v)} />

      <header
        className="pointer-events-none fixed z-[60] flex items-start justify-between"
        style={{
          left: 'calc(var(--frame) + var(--rail))',
          right: 'calc(var(--frame) + clamp(14px,1.6vw,26px))',
          top: 'calc(var(--frame) + clamp(22px,2.8vw,38px))',
        }}
      >
        <div className="pointer-events-auto">
          <Wordmark tone={open ? 'parchment' : 'ink'} />
        </div>

        <button
          type="button"
          className="btn-wine pointer-events-auto"
          style={{
            background: open ? 'var(--color-gold)' : undefined,
            color: open ? 'var(--color-oxblood)' : undefined,
          }}
        >
          <span className="t-micro">{brand.cta}</span>
        </button>
      </header>
    </>
  );
}
