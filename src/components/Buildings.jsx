import { RigidBody } from "@react-three/rapier";

function Buildings() {
  // Building configurations: [x, z, width, height, depth, color]
  const buildings = [
    // Left side of horizontal road
    [-15, -15, 6, 8, 6, "#8b7355"],
    [-30, -15, 5, 6, 5, "#a0826d"],
    [-45, -20, 7, 10, 7, "#6b5d52"],
    
    // Right side of horizontal road
    [15, -15, 6, 7, 6, "#7a6a5c"],
    [30, -20, 5, 9, 5, "#9b8b7d"],
    [40, -15, 8, 5, 8, "#8d7c6e"],
    
    // Top side of vertical road
    [-20, 15, 5, 6, 5, "#a18c7e"],
    [-15, 30, 6, 8, 6, "#7b6b5d"],
    
    // Bottom side of vertical road
    [20, 20, 7, 7, 7, "#6a5a4c"],
    [15, 35, 5, 10, 5, "#8c7c6e"],
  ];

  return (
    <>
      {buildings.map((building, index) => {
        const [x, z, width, height, depth, color] = building;
        return (
          <RigidBody key={index} type="fixed" colliders="cuboid" position={[x, -5 + height / 3, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            
            {/* Roof */}
            <mesh castShadow position={[0, height / 2 + 1, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[width * 0.7, 2, 4]} />
              <meshStandardMaterial color="#8b4513" roughness={0.7} />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
}

export default Buildings;
