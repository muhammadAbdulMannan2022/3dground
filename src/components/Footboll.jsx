import React from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

function Goal({ zPosition, direction }) {
  //   direction = +1 or -1 (which side net opens)
  zPosition = direction > 0 ? zPosition - 9.5 : zPosition + 8.5;
  return (
    <group>
      {/* Left Post (now at lower Z) */}
      <RigidBody type="fixed">
        <mesh
          position={[direction > 0 ? -30 : -48, -5 + 1.2, zPosition - 2]}
          castShadow
        >
          <boxGeometry args={[0.15, 1.8, 0.15]} />
          <meshStandardMaterial
            color="#eeeeee"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </RigidBody>

      {/* Right Post (now at higher Z) */}
      <RigidBody type="fixed">
        <mesh
          position={[direction > 0 ? -30 : -48, -5 + 1.2, zPosition + 2]}
          castShadow
        >
          <boxGeometry args={[0.15, 1.8, 0.15]} />
          <meshStandardMaterial
            color="#eeeeee"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </RigidBody>

      {/* Crossbar */}
      <RigidBody type="fixed">
        <mesh
          position={[direction > 0 ? -30 : -48, -5 + 2.1, zPosition]}
          castShadow
        >
          <boxGeometry args={[0.15, 0.15, 4]} />
          <meshStandardMaterial
            color="#eeeeee"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </RigidBody>

      {/* Net collider (invisible) */}
      <RigidBody
        type="fixed"
        position={[
          direction > 0 ? -30 : -48 + direction * 0.8,
          -5 + 1.2,
          zPosition,
        ]}
      >
        <mesh>
          <boxGeometry args={[0.1, 1.8, 4]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>

      <mesh
        position={[
          direction > 0 ? -29.5 : -48 + direction * 0.9,
          -5 + 1.2,
          zPosition,
        ]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[4, 1.8]} />
        <meshStandardMaterial
          color="#aaddff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}
function FieldLines() {
  const y = -5 + 0.26;
  const cx = -39;
  const cz = -39;

  return (
    <group>
      {/* Center line (ACROSS field — X axis) */}
      <mesh position={[cx, y, cz]}>
        <boxGeometry args={[0.2, 0.02, 15]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Center circle */}
      <mesh position={[cx, y, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.7, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[cx, y, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Top boundary (ACROSS field) */}
      <mesh position={[cx, y, cz - 7.5]}>
        <boxGeometry args={[20, 0.02, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Bottom boundary (ACROSS field) */}
      <mesh position={[cx, y, cz + 7.5]}>
        <boxGeometry args={[20, 0.02, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Left boundary (ALONG field — Z axis) */}
      <mesh position={[cx - 10, y, cz]}>
        <boxGeometry args={[0.1, 0.02, 15]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Right boundary (ALONG field) */}
      <mesh position={[cx + 10, y, cz]}>
        <boxGeometry args={[0.1, 0.02, 15]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

export default function Footboll() {
  const turfTexture = useTexture("/gr2.jpg");

  turfTexture.wrapS = turfTexture.wrapT = THREE.RepeatWrapping;
  turfTexture.repeat.set(3, 3); // adjust repeat to look good on 20x20 field
  turfTexture.anisotropy = 16;
  return (
    <>
      <Physics gravity={[0, -9.81, 0]}>
        {/* Your original ground - position & size fixed */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow position={[-39, -5, -39]}>
            <boxGeometry args={[20, 0.5, 15]} />
            <meshStandardMaterial map={turfTexture} roughness={0.9} />
          </mesh>
        </RigidBody>
        <FieldLines />

        <Goal zPosition={-48} direction={-1} />

        <Goal zPosition={-30} direction={1} />
        {/* <PerimeterNet /> */}
      </Physics>
    </>
  );
}
