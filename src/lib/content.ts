/**
 * Every word on the site lives here. Sections read from this file so the copy
 * can be rewritten without touching a single layout or motion decision.
 */

export const brand = {
  name: 'Nocturne',
  sub: 'Estate & Cellars',
  founded: 'MCMVIII',
  cta: 'Reserve a case',
  nav: ['The Wine', 'The Estate', 'Cellar Door', 'Allocation', 'Journal'],
} as const;

export const hero = {
  // Two short lines on purpose. Every line is fitted to the panel, so fewer
  // characters means a bigger face — which is where the reference gets its
  // weight from.
  giant: ['Cabernet', 'Sauvignon'],
  cue: 'Scroll to decant',
} as const;

export const wine = {
  eyebrow: 'Single vineyard, Block ix',
  headline: ['Reserve', 'MMXVIII'],
  body: 'Nocturne Reserve comes off two and a half hectares of forty-year-old vines on the cool eastern slope of Block IX, picked in three passes across nine nights in March. Fermented on native yeast in open oak, basket-pressed, then left alone for twenty-two months in French barrique — a third of it new. Unfined, unfiltered, bottled by gravity.',
  action: 'Add to cellar',
} as const;

export type Spec = {
  key: string;
  label: string;
  value: string;
  note: string;
};

export const specs: Spec[] = [
  {
    key: 'ABV',
    label: 'Alcohol by volume',
    value: '14.5%',
    note: 'Warm but composed. The fruit carries the alcohol rather than the other way round.',
  },
  {
    key: 'OAK',
    label: 'Months in French barrique',
    value: '22',
    note: 'One third new Allier, the rest second and third fill. Coopered in Burgundy, toasted long and low.',
  },
  {
    key: 'PH',
    label: 'Total acidity 5.9 g/L',
    value: '3.62',
    note: 'Cold nights hold the line. This is a wine built to sit in a dark room for a decade.',
  },
];

export const finish = {
  giant: 'Long Finish',
  videoCaption: ['Hear it from our winemaker,', 'Élise Marchand'],
  lead: 'Dense and unhurried. It opens on black fruit — cassis, damson, the skin of a bruised plum — then turns savoury: graphite, dried bay, the inside of a cigar box. The tannin is fine-grained and arrives late, drawing the finish out well past a minute.',
  styleHeading: 'Style',
  styleBody: [
    'In the old classification this would sit somewhere between claret and cult — too structured to drink young, too generous to keep waiting on. We make nine hundred cases and we do not make more.',
    'Serve at sixteen degrees, in a glass with room to breathe. Decant an hour ahead. Open the second bottle before you finish the first.',
  ],
} as const;

export type Note = {
  title: string;
  body: string;
  glyph: string;
  tone: 'wine' | 'ink';
};

export const notes: Note[] = [
  {
    title: 'Blackcurrant',
    body: 'Cassis and damson skin, picked at the last possible moment before the acid drops away.',
    glyph: '✦',
    tone: 'wine',
  },
  {
    title: 'Violet — Iris',
    body: 'A floral top note that only shows up twenty minutes into the glass. Wait for it.',
    glyph: '❈',
    tone: 'wine',
  },
  {
    title: 'Cedar — Clove',
    body: 'Twenty-two months in Allier oak. Cigar box, dried bay, a thread of sweet spice underneath it all.',
    glyph: '❖',
    tone: 'ink',
  },
];

export type Format = {
  id: string;
  caption: string;
  detail: string;
  /** The live 3D bottle docks into this slot instead of loading an image. */
  live?: boolean;
  src?: string;
  /** Height as a fraction of the lineup row, so the family scales together. */
  h: number;
};

export const allocation = {
  eyebrow: 'Allocation:',
  giant: 'Nine Hundred',
  giantSub: 'Cases',
  formats: [
    { id: 'crate', caption: 'Original wood', detail: 'Twelve', src: '/img/format-crate.png', h: 0.52 },
    { id: 'magnum', caption: '1.5L magnum', detail: 'Forty made', src: '/img/format-magnum.png', h: 0.98 },
    { id: 'bottle', caption: '750ml', detail: 'The release', live: true, h: 0.82 },
    { id: 'half', caption: '375ml half', detail: 'Cellar door only', src: '/img/format-half.png', h: 0.6 },
    { id: 'case', caption: 'Six-bottle case', detail: 'Sealed', src: '/img/format-case.png', h: 0.46 },
  ] as Format[],
} as const;

export const pairings = {
  eyebrow: 'At the table',
  headline: ['Wine speaks.', 'Tables listen.'],
  body: 'It wants fat and salt and time. Rib of beef over coals, bone marrow on burnt toast, a hard sheep cheese at the end of the night. Skip anything delicate — this wine will simply talk over it.',
  action: 'See the pairings',
} as const;

export const estate = {
  eyebrow: 'The estate',
  headline: ['Nine nights', 'of picking'],
  body: 'Block IX sits four hundred metres up, facing east, on a seam of decomposed granite thin enough to keep the vines honest. Everything is picked at night and in the dark, into small crates, by the same twenty people who have done it for eleven years.',
} as const;

export const footer = {
  columns: [
    { title: 'Visit', links: ['Cellar door', 'Tastings', 'The long table', 'Find us'] },
    { title: 'Buy', links: ['Allocation list', 'Trade enquiries', 'Stockists', 'Gift a case'] },
    { title: 'Read', links: ['Journal', 'Vintage notes', 'Press', 'Our practice'] },
  ],
  newsletter: {
    title: 'The allocation list',
    body: 'One letter a year, sent the week the wine is released. Nothing else, ever.',
    placeholder: 'Your email',
    action: 'Join',
  },
  legal: 'Please enjoy responsibly. You must be of legal drinking age in your country to purchase.',
} as const;
