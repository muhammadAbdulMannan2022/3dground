import { RigidBody } from "@react-three/rapier";

function ProceduralHouses() {
  // House configuration: [x, z, rotationY, color]
  const houses = [
    // North Side (Z < 0) - Driveways at z=-12, houses at z=-20. Facing South (0)
    [-35, -20, 0, "#d4a373"],
    [35, -20, 0, "#cb997e"],
    
    // South Side (Z > 0) - Driveways at z=12, houses at z=20. Facing North (PI)
    [-35, 20, Math.PI, "#e9edc9"],
    [35, 20, Math.PI, "#bc6c25"],
    
    // West Side (X < 0) - Driveways at x=-12, houses at x=-20. Facing East (PI/2)
    [-20, -35, Math.PI / 2, "#dda15e"],
    [-20, 35, Math.PI / 2, "#e9edc9"],
    
    // East Side (X > 0) - Driveways at x=12, houses at x=20. Facing West (-PI/2)
    [20, -35, -Math.PI / 2, "#bc6c25"],
    [20, 35, -Math.PI / 2, "#d4a373"],
  ];

  return (
    <>
      {houses.map((config, index) => {
        const [x, z, rotationY, color] = config;
        return (
          <RigidBody key={index} type="fixed" colliders="cuboid" position={[x, -5, z]} rotation={[0, rotationY, 0]}>
            {/* Base */}
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[6, 4, 6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Roof */}
            <mesh position={[0, 5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[5, 2.5, 4]} />
              <meshStandardMaterial color="#606c38" />
            </mesh>
            
            {/* Door */}
            <mesh position={[0, 1, 3.1]}>
              <planeGeometry args={[1.5, 2]} />
              <meshStandardMaterial color="#283618" />
            </mesh>

            {/* Window */}
            <mesh position={[1.5, 2.5, 3.1]}>
              <planeGeometry args={[1, 1]} />
              <meshStandardMaterial color="#a7c957" emissive="#a7c957" emissiveIntensity={0.2} />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
}

export default ProceduralHouses;
