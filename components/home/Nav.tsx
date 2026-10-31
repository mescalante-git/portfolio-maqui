"use client";

import { useEffect, useRef } from "react";
import { CV_URL } from "@/lib/contacto";

const LINKS = [
  ["sobre", "01", "SOBRE MÍ"],
  ["proyectos", "02", "PROYECTOS"],
  ["skills", "03", "SKILLS"],
  ["experiencia", "04", "EXPERIENCIA"],
  ["contacto", "05", "CONTACTO"],
] as const;

/** Nav fija: aparece al bajar del hero, marca la sección actual y muestra el progreso de lectura. */
export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const nav = navRef.current!;
    const prog = progRef.current!;
    const links = [...nav.querySelectorAll<HTMLAnchorElement>("li a")];
    const secs = links.map((a) => document.getElementById(a.dataset.sec!));
    const upd = () => {
      nav.classList.toggle("show", scrollY > innerHeight * 0.6);
      const h = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
      let cur = -1;
      secs.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i;
      });
      links.forEach((a, i) => a.setAttribute("aria-current", String(i === cur)));
    };
    addEventListener("scroll", upd, { passive: true });
    upd();
    return () => removeEventListener("scroll", upd);
  }, []);

  return (
    <nav className="nav" ref={navRef} aria-label="Secciones">
      <div className="wrap">
        <a className="logo" href="#top">
          MACARENA<span>_</span>
        </a>
        <ul>
          {LINKS.map(([id, n, label]) => (
            <li key={id}>
              <a href={`#${id}`} data-sec={id}>
                <i>{n}</i>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a className="nav-cv" href={CV_URL} target="_blank" rel="noopener">
          CV ↓
        </a>
      </div>
      <span className="progress" ref={progRef} />
    </nav>
  );
}
