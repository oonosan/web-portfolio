import { useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { calicoTexture, tabbyTexture } from '../textures';

export type Coat = {
  body: string;
  map?: () => THREE.Texture;
  chest: string;
  muzzle: string;
  paws: string;
  ears: [string, string];
  innerEar: string;
  /** One color, or alternating rings. */
  tail: string[];
  mask?: string;
  eye: string;
  nose: string;
  fluffy?: boolean;
  whiskers: string;
};

export const coats: Record<'calico' | 'black' | 'balinese' | 'tabby', Coat> = {
  calico: {
    body: '#ffffff',
    map: calicoTexture,
    chest: '#f6f1e9',
    muzzle: '#f6f1e9',
    paws: '#f6f1e9',
    ears: ['#d9823b', '#2b2523'],
    innerEar: '#f0b5a8',
    tail: ['#d9823b', '#d9823b', '#2b2523'],
    eye: '#d9a440',
    nose: '#e89a95',
    whiskers: '#ffffff',
  },
  black: {
    body: '#242120',
    chest: '#2b2826',
    muzzle: '#2b2826',
    paws: '#242120',
    ears: ['#242120', '#242120'],
    innerEar: '#5a3b3b',
    tail: ['#242120'],
    eye: '#c9cf4a',
    nose: '#3a3433',
    whiskers: '#d8d2c8',
  },
  balinese: {
    body: '#f2e8d6',
    chest: '#f7f0e3',
    muzzle: '#5a4234',
    paws: '#5a4234',
    ears: ['#4e392d', '#4e392d'],
    innerEar: '#7a5a4a',
    tail: ['#6a4f3f'],
    mask: '#5a4234',
    eye: '#4f8fd9',
    nose: '#3e2c24',
    fluffy: true,
    whiskers: '#f7f0e3',
  },
  tabby: {
    body: '#ffffff',
    map: tabbyTexture,
    chest: '#e3d2b5',
    muzzle: '#efe2cc',
    paws: '#e3d2b5',
    ears: ['#8a6a4a', '#8a6a4a'],
    innerEar: '#e6a99c',
    tail: ['#8a6a4a', '#3e2c1e'],
    eye: '#8fb34a',
    nose: '#c97a6c',
    whiskers: '#ffffff',
  },
};

export type Pose = 'sit' | 'loaf' | 'play';
export type TailStyle = 'curl' | 'hang' | 'up';

type Props = {
  coat: Coat;
  pose: Pose;
  tail: TailStyle;
  pokedAt: MutableRefObject<number>;
  seed?: number;
  /** 1 = wide awake, lower = sleepy. */
  eyeOpen?: number;
  headYaw?: number;
};

const layout: Record<
  Pose,
  {
    body: { pos: THREE.Vector3Tuple; scale: THREE.Vector3Tuple; rotX: number };
    chest: { pos: THREE.Vector3Tuple; scale: THREE.Vector3Tuple };
    head: THREE.Vector3Tuple;
    curl: { rx: number; rz: number; cz: number; y: number };
  }
> = {
  sit: {
    body: { pos: [0, 0.68, -0.05], scale: [0.55, 0.72, 0.6], rotX: -0.2 },
    chest: { pos: [0, 0.8, 0.3], scale: [0.36, 0.44, 0.3] },
    head: [0, 1.42, 0.2],
    curl: { rx: 0.62, rz: 0.62, cz: -0.05, y: 0.1 },
  },
  loaf: {
    body: { pos: [0, 0.45, -0.1], scale: [0.55, 0.45, 0.85], rotX: 0 },
    chest: { pos: [0, 0.48, 0.5], scale: [0.38, 0.36, 0.3] },
    head: [0, 0.9, 0.62],
    curl: { rx: 0.62, rz: 0.95, cz: -0.1, y: 0.1 },
  },
  play: {
    body: { pos: [0, 0.52, -0.1], scale: [0.5, 0.42, 0.8], rotX: 0.15 },
    chest: { pos: [0, 0.42, 0.45], scale: [0.34, 0.32, 0.28] },
    head: [0, 0.78, 0.66],
    curl: { rx: 0.6, rz: 0.9, cz: -0.1, y: 0.1 },
  },
};

const SEGMENTS = 12;

function Ellipsoid({
  pos,
  scale,
  color,
  map,
  rotX = 0,
}: {
  pos: THREE.Vector3Tuple;
  scale: THREE.Vector3Tuple;
  color: string;
  map?: THREE.Texture;
  rotX?: number;
}) {
  return (
    <mesh position={pos} scale={scale} rotation-x={rotX} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 18]} />
      <meshStandardMaterial color={color} map={map} roughness={0.85} />
    </mesh>
  );
}

