import {useEffect, useState} from 'react';

/**
 * Art direction is finished before the photography is. Every image on the site
 * is optional: we try to load it, and until it exists the layout holds its
 * exact space with a drawn placeholder instead of a broken icon.
 */

const assetUrl = (src: string) => src.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src;

const results = new Map<string, Promise<boolean>>();

export function probe(src: string): Promise<boolean> {
  let p = results.get(src);
  if (!p) {
    p = new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth > 0);
      img.onerror = () => resolve(false);
      img.src = assetUrl(src);
    });
    results.set(src, p);
  }
  return p;
}

/** Returns the src once it has actually decoded, or null. */
export function useAsset(src?: string): string | null {
  const [ready, setReady] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;
    let live = true;
    probe(src).then((ok) => {
      if (live && ok) setReady(assetUrl(src));
    });
    return () => {
      live = false;
    };
  }, [src]);

  return ready;
}

/**
 * The two seamless textures are used from CSS, which cannot fall back on its
 * own — a missing mask image would paint a solid block over the type. So we
 * probe them here and only then let the stylesheet reach for them.
 */
export function probeTextures() {
  const root = document.documentElement;
  probe('/img/texture-grit.png').then((ok) => ok && root.classList.add('has-grit'));
  probe('/img/texture-paper.jpg').then((ok) => ok && root.classList.add('has-paper'));
}
