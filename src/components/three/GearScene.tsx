import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const STEEL = "#cfd6d2";
const ZINC = "#ffb35c";
const SIGNAL = "#a8f05a";

function gearGeometry(teeth: number, radius: number, depth: number, hole: number) {
  const shape = new THREE.Shape();
  const inner = radius * 0.86;
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: Array<[number, number]> = [
      [Math.cos(a) * inner, Math.sin(a) * inner],
      [Math.cos(a + step * 0.2) * radius, Math.sin(a + step * 0.2) * radius],
      [Math.cos(a + step * 0.5) * radius, Math.sin(a + step * 0.5) * radius],
      [Math.cos(a + step * 0.7) * inner, Math.sin(a + step * 0.7) * inner],
    ];
    pts.forEach(([x, y], j) => (i === 0 && j === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
  }
  shape.closePath();
  const h = new THREE.Path();
  h.absarc(0, 0, hole, 0, Math.PI * 2, true);
  shape.holes.push(h);
  // spokes cutouts
  const spokes = 5;
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    const p = new THREE.Path();
    const r = (inner + hole) / 2;
    p.absarc(Math.cos(a) * r, Math.sin(a) * r, (inner - hole) * 0.26, 0, Math.PI * 2, true);
    shape.holes.push(p);
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3, curveSegments: 32 });
  g.center();
  return g;
}

function Gear({
  teeth,
  radius,
  position,
  speed,
  color,
}: {
  teeth: number;
  radius: number;
  position: [number, number, number];
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => gearGeometry(teeth, radius, 0.35, radius * 0.18), [teeth, radius]);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += Math.min(d, 0.05) * speed;
  });
  return (
    <mesh ref={ref} geometry={geo} position={position}>
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.28} />
    </mesh>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((state, d) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-3 * Math.min(d, 0.05));
    g.rotation.y += (pointer.x * 0.5 - 0.35 - g.rotation.y) * k;
    g.rotation.x += (-pointer.y * 0.35 + 0.25 - g.rotation.x) * k;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });
  // Gear ratios: angular speed inversely proportional to tooth count.
  return (
    <group ref={group}>
      <Gear teeth={24} radius={1.6} position={[0, 0, 0]} speed={0.4} color={STEEL} />
      <Gear teeth={12} radius={0.85} position={[2.33, 0.55, 0.05]} speed={-0.8} color={ZINC} />
      <Gear teeth={16} radius={1.1} position={[-1.65, -1.95, -0.05]} speed={-0.6} color={STEEL} />
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.9, 32]} />
        <meshStandardMaterial color={SIGNAL} emissive={SIGNAL} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function GearScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 7.5], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#fff1dc" />
      <directionalLight position={[-6, -2, -3]} intensity={1.6} color={SIGNAL} />
      <pointLight position={[3, 1, 3]} intensity={8} distance={9} color={ZINC} />
      <Environment resolution={256}>
        <Lightformer intensity={2.5} position={[0, 5, 5]} scale={[10, 3, 1]} />
        <Lightformer intensity={1.5} color={SIGNAL} position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={1.5} color={ZINC} position={[5, -1, 0]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <Rig />
    </Canvas>
  );
}
