import { useEffect, useRef } from "react";
import * as THREE from "three";

const MAX_BALLOONS = 60;
const SHADES = ["#ffffff", "#e6e6e6", "#bdbdbd", "#8a8a8a", "#5c5c5c"];
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Posición objetivo de cada globo según la forma elegida. */
function formationTarget(name, i, n) {
  if (name === "círculo") {
    const a = (i / n) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 3.4, Math.sin(a) * 3.4 - 0.4, 0);
  }
  if (name === "corazón") {
    const t = (i / n) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return new THREE.Vector3(x * 0.2, y * 0.2 + 0.4, 0);
  }
  if (name === "línea") {
    return new THREE.Vector3((i / Math.max(n - 1, 1) - 0.5) * 9, 0, 0);
  }
  return null;
}

/**
 * Lienzo 3D en blanco y negro: un clic suelta un globo y, al elegir una forma,
 * los globos se colocan solos. Todo ocurre en el navegador; no se guarda nada.
 */
export default function BalloonScene({ formation, clearSignal, onCountChange }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const countRef = useRef(onCountChange);

  useEffect(() => {
    countRef.current = onCountChange;
  }, [onCountChange]);

  useEffect(() => {
    const mount = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 14;
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 8, 10);
    scene.add(key);

    const sphere = new THREE.SphereGeometry(0.55, 32, 24);
    const shadeMats = SHADES.map(
      (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.02 })
    );
    const stringMat = new THREE.LineBasicMaterial({ color: 0x777777 });

    const balloons = [];
    const state = { formation: "libre" };

    const emitCount = () => countRef.current?.(balloons.length);

    const removeBalloon = (b) => {
      scene.remove(b.mesh, b.string);
      b.geo.dispose();
      balloons.splice(balloons.indexOf(b), 1);
    };

    const applyFormation = () => {
      const n = balloons.length;
      balloons.forEach((b, i) => {
        b.target = formationTarget(state.formation, i, n);
      });
    };

    const addBalloon = (x, y) => {
      if (balloons.length >= MAX_BALLOONS) removeBalloon(balloons[0]);
      const mesh = new THREE.Mesh(sphere, shadeMats[Math.floor(Math.random() * shadeMats.length)]);
      mesh.scale.set(1, 1.15, 1);
      mesh.position.set(x, y, 0);
      const positions = new Float32Array(6);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const string = new THREE.Line(geo, stringMat);
      scene.add(mesh, string);
      balloons.push({ mesh, string, geo, phase: Math.random() * Math.PI * 2, speed: rand(0.2, 0.45), target: null });
      emitCount();
    };

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointerNdc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        addBalloon(clamp(hit.x, -6, 6), clamp(hit.y, -4, 4));
        if (state.formation !== "libre") applyFormation();
      }
    };
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frameId;
    let last = performance.now();
    let time = 0;
    const tick = (now) => {
      frameId = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      for (const b of balloons) {
        const { mesh } = b;
        if (b.target) {
          const ease = Math.min(1, dt * 2.2);
          mesh.position.x += (b.target.x - mesh.position.x) * ease;
          mesh.position.y += (b.target.y + Math.sin(time * 1.6 + b.phase) * 0.08 - mesh.position.y) * ease;
        } else {
          mesh.position.y += b.speed * dt;
          mesh.position.x += Math.sin(time * 0.9 + b.phase) * 0.25 * dt;
          if (mesh.position.y > 5.6) mesh.position.y = -5.8;
        }
        mesh.rotation.z = Math.sin(time * 1.2 + b.phase) * 0.08;

        const pos = b.geo.attributes.position.array;
        pos[0] = mesh.position.x;
        pos[1] = mesh.position.y - 0.6;
        pos[2] = 0;
        pos[3] = mesh.position.x;
        pos[4] = mesh.position.y - 2.0;
        pos[5] = 0;
        b.geo.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(tick);

    sceneRef.current = {
      setFormation(name) {
        state.formation = name;
        applyFormation();
      },
      clear() {
        [...balloons].forEach(removeBalloon);
        emitCount();
      },
    };

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      balloons.forEach((b) => b.geo.dispose());
      sphere.dispose();
      shadeMats.forEach((m) => m.dispose());
      stringMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setFormation(formation);
  }, [formation]);

  useEffect(() => {
    if (clearSignal) sceneRef.current?.clear();
  }, [clearSignal]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
