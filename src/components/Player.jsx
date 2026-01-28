import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const MOVE_SPEED = 3;
const JUMP_FORCE = 4;

export default function Player() {
  const rb = useRef();
  const [, getKeys] = useKeyboardControls();
  const { world } = useRapier();

  useFrame((state) => {
    if (!rb.current) return;

    const { forward, backward, left, right, jump, run } = getKeys();

    const speed = run ? MOVE_SPEED  : MOVE_SPEED* 1.5;

    // Get camera directions
    const frontVector = new THREE.Vector3(
      0,
      0,
      Number(backward) - Number(forward),
    );
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);
    const direction = new THREE.Vector3();

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(state.camera.rotation);

    // Set velocity
    const velocity = rb.current.linvel();
    rb.current.setLinvel(
      { x: direction.x, y: velocity.y, z: direction.z },
      true,
    );

    // Jumping
    if (jump && Math.abs(velocity.y) < 0.1) {
      rb.current.setLinvel(
        { x: velocity.x, y: JUMP_FORCE, z: velocity.z },
        true,
      );
      console.log("Player jumped!");
    }

    // Logging movement
    if (forward || backward || left || right) {
      console.log(
        `Player moving: ${forward ? "Forward " : ""}${backward ? "Backward " : ""}${left ? "Left " : ""}${right ? "Right " : ""}`,
      );
    }

    // Camera follow
    const translation = rb.current.translation();
    state.camera.position.set(
      translation.x,
      translation.y + 1.5,
      translation.z,
    );
  });

  return (
    <RigidBody
      ref={rb}
      colliders="ball"
      enabledRotations={[false, false, false]}
      position={[0, 2, 10]}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="dodgerblue" />
      </mesh>
    </RigidBody>
  );
}
