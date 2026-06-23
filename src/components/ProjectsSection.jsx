import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { content } from "../i18n";
import ParallaxText from "./ParallaxText";

const COVERS = [
  "https://images.unsplash.com/photo-1745910020846-3d4d0088d24d?crop=entropy&cs=srgb&fm=jpg&w=940&q=85",
  "https://images.unsplash.com/photo-1526887593587-a307ea5d46b4?crop=entropy&cs=srgb&fm=jpg&w=940&q=85",
  "https://images.pexels.com/photos/14016664/pexels-photo-14016664.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];

export default function ProjectsSection({ lang }) {
  const t = content.projects[lang];

  return (
    <section
      id="proyectos"
      className="module relative overflow-hidden bg-white"
      style={{ zIndex: 3 }}
      data-testid="section-proyectos"
    >
      <div className="absolute inset-0 grid-bg opacity-80 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24 lg:py-28 lg:min-h-screen">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-mono text-[0.72rem] tracking-[0.25em] uppercase mb-4"
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
                data-testid="projects-title"
              >
                {t.title}.
              </motion.h2>
            </ParallaxText>
          </div>
          <div className="font-mono text-[0.7rem] tracking-[0.22em] uppercase opacity-60">
            03 / 03 · 2026
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5" data-testid="projects-grid">
          {t.items.map((p, i) => (
            <motion.article
              key={p.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="b-card group p-0"
              data-testid={`project-card-${p.n}`}
            >
              <div className="relative aspect-[5/4] overflow-hidden border-b border-black bg-[#F3F4F6]">
                <img
                  src={COVERS[i % COVERS.length]}
                  alt={p.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute top-3 left-3 font-mono text-[0.65rem] tracking-[0.22em] uppercase bg-black text-white px-2 py-1">
                  {p.n}
                </div>
                <div className="absolute top-3 right-3 size-9 grid place-items-center bg-white border border-black opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <div className="p-5 relative">
                <div className="aura" />
                <div className="font-mono text-[0.65rem] tracking-[0.22em] uppercase opacity-60">
                  {p.type}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl mt-1">{p.name}</h3>
                <p className="mt-2 text-sm text-[#0A0A0A]/75 leading-relaxed">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[0.62rem] tracking-[0.18em] uppercase b-border px-2 py-1 transition-all duration-200 cursor-default hover:bg-[#B6FF3C] hover:border-[#B6FF3C] hover:text-black hover:shadow-[0_0_12px_rgba(182,255,60,0.6)] hover:-translate-y-0.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
