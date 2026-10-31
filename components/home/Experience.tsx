"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { casoById, casoHref, type CaseId } from "@/lib/casos";
import { prefersReducedMotion } from "@/lib/fx";
import { CV_URL } from "@/lib/contacto";

type Job = {
  co: string;
  role: string;
  d: string;
  sub: string;
  k: string;
  kl: string;
  p: string;
  cases: [string, CaseId][];
  m: string[];
  recent?: boolean;
};

const JOBS: Job[] = [
  {
    co: "QR Solutions",
    role: "UX/UI Designer",
    d: "FEB 2026 – OCT 2026",
    sub: "PARTNER TECNOLÓGICO DE RE/MAX",
    k: "var(--blue)",
    kl: "var(--blue-t)",
    recent: true,
    p: "Diseño para la suite de RE/MAX en Latinoamérica: web pública, CRM, módulos regionales y tableros para agentes.",
    cases: [["QR IA", "qr"]],
    m: [
      "Reconstruí en Figma secciones migradas que no tenían diseño documentado, antes de rediseñarlas.",
      "Audité el producto usándolo como un usuario real, en producción y en desarrollo, para encontrar fricciones.",
      "Extendí el design system con variantes nuevas, como dropdowns con buscador y contadores dinámicos.",
      "Diseñé el módulo del equipo de Redes Sociales a partir de entrevistas con sus usuarias.",
      "Prototipé con Claude para decidir con algo vivo y defendí propuestas con demos ante PMs y dirección.",
    ],
  },
  {
    co: "FORMA Technology & Growth Solutions",
    role: "UX/UI & Product Designer",
    d: "JUN 2025 – FEB 2026",
    sub: "ÚNICA DISEÑADORA DEL EQUIPO",
    k: "var(--cyan)",
    kl: "var(--cyan-l)",
    p: "Diseño end-to-end, de la planificación al handoff, para clientes de agro, automotriz y gestión de residuos.",
    cases: [
      ["SALAZAR", "sal"],
      ["NS AGRO", "ns"],
      ["RESITER", "res"],
    ],
    m: [
      "Entré gracias al challenge de Salazar.",
      "Planifiqué sprints en Jira y presenté a stakeholders con prioridades ICE.",
      "Hice benchmarks, evaluaciones heurísticas y pruebas de usabilidad, validadas con GA4 y Clarity.",
      "Relevé más de 70 hallazgos priorizados por severidad para NS Agro.",
      "Diseñé wireframes y prototipos de alta fidelidad, desktop y mobile.",
    ],
  },
  {
    co: "Freelance",
    role: "UX/UI & Graphic Designer",
    d: "DIC 2024 – JUN 2025",
    sub: "EMPRENDIMIENTOS Y PYMES",
    k: "var(--pink)",
    kl: "var(--pink-l)",
    p: "Identidades visuales, campañas y landings para proyectos independientes.",
    cases: [],
    m: [
      "Branding completo para Café Tierra.",
      "Campaña de Cyber Monday para The Gamer Shop, en feed y mailing.",
      "Piezas para redes y landings responsive para pymes.",
    ],
  },
  {
    co: "Mercado Libre",
    role: "De developer a diseño",
    d: "ENE 2020 – SEP 2024",
    sub: "CUATRO AÑOS, TRES ROLES",
    k: "var(--violet)",
    kl: "var(--violet-l)",
    p: "Empecé en backend y QA, pasé al frontend y terminé como puente entre diseño y desarrollo.",
    cases: [],
    m: [
      "2023–2024: pantallas en Figma con el design system interno, microcopy y handoff.",
      "2021–2023: interfaces en React y TypeScript con foco en usabilidad.",
      "2020–2021: backend en Java y Go, testing automatizado y soporte en producción.",
    ],
  },
];

const REFS = [
  {
    tag: "DIRECCIÓN",
    first: "Bernabé",
    last: "Quesada Buschiazzo",
    ini: "BQ",
    role: "CEO · QR Solutions",
    url: "https://www.linkedin.com/in/bernab%C3%A9-quesada-buschiazzo-estrategia-customerandsales-ux/",
    k: "var(--blue)",
    kl: "var(--blue-t)",
  },
  {
    tag: "EQUIPO",
    first: "Alejandra",
    last: "Ferreyra",
    ini: "AF",
    role: "Recursos Humanos · QR Solutions",
    url: "https://www.linkedin.com/in/alejandra-analia-ferreyra/",
    k: "var(--violet)",
    kl: "var(--violet-l)",
  },
  {
    tag: "DESARROLLO",
    first: "Rocío",
    last: "Yanguas",
    ini: "RY",
    role: "Frontend Developer · QR Solutions",
    url: "https://www.linkedin.com/in/rocio-y-887003155/",
    k: "var(--cyan-d)",
    kl: "var(--cyan-l)",
  },
];

