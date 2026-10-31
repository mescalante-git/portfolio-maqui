/* Adelantos animados de cada caso (los que corren en loop en la sección Proyectos).
   Cada uno descansa en su estado final y anima mientras está "activo". */

import type { CaseId } from "./casos";
import { prefersReducedMotion, sleep } from "./fx";

export type Preview = { play(): void; stop(): void };

/* Salazar: reloj 120:00:00 que llega a 00:00:00 → ENTREGADO */
function pvSal(el: HTMLElement): Preview {
  el.insertAdjacentHTML(
    "beforeend",
    '<div class="ps"><small>TIEMPO RESTANTE</small><b class="ps-t">00:00:00</b><div class="ps-d"><i></i><i></i><i></i><i></i><i></i></div><span class="ps-st">ENTREGADO</span></div>',
  );
  const t = el.querySelector(".ps-t")!;
  const d = [...el.querySelectorAll(".ps-d i")];
  const st = el.querySelector(".ps-st")!;
  let on = false;
  let raf = 0;
  let to = 0;
  const f = (s: number) => {
    s = Math.max(0, Math.round(s));
    return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0")).join(":");
  };
  const rest = () => {
    t.textContent = "00:00:00";
    d.forEach((i) => i.classList.add("on"));
    st.classList.add("on");
  };
  function run() {
    if (!on) return;
    st.classList.remove("on");
    const T = 432000;
    const dur = 2800;
    const s0 = performance.now();
    const step = (now: number) => {
      if (!on) return;
      const p = Math.min(1, (now - s0) / dur);
      t.textContent = f(T * (1 - p));
      d.forEach((i, j) => i.classList.toggle("on", p >= (j + 1) / 5 - 0.001));
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        st.classList.add("on");
        to = window.setTimeout(run, 1600);
      }
    };
    raf = requestAnimationFrame(step);
  }
  rest();
  return {
    play() {
      if (on || prefersReducedMotion()) return;
      on = true;
      run();
    },
    stop() {
      on = false;
      cancelAnimationFrame(raf);
      clearTimeout(to);
      rest();
    },
  };
}

/* NS Agro: 72 puntos sueltos → ordenados por severidad → 27 mejoras ICE */
function pvNs(el: HTMLElement): Preview {
  const w = document.createElement("div");
  w.className = "pn";
  el.appendChild(w);
  const dots: HTMLElement[] = [];
  for (let i = 0; i < 72; i++) {
    const e = document.createElement("i");
    e.className = i < 14 ? "cr" : i < 40 ? "me" : "ba";
    e.style.setProperty("--j", String(i));
    w.appendChild(e);
    dots.push(e);
  }
  const lbl = el.querySelector(".pv-l")!;
  const grid = (hl: boolean) => {
    dots.forEach((e, i) => {
      e.style.left = (((i % 18) + 0.5) / 18) * 100 + "%";
      e.style.top = ((Math.floor(i / 18) + 0.5) / 4) * 100 + "%";
      e.classList.toggle("hi", i < 27);
    });
    w.classList.toggle("hl", hl);
  };
  const chaos = () => {
    w.classList.remove("hl");
    dots.forEach((e) => {
      e.style.left = 3 + Math.random() * 94 + "%";
      e.style.top = 4 + Math.random() * 92 + "%";
    });
  };
  let on = false;
  let tok = 0;
  async function run() {
    const k = ++tok;
    while (on && k === tok) {
      chaos();
      lbl.textContent = "72 HALLAZGOS SUELTOS";
      await sleep(2800);
      if (!on || k !== tok) return;
      grid(false);
      lbl.textContent = "POR SEVERIDAD";
      await sleep(3000);
      if (!on || k !== tok) return;
      grid(true);
      lbl.textContent = "27 MEJORAS · ICE";
      await sleep(3400);
    }
  }
  const rest = () => {
    grid(true);
    lbl.textContent = "72 HALLAZGOS → 27 MEJORAS";
  };
  rest();
  return {
    play() {
      if (on || prefersReducedMotion()) return;
      on = true;
      run();
    },
    stop() {
      on = false;
      tok++;
      rest();
    },
  };
}

