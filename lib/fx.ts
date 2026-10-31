/* Utilidades de animación compartidas por la home y los casos. Sólo se usan en el navegador. */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const noHover = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

/** Pantallas angostas (celular y tablet vertical): los canales de proyectos se apilan. */
export const isNarrow = () => typeof window !== "undefined" && window.matchMedia("(max-width:860px)").matches;

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Dispara el efecto glitch una vez sobre un elemento con la clase .glitch */
export function glitch(el: Element | null | undefined) {
  if (!el || prefersReducedMotion()) return;
  el.classList.remove("glitching");
  void (el as HTMLElement).offsetWidth;
  el.classList.add("glitching");
}

/**
 * Aparición al hacer scroll: los elementos que todavía no se ven arrancan ocultos (.pre)
 * y aparecen al entrar en pantalla. Al aparecer, emiten el evento "revealed".
 * Devuelve una función para limpiar.
 */
export function setupReveal(root: ParentNode = document) {
  const els = [...root.querySelectorAll<HTMLElement>("[data-reveal],.uline[data-go]")];
  if (prefersReducedMotion()) {
    els.forEach((el) => el.dispatchEvent(new Event("revealed")));
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove("pre");
          io.unobserve(e.target);
          e.target.dispatchEvent(new Event("revealed"));
        }
      }),
    { threshold: 0.18 },
  );
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.9) {
      el.classList.add("pre");
      io.observe(el);
    } else el.dispatchEvent(new Event("revealed"));
  });
  return () => io.disconnect();
}

/** Glitch en los títulos de sección la primera vez que se ven. */
export function setupTitleGlitch(root: ParentNode = document) {
  const obs = [...root.querySelectorAll(".sec-title.glitch")].map((t) => {
    const o = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          glitch(t);
          o.disconnect();
        }
      },
      { threshold: 0.8 },
    );
    o.observe(t);
    return o;
  });
  return () => obs.forEach((o) => o.disconnect());
}
