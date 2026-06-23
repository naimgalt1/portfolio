import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { content } from "../i18n";
import ParallaxText from "./ParallaxText";
const Scene3D = lazy(() => import("./Scene3D"));

export default function SkillsSection({ lang }) {
  const t = content.skills[lang];
  const marqueeText = (t.marquee + t.marquee + t.marquee).trim();

  return (
    <section
      id="habilidades"
      className="module relative overflow-hidden bg-[#0A0A0A] text-white"
      style={{ zIndex: 4 }}
      data-testid="section-habilidades"
    >
      <div className="absolute inset-0 grid-bg-dark pointer-events-none"></div>

      {/* 3D cube accent — desktop only, fully inside viewport, larger room */}
      <div className="hidden lg:block absolute right-6 top-24 w-[460px] h-[460px] xl:w-[540px] xl:h-[540px] pointer-events-none">
        <Suspense fallback={null}>
          <Scene3D shape="cube" color="#00E5FF" scale={1.3} className="w-full h-full" cameraZ={5.2} />
        </Suspense>
      </div>

      {/* Kinetic outline marquee BG — centered on mobile/tablet, slides down on desktop to fill bottom */}
      <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-center lg:justify-end lg:pb-24 pointer-events-none select-none opacity-40">
        <div className="marquee-track">
          <span className="outline-text-light text-[18vw] leading-none whitespace-nowrap pr-12">
            {marqueeText}
          </span>
          <span className="outline-text-light text-[18vw] leading-none whitespace-nowrap pr-12">
            {marqueeText}
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24 lg:py-28 lg:min-h-screen flex flex-col">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-mono text-[0.72rem] tracking-[0.25em] uppercase mb-4 text-white/70"
            >
              {t.tag}
            </motion.div>
            <ParallaxText distance={80}>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="font-display text-4xl sm:text-5xl lg:text-7xl"
                data-testid="skills-title"
              >
                {t.title}.
              </motion.h2>
            </ParallaxText>
          </div>
          <div className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-white/50">
            CORE / 2026
          </div>
        </div>

        {/* Frosted glass panel with groups */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-dark mt-12 p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          data-testid="skills-glass-panel"
        >
          {t.groups.map((g, i) => (
            <div key={g.k} className={`${i < t.groups.length - 1 ? "lg:border-r border-white/15 lg:pr-6" : ""}`}>
              <div className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-[#00E5FF] mb-3">
                0{i + 1} · {g.k}
              </div>
              <ul className="space-y-2">
                {g.v.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 font-body text-base sm:text-lg"
                  >
                    <span className="inline-block w-1.5 h-1.5 bg-[#B6FF3C]"></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
