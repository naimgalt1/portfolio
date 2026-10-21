import React from "react";
import { motion } from "framer-motion";
import { content } from "../i18n";
import ParallaxText from "./ParallaxText";
import MagneticChips from "./MagneticChips";
import BalloonLabButton from "./BalloonLab";

export default function SkillsSection({ lang }) {
  const t = content.skills[lang];
  const techItems = t.marquee.split("·").map((x) => x.trim()).filter(Boolean);

  return (
    <section
      id="habilidades"
      className="module relative overflow-hidden bg-[#0A0A0A] text-white"
      style={{ zIndex: 4 }}
      data-testid="section-habilidades"
    >
      <div className="absolute inset-0 grid-bg-dark pointer-events-none"></div>

      {/* Decorative tech chips, pulled toward the cursor — centered on mobile, bottom band on desktop */}
      <div className="absolute inset-x-0 top-[62%] lg:top-auto lg:bottom-24 -translate-y-1/2 lg:translate-y-0 pointer-events-none select-none opacity-70 z-0">
        <MagneticChips items={techItems} />
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
          <div className="flex items-center gap-4 flex-wrap">
            <BalloonLabButton lang={lang} />
            <div className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-white/50">
              CORE / 2026
            </div>
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
