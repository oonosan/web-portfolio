import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { easing } from 'maath';
import { chapters, pets } from '../content';
import { eveningAmount, scroll } from '../scroll';
import { Room, WINDOW } from './Room';
import { Desk } from './furniture/Desk';
import { Bookshelf } from './furniture/Bookshelf';
import { Corkboard, Frames } from './furniture/WallDecor';
import { CatTree, Globe, Rug, Yarn } from './furniture/Props';
import { BushyPlant, HangingPlant, TallPlant, TrailingPlant } from './plants';
import { Avatar } from './characters/Avatar';
import { Cat, coats } from './characters/Cat';
import { DogBed, Shiba } from './characters/Shiba';
import { Critter } from './characters/Critter';
import { Hotspot } from './Hotspot';
import { palette } from './palette';

const CAT = 0.17;

const poses = chapters.map((c) => ({
  position: new THREE.Vector3(...c.camera.position),
  target: new THREE.Vector3(...c.camera.target),
  fov: c.camera.fov,
  portraitFov: c.camera.portraitFov ?? c.camera.fov * 1.45,
}));

/** Flies the camera between chapter poses as the page scrolls, with a little pointer parallax. */
function CameraRig() {
  const { camera, size } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const goalTarget = useMemo(() => new THREE.Vector3(), []);
  // start far away so the room "arrives" on load
  const target = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);
  const offset = useRef({ x: 0, y: 0 });
  const right = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const p = scroll.progress;
    const i = Math.min(Math.floor(p), poses.length - 1);
    const j = Math.min(i + 1, poses.length - 1);
    const k = p - i;
    const a = poses[i];
    const b = poses[j];

    goalPos.lerpVectors(a.position, b.position, k);
    goalTarget.lerpVectors(a.target, b.target, k);
    const portrait = size.width / size.height < 0.85;
    const fov = portrait
      ? THREE.MathUtils.lerp(a.portraitFov, b.portraitFov, k)
      : THREE.MathUtils.lerp(a.fov, b.fov, k);

    // parallax: nudge sideways/up based on the pointer, more when we are far away
    const dist = goalPos.distanceTo(goalTarget);
    right.subVectors(goalTarget, goalPos).cross(camera.up).normalize();
    goalPos.addScaledVector(right, state.pointer.x * 0.02 * dist);
    goalPos.y += state.pointer.y * 0.012 * dist;

    if (scroll.reducedMotion) {
      camera.position.copy(goalPos);
      target.copy(goalTarget);
      cam.fov = fov;
    } else {
      easing.damp3(camera.position, goalPos, 0.45, dt);
      easing.damp3(target, goalTarget, 0.45, dt);
      easing.damp(cam, 'fov', fov, 0.45, dt);
    }
    camera.lookAt(target);

    // Keep the room clear of the text: push it right on desktop, up on phones.
    const goalX = portrait ? 0 : -size.width * 0.14;
    const goalY = portrait ? size.height * 0.2 : 0;
    easing.damp(offset.current, 'x', goalX, 0.3, dt);
    easing.damp(offset.current, 'y', goalY, 0.3, dt);
    cam.setViewOffset(
      size.width,
      size.height,
      offset.current.x,
      offset.current.y,
      size.width,
      size.height,
    );
    cam.updateProjectionMatrix();
  });

  return null;
}