function Tail({
  coat,
  pose,
  style,
  seed,
  pokedAt,
}: {
  coat: Coat;
  pose: Pose;
  style: TailStyle;
  seed: number;
  pokedAt: MutableRefObject<number>;
}) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const c = layout[pose].curl;
  const mats = useMemo(
    () => coat.tail.map((col) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.9 })),
    [coat],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + seed;
    const excited = clock.elapsedTime - pokedAt.current < 2 ? 3 : 1;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const s = i / (SEGMENTS - 1);
      if (style === 'curl') {
        const phi = 0.1 + s * 2.0 + Math.sin(t * 1.2 * excited) * 0.15 * s;
        m.position.set(
          c.rx * Math.sin(phi),
          c.y + s ** 3 * (0.25 + Math.sin(t * 1.7 * excited) * 0.12),
          c.cz - c.rz * Math.cos(phi),
        );
      } else if (style === 'hang') {
        const sway = Math.sin(t * 1.6 * excited - s * 2.5) * 0.18 * s;
        const out = Math.min(1, s / 0.25);
        m.position.set(
          0.05 + 0.3 * out * out + sway,
          0.3 - Math.max(0, s - 0.15) * 1.5,
          c.cz - c.rz * 0.8,
        );
      } else {
        const sway = Math.sin(t * 2 * excited + s * 2) * 0.12 * s;
        m.position.set(sway, 0.5 + s * 0.75, -0.85 - s * 0.2 + s ** 3 * 0.35);
      }
    });
  });
  const r0 = coat.fluffy ? 0.15 : 0.1;
  const r1 = coat.fluffy ? 0.11 : 0.06;
  return (
    <group>
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const r = THREE.MathUtils.lerp(r0, r1, i / (SEGMENTS - 1));
        return (
          <mesh
            key={i}
            ref={(m) => {
              refs.current[i] = m;
            }}
            scale={r}
            material={mats[Math.floor(i / 2) % mats.length]}
            castShadow
          >
            <sphereGeometry args={[1, 12, 10]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Head({
  coat,
  map,
  seed,
  eyeOpen,
  headYaw,
  pokedAt,
}: {
  coat: Coat;
  map?: THREE.Texture;
  seed: number;
  eyeOpen: number;
  headYaw: number;
  pokedAt: MutableRefObject<number>;
}) {
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const ears = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + seed;
    const poked = clock.elapsedTime - pokedAt.current < 1.5;
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.45) * headYaw;
      head.current.rotation.z = poked ? 0.35 : Math.sin(t * 0.3) * 0.08;
    }
    if (eyes.current) {
      const blink = t % 5 < 0.14;
      eyes.current.scale.y = blink ? 0.1 : poked ? 1.15 : eyeOpen;
    }
    ears.current.forEach((e, i) => {
      if (!e) return;
      const twitch = (t * 0.7 + i * 0.37) % 3 < 0.12 ? 0.35 : 0;
      e.rotation.z = (i === 0 ? 1 : -1) * (0.35 + twitch);
    });
  });

  return (
    <group ref={head}>
      <mesh scale={[0.44, 0.38, 0.4]} castShadow>
        <sphereGeometry args={[1, 28, 20]} />
        <meshStandardMaterial color={coat.body} map={map} roughness={0.85} />
      </mesh>
      {coat.fluffy && (
        <mesh position={[0, -0.12, -0.02]} scale={[0.5, 0.3, 0.42]}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color={coat.chest} roughness={0.95} />
        </mesh>
      )}
      {coat.mask && (
        <mesh position={[0, -0.12, 0.27]} scale={[0.24, 0.2, 0.16]}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color={coat.mask} roughness={0.85} />
        </mesh>
      )}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.075 * s, -0.13, 0.31]} scale={[0.11, 0.085, 0.085]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={coat.muzzle} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, -0.075, 0.39]} scale={[0.04, 0.028, 0.03]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={coat.nose} />
      </mesh>
      <group ref={eyes} position={[0, 0.04, 0]}>
        {[-1, 1].map((s) => (
          <group key={s} position={[0.155 * s, 0, 0.335]}>
            <mesh scale={[0.075, 0.075, 0.045]}>
              <sphereGeometry args={[1, 14, 10]} />
              <meshStandardMaterial color={coat.eye} roughness={0.3} />
            </mesh>
            <mesh position-z={0.035} scale={[0.016, 0.055, 0.015]}>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial color="#0d0b0a" roughness={0.2} />
            </mesh>
            <mesh position={[0.02, 0.025, 0.045]} scale={0.012}>
              <sphereGeometry args={[1, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
      {[-1, 1].map((s, i) => (
        <group
          key={s}
          ref={(g) => {
            ears.current[i] = g;
          }}
          position={[0.2 * s, 0.26, -0.02]}
        >
          <mesh position-y={0.1} rotation-y={Math.PI / 4} castShadow>
            <coneGeometry args={[0.15, 0.28, 4]} />
            <meshStandardMaterial color={coat.ears[i]} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 0.08, 0.05]} rotation-y={Math.PI / 4}>
            <coneGeometry args={[0.08, 0.18, 4]} />
            <meshStandardMaterial color={coat.innerEar} roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((s) =>
        [-0.03, 0, 0.03].map((dy, j) => (
          <mesh
            key={`${s}-${j}`}
            position={[0.24 * s, -0.12 + dy, 0.34]}
            rotation={[0, 0, Math.PI / 2 + s * dy * 4]}
          >
            <cylinderGeometry args={[0.003, 0.003, 0.26, 3]} />
            <meshBasicMaterial color={coat.whiskers} />
          </mesh>
        )),
      )}
    </group>
  );
}

/** A toy-style cat built from spheres. Faces +z; roughly 1.9 units tall when sitting. */
export function Cat({ coat, pose, tail, pokedAt, seed = 0, eyeOpen = 1, headYaw = 0.35 }: Props) {
  const map = useMemo(() => coat.map?.(), [coat]);
  const L = layout[pose];
  const breathing = useRef<THREE.Group>(null);
  const paw = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + seed;
    if (breathing.current)
      breathing.current.scale.set(1, 1 + Math.sin(t * 2.2) * 0.02, 1 + Math.sin(t * 2.2) * 0.01);
    if (paw.current) paw.current.rotation.x = -1.1 - Math.max(0, Math.sin(t * 3.2)) * 0.7;
  });

  return (
    <group>
      <group ref={breathing}>
        <Ellipsoid
          pos={L.body.pos}
          scale={L.body.scale}
          rotX={L.body.rotX}
          color={coat.body}
          map={map}
        />
        <Ellipsoid pos={L.chest.pos} scale={L.chest.scale} color={coat.chest} />
        {coat.fluffy && (
          <Ellipsoid
            pos={L.chest.pos}
            scale={[L.chest.scale[0] * 1.2, L.chest.scale[1] * 1.05, L.chest.scale[2] * 1.1]}
            color={coat.chest}
          />
        )}
      </group>

      {pose === 'sit' &&
        [-1, 1].map((s) => (
          <group key={s}>
            <Ellipsoid
              pos={[0.32 * s, 0.34, -0.12]}
              scale={[0.3, 0.34, 0.42]}
              color={coat.body}
              map={map}
            />
            <mesh position={[0.16 * s, 0.32, 0.36]} castShadow>
              <capsuleGeometry args={[0.09, 0.42, 6, 12]} />
              <meshStandardMaterial color={coat.paws} roughness={0.85} />
            </mesh>
            <Ellipsoid pos={[0.16 * s, 0.06, 0.44]} scale={[0.11, 0.07, 0.15]} color={coat.paws} />
          </group>
        ))}

      {pose === 'loaf' &&
        [-1, 1].map((s) => (
          <Ellipsoid
            key={s}
            pos={[0.17 * s, 0.07, 0.78]}
            scale={[0.12, 0.07, 0.15]}
            color={coat.paws}
          />
        ))}

      {pose === 'play' && (
        <>
          <Ellipsoid pos={[-0.17, 0.07, 0.72]} scale={[0.12, 0.07, 0.16]} color={coat.paws} />
          {[-1, 1].map((s) => (
            <Ellipsoid
              key={s}
              pos={[0.3 * s, 0.1, -0.55]}
              scale={[0.14, 0.1, 0.22]}
              color={coat.paws}
            />
          ))}
          <group ref={paw} position={[0.17, 0.38, 0.5]}>
            <mesh position-y={-0.2} castShadow>
              <capsuleGeometry args={[0.07, 0.3, 6, 10]} />
              <meshStandardMaterial color={coat.paws} roughness={0.85} />
            </mesh>
          </group>
        </>
      )}

      <group position={L.head}>
        <Head
          coat={coat}
          map={map}
          seed={seed}
          eyeOpen={eyeOpen}
          headYaw={headYaw}
          pokedAt={pokedAt}
        />
      </group>
      <Tail coat={coat} pose={pose} style={tail} seed={seed} pokedAt={pokedAt} />
    </group>
  );
}
