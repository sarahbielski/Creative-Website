import {notes} from '../../lib/content';
import {Section} from '../Section';
export function Notes() {
  return <Section id="notes" className="py-24 lg:min-h-screen">
    <p className="campaign-kicker mb-12">Good things come in small patches</p>
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-4">{notes.slice(0,2).map(note => <article data-reveal className="benefit-card" key={note.title}><span className="t-micro">{note.glyph} / The upside</span><h3 className="t-display-sm">{note.title}</h3><p className="t-body">{note.body}</p></article>)}</div>
      <div className="hidden lg:block lg:col-span-4" />
      <div className="lg:col-span-4 lg:pt-32"><article data-reveal className="benefit-card"><span className="t-micro">03 / The upside</span><h3 className="t-display-sm">{notes[2].title}</h3><p className="t-body">{notes[2].body}</p></article></div>
    </div>
  </Section>;
}
