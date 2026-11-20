import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// Feel constants
const BASE_SPIN = 0.9; // rad/s
const SCROLL_SPIN_BOOST = 0.012;
const PARALLAX = 1.4;

const STEEL = "#e9eee9";
const STEEL_DARK = "#9aa4a0";
const SIGNAL = "#a8f05a";

function bladeGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.09, 0);
  s.bezierCurveTo(-0.22, 0.6, -0.2, 1.8, -0.05, 3.3);
  s.lineTo(0.02, 3.35);
  s.bezierCurveTo(0.08, 2.2, 0.14, 0.8, 0.09, 0);
  s.lineTo(-0.09, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 24 });
  g.translate(0, 0.25, -0.02);
  return g;
}

function Turbine({
  position,
  scale = 1,
  phase = 0,
  speedRef,
}: {
  position: [number, number, number];
  scale?: number;
  phase?: number;
  speedRef: React.MutableRefObject<number>;
}) {
  const rotor = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const blade = useMemo(() => bladeGeometry(), []);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (rotor.current) rotor.current.rotation.z -= dt * speedRef.current * (1 + phase * 0.15);
    if (head.current) head.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15 + phase) * 0.12;
  });
  return (
    <group position={position} scale={scale}>
      {/* tower */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.17, 6, 32]} />
        <meshStandardMaterial color={STEEL} metalness={0.35} roughness={0.35} />
      </mesh>
      {/* base ring */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.06, 32]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.4} />
      </mesh>
      <group ref={head} position={[0, 6.05, 0]}>
        {/* nacelle */}
        <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.17, 0.75, 8, 24]} />
          <meshStandardMaterial color={STEEL} metalness={0.4} roughness={0.3} />
        </mesh>
        {/* signal stripe */}
        <mesh position={[0, 0.0, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.176, 0.176, 0.05, 24]} />
          <meshStandardMaterial color={SIGNAL} emissive={SIGNAL} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        {/* rotor */}
        <group ref={rotor} position={[0, 0, 0.32]} rotation={[0, 0, phase]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.16, 0.38, 32]} />
            <meshStandardMaterial color={STEEL} metalness={0.5} roughness={0.25} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} geometry={blade} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
              <meshStandardMaterial color={STEEL} metalness={0.25} roughness={0.38} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/** Streaks of wind flowing across the scene. */
function WindParticles({ count = 900, speedRef }: { count?: number; speedRef: React.MutableRefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rnd() - 0.5) * 40;
      positions[i * 3 + 1] = rnd() * 12 - 1;
      positions[i * 3 + 2] = (rnd() - 0.5) * 24 - 4;
      speeds[i] = 0.6 + rnd() * 1.8;
    }
    return { positions, speeds };
  }, [count]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = points.current;
    if (!p) return;
    const attr = p.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const boost = speedRef.current / BASE_SPIN;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      arr[ix] = (arr[ix] ?? 0) + dt * (speeds[i] ?? 1) * 2.2 * boost;
      if ((arr[ix] ?? 0) > 20) arr[ix] = -20;
    }
    attr.needsUpdate = true;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={SIGNAL} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Rig({ speedRef }: { speedRef: React.MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const lastScroll = useRef(0);
  const target = useMemo(() => new THREE.Vector3(1.2, 4.6, 0), []);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const y = window.scrollY;
    const v = Math.abs(y - lastScroll.current);
    lastScroll.current = y;
    const desired = BASE_SPIN + Math.min(v * SCROLL_SPIN_BOOST * 60, 6);
    speedRef.current += (desired - speedRef.current) * (1 - Math.exp(-2.5 * dt));
    const progress = Math.min(y / window.innerHeight, 1.2);
    const cx = pointer.x * PARALLAX;
    const cy = 4.2 + pointer.y * PARALLAX * 0.5 + progress * 1.6;
    const cz = 11 - progress * 3.5;
    camera.position.x += (cx - camera.position.x) * (1 - Math.exp(-3 * dt));
    camera.position.y += (cy - camera.position.y) * (1 - Math.exp(-3 * dt));
    camera.position.z += (cz - camera.position.z) * (1 - Math.exp(-3 * dt));
    camera.lookAt(target);
  });
  return null;
}

export default function TurbineScene({ onReady }: { onReady?: () => void }) {
  const speedRef = useRef(BASE_SPIN);
  const readyRef = useRef(false);
  useEffect(() => () => {
    readyRef.current = false;
  }, []);
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 4.2, 11], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.setClearColor(0x000000, 0);
      }}
      onPointerMissed={() => undefined}
    >
      <fog attach="fog" args={["#141a17", 9, 34]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 6]} intensity={2.2} color="#fff1dc" />
      <directionalLight position={[-8, 4, -6]} intensity={1.4} color={SIGNAL} />
      <pointLight position={[3, 6.2, 3]} intensity={6} distance={8} color="#ffb35c" />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 6, 4]} scale={[12, 4, 1]} />
        <Lightformer intensity={1.2} color={SIGNAL} position={[-6, 2, -2]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
        <Lightformer intensity={1.4} color="#ffb35c" position={[6, 1, 0]} rotation-y={-Math.PI / 2} scale={[12, 2, 1]} />
      </Environment>

      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.25}>
        <Turbine position={[2.6, -1.2, 1.5]} scale={1.08} speedRef={speedRef} />
      </Float>
      <Turbine position={[-3.2, -1.2, -5]} scale={0.9} phase={1.1} speedRef={speedRef} />
      <Turbine position={[-9, -1.2, -12]} scale={0.95} phase={2.3} speedRef={speedRef} />
      <Turbine position={[8, -1.2, -10]} scale={0.85} phase={0.6} speedRef={speedRef} />
      <Turbine position={[14, -1.2, -18]} scale={0.9} phase={1.8} speedRef={speedRef} />

      {/* ground grid */}
      <gridHelper args={[80, 80, "#2c3a33", "#1c2420"]} position={[0, -1.2, 0]} />
      <WindParticles speedRef={speedRef} />
      <Rig speedRef={speedRef} />
      <ReadySignal
        onReady={() => {
          if (readyRef.current) return;
          readyRef.current = true;
          onReady?.();
        }}
      />
    </Canvas>
  );
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 2) onReady();
  });
  return null;
}
