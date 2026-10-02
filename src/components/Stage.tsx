import {Environment, Lightformer} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {Suspense} from 'react';
import * as THREE from 'three';
import {Product} from './Product';

/**
 * The bottle never scrolls — the canvas is fixed and full-bleed, and the
 * choreography poses the model inside it. That sidesteps DOM pinning entirely,
 * so there is nothing to jump, reflow or fight with the smooth scroller.
 */
export function Stage({url, visible}: {url: string; visible: boolean}) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{fov: 28, position: [0, 0, 65], near: 1, far: 400}}
        onCreated={({gl}) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <Suspense fallback={null}>
          <Product url={url} visible={visible} />

          {/*
            No HDRI fetch: the environment is built from emissive cards, which
            keeps the studio look entirely local and lets us aim every
            highlight on the glass by hand. Rendered once — nothing here moves.
          */}
          <Environment resolution={256} frames={1}>
            <color attach="background" args={['#1b1410']} />

            {/* Key: a big soft bank, high and to the left. */}
            <Lightformer
              form="rect"
              intensity={5.2}
              color="#fff6ea"
              position={[-16, 12, 14]}
              rotation={[0, Math.PI / 3.1, 0]}
              scale={[22, 26, 1]}
            />
            {/* Rim: narrow and hot, behind on the right, to light the edges. */}
            <Lightformer
              form="rect"
              intensity={6}
              color="#ffffff"
              position={[15, 6, -12]}
              rotation={[0, -Math.PI / 2.4, 0]}
              scale={[2.6, 30, 1]}
            />
            {/* A second, softer rim on the left shoulder. */}
            <Lightformer
              form="rect"
              intensity={3.2}
              color="#ffe9d2"
              position={[-13, 2, -12]}
              rotation={[0, Math.PI / 2.4, 0]}
              scale={[1.6, 24, 1]}
            />
            {/* Warm bounce off the parchment the bottle appears to stand on. */}
            <Lightformer
              form="rect"
              intensity={1.5}
              color="#f4eee3"
              position={[0, -14, 8]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[30, 20, 1]}
            />
            {/* Overall lift so the dark glass reads as glass, not silhouette. */}
            <Lightformer
              form="ring"
              intensity={0.9}
              color="#c8b49a"
              position={[0, 4, 26]}
              scale={[26, 26, 1]}
            />
          </Environment>

          <ambientLight intensity={0.32} color="#f3e6d6" />
          <directionalLight position={[-14, 16, 12]} intensity={1.25} color="#fff3e2" />
          <directionalLight position={[12, 4, -10]} intensity={0.75} color="#ffd9b8" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Stage;
