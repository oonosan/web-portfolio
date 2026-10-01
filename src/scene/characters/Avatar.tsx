import { useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { easing } from 'maath';
import { palette } from '../palette';
import { Critter } from './Critter';

// Tweak these to make the avatar look more like you.
const look = {
  skin: '#f0c9a8',
  blush: '#ec9f8f',
  hair: '#231a17',
  sweater: '#f7b8d2',
  pants: '#9fa8e0',
  shoes: '#fff6fb',
  headphones: '#fff6fb',
  headphoneCups: palette.accent,
};

const UPPER = 0.22;
const FORE = 0.24;
const SHOULDER_Y = 0.98;
const SHOULDER_X = 0.18;

// Joint angles (radians). Positive x swings the arm forward (towards the desk, -z).
const typing = { upperX: 0.85, upperZ: 0, foreX: 0.65, foreZ: 0 };
const wave = { upperX: 0.25, upperZ: 2.55, foreX: 0.1, foreZ: 0.5 };

function Capsule({
  r,
  len,
  color,
  ...props
}: { r: number; len: number; color: string } & ThreeElements['mesh']) {
  return (
    <mesh castShadow {...props}>
      <capsuleGeometry args={[r, len, 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function Arm({ side, pokedAt }: { side: 1 | -1; pokedAt: MutableRefObject<number> }) {
  const upper = useRef<THREE.Group>(null);
  const fore = useRef<THREE.Group>(null);
  const w = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const waving = side === 1 && t - pokedAt.current < 2.6;
    easing.damp(w, 'current', waving ? 1 : 0, 0.18, dt);
    const k = w.current;
    const tap = Math.max(0, Math.sin(t * 13 + (side === 1 ? 0 : Math.PI))) * 0.07 * (1 - k);
    const flap = Math.sin(t * 9) * 0.45 * k;
    if (upper.current) {
      upper.current.rotation.x = THREE.MathUtils.lerp(typing.upperX, wave.upperX, k);
      upper.current.rotation.z = THREE.MathUtils.lerp(typing.upperZ, wave.upperZ, k) * side;
    }
    if (fore.current) {
      fore.current.rotation.x = THREE.MathUtils.lerp(typing.foreX, wave.foreX, k) - tap;
      fore.current.rotation.z = (THREE.MathUtils.lerp(typing.foreZ, wave.foreZ, k) + flap) * side;
    }
  });

  return (
    <group position={[SHOULDER_X * side, SHOULDER_Y, -0.01]}>
      <mesh castShadow scale={0.075}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={look.sweater} roughness={0.85} />
      </mesh>
      <group ref={upper}>
        <Capsule r={0.055} len={UPPER - 0.06} color={look.sweater} position-y={-UPPER / 2} />
        <group ref={fore} position-y={-UPPER}>
          <Capsule r={0.05} len={FORE - 0.08} color={look.sweater} position-y={-FORE / 2 + 0.02} />
          <mesh position-y={-FORE} scale={[0.042, 0.05, 0.03]} castShadow>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color={look.skin} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Head({ pokedAt }: { pokedAt: MutableRefObject<number> }) {
  const head = useRef<THREE.Group>(null);
  const hair = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const turn = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const waving = t - pokedAt.current < 2.6;
    // glance at the calico now and then, turn to the viewer while waving
    const idle = Math.sin(t * 0.35) > 0.85 ? -0.55 : Math.sin(t * 0.6) * 0.06;
    easing.damp(turn, 'current', waving ? -1.1 : idle, 0.25, dt);
    if (head.current) {
      head.current.rotation.y = turn.current;
      head.current.rotation.x = 0.08 + Math.sin(t * 2.2) * 0.015;
    }
    if (hair.current) hair.current.rotation.x = Math.sin(t * 1.3) * 0.03 - turn.current * 0.05;
    if (eyes.current) {
      const blink = t % 4.2 < 0.12;
      eyes.current.scale.y = blink ? 0.15 : 1;
    }
  });

  return (
    <group ref={head} position={[0, 1.19, -0.03]}>
      <mesh castShadow>
        <sphereGeometry args={[0.14, 28, 20]} />
        <meshStandardMaterial color={look.skin} roughness={0.7} />
      </mesh>
      <group ref={eyes}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.05 * s, 0.0, -0.128]} scale={[0.016, 0.022, 0.01]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#3a2a40" />
          </mesh>
        ))}
      </group>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.085 * s, -0.045, -0.105]} scale={[0.026, 0.016, 0.01]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={look.blush} transparent opacity={0.7} />
        </mesh>
      ))}
      {/* hair: crown, back half, bangs and a long fall down the back */}
      <mesh position={[0, 0.008, 0.004]} castShadow>
        <sphereGeometry args={[0.152, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={look.hair} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.0, 0.006]} castShadow>
        <sphereGeometry args={[0.152, 28, 16, 0, Math.PI, 0, Math.PI]} />
        <meshStandardMaterial color={look.hair} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.085, -0.11]} rotation-x={0.5} scale={[0.14, 0.045, 0.05]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color={look.hair} roughness={0.55} />
      </mesh>
      <group ref={hair}>
        <mesh position={[0, -0.2, 0.07]} scale={[1.15, 1, 0.55]} castShadow>
          <capsuleGeometry args={[0.12, 0.3, 6, 16]} />
          <meshStandardMaterial color={look.hair} roughness={0.55} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.13 * s, -0.14, 0.0]} scale={[0.4, 1, 0.6]} castShadow>
            <capsuleGeometry args={[0.07, 0.22, 6, 10]} />
            <meshStandardMaterial color={look.hair} roughness={0.55} />
          </mesh>
        ))}
      </group>
      {/* headphones */}
      <mesh position-y={0.005}>
        <torusGeometry args={[0.162, 0.014, 8, 32, Math.PI]} />
        <meshStandardMaterial color={look.headphones} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.158 * s, -0.01, 0]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.045, 20]} />
          <meshStandardMaterial color={look.headphoneCups} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Body({ pokedAt }: { pokedAt: MutableRefObject<number> }) {
  const torso = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (torso.current) torso.current.scale.y = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.012;
  });
  return (
    <group>
      {/* legs */}
      <mesh position={[0, 0.54, 0.02]} scale={[0.17, 0.1, 0.15]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={look.pants} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Capsule
            r={0.075}
            len={0.3}
            color={look.pants}
            position={[0.09 * s, 0.53, -0.18]}
            rotation-x={Math.PI / 2}
          />
          <Capsule r={0.065} len={0.32} color={look.pants} position={[0.09 * s, 0.3, -0.36]} />
          <RoundedBox
            args={[0.1, 0.07, 0.19]}
            radius={0.03}
            position={[0.09 * s, 0.045, -0.41]}
            castShadow
          >
            <meshStandardMaterial color={look.shoes} />
          </RoundedBox>
        </group>
      ))}
      <group ref={torso}>
        <Capsule
          r={0.15}
          len={0.26}
          color={look.sweater}
          position={[0, 0.8, 0.02]}
          rotation-x={-0.12}
          scale={[1.05, 1, 0.85]}
        />
        <mesh position={[0, 1.04, -0.02]}>
          <cylinderGeometry args={[0.048, 0.05, 0.08, 12]} />
          <meshStandardMaterial color={look.skin} />
        </mesh>
        <Arm side={1} pokedAt={pokedAt} />
        <Arm side={-1} pokedAt={pokedAt} />
        <Head pokedAt={pokedAt} />
      </group>
    </group>
  );
}

