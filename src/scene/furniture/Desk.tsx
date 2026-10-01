import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { palette } from '../palette';
import { rng } from '../textures';
import { Succulent } from '../plants';
import { eveningAmount } from '../../scroll';

export const DESK = { x: -0.9, z: -2.45, top: 0.79, width: 2.4, depth: 0.95 };

/** The monitor shows code being typed next to a prototype that builds itself. */
function useScreenTexture() {
  const { canvas, tex } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { canvas, tex };
  }, []);

  const lines = useMemo(() => {
    const r = rng(42);
    const colors = ['#f7b8d2', '#bfe0f5', '#bfe8d6', '#fbe7a6', '#d9c9f2', '#f8c8a8'];
    return Array.from({ length: 22 }, () => {
      const indent = Math.floor(r() * 3) * 18;
      const tokens = Array.from({ length: 1 + Math.floor(r() * 4) }, () => ({
        w: 20 + r() * 60,
        c: colors[Math.floor(r() * colors.length)],
      }));
      return { indent, tokens };
    });
  }, []);

  const last = useRef(-1);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const step = Math.floor(t * 6);
    if (step === last.current) return;
    last.current = step;
    const ctx = canvas.getContext('2d')!;
    const { width: w, height: h } = canvas;

    // editor pane
    ctx.fillStyle = '#3d3358';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#4a406a';
    ctx.fillRect(0, 0, w, 24);
    ['#f7a1c4', '#fbe7a6', '#a6e3c8'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(14 + i * 16, 12, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    const visible = step % (lines.length + 10);
    const top = 36;
    lines.slice(0, Math.min(visible, lines.length)).forEach((line, i) => {
      ctx.fillStyle = '#6b5f8a';
      ctx.fillRect(10, top + i * 14, 12, 6);
      let x = 34 + line.indent;
      for (const tok of line.tokens) {
        ctx.fillStyle = tok.c;
        ctx.fillRect(x, top + i * 14, tok.w, 7);
        x += tok.w + 8;
      }
    });
    if (step % 2 === 0 && visible < lines.length) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(34, top + visible * 14 - 2, 3, 11);
    }

    // prototype preview pane
    const px = w * 0.62;
    ctx.fillStyle = '#fbeef6';
    ctx.fillRect(px, 24, w - px, h - 24);
    const phoneX = px + 40;
    const phoneW = w - px - 80;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(phoneX, 44, phoneW, h - 64);
    ctx.fillStyle = '#ec74aa';
    ctx.fillRect(phoneX, 44, phoneW, 34);
    const cards = Math.min(4, Math.floor(visible / 5));
    for (let i = 0; i < cards; i++) {
      const y = 92 + i * 56;
      ctx.fillStyle = ['#fbd9e9', '#d9f0e4', '#fdf0c4', '#e3dcf7'][i];
      ctx.fillRect(phoneX + 10, y, phoneW - 20, 46);
      ctx.fillStyle = 'rgba(74,56,96,0.5)';
      ctx.fillRect(phoneX + 18, y + 10, (phoneW - 40) * 0.6, 7);
      ctx.fillRect(phoneX + 18, y + 24, (phoneW - 40) * 0.35, 6);
    }
    tex.needsUpdate = true;
  });

  return tex;
}

function Monitor() {
  const screen = useScreenTexture();
  return (
    <group position={[DESK.x, DESK.top, -2.8]}>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.03, 0.2]} />
        <meshStandardMaterial color={palette.metal} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.18, -0.03]} castShadow>
        <boxGeometry args={[0.06, 0.32, 0.03]} />
        <meshStandardMaterial color={palette.metal} roughness={0.5} />
      </mesh>
      <RoundedBox args={[1.04, 0.62, 0.05]} radius={0.02} position={[0, 0.44, 0]} castShadow>
        <meshStandardMaterial color="#f3eefa" roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.45, 0.027]}>
        <planeGeometry args={[0.98, 0.552]} />
        <meshBasicMaterial map={screen} toneMapped={false} color="#e6e6e6" />
      </mesh>
    </group>
  );
}

function Keyboard() {
  return (
    <group position={[DESK.x, DESK.top, -2.12]}>
      <RoundedBox args={[0.52, 0.025, 0.17]} radius={0.01} position-y={0.013} castShadow>
        <meshStandardMaterial color="#efe6f8" />
      </RoundedBox>
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 12 }, (_, col) => (
          <mesh key={`${row}-${col}`} position={[-0.22 + col * 0.04, 0.03, -0.055 + row * 0.037]}>
            <boxGeometry args={[0.032, 0.012, 0.03]} />
            <meshStandardMaterial color="#fbf8f2" />
          </mesh>
        )),
      )}
      <mesh position={[0.42, 0.018, 0]} scale={[0.035, 0.018, 0.055]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#fbf8f2" />
      </mesh>
    </group>
  );
}

