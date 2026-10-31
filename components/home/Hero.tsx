"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { glitch, isNarrow, noHover, prefersReducedMotion } from "@/lib/fx";

const LEAD = "Hago que lo complejo se vuelva simple de usar.";

/* El mismo hero escrito como código (lado izquierdo, "ANTES"). */
const tg = (n: string) => `<span class="tk-p">&lt;</span><span class="tk-t">${n}</span>`;
const cl = (n: string) => `<span class="tk-p">&lt;/</span><span class="tk-t">${n}</span><span class="tk-p">&gt;</span>`;
const gt = '<span class="tk-p">&gt;</span>';
const CODE = [
  '<span class="tk-c">// hero.tsx · antes de ser pixel, fue código</span>',
  `${tg("Hero")} <span class="tk-a">tema</span><span class="tk-p">=</span><span class="tk-s">"cyberpunk"</span> <span class="tk-a">acento</span><span class="tk-p">=</span><span class="tk-s">"fucsia"</span>${gt}`,
  `  ${tg("Rol")}${gt}UX/UI · Product Designer${cl("Rol")}`,
  `  ${tg("Glitch")}${gt}Macarena Escalante${cl("Glitch")}`,
  `  ${tg("Bajada")} <span class="tk-a">stream</span>${gt}`,
  "__LEAD__",
  `  ${cl("Bajada")}`,
  `  ${tg("Tags")} <span class="tk-a">items</span><span class="tk-p">={[</span><span class="tk-s">"research"</span>, <span class="tk-s">"design systems"</span>,`,
  `              <span class="tk-s">"producto"</span>, <span class="tk-s">"IA"</span><span class="tk-p">]}</span> <span class="tk-p">/&gt;</span>`,
  `  ${tg("Ubicacion")} <span class="tk-a">modo</span><span class="tk-p">=</span><span class="tk-s">"remoto"</span>${gt}Buenos Aires${cl("Ubicacion")}`,
  cl("Hero"),
];
function wrapText(t: string) {
  const out: string[] = [];
  let l = "";
  t.split(" ").forEach((x) => {
    if ((l + " " + x).trim().length > 30) {
      out.push(l.trim());
      l = x;
    } else l += " " + x;
  });
  if (l.trim()) out.push(l.trim());
  return out;
}
const CODE_HTML = CODE.flatMap((l) => (l === "__LEAD__" ? wrapText(LEAD).map((t) => "    " + t) : [l]))
  .map((l, k) => `<span class="ln">${k + 1}</span>${l}`)
  .join("\n");

const tagStyle = (k: string, kl: string) => ({ "--k": k, "--kl": kl }) as CSSProperties;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const hintRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current!;
    const rng = rangeRef.current!;
    const name = nameRef.current;
    const reduce = prefersReducedMotion();
    let raf = 0;
    let startTo = 0;

    const set = (p: number) => {
      hero.style.setProperty("--pos", p + "%");
      rng.value = String(Math.round(p));
    };
    const fromEvent = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      set(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      fromEvent(e);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || (e.target as Element).closest("a")) return;
      cancelAnimationFrame(raf);
      fromEvent(e);
    };
    const onRange = () => {
      cancelAnimationFrame(raf);
      set(+rng.value);
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerdown", onDown);
    rng.addEventListener("input", onRange);
    if (noHover() && hintRef.current) hintRef.current.textContent = "TOCÁ LA PANTALLA ◀ ▶";

    /* Al cargar, el diseño se "compila" sobre el código: el corte va del 100% al 12% (3% en celular). */
    const REST = () => (isNarrow() ? 3 : 12);
    if (reduce) set(REST());
    else {
      const end = REST();
      set(100);
      startTo = window.setTimeout(() => {
        const s0 = performance.now();
        const dur = 2000;
        const step = (n: number) => {
          const p = Math.min(1, (n - s0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          set(100 - (100 - end) * e);
          if (p < 1) raf = requestAnimationFrame(step);
          else glitch(name);
        };
        raf = requestAnimationFrame(step);
      }, 450);
    }
    const iv = window.setInterval(() => {
      if (!document.hidden && scrollY < innerHeight) glitch(name);
    }, 5200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(startTo);
      clearInterval(iv);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onDown);
      rng.removeEventListener("input", onRange);
    };
  }, []);

  return (
    <section className="hero" id="top" aria-label="Presentación" ref={heroRef} style={{ "--pos": "100%" } as CSSProperties}>
      <div className="hero-code" aria-hidden="true">
        <pre dangerouslySetInnerHTML={{ __html: CODE_HTML }} />
      </div>
      <div className="hero-dsn">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-in">
          <div className="hero-role">
            <span style={tagStyle("var(--pink-dd)", "var(--pink-l)")}>UX/UI DESIGNER</span>
            <span style={tagStyle("var(--violet)", "var(--violet-l)")}>PRODUCT DESIGNER</span>
          </div>
          <h1 className="hero-name glitch" data-text="MACARENA ESCALANTE" ref={nameRef}>
            MACARENA ESCALANTE
          </h1>
          <p className="hero-lead">{LEAD}</p>
          <div className="hero-tags">
            <span style={tagStyle("var(--cyan)", "var(--cyan-l)")}>UX RESEARCH</span>
            <span style={tagStyle("var(--lime-d)", "var(--lime-l)")}>DESIGN SYSTEMS</span>
            <span style={tagStyle("var(--violet)", "var(--violet-l)")}>PRODUCTO</span>
            <span style={tagStyle("var(--blue)", "var(--blue-t)")}>DISEÑO CON IA</span>
          </div>
          <span className="loc">
            <i />
            BUENOS AIRES · REMOTO · 6 AÑOS EN IT · EX MERCADO LIBRE
          </span>
          <a className="hero-hint" href="#sobre">
            SOBRE MÍ
            <i />
            <small ref={hintRef}>MOVÉ EL MOUSE ◀ ▶</small>
          </a>
        </div>
      </div>
      <span className="hero-tag l" aria-hidden="true">
        &lt;/&gt; ANTES
      </span>
      <span className="hero-tag r" aria-hidden="true">
        ◐ AHORA
      </span>
      <div className="hero-line" aria-hidden="true">
        <span>&lt;/&gt; ◐</span>
      </div>
      <label className="sr" htmlFor="heroRange">
        Mover el corte entre el código y el diseño
      </label>
      <input className="sr" type="range" id="heroRange" min={0} max={100} defaultValue={12} ref={rangeRef} />
    </section>
  );
}
