import { useMemo } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import { palette } from '../palette';
import { frameArtTexture, rng, stickyNoteTexture } from '../textures';
import { impact, tools } from '../../content';

/** Three framed posters above the desk, one per impact highlight. */
export function Frames(props: ThreeElements['group']) {
  const frames = [
    { x: -0.75, y: 0.1 },
    { x: 0, y: 0 },
    { x: 0.75, y: 0.12 },
  ];
  return (
    <group {...props}>
      {frames.map((f, i) => (
        <group key={i} position={[f.x, f.y, 0]}>
          <mesh position-z={0.02} castShadow>
            <boxGeometry args={[0.52, 0.64, 0.04]} />
            <meshStandardMaterial
              color={[palette.lilac, palette.woodLight, palette.pink][i]}
              roughness={0.6}
            />
          </mesh>
          <mesh position-z={0.041}>
            <planeGeometry args={[0.44, 0.55]} />
            <meshStandardMaterial map={frameArtTexture(i, impact[i].label)} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const noteColors = [
  '#fdeeb0',
  '#fbd0e2',
  '#cfeedf',
  '#cfe6f8',
  '#e3d6f8',
  '#fdeeb0',
  '#cfeedf',
  '#fbd0e2',
];

/** Corkboard with a sticky note per tool. Built facing +z; rotate it onto a wall. */
export function Corkboard(props: ThreeElements['group']) {
  const notes = useMemo(() => {
    const r = rng(17);
    return tools.map((tool, i) => ({
      tool,
      x: -0.495 + (i % 4) * 0.33,
      y: 0.18 - Math.floor(i / 4) * 0.36,
      rot: (r() - 0.5) * 0.18,
      color: noteColors[i % noteColors.length],
    }));
  }, []);
  return (
    <group {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.48, 0.92, 0.04]} />
        <meshStandardMaterial color={palette.woodLight} />
      </mesh>
      <mesh position-z={0.021}>
        <planeGeometry args={[1.38, 0.82]} />
        <meshStandardMaterial color="#ecc9a2" roughness={1} />
      </mesh>
      {notes.map((n) => (
        <group key={n.tool} position={[n.x, n.y, 0.025]} rotation-z={n.rot}>
          <mesh>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial map={stickyNoteTexture(n.tool, n.color)} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.12, 0.01]}>
            <sphereGeometry args={[0.014, 10, 8]} />
            <meshStandardMaterial color={palette.accent} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
