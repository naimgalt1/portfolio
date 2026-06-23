import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";
import { content } from "../i18n";
import ParallaxText from "./ParallaxText";


export default function ContactSection({ lang }) {
  const t = content.contact[lang];
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const onSubmit = async (e) => {
  e.preventDefault();
  if (!form.name || !form.email || !form.message) {
    toast.error(t.err);
    return;
  }
  setSending(true);
  try {
    const res = await fetch("https://formspree.io/f/mnjkqqew", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(t.ok);
      setForm({ name: "", email: "", message: "" });
    } else {
      toast.error(t.err);
    }
  } catch {
    toast.error(t.err);
  } finally {
    setSending(false);
  }
};

  return (
    <section
      id="contacto"
      className="module relative overflow-hidden bg-[#0A0A0A] text-white"
      style={{ zIndex: 5 }}
      data-testid="section-contacto"
    >
      <div className="absolute inset-0 grid-bg-dark pointer-events-none"></div>

      {/* glow */}
      <div className="absolute top-24 -right-40 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.25), transparent 60%)" }} />
      <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(182,255,60,0.18), transparent 60%)" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24 lg:py-28 lg:min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[0.72rem] tracking-[0.25em] uppercase text-white/60 mb-4"
        >
          {t.tag}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl sm:text-6xl lg:text-9xl leading-[0.9]"
          data-testid="contact-title"
        >
          {t.title}
        </motion.h2>

        <p className="mt-6 max-w-xl text-base sm:text-lg text-white/70">
          {t.subtitle}
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
          <form
            onSubmit={onSubmit}
            className="lg:col-span-7 space-y-6"
            data-testid="contact-form"
          >
            <div>
              <label className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-white/60">
                01 / {t.name}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Naim Galet"
                className="b-input mt-1"
                data-testid="contact-name-input"
                required
              />
            </div>
            <div>
              <label className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-white/60">
                02 / {t.email}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="naimgalet78@gmail.com"
                className="b-input mt-1"
                data-testid="contact-email-input"
                required
              />
            </div>
            <div>
              <label className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-white/60">
                03 / {t.message}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={4}
                placeholder="..."
                className="b-input mt-1 resize-none"
                data-testid="contact-message-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="b-btn invert disabled:opacity-60"
              data-testid="contact-submit-button"
            >
              <Send size={14} />
              {sending ? t.sending : t.send}
            </button>
          </form>

          {/* Right: contact info */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="border border-white/20 bg-white/[0.03] p-6 backdrop-blur-md">
              <div className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-white/50">
                DIRECT
              </div>
              <div className="mt-4 space-y-3">
                <a href="mailto:naimgalet78@gmail.com" className="flex items-center gap-3 group" data-testid="contact-email-link">
                  <Mail size={16} className="text-[#00E5FF]" />
                  <span className="font-body text-base group-hover:text-[#00E5FF] transition-colors">naimgalet78@gmail.com</span>
                </a>
                <a href="https://github.com/naimgalt1" target="_blank" rel="noreferrer" className="flex items-center gap-3 group" data-testid="contact-github-link">
                  <Github size={16} className="text-[#00E5FF]" />
                  <span className="font-body text-base group-hover:text-[#00E5FF] transition-colors">github.com/naimgalt1</span>
                </a>
                <a href="https://www.linkedin.com/in/naim-galet" target="_blank" rel="noreferrer" className="flex items-center gap-3 group" data-testid="contact-linkedin-link">
                  <Linkedin size={16} className="text-[#00E5FF]" />
                  <span className="font-body text-base group-hover:text-[#00E5FF] transition-colors">linkedin.com/in/naim-galet</span>
                </a>
              </div>
            </div>

            <div className="border border-white/20 bg-white/[0.03] p-6 backdrop-blur-md">
              <div className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-white/50 mb-3">
                STATUS
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#B6FF3C] rounded-full animate-pulse"></span>
                <span className="font-body text-base">{content.hero[lang].location}</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.65rem] tracking-[0.22em] uppercase text-white/50">
          <span>{content.footer[lang]}</span>
          <span>© NGN · ALL RIGHTS RESERVED</span>
        </footer>
      </div>
    </section>
  );
}
