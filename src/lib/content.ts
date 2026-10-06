/** Campaign copy for the Google x NYC student relaunch concept. */
export const SHOP_URL = 'https://shop.merch.google/';
export const PRODUCT_IMAGE = '/img/nyc-patches.png';
export const brand = {
  name: 'NYC', sub: 'Google x NYC Patch Set', founded: 'NEW YORK, YOUR WAY',
  cta: 'Shop the NYC Collection',
  nav: ['The patch set', 'Why patches?', 'Meet the designs', 'Style it your way', 'The city'],
} as const;
export const navTargets = ['#wine', '#notes', '#alloc', '#pairings', '#estate'];
export const hero = {giant: ['Your city.', 'Your way.'], cue: 'Meet your next everyday obsession'} as const;
export const wine = {
  eyebrow: 'Google x NYC Patch Set', headline: ['Small patches.', 'Big city energy.'],
  body: 'A little New York for the things you take everywhere. Three bold patches turn your everyday essentials into a personal love letter to the city.',
  action: 'Meet the designs',
} as const;
export type Spec = {key: string; label: string; value: string; note: string};
export const specs: Spec[] = [
  {key:'THE SET',label:'Three ways to say New York',value:'03',note:'NYC lettering. A pizza slice. A New York wordmark. Pick your favorite—or go all in.'},
  {key:'THE MOOD',label:'A city that feels like you',value:'NY',note:'For the born-here, moved-here, and wish-I-were-here crowd.'},
  {key:'THE MOVE',label:'Make the everyday personal',value:'YOU',note:'Same backpack. Entirely different energy. No Google connection required.'},
];
export const finish = {
  giant: 'City on repeat', videoCaption: ['From the first lecture', 'to the last slice.'],
  lead: 'Your 9 a.m. class. Your favorite corner. Your way-too-late train home. Take a piece of the city along for all of it.',
  styleHeading:'Not just a souvenir.',
  styleBody:['A tiny detail that says a lot about you. Color, texture, and a little NYC attitude.', 'Google made the patches. You make them yours.'],
} as const;
export type Note = {title:string;body:string;glyph:string;tone:'wine'|'ink'};
export const notes: Note[] = [
  {title:'Stand out.',body:'Give your go-to bag a look that is unmistakably yours. Your style deserves more than the default.',glyph:'01',tone:'wine'},
  {title:'Take NYC along.',body:'Across campus. Across the river. Back home for break. Keep your favorite city close.',glyph:'02',tone:'wine'},
  {title:'Make it a mix.',body:'Go all three on one bag, or spread the city love across your everyday rotation.',glyph:'03',tone:'ink'},
];
export type Format = {id:string;caption:string;detail:string;live?:boolean;src?:string;h:number};
export const allocation = {eyebrow:'Meet your city icons',giant:'Three patches.',giantSub:'All NYC.',formats:[] as Format[]} as const;
export const pairings = {
  eyebrow:'Your stuff. Your signature.',headline:['Style it', 'your way.'],
  body:'Backpacks for the commute. Laptop sleeves for the library. Notebook covers for the next big idea. Your everyday lineup, with a New York accent.',action:'Shop the NYC Collection',
} as const;
export const estate = {eyebrow:'Five boroughs. Endless versions of you.',headline:['You don’t have to', 'be from here.'],body:'You just have to feel it. The late-night slices. The big plans. The city that makes you want to be a little more you.'} as const;
export const footer = {legal:'Independent student marketing concept. Not an official Google campaign. Google and product imagery belong to their respective owners.'} as const;
