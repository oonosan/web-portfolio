import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { palette } from './palette';
import { rng } from './textures';

const leafGeometry = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.42, 0.45, 0, 1);
  s.quadraticCurveTo(-0.42, 0.45, 0, 0);
  const g = new THREE.ShapeGeometry(s, 8);
  // cup the leaf a little so it catches light like a real one
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, x * x * 0.9 - Math.sin(y * Math.PI) * 0.08);
  }
  g.computeVertexNormals();
  return g;
})();

const leafMaterials = [palette.leaf, palette.leafDark, palette.leafLight].map(
  (c) => new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 0.7 }),
);

function Leaf({ size, ...props }: { size: number } & ThreeElements['mesh']) {
  return <mesh geometry={leafGeometry} scale={[size * 0.7, size, size]} castShadow {...props} />;
}

function Pot({ radius = 0.2, height = 0.32, color = palette.pot }) {
  return (
    <group>
      <mesh position-y={height / 2} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.78, height, 24]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position-y={height - 0.02}>
        <cylinderGeometry args={[radius * 0.92, radius * 0.92, 0.02, 24]} />
        <meshStandardMaterial color="#4a3426" />
      </mesh>
    </group>
  );
}

/** Sways its children around the base, each plant with its own phase. */
function useSway(seed: number, amount = 0.04, speed = 0.8) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + seed;
    ref.current.rotation.z = Math.sin(t) * amount;
    ref.current.rotation.x = Math.cos(t * 0.7) * amount * 0.6;
  });
  return ref;
}

type PlantProps = ThreeElements['group'] & { seed?: number; potColor?: string };

/** A leafy bush in a pot: fern / peace-lily silhouette. */
export function BushyPlant({ seed = 1, potColor, ...props }: PlantProps) {
  const leaves = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: 16 }, (_, i) => ({
      yaw: (i / 16) * Math.PI * 2 + r() * 0.4,
      tilt: 0.35 + r() * 0.6,
      size: 0.28 + r() * 0.18,
      mat: Math.floor(r() * 3),
    }));
  }, [seed]);
  const sway = useSway(seed);
  return (
    <group {...props}>
      <Pot color={potColor} />
      <group ref={sway} position-y={0.3}>
        {leaves.map((l, i) => (
          <group key={i} rotation-y={l.yaw}>
            <Leaf size={l.size} rotation-x={-l.tilt} material={leafMaterials[l.mat]} />
          </group>
        ))}
      </group>
    </group>
  );
}

/** Fiddle-leaf fig: tall stems with big round leaves. */
export function TallPlant({ seed = 2, potColor, ...props }: PlantProps) {
  const stems = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: 3 }, (_, s) => ({
      lean: (s - 1) * 0.18 + (r() - 0.5) * 0.1,
      height: 0.9 + r() * 0.5,
      leaves: Array.from({ length: 6 }, (_, i) => ({
        y: 0.25 + i * 0.17 + r() * 0.05,
        yaw: i * 2.4 + r(),
        size: 0.22 + r() * 0.08,
        mat: Math.floor(r() * 3),
      })),
    }));
  }, [seed]);
  const sway = useSway(seed, 0.03, 0.6);
  return (
    <group {...props}>
      <Pot radius={0.25} height={0.4} color={potColor} />
      <group ref={sway} position-y={0.38}>
        {stems.map((s, i) => (
          <group key={i} rotation-z={s.lean}>
            <mesh position-y={s.height / 2} castShadow>
              <cylinderGeometry args={[0.012, 0.018, s.height, 6]} />
              <meshStandardMaterial color="#6b5236" />
            </mesh>
            {s.leaves
              .filter((l) => l.y < s.height)
              .map((l, j) => (
                <group key={j} position-y={l.y} rotation-y={l.yaw}>
                  <Leaf size={l.size} rotation-x={-0.9} material={leafMaterials[l.mat]} />
                </group>
              ))}
          </group>
        ))}
      </group>
    </group>
  );
}

