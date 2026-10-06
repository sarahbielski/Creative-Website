import {useTexture} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import {useMemo, useRef} from 'react';
import * as THREE from 'three';
import {samplePose} from '../lib/choreography';
import {pointer} from '../lib/pointer';
import {useReducedMotion} from '../hooks/useReducedMotion';

/** A textured product card in the original fixed 3D stage. Uses the same
 * keyframed / DOM-docked choreography, with the actual product photograph. */
export function Product({url, visible}: {url:string;visible:boolean}) {
  const original = useTexture(url);
  const texture = useMemo(() => {
    const t = original.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    // Crop only the photograph's white margin in UV space, not the artwork.
    t.repeat.set(.516, .81);
    t.offset.set(.235, .112);
    t.needsUpdate = true;
    return t;
  }, [original]);
  const root = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const current = useRef({x:0,y:0,s:1,ry:0,rz:0,key:''});
  useFrame((state, delta) => {
    if (!root.current) return;
    const pose=samplePose();
    const camera=state.camera as THREE.PerspectiveCamera;
    const h=2*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*camera.position.z;
    const target={x:(pose.sx-.5)*h*camera.aspect,y:(.5-pose.sy)*h,s:pose.hFrac*h/18.9*(pose.key==='track' ? .72 : .85),ry:(pose.rotY-Math.PI)*.35,rz:pose.rotZ*.5};
    const c=current.current;
    const snap=reduced||c.key!==pose.key;
    const k=snap?1:1-Math.exp(-12*Math.min(delta,.05));
    c.x=THREE.MathUtils.lerp(c.x,target.x,k); c.y=THREE.MathUtils.lerp(c.y,target.y,k);
    c.s=THREE.MathUtils.lerp(c.s,target.s,k); c.ry=THREE.MathUtils.lerp(c.ry,target.ry,k);c.rz=THREE.MathUtils.lerp(c.rz,target.rz,k);c.key=pose.key;
    root.current.position.set(c.x,c.y,0);root.current.scale.setScalar(c.s);
    root.current.rotation.set(reduced?0:pointer.y*.025,c.ry+(reduced?0:pointer.x*.04),c.rz);
  });
  return <group ref={root} visible={visible}>
    <mesh position={[.35,-.35,-.1]}><planeGeometry args={[12.05,18.9]}/><meshBasicMaterial color="#15202a" transparent opacity={.17}/></mesh>
    <mesh><planeGeometry args={[12.05,18.9]}/><meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide}/></mesh>
  </group>;
}
