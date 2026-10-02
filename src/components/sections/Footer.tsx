import {brand, footer} from '../../lib/content';
import {PAD_L, PAD_R} from '../Section';
import {anchor} from '../../lib/scroll';

/**
 * An oxblood block at the foot of the parchment panel — the frame closing over
 * the page rather than the page simply running out.
 */
export function Footer() {
  return (
    <footer
      id="footer"
      ref={anchor('footer')}
      className="relative mt-[clamp(48px,10vh,140px)] bg-oxblood text-parchment"
      style={{
        zIndex: 40,
        marginLeft: 'var(--frame)',
        marginRight: 'var(--frame)',
        paddingLeft: PAD_L,
        paddingRight: PAD_R,
        paddingTop: 'clamp(44px, 7vh, 96px)',
        paddingBottom: 'clamp(24px, 4vh, 52px)',
      }}
    >
      <div className="grid grid-cols-1 gap-[clamp(28px,4vw,64px)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 data-reveal className="t-display-sm text-parchment">
            {footer.newsletter.title}
          </h2>
          <p data-reveal className="t-body mt-[clamp(10px,1.2vw,18px)] max-w-[38ch] text-parchment/75">
            {footer.newsletter.body}
          </p>

          <form
            data-reveal
            className="mt-[clamp(16px,2vw,28px)] flex max-w-[26rem] items-center gap-0 border-b border-parchment/30 pb-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="nl">
              {footer.newsletter.placeholder}
            </label>
            <input
              id="nl"
              type="email"
              required
              placeholder={footer.newsletter.placeholder}
              className="t-body min-w-0 flex-1 border-0 bg-transparent text-parchment outline-none placeholder:text-parchment/45"
            />
            <button type="submit" className="t-micro cursor-pointer px-2 text-gold hover:text-parchment">
              {footer.newsletter.action}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1" aria-hidden="true" />

        {footer.columns.map((col) => (
          <nav key={col.title} className="min-w-[8rem] lg:col-span-2">
            <h3 data-reveal className="t-micro text-gold">
              {col.title}
            </h3>
            <ul className="mt-[clamp(10px,1.2vw,18px)] space-y-[0.55em]">
              {col.links.map((link) => (
                <li key={link} data-reveal>
                  <a
                    href="#top"
                    className="t-body text-parchment/75 transition-colors duration-300 hover:text-parchment"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-[clamp(36px,6vh,88px)] h-px w-full bg-parchment/20" />

      <div className="mt-[clamp(16px,2.4vh,30px)] flex flex-wrap items-end justify-between gap-6">
        <p className="t-body-xs max-w-[46ch] text-parchment/55">{footer.legal}</p>
        <p className="t-micro text-parchment/45">
          © {new Date().getFullYear()} {brand.name} {brand.sub} — {brand.founded}
        </p>
      </div>

      <p
        className="pointer-events-none mt-[clamp(20px,4vh,54px)] select-none font-display uppercase leading-[0.8] text-parchment/10"
        style={{fontSize: 'clamp(3.5rem, 19vw, 21rem)', letterSpacing: '-0.01em'}}
        aria-hidden="true"
      >
        {brand.name}
      </p>
    </footer>
  );
}
