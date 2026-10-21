// Piezas del creador de caras. Todo se dibuja en monocromo (negro sobre blanco).
// Coordenadas: origen en el centro de la cara; la cara mide unos 220 x 270.

const N_OUTLINE = 40;

/** Formas de cara: superelipses con un parámetro de estrechamiento para la barbilla. */
export const FACE_SHAPES = [
  { n: 2.2, a: 110, b: 135, egg: 0 },
  { n: 4.5, a: 105, b: 125, egg: 0 },
  { n: 2.4, a: 98, b: 140, egg: 0.18 },
  { n: 2.0, a: 120, b: 125, egg: 0 },
];

/** Puntos base del contorno de la cara según su forma. */
export function outlineBase(faceIndex) {
  const { n, a, b, egg } = FACE_SHAPES[faceIndex];
  const pts = [];
  for (let i = 0; i < N_OUTLINE; i += 1) {
    const t = (i / N_OUTLINE) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    let x = a * Math.sign(c) * Math.abs(c) ** (2 / n);
    const y = b * Math.sign(s) * Math.abs(s) ** (2 / n);
    x *= 1 - egg * (y / b);
    pts.push({ x, y });
  }
  return pts;
}

/** Puntos de anclaje de los rasgos (posición base). */
export const ANCHORS = {
  eyeL: { x: -42, y: -18 },
  eyeR: { x: 42, y: -18 },
  nose: { x: 0, y: 28 },
  mouth: { x: 0, y: 78 },
  earL: { x: -110, y: 8 },
  earR: { x: 110, y: 8 },
  hair: { x: 0, y: -128 },
};

/** Trazo suave a partir de puntos (curvas cuadráticas entre puntos medios). */
export function smoothPath(points) {
  const n = points.length;
  const mid = (p, q) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
  const m0 = mid(points[n - 1], points[0]);
  let d = `M${m0.x.toFixed(1)},${m0.y.toFixed(1)}`;
  for (let i = 0; i < n; i += 1) {
    const p = points[i];
    const m = mid(p, points[(i + 1) % n]);
    d += ` Q${p.x.toFixed(1)},${p.y.toFixed(1)} ${m.x.toFixed(1)},${m.y.toFixed(1)}`;
  }
  return d + "Z";
}

export const EYE_STYLES = [
  () => <circle r="8" fill="#000" />,
  () => <path d="M-16,0 Q0,-14 16,0 Q0,9 -16,0Z" fill="#000" />,
  () => (
    <>
      <circle r="11" fill="#fff" stroke="#000" strokeWidth="4" />
      <circle r="5" fill="#000" />
    </>
  ),
  () => <path d="M-14,-2 Q0,8 14,-2" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />,
];

export const NOSE_STYLES = [
  () => <circle r="5" fill="#000" />,
  () => <path d="M-3,-10 Q6,0 -2,10" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />,
  () => <path d="M0,-10 L8,8 L-8,8Z" fill="#000" />,
  () => (
    <>
      <circle cx="-5" r="3.5" fill="#000" />
      <circle cx="5" r="3.5" fill="#000" />
    </>
  ),
];

export const MOUTH_STYLES = [
  () => <path d="M-28,-6 Q0,22 28,-6" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" />,
  () => <path d="M-24,-4 Q0,30 24,-4 Z" fill="#000" />,
  () => <path d="M-24,0 L24,0" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" />,
  () => <path d="M-22,4 Q4,16 26,-10" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" />,
];

// Oreja derecha; la izquierda es la misma con un espejo horizontal.
export const EAR_STYLES = [
  () => <path d="M0,-20 C18,-24 22,20 0,22" fill="#fff" stroke="#000" strokeWidth="4" />,
  () => <path d="M0,-18 Q26,0 4,26 Q6,4 0,-18Z" fill="#fff" stroke="#000" strokeWidth="4" strokeLinejoin="round" />,
  () => <path d="M0,-28 C28,-30 30,30 0,30" fill="#fff" stroke="#000" strokeWidth="4" />,
  () => <path d="M0,-12 C12,-14 14,12 0,14" fill="#fff" stroke="#000" strokeWidth="4" />,
];

export const HAIR_STYLES = [
  null,
  () => (
    <path
      d="M-112,-40 C-118,-150 118,-150 112,-40 C100,-95 70,-80 50,-96 C20,-70 -20,-70 -50,-96 C-80,-80 -100,-95 -112,-40Z"
      fill="#000"
    />
  ),
  () => (
    <path
      d="M-108,-60 L-120,-130 L-80,-120 L-70,-160 L-30,-135 L0,-175 L30,-135 L70,-160 L80,-120 L120,-130 L108,-60 Q0,-80 -108,-60Z"
      fill="#000"
    />
  ),
  () => (
    <path
      d="M-118,-30 C-125,-160 125,-160 118,-30 L130,120 Q95,95 90,60 Q0,-70 -90,60 Q-95,95 -130,120Z"
      fill="#000"
    />
  ),
];
