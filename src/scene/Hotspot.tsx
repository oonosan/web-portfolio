import { useState, type ReactNode } from 'react';
import { Html, useCursor } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { chapters, type ChapterId, type Vec3 } from '../content';
import { goToChapter } from '../scroll';

type Props = {
  chapter: ChapterId;
  /** Where the hover label floats, in the group's local space. */
  labelAt: Vec3;
  children: ReactNode;
};

/** Makes a piece of the room clickable: hovering shows a label, clicking flies to its chapter. */
export function Hotspot({ chapter, labelAt, children }: Props) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const meta = chapters.find((c) => c.id === chapter)!;

  return (
    <group
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        goToChapter(chapter);
      }}
    >
      {children}
      {hovered && (
        <Html position={labelAt} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="scene-label">
            {meta.nav} <span aria-hidden="true">→</span>
          </div>
        </Html>
      )}
    </group>
  );
}
