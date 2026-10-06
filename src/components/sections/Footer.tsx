import {brand, footer, SHOP_URL} from '../../lib/content';
import {PAD_L, PAD_R} from '../Section';
import {anchor} from '../../lib/scroll';
export function Footer() {
  return <footer id="footer" ref={anchor('footer')} className="relative z-40 mt-20 bg-oxblood text-parchment" style={{paddingLeft:PAD_L,paddingRight:PAD_R,paddingTop:70,paddingBottom:32}}>
    <div className="grid gap-10 lg:grid-cols-2"><div><p className="campaign-kicker mb-5">Next stop: your everyday.</p><h2 className="t-display">Take a little<br/>New York.</h2><p className="t-body text-parchment mt-6 max-w-md">Big plans. Favorite things. A patch set that feels like you.</p><a className="btn-ink mt-8 inline-flex" style={{background:'#ffcf32',color:'#15202a'}} href={SHOP_URL}><span className="t-micro">Shop the NYC Collection</span></a></div>
    <div className="bg-parchment text-ink p-7"><h3 className="t-display-sm mb-7">Before you make it yours</h3>
    <details className="faq"><summary>How do I attach the patches?</summary><p className="t-body-xs">The product listing describes sewing or ironing onto suitable fabrics. Check the patch instructions and the care label on your item before applying heat.</p></details>
    <details className="faq"><summary>Can I use them on laptops or water bottles?</summary><p className="t-body-xs">Try a fabric laptop sleeve, bottle sling, or notebook cover. Direct hard-surface placement would need suitable adhesive purchased separately; included adhesive and water resistance are not verified. Never iron a device or bottle.</p></details>
    <details className="faq"><summary>Do I need a connection to Google?</summary><p className="t-body-xs">No insider story needed for this look. This campaign is for anyone who loves New York and making their things their own.</p></details>
    <details className="faq"><summary>Where can I buy the set?</summary><p className="t-body-xs">Our shop links open the official Google Merch Shop. Search for the New York Campus Patch Set and check current availability, price, and delivery options there.</p></details></div></div>
    <div className="mt-16 border-t border-parchment/30 pt-6 flex flex-wrap justify-between gap-6"><p className="text-sm max-w-2xl">{footer.legal}</p><a href="#top" className="text-sm underline">Back to top</a></div>
    <p className="text-sm mt-5">Product photo: <a className="underline" href="https://your.merch.google/nyc-campus-patch.html">Google Merch Shop</a> · City photo: <a className="underline" href="https://unsplash.com/photos/a-taxi-cab-driving-down-a-street-next-to-tall-buildings-jW310-nIQqo">Y M / Unsplash</a></p>
    <p className="font-display text-[clamp(3rem,13vw,12rem)] leading-none mt-12 text-parchment/25" aria-hidden="true">{brand.founded}</p>
  </footer>;
}