function Mug() {
  const puffs = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    puffs.current?.children.forEach((p, i) => {
      const t = (clock.elapsedTime * 0.35 + i / 3) % 1;
      p.position.set(Math.sin(t * 6 + i) * 0.012, 0.11 + t * 0.16, 0);
      p.scale.setScalar(0.008 + t * 0.014);
      ((p as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity =
        0.22 * Math.sin(t * Math.PI);
    });
  });
  return (
    <group position={[-0.25, DESK.top, -2.2]}>
      <mesh position-y={0.055} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.11, 20]} />
        <meshStandardMaterial color={palette.accent} roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.06, 0]} rotation-y={Math.PI / 2}>
        <torusGeometry args={[0.025, 0.008, 8, 16]} />
        <meshStandardMaterial color={palette.accent} roughness={0.5} />
      </mesh>
      <mesh position-y={0.1}>
        <cylinderGeometry args={[0.04, 0.04, 0.005, 20]} />
        <meshStandardMaterial color="#5a3a22" />
      </mesh>
      <group ref={puffs}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Lamp() {
  const light = useRef<THREE.PointLight>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const e = eveningAmount();
    if (light.current) light.current.intensity = 0.15 + e * 2.6;
    if (bulb.current) bulb.current.emissiveIntensity = 0.3 + e * 4;
  });
  return (
    <group position={[-1.9, DESK.top, -2.7]}>
      <mesh position-y={0.015} castShadow>
        <cylinderGeometry args={[0.1, 0.11, 0.03, 24]} />
        <meshStandardMaterial color={palette.terracotta} />
      </mesh>
      <group rotation-z={-0.25}>
        <mesh position-y={0.22} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
          <meshStandardMaterial color={palette.terracotta} />
        </mesh>
        <group position-y={0.43} rotation-z={1.0}>
          <mesh position-y={0.12} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
            <meshStandardMaterial color={palette.terracotta} />
          </mesh>
          <group position-y={0.25} rotation-z={0.9}>
            <mesh castShadow>
              <coneGeometry args={[0.1, 0.14, 24, 1, true]} />
              <meshStandardMaterial color={palette.terracotta} side={THREE.DoubleSide} />
            </mesh>
            <mesh position-y={-0.04}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial
                ref={bulb}
                color="#fff5dc"
                emissive="#ffd28a"
                toneMapped={false}
              />
            </mesh>
            <pointLight ref={light} position-y={-0.1} color="#ffc98a" distance={3.5} decay={1.6} />
          </group>
        </group>
      </group>
    </group>
  );
}

function Notebook() {
  return (
    <group position={[-1.5, DESK.top, -2.2]} rotation-y={0.25}>
      <mesh position-y={0.012} castShadow>
        <boxGeometry args={[0.22, 0.024, 0.3]} />
        <meshStandardMaterial color={palette.mint} />
      </mesh>
      <mesh position-y={0.025}>
        <boxGeometry args={[0.2, 0.002, 0.28]} />
        <meshStandardMaterial color="#fbf8f2" />
      </mesh>
      <mesh position={[0.05, 0.035, 0]} rotation={[Math.PI / 2, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.2, 6]} />
        <meshStandardMaterial color={palette.butter} />
      </mesh>
    </group>
  );
}

function DeskBody() {
  const legs: [number, number][] = [
    [0.22, -0.4],
    [0.22, 0.4],
  ];
  return (
    <group position={[DESK.x, 0, DESK.z]}>
      <RoundedBox
        args={[DESK.width, 0.06, DESK.depth]}
        radius={0.02}
        position-y={DESK.top - 0.03}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={palette.woodLight} roughness={0.7} />
      </RoundedBox>
      {/* drawer unit on the left */}
      <group position={[-DESK.width / 2 + 0.28, 0, 0]}>
        <mesh position-y={(DESK.top - 0.06) / 2} castShadow receiveShadow>
          <boxGeometry args={[0.52, DESK.top - 0.06, DESK.depth - 0.08]} />
          <meshStandardMaterial color={palette.wood} roughness={0.75} />
        </mesh>
        {[0.15, 0.37, 0.58].map((y) => (
          <group key={y}>
            <mesh position={[0, y, DESK.depth / 2 - 0.035]}>
              <boxGeometry args={[0.46, 0.19, 0.01]} />
              <meshStandardMaterial color={palette.woodLight} />
            </mesh>
            <mesh position={[0, y + 0.04, DESK.depth / 2 - 0.02]}>
              <boxGeometry args={[0.12, 0.018, 0.02]} />
              <meshStandardMaterial color={palette.metal} />
            </mesh>
          </group>
        ))}
      </group>
      {legs.map(([x, z]) => (
        <mesh key={z} position={[DESK.width / 2 - x, (DESK.top - 0.06) / 2, z]} castShadow>
          <boxGeometry args={[0.06, DESK.top - 0.06, 0.06]} />
          <meshStandardMaterial color={palette.wood} />
        </mesh>
      ))}
    </group>
  );
}

export function Desk() {
  return (
    <group>
      <DeskBody />
      <Monitor />
      <Keyboard />
      <Mug />
      <Lamp />
      <Notebook />
      <Succulent position={[-1.6, DESK.top, -2.78]} />
    </group>
  );
}
