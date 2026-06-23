import React, { useState } from "react";
import "@/App.css";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import ContactSection from "./components/ContactSection";

function App() {
  const [lang, setLang] = useState("es");

  return (
    <div className="App" data-testid="portfolio-app">
      <Navbar lang={lang} setLang={setLang} />

      <main className="module-stack" data-testid="module-stack">
        <HeroSection lang={lang} />
        <AboutSection lang={lang} />
        <ProjectsSection lang={lang} />
        <SkillsSection lang={lang} />
        <ContactSection lang={lang} />
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0A0A0A",
            color: "#fff",
            border: "1.5px solid #fff",
            borderRadius: 0,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
          },
        }}
      />
    </div>
  );
}

export default App;
