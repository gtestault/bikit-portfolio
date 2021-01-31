import React, {useMemo, useRef, useState, Suspense, useCallback, CSSProperties} from 'react';
import logo from './logo.svg';
import './App.css';
import {Canvas, MeshProps, useFrame, useLoader, useThree } from "react-three-fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import src from "./baked.glb"
import {Mesh, Vector3} from "three";
import {useSpring, a, SpringValue, Interpolation, to, interpolate, } from "@react-spring/three";

function App() {
    return (
        <BikeCanvas/>
    );
}
type AnimationFactors =  {top: number, mouse: number[]}
export function BikeCanvas() {

    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
    const onMouseMove = useCallback(({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }), [])
    const onScroll = useCallback(e => set({ top: e.target.scrollTop }), [])

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

/** This component creates a fullscreen colored plane */
function Background({ color } : CSSProperties) {
    const { viewport } = useThree()
    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry attach="geometry" args={[1, 1]} />
            <a.meshBasicMaterial attach="material" color={color} depthTest={false} />
        </mesh>
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
    const positionWizard = (top: number): Vector3 => {
        if (top === 0) {
            return new Vector3(0, 0, 0)
        } else if (top >= scrollMax * 0.25) {
            return new Vector3(0, 0, 30)
        }
        return new Vector3(0, 0, 0)
    }

    return (
        // @ts-ignore
        <a.mesh ref={bikeMesh} position={top.to((top) =>  {return positionWizard(top)})} scale={[1.5, 1.5, 1.5]} rotation={top.to(top => [0, top * 0.0005 , 0 ])}>
            {console.log(top.to(top => top))}
            <primitive object={gltf.scene} position={[0, 0, 0]}/>
        </a.mesh>
    )
}



export default App;