/* Resiter: etiquetas desordenadas → árbol de arquitectura */
function pvRes(el: HTMLElement): Preview {
  const w = document.createElement("div");
  w.className = "prs";
  el.appendChild(w);
  const cats: [number, string][] = [
    [14, "SERVICIOS"],
    [38, "EMPRESA"],
    [62, "IMPACTO"],
    [86, "CONTACTO"],
  ];
  const spec: { x: number; y: number; t: string; c?: string }[] = [{ x: 50, y: 16, t: "INICIO", c: "root" }];
  let d = "";
  cats.forEach(([x, t]) => {
    spec.push({ x, y: 48, t });
    d += `M50 16V32H${x}V48`;
    [-5, 5].forEach((o) => {
      spec.push({ x: x + o, y: 78, t: "", c: "kid" });
      d += `M${x} 48V63H${x + o}V78`;
    });
  });
  w.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg>`;
  const nodes = spec.map((s, i) => {
    const b = document.createElement("b");
    b.textContent = s.t;
    if (s.c) b.className = s.c;
    b.style.setProperty("--j", String(i));
    w.appendChild(b);
    return b;
  });
  const lbl = el.querySelector(".pv-l")!;
  const order = () => {
    w.classList.add("ord");
    nodes.forEach((b, i) => {
      b.style.left = spec[i].x + "%";
      b.style.top = spec[i].y + "%";
      b.style.setProperty("--r", "0deg");
    });
  };
  const chaos = () => {
    w.classList.remove("ord");
    nodes.forEach((b) => {
      b.style.left = 10 + Math.random() * 80 + "%";
      b.style.top = 10 + Math.random() * 72 + "%";
      b.style.setProperty("--r", (Math.random() * 30 - 15).toFixed(1) + "deg");
    });
  };
  let on = false;
  let tok = 0;
  async function run() {
    const k = ++tok;
    while (on && k === tok) {
      chaos();
      lbl.textContent = "CAOS";
      await sleep(1500);
      if (!on || k !== tok) return;
      order();
      lbl.textContent = "ARQUITECTURA";
      await sleep(2400);
    }
  }
  const rest = () => {
    order();
    lbl.textContent = "CAOS → ARQUITECTURA";
  };
  rest();
  return {
    play() {
      if (on || prefersReducedMotion()) return;
      on = true;
      run();
    },
    stop() {
      on = false;
      tok++;
      rest();
    },
  };
}

/* QR IA: plantilla con [corchetes] que se llena hasta ser un reporte */
function pvQr(el: HTMLElement): Preview {
  const hs = [40, 62, 48, 80, 56, 92, 70, 100];
  el.insertAdjacentHTML(
    "beforeend",
    `<div class="pq"><div class="pq-b" data-n="encabezado"><div class="pq-h"><i></i><u></u></div></div><div class="pq-r"><div class="pq-b" data-n="kpi"><span class="pq-k">128<small></small></span></div><div class="pq-b" data-n="kpi"><span class="pq-k">34%<small></small></span></div><div class="pq-b" data-n="kpi"><span class="pq-k">12<small></small></span></div></div><div class="pq-b" data-n="gráfico"><div class="pq-c">${hs
      .map((h) => `<i style="--h:${h}"></i>`)
      .join("")}</div></div><div class="pq-b" data-n="lectura"><div class="pq-tx"><i></i><i></i></div></div></div>`,
  );
  const bl = [...el.querySelectorAll(".pq-b")];
  const lbl = el.querySelector(".pv-l")!;
  let on = false;
  let tok = 0;
  async function run() {
    const k = ++tok;
    while (on && k === tok) {
      bl.forEach((b) => b.classList.add("empty"));
      lbl.textContent = "[ PLANTILLA BASE ]";
      await sleep(900);
      for (const b of bl) {
        if (!on || k !== tok) return;
        b.classList.remove("empty");
        await sleep(380);
      }
      lbl.textContent = "REPORTE LISTO";
      await sleep(2000);
    }
  }
  const rest = () => {
    bl.forEach((b) => b.classList.remove("empty"));
    lbl.textContent = "PLANTILLA → REPORTE";
  };
  rest();
  return {
    play() {
      if (on || prefersReducedMotion()) return;
      on = true;
      run();
    },
    stop() {
      on = false;
      tok++;
      rest();
    },
  };
}

const FACTORIES: Record<CaseId, (el: HTMLElement) => Preview> = { sal: pvSal, ns: pvNs, res: pvRes, qr: pvQr };

/** Monta el adelanto de un caso dentro de un contenedor .pv que ya tiene su etiqueta .pv-l */
export function mountPreview(id: CaseId, el: HTMLElement): Preview {
  return FACTORIES[id](el);
}
