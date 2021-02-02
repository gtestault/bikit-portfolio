import React, {useRef, Suspense, useCallback, useEffect, useState} from 'react';
import './App.css';
import {Canvas, Euler, MeshProps, useLoader, useThree} from "react-three-fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import src from "./baked.glb"
import {Mesh, TextureLoader} from "three";
import {useSpring, a, SpringValue,} from "@react-spring/three";
import {MagicSpinner} from "react-spinners-kit";
import {ReactComponent as Logo} from "./logo.svg"
import TunnelPicture from "./assets/pictures/tunnel.jpg"
import {useAspect} from "@react-three/drei";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";

function App() {
    return (
        <BikeCanvas/>
    );
}

const NEON_COLOR = "#f5ff00";

export function BikeCanvas() {

    const [modelLoading, setModelLoading] = useState(true)
    const [showScrollHelp, setShowScrollHelp] = useState(true)
    const [{top, mouse}, set] = useSpring(() => ({top: 0, mouse: [0, 0]}))
    const onMouseMove = useCallback(({clientX: x, clientY: y}) => set({mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2]}), [set])
    const onScroll = useCallback(e => {
        set({top: e.target.scrollTop})
        if (showScrollHelp) {
            setShowScrollHelp(false)
        }
    }, [set, showScrollHelp])
    const handleLoaded = () => {
        setModelLoading(false)
    }

    useEffect(() => {
        if (!modelLoading) {
            setShowScrollHelp(true)
        }
    }, [modelLoading])

    const renderScrollHelp = () => {
        if (modelLoading || !showScrollHelp) {
            return null
        }
        return (
            <>
                <div className="scrollHelpContainer">
                    <p>Scroll down to turn bike</p>
                    <FontAwesomeIcon className="scrollPromptIcon" icon={faChevronDown} color={NEON_COLOR}/>
                </div>
            </>
        )
    }

    return (
        <>
            <Canvas className="canvasContainer">
                <Scene onLoaded={handleLoaded} top={top} mouse={mouse}/>
            </Canvas>
            <div className="loadingSpinner">
                <MagicSpinner sizeUnit="px" size={40} color="#f5ff00" loading={modelLoading}/>
                {modelLoading ? <p>loading bikit</p> : null}

            </div>
            {renderScrollHelp()}
            <div className="logoContainer">
                    <Logo className="bikitLogo"/>
            </div>
            <div className="scrollContainer" onScroll={onScroll} onMouseMove={onMouseMove}>
                <div style={{height: '9000px'}}></div>
            </div>
        </>
    )
}


type SceneProps = {
    top: SpringValue<number>,
    mouse: SpringValue<number[]>
    onLoaded: () => void
}

function Scene({top, mouse, onLoaded}: SceneProps) {
    const {size} = useThree()
    const scrollMax = size.height * 4.5
    // @ts-ignore
    return (
        <>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>


            <Suspense fallback={null}>
                {/*@ts-ignore*/}
                <Image opacity={top.to([6000, 7000], [0, 1])} url={TunnelPicture}/>
            </Suspense>


            {/* @ts-ignore */}
            <Suspense fallback={null}>
                <BikeIt onLoaded={onLoaded} mouse={mouse} top={top} scrollMax={scrollMax}/>
            </Suspense>
        </>
    )
}


type BikeItProps = {
    top: SpringValue<number>
    mouse: SpringValue<number[]>
    scrollMax: number
    onLoaded: () => void
}
const BikeIt: React.FC<BikeItProps & MeshProps> = ({top, mouse, scrollMax, onLoaded}) => {
    const gltf: any = useLoader(GLTFLoader, src)
    useEffect(() => {
        onLoaded()
    }, [gltf, onLoaded])
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
        //@ts-ignore
        <a.mesh ref={bikeMesh} position={[0, -10, -40]} scale={[1, 1, 1]} rotation={top.to<Euler>(top => [0, 1.2 + top * 0.001, 0])}>
            <primitive object={gltf.scene} position={[0, 0, 0]}/>
        </a.mesh>
    )
}
/*

function Text({children, position, opacity, color = 'white', fontSize = 410}: TextProps) {
    const {
        size: {width, height},
        viewport: {width: viewportWidth, height: viewportHeight}
    } = useThree()
    const scale = viewportWidth > viewportHeight ? viewportWidth : viewportHeight
    const canvas = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 2048
        const context = canvas.getContext('2d')
        if (context === null) return
        context.font = `bold ${fontSize}px Roboto, sans-serif`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = color
        context.fillText(children, 1024, 1024 - 410 / 2)
        return canvas
    }, [children, width, height])
    return (
        <a.sprite scale={[scale, scale, 1]} position={position}>
            <a.spriteMaterial attach="material" transparent opacity={opacity}>
                <canvasTexture attach="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)}/>
            </a.spriteMaterial>
        </a.sprite>
    )
}
*/

type ImageProps = {
    url: string,
    opacity: number,
    scale: number[],
}

function Image({url, opacity,}: ImageProps) {
    const texture = useLoader(TextureLoader, url)
    const scale = useAspect(
        "cover",                  // Aspect ratio: cover | ... more to come, PR's welcome ;)
        6960,                     // Pixel-width
        4640,                      // Pixel-height
        0.15                         // Optional scaling factor
    )
    return (
        //@ts-ignore

        <a.mesh scale={scale}>
            <planeBufferGeometry attach="geometry" args={[3, 3]}/>
            {/*@ts-ignore*/}
            <a.meshLambertMaterial transparent opacity={opacity} attach="material" map={texture}/>
        </a.mesh>
    )
}


export default App;
