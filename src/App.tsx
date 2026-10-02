import {Suspense, lazy, useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Chrome} from './components/Chrome';
import {Frame} from './components/Frame';
import {Preloader} from './components/Preloader';
import {Allocation} from './components/sections/Allocation';
import {Estate} from './components/sections/Estate';
import {Finish} from './components/sections/Finish';
import {Footer} from './components/sections/Footer';
import {Hero} from './components/sections/Hero';
import {Notes} from './components/sections/Notes';
import {Pairings} from './components/sections/Pairings';
import {Wine} from './components/sections/Wine';
import {useReducedMotion} from './hooks/useReducedMotion';
import {useRevealSystem} from './hooks/useReveal';
import {probeTextures} from './lib/assets';
import {loadModel} from './lib/model';
import {initPointer} from './lib/pointer';
import {ScrollTrigger, initMotion} from './lib/scroll';

/**
 * three and drei are the bulk of the bundle, so the 3D stage is split out.
 * The frame, the type and the preloader paint from the small entry chunk while
 * it downloads alongside the model.
 */
const Stage = lazy(() => import('./components/Stage'));

export default function App() {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useLayoutEffect(() => {
    probeTextures();
    return initPointer();
  }, []);

  useLayoutEffect(() => initMotion(reduced), [reduced]);

  useEffect(() => {
    let live = true;
    loadModel().then((url) => {
      if (live) setModelUrl(url);
    });
    return () => {
      live = false;
    };
  }, []);

  useRevealSystem(entered);

  // Type and photography both change how tall the page is. Re-measure once
  // they have settled, or every trigger is anchored to the wrong pixel.
  useEffect(() => {
    if (!entered) return;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    const t = window.setTimeout(refresh, 600);
    window.addEventListener('load', refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('load', refresh);
    };
  }, [entered]);

  const onDone = useCallback(() => setEntered(true), []);

  return (
    <>
      <Frame />

      {modelUrl && (
        <Suspense fallback={null}>
          <Stage url={modelUrl} visible={entered} />
        </Suspense>
      )}

      <Chrome />

      <main id="top">
        <Hero entered={entered} />
        <Wine />
        <Finish />
        <Notes />
        <Allocation />
        <Pairings />
        <Estate />
      </main>

      <Footer />

      <Preloader onDone={onDone} />
    </>
  );
}