function JobItem({ x, i }: { x: Job; i: number }) {
  const [open, setOpen] = useState(false);
  const id = "xpm" + i;
  return (
    <article
      className="xp-i"
      data-open={open || undefined}
      data-reveal=""
      style={{ "--k": x.k, "--kl": x.kl, "--d": `${i * 90}ms` } as CSSProperties}
    >
      <div className="xp-d">
        <b>{x.recent ? "MÁS RECIENTE" : " "}</b>
        {x.d}
      </div>
      <div className="xp-b">
        <h3>
          {x.co}
          <small>
            {x.role} · {x.sub}
          </small>
        </h3>
        <p>{x.p}</p>
        <div className="xp-row">
          {x.cases.map(([n, cid]) => (
            <a
              key={cid}
              className="xp-case"
              style={{ "--k2": casoById(cid).kl } as CSSProperties}
              href={casoHref(casoById(cid))}
            >
              CASO · {n}
            </a>
          ))}
          <button className="xp-more" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
            {open ? "VER MENOS −" : "VER MÁS +"}
          </button>
        </div>
        <ul className="xp-list" id={id} hidden={!open}>
          {x.m.map((m, j) => (
            <li key={j} style={{ "--d": `${j * 70}ms` } as CSSProperties}>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Experience() {
  const xpRef = useRef<HTMLDivElement>(null);

  /* Las líneas de color de cada puesto se dibujan una por una al aparecer */
  useEffect(() => {
    const items = [...xpRef.current!.querySelectorAll(".xp-i")];
    if (prefersReducedMotion()) {
      items.forEach((i) => i.classList.add("seen"));
      return;
    }
    const o = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("seen");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.5 },
    );
    items.forEach((i) => o.observe(i));
    return () => o.disconnect();
  }, []);

  return (
    <section className="sec" id="experiencia">
      <div className="wrap">
        <header className="sec-head">
          <span className="sec-num">04 / 05</span>
          <h2 className="sec-title glitch" data-text="EXPERIENCIA">
            EXPERIENCIA
          </h2>
          <span className="uline" data-go="" />
          <p className="sec-sub">Seis años en IT, del más reciente al primero</p>
        </header>
        <div className="xp" ref={xpRef}>
          {JOBS.map((x, i) => (
            <JobItem key={x.co} x={x} i={i} />
          ))}
        </div>

        <div className="rf" data-v="2">
          <div className="rf-h" data-reveal="">
            <small>
              <i />
              REFERENCIAS
            </small>
            <h3>Pueden contarte cómo trabajo</h3>
            <p>Dirección, equipo y desarrollo de QR Solutions. Escribiles directo por LinkedIn.</p>
          </div>
          <div className="rf-g">
            {REFS.map((r, i) => (
              <article
                key={r.ini}
                className="rf-c"
                data-reveal=""
                style={{ "--k": r.k, "--kl": r.kl, "--d": `${i * 120}ms` } as CSSProperties}
              >
                <span className="rf-av" aria-hidden="true">
                  <i>{r.ini}</i>
                </span>
                <span className="rf-tag">{r.tag}</span>
                <div className="rf-t">
                  <b>
                    {r.first}
                    <br />
                    {r.last}
                  </b>
                  <span>{r.role}</span>
                </div>
                <span className="rf-bc" aria-hidden="true" />
                <a
                  className="rf-go"
                  href={r.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Hablar con ${r.first} ${r.last} por LinkedIn`}
                >
                  HABLAR POR LINKEDIN ↗
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="cv" data-reveal="">
          <div>
            <small>CURRÍCULUM</small>
            <h3>Todo esto, en una página para imprimir</h3>
            <p>PDF actualizado a octubre de 2026.</p>
          </div>
          <a className="btn" href={CV_URL} target="_blank" rel="noopener">
            DESCARGAR CV ↓
          </a>
        </div>
      </div>
    </section>
  );
}
