// @ts-nocheck
/* Animaciones e interacciones del caso, tal cual el HTML aprobado. */
export default function run() {
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const vh = innerHeight;
  const onView = (el, fn, th = .35) => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold: th });
    io.observe(el);
  };
  const watch = (el, fnIn, fnOut, th = .2) => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? fnIn() : fnOut && fnOut()), { threshold: th });
    io.observe(el);
  };

  /* ---- reveal (sólo lo que está debajo del primer pantallazo) ---- */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.remove('pre'); rio.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  if (!RM) $$('[data-reveal],[data-go]').forEach(el => {
    if (el.getBoundingClientRect().top > vh * .9) { el.classList.add('pre'); rio.observe(el); }
  });

  /* ---- números con formato argentino ---- */
  const fmt = (n, dec) => n.toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const parseNum = s => {
    const m = /^(.*?)(\d{1,3}(?:\.\d{3})+|\d+)(,\d+)?(.*)$/.exec(s);
    if (!m) return null;
    const dec = m[3] ? m[3].length - 1 : 0;
    return { pre: m[1], suf: m[4], n: parseFloat(m[2].replace(/\./g, '') + (m[3] ? '.' + m[3].slice(1) : '')), dec };
  };
  function countTo(el, txt, dur = 900) {
    const p = parseNum(txt);
    if (!p || RM) { el.textContent = txt; return; }
    const t0 = performance.now();
    (function f(t) {
      const k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = k < 1 ? p.pre + fmt(p.n * e, p.dec) + p.suf : txt;
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }
  $$('[data-count]').forEach(el => onView(el, () => countTo(el, el.textContent, 1300), .6));

  /* ---- glitch ---- */
  const h1 = $('#h1');
  const glitch = el => { el.classList.remove('glitching'); void el.offsetWidth; el.classList.add('glitching'); };
  if (!RM) {
    setTimeout(() => glitch(h1), 350);
    setInterval(() => glitch(h1), 6500);
    h1.addEventListener('pointerenter', () => glitch(h1));
    $$('.sec-title').forEach(t => onView(t, () => glitch(t), .6));
  }

  /* ---- bajada en streaming, palabra por palabra ---- */
  (function () {
    const lead = $('#lead');
    if (RM) return;
    const words = lead.textContent.trim().split(/\s+/);
    lead.innerHTML = words.map(w => '<span class="w">' + w + '</span>').join(' ');
    const ws = $$('.w', lead);
    setTimeout(() => {
      lead.classList.add('streaming');
      ws.forEach((w, i) => setTimeout(() => {
        w.classList.add('on');
        if (i === ws.length - 1) setTimeout(() => lead.classList.remove('streaming'), 1800);
      }, i * 75 + Math.random() * 40));
    }, 700);
  })();

  /* ---- brillo que sigue al puntero en la portada ---- */
  const portada = $('#portada'), follow = $('.follow');
  portada.addEventListener('pointermove', e => {
    const r = portada.getBoundingClientRect();
    follow.style.setProperty('--px', (e.clientX - r.left) + 'px');
    follow.style.setProperty('--py', (e.clientY - r.top) + 'px');
  });

  /* ---- 01 · auditoría del punto de partida ---- */
  (function () {
    const box = $('#audit'), rows = $$('.arow', box), st = $('#auditSt');
    const done = i => { rows[i].classList.add('done'); rows[i].querySelector('.pb').innerHTML = rows[i].querySelector('.pb').innerHTML.replace(/<\/span>(.*)$/, '</span><s>$1</s>'); st.textContent = (i + 1) + ' / 5 RESUELTOS'; if (i === 4) st.classList.add('ok'); };
    if (RM) { rows.forEach((r, i) => done(i)); return; }
    onView(box, () => rows.forEach((r, i) => setTimeout(() => done(i), 500 + i * 650)), .35);
  })();

  /* ---- 02 · paleta en tres capas ---- */
  (function () {
    const box = $('#layers');
    $$('.lrow:not(.lmore)', box).forEach((r, i) => r.style.setProperty('--rd', (i * 420) + 'ms'));
    if (RM) { box.classList.remove('wait'); return; }
    onView(box, () => box.classList.remove('wait'), .3);
  })();

  /* ---- 02 · logo QR IA que se arma, sincronizado con su línea de tiempo ---- */
  (function () {
    const stage = $('#lstage'), dots = $('#lgDots'), pins = $('#lgPins'), head = $('#tlHead');
    const NS = 'http://www.w3.org/2000/svg';
    for (let y = -6; y <= 36; y += 6) for (let x = -8; x <= 92; x += 6) {
      if (Math.random() > .42) continue;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', .7); c.setAttribute('class', 'lg-dot');
      c.style.setProperty('--dd', (Math.random() * .5).toFixed(2) + 's');
      dots.appendChild(c);
    }
    const P = [];
    [70, 74, 78].forEach(x => P.push([x, 4, x, 6.2]));
    [11, 15, 19].forEach(y => P.push([82.8, y, 85, y]));
    [78, 74, 70].forEach(x => P.push([x, 23.8, x, 26]));
    [19, 15, 11].forEach(y => P.push([63, y, 65.2, y]));
    P.forEach((p, i) => {
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', p[0]); l.setAttribute('y1', p[1]); l.setAttribute('x2', p[2]); l.setAttribute('y2', p[3]);
      l.setAttribute('class', 'lg-pin'); l.style.setProperty('--pd', (.9 + i * .04).toFixed(2) + 's');
      pins.appendChild(l);
    });
    if (RM) { stage.classList.add('play'); return; }
    let t0 = 0, raf = 0, tOut = 0, tLoop = 0, on = false;
    function cycle() {
      stage.classList.remove('play', 'out'); void stage.getBoundingClientRect(); stage.classList.add('play');
      t0 = performance.now();
      tOut = setTimeout(() => stage.classList.add('out'), 5500);
      tLoop = setTimeout(cycle, 6000);
    }
    function tick(now) { head.style.setProperty('--t', clamp((now - t0) / 6000, 0, 1)); raf = requestAnimationFrame(tick); }
    watch(stage, () => { if (on) return; on = true; cycle(); raf = requestAnimationFrame(tick); },
      () => { on = false; clearTimeout(tOut); clearTimeout(tLoop); cancelAnimationFrame(raf); }, .3);
  })();

  /* ---- 02 · probé / quedó: cada card pasa sola a lo que quedó; después se compara a mano ---- */
  (function () {
    const cards = $$('#tries .try');
    cards.forEach(card => {
      const stage = $('.tstage', card), now = $('.tnow', card), btns = $$('.tseg button', card);
      card._set = (st, manual) => {
        if (manual) card._manual = true;
        stage.dataset.s = st;
        btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.s === st));
        now.classList.add('swap');
        setTimeout(() => { now.textContent = now.dataset[st]; now.classList.remove('swap'); }, RM ? 0 : 200);
      };
      btns.forEach(b => b.addEventListener('click', () => card._set(b.dataset.s, true)));
    });
    if (RM) return;
    onView($('#tries'), () => cards.forEach((c, i) => setTimeout(() => { if (!c._manual) c._set('keep'); }, 3200 + i * 700)), .35);
  })();

  /* ---- 02 · paleta: ver más familias ---- */
  (function () {
    const btn = $('#lmoreBtn'), rows = $$('#layers .lmore');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open);
      btn.innerHTML = open ? 'VER MENOS <i>−</i>' : 'VER 5 FAMILIAS MÁS <i>+</i>';
      rows.forEach((r, i) => {
        r.hidden = !open;
        if (open && !RM) { r.style.setProperty('--rd', (i * 260) + 'ms'); r.classList.add('pend'); requestAnimationFrame(() => requestAnimationFrame(() => r.classList.remove('pend'))); }
      });
    });
  })();

  /* ---- visor ampliado ---- */
  const qlb = $('#qlb'), qlbImg = $('#qlbImg');
  const openLb = src => { qlbImg.src = src; qlb.classList.add('on'); qlb.scrollTop = 0; };
  qlb.addEventListener('click', () => qlb.classList.remove('on'));
  addEventListener('keydown', e => { if (e.key === 'Escape') qlb.classList.remove('on'); });
  document.addEventListener('click', e => {
    const im = e.target.closest('img[data-zoom]'); if (im) { openLb(im.src); return; }
    const bx = e.target.closest('[data-zoomsrc]'); if (bx) openLb($('img', bx).src);
  });

  /* ---- 03 · simulador de acceso ---- */
  (function () {
    const SRC = { venta: '/casos/qr-ia/img-10.webp', permiso: '/casos/qr-ia/img-11.webp', centro: '/casos/qr-ia/img-04.webp' };
    const TXT = {
      venta: ['PANTALLA DE VENTA', 'Logo que se arma, beneficios con brillo en ola y un preview desenfocado que rota entre los tres reportes. Un único llamado: Contratá QR IA.', 'Sin plan → venta', 'Gestión · QR IA (sin plan)', 'Pantalla de venta de QR IA'],
      permiso: ['LA MISMA LANDING, CON UN AVISO', 'Muestra lo que tendría con el permiso y cambia el botón por un aviso ámbar: la acción la hace su administrador. Probé un aviso azul y lo descarté, porque se confundía con la card de Suite QR.', 'Con plan, sin permiso → aviso', 'Gestión · QR IA (plan sin permiso)', 'Landing de QR IA con aviso para pedir acceso'],
      centro: ['CENTRO DE REPORTES', 'Tres reportes visibles sin scroll. Cada card muestra un gráfico vivo de lo que genera y un estado real: Disponible, Próximamente o Límite alcanzado.', 'Con plan y permiso → centro', 'Gestión · Centro de reportes', 'Centro de reportes de QR IA']
    };
    const segP = $('#segPlan'), segQ = $('#segPerm'), img = $('#simImg');
    const val = seg => $('[aria-checked=true]', seg).dataset.v === '1';
    let cur = 'centro';
    function update() {
      const plan = val(segP), perm = val(segQ);
      segQ.classList.toggle('off', !plan);
      const k = !plan ? 'venta' : perm ? 'centro' : 'permiso';
      const t = TXT[k];
      $('#simT').textContent = t[0]; $('#simP').textContent = t[1]; $('#simPath').textContent = t[2]; $('#simBar').textContent = t[3];
      if (k === cur) return; cur = k;
      img.classList.add('fade');
      setTimeout(() => { img.src = SRC[k]; img.alt = t[4]; img.classList.remove('fade'); }, RM ? 0 : 220);
    }
    [segP, segQ].forEach(seg => {
      const opts = $$('[role=radio]', seg);
      const pick = o => { opts.forEach(x => { const on = x === o; x.setAttribute('aria-checked', on); x.tabIndex = on ? 0 : -1; }); update(); };
      opts.forEach(o => {
        o.addEventListener('click', () => pick(o));
        o.addEventListener('keydown', e => {
          if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); const n = opts[(opts.indexOf(o) + 1) % 2]; pick(n); n.focus(); }
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pick(o); }
        });
      });
    });
    update();
  })();

  /* ---- 03 · pasos para generar un reporte ---- */
  (function () {
    const S = [
      ['/casos/qr-ia/img-05.webp', 'EN GESTIÓN', 'La card se abre en el lugar', 'Sin cambiar de pantalla. Cada reporte pide sólo lo que necesita: un período, un agente o nada. El período tiene atajos de 3 y 6 meses y una opción manual.', 'Gestión · Centro de reportes', 'Card de Panel de Productividad abierta para elegir el período'],
      ['/casos/qr-ia/img-12.webp', 'EN UNA PESTAÑA NUEVA', 'Una sola pantalla de carga para los tres', 'Cambian el nombre del reporte y los mensajes, que cuentan qué está analizando la IA. El logo se arma al inicio de cada ciclo y la barra avanza con un brillo.', 'Pestaña nueva · Generando reporte', 'Pantalla de carga del reporte'],
      ['/casos/qr-ia/img-08.webp', 'EN LA MISMA PESTAÑA', 'El reporte, como página propia', 'Se abre fuera de Gestión, así que lleva su propia barra con el logo y un pie con el aviso de IA. Al entrar, los datos se revelan: conteos, barras que crecen y brillos en los bordes.', 'Pestaña nueva · Reporte', 'Plantilla base de reporte'],
      ['/casos/qr-ia/img-07.webp', 'EN LA PESTAÑA', 'El error tiene salida', 'La pestaña no se cierra. Explica qué pasó, ofrece reintentar y deja a mano el contacto con soporte. El ícono se sacude o parpadea según el tipo de error.', 'Pestaña nueva · Error', 'Pantalla de error con botón Reintentar']
    ];
    const btns = $$('.step'), img = $('#flowImg');
    let i = 0, auto = true, timer = 0, t0 = 0, raf = 0;
    function show(n) {
      i = n; const s = S[n];
      btns.forEach((b, k) => { b.setAttribute('aria-pressed', k === n); b.style.setProperty('--p', k < n && auto ? 1 : 0); });
      $('#flowWhere').textContent = s[1]; $('#flowH').textContent = s[2]; $('#flowP').textContent = s[3]; $('#flowBar').textContent = s[4];
      img.classList.add('fade');
      setTimeout(() => { img.src = s[0]; img.alt = s[5]; img.classList.remove('fade'); }, RM ? 0 : 220);
      t0 = performance.now();
    }
    function tick(now) {
      if (!auto) return;
      const k = clamp((now - t0) / 5200, 0, 1);
      btns[i].style.setProperty('--p', k);
      if (k >= 1) show((i + 1) % S.length);
      raf = requestAnimationFrame(tick);
    }
    btns.forEach(b => b.addEventListener('click', () => { auto = false; cancelAnimationFrame(raf); btns.forEach(x => x.style.setProperty('--p', 0)); show(+b.dataset.i); }));
    show(0);
    if (!RM) watch($('#steps'), () => { if (auto) { cancelAnimationFrame(raf); t0 = performance.now(); raf = requestAnimationFrame(tick); } }, () => cancelAnimationFrame(raf), .5);
  })();

  /* ---- 04 · protagonista: un reporte, cualquier reporte ---- */
  (function () {
    const CAT = [['kpi', 'INDICADORES'], ['prom', 'PROMEDIOS'], ['kpi2', 'INDICADORES SECUNDARIOS'], ['evo', 'EVOLUCIÓN EN EL TIEMPO'], ['ops', 'OPERACIONES'], ['tabla', 'TABLA'], ['comp', 'COMPARACIÓN'], ['list', 'LISTADO CON FILTROS'], ['sinres', 'SIN RESULTADOS'], ['lect', 'LECTURA EJECUTIVA'], ['hall', 'HALLAZGOS']];
    const MONTHS = ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'];
    const R = {
      prod: {
        tab: 'Panel de Productividad', title: 'Oficina Centro | Panel de Productividad', sub: '24 agentes activos | Promedios de referencia para el período', id: null,
        blocks: ['prom', 'list'], date: '20 de octubre de 2026',
        prom: [['PROSPECCIÓN', [['Reuniones', '4,8'], ['Referidos', '1,5']]], ['CALIFICACIÓN', [['ACM', '1,1'], ['Búsquedas', '2,4']]], ['CAPTACIÓN', [['Captaciones', '3'], ['Muestras', '1,9']]], ['CIERRE', [['Transacciones', '1,4'], ['Comisión', '$2,9k']]]],
        list: { title: 'AGENTES', mode: 'cards', agents: [
          ['MS', 'Martín Sosa', 'Alto rendimiento', '$14.820', '#98C7A8', '#239666', 82, 'M2 24 C 12 20, 18 8, 28 12 S 44 4, 58 6'],
          ['CI', 'Carla Ibáñez', 'Negocio pequeño', '$7.960', '#8CC5F2', '#F99946', 46, 'M2 18 C 12 22, 20 12, 30 16 S 46 10, 58 12'],
          ['DP', 'Diego Paz', 'Sin negocio', '$5.310', '#E98F87', '#ED4237', 14, 'M2 10 C 14 14, 22 20, 32 18 S 48 24, 58 22'],
          ['SQ', 'Sofía Quiroga', 'Agente nuevo', '$2.480', '#DEC57A', '#239666', 74, 'M2 26 C 14 24, 22 20, 32 16 S 48 12, 58 8']] }
      },
      agente: {
        tab: 'Proyectado de Ingresos (agente)', title: 'Análisis de proyección', sub: null,
        id: { ini: 'VR', ante: 'PROYECCIÓN DE INGRESOS AGENTE', name: 'Valeria Ríos', chip: 'Premium', rt: ['Corte al 21 de octubre de 2026', 'Montos en dólares (USD)'] },
        blocks: ['kpi', 'kpi2', 'evo', 'ops', 'tabla', 'comp', 'lect'], date: '21 de octubre de 2026',
        kpi: [['Pipeline conformado', '$8.400', '2 operaciones conformadas', 1], ['Comisión ene – sep 2026', '$31.250', 'Prom. $3.472 / mes'], ['Octubre 2026 (parcial)', '$1.120', 'Al corte'], ['Ritmo reciente (3 meses)', '$3.180', 'jul – sep 2026'], ['Proyección base nov – ene', '$10.940', 'nov 2026 – ene 2027', 1]],
        kpi2: { t: 'Ticket promedio de operación', d: 'Valor de operación en dólares (USD).', items: [['Cartera', '$186.300', '9 propiedades en venta'], ['Reservadas', '$142.000', '2 propiedades reservadas'], ['Vendido', '$118.500', 'Promedio últimos 12 meses', 1]] },
        evo: { t: 'Tendencia histórica de comisiones', d: 'Evolución mensual en dólares (comisiones de cierre).', tag: 'Últimos 17 meses', v: [12, 30, 22, 64, 18, 8, 40, 52, 70, 26, 14, 34, 46, 20, 58, 90, 24] },
        ops: { t: 'Operaciones en pipeline', d: 'Reservas activas, con fecha estimada de cierre.', tag: 'Conformadas', items: [['c', 'Comprador', '$4.200', 'Operación USD 140.000 | Cierre est. 12 nov 2026'], ['s', 'Vendedor', '$2.700', 'Operación USD 90.000 | Cierre est. 28 nov 2026'], ['a', 'Ambas puntas', '$1.500', 'Operación USD 50.000 | Cierre est. 9 dic 2026']], total: '$8.400' },
        tabla: { t: 'Proyección por escenario', d: 'Ritmo de cierres más pipeline, con descuento por cancelación.', rows: [['Octubre 2026', '$1.020', '$1.240', '$1.410'], ['Noviembre 2026', '$3.150', '$4.380', '$5.020'], ['Diciembre 2026', '$2.640', '$3.290', '$3.870'], ['Enero 2027', '$2.640', '$3.270', '$3.810']], tot: ['Total nov – ene', '$8.430', '$10.940', '$12.700'] },
        comp: { t: 'Proyección visual', v: [[16, 20, 23], [50, 70, 80], [42, 52, 62], [42, 52, 61]], m: ['Oct 26', 'Nov 26', 'Dic 26', 'Ene 27'] },
        lect: { t: 'Lectura ejecutiva', items: [
          ['pos', 'TRAYECTORIA PROBADA', 'Valeria suma 9 años en la red y 18 transacciones en el último año. Su mejor mes superó tres veces su promedio.'],
          ['neg', 'PIPELINE CORTO', 'Tiene 2 operaciones conformadas. Enero depende del ritmo histórico, sin reservas que lo respalden.'],
          ['neg', 'RITMO EN BAJA', 'Los últimos 3 meses quedaron un 8 % por debajo de su promedio mensual del año.'],
          ['pos', 'CARTERA DE ALTO TICKET', 'Sus 9 propiedades en venta tienen un ticket promedio más alto que lo que vendió en los últimos 12 meses.']] }
      },
      oficina: {
        tab: 'Proyectado de Ingresos (oficina)', title: 'Proyección de oficina', sub: null,
        id: { ini: null, ante: 'INFORME CONSOLIDADO', name: 'Oficina Centro', chip: null, rt: ['Corte al 21 de octubre de 2026', 'Comisiones de cierre en USD'] },
        blocks: ['kpi', 'kpi2', 'tabla', 'comp', 'evo', 'list', 'hall'], date: '21 de octubre de 2026',
        kpi: [['Pipeline conformado', '$412.600', '+ $96.200 en negociación', 1], ['Comisión ene – sep 2026', '$1.684.300', 'Prom. $187.140 / mes'], ['Octubre 2026 (parcial)', '$18.900', 'Acumulado oficina'], ['Proyección base nov – ene', '$3.920.400', 'nov 2026 – ene 2027', 1]],
        kpi2: { t: 'Ticket promedio de operación', d: 'Promedio de la oficina en dólares (USD).', items: [['Cartera', '$162.400', '41 propiedades en venta'], ['Reservadas', '$121.800', '7 propiedades reservadas'], ['Vendido', '$104.900', 'Promedio últimos 12 meses', 1]] },
        tabla: { t: 'Proyección consolidada', d: 'Suma de las proyecciones individuales.', rows: [['Octubre 2026', '$58.200', '$71.400', '$83.900'], ['Noviembre 2026', '$1.120.500', '$1.402.800', '$1.611.300'], ['Diciembre 2026', '$1.034.700', '$1.268.900', '$1.477.200'], ['Enero 2027', '$1.031.300', '$1.248.700', '$1.452.600']], tot: ['Total nov – ene', '$3.186.500', '$3.920.400', '$4.541.100'] },
        comp: { t: 'Proyección por escenario', v: [[10, 12, 14], [62, 78, 90], [57, 70, 82], [57, 69, 81]], m: ['Oct 26', 'Nov 26', 'Dic 26', 'Ene 27'] },
        evo: { t: 'Tendencia histórica oficina', d: 'Comisiones mensuales totales en USD.', tag: '17 meses', v: [18, 22, 14, 26, 20, 16, 24, 30, 28, 22, 34, 40, 62, 48, 86, 70, 30] },
        list: { title: 'AGENTES · PIPELINE Y PROYECCIÓN', mode: 'table', rows: [['Martín Sosa', '$96.400', '$842.100', 'up', 'Tendencia al alza'], ['Lucía Herrera', '$71.800', '$615.300', 'hi', 'Pipeline alto'], ['Tomás Vidal', '$52.300', '$402.900', 'hi', 'Pipeline alto'], ['Carla Ibáñez', '$18.600', '$188.400', '', 'Sin señal']] },
        hall: { t: 'Concentración del negocio', head: 'Pocos agentes concentran lo cobrado; el pipeline está más repartido.', items: [['neg', '84%', 'top 5 en producción anual', 'Cinco agentes sostienen la oficina', 'Juntan la mayor parte de lo cobrado en el año y de lo proyectado.'], ['pos', '41%', 'top 5 del pipeline conformado', 'El pipeline rompe la concentración', 'Lo conformado está repartido entre muchos más agentes.'], ['pos', '+38%', 'jun – sep 2026 vs. 2025', 'El ritmo interanual crece', 'Los últimos cuatro meses cerrados superan al mismo período del año anterior.']] }
      }
    };
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const V = (ph, val, cls = '') => '<span class="v ph ' + cls + '" data-ph="' + esc(ph) + '" data-val="' + esc(val) + '">' + esc(ph) + '</span>';
    const head = (t, d, tag) => '<div class="rc-h"><div><b>' + V('[Título de la sección]', t) + '</b>' + (d ? '<small>' + V('[Descripción de la sección]', d) + '</small>' : '') + '</div>' + (tag ? '<span class="rtag">' + V('[Chip]', tag) + '</span>' : '') + '</div>';
    const kps = items => '<div class="kpis" style="grid-template-columns:repeat(' + items.length + ',minmax(0,1fr))">' + items.map(k => '<div class="kp' + (k[3] ? ' az' : '') + '"><small>' + V('[Label]', k[0]) + '</small><b>' + V('[Valor]', k[1]) + '</b><em>' + V('[Referencia]', k[2]) + '</em></div>').join('') + '</div>';
    const B = {
      kpi: d => kps(d.kpi),
      kpi2: d => '<div class="rc">' + head(d.kpi2.t, d.kpi2.d) + kps(d.kpi2.items) + '</div>',
      prom: d => '<div><div class="r-label">PROMEDIOS DE LA OFICINA</div><div class="prom">' + d.prom.map(g => '<div><h6>' + V('[ETAPA]', g[0]) + '</h6><div class="pr">' + g[1].map(p => '<span>' + V('[Label]', p[0]) + '<b>' + V('[Valor]', p[1]) + '</b>prom. oficina</span>').join('') + '</div></div>').join('') + '</div></div>',
      evo: d => '<div class="rc">' + head(d.evo.t, d.evo.d, d.evo.tag) + '<div class="bars"><span class="hl" style="width:' + (6 / 17 * 100) + '%"><small>Últimos 6 meses</small></span>' + d.evo.v.map((h, j) => '<i class="' + (j >= 11 ? 'hi' : '') + '" style="--h:30;--hv:' + h + ';--j:' + j + '"></i>').join('') + '</div><div class="months">' + MONTHS.map(m => '<span>' + m + '</span>').join('') + '</div></div>',
      ops: d => '<div class="rc">' + head(d.ops.t, d.ops.d, d.ops.tag) + '<div class="ops">' + d.ops.items.map(o => '<div class="op ' + o[0] + '"><span class="rl">' + o[1] + '</span><b>' + V('[Monto]', o[2]) + '</b><small>' + V('[Detalle] | [Detalle]', o[3]) + '</small></div>').join('') + '</div><div class="rc-h" style="margin:10px 0 0"><div><b style="font-size:11px">' + V('[Fila]', 'Total pipeline conformado') + '</b></div><b style="font-size:16px">' + V('[Valor]', d.ops.total) + '</b></div></div>',
      tabla: d => '<div class="rc">' + head(d.tabla.t, d.tabla.d) + '<table class="tbl"><thead><tr><th>MES</th><th>CONSERVADOR</th><th class="b">BASE</th><th>OPTIMISTA</th></tr></thead><tbody>' + d.tabla.rows.map(r => '<tr>' + r.map((c, k) => '<td' + (k === 2 ? ' class="b"' : '') + '>' + V(k ? '[Valor]' : '[Fila]', c) + '</td>').join('') + '</tr>').join('') + '<tr class="t2">' + d.tabla.tot.map((c, k) => '<td' + (k === 2 ? ' class="b"' : '') + '>' + V(k ? '[Valor]' : '[Fila]', c) + '</td>').join('') + '</tr></tbody></table></div>',
      comp: d => '<div class="rc"><div class="rc-h"><div><b>' + V('[Título de la sección]', d.comp.t) + '</b></div><div class="leg"><span style="--k:#D7DADF">Conservador</span><span style="--k:#6DAEB7">Base</span><span style="--k:#C5B9F1">Optimista</span></div></div><div class="gb">' + d.comp.v.map((g, gi) => '<div class="g">' + g.map((h, k) => '<i style="--h:30;--hv:' + h + ';--j:' + (gi * 3 + k) + '"></i>').join('') + '</div>').join('') + '</div><div class="months">' + d.comp.m.map(m => '<span>' + m + '</span>').join('') + '</div></div>',
      lect: d => '<div class="rc"><div class="rc-h"><div><b>' + V('[Título de la sección]', d.lect.t) + '</b></div></div><div class="lect">' + d.lect.items.map(l => '<div class="lc ' + l[0] + '"><h6>' + V('[TÍTULO DE LA LECTURA]', (l[0] === 'pos' ? '✓ ' : '⚠ ') + l[1]) + '</h6><p><span class="lt-text" data-ph="[Texto generado por la IA…]" data-stream="' + esc(l[2]) + '">[Texto generado por la IA…]</span></p></div>').join('') + '</div></div>',
      hall: d => '<div class="rc"><div class="rc-h"><div><b>' + V('[Título de la sección]', d.hall.t) + '</b><small>' + V('[Titular generado por la IA]', d.hall.head) + '</small></div></div><div class="hall">' + d.hall.items.map(h => '<div class="hr ' + h[0] + '"><i></i><b>' + V('[Valor]', h[1]) + '<small>' + V('[Referencia]', h[2]) + '</small></b><div><h6>' + V('[Título del hallazgo]', h[3]) + '</h6><p>' + V('[Resumen generado por la IA]', h[4]) + '</p></div></div>').join('') + '</div></div>',
      list: d => {
        const L = d.list;
        if (L.mode === 'table') return '<div class="rc"><div class="rc-h"><div><b>' + V('[TÍTULO DEL LISTADO]', L.title) + '</b><small>' + V('[Descripción de la sección]', 'Ordenados por proyección base nov – ene.') + '</small></div></div><div class="flt"><span class="srch">Buscá un agente</span><span style="border:1px solid var(--g-line);background:#fff">Todas las señales ▾</span></div><table class="tbl tbl2"><thead><tr><th>AGENTE</th><th>PIPELINE</th><th class="b">PROY. NOV – ENE</th><th>SEÑAL</th></tr></thead><tbody>' + L.rows.map(r => '<tr><td>' + V('[Nombre del agente]', r[0]) + '</td><td>' + V('[Valor]', r[1]) + '</td><td class="b">' + V('[Valor]', r[2]) + '</td><td>' + (r[3] ? '<span class="sigt ' + r[3] + '">' + V('[Señal]', r[4]) + '</span>' : '<span class="sigt" style="background:none;color:var(--g-450)">—</span>') + '</td></tr>').join('') + '</tbody></table></div>';
        return '<div><div class="r-label">' + V('[TÍTULO DEL LISTADO]', L.title) + '</div><div class="flt"><span class="on">Todos</span><span style="--k:#FBF6E6">Agente nuevo</span><span style="--k:#FCEEED">Sin negocio</span><span style="--k:#EEF6FD">Negocio pequeño</span><span style="--k:#EBEFF8">Con negocio</span><span style="--k:#EFF6F1">Alto rendimiento</span><span class="srch">Buscá un agente</span></div><div class="agents">' + L.agents.map(a => '<div class="ag" style="--k:' + a[5] + ';--kc:' + a[4] + ';--kb:' + a[5] + '"><div class="t"><span class="av">' + V('AB', a[0]) + '</span><div style="min-width:0"><b>' + V('[Nombre del agente]', a[1]) + '</b><span class="cat">' + V('[Categoría]', a[2]) + '</span></div></div><div class="cm">Comisión del período<b>' + V('[Valor]', a[3]) + '</b></div><div class="cm" style="margin-top:4px">USO DEL CRM</div><div class="crm"><i style="--w:20;--wv:' + a[6] + '"></i></div><svg viewBox="0 0 60 30" preserveAspectRatio="none"><path d="' + a[7] + '"/></svg></div>').join('') + '</div></div>';
      }
    };

    const rp = $('#rp'), canvas = $('#rpCanvas'), view = $('#rpView'), tab = $('#rpTab'), cat = $('#rpCat'), count = $('#rpCount'), uses = $('#rpUses');
    const chips = $$('.rp-chip', rp), phs = $$('#rpPh span'), play = $('#rpPlay');
    cat.insertAdjacentHTML('beforeend', '<div class="cb base" data-k="base"><em>—</em><span>PLANTILLA BASE</span></div>' + CAT.map((c, i) => '<div class="cb" data-k="' + c[0] + '"><em>' + String(i + 1).padStart(2, '0') + '</em><span>' + c[1] + '</span></div>').join(''));
    const cbs = Object.fromEntries($$('.cb', cat).map(el => [el.dataset.k, el]));
    const ORDER = ['prod', 'agente', 'oficina'];
    let key = 'prod', playing = !RM, timers = [], scrollRaf = 0, userScrolled = false;
    const T = (fn, ms) => timers.push(setTimeout(fn, ms));
    const clearT = () => { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(scrollRaf); };
    const fit = () => { canvas.style.zoom = Math.min(1.25, view.clientWidth / 760); };
    addEventListener('resize', fit);

    const QRLOGO = '<svg class="r-logo" viewBox="0 0 84 25" aria-hidden="true"><use href="#qrm" width="53.33" height="25" style="color:#1876F2"/><use href="#chipm" x="58" y="0" width="25" height="25" style="color:#1876F2"/></svg>';
    function setPhase(p) { phs.forEach((s, i) => s.setAttribute('aria-current', i === p)); }
    function setChip(k) { chips.forEach(c => c.setAttribute('aria-pressed', c.dataset.r === k)); }
    function setCount(n) { count.textContent = n + ' / 11'; }
    function build(k) {
      const d = R[k];
      let h = '<div class="r-bar"><div><h5>' + V('[Nombre del reporte]', d.title) + '</h5>' + (d.sub ? '<small>' + V('[Bajada opcional]', d.sub) + '</small>' : '') + '</div>' + QRLOGO + '</div>';
      h += '<div class="r-blocks" id="rbl">';
      if (d.id) {
        const id = d.id;
        h += '<div class="rc r-id">' + (id.ini ? '<span class="av">' + V('AB', id.ini) + '</span>' : '') + '<div><div class="ante">' + V('[ANTETÍTULO DEL REPORTE]', id.ante) + '</div><div class="nm">' + V('[Nombre del agente u oficina]', id.name) + '</div>' + (id.chip ? '<span class="chp">' + V('[Chip]', id.chip) + '</span>' : '') + '</div><div class="rt"><b>' + V('Corte al [fecha]', id.rt[0]) + '</b>' + V('[Dato de contexto]', id.rt[1]) + '</div></div>';
      }
      h += '<div class="r-slot" id="rslot">Acá entran los bloques del catálogo</div></div>';
      h += '<div class="r-foot">' + QRLOGO + '<b>Fecha de generación: ' + V('[dd de mes de aaaa]', d.date) + '</b><p>Este reporte fue generado con asistencia de inteligencia artificial. Los cálculos son orientativos. Verificá la información antes de tomar decisiones.</p></div>';
      canvas.classList.remove('filled');
      canvas.innerHTML = h;
      tab.textContent = '[Nombre del reporte]';
      Object.values(cbs).forEach(c => c.classList.remove('on', 'hit'));
      cbs.base.classList.add('on');
      setCount(0);
      uses.textContent = 'Usa ' + d.blocks.length + ' de 11 bloques';
      view.scrollTop = 0;
      fit();
    }
    function addBlock(k, b, animate) {
      const wrap = document.createElement('div');
      wrap.className = 'blk' + (animate ? ' in' : '');
      wrap.innerHTML = B[b](R[k]);
      const slot = $('#rslot'); if (slot) slot.remove();
      $('#rbl').appendChild(wrap);
      if (animate) { requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.remove('in'))); wrap.classList.add('flash'); setTimeout(() => wrap.classList.remove('flash'), 700); }
      const c = cbs[b]; c.classList.add('on');
      if (animate) { c.classList.add('hit'); setTimeout(() => c.classList.remove('hit'), 650); }
      setCount(R[key].blocks.indexOf(b) + 1);
    }
    function streamInto(el, text, done) {
      const words = text.split(' '); let i = 0;
      el.textContent = ''; el.classList.add('typing');
      (function step() {
        if (!el.isConnected) return;
        el.textContent = words.slice(0, ++i).join(' ');
        if (i < words.length) T(step, 55 + Math.random() * 45); else { el.classList.remove('typing'); done && done(); }
      })();
    }
    function fill(animate) {
      canvas.classList.add('filled');
      tab.textContent = R[key].tab;
      const groups = [$('.r-bar', canvas), ...$$('#rbl > *', canvas), $('.r-foot', canvas)];
      groups.forEach((g, gi) => {
        const go = () => {
          $$('.v.ph', g).forEach(v => { v.classList.remove('ph'); animate ? countTo(v, v.dataset.val, 800) : (v.textContent = v.dataset.val); });
          $$('[style*="--hv"]', g).forEach(i => i.style.setProperty('--h', i.style.getPropertyValue('--hv')));
          $$('[style*="--wv"]', g).forEach(i => i.style.setProperty('--w', i.style.getPropertyValue('--wv')));
          $$('.lt-text', g).forEach((t, ti) => animate ? T(() => streamInto(t, t.dataset.stream), ti * 260) : (t.textContent = t.dataset.stream));
        };
        animate ? T(go, gi * 170) : go();
      });
    }
    function scrollView(to, dur, done) {
      cancelAnimationFrame(scrollRaf);
      const from = view.scrollTop, t0 = performance.now();
      if (RM || Math.abs(to - from) < 2) { view.scrollTop = to; done && done(); return; }
      (function f(t) {
        if (userScrolled) return;
        const k = clamp((t - t0) / dur, 0, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        view.scrollTop = from + (to - from) * e;
        if (k < 1) scrollRaf = requestAnimationFrame(f); else done && done();
      })(t0);
    }
    ['wheel', 'touchstart', 'keydown'].forEach(ev => view.addEventListener(ev, () => { userScrolled = true; cancelAnimationFrame(scrollRaf); }, { passive: true }));

    function run(k) {
      clearT(); userScrolled = false;
      const olds = $$('#rbl > .blk', canvas);
      const start = () => {
        key = k; setChip(k); build(k); setPhase(0);
        const bl = R[k].blocks;
        T(() => {
          setPhase(1);
          bl.forEach((b, i) => T(() => addBlock(k, b, true), i * 380));
          T(() => {
            setPhase(2); fill(true);
            T(() => {
              const max = view.scrollHeight - view.clientHeight;
              const next = () => { if (playing) T(() => run(ORDER[(ORDER.indexOf(k) + 1) % 3]), 1400); };
              if (max > 10) scrollView(max, clamp(max * 9, 2500, 7000), () => T(() => scrollView(0, 900, next), 1600));
              else T(next, 1200);
            }, 2600);
          }, bl.length * 380 + 600);
        }, 1500);
      };
      if (olds.length && !RM) {
        olds.reverse().forEach((o, i) => setTimeout(() => o.classList.add('out'), i * 60));
        T(start, olds.length * 60 + 420);
      } else start();
    }
    function jump(k, p) {
      clearT(); userScrolled = false;
      key = k; setChip(k); build(k); setPhase(p);
      if (p >= 1) R[k].blocks.forEach(b => addBlock(k, b, false));
      if (p >= 2) fill(false);
      setCount(p >= 1 ? R[k].blocks.length : 0);
    }
    function setPlaying(v) {
      playing = v;
      play.setAttribute('aria-pressed', v);
      play.textContent = v ? '❚❚ PAUSA' : '▶ REPRODUCIR';
    }
    chips.forEach(c => c.addEventListener('click', () => { setPlaying(false); RM ? jump(c.dataset.r, 2) : run(c.dataset.r); }));
    phs.forEach(s => s.addEventListener('click', () => { setPlaying(false); jump(key, +s.dataset.p); }));
    play.addEventListener('click', () => {
      if (playing) { setPlaying(false); clearT(); }
      else { setPlaying(true); run(ORDER[(ORDER.indexOf(key) + 1) % 3]); }
    });
    if (RM) { setPlaying(false); jump('prod', 2); play.hidden = true; }
    else { jump('prod', 2); onView(rp, () => { if (playing) run('prod'); }, .3); }
  })();

  /* ---- 05 · método en ciclo, reglas y auditoría ---- */
  (function () {
    const cards = $$('#loop .qr'); let i = 0, iv = 0;
    if (RM) { cards[0].classList.add('on'); }
    else watch($('#loop'), () => { if (iv) return; iv = setInterval(() => { cards.forEach((c, k) => c.classList.toggle('on', k === i)); i = (i + 1) % cards.length; }, 1400); },
      () => { clearInterval(iv); iv = 0; }, .4);
    const gold = $('#gold');
    $$('li', gold).forEach((li, k) => li.style.transitionDelay = (k * 170) + 'ms');
    if (RM) gold.classList.remove('wait'); else onView(gold, () => gold.classList.remove('wait'), .3);
  })();

  /* ---- 06 · sello y aprendizajes que se cargan ---- */
  (function () {
    const stamp = $('#stamp'), learn = $('#learn'), rows = $$('.lrn', learn);
    rows.forEach((r, k) => r.style.setProperty('--dl', (k * 450) + 'ms'));
    if (RM) { stamp.classList.remove('wait'); learn.classList.remove('wait'); return; }
    onView($('#ticket'), () => setTimeout(() => stamp.classList.remove('wait'), 900), .4);
    onView(learn, () => {
      learn.classList.remove('wait');
      rows.forEach((r, k) => { const s = $('.pg span', r); s.textContent = '0%'; setTimeout(() => countTo(s, '100%', 1100), k * 450); });
    }, .3);
  })();

  /* ---- header, barra de carga y guía ---- */
  const GUIDE = {
    portada: ['PORTADA', 'El título hace glitch y la bajada se escribe palabra por palabra, como una respuesta de IA. La barra del header imita la pantalla de carga del producto y cambia de mensaje en cada sección.', 'Preparando el caso…'],
    contexto: ['CONTEXTO', 'Los cinco problemas del punto de partida se resuelven uno por uno al entrar. Las cards llevan en tres esquinas los patrones de posición de un código QR.', 'Leyendo el pedido…'],
    identidad: ['IDENTIDAD', 'Las capas de la paleta se derivan en secuencia. El logo QR IA se arma en loop, sincronizado con su línea de tiempo. Cada idea probada pasa sola a lo que quedó; tocá PROBÉ o QUEDÓ para compararlas.', 'Derivando la paleta…'],
    recorrido: ['RECORRIDO', 'Elegí plan y permiso para ver qué pantalla aparece. Los pasos para generar un reporte avanzan solos; tocá uno para fijarlo. Tocá una captura para ampliarla.', 'Recorriendo los estados…'],
    reporte: ['UN REPORTE, CUALQUIER REPORTE', 'La animación protagonista: la plantilla base recibe bloques del catálogo y después los datos. Pasa sola por los tres reportes; elegí uno o una fase para explorarlo y scrolleá dentro de la vista.', 'Armando el reporte…'],
    conia: ['CON IA', 'Las cuatro etapas del método se encienden en ciclo. Las reglas de oro aparecen una por una y los números de la auditoría suben desde 0.', 'Cruzando reglas y auditoría…'],
    cierre: ['CIERRE', 'El sello cae sobre los criterios del ticket. Cada aprendizaje se carga como la barra del producto.', 'Caso generado.']
  };
  const SECS = Object.keys(GUIDE).map(id => $('#' + id));
  const nav = $('#nav'), prog = $('#progress'), navCur = $('#navCur'), pct = $('#loadPct'), lmsg = $('#loadMsg'), ltxt = $('#loadTxt');
  const links = $$('.nav li a');
  let curSec = '', ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(y / max, 0, 1) : 0;
    prog.style.width = (p * 100) + '%';
    pct.textContent = Math.round(p * 100) + '%';
    nav.classList.toggle('show', y > portada.offsetHeight - 180);
    let id = 'portada';
    for (const s of SECS) if (s.getBoundingClientRect().top <= innerHeight * .4) id = s.id;
    if (id !== curSec) {
      curSec = id;
      links.forEach(a => a.setAttribute('aria-current', a.dataset.sec === id ? 'true' : 'false'));
      const g = GUIDE[id]; navCur.textContent = g[0];
      lmsg.classList.add('swap');
      setTimeout(() => { ltxt.textContent = g[2]; lmsg.classList.remove('swap'); }, RM ? 0 : 250);
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  })();
}