/** Small round succulent for desks and shelves. */
export function Succulent({
  potColor = palette.terracotta,
  ...props
}: ThreeElements['group'] & { potColor?: string }) {
  return (
    <group {...props}>
      <Pot radius={0.07} height={0.09} color={potColor} />
      {Array.from({ length: 7 }, (_, i) => (
        <group key={i} position-y={0.08} rotation-y={(i / 7) * Math.PI * 2}>
          <mesh
            position={[0.03, 0.03, 0]}
            rotation-z={-0.6}
            scale={[0.035, 0.07, 0.035]}
            castShadow
          >
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#8fcaa0" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** A pothos vine: a chain of small leaves hanging from `length`. */
function Vine({ length, seed, x, z }: { length: number; seed: number; x: number; z: number }) {
  const segs = useMemo(() => {
    const r = rng(seed);
    const n = Math.round(length / 0.08);
    return Array.from({ length: n }, () => ({ yaw: r() * Math.PI * 2, mat: Math.floor(r() * 3) }));
  }, [length, seed]);
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.9 + seed) * 0.05;
  });
  return (
    <group ref={ref} position={[x, 0, z]}>
      {segs.map((s, i) => (
        <group key={i} position-y={-i * 0.08} rotation-y={s.yaw}>
          <Leaf size={0.09} rotation-x={0.6} material={leafMaterials[s.mat]} />
        </group>
      ))}
    </group>
  );
}

/** Pot of trailing pothos: vines spill over the edge and hang down. */
export function TrailingPlant({
  seed = 3,
  lengths = [0.5, 0.8, 0.35, 0.65],
  potColor,
  ...props
}: PlantProps & { lengths?: number[] }) {
  return (
    <group {...props}>
      <Pot radius={0.12} height={0.16} color={potColor} />
      <BushyCrown seed={seed} />
      {lengths.map((len, i) => {
        const a = (i / lengths.length) * Math.PI * 2 + 0.4;
        return (
          <Vine
            key={i}
            length={len}
            seed={seed + i}
            x={Math.cos(a) * 0.13}
            z={Math.sin(a) * 0.13}
          />
        );
      })}
    </group>
  );
}

function BushyCrown({ seed }: { seed: number }) {
  const leaves = useMemo(() => {
    const r = rng(seed * 7);
    return Array.from({ length: 10 }, (_, i) => ({
      yaw: (i / 10) * Math.PI * 2,
      tilt: 0.6 + r() * 0.6,
      mat: i % 3,
    }));
  }, [seed]);
  return (
    <group position-y={0.15}>
      {leaves.map((l, i) => (
        <group key={i} rotation-y={l.yaw}>
          <Leaf size={0.13} rotation-x={-l.tilt} material={leafMaterials[l.mat]} />
        </group>
      ))}
    </group>
  );
}

/** A macramé-style hanging planter hung from a wall hook. */
export function HangingPlant({ seed = 4, drop = 0.55, ...props }: PlantProps & { drop?: number }) {
  const swing = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (swing.current) swing.current.rotation.x = Math.sin(clock.elapsedTime * 0.7 + seed) * 0.03;
  });
  return (
    <group {...props}>
      {/* hook */}
      <mesh position={[0, 0, 0.12]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.012, 0.012, 0.24, 6]} />
        <meshStandardMaterial color={palette.metal} />
      </mesh>
      <group ref={swing} position={[0, 0, 0.24]}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          const end = new THREE.Vector3(Math.cos(a) * 0.12, -drop, Math.sin(a) * 0.12);
          const mid = end.clone().multiplyScalar(0.5);
          const q = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            end.clone().normalize(),
          );
          return (
            <mesh key={i} position={mid} quaternion={q}>
              <cylinderGeometry args={[0.005, 0.005, end.length(), 4]} />
              <meshStandardMaterial color={palette.cream} />
            </mesh>
          );
        })}
        <group position-y={-drop - 0.1}>
          <TrailingPlant
            seed={seed}
            lengths={[0.6, 0.9, 0.45, 0.75, 0.55]}
            potColor={palette.cream}
          />
        </group>
      </group>
    </group>
  );
}
