import { Grid } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

function Ground() {
  const [gr1, gr2] = useLoader(THREE.TextureLoader, ["/gr1.jpg", "/gr2.jpg"]);

  // Texture settings
  gr1.wrapS = gr1.wrapT = THREE.RepeatWrapping;
  gr1.repeat.set(20, 20);
  
  gr2.wrapS = gr2.wrapT = THREE.RepeatWrapping;
  gr2.repeat.set(50, 2);

  return (
    <>
      {/* Physics ground - main surface with gr1 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial map={gr1} roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Roads - Horizontal road */}
      <mesh position={[0, -4.98, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 8]} />
        <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
      </mesh>

      {/* Road - Vertical road */}
      <mesh position={[0, -4.97, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 100]} />
        <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
      </mesh>

      {/* Road markings - Horizontal center line */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`h-${i}`}
          position={[i * 12 - 54, -4.95, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[6, 0.2]} />
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Road markings - Vertical center line */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`v-${i}`}
          position={[0, -4.95, i * 12 - 54]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.2, 6]} />
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Driveways - North Side (Z < 0) */}
      {[ -35, 35 ].map((x, i) => (
         <mesh key={`drive-n-${i}`} position={[x, -4.96, -12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[4, 16]} />
            <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
         </mesh>
      ))}
      {/* Driveways - South Side (Z > 0) */}
      {[ -35, 35 ].map((x, i) => (
         <mesh key={`drive-s-${i}`} position={[x, -4.96, 12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[4, 16]} />
            <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
         </mesh>
      ))}

      {/* Driveways - West Side (X < 0) - Only at ends to avoid intersection clash */}
      {[ -35, 35 ].map((z, i) => (
         <mesh key={`drive-w-${i}`} position={[-12, -4.96, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[16, 4]} />
            <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
         </mesh>
      ))}

      {/* Driveways - East Side (X > 0) */}
      {[ -35, 35 ].map((z, i) => (
         <mesh key={`drive-e-${i}`} position={[12, -4.96, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[16, 4]} />
            <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
         </mesh>
      ))}

      {/* Boundary walls - Invisible tall physics barriers with visible low curbs */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, 50]}>
        <CuboidCollider args={[50, 20, 0.5]} />
        <mesh position={[0, -4.5, 0]} receiveShadow>
          <boxGeometry args={[100, 1, 1]} />
          <meshStandardMaterial map={gr2} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[0, 0, -50]}>
        <CuboidCollider args={[50, 20, 0.5]} />
        <mesh position={[0, -4.5, 0]} receiveShadow>
          <boxGeometry args={[100, 1, 1]} />
          <meshStandardMaterial map={gr2} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[50, 0, 0]}>
        <CuboidCollider args={[0.5, 20, 50]} />
        <mesh position={[0, -4.5, 0]} receiveShadow>
          <boxGeometry args={[1, 1, 100]} />
          <meshStandardMaterial map={gr2} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[-50, 0, 0]}>
         <CuboidCollider args={[0.5, 20, 50]} />
        <mesh position={[0, -4.5, 0]} receiveShadow>
          <boxGeometry args={[1, 1, 100]} />
          <meshStandardMaterial map={gr2} />
        </mesh>
      </RigidBody>
    </>
  );
}

export default Ground;
