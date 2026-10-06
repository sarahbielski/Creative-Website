/**
 * The bottle, fetched once and by us.
 *
 * Doing the download here rather than inside the 3D layer buys two things:
 * the preloader can report real byte progress without importing three, and
 * three itself never touches the network — it is handed an object URL that is
 * already in memory, so there is no second request and no cache guesswork.
 */

const SOURCE = `${import.meta.env.BASE_URL}img/nyc-patches.png`;

export const modelState = {
  loaded: 0,
  total: 0,
  done: false,
  failed: false,
  /** 0..1. Falls back to a byte estimate when the server omits a length. */
  get progress() {
    if (modelState.done) return 1;
    if (modelState.total > 0) return Math.min(1, modelState.loaded / modelState.total);
    // No content-length (dev server, gzip): approximate against the known size.
    return Math.min(0.92, modelState.loaded / 840_000);
  },
};

let pending: Promise<string | null> | null = null;

export function loadModel(): Promise<string | null> {
  if (pending) return pending;

  pending = (async () => {
    try {
      const res = await fetch(SOURCE);
      if (!res.ok) throw new Error(`Model responded ${res.status}`);

      modelState.total = Number(res.headers.get('content-length')) || 0;

      let blob: Blob;
      if (res.body) {
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        for (;;) {
          const {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          modelState.loaded += value.length;
        }
        blob = new Blob(chunks as BlobPart[]);
      } else {
        const buffer = await res.arrayBuffer();
        modelState.loaded = buffer.byteLength;
        blob = new Blob([buffer]);
      }

      modelState.done = true;
      return URL.createObjectURL(blob);
    } catch {
      // The page is worth more than the bottle: fail quietly and carry on
      // without a 3D stage rather than holding everything up.
      modelState.failed = true;
      modelState.done = true;
      return null;
    }
  })();

  return pending;
}
