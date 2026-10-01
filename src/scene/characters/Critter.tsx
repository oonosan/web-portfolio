import { useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';
import { Html, useCursor } from '@react-three/drei';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import type { Vec3 } from '../../content';

type Props = Omit<ThreeElements['group'], 'children'> & {
  label: string;
  sub?: string;
  labelAt: Vec3;
  /** Emoji that floats up when poked. */
  reaction?: string;
  hop?: boolean;
  /** Receives the elapsed time of the last poke so the character can react in its own way. */
  children: (pokedAt: MutableRefObject<number>) => ReactNode;
};

/** Hover shows a name tag; clicking makes the character hop and float a little emoji. */
export function Critter({
  label,
  sub,
  labelAt,
  reaction = '♥',
  hop = true,
  children,
  ...props
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [pokes, setPokes] = useState(0);
  const pokedAt = useRef(-100);
  const now = useRef(0);
  const body = useRef<THREE.Group>(null);
  useCursor(hovered);

  useFrame(({ clock }) => {
    now.current = clock.elapsedTime;
    if (!body.current) return;
    const t = clock.elapsedTime - pokedAt.current;
    body.current.position.y = hop && t < 0.5 ? Math.sin((t / 0.5) * Math.PI) * 0.12 : 0;
  });

  return (
    <group {...props}>
      <group
        ref={body}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          pokedAt.current = now.current;
          setPokes((p) => p + 1);
        }}
      >
        {children(pokedAt)}
      </group>
      {hovered && (
        <Html position={labelAt} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="scene-label">
            {label}
            {sub && <span className="scene-label-sub">{sub}</span>}
          </div>
        </Html>
      )}
      {pokes > 0 && (
        <Html position={labelAt} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div key={pokes} className="scene-reaction" aria-hidden="true">
            {reaction}
          </div>
        </Html>
      )}
    </group>
  );
}