function Chair() {
  return (
    <group>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation-y={a}>
            <mesh position={[0.14, 0.07, 0]} castShadow>
              <boxGeometry args={[0.28, 0.03, 0.04]} />
              <meshStandardMaterial color={palette.metal} />
            </mesh>
            <mesh position={[0.27, 0.03, 0]}>
              <sphereGeometry args={[0.03, 10, 8]} />
              <meshStandardMaterial color="#8f7fb0" />
            </mesh>
          </group>
        );
      })}
      <mesh position-y={0.25}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 10]} />
        <meshStandardMaterial color={palette.metal} metalness={0.4} roughness={0.4} />
      </mesh>
      <RoundedBox
        args={[0.5, 0.08, 0.48]}
        radius={0.035}
        position-y={0.45}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={palette.lilac} />
      </RoundedBox>
      <mesh position={[0, 0.58, 0.27]}>
        <boxGeometry args={[0.06, 0.22, 0.03]} />
        <meshStandardMaterial color={palette.metal} />
      </mesh>
      <RoundedBox
        args={[0.46, 0.5, 0.07]}
        radius={0.035}
        position={[0, 0.88, 0.29]}
        rotation-x={0.08}
        castShadow
      >
        <meshStandardMaterial color={palette.lilac} />
      </RoundedBox>
    </group>
  );
}

/** Karen at the desk, typing. Click to get a wave. */
export function Avatar(props: ThreeElements['group']) {
  const swivel = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (swivel.current) swivel.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.04;
  });
  return (
    <group {...props}>
      <group ref={swivel}>
        <Chair />
        <Critter
          label="Karen"
          sub="Probably prototyping something"
          labelAt={[0, 1.55, 0]}
          reaction="👋"
          hop={false}
        >
          {(pokedAt) => <Body pokedAt={pokedAt} />}
        </Critter>
      </group>
    </group>
  );
}
