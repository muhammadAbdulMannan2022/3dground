import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

const MOVE_SPEED = 3;
const JUMP_FORCE = 4;
const BLOCK_SIZE = 1;
const MAX_REACH = 5;

export default function Player() {
  const rb = useRef();
  const playerGroup = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();

  const [, getKeys] = useKeyboardControls();
  const [cameraMode, setCameraMode] = useState("third-person");
  const [walkCycle, setWalkCycle] = useState(0);
  const [targetBlock, setTargetBlock] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [isPunching, setIsPunching] = useState(false);
  const [punchAnimation, setPunchAnimation] = useState(0);

  const { camera, scene } = useThree();
  const raycaster = new THREE.Raycaster();

  useFrame((state, delta) => {
    if (!rb.current) return;

    const { forward, backward, left, right, jump, run } = getKeys();

    const speed = run ? MOVE_SPEED * 1.5 : MOVE_SPEED;
    const isMoving = forward || backward || left || right;

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

    // Rotate player to face movement direction
    if (playerGroup.current && isMoving) {
      const angle = Math.atan2(direction.x, direction.z);
      playerGroup.current.rotation.y = angle;
    }

    // Punch animation
    if (isPunching) {
      setPunchAnimation((prev) => {
        const newVal = prev + delta * 15;
        if (newVal >= Math.PI) {
          setIsPunching(false);
          return 0;
        }
        return newVal;
      });

      if (rightArm.current) {
        rightArm.current.rotation.x = -Math.sin(punchAnimation) * 1.5;
        rightArm.current.position.z = -Math.sin(punchAnimation) * 0.3;
      }
    } else if (isMoving) {
      // Walking animation
      setWalkCycle((prev) => prev + delta * 10);

      const swing = Math.sin(walkCycle) * 0.5;

      if (leftArm.current) leftArm.current.rotation.x = swing;
      if (rightArm.current) {
        rightArm.current.rotation.x = -swing;
        rightArm.current.position.z = 0;
      }

      if (leftLeg.current) leftLeg.current.rotation.x = -swing;
      if (rightLeg.current) rightLeg.current.rotation.x = swing;
    } else {
      // Reset to neutral
      if (leftArm.current) leftArm.current.rotation.x *= 0.9;
      if (rightArm.current && !isPunching) {
        rightArm.current.rotation.x *= 0.9;
        rightArm.current.position.z = 0;
      }
      if (leftLeg.current) leftLeg.current.rotation.x *= 0.9;
      if (rightLeg.current) rightLeg.current.rotation.x *= 0.9;
    }

    // Jumping
    if (jump && Math.abs(velocity.y) < 0.1) {
      rb.current.setLinvel(
        { x: velocity.x, y: JUMP_FORCE, z: velocity.z },
        true,
      );
    }

    // Camera follow
    const translation = rb.current.translation();

    if (cameraMode === "first-person") {
      state.camera.position.set(
        translation.x,
        translation.y + 0.6,
        translation.z,
      );
    } else {
      const cameraOffset = new THREE.Vector3(0, 2, 5);
      cameraOffset.applyEuler(state.camera.rotation);

      state.camera.position.set(
        translation.x + cameraOffset.x,
        translation.y + 2,
        translation.z + cameraOffset.z,
      );

      state.camera.lookAt(translation.x, translation.y + 0.5, translation.z);
    }

    // Raycast for block targeting
    raycaster.setFromCamera(new THREE.Vector2(0, 0), state.camera);

    let closestBlock = null;
    let closestDistance = MAX_REACH;

    blocks.forEach((block) => {
      const blockBox = new THREE.Box3(
        new THREE.Vector3(
          block.position[0] - BLOCK_SIZE / 2,
          block.position[1] - BLOCK_SIZE / 2,
          block.position[2] - BLOCK_SIZE / 2,
        ),
        new THREE.Vector3(
          block.position[0] + BLOCK_SIZE / 2,
          block.position[1] + BLOCK_SIZE / 2,
          block.position[2] + BLOCK_SIZE / 2,
        ),
      );

      const intersection = new THREE.Vector3();
      const hit = raycaster.ray.intersectBox(blockBox, intersection);

      if (hit) {
        const distance = state.camera.position.distanceTo(intersection);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestBlock = block;
        }
      }
    });

    setTargetBlock(closestBlock);
  });

  // Handle camera switch and block actions
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "c" || e.key === "C") {
        setCameraMode((prev) =>
          prev === "first-person" ? "third-person" : "first-person",
        );
      }
    };

    const handleMouseDown = (e) => {
      // Left click - Place block
      if (e.button === 0) {
        // Get camera direction
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        // Place block at a reasonable distance in front
        const placeDistance = 3;
        const rawPosition = new THREE.Vector3(
          camera.position.x + direction.x * placeDistance,
          camera.position.y + direction.y * placeDistance,
          camera.position.z + direction.z * placeDistance,
        );

        // Snap to grid
        const newPosition = [
          Math.round(rawPosition.x),
          Math.round(rawPosition.y),
          Math.round(rawPosition.z),
        ];

        const colors = ["#8B4513", "#228B22", "#A0522D", "#CD853F", "#DEB887"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newBlock = {
          id: Date.now(),
          position: newPosition,
          color: randomColor,
        };

        setBlocks((prev) => [...prev, newBlock]);
      }
      // Right click - Remove block (punch animation)
      else if (e.button === 2) {
        e.preventDefault();

        if (targetBlock) {
          setIsPunching(true);
          setPunchAnimation(0);

          // Remove block after short delay (punch animation)
          setTimeout(() => {
            setBlocks((prev) => prev.filter((b) => b.id !== targetBlock.id));
          }, 150);
        }
      }
    };

    const handleContextMenu = (e) => e.preventDefault();

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [targetBlock, camera]);

  return (
    <>
      <RigidBody
        ref={rb}
        enabledRotations={[false, false, false]}
        position={[0, 2, 10]}
      >
        <CapsuleCollider args={[0.5, 0.3]} />

        <group ref={playerGroup}>
          {/* Head */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#ffdbac" />
          </mesh>

          {/* Eyes */}
          <mesh castShadow position={[0.1, 0.65, 0.25]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh castShadow position={[-0.1, 0.65, 0.25]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>

          {/* Body */}
          <mesh castShadow position={[0, 0, 0]}>
            <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
            <meshStandardMaterial color="#4a90e2" />
          </mesh>

          {/* Left Arm */}
          <group ref={leftArm} position={[0.4, 0.1, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
              <meshStandardMaterial color="#ffdbac" />
            </mesh>
          </group>

          {/* Right Arm */}
          <group ref={rightArm} position={[-0.4, 0.1, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
              <meshStandardMaterial color="#ffdbac" />
            </mesh>
          </group>

          {/* Left Leg */}
          <group ref={leftLeg} position={[0.15, -0.65, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
              <meshStandardMaterial color="#2c3e50" />
            </mesh>
          </group>

          {/* Right Leg */}
          <group ref={rightLeg} position={[-0.15, -0.65, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
              <meshStandardMaterial color="#2c3e50" />
            </mesh>
          </group>

          {/* Camera mode indicator */}
          {cameraMode === "third-person" && (
            <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.15, 0.2, 16]} />
              <meshBasicMaterial color="#00ff00" side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      </RigidBody>

      {/* Render blocks with physics */}
      {blocks.map((block) => (
        <RigidBody key={block.id} position={block.position} colliders="cuboid">
          <mesh castShadow receiveShadow>
            <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={block.color}
              emissive={targetBlock?.id === block.id ? "#ffffff" : "#000000"}
              emissiveIntensity={targetBlock?.id === block.id ? 0.3 : 0}
            />
          </mesh>
        </RigidBody>
      ))}

      {/* Crosshair - positioned relative to camera */}
      <mesh
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        onUpdate={(self) => {
          // Update crosshair position to follow camera
          const dir = new THREE.Vector3();
          camera.getWorldDirection(dir);
          self.position.copy(camera.position).add(dir.multiplyScalar(0.5));
          self.lookAt(camera.position);
        }}
      >
        <ringGeometry args={[0.008, 0.012, 16]} />
        <meshBasicMaterial
          color={targetBlock ? "#ff0000" : "#ffffff"}
          transparent
          opacity={0.8}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
