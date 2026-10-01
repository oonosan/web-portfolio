import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { palette } from './palette';
import { skyTexture, woodFloorTexture } from './textures';
import { eveningAmount } from '../scroll';

// Room footprint: the floor spans x,z in [-3, 3]. The back wall sits behind z = -3 and the
// left wall behind x = -3, both 0.2 thick. The +x and +z sides are open, diorama-style.
export const WALL_H = 3.2;
export const WINDOW = { x0: 0.85, x1: 2.35, y0: 1.0, y1: 2.4 };

function Box({
  size,
  position,
  color,
  shadows = true,
  radius = 0,
}: {
  size: [number, number, number];
  position: [number, number, number];
  color: string;
  shadows?: boolean;
  /** Rounded edges for the soft, toy-like walls and base. */
  radius?: number;
}) {
  if (radius > 0)
    return (
      <RoundedBox
        args={size}
        radius={radius}
        smoothness={4}
        position={position}
        castShadow={shadows}
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={0.9} />
      </RoundedBox>
    );
  return (
    <mesh position={position} castShadow={shadows} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Floor() {
  const tex = useMemo(() => {
    const t = woodFloorTexture().clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1.4, 1.4);
    t.needsUpdate = true;
    return t;
  }, []);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial map={tex} roughness={0.75} />
      </mesh>
      <Box
        size={[6.2, 0.25, 6.2]}
        position={[-0.1, -0.125, -0.1]}
        color={palette.floorSide}
        radius={0.1}
      />
      <Box
        size={[6.7, 0.24, 6.7]}
        position={[-0.1, -0.36, -0.1]}
        color={palette.base}
        radius={0.12}
      />
    </group>
  );
}

function Walls() {
  const { x0, x1, y0, y1 } = WINDOW;
  const back = -3.1;
  const t = 0.2;
  return (
    <group>
      {/* back wall, built around the window opening */}
      <Box
        size={[x0 + 3.2, WALL_H, t]}
        position={[(x0 - 3.2) / 2, WALL_H / 2, back]}
        color={palette.wall}
        radius={0.09}
      />
      <Box
        size={[3 - x1, WALL_H, t]}
        position={[(x1 + 3) / 2, WALL_H / 2, back]}
        color={palette.wall}
        radius={0.09}
      />
      <Box size={[x1 - x0, y0, t]} position={[(x0 + x1) / 2, y0 / 2, back]} color={palette.wall} />
      <Box
        size={[x1 - x0, WALL_H - y1, t]}
        position={[(x0 + x1) / 2, (WALL_H + y1) / 2, back]}
        color={palette.wall}
      />
      {/* left wall */}
      <Box
        size={[t, WALL_H, 6.2]}
        position={[-3.1, WALL_H / 2, -0.1]}
        color={palette.wallSide}
        radius={0.09}
      />
      {/* baseboards */}
      <Box
        size={[6, 0.12, 0.04]}
        position={[0, 0.06, -2.98]}
        color={palette.baseboard}
        shadows={false}
      />
      <Box
        size={[0.04, 0.12, 6]}
        position={[-2.98, 0.06, 0]}
        color={palette.baseboard}
        shadows={false}
      />
    </group>
  );
}

