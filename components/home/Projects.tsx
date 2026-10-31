"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CASOS, caseVars, casoHref } from "@/lib/casos";
import { glitch, isNarrow, prefersReducedMotion } from "@/lib/fx";
import { mountPreview, type Preview } from "@/lib/previews";

/**
 * Proyectos como "canales": en pantallas anchas la sección queda fija y el scroll cambia de canal
 * (con glitch). En ≤860px los casos se apilan y cada adelanto arranca al aparecer.
 */
export default function Projects() {
  const chRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ch = chRef.current!;
    const st = stRef.current!;
    const bar = barRef.current!;
    const reduce = prefersReducedMotion();
    const panels = [...st.querySelectorAll<HTMLElement>(".ch-p")];
    const btns = [...st.querySelectorAll<HTMLButtonElement>(".ch-nav button")];
    const pvs: Preview[] = panels.map((p, i) => {
      const el = p.querySelector<HTMLElement>(".pv")!;
      return mountPreview(CASOS[i].id, el);
    });
    let cur = 0;
    let inView = false;
    let zapTo = 0;

    const activate = (i: number) => {
      panels[i].classList.add("act");
      btns[i].setAttribute("aria-pressed", "true");
    };
    activate(0);

    function go(i: number) {
      if (i === cur) return;
      panels[cur].classList.remove("act");
      pvs[cur].stop();
      btns[cur].setAttribute("aria-pressed", "false");
      cur = i;
      activate(i);
      if (!reduce) {
        st.classList.remove("zap");
        void st.offsetWidth;
        st.classList.add("zap");
        zapTo = window.setTimeout(() => glitch(panels[i].querySelector(".ch-n")), 220);
      }
      if (inView || isNarrow()) pvs[i].play();
    }

    /* Pantalla ancha: el scroll de la página cambia de canal */
    function onScroll() {
      if (isNarrow()) return;
      const r = ch.getBoundingClientRect();
      const max = ch.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / max));
      bar.style.width = p * 100 + "%";
      const vis = r.top < innerHeight && r.bottom > 0;
      inView = vis;
      if (vis) go(Math.min(3, Math.floor(p * 4 * 0.999)));
    }
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    const onClicks = btns.map((b, i) => {
      const fn = () => {
        const top = ch.getBoundingClientRect().top + scrollY;
        scrollTo({ top: top + ((i + 0.5) * (ch.offsetHeight - innerHeight)) / 4, behavior: reduce ? "auto" : "smooth" });
      };
      b.addEventListener("click", fn);
      return fn;
    });

    /* El adelanto del canal visible corre en loop apenas la sección aparece */
    const wideIo = new IntersectionObserver(
      (es) => {
        if (isNarrow()) return;
        inView = es[0].isIntersecting;
        if (inView) {
          onScroll();
          pvs[cur].play();
        } else pvs[cur].stop();
      },
      { threshold: 0 },
    );
    wideIo.observe(st);

    /* Pantalla angosta: cada caso apilado; el adelanto arranca al aparecer */
    const narrowIo = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!isNarrow()) return;
          const i = panels.indexOf(e.target as HTMLElement);
          if (e.isIntersecting) {
            pvs[i].play();
            glitch(panels[i].querySelector(".ch-n"));
          } else pvs[i].stop();
        }),
      { threshold: 0.45 },
    );
    panels.forEach((p) => narrowIo.observe(p));

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      btns.forEach((b, i) => b.removeEventListener("click", onClicks[i]));
      wideIo.disconnect();
      narrowIo.disconnect();
      clearTimeout(zapTo);
      pvs.forEach((p) => p.stop());
      panels.forEach((p) => {
        p.classList.remove("act");
        const el = p.querySelector(".pv")!;
        [...el.children].slice(1).forEach((c) => c.remove());
      });
      btns.forEach((b) => b.setAttribute("aria-pressed", "false"));
    };
  }, []);

  return (
    <section id="proyectos" aria-label="Proyectos">
      <div className="ch" ref={chRef}>
        <div className="ch-st" ref={stRef}>
          <div className="ch-head">
            <b>02</b> PROYECTOS · 4 CASOS, DEL MÁS RECIENTE AL PRIMERO
          </div>
          <div>
            {CASOS.map((c, i) => (
              <article key={c.id} className={"ch-p" + (i === 0 ? " act" : "")} style={caseVars(c)}>
                <div className="ch-txt">
                  <span className="ch-c">
                    CANAL 0{i + 1} / 04 · {c.meta}
                  </span>
                  <h3 className="ch-n glitch" data-text={c.name}>
                    {c.name}
                  </h3>
                  <p className="ch-l">{c.lead}</p>
                  <div className="ch-stats">
                    {c.stats.map(([b, s]) => (
                      <span key={s}>
                        <b>{b}</b>
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link className="btn" href={casoHref(c)}>
                    VER CASO →
                  </Link>
                </div>
                <div className="pv" aria-hidden="true" style={caseVars(c)}>
                  <span className="pv-l">{c.lbl}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="ch-nav" aria-label="Ir a un caso">
            {CASOS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                style={caseVars(c)}
                aria-label={"Ir a " + c.name}
                aria-pressed={i === 0}
              >
                <span>{c.name}</span>
                <i />
              </button>
            ))}
          </div>
          <div className="ch-noise" aria-hidden="true" />
          <div className="ch-bar" aria-hidden="true">
            <i ref={barRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
