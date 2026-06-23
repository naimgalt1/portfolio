import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { content } from "../i18n";

const Scene3D = lazy(() =>
  new Promise((resolve) =>
    setTimeout(() => resolve(import("./Scene3D")), 1000)
  )
);

export default function HeroSection({ lang }) {
  const t = content.hero[lang];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="inicio"
      className="module grid-bg noise relative overflow-hidden bg-white"
      style={{ zIndex: 1 }}
      data-testid="section-inicio"
    >
      <div className="absolute inset-0 noise pointer-events-none"></div>

      <div className="absolute pointer-events-none
                      top-20 right-3 w-36 h-36
                      sm:top-24 sm:right-6 sm:w-52 sm:h-52
                      md:top-24 md:right-10 md:w-72 md:h-72
                      lg:top-28 lg:right-14 lg:w-[26rem] lg:h-[26rem]
                      xl:w-[30rem] xl:h-[30rem]">
        <Suspense fallback={null}>
          <Scene3D shape="moon" scale={1} className="w-full h-full" cameraZ={3.4} envPreset="studio" />
        </Suspense>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-16 lg:min-h-screen flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="font-mono text-[0.7rem] tracking-[0.22em] uppercase b-border px-3 py-1.5">
            {t.overline}
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[0.7rem] tracking-[0.18em] uppercase">
            <span>{t.location}</span>
            <span className="opacity-60">41.3851° N, 2.1734° E</span>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={mounted ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-xs sm:text-sm tracking-[0.22em] uppercase mb-4"
          >
            ▍ {t.role}
          </motion.div>

          <h1
            className="font-display leading-[0.85] text-[18vw] sm:text-[14vw] lg:text-[13vw] xl:text-[12rem] tracking-tighter break-words"
            data-testid="hero-title"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={mounted ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
            >
              {t.h1l1}.
            </motion.div>
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={mounted ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="pl-[6vw]"
            >
              {t.h1l2}
            </motion.div>
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={mounted ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="outline-text"
            >
              {t.h1l3}_
            </motion.div>
          </h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={mounted ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 max-w-xl font-body text-base sm:text-lg text-[#0A0A0A]/80"
          >
            {t.tagline}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={mounted ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" })}
              className="b-btn"
              data-testid="hero-cta-projects"
            >
              {t.cta1} →
            </button>
            <button
              onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
              className="b-btn ghost"
              data-testid="hero-cta-contact"
            >
              {t.cta2}
            </button>
          </motion.div>
        </div>

        <div className="mt-10 flex items-end justify-between">
          <button
            onClick={() => document.getElementById("sobre-mi")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center