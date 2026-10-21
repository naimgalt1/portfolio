import { useEffect, useRef } from "react";
import * as THREE from "three";

// Formas de cabeza: escala del elipsoide y estrechamiento de la barbilla.
const HEAD_SHAPES = [
  { sx: 1.0, sy: 1.2, sz: 0.95, egg: 0 },
  { sx: 1.12, sy: 1.08, sz: 1.0, egg: 0 },
  { sx: 0.9, sy: 1.22, sz: 0.95, egg: 0.25 },
  { sx: 1.25, sy: 1.02, sz: 1.0, egg: 0 },
];

// Direcciones (sobre la esfera) donde van los rasgos.
const ANCHOR_DIRS = {
  eyeL: [-0.38, 0.14, 0.9],
  eyeR: [0.38, 0.14, 0.9],
  nose: [0, -0.02, 1],
  mouth: [0, -0.5, 0.85],
  earL: [-1, 0.05, 0.05],
  earR: [1, 0.05, 0.05],
};
const SPIKE_DIRS = [
  [-0.5, 0.8, 0.3],
  [-0.2, 0.95, 0.25],
  [0.1, 1, 0.15],
  [0.4, 0.9, 0.2],
  [0.65, 0.7, 0.3],
];

const BRUSH = 0.35; // alcance de la deformación (unidades 3D)
const MAX_OFF = 0.8; // desplazamiento máximo por vértice
const SIGMA_FEATURE = 0.25; // radio para calcular el movimiento de cada rasgo

function shapeTransform(index, x, y, z) {
  const { sx, sy, sz, egg } = HEAD_SHAPES[index];
  const taper = 1 - egg * Math.max(0, -y);
  return new THREE.Vector3(x * sx * taper, y * sy, z * sz);
}

function disposeTree(obj) {
  obj.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
  });
}

/** Ojos (una unidad; el de la derecha es un clon). */
function buildEye(option, ink) {
  const g = new THREE.Group();
  if (option === 0) g.add(new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), ink));
  if (option === 1) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), ink);
    m.scale.set(1.5, 0.6, 0.5);
    g.add(m);
  }
  if (option === 2) {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 12, 24), ink));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), ink));
  }
  if (option === 3) {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 10, 20, Math.PI), ink);
    arc.rotation.z = Math.PI;
    g.add(arc);
  }
  return g;
}

function buildNose(option, ink) {
  const g = new THREE.Group();
  if (option === 0) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), ink);
    m.scale.set(1, 0.8, 0.7);
    g.add(m);
  }
  if (option === 1) {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 10, 16, Math.PI * 0.9), ink);
    arc.rotation.z = -Math.PI * 0.45;
    g.add(arc);
  }
  if (option === 2) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.24, 3), ink);
    cone.rotation.x = Math.PI / 2;
    g.add(cone);
  }
  if (option === 3) {
    for (const x of [-0.07, 0.07]) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), ink);
      m.position.x = x;
      g.add(m);
    }
  }
  return g;
}

function buildMouth(option, ink) {
  if (option === 0) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 10, 28, Math.PI), ink);
    m.rotation.z = Math.PI;
    return m;
  }
  if (option === 1) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), ink);
    m.scale.set(1.2, 0.5, 0.4);
    return m;
  }
  if (option === 2) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12), ink);
    m.rotation.z = Math.PI / 2;
    return m;
  }
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 10, 20, 1.4), ink);
  m.rotation.z = -0.4;
  return m;
}

/** Oreja derecha; la izquierda es un espejo. */
function buildEar(option, ear) {
  if (option === 0) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), ear);
    m.scale.set(0.4, 1, 0.6);
    return m;
  }
  if (option === 1) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 16), ear);
    m.rotation.z = -Math.PI / 2;
    m.scale.set(1, 1, 0.5);
    return m;
  }
  if (option === 2) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16), ear);
    m.scale.set(0.35, 1.25, 0.6);
    return m;
  }
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), ear);
  m.scale.set(0.4, 1, 0.6);
  return m;
}

/**
 * Cara 3D deformable. Arrastrar sobre la cabeza la deforma; Shift + arrastrar
 * (o botón derecho) gira la cabeza. Los rasgos siguen la superficie.
 */
