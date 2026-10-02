import {useGLTF} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import {useEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {samplePose} from '../lib/choreography';
import {createLabelTexture} from '../lib/label';
import {pointer} from '../lib/pointer';
import {createBottleShadow} from '../lib/shadow';

/** Measured off the glb: the bottle runs y 0 → 18.9, so its centre is 9.45. */
const BOTTLE_H = 18.9;
const BOTTLE_CY = 9.45;

const MESH = {
  body: 'pasted__polySurface1_pasted__pasted__standardSurface3_0',
  capsule: 'pasted__polySurface2_pasted__pasted__standardSurface4_0',
  label: 'pasted__pasted__polySurface2_pasted__pasted__Label_0',
} as const;

const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));

export function Product({url, visible}: {url: string; visible: boolean}) {
  const {scene, materials} = useGLTF(url);

  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const shadowMat = useRef<THREE.MeshBasicMaterial>(null);



  /**
   * Pull geometry straight off the loaded scene rather than trusting the
   * node-name map — this glb came out of Maya via FBX and the names are ugly.
   */
  const parts = useMemo(() => {
    const map = new Map<string, THREE.BufferGeometry>();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) map.set(o.name, mesh.geometry);
    });
    return map;
  }, [scene]);

  const labelTexture = useMemo(() => createLabelTexture(), []);

  /**
   * The bottle's own outline, blurred — not a blob. Built from the geometry so
   * it matches the silhouette exactly, and rebuilt only if the model changes.
   */
  const cast = useMemo(
    () => createBottleShadow([parts.get(MESH.body), parts.get(MESH.capsule)]),
    [parts],
  );

  const mats = useMemo(() => {
    // The capsule keeps its own map: deep red foil over the dark glass of the
    // neck, and the map is what draws the line between the two.
    const source = materials['pasted__pasted__standardSurface4'] as
      | THREE.MeshStandardMaterial
      | undefined;
    const capsuleMap = source?.map ?? null;
    if (capsuleMap) capsuleMap.colorSpace = THREE.SRGBColorSpace;

    /**
     * A wine bottle is not see-through, and transmission over a transparent
     * canvas has nothing behind it to refract — it comes out muddy. So this is
     * opaque dark-green glass with a hard clearcoat, which is what a bottle
     * under studio light actually looks like: black in the body, green at the
     * edges where the rim lights catch it.
     */
    const body = new THREE.MeshPhysicalMaterial({
      color: '#0d2117',
      metalness: 0,
      roughness: 0.085,
      clearcoat: 1,
      clearcoatRoughness: 0.045,
      side: THREE.DoubleSide,
      envMapIntensity: 1.3,
    });

    const capsule = new THREE.MeshStandardMaterial({
      map: capsuleMap,
      color: capsuleMap ? '#ffffff' : '#5c0f1e',
      metalness: 0.6,
      roughness: 0.3,
      side: THREE.DoubleSide,
      envMapIntensity: 1.25,
    });

    // The label sits only 0.015 units proud of a 2.3-unit radius, which is
    // inside the depth buffer's noise floor at this camera distance. Offset it
    // rather than let it fight the glass.
    const label = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.78,
      metalness: 0,
      side: THREE.DoubleSide,
      envMapIntensity: 0.6,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });

    return {body, capsule, label};
  }, [materials, labelTexture]);

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      labelTexture.dispose();
      cast.texture.dispose();
    },
    [mats, labelTexture, cast],
  );

  // Damped state, kept out of React entirely.
  const now = useRef({x: 0, y: 0, s: 1, rotY: Math.PI, rotZ: 0, rotX: 0, shadow: 1});
  const lastKey = useRef<string>('');

  useFrame((state, delta) => {
    const group = root.current;
    const spinGroup = spin.current;
    if (!group || !spinGroup) return;

    const dt = Math.min(delta, 1 / 30);
    const pose = samplePose();

    const cam = state.camera as THREE.PerspectiveCamera;
    // Visible extents on the z = 0 plane, so screen fractions map to world units.
    const worldH = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * cam.position.z;
    const worldW = worldH * cam.aspect;

    const targetScale = (pose.hFrac * worldH) / BOTTLE_H;
    const targetX = (pose.sx - 0.5) * worldW;
    const targetY = (0.5 - pose.sy) * worldH;

    // A breath of idle drift, so it is never completely inert.
    const t = state.clock.elapsedTime;
    const idle = Math.sin(t * 0.55) * 0.16 + Math.sin(t * 0.31) * 0.09;

    const s = now.current;

    if (lastKey.current !== pose.key) {
      // Either the first frame, or the bottle has just been handed to a slot
      // that may be viewports away. Snap rather than fly it across the screen.
      const first = lastKey.current === '';
      lastKey.current = pose.key;
      s.x = targetX;
      s.y = targetY;
      s.s = first ? targetScale * 0.94 : targetScale;
      s.rotY = pose.rotY + (first ? 0.45 : 0);
      s.rotZ = pose.rotZ;
      s.shadow = pose.shadow;
    }

    s.x = damp(s.x, targetX, 14, dt);
    s.y = damp(s.y, targetY + idle * targetScale * 0.04, 14, dt);
    s.s = damp(s.s, targetScale, 14, dt);
    // Rotation lags a touch behind position. That lag is what reads as weight.
    s.rotY = damp(s.rotY, pose.rotY + pointer.x * 0.06, 9, dt);
    s.rotZ = damp(s.rotZ, pose.rotZ, 9, dt);
    s.rotX = damp(s.rotX, pointer.y * 0.04, 7, dt);
    s.shadow = damp(s.shadow, pose.shadow, 10, dt);

    group.position.set(s.x, s.y, 0);
    group.scale.setScalar(s.s);
    group.rotation.set(s.rotX, 0, s.rotZ);
    spinGroup.rotation.y = s.rotY;

    if (shadow.current && shadowMat.current) {
      shadowMat.current.opacity = s.shadow * 0.9;
      shadow.current.visible = s.shadow > 0.02;
    }
  });

  const geo = (name: string) => parts.get(name);

  return (
    <group ref={root} visible={visible}>
      {/*
        The cast shadow rides position, scale and tilt, but must not spin with
        the label — so it lives on the outer group, not the spin group. Sat
        behind the bottle and thrown right and slightly down.
      */}
      <mesh
        ref={shadow}
        position={[cast.width * 0.2, cast.centerY - BOTTLE_CY - cast.height * 0.03, -5]}
        scale={[cast.width, cast.height, 1]}
        renderOrder={-1}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={shadowMat}
          map={cast.texture}
          transparent
          depthWrite={false}
          opacity={0.9}
        />
      </mesh>

      <group ref={spin} position={[0, -BOTTLE_CY, 0]}>
        {geo(MESH.body) && <mesh geometry={geo(MESH.body)} material={mats.body} />}
        {geo(MESH.capsule) && <mesh geometry={geo(MESH.capsule)} material={mats.capsule} />}
        {geo(MESH.label) && (
          <mesh geometry={geo(MESH.label)} material={mats.label} renderOrder={2} />
        )}
      </group>
    </group>
  );
}