/** Daylight fades into a cozy evening as you reach the contact chapter. */
function Lights() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const windowLight = useRef<THREE.PointLight>(null);
  const { scene } = useThree();
  const colors = useMemo(
    () => ({
      bgDay: new THREE.Color('#ead9f2'),
      bgNight: new THREE.Color('#2e2643'),
      sunDay: new THREE.Color('#fff4f2'),
      sunNight: new THREE.Color('#8a7fd0'),
      skyDay: new THREE.Color('#fff4fb'),
      skyNight: new THREE.Color('#7a6aa8'),
    }),
    [],
  );
  const bg = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const e = eveningAmount();
    bg.lerpColors(colors.bgDay, colors.bgNight, e);
    scene.background = bg;
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(2.4, 0.35, e);
      sun.current.color.lerpColors(colors.sunDay, colors.sunNight, e);
    }
    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.lerp(1.3, 0.45, e);
      hemi.current.color.lerpColors(colors.skyDay, colors.skyNight, e);
    }
    if (windowLight.current) windowLight.current.intensity = THREE.MathUtils.lerp(2.2, 0.2, e);
  });

  return (
    <>
      <hemisphereLight ref={hemi} groundColor="#e6bccd" />
      <directionalLight
        ref={sun}
        position={[6, 10, 5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={25}
      />
      <pointLight
        ref={windowLight}
        position={[(WINDOW.x0 + WINDOW.x1) / 2, 1.8, -2.4]}
        color="#ffe6ef"
        distance={5}
        decay={1.5}
      />
    </>
  );
}

function Pets() {
  return (
    <>
      {/* Shiba asleep on the rug */}
      <group position={[1.45, 0.014, 1.05]} rotation-y={0.3}>
        <DogBed />
        <Critter label={pets.shiba.name} sub={pets.shiba.breed} labelAt={[0, 0.7, 0]} reaction="💤">
          {(poked) => <Shiba pokedAt={poked} />}
        </Critter>
      </group>

      {/* Calico loafing on the desk */}
      <Critter
        position={[0.02, 0.79, -2.55]}
        rotation-y={-0.5}
        scale={0.16}
        label={pets.calico.name}
        sub={pets.calico.breed}
        labelAt={[0, 2, 0]}
      >
        {(poked) => (
          <Cat
            coat={coats.calico}
            pose="loaf"
            tail="curl"
            pokedAt={poked}
            seed={1}
            eyeOpen={0.55}
          />
        )}
      </Critter>

      {/* Black cat on top of the bookshelf, tail hanging over the edge */}
      <Critter
        position={[-2.72, 2.0, 1.2]}
        rotation-y={0}
        scale={CAT}
        label={pets.black.name}
        sub={pets.black.breed}
        labelAt={[0, 2, 0]}
      >
        {(poked) => (
          <Cat coat={coats.black} pose="loaf" tail="hang" pokedAt={poked} seed={2} headYaw={0.6} />
        )}
      </Critter>

      {/* Balinese on the cat tree by the window */}
      <Critter
        position={[2.45, 1.265, -2.25]}
        rotation-y={0.35}
        scale={CAT * 1.05}
        label={pets.balinese.name}
        sub={pets.balinese.breed}
        labelAt={[0, 2.4, 0]}
      >
        {(poked) => (
          <Cat
            coat={coats.balinese}
            pose="sit"
            tail="curl"
            pokedAt={poked}
            seed={3}
            headYaw={0.7}
          />
        )}
      </Critter>

      {/* Tabby batting a ball of yarn */}
      <group position={[-0.25, 0.014, 1.15]} rotation-y={Math.PI / 2 + 0.3}>
        <Critter scale={CAT} label={pets.tabby.name} sub={pets.tabby.breed} labelAt={[0, 2, 0]}>
          {(poked) => (
            <Cat coat={coats.tabby} pose="play" tail="up" pokedAt={poked} seed={4} headYaw={0.15} />
          )}
        </Critter>
        <Yarn position={[0.03, 0, 0.27]} />
      </group>
    </>
  );
}

function Studio() {
  return (
    <group>
      <Room />

      <Hotspot chapter="what-i-do" labelAt={[-0.9, 1.75, -2.6]}>
        <Desk />
      </Hotspot>
      <Avatar position={[-0.9, 0, -1.72]} />

      <Hotspot chapter="impact" labelAt={[-1.25, 2.75, -2.9]}>
        <Frames position={[-1.25, 2.25, -3.02]} />
      </Hotspot>

      <Hotspot chapter="domains" labelAt={[1.2, 1.7, -2.85]}>
        <Globe position={[1.2, 1.02, -2.88]} />
      </Hotspot>
      <TrailingPlant position={[2.05, 1.02, -2.9]} seed={21} lengths={[0.25, 0.4, 0.3]} />

      <Hotspot chapter="toolkit" labelAt={[-2.9, 2.3, -1.05]}>
        <Corkboard position={[-2.98, 1.62, -1.05]} rotation-y={Math.PI / 2} />
      </Hotspot>

      <Hotspot chapter="background" labelAt={[-2.6, 2.6, 0.7]}>
        <Bookshelf position={[-2.78, 0, 0.95]} />
      </Hotspot>

      <Hotspot chapter="crew" labelAt={[0.6, 0.6, 1.9]}>
        <Rug position={[0.55, 0, 0.75]} />
      </Hotspot>

      <CatTree position={[2.45, 0, -2.25]} />
      <HangingPlant position={[0.45, 2.85, -3.0]} seed={5} />
      <TallPlant position={[-2.45, 0, 2.35]} seed={8} potColor={palette.pot} />
      <BushyPlant position={[-2.55, 0, -2.6]} seed={6} />
      <BushyPlant position={[2.45, 0, 2.3]} seed={10} potColor={palette.terracotta} scale={0.85} />

      <Pets />

      {/* dust motes drifting in the window light */}
      <Sparkles
        position={[1.6, 1.5, -2.0]}
        scale={[1.6, 1.4, 1.6]}
        count={40}
        size={2}
        speed={0.2}
        opacity={0.5}
        color="#fff4d6"
      />
    </group>
  );
}

export function Scene() {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ position: [16, 13, 4], fov: 32, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
      aria-hidden="true"
    >
      <CameraRig />
      <Lights />
      <Studio />
      <ContactShadows
        position={[-0.1, -0.46, -0.1]}
        scale={14}
        blur={2.6}
        opacity={0.4}
        color="#7a5296"
        far={3}
        frames={1}
      />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={0.7} />
        <Vignette offset={0.3} darkness={0.2} />
      </EffectComposer>
    </Canvas>
  );
}
