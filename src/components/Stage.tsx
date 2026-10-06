import {Canvas} from '@react-three/fiber';
import {Suspense} from 'react';
import {Product} from './Product';
/** Retains the fixed canvas and responsive DOM docking from the template. */
export function Stage({url,visible}:{url:string;visible:boolean}) {
  return <div className="pointer-events-none fixed inset-0 z-30" aria-hidden="true"><Canvas dpr={[1,1.75]} gl={{antialias:true,alpha:true}} camera={{fov:28,position:[0,0,65],near:1,far:400}}><Suspense fallback={null}><Product url={url} visible={visible}/></Suspense></Canvas></div>;
}
export default Stage;
