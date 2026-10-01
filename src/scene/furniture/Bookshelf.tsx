import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';
import { palette } from '../palette';
import { bookSpineTexture, rng } from '../textures';
import { Succulent, TrailingPlant } from '../plants';

export const SHELF = { width: 1.4, depth: 0.4, height: 2.0, levels: [0.06, 0.52, 0.98, 1.44] };

const titles = ['Finthrive', 'Kinetic', 'Angular', '.NET C#', 'Research', 'UX flows', 'Testing'];
const bookColors = [
  '#f7b8d2',
  '#bfe8d6',
  '#fbe7a6',
  '#bfe0f5',
  '#c9b4ef',
  '#f8c8a8',
  '#9fd3bd',
  '#e39bc4',
];

type Book = {
  z: number;
  w: number;
  h: number;
  d: number;
  mat: THREE.Material | THREE.Material[];
  lean: number;
};

/** Fills a shelf span [z0, z1] with upright books. */
function fillBooks(z0: number, z1: number, seed: number, titled: string[]): Book[] {
  const r = rng(seed);
  const books: Book[] = [];
  let z = z0;
  let t = 0;
  while (z < z1 - 0.05) {
    const hasTitle = t < titled.length && r() > 0.45;
    const w = hasTitle ? 0.075 : 0.035 + r() * 0.04;
    if (z + w > z1) break;
    const color = bookColors[Math.floor(r() * bookColors.length)];
    const plain = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
    const mat = hasTitle
      ? [
          new THREE.MeshStandardMaterial({
            map: bookSpineTexture(titled[t++], color),
            roughness: 0.8,
          }),
          plain,
          plain,
          plain,
          plain,
          plain,
        ]
      : plain;
    books.push({ z: z + w / 2, w, h: 0.28 + r() * 0.12, d: 0.26 + r() * 0.06, mat, lean: 0 });
    z += w + 0.004;
  }
  // last book leans on its neighbour for a lived-in look
  if (books.length) books[books.length - 1].lean = 0.18;
  return books;
}

function Books({ y, books }: { y: number; books: Book[] }) {
  return (
    <group position-y={y}>
      {books.map((b, i) => (
        <mesh
          key={i}
          position={[0.02, b.h / 2, b.z + b.lean * 0.25 * b.h]}
          rotation-x={-b.lean}
          material={b.mat}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[b.d, b.h, b.w]} />
        </mesh>
      ))}
    </group>
  );
}

function PhotoFrame(props: ThreeElements['group']) {
  return (
    <group {...props}>
      <mesh position-y={0.1} rotation-z={0.12} castShadow>
        <boxGeometry args={[0.02, 0.2, 0.16]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <mesh position={[0.012, 0.1, 0]} rotation-z={0.12}>
        <planeGeometry args={[0.13, 0.17]} />
        <meshStandardMaterial color={palette.sky} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Tall bookshelf against the left wall, facing into the room (+x). */
export function Bookshelf(props: ThreeElements['group']) {
  const shelves = useMemo(
    () => [
      fillBooks(-0.66, 0.66, 11, titles.slice(4)),
      fillBooks(-0.66, 0.12, 12, titles.slice(0, 2)),
      fillBooks(0.1, 0.66, 13, titles.slice(2, 4)),
      fillBooks(-0.66, -0.15, 14, []),
    ],
    [],
  );
  const { width, depth, height, levels } = SHELF;
  const wood = palette.wood;

  return (
    <group {...props}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, height / 2, (width / 2) * s]} castShadow receiveShadow>
          <boxGeometry args={[depth, height, 0.04]} />
          <meshStandardMaterial color={wood} roughness={0.75} />
        </mesh>
      ))}
      {[...levels, height - 0.02].map((y) => (
        <mesh key={y} position={[0, y - 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[depth, 0.04, width + 0.04]} />
          <meshStandardMaterial color={palette.woodLight} roughness={0.75} />
        </mesh>
      ))}
      <mesh position={[-depth / 2 + 0.01, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.02, height, width]} />
        <meshStandardMaterial color={palette.woodDark} roughness={0.8} />
      </mesh>

      <Books y={levels[0]} books={shelves[0]} />
      <Books y={levels[1]} books={shelves[1]} />
      <TrailingPlant position={[0.02, levels[1], 0.4]} seed={9} lengths={[0.3, 0.45, 0.2, 0.38]} />
      <Books y={levels[2]} books={shelves[2]} />
      <PhotoFrame position={[0.02, levels[2], -0.35]} />
      <Succulent position={[0.02, levels[2], -0.12]} potColor={palette.cream} />
      <Books y={levels[3]} books={shelves[3]} />
      {/* a horizontal stack */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0.02, levels[3] + 0.025 + i * 0.05, 0.3]}
          rotation-y={i * 0.15}
          castShadow
        >
          <boxGeometry args={[0.28, 0.048, 0.22]} />
          <meshStandardMaterial color={bookColors[(i * 3) % bookColors.length]} />
        </mesh>
      ))}
    </group>
  );
}
