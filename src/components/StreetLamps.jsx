import { RigidBody } from "@react-three/rapier";

function StreetLamps() {
  const LampPost = () => (
    <group>
      {/* Base/Pole */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.15, 4, 8]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.5} />
      </mesh>
      
      {/* Horizontal Arm */}
      <mesh position={[0.4, 3.8, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.5} />
      </mesh>

      {/* Lamp Head */}
      <mesh position={[0.8, 3.7, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 0.4, 8]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* Bulb (Emissive) */}
      <mesh position={[0.8, 3.6, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={2} />
      </mesh>
      
      {/* Light Source - SpotLight for atmosphere, avoiding too many PointLights */}
      <spotLight
        position={[0.8, 3.5, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={2}
        distance={8}
        color="#f1c40f"
        castShadow={false} // Performance optimization
      />
    </group>
  );

  const lamps = [];

  // --- Main Horizontal Road (Z=0) ---
  // Safe X positions (Skipping 0 for intersection and +/- 35 for driveways)
  const hRoadX = [-50, -42, -25, -15, 15, 25, 42, 50];
  hRoadX.forEach(x => {
      // Top side (Z=-6). Arm points +X default. Rotate -PI/2 -> Points +Z (Road).
      lamps.push({ pos: [x, -5, -6], rot: -Math.PI / 2 });
      
      // Bottom side (Z=6). Arm points +X default. Rotate +PI/2 -> Points -Z (Road).
      lamps.push({ pos: [x, -5, 6], rot: Math.PI / 2 });
  });

  // --- Main Vertical Road (X=0) ---
  // Safe Z positions
  const vRoadZ = [-50, -42, -25, -15, 15, 25, 42, 50];
  vRoadZ.forEach(z => {
      // Left side (X=-6). Arm points +X -> Points Road.
      lamps.push({ pos: [-6, -5, z], rot: 0 });
      
      // Right side (X=6). Arm points +X. Rotate PI -> Points -X (Road).
      lamps.push({ pos: [6, -5, z], rot: Math.PI });
  });

  // --- Driveways ---
  // North/South Driveways (X = +/- 35). Driveway Z length approx 16.
  // North (Z < 0): Z range -4 to -20.
  // South (Z > 0): Z range 4 to 20.
  // Place one lamp halfway? Z = +/- 12.
  
  // North Left (-35)
  // Left side of driveway (X = -35 - 3 = -38). Arm points +X.
  lamps.push({ pos: [-38, -5, -12], rot: 0 });
  // North Right (35)
  // Right side of driveway (X = 35 + 3 = 38). Arm points -X.
  lamps.push({ pos: [38, -5, -12], rot: Math.PI });

  // South Left (-35)
  lamps.push({ pos: [-38, -5, 12], rot: 0 });
  // South Right (35)
  lamps.push({ pos: [38, -5, 12], rot: Math.PI });

  // West/East Driveways (Z = +/- 35). X length approx 16.
  // West (X < 0): X range -4 to -20. Mid -12.
  // East (X > 0): X range 4 to 20. Mid 12.
  
  // West Top (-35)
  // Top side of driveway (Z = -35 - 3 = -38). Arm points +Z.
  // Rotation -PI/2.
  lamps.push({ pos: [-12, -5, -38], rot: -Math.PI / 2 });
  
  // East Top (-35)
  lamps.push({ pos: [12, -5, -38], rot: -Math.PI / 2 });

  return (
    <>
      {lamps.map((lamp, index) => (
        <RigidBody key={index} type="fixed" colliders="trimesh" position={lamp.pos} rotation={[0, lamp.rot, 0]}>
          <LampPost />
        </RigidBody>
      ))}
    </>
  );
}

export default StreetLamps;
