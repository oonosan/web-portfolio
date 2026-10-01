import { useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { easing } from 'maath';

const RED = '#d4884a';
const CREAM = '#f6ead6';
const DARK = '#1f1a17';

function Blob({
  pos,
  scale,
  color,
  rot,
}: {
  pos: THREE.Vector3Tuple;
  scale: THREE.Vector3Tuple | number;
  color: string;
  rot?: THREE.Vector3Tuple;
}) {
  return (
    <mesh position={pos} scale={scale} rotation={rot} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 18]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

export function DogBed() {
  return (
    <group>
      <mesh position-y={0.11} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <torusGeometry args={[0.38, 0.11, 16, 40]} />
        <meshStandardMaterial color="#bfe8d6" roughness={0.95} />
      </mesh>
      <mesh position-y={0.05} receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.08, 40]} />
        <meshStandardMaterial color="#fff4fa" roughness={0.95} />
      </mesh>
    </group>
  );
}

/** A Shiba Inu curled up asleep. Poke it and it wakes up for a few seconds and wags. */
export function Shiba({ pokedAt }: { pokedAt: MutableRefObject<number> }) {
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const closed = useRef<THREE.Group>(null);
  const open = useRef<THREE.Group>(null);
  const zzz = useRef<HTMLDivElement>(null);
  const awake = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const isAwake = t - pokedAt.current < 4;
    easing.damp(awake, 'current', isAwake ? 1 : 0, 0.2, dt);
    const a = awake.current;
    if (body.current) body.current.scale.y = 1 + Math.sin(t * 1.4) * 0.035 * (1 - a);
    if (head.current) {
      head.current.position.y = 0.27 + a * 0.09;
      head.current.rotation.x = -a * 0.35;
      head.current.rotation.z = a * Math.sin(t * 2) * 0.12;
    }
    if (tail.current) tail.current.rotation.y = a * Math.sin(t * 16) * 0.35;
    if (closed.current) closed.current.visible = a < 0.5;
    if (open.current) open.current.visible = a >= 0.5;
    if (zzz.current) zzz.current.style.opacity = String(1 - a);
  });

  return (
    <group>
      <group ref={body}>
        <Blob pos={[0, 0.2, 0]} scale={[0.27, 0.15, 0.21]} rot={[0, 0.3, 0]} color={RED} />
        <Blob pos={[0.02, 0.15, 0.05]} scale={[0.22, 0.09, 0.17]} color={CREAM} />
        <Blob pos={[-0.13, 0.25, 0.05]} scale={[0.12, 0.1, 0.13]} color={RED} />
        <Blob pos={[0.21, 0.13, 0.17]} scale={[0.05, 0.04, 0.09]} rot={[0, 0.6, 0]} color={CREAM} />
        <Blob pos={[0.12, 0.12, 0.22]} scale={[0.05, 0.04, 0.09]} rot={[0, 0.9, 0]} color={CREAM} />
      </group>

      {/* curly tail over the back */}
      <group ref={tail} position={[-0.21, 0.3, -0.03]}>
        <mesh rotation={[0.3, 0.6, 0]} castShadow>
          <torusGeometry args={[0.07, 0.04, 12, 24, Math.PI * 1.6]} />
          <meshStandardMaterial color={RED} roughness={0.85} />
        </mesh>
        <Blob pos={[0.06, 0.03, 0.02]} scale={0.04} color={CREAM} />
      </group>

      <group ref={head} position={[0.18, 0.27, 0.1]} rotation-y={0.9}>
        <group rotation-y={0}>
          <Blob pos={[0, 0, 0]} scale={[0.13, 0.115, 0.13]} color={RED} />
          {[-1, 1].map((s) => (
            <Blob
              key={s}
              pos={[0.065 * s, -0.04, 0.075]}
              scale={[0.075, 0.06, 0.07]}
              color={CREAM}
            />
          ))}
          <Blob pos={[0, -0.035, 0.13]} scale={[0.06, 0.05, 0.09]} color={CREAM} />
          <Blob pos={[0, -0.012, 0.215]} scale={[0.024, 0.018, 0.018]} color={DARK} />
          {/* the cream "eyebrow" dots */}
          {[-1, 1].map((s) => (
            <Blob key={s} pos={[0.048 * s, 0.06, 0.1]} scale={0.016} color={CREAM} />
          ))}
          <group ref={closed}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0.05 * s, 0.025, 0.115]} rotation-z={Math.PI / 2}>
                <capsuleGeometry args={[0.006, 0.03, 4, 6]} />
                <meshBasicMaterial color={DARK} />
              </mesh>
            ))}
          </group>
          <group ref={open} visible={false}>
            {[-1, 1].map((s) => (
              <Blob key={s} pos={[0.05 * s, 0.025, 0.112]} scale={0.018} color={DARK} />
            ))}
          </group>
          {[-1, 1].map((s) => (
            <group key={s} position={[0.07 * s, 0.1, -0.015]} rotation-z={-0.3 * s}>
              <mesh position-y={0.04} rotation-y={Math.PI / 4} castShadow>
                <coneGeometry args={[0.05, 0.1, 4]} />
                <meshStandardMaterial color={RED} flatShading roughness={0.85} />
              </mesh>
              <mesh position={[0, 0.03, 0.018]} rotation-y={Math.PI / 4}>
                <coneGeometry args={[0.028, 0.065, 4]} />
                <meshStandardMaterial color={CREAM} flatShading />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      <Html
        position={[0.3, 0.55, 0.15]}
        center
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div ref={zzz} className="scene-zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </div>
      </Html>
    </group>
  );
}