export default function FaceScene({ parts, resetSignal }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.25, 7.2);
    camera.lookAt(0, 0.1, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const rig = new THREE.Group();
    scene.add(rig);
    const head = new THREE.Group();
    rig.add(head);

    const headMat = new THREE.MeshStandardMaterial({ color: 0xf6f6f6, roughness: 0.6 });
    const ink = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    const earMat = new THREE.MeshStandardMaterial({ color: 0xe4e4e4, roughness: 0.6 });

    const sphereGeom = new THREE.SphereGeometry(1, 48, 36);
    const sphereSrc = sphereGeom.attributes.position.array;
    const count = sphereGeom.attributes.position.count;
    const headGeom = sphereGeom.clone();
    const hairGeom = sphereGeom.clone();
    const headMesh = new THREE.Mesh(headGeom, headMat);
    const hairMesh = new THREE.Mesh(hairGeom, ink);
    hairMesh.visible = false;
    head.add(headMesh, hairMesh);

    const base = new Float32Array(count * 3);
    const off = new Float32Array(count * 3);
    const anchorBase = {};
    const features = [];
    const state = { face: -1, hairCut: 0, hairScale: 1 }; // -1: la forma aún no se ha calculado
    const tmp = new THREE.Vector3();

    // Desplazamiento medio de los vértices cerca de un punto (para que los rasgos sigan la piel).
    const avgOffset = (v, out) => {
      let sx = 0;
      let sy = 0;
      let sz = 0;
      let sw = 0;
      for (let i = 0; i < count; i += 1) {
        const dx = base[i * 3] - v.x;
        const dy = base[i * 3 + 1] - v.y;
        const dz = base[i * 3 + 2] - v.z;
        const w = Math.exp(-(dx * dx + dy * dy + dz * dz) / (2 * SIGMA_FEATURE * SIGMA_FEATURE));
        sx += off[i * 3] * w;
        sy += off[i * 3 + 1] * w;
        sz += off[i * 3 + 2] * w;
        sw += w;
      }
      return sw > 1e-6 ? out.set(sx / sw, sy / sw, sz / sw) : out.set(0, 0, 0);
    };

    const refresh = () => {
      const pos = headGeom.attributes.position.array;
      for (let i = 0; i < count * 3; i += 1) pos[i] = base[i] + off[i];
      headGeom.attributes.position.needsUpdate = true;
      headGeom.computeVertexNormals();

      if (hairMesh.visible) {
        const hp = hairGeom.attributes.position.array;
        for (let i = 0; i < count; i += 1) {
          const y = pos[i * 3 + 1];
          const keep = y > state.hairCut;
          hp[i * 3] = keep ? pos[i * 3] * state.hairScale : 0;
          hp[i * 3 + 1] = keep ? pos[i * 3 + 1] * state.hairScale : 0;
          hp[i * 3 + 2] = keep ? pos[i * 3 + 2] * state.hairScale : 0;
        }
        hairGeom.attributes.position.needsUpdate = true;
        hairGeom.computeVertexNormals();
      }

      for (const f of features) {
        avgOffset(f.base, tmp);
        f.obj.position.copy(f.base).add(tmp);
      }
    };

    const clearFeatures = () => {
      for (const f of features) {
        head.remove(f.obj);
        disposeTree(f.obj);
      }
      features.length = 0;
    };

    const addFeature = (obj, baseVec) => {
      head.add(obj);
      features.push({ obj, base: baseVec.clone() });
    };

    const rebuildFeatures = (p) => {
      clearFeatures();
      const eyeL = buildEye(p.eyes, ink);
      const eyeR = eyeL.clone();
      addFeature(eyeL, anchorBase.eyeL);
      addFeature(eyeR, anchorBase.eyeR);

      addFeature(buildNose(p.nose, ink), anchorBase.nose);
      addFeature(buildMouth(p.mouth, ink), anchorBase.mouth);

      const earR = buildEar(p.ears, earMat);
      const earL = earR.clone();
      earL.scale.x = -1;
      addFeature(earR, anchorBase.earR);
      addFeature(earL, anchorBase.earL);

      if (p.hair === 2) {
        const up = new THREE.Vector3(0, 1, 0);
        for (const d of SPIKE_DIRS) {
          const dir = new THREE.Vector3(...d).normalize();
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 12), ink);
          spike.quaternion.setFromUnitVectors(up, dir);
          addFeature(spike, shapeTransform(state.face, dir.x, dir.y, dir.z));
        }
      }
    };

    const setFace = (index) => {
      state.face = index;
      for (let i = 0; i < count; i += 1) {
        const v = shapeTransform(index, sphereSrc[i * 3], sphereSrc[i * 3 + 1], sphereSrc[i * 3 + 2]);
        base[i * 3] = v.x;
        base[i * 3 + 1] = v.y;
        base[i * 3 + 2] = v.z;
      }
      off.fill(0);
      for (const name of Object.keys(ANCHOR_DIRS)) {
        const d = new THREE.Vector3(...ANCHOR_DIRS[name]).normalize();
        anchorBase[name] = shapeTransform(index, d.x, d.y, d.z);
      }
    };

    const setParts = (p) => {
      if (p.face !== state.face) setFace(p.face);
      state.hairCut = p.hair === 1 ? 0.15 : -0.2;
      state.hairScale = p.hair === 1 ? 1.03 : 1.08;
      hairMesh.visible = p.hair === 1 || p.hair === 3;
      rebuildFeatures(p);
      refresh();
    };

    setParts(parts);

    // ---- Interacción ----
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let drag = null;
    let userRot = 0;

    const toNdc = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    };

    const handleDown = (event) => {
      renderer.domElement.setPointerCapture(event.pointerId);
      if (event.shiftKey || event.button === 2) {
        drag = { mode: "rotate", x: event.clientX };
        renderer.domElement.style.cursor = "ew-resize";
        return;
      }
      toNdc(event);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObject(headMesh, false)[0];
      if (hit) {
        drag = { mode: "deform", x: event.clientX, y: event.clientY, local: head.worldToLocal(hit.point.clone()) };
        renderer.domElement.style.cursor = "grabbing";
      }
    };

    const handleMove = (event) => {
      if (!drag) return;
      if (drag.mode === "rotate") {
        userRot += (event.clientX - drag.x) * 0.01;
        drag.x = event.clientX;
        return;
      }
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      drag.x = event.clientX;
      drag.y = event.clientY;

      // Movimiento en pantalla -> movimiento en espacio local de la cabeza
      const dist = camera.position.distanceTo(head.getWorldPosition(tmp));
      const perPixel = (2 * Math.tan((camera.fov * Math.PI) / 360) * dist) / mount.clientHeight;
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      const worldDelta = right.multiplyScalar(dx * perPixel).add(up.multiplyScalar(-dy * perPixel));
      const inv = head.getWorldQuaternion(new THREE.Quaternion()).invert();
      const dl = worldDelta.applyQuaternion(inv);

      const pos = headGeom.attributes.position.array;
      for (let i = 0; i < count; i += 1) {
        const px = base[i * 3] + off[i * 3];
        const py = base[i * 3 + 1] + off[i * 3 + 1];
        const pz = base[i * 3 + 2] + off[i * 3 + 2];
        const d2 = (px - drag.local.x) ** 2 + (py - drag.local.y) ** 2 + (pz - drag.local.z) ** 2;
        const w = Math.exp(-d2 / (2 * BRUSH * BRUSH));
        if (w < 0.01) continue;
        off[i * 3] = Math.max(-MAX_OFF, Math.min(MAX_OFF, off[i * 3] + dl.x * w));
        off[i * 3 + 1] = Math.max(-MAX_OFF, Math.min(MAX_OFF, off[i * 3 + 1] + dl.y * w));
        off[i * 3 + 2] = Math.max(-MAX_OFF, Math.min(MAX_OFF, off[i * 3 + 2] + dl.z * w));
      }
      drag.local.add(dl);
      refresh();
      void pos;
    };

    const handleUp = (event) => {
      drag = null;
      renderer.domElement.style.cursor = "grab";
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    };

    const preventMenu = (event) => event.preventDefault();
    renderer.domElement.addEventListener("pointerdown", handleDown);
    renderer.domElement.addEventListener("pointermove", handleMove);
    renderer.domElement.addEventListener("pointerup", handleUp);
    renderer.domElement.addEventListener("pointercancel", handleUp);
    renderer.domElement.addEventListener("contextmenu", preventMenu);

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
    let time = 0;
    let last = performance.now();
    const tick = (now) => {
      frameId = requestAnimationFrame(tick);
      time += Math.min((now - last) / 1000, 0.05);
      last = now;
      rig.rotation.y = userRot + Math.sin(time * 0.6) * 0.25;
      renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(tick);

    apiRef.current = {
      setParts,
      reset() {
        off.fill(0);
        refresh();
      },
    };

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handleDown);
      renderer.domElement.removeEventListener("pointermove", handleMove);
      renderer.domElement.removeEventListener("pointerup", handleUp);
      renderer.domElement.removeEventListener("pointercancel", handleUp);
      renderer.domElement.removeEventListener("contextmenu", preventMenu);
      clearFeatures();
      sphereGeom.dispose();
      headGeom.dispose();
      hairGeom.dispose();
      headMat.dispose();
      ink.dispose();
      earMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setParts(parts);
  }, [parts]);

  useEffect(() => {
    if (resetSignal) apiRef.current?.reset();
  }, [resetSignal]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
