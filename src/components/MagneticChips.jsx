import React, { useRef } from "react";

// Strength of the pull toward the pointer (0 = none, 1 = follows the cursor 1:1)
const PULL = 0.35;

function MagneticChip({ label }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * PULL;
    const y = (e.clientY - (r.top + r.height / 2)) * PULL;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="inline-block border border-white/30 bg-black/40 px-4 py-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-white/80 backdrop-blur-sm transition-[transform,background-color,color,border-color] duration-300 ease-out hover:bg-[#B6FF3C] hover:border-[#B6FF3C] hover:text-black will-change-transform"
    >
      {label}
    </span>
  );
}

/** Chips de tecnologías que se desplazan levemente hacia el cursor al pasar por encima. */
export default function MagneticChips({ items }) {
  return (
    <div aria-hidden="true" className="flex flex-wrap justify-center gap-3 px-6 max-w-5xl pointer-events-auto">
      {items.map((item) => (
        <MagneticChip key={item} label={item} />
      ))}
    </div>
  );
}