function Window() {
  const { x0, x1, y0, y1 } = WINDOW;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const w = x1 - x0;
  const h = y1 - y0;
  const sky = useRef<THREE.MeshBasicMaterial>(null);
  const day = useMemo(() => new THREE.Color('#ffffff'), []);
  const dusk = useMemo(() => new THREE.Color('#5b4d8a'), []);

  useFrame(() => {
    sky.current?.color.lerpColors(day, dusk, eveningAmount());
  });

  const frame = palette.woodLight;
  return (
    <group>
      <mesh position={[cx, cy, -3.32]}>
        <planeGeometry args={[w + 0.4, h + 0.3]} />
        <meshBasicMaterial ref={sky} map={skyTexture()} toneMapped={false} />
      </mesh>
      {/* frame */}
      <Box size={[w, 0.07, 0.24]} position={[cx, y1 - 0.035, -3.08]} color={frame} />
      <Box size={[0.07, h, 0.24]} position={[x0 + 0.035, cy, -3.08]} color={frame} />
      <Box size={[0.07, h, 0.24]} position={[x1 - 0.035, cy, -3.08]} color={frame} />
      <Box size={[0.05, h, 0.06]} position={[cx, cy, -3.1]} color={frame} />
      <Box size={[w, 0.05, 0.06]} position={[cx, cy + 0.15, -3.1]} color={frame} />
      {/* sill */}
      <Box
        size={[w + 0.3, 0.06, 0.42]}
        position={[cx, y0 - 0.01, -2.95]}
        color={palette.woodLight}
      />
      {/* glass */}
      <mesh position={[cx, cy, -3.1]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial color="#dff1fb" transparent opacity={0.12} roughness={0.05} />
      </mesh>
    </group>
  );
}

/** Fairy lights along the top of the back wall that switch on in the evening. */
function StringLights() {
  const bulbs = useMemo(() => {
    const pts: [number, number, number][] = [];
    const n = 18;
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const x = -2.9 + f * 5.8;
      const sag = Math.sin(((f * 3) % 1) * Math.PI) * 0.16;
      pts.push([x, 2.98 - sag, -2.94]);
    }
    return pts;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: '#fff3d1', emissive: '#ffc46b', toneMapped: false }),
    [],
  );
  const wire = useMemo(
    () => new THREE.CatmullRomCurve3(bulbs.map(([x, y, z]) => new THREE.Vector3(x, y + 0.03, z))),
    [bulbs],
  );

  useFrame(({ clock }) => {
    const e = eveningAmount();
    mat.emissiveIntensity = 0.15 + e * (3.5 + Math.sin(clock.elapsedTime * 2) * 0.4);
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[wire, 120, 0.006, 4]} />
        <meshStandardMaterial color={palette.metal} />
      </mesh>
      {bulbs.map((p, i) => (
        <mesh key={i} position={p} material={mat}>
          <sphereGeometry args={[0.035, 10, 10]} />
        </mesh>
      ))}
    </group>
  );
}

function ClockHand({
  length,
  width,
  z,
  which,
}: {
  length: number;
  width: number;
  z: number;
  which: 'hour' | 'minute';
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const d = new Date();
    const m = d.getMinutes() + d.getSeconds() / 60;
    const h = (d.getHours() % 12) + m / 60;
    const turn = which === 'hour' ? h / 12 : m / 60;
    if (ref.current) ref.current.rotation.z = -turn * Math.PI * 2;
  });
  return (
    <group ref={ref} position={[0, 0, z]}>
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry args={[width, length, 0.006]} />
        <meshStandardMaterial color={which === 'minute' ? palette.accent : palette.ink} />
      </mesh>
    </group>
  );
}

function WallClock() {
  return (
    <group position={[-2.97, 2.62, -1.05]} rotation-y={Math.PI / 2}>
      <mesh rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 40]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.026]}>
        <cylinderGeometry args={[0.21, 0.21, 0.01, 40]} />
        <meshStandardMaterial color={palette.cream} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 12) * Math.PI * 2) * 0.17,
            Math.cos((i / 12) * Math.PI * 2) * 0.17,
            0.034,
          ]}
        >
          <boxGeometry args={[0.014, 0.014, 0.004]} />
          <meshStandardMaterial color={palette.ink} />
        </mesh>
      ))}
      <ClockHand length={0.11} width={0.018} z={0.036} which="hour" />
      <ClockHand length={0.16} width={0.01} z={0.04} which="minute" />
    </group>
  );
}

export function Room() {
  return (
    <group>
      <Floor />
      <Walls />
      <Window />
      <StringLights />
      <WallClock />
    </group>
  );
}
