import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { content } from "../i18n";

export default function Navbar({ lang, setLang }) {
  const items = content.nav[lang];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleScroll = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] glass border-b border-black"
        data-testid="navbar"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
          <button
            onClick={() => handleScroll("inicio")}
            className="font-mono text-[0.78rem] tracking-[0.22em] font-semibold"
            data-testid="brand-logo"
          >
            {content.brand}<span className="blink">_</span>
          </button>

          {/* Desktop nav (lg+) */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-links">
            {items.map((it, i) => (
              <button
                key={it.id}
                onClick={() => handleScroll(it.id)}
                className="font-mono text-[0.7rem] tracking-[0.22em] uppercase px-3 py-2 hover:bg-black hover:text-white transition-colors"
                data-testid={`nav-${it.id}-link`}
              >
                <span className="opacity-50 mr-1.5">0{i + 1}</span>
                {it.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center gap-1 b-border-2" data-testid="lang-toggle">
              <button
                onClick={() => setLang("es")}
                className={`font-mono text-[0.7rem] tracking-[0.22em] px-2.5 py-1.5 ${
                  lang === "es" ? "bg-black text-white" : "bg-transparent text-black"
                }`}
                data-testid="lang-es-button"
                aria-pressed={lang === "es"}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`font-mono text-[0.7rem] tracking-[0.22em] px-2.5 py-1.5 ${
                  lang === "en" ? "bg-black text-white" : "bg-transparent text-black"
                }`}
                data-testid="lang-en-button"
                aria-pressed={lang === "en"}
              >
                EN
              </button>
            </div>

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden b-border-2 p-1.5 bg-white hover:bg-black hover:text-white transition-colors"
              aria-label="Open menu"
              data-testid="nav-menu-button"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet fullscreen menu — sibling of header so it isn't constrained
          by the header's backdrop-filter containing block. */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[120] bg-white"
          data-testid="mobile-menu"
        >
          <div className="absolute inset-0 grid-bg pointer-events-none"></div>

          <div className="relative h-full flex flex-col bg-white/0">
            {/* Top bar */}
            <div className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-black bg-white">
              <span className="font-mono text-[0.78rem] tracking-[0.22em] font-semibold">
                {content.brand}<span className="blink">_</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="b-border-2 p-1.5 bg-white hover:bg-black hover:text-white transition-colors"
                aria-label="Close menu"
                data-testid="nav-menu-close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items — fill remaining height, distribute evenly, no scroll needed */}
            <nav className="relative z-10 flex-1 min-h-0 flex flex-col px-4 sm:px-8 py-4">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => handleScroll(it.id)}
                  className="group flex items-center justify-between border-b border-black/15 flex-1 min-h-0 py-2 text-left hover:pl-3 transition-all"
                  data-testid={`mobile-nav-${it.id}-link`}
                >
                  <span className="font-display text-[clamp(1.75rem,7vh,3.25rem)] leading-none tracking-tighter">
                    {it.label}
                  </span>
                  <span className="font-mono text-xs tracking-[0.22em] opacity-50 group-hover:opacity-100 shrink-0 ml-3">
                    0{i + 1} →
                  </span>
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="shrink-0 border-t border-black/20 px-4 sm:px-8 py-3 flex items-center justify-between font-mono text-[0.62rem] tracking-[0.22em] uppercase bg-white">
              <span>NAIM · GALET · NAIEB</span>
              <span className="opacity-60">v.01 · 2026</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
