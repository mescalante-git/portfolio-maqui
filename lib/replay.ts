/* Animaciones que se repiten (opción C acordada):
   - lo grande (contadores, líneas de tiempo, gráficos) vuelve a animarse cada vez que su sección
     sale de la pantalla y volvés a verla;
   - los títulos hacen un glitch suave cada 12 segundos mientras están a la vista.
   Las animaciones que ya corren en loop no se tocan. Nada de esto corre con "reducir movimiento". */

import { glitch, prefersReducedMotion } from "./fx";

export const TITLE_GLITCH_MS = 12000;

/**
 * Llama a leave() cuando el elemento sale por completo de la pantalla (después de haberse visto)
 * y a enter() cuando vuelve a verse bien. La primera aparición la maneja cada animación original.
 */
export function onReenter(els: Element[], leave: (el: HTMLElement) => void, enter: (el: HTMLElement) => void) {
  if (prefersReducedMotion() || !els.length) return () => {};
  const seen = new WeakSet<Element>();
  const away = new WeakSet<Element>();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const el = e.target as HTMLElement;
        const wellInView = e.isIntersecting && (e.intersectionRatio >= 0.2 || e.intersectionRect.height > innerHeight * 0.18);
        if (wellInView) {
          if (away.has(el)) {
            away.delete(el);
            enter(el);
          }
          seen.add(el);
        } else if (!e.isIntersecting && seen.has(el) && !away.has(el)) {
          away.add(el);
          leave(el);
        }
      }),
    { threshold: [0, 0.2] },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/** Elementos que se animan al sacarles la clase "pre": al salir se la devolvemos y al volver se la sacamos. */
export function replayPre(els: Element[]) {
  return onReenter(
    els,
    (el) => el.classList.add("pre"),
    (el) => requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("pre"))),
  );
}

/** Glitch de los títulos visibles cada 12 segundos. */
export function periodicTitleGlitch(selector: string) {
  if (prefersReducedMotion()) return () => {};
  const iv = window.setInterval(() => {
    if (document.hidden) return;
    document.querySelectorAll(selector).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) glitch(el);
    });
  }, TITLE_GLITCH_MS);
  return () => clearInterval(iv);
}

/* ---------- contadores de los casos ---------- */

type Final = { pre: string; post: string; value: number; dec: number; thousands: boolean };

function parseFinal(text: string): Final | null {
  const m = text.trim().match(/^(\D*?)(\d[\d.,]*)(\D*)$/);
  if (!m) return null;
  const num = m[2];
  const dec = num.includes(",") ? num.split(",")[1].length : 0;
  const thousands = /\.\d{3}/.test(num);
  const value = parseFloat(num.replace(/\./g, "").replace(",", "."));
  if (!isFinite(value)) return null;
  return { pre: m[1], post: m[3], value, dec, thousands };
}

function fmt(f: Final, v: number) {
  const n = f.dec ? v.toFixed(f.dec).replace(".", ",") : f.thousands ? Math.round(v).toLocaleString("es-AR") : String(Math.round(v));
  return f.pre + n + f.post;
}

/** Hay que llamarla ANTES de que corran las animaciones del caso, para leer el número final de cada contador. */
export function captureCounters(root: ParentNode = document) {
  return [...root.querySelectorAll<HTMLElement>("[data-count]")]
    .map((el) => ({ el, f: parseFinal(el.textContent || "") }))
    .filter((x): x is { el: HTMLElement; f: Final } => !!x.f);
}

export function replayCounters(list: ReturnType<typeof captureCounters>) {
  const byEl = new Map(list.map((x) => [x.el as Element, x.f]));
  return onReenter(
    list.map((x) => x.el),
    (el) => (el.textContent = fmt(byEl.get(el)!, 0)),
    (el) => {
      const f = byEl.get(el)!;
      const t0 = performance.now();
      const dur = 1300;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(f, f.value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
  );
}

/** Todo junto para un caso de estudio. Uso: const r = prepareCaseReplay(); run(); r.start(); */
export function prepareCaseReplay() {
  const counters = captureCounters();
  return {
    start() {
      if (prefersReducedMotion()) return;
      /* gráficos y líneas que se animan con la clase "pre" (no los bloques que sólo aparecen) */
      const pre = [...document.querySelectorAll(".pre:not([data-reveal])")];
      replayPre(pre);
      replayCounters(counters);
      periodicTitleGlitch(".sec-title, h1.glitch");
    },
  };
}
