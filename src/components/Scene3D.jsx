import React, { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";

/* Procedural normal map — hammered/dimpled metal pattern so the rotation
   is clearly visible on a metallic sphere (pure chrome looks static
   because reflections are world-space). */
function buildMetalNormalMap() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d");

  // Neutral normal (z up) = rgb(128,128,255)
  ctx.fillStyle = "rgb(128,128,255)";
  ctx.fillRect(0, 0, 1024, 512);

  // Big hammered dimples
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 14 + Math.random() * 28;
    const dx = (Math.random() - 0.5) * 90;
    const dy = (Math.random() - 0.5) * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgb(${Math.round(128 + dx)}, ${Math.round(128 + dy)}, 255)`);
    g.addColorStop(1, "rgba(128,128,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smaller noise dots for micro-surface
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 3;
    const dx = (Math.random() - 0.5) * 50;
    const dy = (Math.random() - 0.5) * 50;
    ctx.fillStyle = `rgb(${Math.round(128 + dx)}, ${Math.round(128 + dy)}, 255)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function Moon({ scale = 1 }) {
  const ref = useRef();
  const normalMap = useMemo(() => buildMetalNormalMap(), []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.28;
  });
  return (
    <mesh ref={ref} scale={scale}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhysicalMaterial
        color="#d6d8dc"
        metalness={0.9}
        roughness={0.28}
        clearcoat={0.6}
        clearcoatRoughness={0.2}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.7, 0.7)}
        envMapIntensity={1.7}
      />
    </mesh>
  );
}

function GlossSphere({ position = [0, 0, 0], scale = 1, color = "#00E5FF" }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.25}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={1}
          iridescenceIOR={1.6}
          iridescenceThicknessRange={[100, 800]}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

function GlossTorus({ position = [0, 0, 0], scale = 1, color = "#B6FF3C" }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.25;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[1, 0.35, 20, 56]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.4}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={0.8}
          iridescenceIOR={1.5}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

function GlossCube({ position = [0, 0, 0], scale = 1, color = "#007AFF" }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.5}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={1}
          iridescenceIOR={1.7}
          envMapIntensity={1.3}
        />
      </mesh>
    </Float>
  );
}

/* Hero piece — a chrome-iridescent torus knot, simple but striking */
function HeroKnot({ position = [0, 0, 0], scale = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.18;
    ref.current.rotation.y = state.clock.elapsedTime * 0.22;
  });
  return (
    <Float speed={1} rotationIntensity={0.25} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusKnotGeometry args={[0.85, 0.28, 140, 22, 2, 3]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.95}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.04}
          iridescence={1}
          iridescenceIOR={1.85}
          iridescenceThicknessRange={[200, 1100]}
          envMapIntensity={1.6}
        />
      </mesh>
    </Float>
  );
}

const SHAPES = {
  sphere: GlossSphere,
  torus: GlossTorus,
  cube: GlossCube,
  knot: HeroKnot,
  moon: Moon,
};

export default function Scene3D({
  shape = "sphere",
  color,
  position = [0, 0, 0],
  scale = 1,
  className = "",
  cameraZ = 4,
  envPreset = "city",
}) {
  const Shape = SHAPES[shape] || GlossSphere;
  const isMoon = shape === "moon";
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1.25, 2]}
        camera={{ position: [0, 0, cameraZ], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        {isMoon ? (
          <>
            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 3, 4]} intensity={1.6} color="#ffffff" />
            <directionalLight position={[-4, -2, -3]} intensity={0.55} color="#a8c4ff" />
          </>
        ) : (
          <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 4, 5]} intensity={1.2} />
            <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#00E5FF" />
          </>
        )}
        <Suspense fallback={null}>
          <Shape position={position} scale={scale} color={color} />
          <Environment preset={isMoon ? "warehouse" : envPreset} />
        </Suspense>
      </Canvas>
    </div>
  );
}
