"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion, sleep } from "@/lib/fx";
import { onReenter } from "@/lib/replay";

type Cmd = {
  c: string;
  f: string;
  k: string;
  r?: string[];
  note?: string;
  edu?: [string, string, string, string][];
};

/* Comandos de la terminal. En r se puede usar <b> para resaltar. */
const CMDS: Cmd[] = [
  {
    c: "ux",
    f: "--research",
    k: "var(--violet-l)",
    r: [
      "Benchmarking competitivo",
      "Evaluación heurística (Nielsen)",
      "Pruebas de usabilidad moderadas y no moderadas",
      "Entrevistas con usuarios",
      "Analytics: <b>GA4</b> y <b>Microsoft Clarity</b>",
      "Priorización con <b>ICE</b>",
    ],
  },
  {
    c: "ui",
    f: "--diseño",
    k: "var(--pink-l)",
    r: [
      "<b>Figma</b> y <b>FigJam</b>",
      "Wireframes y prototipos de alta fidelidad, desktop y mobile",
      "Arquitectura de información",
      "UX writing y microcopy",
      "Accesibilidad",
    ],
  },
  {
    c: "ds",
    f: "--sistemas",
    k: "var(--cyan-l)",
    r: [
      "Design systems <b>propios, desde cero</b>: tokens, paleta, tipografía y componentes",
      "Extensión de sistemas existentes con variantes nuevas",
      "Documentación pensada para desarrollo",
      "Ejemplo: el kit de IA de QR IA, con <b>26 componentes nuevos</b>",
    ],
  },
  {
    c: "ia",
    f: "--flujo",
    k: "var(--blue-t)",
    r: [
      "<b>Claude</b> conectado a Figma",
      "Prototipos interactivos para validar ideas antes de dibujarlas",
      "Archivos de contexto y reglas para diseñar con IA",
      "Documentación UX y análisis",
    ],
  },
  {
    c: "equipo",
    f: "--gestion",
    k: "var(--lime-l)",
    r: [
      "<b>Jira</b> y Scrum, planificación de sprints",
      "Presentaciones ejecutivas para stakeholders",
      "Handoff y trabajo diario con desarrollo",
      "Autogestión de punta a punta",
    ],
  },
  {
    c: "base",
    f: "--tecnica",
    k: "var(--muted)",
    r: ["HTML · CSS · JavaScript · React · TypeScript"],
    note: "// para entender lo que se construye. Ya no programo: diseño.",
  },
  {
    c: "formacion",
    f: "",
    k: "var(--pink-l)",
    edu: [
      ["DOMESTIKA", "Diseño gráfico y comunicación visual · en curso", "var(--pink)", "var(--pink-l)"],
      ["UDEMY", "UX, UI y Design Thinking · 2024", "var(--violet)", "var(--violet-l)"],
      ["ADA IT", "Backend Web Development · 2020", "var(--cyan-d)", "var(--cyan-l)"],
      ["EDUCACIÓN IT", "Software Tester QA · 2019", "var(--lime-d)", "var(--lime-l)"],
    ],
  },
];

const label = (x: Cmd) => `${x.c}${x.f ? " " + x.f : ""}`;

function bodyHtml(x: Cmd, instant: boolean) {
  const d = (i: number) => (instant ? 0 : i * 90);
  if (x.edu)
    return `<div class="edu">${x.edu
      .map((e, i) => `<span style="--k:${e[2]};--kl:${e[3]};--d:${d(i)}ms"><b>${e[0]}</b><small>${e[1]}</small></span>`)
      .join("")}</div>`;
  return `<div class="term-res" style="--k:${x.k}">${x
    .r!.map((r, i) => `<div class="r" style="--d:${d(i)}ms"><span>${r}</span></div>`)
    .join("")}${x.note ? `<div class="note" style="--d:${d(x.r!.length)}ms">${x.note}</div>` : ""}</div>`;
}

const staticOut = (x: Cmd) =>
  `<div class="term-ln"><span class="pr">~/skills ›</span> <span class="pa">${label(x)}</span></div>${bodyHtml(x, true)}`;

export default function Skills() {
  const [active, setActive] = useState(0);
  const outRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const tok = useRef(0);
  const cur = useRef(0);

  /* Escribe el comando letra por letra y después muestra la respuesta */
  async function run(i: number, anim: boolean) {
    const k = ++tok.current;
    const x = CMDS[i];
    const out = outRef.current!;
    setActive(i);
    cur.current = i;
    if (prefersReducedMotion() || !anim) {
      out.innerHTML = staticOut(x);
      return;
    }
    out.innerHTML = `<div class="term-ln typing"><span class="pr">~/skills ›</span> <span class="pa"></span></div>`;
    const pa = out.querySelector(".pa")!;
    const ln = out.querySelector(".term-ln")!;
    for (const ch of label(x)) {
      if (k !== tok.current) return;
      pa.textContent += ch;
      await sleep(42);
    }
    await sleep(220);
    if (k !== tok.current) return;
    ln.classList.remove("typing");
    out.insertAdjacentHTML("beforeend", bodyHtml(x, false));
  }

  useEffect(() => {
    const term = termRef.current!;
    const onRevealed = () => run(0, true);
    term.addEventListener("revealed", onRevealed);
    /* al volver a la sección, la terminal vuelve a escribir el comando elegido */
    const r = onReenter([term], () => {}, () => run(cur.current, true));
    return () => {
      r();
      term.removeEventListener("revealed", onRevealed);
      tok.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="sec" id="skills">
      <div className="wrap">
        <header className="sec-head">
          <span className="sec-num">03 / 05</span>
          <h2 className="sec-title glitch" data-text="SKILLS">
            SKILLS
          </h2>
          <span className="uline" data-go="" />
          <p className="sec-sub">Elegí un comando</p>
        </header>
        <div className="term" data-reveal="" ref={termRef}>
          <div className="term-top">
            <span className="d3">
              <i />
              <i />
              <i />
            </span>
            <span>PORTFOLIO · ~/SKILLS</span>
            <span>ZSH</span>
          </div>
          <div className="term-cmds" role="group" aria-label="Comandos">
            {CMDS.map((x, i) => (
              <button
                key={x.c}
                type="button"
                className="cmd"
                style={{ "--k": x.k } as CSSProperties}
                aria-pressed={active === i}
                onClick={() => run(i, true)}
              >
                <b>{x.c}</b>
                {x.f ? " " + x.f : ""}
              </button>
            ))}
          </div>
          <div
            className="term-out"
            aria-live="polite"
            ref={outRef}
            dangerouslySetInnerHTML={{ __html: staticOut(CMDS[0]) }}
          />
        </div>
      </div>
    </section>
  );
}
