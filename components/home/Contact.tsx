"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { glitch } from "@/lib/fx";
import { EMAIL, GMAIL_URL, LINKEDIN_URL, WHATSAPP_URL } from "@/lib/contacto";

const BTNS = [
  { label: "GMAIL ↗", sub: "Escribirme un mail", href: GMAIL_URL, k: "var(--pink-l)" },
  { label: "LINKEDIN ↗", sub: "Ver perfil y escribirme", href: LINKEDIN_URL, k: "var(--cyan-l)" },
  { label: "WHATSAPP ↗", sub: "Mandarme un mensaje", href: WHATSAPP_URL, k: "var(--lime-l)" },
];

export default function Contact() {
  const tRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ct = tRef.current!;
    const o = new IntersectionObserver((es) => es[0].isIntersecting && glitch(ct), { threshold: 0.6 });
    o.observe(ct);
    return () => o.disconnect();
  }, []);

  return (
    <section id="contacto">
      <div className="ct-grid" aria-hidden="true" />
      <div className="wrap">
        <span className="sec-num">05 / 05</span>
        <span className="ct-st">
          <i />
          DISPONIBLE PARA NUEVOS DESAFÍOS
        </span>
        <h2 className="ct-t glitch" data-text="¿HABLAMOS?" ref={tRef}>
          ¿HABLAMOS?
        </h2>
        <p className="ct-l">
          <strong>Me encanta diseñar y tengo muchas ganas de hacerlo con vos.</strong> Si tenés un puesto, un proyecto o
          un problema que pide diseño, escribime por donde te quede más cómodo.
        </p>
        <div className="ct-btns">
          {BTNS.map((b) => (
            <a
              key={b.label}
              className="ct-b"
              style={{ "--k2": b.k } as CSSProperties}
              href={b.href}
              target="_blank"
              rel="noopener"
            >
              <b>{b.label}</b>
              <small>{b.sub}</small>
            </a>
          ))}
        </div>
        <p className="ct-mail">
          o copiá el mail: <span>{EMAIL}</span>
        </p>
      </div>
    </section>
  );
}
