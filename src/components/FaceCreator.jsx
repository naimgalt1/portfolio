import React, { useState } from "react";
import { EAR_STYLES, EYE_STYLES, HAIR_STYLES, MOUTH_STYLES, NOSE_STYLES, outlineBase, smoothPath } from "./faceParts";
import FaceScene from "./FaceScene";

const TEXT = {
  es: {
    toggle: "Creador de caras",
    hint: "Arrastra sobre la cara para deformarla. Shift + arrastrar (o botón derecho) gira la cabeza.",
    reset: "Restablecer forma",
    parts: { face: "Forma", eyes: "Ojos", nose: "Nariz", mouth: "Boca", ears: "Orejas", hair: "Pelo" },
  },
  en: {
    toggle: "Face creator",
    hint: "Drag over the face to deform it. Shift + drag (or right button) rotates the head.",
    reset: "Reset shape",
    parts: { face: "Shape", eyes: "Eyes", nose: "Nose", mouth: "Mouth", ears: "Ears", hair: "Hair" },
  },
};

const PART_GROUPS = ["face", "eyes", "nose", "mouth", "ears", "hair"];

/** Miniatura 2D de cada opción, para elegirla sin cargar la escena 3D. */
function Thumb({ viewBox, children }) {
  return (
    <svg viewBox={viewBox} width="100%" height="100%" aria-hidden="true">
      {children}
    </svg>
  );
}

function optionThumb(part, index) {
  if (part === "face") {
    return (
      <Thumb viewBox="-130 -150 260 300">
        <path d={smoothPath(outlineBase(index))} fill="#fff" stroke="#000" strokeWidth="6" />
      </Thumb>
    );
  }
  if (part === "eyes") return <Thumb viewBox="-30 -30 60 60"><g>{EYE_STYLES[index]()}</g></Thumb>;
  if (part === "nose") return <Thumb viewBox="-30 -30 60 60"><g>{NOSE_STYLES[index]()}</g></Thumb>;
  if (part === "mouth") return <Thumb viewBox="-40 -40 80 80"><g>{MOUTH_STYLES[index]()}</g></Thumb>;
  if (part === "ears") return <Thumb viewBox="-40 -40 80 80"><g>{EAR_STYLES[index]()}</g></Thumb>;
  return (
    <Thumb viewBox="-140 -190 280 320">
      {HAIR_STYLES[index] ? HAIR_STYLES[index]() : <circle r="6" fill="none" stroke="#000" strokeWidth="4" />}
    </Thumb>
  );
}

export default function FaceCreator({ lang = "es" }) {
  const t = TEXT[lang] ?? TEXT.es;
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState({ face: 0, eyes: 0, nose: 0, mouth: 0, ears: 0, hair: 0 });
  const [resetSignal, setResetSignal] = useState(0);

  const choose = (part, index) => setParts((prev) => ({ ...prev, [part]: index }));

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="face-creator-panel"
        className="flex w-full items-center justify-between border border-white/40 px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black"
      >
        <span>{t.toggle}</span>
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div
          id="face-creator-panel"
          className="mt-4 grid gap-6 border-2 border-white bg-[#f2f2f2] p-4 text-black sm:p-6 lg:grid-cols-[1fr_1.1fr]"
        >
          <div className="flex flex-col gap-3">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px] border border-black bg-white">
              <FaceScene parts={parts} resetSignal={resetSignal} />
            </div>
            <div className="flex items-center justify-between gap-3 font-mono text-[0.6rem] uppercase tracking-[0.15em]">
              <span>{t.hint}</span>
              <button
                type="button"
                onClick={() => setResetSignal((s) => s + 1)}
                className="shrink-0 border border-black px-3 py-1.5 hover:bg-black hover:text-white"
              >
                {t.reset}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {PART_GROUPS.map((part) => (
              <div key={part}>
                <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em]">{t.parts[part]}</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((index) => {
                    const active = parts[part] === index;
                    return (
                      <button
                        key={index}
                        type="button"
                        aria-pressed={active}
                        onClick={() => choose(part, index)}
                        className={`aspect-square border border-black p-1.5 ${
                          active ? "bg-[#d4d4d4] shadow-[inset_0_0_0_3px_#000]" : "bg-white hover:bg-[#ececec]"
                        }`}
                      >
                        {optionThumb(part, index)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
