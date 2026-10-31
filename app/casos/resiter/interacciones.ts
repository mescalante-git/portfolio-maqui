// @ts-nocheck
/* Animaciones e interacciones del caso, tal cual el HTML aprobado. */
export default function run() {
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const vh = innerHeight;
  const onView = (el, fn, th = .35) => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold: th });
    io.observe(el);
  };

  /* ---- reveal (solo lo que está debajo del primer pantallazo) ---- */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.remove('pre'); rio.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  if (!RM) $$('[data-reveal],[data-go]').forEach(el => {
    if (el.getBoundingClientRect().top > vh * .9) { el.classList.add('pre'); rio.observe(el); }
  });

  /* ---- contadores ---- */
  const fmt = (el, v) => el.dataset.sep ? Math.round(v).toLocaleString('es-AR') : String(Math.round(v));
  function runCount(el) {
    const to = +el.dataset.count;
    if (RM) { el.textContent = fmt(el, to); return; }
    const dur = to > 1000 ? 2200 : 1300, t0 = performance.now();
    (function f(t) {
      const p = clamp((t - t0) / dur, 0, 1);
      el.textContent = fmt(el, to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }
  $$('[data-count]').forEach(el => onView(el, () => runCount(el), .6));

  /* ---- glitch ---- */
  const h1 = $('#h1');
  const glitch = el => { el.classList.remove('glitching'); void el.offsetWidth; el.classList.add('glitching'); };
  if (!RM) {
    setTimeout(() => glitch(h1), 350);
    setInterval(() => glitch(h1), 6500);
    h1.addEventListener('pointerenter', () => glitch(h1));
    $$('.sec-title').forEach(t => onView(t, () => glitch(t), .6));
  }

  /* ---- subtítulo terminal ---- */
  const typed = $('#typed'), full = typed.textContent;
  if (!RM) {
    typed.textContent = '';
    setTimeout(() => {
      typed.classList.add('typing');
      let i = 0;
      const iv = setInterval(() => {
        typed.textContent = full.slice(0, ++i);
        if (i >= full.length) { clearInterval(iv); setTimeout(() => typed.classList.remove('typing'), 2600); }
      }, 34);
    }, 800);
  }

  /* ---- brillo de portada ---- */
  const portada = $('#portada'), follow = $('.follow');
  portada.addEventListener('pointermove', e => {
    const r = portada.getBoundingClientRect();
    follow.style.setProperty('--px', (e.clientX - r.left) + 'px');
    follow.style.setProperty('--py', (e.clientY - r.top) + 'px');
  });

  /* ---- lightbox ---- */
  const lb = $('#lb'), lbImg = $('img', lb);
  $$('[data-lb]').forEach(el => el.addEventListener('click', () => { lbImg.src = $('img', el).src; lb.classList.add('on'); }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });

  /* ---- diagnóstico con pines ---- */
  const diag = $('#diag'), pins = $$('.pin', diag), notes = $$('.note');
  function pick(n) {
    pins.forEach(p => p.setAttribute('aria-pressed', p.dataset.n === n ? 'true' : 'false'));
    notes.forEach(p => p.classList.toggle('on', p.dataset.n === n));
  }
  pins.forEach(p => p.addEventListener('click', e => { e.stopPropagation(); pick(p.dataset.n); }));
  notes.forEach(p => p.addEventListener('click', () => pick(p.dataset.n)));
  pins.forEach(p => p.addEventListener('pointerenter', () => pick(p.dataset.n)));
  onView(diag, () => { diag.classList.remove('pre'); if (!RM) diag.classList.add('run'); setTimeout(() => pick('0'), RM ? 0 : 1400); }, .4);
  if (RM) diag.classList.remove('pre');

  /* ---- demo AOS ---- */
  const aosCard = $('#aosCard'), aosAttr = $('#aosAttr'), aosChips = $$('#aosChips .chip');
  function playAos(a) {
    aosChips.forEach(c => c.setAttribute('aria-pressed', c.dataset.a === a ? 'true' : 'false'));
    aosAttr.textContent = '"' + a + '"';
    if (RM) return;
    aosCard.className = 'aos-card'; void aosCard.offsetWidth; aosCard.classList.add('play-' + a);
  }
  aosChips.forEach(c => c.addEventListener('click', () => playAos(c.dataset.a)));
  onView($('#aosStage'), () => playAos('fade-up'), .5);
  $('#aosOrig').addEventListener('click', () => { lbImg.src = '/casos/resiter/img-10.webp'; lb.classList.add('on'); });

  /* ================= PROTAGONISTA: del caos a la arquitectura ================= */
  const stage = $('#stage');
  // grupos del sitio anterior (ítems reales del mapa en FigJam)
  const OLD = [
    ['HEADER SUPERIOR', 0, ['Conozca Resiter', ['Noticias y Galería', 'old', 'INFO 2020/21'], 'Trabaja en Resiter', 'Ética y cumplimiento', 'Acceso clientes']],
    ['MENÚ PRINCIPAL', 1, ['Servicios', ['Industrias', 'dup', '×2 EN INGLÉS'], 'Filiales', 'Economía circular', ['Productos', 'out'], 'Contacto']],
    ['SERVICIOS', 2, ['Gestión integral de residuos', 'Valorización de residuos', 'Recursos hídricos y RILes', 'Aseo tecnificado', 'Limpieza y remediación', 'Servicios sanitarios', 'Ingeniería y construcción']],
    ['INDUSTRIAS', 3, ['Agrícola', ['Alimentaria', 'dup', 'SE REPITE'], 'Construcción', 'Energía renovable', ['Forestal y celulosa', 'dup', 'SE REPITE'], ['Minería', 'dup', 'SE REPITE'], ['Naviera', 'merge', 'SE JUNTAN'], ['Petrolera', 'merge', 'SE JUNTAN'], 'Retail', 'Salmonera', 'Vitivinícola']],
    ['MAILS', 4, ['RE: textos home', 'FW: fotos planta', 'RE: RE: orden del menú', 'Fwd: logos filiales', '¿Esta sección va?', 'RE: cambios v2', 'FW: fotos nuevas']]
  ];
  const NEW = [
    ['UTILIDADES', 'util', ['Centros de valorización', 'Noticias', 'Contacto', 'Trabaja con nosotros', 'Intranet', 'EN | ES']],
    ['Quiénes somos', 'cat', ['Propósito y valores', 'Historia e hitos', 'Estructura y directorio', 'Estrategia', 'En cifras']],
    ['Líneas de negocio', 'cat', ['Waste to energy', 'Tratamiento de aguas industriales', 'Gestión de residuos y economía circular']],
    ['Industrias', 'cat', ['Minería', 'Oil & Gas', 'Agrofood', 'Forestal y celulosa', 'Salmonera']],
    ['Sostenibilidad', 'cat', ['Sostenibilidad', 'Ética y cumplimiento', 'Canal de denuncias']]
  ];
  const ORIGIN = { 'Oil & Gas': 'Petrolera', 'Minería': 'Minería', 'Forestal y celulosa': 'Forestal y celulosa', 'Salmonera': 'Salmonera', 'Agrofood': 'Alimentaria', 'Ética y cumplimiento': 'Ética y cumplimiento', 'Noticias': 'Noticias y Galería', 'Contacto': 'Contacto', 'Trabaja con nosotros': 'Trabaja en Resiter', 'Quiénes somos': 'Conozca Resiter', 'Industrias': 'Industrias', 'Centros de valorización': 'Filiales', 'Gestión de residuos y economía circular': 'Gestión integral de residuos', 'Tratamiento de aguas industriales': 'Recursos hídricos y RILes', 'Sostenibilidad': 'Economía circular' };

  const mk = (txt, cls) => { const d = document.createElement('div'); d.className = 'n ' + cls; const s = document.createElement('span'); s.textContent = txt; d.appendChild(s); stage.appendChild(d); return d; };
  const oldN = [], oldH = [], newN = [], newH = [];
  OLD.forEach(([h, g, items], gi) => {
    oldH.push({ el: mk(h, 'hd old'), g: gi });
    items.forEach(it => {
      const [t, f, note] = Array.isArray(it) ? it : [it];
      const el = mk(t, 'old ' + (gi === 4 ? 'mail' : 'g' + g) + (f ? ' f-' + f : ''));
      if (note) el.dataset.note = note;
      oldN.push({ el, g: gi, t, f });
    });
  });
  NEW.forEach(([h, kind, items], gi) => {
    if (kind === 'util') newH.push({ el: mk('HEADER · UTILIDADES', 'hd nw'), g: gi });
    else newN.push({ el: mk(h, 'new cat'), g: gi, t: h, head: true });
    items.forEach(t => newN.push({ el: mk(t, 'new' + (kind === 'util' ? ' util' : '')), g: gi, t }));
  });

  // generador pseudoaleatorio estable
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const RAND = oldN.map(() => [rnd(), rnd(), rnd()]);

  const P = {}; // posiciones calculadas por fase: Map el -> {x,y,w,o,r,s}
  function measure(el, w) { el.style.width = w + 'px'; return el.offsetHeight; }
  function columns(groups, W, cols, top, gapX, gapY) {
    // groups: [{head, items:[nodes]}] -> devuelve posiciones y altura total
    const out = new Map(); const colW = (W - gapX * (cols - 1)) / cols;
    let y0 = top, rowMax = 0;
    groups.forEach((gr, i) => {
      const c = i % cols; if (c === 0 && i) { y0 += rowMax + 26; rowMax = 0; }
      const x = c * (colW + gapX); let y = y0;
      if (gr.head) { const h = measure(gr.head, colW); out.set(gr.head, { x, y, w: colW, o: 1 }); y += h + 8; }
      gr.items.forEach(n => { const h = measure(n, colW); out.set(n, { x, y, w: colW, o: 1 }); y += h + gapY; });
      rowMax = Math.max(rowMax, y - y0);
    });
    return { out, h: y0 + rowMax };
  }
  function layout() {
    const pad = innerWidth < 560 ? 12 : 22;
    const W = stage.clientWidth - pad * 2, cols = W >= 760 ? 4 : 2;
    stage.style.setProperty('--pad', pad + 'px');
    // fase 2 · mapeo: columnas como en FigJam
    const g2 = OLD.map((_, gi) => ({ head: oldH[gi].el, items: oldN.filter(n => n.g === gi).map(n => n.el) }));
    const L2 = columns(g2, W, cols >= 4 ? 5 : 2, 0, 12, 6);
    // fase 4 · arquitectura nueva
    const util = newN.filter(n => n.g === 0);
    const L4 = new Map();
    L4.set(newH[0].el, { x: 0, y: 0, w: W, o: 1 }); let ux = 0, uy = measure(newH[0].el, W) + 8, uh = 0;
    util.forEach(n => {
      n.el.style.width = 'auto'; const w = Math.min(W, n.el.offsetWidth + 2); const h = measure(n.el, w);
      if (ux + w > W) { ux = 0; uy += uh + 8; uh = 0; }
      L4.set(n.el, { x: ux, y: uy, w, o: 1 }); ux += w + 8; uh = Math.max(uh, h);
    });
    const cats = [1, 2, 3, 4].map(gi => { const ns = newN.filter(n => n.g === gi); return { head: ns[0].el, items: ns.slice(1).map(n => n.el) }; });
    const C4 = columns(cats, W, cols, uy + uh + 30, 14, 7);
    C4.out.forEach((v, k) => L4.set(k, v));
    const H = Math.max(L2.h, C4.h, 380) + pad * 2 + 10;
    // fase 1 · caos: dispersos por todo el lienzo
    const L1 = new Map();
    oldN.forEach((n, i) => {
      const [a, b, c] = RAND[i]; n.el.style.width = 'auto';
      const w = Math.min(W * .55, n.el.offsetWidth + 2);
      L1.set(n.el, { x: a * (W - w), y: b * (H - pad * 2 - 40), w, o: 1, r: (c - .5) * 24 });
    });
    P.L1 = L1; P.L2 = L2.out; P.L4 = L4; P.H = H; P.pad = pad;
    apply(stage.dataset.ph, true);
  }
  function setN(el, p, delay) {
    el.style.setProperty('--sd', (delay || 0) + 'ms');
    el.style.width = p.w + 'px';
    el.style.opacity = p.o;
    el.style.transform = 'translate(' + (p.x + P.pad) + 'px,' + (p.y + P.pad) + 'px) rotate(' + (p.r || 0) + 'deg) scale(' + (p.s || 1) + ')';
    el.style.pointerEvents = 'none';
  }
  const hide = (p, s) => ({ ...p, o: 0, s: s || .6, r: 0 });
  const findOld = t => oldN.find(n => n.t === t);
  function apply(ph, instant) {
    ph = +ph; stage.dataset.ph = ph; stage.style.height = P.H + 'px';
    const L2 = P.L2, L1 = P.L1, L4 = P.L4;
    const center = { x: stage.clientWidth / 2 - P.pad - 60, y: P.H / 2 - P.pad, w: 120 };
    oldH.forEach(h => setN(h.el, ph === 2 || ph === 3 ? L2.get(h.el) : hide(L2.get(h.el), 1), 0));
    oldN.forEach((n, i) => {
      const d = instant ? 0 : (ph === 1 ? 0 : i * 18);
      if (ph === 1) setN(n.el, L1.get(n.el), d);
      else if (ph === 2) setN(n.el, L2.get(n.el), d);
      else if (ph === 3) {
        const p = L2.get(n.el);
        if (n.g === 4) setN(n.el, { ...p, y: p.y - 40, o: 0 }, d);
        else setN(n.el, n.f ? { ...p, o: .35 } : p, d);
      } else setN(n.el, hide(L2.get(n.el), .7), instant ? 0 : i * 8);
    });
    newH.forEach(h => setN(h.el, ph === 4 ? L4.get(h.el) : hide(L4.get(h.el), 1), ph === 4 && !instant ? 500 : 0));
    newN.forEach((n, i) => {
      const tgt = L4.get(n.el);
      if (ph === 4) setN(n.el, tgt, instant ? 0 : 350 + i * 35);
      else {
        const o = findOld(ORIGIN[n.t] || ''); const src = o ? (ph === 1 ? L1.get(o.el) : L2.get(o.el)) : center;
        setN(n.el, { x: src.x, y: src.y, w: Math.max(80, tgt.w * .7), o: 0, s: .7 }, 0);
      }
    });
    const T = PH[ph - 1];
    $('#phNum').textContent = '0' + ph; $('#phT').textContent = T[0]; $('#phP').textContent = T[1];
    $('#phL').innerHTML = T[2].map(([k, l]) => '<span><i style="--k:' + k + '"></i>' + l + '</span>').join('');
    $$('.step').forEach(b => b.setAttribute('aria-pressed', b.dataset.ph == ph ? 'true' : 'false'));
  }
  const PH = [
    ['CAOS', 'Así llegaba todo: secciones del sitio viejo, servicios, industrias repetidas y mails con textos y fotos sueltos, sin un orden común.', [['var(--muted)', 'Ítems del sitio anterior'], ['var(--pink-l)', 'Mails con contenido']]],
    ['MAPEO', 'Ordené todo en FigJam con la estructura real del sitio. Ahí apareció lo que no funcionaba: industrias repetidas en varios lugares, secciones duplicadas en inglés e información de 2020/21.', [['var(--pink)', 'Se repite'], ['var(--violet-l)', 'Se juntan o está desactualizado'], ['var(--muted)', 'Estructura actual']]],
    ['PACTO', 'Con el mapa como documento de consenso, pactamos con el cliente qué secciones quedan en el header, qué va en cada desplegable y qué información se queda, se agrega o se va.', [['var(--lime-d)', 'Se queda'], ['var(--muted)', 'Sale o se fusiona']]],
    ['ARQUITECTURA', 'El resultado: cuatro categorías claras en el menú principal y una barra de utilidades. Industrias y Líneas de negocio dejan de mezclarse y cada contenido tiene un solo lugar.', [['var(--lime)', 'Categoría principal'], ['var(--lime-l)', 'Subsección'], ['var(--cyan-l)', 'Utilidades']]]
  ];

  let timer = null, auto = false;
  function go(ph) { apply(ph, false); }
  async function play() {
    if (auto) return; auto = true;
    for (let ph = 1; ph <= 4 && auto; ph++) { go(ph); await sleep(ph === 1 ? 2600 : 3600); }
    auto = false;
  }
  $$('.step').forEach(b => b.addEventListener('click', () => { auto = false; go(b.dataset.ph); }));
  $('#replay').addEventListener('click', () => { auto = false; setTimeout(play, 30); });
  let lw = 0;
  addEventListener('resize', () => { if (Math.abs(innerWidth - lw) > 40) { lw = innerWidth; layout(); } });
  function initArq() { lw = innerWidth; layout(); if (RM) apply(4, true); else onView(stage, () => setTimeout(play, 500), .35); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(initArq); else initArq();

  /* ---- log de iteraciones ---- */
  const LOG = [
    ['init', 'kickoff · pedido: rediseño completo, desktop y mobile', ''],
    ['scan', 'diagnóstico · saturación, íconos genéricos, jerarquía plana', ''],
    ['map', 'mapa en FigJam · contenido repetido y desactualizado', ''],
    ['wf', 'wireframes de baja · co-creación semanal con el cliente', ''],
    ['mail', 'textos y fotos llegan por mails separados', 'm'],
    ['v1', 'alta fidelidad → feedback → cambios', 'v'],
    ['v2', 'se pide un ajuste → se hace → se vuelve a cambiar', 'v'],
    ['v3', 'secciones que "ya no van" → se quitan', 'v'],
    ['mail', 'llega material nuevo · otra vuelta', 'm'],
    ['vN', 'rediseño completo en un segundo archivo de Figma', 'v'],
    ['ok', 'design system + prototipos + simulaciones de movimiento', 'ok']
  ];
  const logList = $('#logList'), verN = $('#verN'), ver = $('#ver');
  const addLi = (tg, cls) => { const li = document.createElement('li'); li.className = cls; li.innerHTML = '<span class="tg">[' + tg + ']</span><span class="tx"></span>'; logList.appendChild(li); return li; };
  function bump(v) { verN.textContent = v; ver.classList.remove('bump'); void ver.offsetWidth; ver.classList.add('bump'); }
  if (RM) { LOG.forEach(([tg, tx, c]) => { addLi(tg, c).lastChild.textContent = tx; }); verN.textContent = 'vN'; }
  else onView($('#log'), async () => {
    for (const [tg, tx, c] of LOG) {
      const li = addLi(tg, c + ' cur'), t = li.lastChild;
      if (c === 'v') bump(tg);
      for (let i = 1; i <= tx.length; i++) { t.textContent = tx.slice(0, i); await sleep(14); }
      li.classList.remove('cur'); await sleep(c === 'm' ? 420 : 240);
    }
  }, .4);

  /* ---- "lo que me llevo": la línea de cada renglón se dibuja en secuencia ---- */
  (function () {
    const box = $('.learn'), rows = $$('.lrn', box); if (!rows.length || RM) return;
    box.classList.add('typ');
    onView(box, () => rows.forEach((r, i) => setTimeout(() => r.classList.add('done'), 300 + i * 450)), .35);
  })();

  /* ---- comparador antes / después ---- */
  const CMP = [
    ['HEADER', 'header', 'De dos barras de menú que competían entre sí a un header en dos niveles: lo institucional arriba y las líneas de negocio en una barra propia, con las industrias en un desplegable sobre una foto real.', ['−2 menús compitiendo', '+líneas de negocio visibles', '+foto real']],
    ['INDUSTRIAS', 'industrias', 'Las mismas cards de colores e íconos genéricos se repetían en Servicios, en Industrias y en cada subsección. Ahora cada industria tiene su bloque con fotografía real, un dato clave y un acceso directo.', ['−cards repetidas', '+fotografía real', '+datos clave']],
    ['DÓNDE OPERAMOS', 'donde', 'La lista de países con un "Ver más" por cada uno pasó a ser un mapa interactivo: cada bandera reacciona al hover y lleva a su país con un clic, conectada a Chile como centro de la operación.', ['+mapa interactivo', '−botones por país']],
    ['VALORES', 'valores', 'El texto de cada valor estaba oculto detrás de un "+". Ahora se lee en cards, y esta sección definió la nueva paleta de azules y una iconografía más sobria en lugar de los dibujos animados.', ['−texto oculto', '+paleta base', '+íconos sobrios']],
    ['DIRECTORIO', 'directorio', 'Para leer la trayectoria de cada integrante había que abrir un pop-up. Ahora la información se presenta de forma inmediata en cards, con la foto, el cargo destacado y el texto completo.', ['−pop-up', '+lectura inmediata']],
    ['CENTROS', 'centros', 'Cada empresa era un logo con una flecha que abría un pop-up con scroll interno. Ahora el perfil completo se lee de inmediato, en un formato consistente para todas.', ['−pop-up con scroll', '+formato consistente']]
  ];
  const IMGS = {"cmp-header-antes": "/casos/resiter/img-11.webp", "cmp-header-nuevo": "/casos/resiter/img-12.webp", "cmp-industrias-antes": "/casos/resiter/img-13.webp", "cmp-industrias-nuevo": "/casos/resiter/img-14.webp", "cmp-donde-antes": "/casos/resiter/img-15.webp", "cmp-donde-nuevo": "/casos/resiter/img-16.webp", "cmp-valores-antes": "/casos/resiter/img-17.webp", "cmp-valores-nuevo": "/casos/resiter/img-18.webp", "cmp-directorio-antes": "/casos/resiter/img-19.webp", "cmp-directorio-nuevo": "/casos/resiter/img-20.webp", "cmp-centros-antes": "/casos/resiter/img-21.webp", "cmp-centros-nuevo": "/casos/resiter/img-22.webp"};
  const ba = $('#ba'), baA = $('#baA'), baN = $('#baN'), baR = $('#baR'), cmpChips = $('#cmpChips');
  cmpChips.innerHTML = CMP.map((c, i) => '<button class="chip" type="button" aria-pressed="' + (i ? 'false' : 'true') + '" data-i="' + i + '">' + c[0] + '</button>').join('');
  function showCmp(i, first) {
    const c = CMP[i];
    $$('.chip', cmpChips).forEach(b => b.setAttribute('aria-pressed', b.dataset.i == i ? 'true' : 'false'));
    const set = () => {
      baA.src = IMGS['cmp-' + c[1] + '-antes']; baA.alt = c[0] + ': versión anterior';
      baN.src = IMGS['cmp-' + c[1] + '-nuevo']; baN.alt = c[0] + ': versión nueva';
      const fit = () => { const r = Math.max(baN.naturalWidth / baN.naturalHeight || 1.6, baA.naturalWidth / baA.naturalHeight || 1.6); ba.style.setProperty('--ar', String(clamp(r, 1.2, 2.6))); };
      if (baN.complete && baA.complete) fit(); else { baN.onload = baA.onload = fit; }
      $('#cmpP').textContent = c[2];
      $('#cmpT').innerHTML = c[3].map(t => '<span class="tg2' + (t[0] === '+' ? ' plus' : '') + '">' + t + '</span>').join('');
      ba.classList.remove('swap');
    };
    if (first || RM) { set(); return; }
    ba.classList.add('swap'); setTimeout(set, 280);
    sweepTo(15, () => sweepTo(50));
  }
  function setPos(v) { ba.style.setProperty('--pos', v + '%'); baR.value = v; }
  let sw = null;
  function sweepTo(to, done) {
    if (RM) { setPos(to); return; }
    cancelAnimationFrame(sw); const from = +baR.value, t0 = performance.now();
    (function f(t) { const p = clamp((t - t0) / 650, 0, 1), e = 1 - Math.pow(1 - p, 3); setPos(from + (to - from) * e); if (p < 1) sw = requestAnimationFrame(f); else done && done(); })(t0);
  }
  baR.addEventListener('input', () => { cancelAnimationFrame(sw); setPos(+baR.value); });
  $$('.chip', cmpChips).forEach(b => b.addEventListener('click', () => showCmp(+b.dataset.i)));
  showCmp(0, true);
  onView(ba, () => sweepTo(85, () => sweepTo(15, () => sweepTo(50))), .5);

  /* ---- zoom out del canvas + header, progreso y guía ---- */
  /* ---- capturas largas que se scrollean solas (pausa con el mouse) ---- */
  $$('.shot.tall').forEach((box, k) => {
    const img = $('img', box); if (RM) return;
    let t = 0, last = 0, paused = false, running = false;
    const period = k === 0 ? 46000 : 52000;
    box.addEventListener('pointerenter', () => paused = true);
    box.addEventListener('pointerleave', () => paused = false);
    function tick(now) {
      const dt = last ? now - last : 0; last = now;
      if (!paused) t += dt;
      const travel = Math.max(0, img.offsetHeight - box.clientHeight);
      const ph = (t % period) / period, tri = ph < .5 ? ph * 2 : 2 - ph * 2;
      const e = tri < .5 ? 2 * tri * tri : 1 - Math.pow(-2 * tri + 2, 2) / 2;
      img.style.transform = 'translateY(' + (-travel * e).toFixed(1) + 'px)';
      requestAnimationFrame(tick);
    }
    onView(box, () => { if (!running) { running = true; requestAnimationFrame(tick); } }, .3);
  });

  const zoom = $('#zoom'), zimg = $('img', zoom);
  const GUIDE = {
    portada: ['PORTADA', 'El título hace glitch y el subtítulo se escribe tipo terminal. El fondo es un lienzo punteado como el de FigJam y los contadores suben desde 0.'],
    intro: ['INTRODUCCIÓN', 'Las cards entran en cascada. Al pasar el mouse, las esquinas de visor recorren todo el borde.'],
    estrategia: ['ESTRATEGIA VISUAL', 'Un barrido escanea el sitio viejo y aparecen los puntos del diagnóstico: tocalos para ver cada problema. Más abajo, probá los efectos AOS en vivo.'],
    arquitectura: ['GESTIÓN & ARQUITECTURA', 'La animación protagonista: los ítems pasan de caos a mapeo, pacto y arquitectura final. Usá las fases o REPRODUCIR. El log se escribe solo y la versión sube con cada vuelta.'],
    solucion: ['SOLUCIÓN', 'Las homes desktop y mobile se scrollean solas (el mouse las pausa). Arrastrá el divisor del antes/después y cambiá de sección con los chips. Al scrollear, el archivo final se aleja hasta verse completo, con sus 288 pantallas.'],
    cierre: ['CIERRE', 'Las cards entran en cascada. Bajo cada aprendizaje se dibuja una línea neón de fucsia a celeste, una después de otra. El botón del siguiente caso se desplaza al pasar el mouse.']
  };
  const SECS = ['portada', 'intro', 'estrategia', 'arquitectura', 'solucion', 'cierre'].map(id => $('#' + id));
  const nav = $('#nav'), prog = $('#progress'), dots = $('#dotsBg'), navCur = $('#navCur');
  const links = $$('.nav li a');
  let cur = '', ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? clamp(y / max, 0, 1) * 100 : 0) + '%';
    nav.classList.toggle('show', y > portada.offsetHeight - 180);
    if (!RM) {
      dots.style.transform = 'translateY(' + (y * .25) + 'px)';
      const r = zoom.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight * .75), 0, 1);
      zimg.style.transform = 'scale(' + (2.2 - 1.2 * p).toFixed(3) + ')';
    }
    let id = 'portada';
    for (const s of SECS) if (s.getBoundingClientRect().top <= innerHeight * .4) id = s.id;
    if (id !== cur) {
      cur = id;
      links.forEach(a => a.setAttribute('aria-current', a.dataset.sec === id ? 'true' : 'false'));
      const g = GUIDE[id]; navCur.textContent = g[0];
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  })();
}
