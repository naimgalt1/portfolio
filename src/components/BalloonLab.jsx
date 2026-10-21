import { lazy, Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// La escena 3D solo se descarga cuando alguien abre la ventana.
const BalloonScene = lazy(() => import("./BalloonScene"));

const TEXT = {
  es: {
    open: "Abrir laboratorio",
    title: "laboratorio de globos",
    close: "Cerrar",
    clear: "Limpiar",
    count: "globos",
    hint: "Clic en el lienzo para soltar un globo. Elige una forma para que se coloquen solos.",
    loading: "Cargando…",
    forms: { libre: "libre", "círculo": "círculo", "corazón": "corazón", "línea": "línea" },
  },
  en: {
    open: "Open lab",
    title: "balloon lab",
    close: "Close",
    clear: "Clear",
    count: "balloons",
    hint: "Click the canvas to release a balloon. Pick a shape and they arrange themselves.",
    loading: "Loading…",
    forms: { libre: "free", "círculo": "circle", "corazón": "heart", "línea": "line" },
  },
};

function BalloonLabWindow({ lang, onClose }) {
  const t = TEXT[lang] ?? TEXT.es;
  const [formation, setFormation] = useState("libre");
  const [clearSignal, setClearSignal] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="balloon-lab-title"
        className="w-full max-w-3xl border-2 border-white bg-[#f2f2f2] text-black shadow-[8px_8px_0_0_#000]"
      >
        <div className="flex items-center justify-between bg-black px-3 py-2 text-white">
          <span id="balloon-lab-title" className="font-mono text-[0.7rem] uppercase tracking-[0.18em]">
            {t.title}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="border border-white px-2 font-mono text-xs leading-5 hover:bg-white hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-black px-3 py-3">
          {Object.keys(t.forms).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={formation === key}
              onClick={() => setFormation(key)}
              className={`border border-black px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] ${
                formation === key ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              {t.forms[key]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setClearSignal((s) => s + 1)}
            className="ml-auto border border-black bg-white px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] hover:bg-black hover:text-white"
          >
            {t.clear}
          </button>
        </div>

        <div className="relative h-[360px] bg-[#0a0a0a] sm:h-[460px]">
          <Suspense
            fallback={
              <div className="absolute inset-0 grid place-items-center font-mono text-xs text-white/60">{t.loading}</div>
            }
          >
            <BalloonScene formation={formation} clearSignal={clearSignal} onCountChange={setCount} />
          </Suspense>
        </div>

        <div className="flex items-center justify-between gap-4 px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.15em]">
          <span>{t.hint}</span>
          <span className="shrink-0">
            {count} {t.count}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Botón que abre el laboratorio en una ventana modal. */
export default function BalloonLabButton({ lang = "es" }) {
  const [open, setOpen] = useState(false);
  const t = TEXT[lang] ?? TEXT.es;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-white/40 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black"
      >
        {t.open} ↗
      </button>
      {open && <BalloonLabWindow lang={lang} onClose={() => setOpen(false)} />}
    </>
  );
}
