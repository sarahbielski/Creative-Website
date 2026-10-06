import {allocation, PRODUCT_IMAGE, SHOP_URL} from '../../lib/content';
import {anchor} from '../../lib/scroll';
import {Section} from '../Section';
export function Allocation() {
  const designs = [{id:'nyc',title:'The hometown shout-out',copy:'Three letters. So much feeling.'},{id:'slice',title:'The late-night favorite',copy:'Always room for one more slice.'},{id:'wordmark',title:'The big city statement',copy:'Say it loud. Say it in color.'}];
  return <Section id="alloc" className="py-24 lg:min-h-screen flex flex-col justify-center">
    <p data-reveal className="campaign-kicker mb-4">{allocation.eyebrow}</p>
    <h2 data-reveal className="t-display mb-12">{allocation.giant} <span className="text-wine">{allocation.giantSub}</span></h2>
    <div className="design-grid">{designs.map(d => <article key={d.id}><div className={`patch-detail ${d.id}`}><img src={`${import.meta.env.BASE_URL}${PRODUCT_IMAGE.slice(1)}`} alt={d.id === 'nyc' ? 'Green and yellow NYC embroidered patch' : d.id === 'slice' ? 'Colorful pizza slice embroidered patch' : 'Blue, red, and white New York embroidered patch'} /></div><h3>{d.title}</h3><p>{d.copy}</p></article>)}
      <article><div ref={anchor('slot')} className="aspect-square w-full" aria-hidden="true"/><h3>The whole city crew</h3><p>All three. One patch set.</p></article>
    </div>
    <div className="mt-12 flex flex-wrap items-center gap-6"><a href={SHOP_URL} className="btn-wine"><span className="t-micro">Shop the NYC Collection</span></a><p className="t-body-xs">Continue to Google Merch Shop for current availability and pricing.</p></div>
  </Section>;
}
