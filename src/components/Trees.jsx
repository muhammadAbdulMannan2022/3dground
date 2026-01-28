import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

function Trees() {
  // Tree positions: [x, z, scale, type]
  const treeConfig = [
    // --- FLANKING DRIVEWAY TREES (Only for outer houses at +/- 35) ---
    
    // North Side Driveways (Z < 0)
    // Left of Driveway (Offset -8)
    [-43, -16, 1, "pine"], [27, -16, 1, "pine"],
    // Right of Driveway (Offset +8)
    [-27, -16, 1, "pine"], [43, -16, 1, "pine"],
    
    // South Side Driveways (Z > 0)
    // Left of Driveway
    [-43, 16, 1, "pine"], [27, 16, 1, "pine"],
    // Right of Driveway
    [-27, 16, 1, "pine"], [43, 16, 1, "pine"],

    // West Side Driveways (X < 0)
    // Top of Driveway (Offset -8)
    [-16, -43, 1, "oak"], [-16, 27, 1, "oak"],
    // Bottom of Driveway (Offset +8)
    [-16, -27, 1, "oak"], [-16, 43, 1, "oak"],

    // East Side Driveways (X > 0)
    // Top of Driveway
    [16, -43, 1, "oak"], [16, 27, 1, "oak"],
    // Bottom of Driveway
    [16, -27, 1, "oak"], [16, 43, 1, "oak"],
    
    // --- ROAD LINING TREES ---
    // Horizontal Road (Z=0) - Skip +/- 35 Driveway intersections width 20 (25 to 45 is unsafe)
    // Safes: +/- 10, +/- 20. 
    // Unsafe: +/- 35. Driveway extends X = +/- 35. Width 4. (33 to 37).
    // Tree at X= +/- 25 is safe.
    // Tree at X= +/- 45 is safe (Past driveway).
    [-25, -10, 1, "pine"], [-15, -10, 0.9, "pine"], [15, -10, 0.9, "pine"], [25, -10, 1, "pine"], 
    [-25, 10, 0.9, "pine"], [-15, 10, 0.9, "pine"], [15, 10, 0.9, "pine"], [25, 10, 1.2, "pine"], 
    
    // Vertical Road (X=0) - Skip +/- 35 intersections
    [-10, -25, 1, "oak"], [-10, -15, 0.9, "oak"], [-10, 15, 0.9, "oak"], [-10, 25, 1.2, "oak"], 
    [10, -25, 1.1, "oak"], [10, -15, 0.9, "oak"], [10, 15, 0.9, "oak"], [10, 25, 0.9, "oak"],
  ];

  const PineTree = () => (
    <group>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.6, 2, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <coneGeometry args={[2, 4, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#3d7a37" />
      </mesh>
    </group>
  );

  const OakTree = () => (
    <group>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 2, 8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial color="#4a7023" />
      </mesh>
    </group>
  );

  return (
    <>
      {treeConfig.map((pos, index) => {
        const [x, z, s, type] = pos;
        return (
          <RigidBody key={index} type="fixed" colliders="cuboid" position={[x, -5, z]}>
             <group scale={[s, s, s]}>
                {type === "pine" ? <PineTree /> : <OakTree />}
            </group>
          </RigidBody>
        );
      })}
    </>
  );
}

export default Trees;
