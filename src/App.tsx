import React, {useRef,  Suspense, useCallback } from 'react';
import './App.css';
import {Canvas, MeshProps, useLoader, useThree } from "react-three-fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import src from "./baked.glb"
import {Mesh } from "three";
import {useSpring, a, SpringValue, } from "@react-spring/three";

function App() {
    return (
        <BikeCanvas/>
    );
}
export function BikeCanvas() {

    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
    const onMouseMove = useCallback(({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }), [set])
    const onScroll = useCallback(e => set({ top: e.target.scrollTop }), [set])

    return (
        <>
            <Canvas className="canvasContainer" camera={{fov: 80, position: [-50, 30, 0]}}>
                <Scene top={top} mouse={mouse}/>
            </Canvas>
            <div className="scrollContainer" onScroll={onScroll} onMouseMove={onMouseMove}>
                <div style={{height:'500vh'}}></div>
            </div>
        </>
    )
}

function Scene({ top , mouse }: {top: SpringValue<number>, mouse: SpringValue<number[]>} ) {
    const { size } = useThree()
    const scrollMax = size.height * 4.5
    return (
        <>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Suspense fallback={null}>
                <BikeIt mouse={mouse} top={top} scrollMax={scrollMax}/>
            </Suspense>
        </>
    )
}


type BikeItProps = {
    top: SpringValue<number>
    mouse: SpringValue<number[]>
    scrollMax: number
}
const BikeIt: React.FC<BikeItProps & MeshProps> = ({top, mouse, scrollMax}) => {
    const gltf: any = useLoader(GLTFLoader, src)
    const bikeMesh = useRef<Mesh>()
/*
    const positionWizard = (top: number): Vector3 => {
        if (top === 0) {
            return new Vector3(0, 0, 0)
        } else if (top >= scrollMax * 0.25) {
            return new Vector3(0, 0, 30)
        }
        return new Vector3(0, 0, 0)
    }
*/

    return (
        // @ts-ignore
        <a.mesh ref={bikeMesh} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]} rotation={top.to(top => [0, top * 0.0005 , 0 ])}>
            <primitive object={gltf.scene} position={[0, 0, 0]}/>
        </a.mesh>
    )
}



export default App;
