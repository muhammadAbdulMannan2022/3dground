import { useRef } from "react";
import { Canvas, extend } from "@react-three/fiber";
import {
  PointerLockControls,
  Grid,
  OrbitControls,
  KeyboardControls,
} from "@react-three/drei";
import * as THREE from "three";
import { RigidBody, Physics } from "@react-three/rapier";
import Ground from "./components/Ground";
import Player from "./components/Player";
import Trees from "./components/Trees";
import ProceduralHouses from "./components/ProceduralHouses";
import StreetLamps from "./components/StreetLamps";
// Extend Three.js objects if needed (drei handles most)
extend({ PointerLockControls });

export default function App() {
  const canvas = useRef();
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["KeyW", "ArrowUp"] },
        { name: "backward", keys: ["KeyS", "ArrowDown"] },
        { name: "left", keys: ["KeyA", "ArrowLeft"] },
        { name: "right", keys: ["KeyD", "ArrowRight"] },
        { name: "jump", keys: ["Space"] },
        { name: "run", keys: ["ShiftLeft"] },
      ]}
    >
      <Canvas
        ref={canvas}
        style={{ height: "100vh", width: "100vw" }}
        camera={{ position: [0, -1, 20], fov: 75 }}
      >
        <ambientLight intensity={0.3} />

        {/* Sun with glow effect */}
        <group position={[50, 50, 25]}>
          {/* Directional light attached to sun */}
          <directionalLight
            intensity={1.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />

          {/* Core sun sphere */}
          <mesh>
            <sphereGeometry args={[5, 32, 32]} />
            <meshStandardMaterial
              color="#FDB813"
              emissive="#FDB813"
              emissiveIntensity={2}
            />
          </mesh>

          {/* Outer glow halo */}
          <mesh>
            <sphereGeometry args={[7, 32, 32]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
          </mesh>
        </group>

        <Physics gravity={[0, -9.81, 0]}>
          {/* <Box position={[0, 5, 0]} /> */}
          <Player />
          <Ground />
          <Trees />
          <ProceduralHouses />
          <StreetLamps />
          {/* <TowerHouses/> */}
        </Physics>
        <PointerLockControls />
        {/* <OrbitControls /> */}
      </Canvas>
    </KeyboardControls>
  );
}
