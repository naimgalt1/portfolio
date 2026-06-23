// Bilingual content dictionary (ES / EN)
export const content = {
  brand: "NAIM·GALET",
  nav: {
    es: [
      { id: "inicio", label: "Inicio" },
      { id: "sobre-mi", label: "Sobre mí" },
      { id: "proyectos", label: "Proyectos" },
      { id: "habilidades", label: "Habilidades" },
      { id: "contacto", label: "Contacto" },
    ],
    en: [
      { id: "inicio", label: "Home" },
      { id: "sobre-mi", label: "About" },
      { id: "proyectos", label: "Projects" },
      { id: "habilidades", label: "Skills" },
      { id: "contacto", label: "Contact" },
    ],
  },
  hero: {
    es: {
      overline: "Portfolio · 2026 ·  Frontend",
      role: "Frontend Junior Developer",
      h1l1: "NAIM",
      h1l2: "GALET",
      h1l3: "NAIEB",
      tagline:
        "Diseño interfaces que se sienten bien. Trabajo con criterio, escucho al cliente y entrego con herramientas de hoy.",
      cta1: "Ver proyectos",
      cta2: "Contactar",
      location: "Barcelona · Disponible",
    },
    en: {
      overline: "Portfolio · 2026 · Frontend",
      role: "Junior Frontend Developer",
      h1l1: "NAIM",
      h1l2: "GALET",
      h1l3: "NAIEB",
      tagline:
        "I build interfaces that feel right. I work with intent, listen to clients and deliver with modern tools.",
      cta1: "See projects",
      cta2: "Get in touch",
      location: "Barcelona · Available",
    },
  },
  about: {
    es: {
      tag: "// 01 — Sobre mí",
      title: "Diseño con código,\nconstruyo con intención.",
      p1: "Soy Naim, desarrollador frontend junior con foco en diseño y experiencia de usuario. Me importa que cada interfaz tenga criterio: que la tipografía pese, que el espacio respire, que el detalle se note.",
      p2: "Trabajo con React, Tailwind y JavaScript, e integro herramientas de IA en mi flujo de trabajo para entregar más rápido sin perder calidad. Con los clientes soy directo: entiendo lo que necesitan, propongo soluciones y ejecuto.",
      stats: [
        { k: "+3", v: "años en web" },
        { k: "UI", v: "primero siempre" },
        { k: "2026", v: "disponible" },
      ],
    },
    en: {
      tag: "// 01 — About me",
      title: "Designing with code,\nbuilding with intent.",
      p1: "I'm Naim, a junior frontend developer focused on design and user experience. I care about interfaces that have intention: typography that lands, space that breathes, details that matter.",
      p2: "I work with React, Tailwind and JavaScript, and I integrate AI tools into my workflow to deliver faster without cutting corners. With clients I'm straightforward: I listen, I propose, I build.",
      stats: [
        { k: "3+", v: "years in web" },
        { k: "UI", v: "first, always" },
        { k: "2026", v: "available" },
      ],
    },
  },
  projects: {
    es: {
      tag: "// 02 — Proyectos seleccionados",
      title: "Trabajo reciente",
      items: [
        {
          n: "01",
          name: "Raíz",
          type: "Sistema de diseño",
          desc: "E-commerce de cosmeticos y bienestar",
          stack: ["React", "Tailwind", "Storybook"],
        },
        {
          n: "02",
          name: "Calma",
          type: "Dashboard 3D",
          desc: "Pagina de reservas y presentación para estudio de yoga.",
          stack: ["React", "Three.js", "Framer"],
        },
        {
          n: "03",
          name: "Norte",
          type: "Landing experimental",
          desc: "Landing para agencía de marketing.",
          stack: ["React", "R3F", "GSAP"],
        },
      ],
      cta: "Ver más",
    },
    en: {
      tag: "// 02 — Selected projects",
      title: "Recent work",
      items: [
        {
          n: "01",
          name: "Raíz",
          type: "Design system",
          desc: "E-commerce for cosmetics and wellness.",
          stack: ["React", "Tailwind", "Storybook"],
        },
        {
          n: "02",
          name: "Calma",
          type: "3D Dashboard",
          desc: "Pagina de reservas y presentación para estudio de yoga.",
          stack: ["React", "Three.js", "Framer"],
        },
        {
          n: "03",
          name: "Norte",
          type: "Experimental landing",
          desc: "Landing for marketing agency.",
          stack: ["React", "R3F", "GSAP"],
        },
      ],
      cta: "See more",
    },
  },
  skills: {
    es: {
      tag: "// 03 — Habilidades",
      title: "Stack",
      groups: [
        { k: "Lenguajes", v: ["JavaScript", "TypeScript", "HTML5", "CSS3"] },
        { k: "Frameworks", v: ["React", "Next.js", "Tailwind CSS", "Three.js"] },
        { k: "Herramientas", v: ["Git", "Figma", "Vite", "Storybook"] },
        { k: "En curso", v: ["Node.js", "FastAPI", "Motion design"] },
      ],
      marquee: "REACT · TAILWIND · THREE.JS · JAVASCRIPT · TYPESCRIPT · MOTION · GIT · FIGMA · ",
    },
    en: {
      tag: "// 03 — Skills",
      title: "Stack",
      groups: [
        { k: "Languages", v: ["JavaScript", "TypeScript", "HTML5", "CSS3"] },
        { k: "Frameworks", v: ["React", "Next.js", "Tailwind CSS", "Three.js"] },
        { k: "Tools", v: ["Git", "Figma", "Vite", "Storybook"] },
        { k: "Learning", v: ["Node.js", "FastAPI", "Motion design"] },
      ],
      marquee: "REACT · TAILWIND · THREE.JS · JAVASCRIPT · TYPESCRIPT · MOTION · GIT · FIGMA · ",
    },
  },
  contact: {
    es: {
      tag: "// 04 — Contacto",
      title: "Hablemos.",
      subtitle:
        "Busco incorporarme a un equipo donde pueda crecer y aportar. También disponible para proyectos freelance y páginas puntuales. Escríbeme.",
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      send: "Enviar mensaje",
      sending: "Enviando...",
      ok: "Mensaje enviado correctamente.",
      okMock: "Mensaje recibido. (Email aún no configurado)",
      err: "Algo falló. Vuelve a intentarlo.",
      socials: ["github", "linkedin", "email"],
    },
    en: {
      tag: "// 04 — Contact",
      title: "Let's talk.",
      subtitle:
       "Looking to join a team where I can grow and contribute. Also available for freelance projects and one-off websites. Let's talk.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send message",
      sending: "Sending...",
      ok: "Message sent successfully.",
      okMock: "Message received. (Email not yet configured)",
      err: "Something went wrong. Try again.",
      socials: ["github", "linkedin", "email"],
    },
  },
  footer: {
    es: "Diseñado y construido por Naim Galet Naieb · 2026",
    en: "Designed & built by Naim Galet Naieb · 2026",
  },
};
