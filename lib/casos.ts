import type { CSSProperties } from "react";

/* Los 4 casos de estudio. El orden de este array es el de la home y el del botón "Siguiente caso":
   del más reciente al primero. */

export type CaseId = "qr" | "res" | "ns" | "sal";

export type Caso = {
  id: CaseId;
  slug: string;
  name: string;
  meta: string;
  /** color base, oscuro y claro del caso */
  k: string;
  kd: string;
  kl: string;
  lead: string;
  stats: [string, string][];
  /** etiqueta del adelanto animado en la home */
  lbl: string;
};

export const CASOS: Caso[] = [
  {
    id: "qr",
    slug: "qr-ia",
    name: "QR IA",
    meta: "2026 · QR SOLUTIONS · RE/MAX",
    k: "var(--blue)",
    kd: "var(--blue-d)",
    kl: "var(--blue-t)",
    lead: "Una sección de IA que funcionaba pero no tenía diseño. Cuatro días para convertirla en un sistema.",
    stats: [
      ["4", "DÍAS"],
      ["26", "COMPONENTES"],
      ["1", "PLANTILLA PARA TODO"],
    ],
    lbl: "PLANTILLA → REPORTE",
  },
  {
    id: "res",
    slug: "resiter",
    name: "RESITER",
    meta: "2025–26 · FORMA · WEB END-TO-END",
    k: "var(--lime)",
    kd: "var(--lime-d)",
    kl: "var(--lime-l)",
    lead: "De un sitio saturado a una arquitectura clara, en medio de la ambigüedad y como única diseñadora.",
    stats: [
      ["8", "MESES"],
      ["1", "DISEÑADORA"],
      ["288", "PANTALLAS"],
    ],
    lbl: "CAOS → ARQUITECTURA",
  },
  {
    id: "ns",
    slug: "ns-agro",
    name: "NS AGRO",
    meta: "2025 · FORMA · RESEARCH",
    k: "var(--cyan)",
    kd: "var(--cyan-d)",
    kl: "var(--cyan-l)",
    lead: "Investigación con datos y priorización estratégica para el e-commerce de un distribuidor del agro.",
    stats: [
      ["72", "HALLAZGOS"],
      ["3", "COMPETIDORES"],
      ["27", "MEJORAS ICE"],
    ],
    lbl: "72 HALLAZGOS → 27 MEJORAS",
  },
  {
    id: "sal",
    slug: "salazar",
    name: "SALAZAR",
    meta: "2025 · CHALLENGE UX/UI",
    k: "var(--violet)",
    kd: "var(--violet-d)",
    kl: "var(--violet-l)",
    lead: "Seis días para leer un sitio automotriz, compararlo con el mercado y proponer una experiencia mobile más clara.",
    stats: [
      ["120 h", "DE CHALLENGE"],
      ["29", "OBSERVACIONES"],
      ["15", "MEJORAS"],
    ],
    lbl: "120:00:00 → ENTREGADO",
  },
];

export const casoHref = (c: Caso) => `/casos/${c.slug}`;
export const casoById = (id: CaseId) => CASOS.find((c) => c.id === id)!;

/** Siguiente caso en el circuito QR IA → Resiter → NS Agro → Salazar → QR IA */
export const siguienteCaso = (id: CaseId) => CASOS[(CASOS.findIndex((c) => c.id === id) + 1) % CASOS.length];

/** Variables CSS de color de un caso, para usar en style={} */
export const caseVars = (c: Pick<Caso, "k" | "kd" | "kl">) =>
  ({ "--k": c.k, "--kd": c.kd, "--kl": c.kl }) as CSSProperties;
