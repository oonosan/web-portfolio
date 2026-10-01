import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { palette } from '../palette';
import { globeTexture, rugTexture } from '../textures';

export function Globe(props: ThreeElements['group']) {
  const sphere = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (sphere.current) sphere.current.rotation.y += dt * 0.35;
  });
  return (
    <group {...props}>
      <mesh position-y={0.015} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.03, 20]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <mesh position-y={0.06}>
        <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
        <meshStandardMaterial color={palette.metal} />
      </mesh>
      <group position-y={0.26} rotation-z={0.4}>
        <mesh ref={sphere} castShadow>
          <sphereGeometry args={[0.16, 32, 24]} />
          <meshStandardMaterial map={globeTexture()} roughness={0.5} />
        </mesh>
        <mesh rotation-y={Math.PI / 2}>
          <torusGeometry args={[0.185, 0.008, 6, 40, Math.PI]} />
          <meshStandardMaterial color="#f2c46b" metalness={0.5} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

export function Rug(props: ThreeElements['group']) {
  return (
    <group {...props}>
      <mesh position-y={0.007} receiveShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.014, 64]} />
        <meshStandardMaterial map={rugTexture()} roughness={1} />
      </mesh>
    </group>
  );
}

export function CatTree(props: ThreeElements['group']) {
  const toy = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (toy.current) toy.current.rotation.z = Math.sin(clock.elapsedTime * 1.8) * 0.25;
  });
  const sisal = '#f3dcb8';
  const plush = palette.pink;
  return (
    <group {...props}>
      <RoundedBox
        args={[0.62, 0.07, 0.62]}
        radius={0.025}
        position-y={0.035}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={plush} roughness={1} />
      </RoundedBox>
      <mesh position-y={0.62} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 1.18, 20]} />
        <meshStandardMaterial color={sisal} roughness={1} />
      </mesh>
      <mesh position={[-0.2, 0.62, 0.16]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
        <meshStandardMaterial color={plush} roughness={1} />
      </mesh>
      <mesh position-y={1.23} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.07, 36]} />
        <meshStandardMaterial color={plush} roughness={1} />
      </mesh>
      {/* dangling toy */}
      <group ref={toy} position={[0.24, 1.2, 0.12]}>
        <mesh position-y={-0.12}>
          <cylinderGeometry args={[0.003, 0.003, 0.24, 4]} />
          <meshStandardMaterial color={palette.ink} />
        </mesh>
        <mesh position-y={-0.26} castShadow>
          <sphereGeometry args={[0.035, 12, 10]} />
          <meshStandardMaterial color={palette.accent} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/** A ball of yarn that rolls back and forth, batted by the tabby. */
export function Yarn(props: ThreeElements['group']) {
  const ball = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ball.current) return;
    const t = clock.elapsedTime + 0.6;
    const x = Math.max(0, Math.sin(t * 3.2 - 0.6)) * 0.06;
    ball.current.position.z = x;
    ball.current.rotation.x = x / 0.06;
  });
  return (
    <group {...props}>
      <group ref={ball}>
        <mesh position-y={0.06} castShadow>
          <sphereGeometry args={[0.06, 20, 16]} />
          <meshStandardMaterial color={palette.lilac} roughness={1} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position-y={0.06} rotation={[i * 1.1, i * 0.7, 0]}>
            <torusGeometry args={[0.06, 0.006, 6, 24]} />
            <meshStandardMaterial color="#ddd0f7" roughness={1} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.003, -0.15]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.04, 0.05, 20, 1, 0, Math.PI]} />
        <meshStandardMaterial color={palette.lilac} />
      </mesh>
    </group>
  );
}
