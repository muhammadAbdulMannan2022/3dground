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
      <mesh
        position={[0.4, 3.8, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        castShadow
        receiveShadow
      >
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
        <meshStandardMaterial
          color="#f1c40f"
          emissive="#f1c40f"
          emissiveIntensity={2}
        />
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

  const hRoadX = [-50, -42, -25, -15, 15, 25, 42, 50];
  hRoadX.forEach((x) => {
    lamps.push({ pos: [x, -5, -6], rot: -Math.PI / 2 });

    lamps.push({ pos: [x, -5, 6], rot: Math.PI / 2 });
  });

  // --- Main Vertical Road (X=0) ---
  // Safe Z positions
  const vRoadZ = [-50, -42, -25, -15, 15, 25, 42, 50];
  vRoadZ.forEach((z) => {
    // Left side (X=-6). Arm points +X -> Points Road.
    lamps.push({ pos: [-6, -5, z], rot: 0 });

    // Right side (X=6). Arm points +X. Rotate PI -> Points -X (Road).
    lamps.push({ pos: [6, -5, z], rot: Math.PI });
  });

  // --- BIG CENTRAL LAMP Post at (0, 0) ---
  // 4-way light at center intersection
  // We can simulate this by placing 4 lamps at the same spot rotated differently,
  // or (better) create a custom BigLamp geometry.
  // For simplicity, let's stack 4 regular lamps slightly offset or just render manually.

  const CentralLamp = () => (
    <group position={[0, -5, 0]}>
      {/** bottom part */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 2, 0.2, 20]} />
        <meshStandardMaterial color="#1c5eaf" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 1.2, 0.5, 20]} />
        <meshStandardMaterial color="#00ff00" roughness={0.5} />
      </mesh>
      {/* Tall Pole */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, 8, 8]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.5} />
      </mesh>
      {/* 4 Arms */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rot, i) => (
        <group key={i} rotation={[0, rot, 0]}>
          <mesh
            position={[0.8, 7.5, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          {/* Head */}
          <mesh position={[1.8, 7.3, 0]} castShadow>
            <coneGeometry args={[0.5, 0.6, 8]} />
            <meshStandardMaterial color="#34495e" />
          </mesh>
          {/* Bulb */}
          <mesh position={[1.8, 7.2, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial
              color="#fff"
              emissive="#fff"
              emissiveIntensity={3}
            />
          </mesh>
          <spotLight
            position={[1.8, 7, 0]}
            angle={0.8}
            penumbra={0.5}
            intensity={3}
            distance={20}
            color="#fff"
            castShadow
          />
        </group>
      ))}
    </group>
  );

  lamps.push({ pos: [-38, -5, -12], rot: 0 });

  lamps.push({ pos: [38, -5, -12], rot: Math.PI });

  // South Left (-35)
  lamps.push({ pos: [-38, -5, 12], rot: 0 });
  // South Right (35)
  lamps.push({ pos: [38, -5, 12], rot: Math.PI });

  lamps.push({ pos: [-12, -5, -38], rot: -Math.PI / 2 });

  // East Top (-35)
  lamps.push({ pos: [12, -5, -38], rot: -Math.PI / 2 });

  return (
    <>
      {lamps.map((lamp, index) => (
        <RigidBody
          key={index}
          type="fixed"
          colliders="trimesh"
          position={lamp.pos}
          rotation={[0, lamp.rot, 0]}
        >
          <LampPost />
        </RigidBody>
      ))}
      {/* Render the single central lamp */}
      <RigidBody type="fixed" colliders="trimesh">
        <CentralLamp />
      </RigidBody>
    </>
  );
}

export default StreetLamps;
