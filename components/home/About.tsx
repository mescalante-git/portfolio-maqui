"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/fx";

const TIMELINE: [string, string, string, string][] = [
  ["2019", "Testing QA", "#6E6385", "0ms"],
  ["2020", "Backend en Mercado Libre", "#7A6E92", "350ms"],
  ["2021", "Frontend con foco en usabilidad", "var(--violet-l)", "700ms"],
  ["2023", "Nexo diseño y desarrollo, UX writing", "var(--pink)", "1050ms"],
  ["2024", "Diseño UX/UI, sólo diseño", "var(--pink-l)", "1400ms"],
  ["2025–26", "Producto end-to-end y diseño con IA", "var(--pink-l)", "1750ms"],
];

const GIVES = [
  {
    tag: "DESARROLLO",
    title: "Diseño lo que se puede construir",
    text: "Sé qué cuesta cada decisión. Mis handoffs llegan sin sorpresas y hablo con el equipo de desarrollo en su idioma.",
    k: "var(--violet)",
    kl: "var(--violet-l)",
  },
  {
    tag: "DATOS",
    title: "Decido con evidencia",
    text: "Benchmark, heurísticas, pruebas con usuarios, GA4 y Clarity. Priorizo con ICE para que el equipo sepa qué hacer primero.",
    k: "var(--cyan-d)",
    kl: "var(--cyan-l)",
  },
  {
    tag: "IA",
    title: "Pienso más rápido con IA",
    text: "Prototipo con Claude conectado a Figma para probar ideas vivas antes de dibujarlas. Llego a la reunión con algo que se puede tocar.",
    k: "var(--pink-d)",
    kl: "var(--pink-l)",
  },
];

export default function About() {
  const tlRef = useRef<HTMLDivElement>(null);
  const phRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tl = tlRef.current!;
    const ph = phRef.current!;
    const reduce = prefersReducedMotion();
    let t: IntersectionObserver | undefined;
    if (reduce) tl.classList.remove("pre");
    else {
      t = new IntersectionObserver(
        (es) => {
          if (es[0].isIntersecting) {
            tl.classList.remove("pre");
            t!.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      t.observe(tl);
    }
    /* Barrido de escaneo sobre la foto al aparecer y al pasar el mouse */
    let to = 0;
    const onRevealed = () => {
      if (!reduce) to = window.setTimeout(() => ph.classList.add("run"), 300);
    };
    const onEnter = () => {
      ph.classList.remove("run");
      void ph.offsetWidth;
      ph.classList.add("run");
    };
    ph.addEventListener("revealed", onRevealed);
    ph.addEventListener("mouseenter", onEnter);
    return () => {
      t?.disconnect();
      clearTimeout(to);
      ph.removeEventListener("revealed", onRevealed);
      ph.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <section className="sec" id="sobre">
      <div className="wrap">
        <header className="sec-head">
          <span className="sec-num">01 / 05</span>
          <h2 className="sec-title glitch" data-text="SOBRE MÍ">
            SOBRE MÍ
          </h2>
          <span className="uline" data-go="" />
          <p className="sec-sub">De developer a diseñadora</p>
        </header>
        <div className="ab">
          <figure className="ab-ph" ref={phRef} data-reveal="">
            <div className="frame">
              <Image
                src="/maca.jpg"
                alt="Macarena Escalante"
                width={1067}
                height={1600}
                sizes="(max-width: 980px) 320px, 330px"
              />
            </div>
            <span className="sweep" aria-hidden="true" />
            <figcaption>
              <span>
                ID · <b>M. ESCALANTE</b>
              </span>
              <span>BS AS · AR</span>
            </figcaption>
          </figure>
          <div className="ab-txt">
            <h3 data-reveal="">
              Escribí código 4 años.
              <br />
              <span className="nw">
                Después elegí <em>el lado creativo</em>.
              </span>
            </h3>
            <p data-reveal="">
              Empecé en IT probando software y programando en Mercado Libre. Ahí descubrí que del lado del diseño soy
              mucho más creativa: me gusta entender qué necesita la gente y hacerle la vida más fácil.
              <br />
              <strong>Desde 2024 me dedico sólo a diseñar.</strong>
            </p>
            <div className="tl pre" ref={tlRef} aria-label="Recorrido">
              <div className="tl-track">
                <span className="tl-fill" aria-hidden="true" />
                {TIMELINE.map(([y, txt, k, d]) => (
                  <div key={y} className={"tl-n" + (y === "2023" ? " pivot" : "")} style={{ "--k": k, "--d": d } as CSSProperties}>
                    <b>{y}</b>
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
              <div className="tl-lbl">
                <span>CÓDIGO</span>
                <span>DISEÑO</span>
              </div>
            </div>
          </div>
        </div>
        <div className="ab-gv">
          <p className="ab-k" data-reveal="">
            Ya no programo, pero el código me dejó tres cosas que uso todos los días:
          </p>
          <div className="gives">
            {GIVES.map((g, i) => (
              <article
                key={g.tag}
                className="give"
                data-reveal=""
                style={{ "--k": g.k, "--kl": g.kl, "--d": `${i * 120}ms` } as CSSProperties}
              >
                <small>{g.tag}</small>
                <h4>{g.title}</h4>
                <p>{g.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
