import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {useReducedMotion} from '../hooks/useReducedMotion';

const base = `${import.meta.env.BASE_URL}model/confirmed/`;
export default function ConfirmedProduct() {
 const host=useRef<HTMLDivElement>(null), api=useRef<{reset:()=>void;zoom:(factor:number)=>void; touch:(on:boolean)=>void}|null>(null);
 const reduced=useReducedMotion();
 const [state,setState]=useState<'loading'|'ready'|'fallback'>('loading');
 const [following,setFollowing]=useState(true),[touch,setTouch]=useState(false),[staticView,setStaticView]=useState(false);
 const followRef=useRef(true),reducedRef=useRef(reduced),progress=useRef<HTMLDivElement>(null),angle=useRef<HTMLSpanElement>(null);
 useEffect(()=>{followRef.current=following},[following]);
 useEffect(()=>{reducedRef.current=reduced},[reduced]);
 useEffect(()=>{api.current?.touch(touch)},[touch]);
 useEffect(()=>{
  if(staticView){setState('fallback');return;}
  const el=host.current;if(!el)return;
  let disposed=false,renderer:THREE.WebGLRenderer|undefined,controls:OrbitControls|undefined,model:THREE.Object3D|undefined,ro:ResizeObserver|undefined,raf=0;
  const scene=new THREE.Scene(), pivot=new THREE.Group();scene.add(pivot);
  const camera=new THREE.PerspectiveCamera(36,1,.001,20);
  const fail=()=>{if(!disposed)setState('fallback')};
  const contextLost=(e:Event)=>{e.preventDefault();fail()};
  const onVisibility=()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!disposed)raf=requestAnimationFrame(draw)};
  let size=new THREE.Vector3(.45,.24,.1),distance=.8,lastY=-1,lastAngle=0,lastRender=0;
  function fit(){if(!renderer||!controls)return;const w=el!.clientWidth,h=el!.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();const span=Math.max(size.x,size.y,size.z);distance=Math.max(span/(2*Math.tan(THREE.MathUtils.degToRad(18))*camera.aspect),size.y/(2*Math.tan(THREE.MathUtils.degToRad(18))))*1.42;camera.position.set(0,size.y*.13,distance);controls.target.set(0,0,0);controls.minDistance=distance*.65;controls.maxDistance=distance*2;controls.update();}
  function draw(time:number){if(disposed||document.hidden)return;raf=requestAnimationFrame(draw);if(time-lastRender<32)return;lastRender=time;
   const region=document.querySelector('.journey-copy');const total=region?Math.max(1,(region as HTMLElement).offsetHeight-innerHeight*.7):1;const start=region?region.getBoundingClientRect().top+window.scrollY:0;const p=THREE.MathUtils.clamp((window.scrollY-start)/total,0,1);
   if(progress.current)progress.current.style.transform=`scaleX(${p})`;
   if(followRef.current&&!reducedRef.current){const target=-.13+p*Math.PI*2;pivot.rotation.y=THREE.MathUtils.lerp(pivot.rotation.y,target,.16);pivot.rotation.x=.045;}
   if(reducedRef.current&&followRef.current){pivot.rotation.set(0,0,0);}
   if(angle.current)angle.current.textContent=`${Math.round(((pivot.rotation.y*180/Math.PI)%360+360)%360)}°`;
   const moved=controls?.update();if(renderer&&(moved||Math.abs(pivot.rotation.y-lastAngle)>.0001||window.scrollY!==lastY||time<3000)){renderer.render(scene,camera);lastAngle=pivot.rotation.y;lastY=window.scrollY;}
  }
  async function start(){
   try{
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label','Interactive confirmed jewelry organizer');renderer.domElement.setAttribute('role','img');renderer.domElement.addEventListener('webglcontextlost',contextLost);el!.append(renderer.domElement);
    controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.enableZoom=false;controls.enablePan=false;controls.minPolarAngle=.15;controls.maxPolarAngle=Math.PI-.15;
    controls.touches.ONE=THREE.TOUCH.PAN;renderer.domElement.style.touchAction='pan-y';
    controls.addEventListener('start',()=>setFollowing(false));
    controls.addEventListener('change',()=>renderer?.render(scene,camera));
    const manifest=await (await fetch(base+'model-manifest.json')).json();if(manifest.schemaVersion!=='1.0'||manifest.geometryUnits!=='meters')throw Error('Unsupported model units');
    // Manifest describes the confirmed soft studio. Use transparent page background
    // to retain the venture's parchment identity; fit bounds instead of saved zoom.
    scene.add(new THREE.HemisphereLight(0xfff6e8,0x8b7182,manifest.lighting==='soft'?1.6:2));
    const light=new THREE.DirectionalLight(0xffead1,2.5);light.position.set(-.6,1,1);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-.65,right:.65,top:.65,bottom:-.65,near:.01,far:4});light.shadow.bias=-.0003;scene.add(light);const fill=new THREE.DirectionalLight(0xffffff,1.3);fill.position.set(.7,.2,.7);scene.add(fill);
    const gltf=await new GLTFLoader().loadAsync(base+'model.glb');if(disposed){gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose()});return;}
    model=gltf.scene;const bounds=new THREE.Box3().setFromObject(model);size=bounds.getSize(new THREE.Vector3());model.position.sub(bounds.getCenter(new THREE.Vector3()));model.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});pivot.add(model);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.ShadowMaterial({opacity:.12}));floor.rotation.x=-Math.PI/2;floor.position.y=-size.y*.53;floor.receiveShadow=true;scene.add(floor);
    fit();pivot.rotation.set(.045,-.13,0);renderer.render(scene,camera);ro=new ResizeObserver(()=>{fit();renderer?.render(scene,camera)});ro.observe(el!);
    api.current={reset(){setFollowing(false);pivot.rotation.set(0,0,0);fit();renderer?.render(scene,camera)},zoom(f){setFollowing(false);const d=camera.position.clone().sub(controls!.target);d.setLength(THREE.MathUtils.clamp(d.length()*f,controls!.minDistance,controls!.maxDistance));camera.position.copy(controls!.target).add(d);controls!.update();renderer?.render(scene,camera)},touch(on){if(controls&&renderer){controls.touches.ONE=on?THREE.TOUCH.ROTATE:THREE.TOUCH.PAN;renderer.domElement.style.touchAction=on?'none':'pan-y';}}};
    setState('ready');raf=requestAnimationFrame(draw);document.addEventListener('visibilitychange',onVisibility);
   }catch{fail()}
  }
  setState('loading');start();
  return()=>{disposed=true;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',onVisibility);ro?.disconnect();controls?.dispose();renderer?.domElement.removeEventListener('webglcontextlost',contextLost);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of ([] as THREE.Material[]).concat(o.material)){const mat=m as THREE.MeshStandardMaterial;mat.map?.dispose();mat.dispose()}}});renderer?.dispose();renderer?.domElement.remove();api.current=null;};
 },[staticView]);
 return <aside className="journey-product" aria-label="Explore the confirmed 3D organizer">
  <div className="product-caption"><span>YOUR JEWELRY. EVERY ANGLE.</span><span ref={angle} aria-hidden="true">0°</span></div>
  <div className="product-render"><div ref={host} className="product-canvas" hidden={state==='fallback'}/>{state!=='ready'&&<div className="product-fallback"><img src={base+'preview.png'} alt="Confirmed beige organizer, showing necklace clips, earring sections and a center protective page"/><p role="status">{state==='loading'?'Loading your interactive model…':'Static preview · interactive 3D is off or unavailable'}</p></div>}</div>
  <div className="product-controls" aria-label="3D model controls">
   {state==='ready'&&<><button onClick={()=>api.current?.reset()}>Front / Reset</button><button aria-label="Zoom in on organizer" onClick={()=>api.current?.zoom(.85)}>＋</button><button aria-label="Zoom out from organizer" onClick={()=>api.current?.zoom(1.18)}>−</button><button disabled={reduced} aria-pressed={following&&!reduced} onClick={()=>setFollowing(!following)}>{reduced?'Motion reduced':following?'Pause rotation':'Resume scroll rotation'}</button><button className="touch-rotate" aria-pressed={touch} onClick={()=>setTouch(!touch)}>{touch?'Done rotating':'Touch to rotate'}</button></>}
   <button onClick={()=>{setStaticView(!staticView);setTouch(false)}}>{staticView?'Try interactive 3D':'Static preview'}</button>
  </div>
  <p className="product-hint">{state==='ready'?(touch?'Drag the model. Tap “Done rotating” to scroll here.':reduced?'Drag to explore. Automatic rotation is off.':'Scroll to turn · drag to explore · use + / − to zoom'):'The same confirmed design, shown as a still image.'}</p>
  <div className="product-track" aria-hidden="true"><div ref={progress}/></div>
  <p className="product-disclaimer">Concept model · fit, retention and durability require physical testing.</p>
 </aside>
}
