import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { content } from "../i18n";
import ParallaxText from "./ParallaxText";
const Scene3D = lazy(() => import("./Scene3D"));

export default function AboutSection({ lang }) {
  const t = content.about[lang];

  return (
    <section
      id="sobre-mi"
      className="module relative overflow-hidden bg-[#F3F4F6]"
      style={{ zIndex: 2 }}
      data-testid="section-sobre-mi"
    >
      <div className="absolute inset-0 grid-bg opacity-70 pointer-events-none"></div>

      {/* 3D torus accent — desktop only, fully inside viewport */}
      <div className="hidden lg:block absolute left-8 bottom-24 w-[280px] h-[280px] xl:w-[340px] xl:h-[340px] pointer-events-none">
        <Suspense fallback={null}>
          <Scene3D shape="torus" color="#B6FF3C" scale={1} className="w-full h-full" cameraZ={6.8} />
        </Suspense>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24 lg:py-28 lg:min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[0.72rem] tracking-[0.25em] uppercase mb-8"
        >
          {t.tag}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1">
          <div className="lg:col-span-7">
            <ParallaxText distance={70}>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95] whitespace-pre-line"
                data-testid="about-title"
              >
                {t.title}
              </motion.h2>
            </ParallaxText>

            <div className="mt-10 max-w-2xl space-y-5 text-base sm:text-lg leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t.p1}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#0A0A0A]/75"
              >
                {t.p2}
              </motion.p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Portrait card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="b-border-2 bg-white relative overflow-hidden aspect-[4/5]"
              data-testid="about-portrait"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_aero-parallax-port/artifacts/nnyaqtup_Gemini_Generated_Image_9sxzst9sxzst9sxz.jpg"
                alt="Naim Galet portrait"
                className="w-full h-full object-cover grayscale contrast-110"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white mix-blend-difference">
                <span>NGN_001.RAW</span>
                <span>● REC</span>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-0 b-border-2 bg-white">
              {t.stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className={`p-4 ${i < 2 ? "border-r border-black" : ""}`}
                >
                  <div className="font-display text-2xl sm:text-3xl">{s.k}</div>
                  <div className="font-mono text-[0.6rem] tracking-[0.18em] uppercase opacity-70 mt-1">
                    {s.v}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
