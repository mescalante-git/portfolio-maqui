// @ts-nocheck
/* Animaciones e interacciones del caso, tal cual el HTML aprobado. */
export default function run() {
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const vh = innerHeight;
  const IMG = {"home_a": "/casos/salazar/img-05.webp", "home_b": "/casos/salazar/img-06.webp", "home_menu": "/casos/salazar/img-07.webp", "nue_a": "/casos/salazar/img-08.webp", "nue_b": "/casos/salazar/img-09.webp", "ind_a": "/casos/salazar/img-10.webp", "ind_b": "/casos/salazar/img-11.webp", "ev_cards": "/casos/salazar/img-12.webp", "ev_overlap": "/casos/salazar/img-13.webp", "ev_pixel": "/casos/salazar/img-14.webp", "ev_fondos": "/casos/salazar/img-15.webp", "ev_carga": "/casos/salazar/img-16.webp", "ev_breadcrumb": "/casos/salazar/img-17.webp", "ev_nav": "/casos/salazar/img-18.webp", "ev_terminos": "/casos/salazar/img-19.webp", "ev_loader": "/casos/salazar/img-20.webp"};
  const onView = (el, fn, th = .35) => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold: th });
    io.observe(el);
  };
  const G = s => '<i class="gl ' + s + '" role="img" aria-label="' + ({ ok: 'Bien resuelto', mid: 'Con oportunidades', no: 'Ausente' })[s] + '"></i>';

  /* ---- reveal (sólo lo que está debajo del primer pantallazo) ---- */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.remove('pre'); rio.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  if (!RM) $$('[data-reveal],[data-go]').forEach(el => {
    if (el.getBoundingClientRect().top > vh * .9) { el.classList.add('pre'); rio.observe(el); }
  });

  /* ---- contadores ---- */
  function runCount(el) {
    const to = +el.dataset.count;
    if (RM) { el.textContent = to; return; }
    const dur = 1300, t0 = performance.now();
    (function f(t) {
      const p = clamp((t - t0) / dur, 0, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
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
      }, 30);
    }, 800);
  }

  /* ---- brillo de portada ---- */
  const portada = $('#portada'), follow = $('.follow');
  portada.addEventListener('pointermove', e => {
    const r = portada.getBoundingClientRect();
    follow.style.setProperty('--px', (e.clientX - r.left) + 'px');
    follow.style.setProperty('--py', (e.clientY - r.top) + 'px');
  });

  /* ---- reloj del challenge: 120 h que se consumen hasta la entrega ---- */
  (function () {
    const T = $('#clockT'), S = $('#clockS'), fill = $('#daysFill'), days = $$('.day');
    const total = 120 * 3600;
    const show = s => {
      const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = Math.floor(s % 60);
      T.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(x).padStart(2, '0');
    };
    const end = () => { show(0); S.textContent = 'ENTREGADO ✓'; S.classList.add('done'); fill.style.setProperty('--p', 1); days.forEach(d => d.classList.add('on')); };
    if (RM) { end(); return; }
    show(total); fill.style.setProperty('--p', 0);
    setTimeout(() => {
      const dur = 3600, t0 = performance.now();
      (function f(t) {
        const p = clamp((t - t0) / dur, 0, 1), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        show(total * (1 - e)); fill.style.setProperty('--p', e);
        days.forEach((d, i) => d.classList.toggle('on', e >= i / 5 - .001));
        if (p < 1) requestAnimationFrame(f); else end();
      })(t0);
    }, 1200);
  })();

  /* ---- entregables que se tildan ---- */
  (function () {
    const items = $$('#ask > div');
    if (RM) { items.forEach(i => i.classList.add('done')); return; }
    onView($('#ask'), () => items.forEach((it, i) => setTimeout(() => it.classList.add('done'), 250 + i * 380)), .4);
  })();

  /* ---- lightbox ---- */
  const lb = $('#lb'), lbImg = $('img', lb);
  const openLb = src => { lbImg.src = src; lb.classList.add('on'); };
  lb.addEventListener('click', () => lb.classList.remove('on'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });

  /* ================= BENCHMARK ================= */
  const COMP = [
    { n: 'CHILEAUTOS', f: 'CL', kind: 'Clasificados automotrices', v: 'Sitio funcional pero con inconsistencias visuales y estructurales. Podría mejorar con mejor jerarquía de contenidos, feedback y personalización.',
      d: [
        ['NAVEGACIÓN', [['ok', 'Menú sticky al hacer scroll.'], ['ok', 'El menú hamburguesa funciona bien en mobile.'], ['mid', 'Menú inicial con bajo contraste.'], ['mid', 'Sin buscador global desde otras secciones.'], ['mid', 'No indica la sección activa.'], ['mid', 'No muestra el logo en la pestaña (home).']]],
        ['ARQUITECTURA', [['ok', 'Ficha técnica a sólo 2 clics.'], ['ok', 'Algunas secciones tienen portada bien diferenciada.'], ['mid', 'Inconsistencia entre secciones (algunas sin portada).'], ['mid', 'Publicidad excesiva que interrumpe la navegación.'], ['mid', 'Sin flecha de retroceso propia.']]],
        ['DISEÑO VISUAL', [['ok', 'Paleta sobria (azul y naranja).'], ['ok', 'Tipografía clara, buen contraste.'], ['mid', 'Imágenes sin consistencia de formato, calidad y estilo.'], ['mid', 'Productos sin unidad visual (grisados, reales, desenfocados).']]],
        ['CONTENIDO', [['ok', 'CTA principal “Vende tu auto” destacado.'], ['mid', 'CTAs secundarios con diseño parecido.'], ['mid', 'Contenido de vendedores sin control visual.'], ['mid', 'Ficha técnica incompleta en algunos casos.'], ['mid', 'El orden de la información cambia entre desktop y mobile.']]],
        ['INTERACCIONES', [['ok', 'Hover sutil en enlaces.'], ['mid', 'Sin animaciones ni transiciones.'], ['mid', 'Sin feedback de carga en desktop.'], ['mid', 'En mobile, el buscador ocupa mucho alto.']]],
        ['DIFERENCIALES', [['ok', 'Simulador de financiamiento.'], ['ok', 'Comparador de vehículos.'], ['ok', 'Vista 360º.'], ['ok', 'Filtros por región, precio y año.'], ['mid', 'Sin reseñas de usuarios.'], ['mid', 'En mobile no se puede comparar.'], ['mid', 'En mobile falla la sección de eléctricos.'], ['mid', 'No se puede filtrar por color.']]]
      ] },
    { n: 'BRUNO FRITSCH', f: 'CL', kind: 'Concesionaria oficial', v: 'Experiencia visual cuidada, jerarquizada y moderna, con buen ritmo y diseño limpio. Le faltan ajustes de navegación y consistencia entre secciones.',
      d: [
        ['NAVEGACIÓN', [['ok', 'Menú visible desde el inicio, con buen contraste.'], ['ok', 'El menú hamburguesa funciona bien en mobile.'], ['mid', 'El menú no es sticky.'], ['mid', 'Sin estado activo de la sección actual.']]],
        ['ARQUITECTURA', [['ok', 'Estructura clara: home → vehículos → ficha.'], ['ok', 'Detalle a 1 o 2 clics.'], ['mid', 'Sin flecha interna para volver.']]],
        ['DISEÑO VISUAL', [['ok', 'Paleta moderna (negro, gris, naranja en degradé).'], ['ok', 'Tipografía clara y buen contraste.'], ['ok', 'Imágenes coherentes, sin fondos artificiales.'], ['mid', 'En mobile, los usados aparecen sin miniaturas.'], ['mid', 'El logo de “Autos Usados” desentona con las marcas.'], ['mid', 'Íconos de redes desalineados en el pie.']]],
        ['CONTENIDO', [['ok', 'Información técnica muy detallada y ordenada.'], ['ok', 'Tablas entre versiones, videos y fichas descargables.'], ['mid', 'Faltan CTAs de contacto en autos nuevos.']]],
        ['INTERACCIONES', [['ok', 'Hover con zoom en cards e indicadores en el menú.'], ['mid', 'Sin animaciones ni transiciones suaves.'], ['mid', 'El scroll no da feedback extra.']]],
        ['DIFERENCIALES', [['ok', 'Cotizador y vista 360º.'], ['ok', 'Carrusel con las versiones de cada vehículo.'], ['mid', 'Sin opiniones de clientes.'], ['mid', 'Sin comparador entre vehículos.'], ['mid', 'Sin filtros avanzados (sólo versión o tipo).']]]
      ] },
    { n: 'AUTOCOSMOS', f: 'AR', kind: 'Clasificados y contenido', v: 'Experiencia funcional sólida, con filtros útiles, visuales oscuros y contacto ágil. Se destaca por claridad y estructura; algunos detalles visuales podrían pulirse.',
      d: [
        ['NAVEGACIÓN', [['ok', 'Menú y buscador accesibles desde cualquier sección.'], ['ok', 'Flecha de retroceso propia.'], ['mid', 'Menú no sticky.'], ['mid', '3 clics desde una marca (2 desde el buscador).']]],
        ['ARQUITECTURA', [['ok', 'Filtros visibles desde el buscador.'], ['ok', 'Organización clara por secciones.'], ['mid', 'La publicidad interrumpe visualmente.'], ['mid', 'El menú no marca la jerarquía con suficiente peso.']]],
        ['DISEÑO VISUAL', [['ok', 'Paleta propia (azules, grises, fucsias) con buen contraste.'], ['ok', 'Tipografía clara y jerarquía funcional.'], ['mid', 'Pie de página desordenado en mobile.'], ['mid', 'Menos claridad visual que otros casos.']]],
        ['CONTENIDO', [['ok', 'Información clara y ficha técnica completa.'], ['ok', 'CTAs variados: preguntar, test drive, WhatsApp, plan.'], ['mid', 'Algunos CTAs repiten el color de otro.'], ['mid', 'Sin opiniones de usuarios.']]],
        ['INTERACCIONES', [['ok', 'Hover sutil en botones.'], ['ok', 'CTA fijo de WhatsApp al scrollear.'], ['mid', 'Ese CTA puede confundirse con publicidad.'], ['mid', 'Sin animaciones ni transiciones suaves.'], ['mid', 'Sin feedback de carga visible.']]],
        ['DIFERENCIALES', [['ok', 'Comparador accesible desde el header.'], ['ok', 'Filtros avanzados según intereses.'], ['ok', 'Pone el foco en el test drive.'], ['mid', 'Comparar requiere más pasos.'], ['mid', 'Sin sugerencias personalizadas.']]]
      ] }
  ];
  const MX = [
    ['Logo del sitio en la pestaña', ['mid', 'Sólo en algunas secciones'], ['ok'], ['ok']],
    ['Menú siempre visible (sticky)', ['ok', 'Al hacer scroll'], ['no'], ['no']],
    ['Estado activo de la sección en el menú', ['no'], ['no'], ['mid', 'Poco jerarquizado']],
    ['Buscador accesible desde cualquier sección', ['no', 'Sólo desde la home'], ['mid', 'Sólo en “Usados”'], ['ok']],
    ['Flecha de retroceso interna', ['no'], ['no'], ['ok']],
    ['Acceso rápido a la ficha del vehículo', ['ok', '2 clics'], ['ok', '1-2 clics'], ['mid', '2-3 clics']],
    ['Imágenes consistentes en productos', ['no', 'Incoherencia visual'], ['ok'], ['ok']],
    ['Miniaturas en listados mobile de usados', ['ok'], ['no', 'Sólo texto'], ['ok']],
    ['Ficha técnica completa y clara', ['mid', 'Variable según vendedor'], ['ok', 'Muy detallada'], ['ok']],
    ['Opiniones de usuarios', ['no'], ['no'], ['no']],
    ['Vista 360º', ['ok'], ['ok'], ['ok', 'Algunos']],
    ['Comparador de vehículos', ['ok'], ['no'], ['ok']],
    ['Filtros avanzados (precio, año, tipo)', ['ok'], ['mid', 'Sólo por versión'], ['ok', 'Según intereses']],
    ['CTAs diferenciados por color', ['mid', 'No siempre'], ['ok'], ['mid', 'A veces se repite el color']],
    ['CTA fijo de contacto', ['no'], ['no'], ['ok']],
    ['Feedback de carga visible', ['mid', 'Sólo en mobile'], ['no'], ['mid', 'Sólo la barra del navegador']],
    ['Personalización por comportamiento', ['no'], ['ok'], ['no']],
    ['Herramientas UX (cotizador, simulador)', ['ok', 'Varias'], ['ok'], ['ok']],
    ['Microinteracciones (hover, transiciones)', ['mid', 'Mínimas'], ['mid', 'Zoom y hover'], ['mid', 'Hover sutil']]
  ];
  const okCount = r => r.slice(1).filter(c => c[0] === 'ok').length;
  const tally = i => { const t = { ok: 0, mid: 0, no: 0 }; MX.forEach(r => t[r[i + 1][0]]++); return t; };

  // cards de competidores
  const comp = $('#comp');
  comp.innerHTML = COMP.map((c, i) => {
    const t = tally(i);
    return '<article class="cp cut" data-reveal style="--d:' + i * 120 + 'ms"><header><h3>' + c.n + '</h3><span class="flag">' + c.f + '</span></header>' +
      '<span class="kind">' + c.kind + '</span><p>' + c.v + '</p>' +
      '<div><p class="wf-h">EN LOS 19 CRITERIOS DE LA COMPARATIVA</p><div class="bars">' +
      [['ok', 'Bien resueltos'], ['mid', 'A mejorar'], ['no', 'Ausentes']].map(([k, l], j) => '<span class="bk">' + G(k) + l + '</span><span class="bt"><i class="' + k + '" style="--v:' + t[k] + ';--bd:' + j * 150 + 'ms"></i></span><b>' + t[k] + '</b>').join('') + '</div></div>' +
      '<button class="more" type="button" aria-expanded="false" aria-controls="dims" data-i="' + i + '">VER ANÁLISIS</button></article>';
  }).join('');
  if (!RM) $$('.bars', comp).forEach(w => { w.classList.add('pre'); onView(w, () => w.classList.remove('pre'), .8); });
  if (!RM) $$('[data-reveal]', comp).forEach(el => { if (el.getBoundingClientRect().top > vh * .9) { el.classList.add('pre'); rio.observe(el); } });
  const dims = $('#dims');
  function openDims(i) {
    const c = COMP[i];
    $('#dimsT').textContent = 'ANÁLISIS DE ' + c.n;
    $('#dimsG').innerHTML = c.d.map(([h, its]) => '<div class="dimc"><h4>' + h + '</h4>' + its.map(([s, t]) => '<div class="it">' + G(s) + '<span>' + t + '</span></div>').join('') + '</div>').join('');
    dims.hidden = false; dims.dataset.i = i;
  }
  $$('.more', comp).forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    if (!dims.hidden && +dims.dataset.i === i) { closeDims(); return; }
    openDims(i);
    $$('.more', comp).forEach(x => { x.setAttribute('aria-expanded', x === b ? 'true' : 'false'); x.textContent = x === b ? 'OCULTAR ANÁLISIS' : 'VER ANÁLISIS'; });
    dims.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'nearest' });
  }));
  function closeDims() { dims.hidden = true; $$('.more', comp).forEach(x => { x.setAttribute('aria-expanded', 'false'); x.textContent = 'VER ANÁLISIS'; }); }
  $('#dimsX').addEventListener('click', closeDims);

  // matriz
  const mx = $('#mx');
  mx.innerHTML = '<thead><tr><th scope="col">CRITERIO</th>' + COMP.map(c => '<th scope="col">' + c.n + '</th>').join('') + '</tr></thead><tbody>' +
    MX.map((r, i) => {
      const k = okCount(r), cls = k === 0 ? 'gap' : k === 1 ? 'solo' : '';
      return '<tr class="' + cls + '" data-k="' + k + '" data-i="' + i + '"><th scope="row">' + r[0] + '</th>' +
        r.slice(1).map(c => '<td><span class="cell">' + G(c[0]) + (c[1] ? '<span>' + c[1] + '</span>' : '') + '</span></td>').join('') + '</tr>';
    }).join('') + '</tbody><tfoot><tr><th scope="row">TOTAL</th>' +
    COMP.map((c, i) => { const t = tally(i); return '<td>' + t.ok + ' · ' + t.mid + ' · ' + t.no + '</td>'; }).join('') + '</tr></tfoot>';
  const FIL = [['TODOS', () => true], ['HUECOS DEL MERCADO', k => k === 0], ['DIFERENCIALES', k => k === 1]];
  const NOTE = ['Bien resueltos · con oportunidades · ausentes, sobre 19 criterios.', 'Criterios que ningún sitio resuelve del todo bien: oportunidades para diferenciarse.', 'Criterios que resuelve un solo sitio: lo que hace distinto a cada referente.'];
  const mxChips = $('#mxChips'), mxMore = $('#mxMore');
  let fil = 0, expanded = false;
  mxChips.innerHTML = FIL.map((f, i) => '<button class="chip" type="button" aria-pressed="' + (i ? 'false' : 'true') + '" data-i="' + i + '">' + f[0] + '<small>' + MX.filter(r => f[1](okCount(r))).length + '</small></button>').join('');
  function applyFil() {
    const rows = $$('tbody tr', mx);
    let shown = 0;
    rows.forEach(tr => {
      const ok = FIL[fil][1](+tr.dataset.k);
      const vis = ok && (fil > 0 || expanded || shown < 10);
      if (ok) shown++;
      tr.hidden = !vis;
    });
    mxMore.hidden = fil > 0 || expanded;
    $('#mxNote').textContent = NOTE[fil];
    $$('.chip', mxChips).forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === fil ? 'true' : 'false'));
  }
  $$('.chip', mxChips).forEach(b => b.addEventListener('click', () => { fil = +b.dataset.i; applyFil(); }));
  mxMore.addEventListener('click', () => { expanded = true; applyFil(); });
  applyFil();
  if (!RM) {
    const tds = $$('tbody td', mx);
    tds.forEach(td => td.classList.add('pre'));
    onView(mx, () => tds.forEach((td, i) => setTimeout(() => td.classList.remove('pre'), 120 + i * 28)), .15);
  }

  /* ================= HEURÍSTICA ================= */
  const AX = [
    ['CLARIDAD Y CONSISTENCIA', 'CLARIDAD', [
      ['ok', 'El estilo visual general (botones, colores, tipografías) se mantiene en la mayoría de las secciones.'],
      ['ok', 'Hover consistente en el header (subrayado y color).'],
      ['mid', 'Las portadas de sección son irregulares: a veces están y a veces no, con distinta altura.'],
      ['mid', 'Carruseles con errores de espaciado: emojis muy pegados o directamente ausentes.'],
      ['mid', 'En mobile, algunas imágenes están cortadas o pixeladas y los títulos se superponen con los autos.'],
      ['no', 'Términos inconsistentes como “Cotizar” y “Cotiza”, y errores ortográficos como la falta de tilde en “Cómo”.'],
      ['no', 'Las imágenes de vehículos no siguen un criterio: algunas con fondo, otras sin.'],
      ['no', 'Imágenes pixeladas en carruseles y secciones destacadas.'],
      ['no', 'El pie de página se ve ordenado en desktop pero muy desordenado en mobile.']
    ], [['ev_cards', 'ESPACIADO', 'mid', 'Carruseles con errores de espaciado: emojis muy pegados o directamente ausentes.'], ['ev_overlap', 'SUPERPOSICIÓN', 'mid', 'En mobile, el texto se monta sobre la imagen y la foto queda cortada.'], ['ev_terminos', 'TÉRMINOS', 'no', '“Cotizar” y “Cotiza” conviven en el sitio, y “¿Como llegar?” va sin tilde.'], ['ev_fondos', 'FONDOS', 'no', 'En el mismo listado, un auto con escenario y otro sin fondo.'], ['ev_pixel', 'PIXELADO', 'no', 'Imágenes pixeladas en carruseles y secciones destacadas.']]],
    ['VISIBILIDAD DEL ESTADO DEL SISTEMA', 'VISIBILIDAD', [
      ['ok', 'Algunos botones muestran retroalimentación visual (hover con color o sombra).'],
      ['ok', 'Se informa si hay o no resultados en una búsqueda.'],
      ['mid', 'No hay loader propio: en mobile, la única señal de carga es la barra del navegador.'],
      ['mid', 'En mobile, las imágenes cargan con retraso y aparecen de arriba hacia abajo.']
    ], [['ev_loader', 'SIN LOADER', 'mid', 'Mientras carga, la única señal es la barra del navegador.'], ['ev_carga', 'CARGA', 'mid', 'Las imágenes aparecen de a poco, de arriba hacia abajo.']]],
    ['CONTROL DEL USUARIO', 'CONTROL', [
      ['ok', 'Se pueden aplicar y deshacer filtros sin perder el progreso.'],
      ['ok', 'Si un formulario está incompleto o con errores, no deja continuar.'],
      ['ok', 'Se pueden corregir acciones sin reiniciar el flujo completo.'],
      ['mid', 'No hay breadcrumbs ni botones de retroceso en todas las secciones (sólo en “Usados” y “Nuevos”).'],
      ['mid', 'En secciones como “Repuestos”, los enlaces abren otra pestaña e interrumpen el flujo.']
    ], [['ev_breadcrumb', 'BREADCRUMB', 'mid', 'El breadcrumb está sólo en algunas secciones y no queda fijo al scrollear.']]],
    ['ACCESIBILIDAD', 'ACCESIBILIDAD', [
      ['ok', 'Contraste adecuado en el texto, incluso en mobile.'],
      ['ok', 'Buen tamaño de fuente y espaciado para una lectura cómoda.'],
      ['ok', 'Botones y links de tamaño apropiado, con cambios de color o sombra como ayuda visual.'],
      ['mid', 'No se detectaron atajos accesibles ni navegación con teclado.'],
      ['no', 'No se detecta texto alternativo en imágenes clave ni indicadores para lectores de pantalla.']
    ], []],
    ['JERARQUÍA DE INFORMACIÓN Y NAVEGACIÓN', 'JERARQUÍA', [
      ['ok', 'El menú principal es claro, coherente y fácil de usar.'],
      ['ok', 'Las secciones están organizadas de forma lógica (vehículos, contacto, promociones).'],
      ['ok', 'Buena jerarquía visual en títulos y llamados a la acción.'],
      ['ok', 'No hay información redundante ni duplicada.'],
      ['mid', 'Los breadcrumbs no están en todas las secciones ni son sticky.'],
      ['mid', 'Falta un estado activo en el menú para saber en qué sección estás.']
    ], [['ev_nav', 'MENÚ', 'mid', 'El menú principal no marca en qué sección estás.']]]
  ];
  const cnt = it => { const t = { ok: 0, mid: 0, no: 0 }; it.forEach(x => t[x[0]]++); return t; };
  // radar
  const R = 150, C = 200, ang = i => (-90 + i * 72) * Math.PI / 180, pt = (i, v) => [C + Math.cos(ang(i)) * R * v, C + Math.sin(ang(i)) * R * v];
  const vals = AX.map(a => cnt(a[2]).ok / a[2].length);
  let svg = '';
  [.25, .5, .75, 1].forEach(v => { svg += '<polygon class="rgrid" points="' + AX.map((_, i) => pt(i, v).map(n => n.toFixed(1)).join(',')).join(' ') + '"></polygon>'; });
  AX.forEach((_, i) => { const [x, y] = pt(i, 1); svg += '<line class="raxis" x1="200" y1="200" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '"></line>'; });
  [.5, 1].forEach(v => { svg += '<text class="tick" x="206" y="' + (C - R * v + 12).toFixed(1) + '">' + v * 100 + '%</text>'; });
  svg += '<polygon class="rshape" points="' + vals.map((v, i) => pt(i, v).map(n => n.toFixed(1)).join(',')).join(' ') + '"></polygon>';
  vals.forEach((v, i) => { const [x, y] = pt(i, v); svg += '<circle class="rdot" data-i="' + i + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6"></circle>'; });
  AX.forEach((a, i) => {
    const [x, y] = pt(i, 1.17), anc = Math.abs(x - C) < 10 ? 'middle' : x > C ? 'start' : 'end';
    svg += '<text class="lab" data-i="' + i + '" x="' + x.toFixed(1) + '" y="' + (y + (i === 0 ? -6 : 4)).toFixed(1) + '" text-anchor="' + anc + '">' + a[1] + '</text>';
    svg += '<text class="val" data-i="' + i + '" x="' + x.toFixed(1) + '" y="' + (y + (i === 0 ? 10 : 20)).toFixed(1) + '" text-anchor="' + anc + '">' + Math.round(vals[i] * 100) + '%</text>';
  });
  const radar = $('#radar'), rbox = $('#radarBox');
  radar.innerHTML = svg;
  if (!RM) { rbox.classList.add('pre'); onView(rbox, () => rbox.classList.remove('pre'), .4); }
  const axes = $('#axes'), axMore = $('#axMore');
  axes.innerHTML = AX.map((a, i) => '<button class="chip" type="button" aria-pressed="false" data-i="' + i + '">' + a[1] + '<small>' + a[2].length + '</small></button>').join('');
  let ax = 0, axAll = false;
  function showAx(i, all) {
    ax = i; axAll = !!all;
    const a = AX[i], t = cnt(a[2]);
    $$('.chip', axes).forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === i ? 'true' : 'false'));
    $$('[data-i]', radar).forEach(el => el.classList.toggle('on', +el.dataset.i === i));
    $('#axT').textContent = a[0];
    $('#axS').innerHTML = '<i class="s-ok" style="flex-grow:' + t.ok + '"></i><i class="s-mid" style="flex-grow:' + t.mid + '"></i><i class="s-no" style="flex-grow:' + t.no + '"></i>';
    $('#axC').innerHTML = '<span>' + G('ok') + t.ok + ' bien resueltas</span><span>' + G('mid') + t.mid + ' con oportunidades</span><span>' + G('no') + t.no + ' problemas</span>';
    const order = { no: 0, mid: 1, ok: 2 };
    const list = [...a[2]].sort((x, y) => order[x[0]] - order[y[0]]);
    const shown = axAll ? list : list.slice(0, 4);
    $('#axL').innerHTML = shown.map((x, k) => '<li style="--d:' + k * 60 + 'ms">' + G(x[0]) + '<span>' + x[1] + '</span></li>').join('');
    axMore.hidden = axAll || list.length <= 4;
    axMore.textContent = 'VER LAS ' + list.length;
    renderInsp(a[3]);
  }
  /* inspector: visor con lupa, barrido al cambiar y avance automático */
  const insp = $('#insp'), iv = $('#inspV'), iimg = $('#inspImg'), lens = $('#lens'), strip = $('#strip');
  let evList = [], evI = 0, evTimer = null, evT0 = 0, evHover = false, evSeen = false;
  const EVMS = 4200;
  function showEv(k) {
    evI = k; const e = evList[k];
    iimg.src = IMG[e[0]]; iimg.alt = 'Evidencia: ' + e[3];
    lens.style.backgroundImage = 'url(' + IMG[e[0]] + ')';
    $('#inspTag').textContent = e[1];
    $('#inspAx').textContent = AX[ax][1];
    $('#inspN').textContent = String(k + 1).padStart(2, '0') + ' / ' + String(evList.length).padStart(2, '0');
    $('#inspCap').innerHTML = G(e[2]) + '<span>' + e[3] + '</span>';
    $$('button', strip).forEach((b, j) => { b.setAttribute('aria-pressed', j === k ? 'true' : 'false'); b.style.setProperty('--t', 0); });
    if (!RM) {
      iimg.classList.remove('kb'); void iimg.offsetWidth; iimg.classList.add('kb');
      const sw = $('#inspSw'); sw.classList.remove('go'); void sw.offsetWidth; sw.classList.add('go');
    }
    evT0 = performance.now();
  }
  function renderInsp(list) {
    evList = list;
    insp.hidden = !list.length; $('#inspNone').hidden = !!list.length;
    if (!list.length) return;
    strip.innerHTML = list.map((e, j) => '<button type="button" aria-pressed="false" aria-label="Evidencia ' + (j + 1) + ': ' + e[1].toLowerCase() + '"><img src="' + IMG[e[0]] + '" alt=""></button>').join('');
    $$('button', strip).forEach((b, j) => b.addEventListener('click', () => showEv(j)));
    showEv(0);
  }
  function evTick(now) {
    if (evList.length > 1 && evSeen && !evHover && !RM) {
      const p = (now - evT0) / EVMS;
      const act = $('button[aria-pressed="true"]', strip); if (act) act.style.setProperty('--t', Math.min(1, p));
      if (p >= 1) showEv((evI + 1) % evList.length);
    } else evT0 = now - ((now - evT0) % EVMS || 0) * 0;
    requestAnimationFrame(evTick);
  }
  iv.addEventListener('pointerenter', () => evHover = true);
  iv.addEventListener('pointerleave', () => { evHover = false; evT0 = performance.now(); });
  iv.addEventListener('pointermove', e => {
    const r = iv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    lens.style.left = x + 'px'; lens.style.top = y + 'px';
    const z = 2.4, W = r.width - 28, H = r.height - 28;
    lens.style.backgroundSize = (W * z) + 'px auto';
    const iw = iimg.naturalWidth || 1, ih = iimg.naturalHeight || 1, sc = Math.min(W / iw, H / ih), dw = iw * sc, dh = ih * sc, ox = 14 + (W - dw) / 2, oy = 14 + (H - dh) / 2;
    lens.style.backgroundSize = (dw * z) + 'px ' + (dh * z) + 'px';
    lens.style.backgroundPosition = (75 - (x - ox) * z) + 'px ' + (75 - (y - oy) * z) + 'px';
  });
  iv.addEventListener('click', () => openLb(iimg.src));
  iv.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(iimg.src); } });
  onView(iv, () => { evSeen = true; evT0 = performance.now(); }, .5);
  requestAnimationFrame(evTick);
  $$('.chip', axes).forEach(b => b.addEventListener('click', () => showAx(+b.dataset.i)));
  $$('.rdot,.lab,.val', radar).forEach(el => el.addEventListener('click', () => showAx(+el.dataset.i)));
  axMore.addEventListener('click', () => showAx(ax, true));
  showAx(0);

  /* ================= DEL HALLAZGO AL PIXEL ================= */
  const TYPE = { b: ['BENCHMARK', 'var(--cyan-l)', '#63E2FF'], h: ['HEURÍSTICA', 'var(--violet-l)', '#A57BFF'], r: ['RELEVAMIENTO PROPIO', 'var(--pink-l)', '#FF70DE'] };
  const SRC = {
    bBus: ['b', 'Buscador accesible desde cualquier sección', 'Sólo Autocosmos lo resuelve. Chileautos lo tiene sólo en la home.'],
    bBack: ['b', 'Flecha de retroceso interna', 'Sólo Autocosmos la ofrece. El resto depende del botón del navegador.'],
    bImg: ['b', 'Imágenes consistentes en productos', 'Chileautos pierde unidad mezclando fotos grisadas, reales y desenfocadas.'],
    bPort: ['b', 'Portadas consistentes entre secciones', 'En Chileautos algunas secciones tienen portada y otras no.'],
    hCar: ['h', 'Carruseles con errores de espaciado', 'Claridad · emojis pegados al texto o ausentes.'],
    hPort: ['h', 'Portadas de sección irregulares', 'Claridad · a veces están y a veces no, con distinta altura.'],
    hImg: ['h', 'Imágenes sin criterio uniforme', 'Claridad · algunos autos con fondo, otros sin.'],
    hFoot: ['h', 'Pie de página desordenado en mobile', 'Claridad · ordenado en desktop, desarmado en mobile.'],
    hBread: ['h', 'Sin breadcrumbs en todas las secciones', 'Control · sólo “Usados” y “Nuevos” permiten volver.'],
    hBreadJ: ['h', 'Breadcrumbs que no son sticky', 'Jerarquía · al scrollear se pierde la referencia.'],
    rPad: ['r', 'Card “+2.500” sin padding lateral', 'El bloque llegaba a los bordes de la pantalla.'],
    rHor: ['r', 'Horarios escondidos en el menú', 'En mobile estaban dentro del menú hamburguesa; en desktop, al pie.'],
    rMenu: ['r', 'Panel del menú redondeado en todas sus esquinas', 'Un redondeado que no hacía falta en el borde pegado a la pantalla.'],
    rFil: ['r', 'Filtros indicados sólo con un número', 'En mobile se veía cuántos filtros había, pero no cuáles.'],
    rBtn: ['r', 'Botones desalineados respecto de las fotos', '“Ver ficha” y “Galería” no seguían el ancho de las miniaturas.'],
    rIco: ['r', 'Íconos fuera de eje', 'El ícono de información “i” no estaba alineado con su texto.'],
    rEsp: ['r', 'Espaciado irregular entre componentes', 'La card de precio mezclaba distancias y alineaciones.']
  };
  // cajas en % de la captura (x, y, ancho, alto)
  const MJ = [
    ['HOME', 'H1', 'Buscador sticky en el header', 'Agregué un buscador en el header fijo, para buscar un auto desde cualquier punto de la página.', 'home_a', [[66.5, 4.3, 19.7, 5.7]], ['bBus']],
    ['HOME', 'H2', 'Cards con íconos consistentes', 'Todas las cards del carrusel llevan un ícono en el texto y otro en el botón, con el mismo espaciado.', 'home_a', [[40.1, 30.6, 19.7, 5.7], [56.7, 41.6, 19.7, 5.7]], ['hCar']],
    ['HOME', 'H3', 'Padding en la card “+2.500”', 'Ajusté el tamaño del bloque para que respire a los lados, como el resto de los componentes.', 'home_a', [[7, 70.3, 85.6, 22.5]], ['rPad']],
    ['HOME', 'H4', 'Pie de página ordenado, con horarios', 'Ordené el pie en una estructura prolija y llevé ahí los horarios de atención, igual que en desktop.', 'home_b', [[5.1, 22.6, 77, 21.8]], ['hFoot', 'rHor']],
    ['HOME', 'H5', 'Menú lateral con esquinas ajustadas', 'Dejé el redondeado sólo en las esquinas libres del panel, no en las que tocan el borde.', 'home_menu', [[0, 3.8, 63.6, 43]], ['rMenu']],
    ['NUEVOS', 'N1', 'Buscador sticky, igual que en la home', 'Mantuve el mismo header fijo con buscador, para que la navegación sea consistente entre secciones.', 'nue_a', [[66.5, 4.2, 19.7, 5.7]], ['bBus']],
    ['NUEVOS', 'N2', 'Portada al estilo de “Usados”', 'Diseñé una portada para Nuevos siguiendo la de Usados, para que todas las secciones se presenten igual.', 'nue_a', [[1.6, 14.9, 96.7, 13.2]], ['hPort', 'bPort']],
    ['NUEVOS', 'N3', 'Filtros con nombre y cantidad', 'Además del número, el filtro aplicado se ve por su nombre, como en desktop.', 'nue_a', [[1.6, 40.3, 36, 9.5]], ['rFil']],
    ['NUEVOS', 'N4', 'Breadcrumb fijo', 'El breadcrumb queda fijo debajo del header: siempre se sabe dónde se está y se puede volver.', 'nue_b', [[5.1, 9.9, 69, 5]], ['hBread', 'hBreadJ', 'bBack']],
    ['NUEVOS', 'N5', 'Foto del BYD Yuan Pro con fondo', 'Cambié la foto con fondo blanco por una con escenario, para que todo el listado tenga la misma lógica.', 'nue_b', [[4.4, 26.6, 91.5, 27.2]], ['hImg', 'bImg']],
    ['FICHA', 'F1', 'Breadcrumb fijo con la ruta exacta', 'El breadcrumb muestra el camino real hasta el modelo y queda fijo al scrollear.', 'ind_a', [[1.6, 10.7, 96.7, 4.2]], ['hBread', 'hBreadJ']],
    ['FICHA', 'F2', 'Sólo fotos con fondo', 'La foto principal y las miniaturas siguen el mismo criterio de fondo.', 'ind_a', [[4.1, 39.6, 91.4, 38]], ['hImg', 'bImg']],
    ['FICHA', 'F3', '“Ver ficha” y “Galería” centrados', 'Cambié el tamaño y el centrado de los botones para alinearlos con las dos miniaturas de arriba.', 'ind_a', [[17.9, 78, 64.9, 5.7]], ['rBtn']],
    ['FICHA', 'F4', 'Íconos alineados', 'Centré los ítems de la card que estaban fuera de eje, como el ícono de información.', 'ind_b', [[5.5, 50, 89.4, 23]], ['rIco']],
    ['FICHA', 'F5', 'Espaciado y orden entre componentes', 'Ajusté distancias y orden visual dentro de la card de precio para que se lea de arriba hacia abajo.', 'ind_b', [[4, 21.4, 91.7, 67]], ['rEsp']]
  ];
  const SCR = ['HOME', 'NUEVOS', 'FICHA'];
  const trace = $('#trace'), stage = $('#trStage'), lines = $('#trLines'), orig = $('#trOrig'), list = $('#trList'), trChips = $('#trChips');
  const imA = $('#trImgA'), imB = $('#trImgB'), F = [$('#trF0'), $('#trF1')], H = [$('#trH0'), $('#trH1')], play = $('#trPlay');
  trChips.innerHTML = SCR.map(s => '<button class="chip" type="button" aria-pressed="false" data-s="' + s + '">' + s + '</button>').join('');
  let cur = -1, front = imA, timer = null, curScr = '';
  imA.src = IMG[MJ[0][4]];
  function setScreen(key) {
    const src = IMG[key];
    if (front.dataset.k === key) return;
    const back = front === imA ? imB : imA;
    back.src = src; back.dataset.k = key; back.alt = 'Pantalla del rediseño';
    back.classList.remove('off'); front.classList.add('off'); front = back;
  }
  function renderList(s) {
    curScr = s;
    $('#trScrT').textContent = 'MEJORAS · ' + s;
    list.innerHTML = MJ.map((m, i) => m[0] === s ? '<button class="mj" type="button" aria-pressed="false" data-i="' + i + '"><i>' + m[1] + '</i><span>' + m[2] + '</span></button>' : '').join('');
    $$('.mj', list).forEach(b => b.addEventListener('click', () => { stop(); go(+b.dataset.i); }));
    $$('.chip', trChips).forEach(b => b.setAttribute('aria-pressed', b.dataset.s === s ? 'true' : 'false'));
  }
  function go(i) {
    cur = i;
    const m = MJ[i];
    if (m[0] !== curScr) renderList(m[0]);
    setScreen(m[4]);
    $$('.mj', list).forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === i ? 'true' : 'false'));
    m[5].forEach((b, k) => {
      F[k].hidden = false; F[k].dataset.n = m[1];
      Object.assign(F[k].style, { left: b[0] + '%', top: b[1] + '%', width: b[2] + '%', height: b[3] + '%' });
      Object.assign(H[k].style, { x: b[0] + 'px', y: b[1] + 'px', width: b[2] + 'px', height: b[3] + 'px' });
      H[k].setAttribute('x', b[0]); H[k].setAttribute('y', b[1]); H[k].setAttribute('width', b[2]); H[k].setAttribute('height', b[3]);
      if (!RM) { F[k].classList.remove('scan'); void F[k].offsetWidth; setTimeout(() => F[k].classList.add('scan'), 650); }
    });
    if (m[5].length < 2) { F[1].hidden = true; ['x', 'y', 'width', 'height'].forEach(a => { H[1].setAttribute(a, 0); H[1].style[a] = '0px'; }); }
    orig.innerHTML = m[6].map((k, j) => {
      const s = SRC[k], t = TYPE[s[0]];
      return '<div class="org" data-t="' + s[0] + '" style="--k:' + t[1] + ';--d:' + j * 110 + 'ms"><small>' + t[0] + '</small><b>' + s[1] + '</b><p>' + s[2] + '</p></div>';
    }).join('');
    $('#trN').textContent = m[1];
    $('#trT').textContent = m[2].toUpperCase();
    $('#trD').textContent = m[3];
    $('#trCount').textContent = String(i + 1).padStart(2, '0') + ' / ' + MJ.length;
    lines.innerHTML = '';
    setTimeout(draw, RM ? 0 : 760);
  }
  function draw() {
    if (getComputedStyle(lines).display === 'none' || cur < 0) return;
    const sr = stage.getBoundingClientRect(), fr = F[0].getBoundingClientRect();
    const fx = fr.left - sr.left, fy = fr.top + fr.height / 2 - sr.top, rx = fr.right - sr.left;
    const curve = (x1, y1, x2, y2) => { const dx = Math.max(40, (x2 - x1) * .5); return 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C' + (x1 + dx).toFixed(1) + ' ' + y1.toFixed(1) + ',' + (x2 - dx).toFixed(1) + ' ' + y2.toFixed(1) + ',' + x2.toFixed(1) + ' ' + y2.toFixed(1); };
    let out = '';
    $$('.org', orig).forEach((o, j) => {
      const r = o.getBoundingClientRect(), col = TYPE[o.dataset.t][2];
      out += '<path pathLength="1" style="--ld:' + j * 120 + 'ms" stroke="' + col + '" d="' + curve(r.right - sr.left, r.top + r.height / 2 - sr.top, fx, fy) + '"></path>';
      out += '<circle style="--ld:' + (j * 120 + 700) + 'ms" cx="' + fx.toFixed(1) + '" cy="' + fy.toFixed(1) + '" r="3.5" fill="' + col + '"></circle>';
    });
    const act = $('.mj[aria-pressed="true"]', list);
    if (act) {
      const r = act.getBoundingClientRect();
      out += '<path pathLength="1" style="--ld:450ms" stroke="#A57BFF" stroke-dasharray="1" d="' + curve(rx, fy, r.left - sr.left, r.top + r.height / 2 - sr.top) + '"></path>';
    }
    lines.setAttribute('viewBox', '0 0 ' + sr.width.toFixed(0) + ' ' + sr.height.toFixed(0));
    lines.innerHTML = out;
    requestAnimationFrame(() => requestAnimationFrame(() => $$('path,circle', lines).forEach(p => p.classList.add('go'))));
  }
  function stop() { clearInterval(timer); timer = null; play.setAttribute('aria-pressed', 'false'); play.textContent = '▶ REPRODUCIR'; }
  function start(from) {
    stop(); if (RM) return;
    play.setAttribute('aria-pressed', 'true'); play.textContent = '❚❚ PAUSAR';
    go(from);
    timer = setInterval(() => go((cur + 1) % MJ.length), 4600);
  }
  play.addEventListener('click', () => timer ? stop() : start((cur + 1) % MJ.length));
  $$('.chip', trChips).forEach(b => b.addEventListener('click', () => { stop(); go(MJ.findIndex(m => m[0] === b.dataset.s)); }));
  go(0);
  onView(trace, () => start(0), .35);
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { lines.innerHTML = ''; draw(); }, 200); });

  /* ================= SOLUCIÓN ================= */
  // sticky en acción: el listado se mueve bajo el header fijo
  (function () {
    const box = $('#stk'), img = $('#stkBody'); if (RM) return;
    let t = 0, last = 0, paused = false, running = false;
    const period = 30000;
    box.addEventListener('pointerenter', () => paused = true);
    box.addEventListener('pointerleave', () => paused = false);
    function tick(now) {
      const dt = last ? now - last : 0; last = now;
      if (!paused) t += dt;
      const top = box.clientHeight * 238 / 1600, bottom = box.clientHeight * 116 / 1600;
      const travel = Math.max(0, img.offsetHeight - (box.clientHeight - top - bottom));
      const ph = (t % period) / period, tri = ph < .5 ? ph * 2 : 2 - ph * 2;
      const e = tri < .5 ? 2 * tri * tri : 1 - Math.pow(-2 * tri + 2, 2) / 2;
      img.style.transform = 'translateY(' + (top - travel * e).toFixed(1) + 'px)';
      requestAnimationFrame(tick);
    }
    onView(box, () => { if (!running) { running = true; requestAnimationFrame(tick); } }, .3);
  })();
  (function () { const box = $('#stk'), img = $('#stkBody'); const set = () => { img.style.transform = 'translateY(' + (box.clientHeight * 238 / 1600).toFixed(1) + 'px)'; }; if (img.complete) set(); else img.onload = set; addEventListener('resize', () => { if (RM) set(); }); })();

  // galería de las tres pantallas
  const GAL = [['HOME', ['home_a', 'home_b']], ['NUEVOS', ['nue_a', 'nue_b']], ['FICHA', ['ind_a', 'ind_b']]];
  const gal = $('#gallery');
  gal.innerHTML = GAL.map((g, i) => '<div class="gal" data-reveal style="--d:' + i * 120 + 'ms"><div class="phone"><div class="screen">' +
    g[1].map((k, j) => '<img src="' + IMG[k] + '" alt="' + g[0] + ', vista ' + (j + 1) + '"' + (j ? ' class="off"' : '') + '>').join('') +
    '</div></div><div class="gal-l">' + g[0] + '<span class="pager">' + g[1].map((_, j) => '<button type="button" aria-label="Vista ' + (j + 1) + ' de ' + g[0].toLowerCase() + '" aria-pressed="' + (j ? 'false' : 'true') + '" data-j="' + j + '"></button>').join('') + '</span></div></div>').join('');
  if (!RM) $$('[data-reveal]', gal).forEach(el => { if (el.getBoundingClientRect().top > vh * .9) { el.classList.add('pre'); rio.observe(el); } });
  $$('.gal', gal).forEach((g, i) => {
    const imgs = $$('img', g), btns = $$('.pager button', g);
    let j = 0, auto = !RM;
    const show = n => { j = n; imgs.forEach((im, k) => im.classList.toggle('off', k !== n)); btns.forEach((b, k) => b.setAttribute('aria-pressed', k === n ? 'true' : 'false')); };
    btns.forEach(b => b.addEventListener('click', () => { auto = false; show(+b.dataset.j); }));
    $('.screen', g).addEventListener('click', () => openLb(imgs[j].src));
    if (auto) onView(g, () => setTimeout(() => setInterval(() => { if (auto) show((j + 1) % imgs.length); }, 5200), i * 1300), .3);
  });

  /* ---- "lo que me llevo": cada casilla se tilda en secuencia ---- */
  (function () {
    const box = $('.learn'), rows = $$('.lrn', box); if (RM) return;
    box.classList.add('typ');
    onView(box, () => rows.forEach((r, i) => setTimeout(() => r.classList.add('done'), 300 + i * 500)), .35);
  })();

  /* ---- header, progreso y guía ---- */
  const GUIDE = {
    portada: ['PORTADA', 'El título hace glitch y el subtítulo se escribe tipo terminal. El reloj consume las 120 horas del challenge hasta la entrega y los contadores suben desde 0.'],
    reto: ['EL RETO', 'Los entregables del mail se tildan uno a uno al entrar. Las cards con esquina cortada se iluminan al pasar el mouse.'],
    benchmark: ['BENCHMARK', 'Las barras de cada sitio crecen según su puntaje. La matriz se completa celda por celda: filtrá por huecos del mercado o diferenciales.'],
    heuristica: ['HEURÍSTICA', 'El radar se despliega desde el centro. Tocá un eje (en el gráfico o en los chips) para ver sus observaciones y la evidencia del sitio original.'],
    pixel: ['DEL HALLAZGO AL PIXEL', 'La animación protagonista: cada mejora se ilumina en la pantalla y una línea la conecta con su origen. Avanza sola; tocá una mejora o cambiá de pantalla para explorarla.'],
    solucion: ['SOLUCIÓN', 'El listado se mueve bajo el header fijo (el mouse lo pausa). Las tres pantallas alternan sus vistas; tocalas para ampliarlas.'],
    cierre: ['CIERRE', 'Las casillas de lo aprendido se tildan en secuencia. El botón del siguiente caso se desplaza al pasar el mouse.']
  };
  const SECS = Object.keys(GUIDE).map(id => $('#' + id));
  const nav = $('#nav'), prog = $('#progress'), grid = $('#gridBg'), navCur = $('#navCur');
  const links = $$('.nav li a');
  let curSec = '', ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? clamp(y / max, 0, 1) * 100 : 0) + '%';
    nav.classList.toggle('show', y > portada.offsetHeight - 180);
    if (!RM) grid.style.transform = 'translateY(' + (y * .25) + 'px)';
    let id = 'portada';
    for (const s of SECS) if (s.getBoundingClientRect().top <= innerHeight * .4) id = s.id;
    if (id !== curSec) {
      curSec = id;
      links.forEach(a => a.setAttribute('aria-current', a.dataset.sec === id ? 'true' : 'false'));
      const g = GUIDE[id]; navCur.textContent = g[0];
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  })();
}
