// @ts-nocheck
/* Animaciones e interacciones del caso, tal cual el HTML aprobado. */
export default function run() {
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const vh = innerHeight;

  /* ---- reveal: estado "pre" solo para lo que está debajo del primer pantallazo ---- */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.remove('pre'); rio.unobserve(e.target); }
  }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  if (!RM) $$('[data-reveal],[data-go]').forEach(el => {
    if (el.getBoundingClientRect().top > vh * .9) { el.classList.add('pre'); rio.observe(el); }
  });

  /* ---- contadores ---- */
  const fmt = (el, v) => (el.dataset.prefix || '') + (el.dataset.dec ? v.toFixed(+el.dataset.dec).replace('.', ',') : el.dataset.sep ? Math.round(v).toLocaleString('es-AR') : Math.round(v)) + (el.dataset.suffix || '');
  function runCount(el) {
    const to = +el.dataset.count;
    if (RM) { el.textContent = fmt(el, to); return; }
    const dur = +el.dataset.dur || 1500, t0 = performance.now();
    (function f(t) {
      const p = clamp((t - t0) / dur, 0, 1);
      el.textContent = fmt(el, to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { cio.unobserve(e.target); runCount(e.target); }
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));


  /* ---- problemas → causas: se escriben en vivo, celda por celda ---- */
  (function () {
    const rows = $$('.pc'); if (!rows.length) return;
    const cells = [];
    rows.forEach(r => $$(':scope>div', r).forEach(c => { const n = c.lastChild; cells.push({ c, r, n, t: n.textContent }); }));
    if (RM) return;
    rows.forEach(r => r.classList.add('typ'));
    cells.forEach(o => { o.n.textContent = ''; });
    const seen = new Map();
    const vio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { vio.unobserve(e.target); seen.get(e.target)(); }
    }), { threshold: .5 });
    const visible = r => new Promise(res => { seen.set(r, res); vio.observe(r); });
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    (async () => {
      let last = null;
      for (const o of cells) {
        if (o.r !== last) { await visible(o.r); last = o.r; }
        const arrow = $(':scope>i', o.r);
        if (arrow && o.c === o.r.lastElementChild) arrow.classList.add('on');
        o.c.classList.add('act', 'cur');
        for (let i = 1; i <= o.t.length; i++) { o.n.textContent = o.t.slice(0, i); await sleep(11); }
        o.c.classList.remove('act', 'cur'); o.c.classList.add('done');
        await sleep(160);
      }
    })();
  })();

  /* ---- glitch del título ---- */
  const h1 = $('#h1');
  const glitch = el => { el.classList.remove('glitching'); void el.offsetWidth; el.classList.add('glitching'); };
  if (!RM) {
    setTimeout(() => glitch(h1), 350);
    setInterval(() => glitch(h1), 6500);
    h1.addEventListener('pointerenter', () => glitch(h1));
    const tio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { tio.unobserve(e.target); glitch(e.target); setTimeout(() => e.target.classList.remove('glitching'), 700); }
    }), { threshold: .6 });
    $$('.sec-title').forEach(t => tio.observe(t));
  }

  /* ---- subtítulo tipo terminal ---- */
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

  /* ---- brillo que sigue al mouse en la portada ---- */
  const portada = $('#portada'), follow = $('.follow');
  portada.addEventListener('pointermove', e => {
    const r = portada.getBoundingClientRect();
    follow.style.setProperty('--px', (e.clientX - r.left) + 'px');
    follow.style.setProperty('--py', (e.clientY - r.top) + 'px');
  });

  /* ---- header, progreso, parallax, sección activa y guía ---- */
  const GUIDE = {
    portada: ['PORTADA', 'El título hace glitch cada pocos segundos y al pasar el mouse. El subtítulo se escribe tipo terminal, los 4 contadores suben desde 0, la grilla se mueve con el scroll y el brillo sigue al mouse.'],
    intro: ['INTRODUCCIÓN', 'Las 3 cards entran en cascada. Pasá el mouse: se elevan, se iluminan y un destello las recorre.'],
    investigacion: ['INVESTIGACIÓN', 'Los puntos del benchmark se encienden en cascada y cada uno tiene su observación. Los 72 hallazgos se filtran por nivel y área, y los críticos pulsan en rosa.'],
    data: ['DATA & HALLAZGOS', 'Las barras de GA4 se dibujan con datos reales y los números cuentan desde 0. Los hallazgos de Clarity entran en cascada y las capturas originales se despliegan. Las cards ICE se inclinan con el mouse.'],
    usabilidad: ['USABILIDAD', 'Un trazo neón recorre la línea de tiempo y enciende cada paso. Los chips de perfil cambian el contenido del panel.'],
    solucion: ['SOLUCIÓN', 'Elegí un flujo con los chips: la versión actual y la nueva entran con un deslizamiento. Clic en una captura para ampliarla (Esc para cerrar).'],
    conclusion: ['CONCLUSIÓN', 'Las cards entran en cascada y el botón del siguiente caso tiene un desplazamiento al pasar el mouse.']
  };
  const SECS = ['portada', 'intro', 'investigacion', 'data', 'usabilidad', 'solucion', 'conclusion'].map(id => $('#' + id));
  const nav = $('#nav'), prog = $('#progress'), grid = $('#gridBg'), navCur = $('#navCur');
  const links = $$('.nav li a');
  let cur = '', ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? clamp(y / max, 0, 1) * 100 : 0) + '%';
    nav.classList.toggle('show', y > portada.offsetHeight - 180);
    if (!RM) grid.style.transform = 'translateY(' + (y * .28) + 'px)';
    let id = 'portada';
    for (const s of SECS) if (s.getBoundingClientRect().top <= innerHeight * .4) id = s.id;
    if (id !== cur) {
      cur = id;
      links.forEach(a => a.setAttribute('aria-current', a.dataset.sec === id ? 'true' : 'false'));
      const g = GUIDE[id]; 
      navCur.textContent = g[0];
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  

  /* ---- tooltip ---- */
  const tip = $('#tip');
  function showTip(text, x, y) {
    tip.textContent = text; tip.classList.add('on');
    tip.style.left = Math.min(x + 14, innerWidth - 270) + 'px'; tip.style.top = (y + 16) + 'px';
  }
  const hideTip = () => tip.classList.remove('on');

  /* ---- matriz de benchmark ---- */
  const COMP = ['TATTERSALL', 'COPEVAL', 'COAGRA', 'NS AGRO'];
  const CRIT = [["Navegación", ["mid", "ok", "mid", "bad"]], ["Arquitectura de la información", ["ok", "mid", "bad", "mid"]], ["Diseño visual", ["ok", "mid", "ok", "mid"]], ["Contenido", ["bad", "ok", "bad", "mid"]], ["Interacciones", ["mid", "mid", "mid", "bad"]], ["Diferenciales", ["mid", "ok", "mid", "mid"]]];
  const OBS = {"0-0": "El menú está sticky en todas las secciones y tiene buscador.", "0-1": "El buscador del menú sugiere un producto a medida que se escribe.", "0-3": "El menú no está siempre accesible ni tiene buscador. Algunos elementos no están bien adaptados a mobile (ej: card de productos general).", "1-0": "Tiene un carrusel de productos en la home, lo que agiliza ver la información del producto.", "1-3": "La arquitectura no está bien jerarquizada en la mayoría de las secciones.", "2-0": "Paleta de colores más amplia y diferentes imágenes de productos.", "2-3": "No hay imágenes de los productos y hay inconsistencias en secciones y botones (ej: servicios / header). Poca variación de tonalidades en la paleta.", "3-3": "Al entrar a un producto muestra “no disponible” por default hasta elegir el tipo de envase, lo que genera mala experiencia.", "4-0": "Efectos muy sutiles y acordes: aportan sin sobreestimular.", "4-2": "Efecto sutil de scroll con imagen borrosa de fondo.", "4-3": "Faltan efectos y los que hay son muy invasivos. No hay loading y hay demasiado scroll por espacios en blanco.", "5-0": "La opción de contacto está en el header, que es sticky en todas las secciones.", "5-1": "Muestra imágenes del producto desde diferentes ángulos con zoom, y tiene un carrusel de ofertas y uno de recomendaciones en la home.", "5-3": "No hay comparador de productos. La card de contacto es accesible pero se puede mejorar con los íconos."};
  const LAB = { ok: 'bueno', mid: 'intermedio', bad: 'malo' };
  const mt = $('#matrix');
  $('thead', mt).innerHTML = '<tr><th scope="col">Criterio</th>' + COMP.map((c, i) => '<th scope="col" class="' + (i === 3 ? 'us' : '') + '" style="text-align:center">' + c + '</th>').join('') + '</tr>';
  $('tbody', mt).innerHTML = CRIT.map(([name, vals], r) =>
    '<tr><th scope="row">' + name + '</th>' + vals.map((v, c) => {
      const tip = COMP[c] + ' · ' + name + ' (' + LAB[v] + ')' + (OBS[r + '-' + c] ? ': ' + OBS[r + '-' + c] : '');
      return '<td class="' + (c === 3 ? 'us' : '') + '"><button type="button" class="dot ' + v + '" style="--i:' + (r * 4 + c) + '" data-tip="' + tip.replace(/"/g, '&quot;') + '" aria-label="' + tip.replace(/"/g, '&quot;') + '"></button></td>';
    }).join('') + '</tr>').join('');
  $$('.dot[data-tip]').forEach(d => {
    d.addEventListener('pointermove', e => showTip(d.dataset.tip, e.clientX, e.clientY));
    d.addEventListener('pointerleave', hideTip);
    d.addEventListener('click', e => { const r = d.getBoundingClientRect(); showTip(d.dataset.tip, r.left, r.top); });
    d.addEventListener('focus', () => { const r = d.getBoundingClientRect(); showTip(d.dataset.tip, r.left, r.top); });
    d.addEventListener('blur', hideTip);
  });

  /* ---- principios heurísticos ---- */
  const HP = [["Visibilidad del estado del sistema", "cr", "No hay loaders ni indicadores de carga: el usuario no sabe si el sistema está procesando una acción."], ["Prevención de errores", "cr", "Los formularios no siempre validan antes de enviar. En errores del carrito se borra lo que el usuario había cargado."], ["Diseño estético y minimalista", "cr", "Muchas secciones están saturadas visualmente, con textos extensos y poca jerarquía."], ["Flexibilidad y eficiencia de uso", "me", "No hay atajos ni opciones para usuarios recurrentes. La navegación es repetitiva."], ["Diagnóstico y recuperación de errores", "me", "Algunos errores no muestran mensajes claros ni soluciones. En búsquedas vacías, a veces no se muestra nada."], ["Ayuda y documentación", "me", "No hay preguntas frecuentes: solo un chat flotante sin guía contextual."]];
  $('#heur').innerHTML = HP.map(([t, l, o], i) => {
    const lv = l === 'cr' ? 1 : 2, k = l === 'cr' ? 'var(--pink)' : 'var(--violet-text)';
    return '<div class="hr" data-reveal><span class="hn">' + String(i + 1).padStart(2, '0') + '</span><div><h4>' + t.toUpperCase() + '</h4><p>' + o + '</p></div><span class="meter" style="--k:' + k + '"><span class="seg"><i class="on"></i><i class="on"></i><i class="' + (lv === 1 ? 'on' : '') + '"></i></span><em>' + (l === 'cr' ? 'MALO' : 'INTERMEDIO') + '</em></span></div>';
  }).join('');

  /* ---- tabla de hallazgos con filtros ---- */
  const HZ = [[1, "Home > Header", "Botón 'Ver catálogo completo'", "Funciona con hover en lugar de clic. No redirige al catálogo, rediseñar el menu desplegable ya que es muy similar al de menu hamburguesa", "al", "amb"], [2, "Home > Header", "Ícono de favoritos", "No tiene hover (inconsistencia con el carrito) y no redirige a favoritos", "cr", "dev"], [3, "Home > Header", "Ícono de usuario", "Despliega menú pero no se puede cerrar haciendo clic nuevamente", "me", "dev"], [4, "Home > Header", "Ícono de usuario", "El desplegable dice 'tu cuenta' arriba y 'mi cuenta abajo' lo que dificulta la experiencia. El hola no es personalizado", "al", "dis"], [5, "Home > Header > Menu hamburguesa", "Mi cuenta", "Redirige al inicio. Rediseñar el menu", "cr", "amb"], [6, "Home", "Buscador", "Está muy cerca del banner, sin separación visual", "me", "dis"], [7, "Home", "Card 'Realiza el pago...' hasta 'Contenido destacado'", "Los botones no están centrados como conjunto", "me", "dis"], [8, "Home", "Card 'Super oferta'", "No están centradas, son cliqueables pero sin efecto visual", "al", "dis"], [9, "Home", "Carrusel productos", "No tiene flechas para navegación. Mismos iconos para productos similares generan confusión", "cr", "dis"], [10, "Home", "Cards 'Encuentra lo que estás buscando'", "Problemas muy visibles de distribución, cards sin efecto visual aunque son cliqueables", "cr", "dis"], [11, "Home", "Carrusel noticias", "Solo muestra imagen sin título ni descripción", "al", "dis"], [12, "Home", "Carrusel expertips", "Inconsistencia de plantillas entre las cards", "me", "dis"], [13, "Home", "Carrusel programas", "Títulos e íconos mal centrados y muy grandes", "al", "dis"], [14, "Home > Footer", "Texto 'Recibe noticias'", "Subrayado parece link pero no lo es", "me", "dev"], [15, "Home > Footer", "Texto 'Horario de atención'", "Redirige al inicio, debería ser solo texto", "me", "dev"], [16, "Home > Footer", "Íconos redes sociales", "Están muy abajo y a la derecha, casi no se ven", "al", "dis"], [17, "Home > Footer", "Card de contacto", "Elementos no centrados. Iconos similares generan confusión. Falta ícono de WhatsApp", "cr", "dis"], [18, "Footer > Formulario", "Campo 'Nombre'", "No tiene validación como otros campos", "al", "dev"], [19, "Footer > Formulario", "Jerarquía general", "Problemas de jerarquía visual", "cr", "dis"], [20, "Footer > Formulario", "Botón 'Enviar'", "Está en verde por default, podría estar gris hasta completar", "me", "dis"], [21, "Footer > Formulario", "Casillero VII", "Scroll incorrecto, salta al final", "me", "dev"], [22, "Pago en línea", "Texto 'Aún no tienes facturas disponibles'", "No está centrado", "cr", "amb"], [23, "Quiénes somos", "Banner", "Degradado inconsistente con otros. Texto desalineado", "al", "dis"], [24, "Quiénes somos", "Cards 'Misión / Visión / Empresa'", "Falta línea de borde superior", "me", "dis"], [25, "Quiénes somos", "Card 'Nuestros valores'", "Íconos repetidos, hover invasivo, superposición de textos", "cr", "dis"], [26, "Quiénes somos", "Carrusell 'Especialistas...' hasta 'Insumos...'", "Los íconos se perciben muy juntos y de un mismo tono de color, parecen clickeables pero no lo son", "me", "dis"], [27, "Red de atención", "Buscador", "No indica cuando no hay resultados", "al", "dis"], [28, "Red de atención", "Filtro", "No funciona", "cr", "dev"], [29, "Red de atención", "Cards", "Contenido pegado; jerarquía incorrecta; íconos y texto '¿Cómo llegar?' con apariencia de links sin funcionalidad", "cr", "dis"], [30, "Registrate", "Campo (varios)", "Permiten caracteres inválidos sin advertencia", "al", "dev"], [31, "Registrate", "Campo 'Contraseña nueva'", "Condiciones aparecen dinámicamente; debería mostrarse desde el inicio", "al", "dis"], [32, "Registrate", "Campo 'Repetir contraseña'", "Mensaje de error excesivamente largo", "me", "dis"], [33, "Registrate", "Botón 'Enviar'", "Podría estar desactivado hasta completar el formulario", "me", "dis"], [34, "Contenido destacado", "Cards 'Destacados'", "Dos primeras no funcionan, contenido desactualizado, mal funcionamiento", "cr", "amb"], [35, "Contenido destacado", "Cards 'Webinar'", "Eventos finalizados sin contenido extra como grabaciones", "cr", "dis"], [36, "Contenido destacado", "Cards 'Programas fitosanitarios'", "Título e ícono no centrados, se ven cortados", "me", "dis"], [37, "Contenido destacado", "Card 'Noticias y más'", "Espacio en blanco excesivo al ingresar, mala organización de información", "al", "dis"], [38, "Fitosanidad", "Header", "No tiene indicador de sección y al hacer hover en 'Servicios' se ve el borde verde del buscador", "me", "dis"], [39, "Fitosanidad", "Card general", "Sin división entre columnas, elementos con íconos repetidos en lugar de imágenes. Falta columna 'no disponible'", "al", "dis"], [40, "Fitosanidad", "Card general > Filtros", "No funcionan correctamente (loading infinito en 'Producto' y resultados repetidos en 'Ingrediente') no están sticky", "cr", "amb"], [41, "Fitosanidad", "Card de producto", "Contenido desalineado, sin imagen, reload innecesario al seleccionar tipo", "al", "dis"], [42, "Fitosanidad", "Card de producto", "Indica por default que no está disponbile el producto", "cr", "dev"], [43, "Nutrición vegetal", "Card general", "No tienen el mismo tamaño, la tipografía es muy grande y dificulta leer entre columnas", "al", "dis"], [44, "Nutrición vegetal", "Producto específico App 11-37-00 (200 Lt) Kla", "Falta imagen del producto y logo (inconsistencia)", "me", "dis"], [45, "Semillas", "Card de producto", "Contenido alineado a la izquierda y sin imagen (inconsistencia)", "cr", "dis"], [46, "Semillas", "Producto específico Semilla Maiz Pioneer P1443", "Inconsistencia en uso de mayúsculas/minúsculas. 'NO aplica' / 'No Aplica', esto se repite en 'Recomendaciones' dentro de todos los productos", "me", "amb"], [47, "Servicios", "Header", "Redirige mal desde header, pero correctamente desde menú/footer", "al", "dev"], [48, "Servicios", "Header", "Indica unos servicios y al ingresar son los mismos que sin login", "cr", "dev"], [49, "Servicios", "Cards de servicios", "No tiene banner de seccion", "al", "dis"], [50, "Servicios", "Cards de servicios", "Efecto hover demasiado invasivo", "cr", "dis"], [51, "Servicios", "Card de contacto", "Botones llevan al mismo número; falta claridad de función", "cr", "dev"], [52, "Servicios", "Card de descargas", "Imagen mal redondeada", "al", "dis"], [53, "Servicios", "Cards iniciales por servicio", "Inconsistencias visuales entre servicios (columnas, imágenes, textos)", "me", "dis"], [54, "Agropressure", "Card solicitud de información", "Campos 'Nombre completo' y '¿Dónde observa...' permiten datos inválidos", "al", "dev"], [55, "Agrovirus", "Card solicitud de información", "Repite problemas de Agropressure", "al", "amb"], [56, "Agrocheck", "Card general", "Ícono da a confusión, parece desplegable", "al", "dis"], [57, "Agroscreen", "Card general", "Repite problemas de otros servicios", "al", "amb"], [58, "Mi cuenta", "Menu general", "Demasiado ancho genera scroll horizontal innecesario en secciones", "me", "dis"], [59, "Mi cuenta", "Menu general", "Hay inconsistencia en la pantalla que muestra cuando no arroja resultados", "al", "amb"], [60, "Mi cuenta > Inicio", "3 cards", "La de clima: 404", "cr", "amb"], [61, "Mi cuenta > Inicio", "Card 'Recomendaciones'", "No se lee el titulo Boton redirige a google", "cr", "amb"], [62, "Mi cuenta > Carros guardados", "Carros guardados", "No los muestra porque tampoco funciona el boton de guardar carrito", "cr", "dev"], [63, "Mi cuenta > Cotizaciones", "Boton limpiar", "No vuelve a la card limpia", "al", "dev"], [64, "Mi cuenta > Cotizaciones", "Boton expandir card", "Acorta la experiencia que funcione solo con boton y no clickeando en la card completa", "me", "dev"], [65, "Mi cuenta > Historico de pedidos", "Card", "No valida datos incorrectos", "al", "dev"], [66, "Mi cuenta > Seguimiento de pedidos", "Boton expandir card", "Redirige a otra pantalla (inconsistencia con 'Cotizaciones')", "me", "amb"], [67, "Mi cuenta > mis datos", "Direcciones", "No funciona y no está bien jerarquizada", "cr", "amb"], [68, "General", "Carruseles", "Ninguno tiene flechas u scroll para facilitar interacción", "cr", "dis"], [69, "General", "Distribución", "Espacios en blanco mal distribuidos, generan scroll innecesario", "al", "dis"], [70, "General", "Banners", "Demasiado grandes e invasivos", "al", "dis"], [71, "General", "Productos", "No muestra imagen real", "al", "dis"], [72, "General", "Secciones", "No muestra un loading y la carga suele ser lenta", "cr", "amb"]];
  const LV = { cr: ['CRÍTICO', 'pk'], al: ['ALTO', 'vi'], me: ['MEDIO', 'cy'] }, AL = { dis: 'DISEÑO', dev: 'DESA', amb: 'AMBOS' };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const hzBody = $('#hzBody');
  hzBody.innerHTML = HZ.map(h =>
    '<tr data-p="' + h[4] + '" data-a="' + h[5] + '" class="' + (h[4] === 'cr' ? 'crit' : '') + '"><td class="n">' + String(h[0]).padStart(2, '0') + '</td><td><span class="tsec">' + esc(h[1]) + '</span>' + esc(h[2]) + '</td><td>' + esc(h[3]) + '</td>' +
    '<td><span class="tag sev c-' + LV[h[4]][1] + '">' + LV[h[4]][0] + '</span></td><td><span class="tag m">' + AL[h[5]] + '</span></td></tr>').join('');
  function pager(body, countEl, wrap, noun, step) {
    let lim = step, match = () => true;
    const more = $('.more', wrap), less = $('.less', wrap);
    function render() {
      let n = 0, shown = 0;
      $$('tr', body).forEach(tr => {
        const ok = match(tr);
        if (!ok) { tr.hidden = true; return; }
        n++;
        const vis = n <= lim, was = !tr.hidden;
        tr.hidden = !vis;
        if (vis) { shown++; if (!was && !RM) { tr.classList.remove('rin'); void tr.offsetWidth; tr.classList.add('rin'); } }
      });
      countEl.textContent = n ? 'MOSTRANDO ' + shown + ' DE ' + n + ' ' + noun : 'SIN RESULTADOS PARA ESTA COMBINACIÓN';
      more.hidden = n <= lim; more.textContent = 'VER MÁS (+' + Math.min(step, n - lim) + ')';
      less.hidden = lim <= step || n <= step;
    }
    more.addEventListener('click', () => { lim += step; render(); });
    less.addEventListener('click', () => { lim = step; render(); body.closest('.tbl').scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' }); });
    return { set(fn) { match = fn; lim = step; render(); }, render };
  }
  const filt = { p: 'all', a: 'all' };
  const hzPager = pager(hzBody, $('#hzCount'), $('#hzMore'), 'HALLAZGOS', 5);
  const applyFilters = () => hzPager.set(tr => (filt.p === 'all' || tr.dataset.p === filt.p) && (filt.a === 'all' || tr.dataset.a === filt.a));
  [['#fPrio', 'p'], ['#fArea', 'a']].forEach(([sel, key]) => {
    $$('.chip', $(sel)).forEach(b => b.addEventListener('click', () => {
      $$('.chip', $(sel)).forEach(o => o.setAttribute('aria-pressed', o === b));
      filt[key] = b.dataset.v; applyFilters();
    }));
  });
  applyFilters();

  /* ---- tabla ICE ---- */
  const ICE = [[1, "Validar que los accesos a Servicios sean específicos según tipo de usuario.", 9, 9, 2, 40.5, "qw", "dev", false], [2, "Corregir y validar botones inactivos o enlaces rotos (ej. en Red de Atención).", 8, 9, 2, 36.0, "qw", "dev", false], [3, "Corregir la card de clima que da 404 en sección “Mi cuenta”.", 7, 9, 2, 31.5, "qw", "dev", false], [4, "Corregir redirección de botón “Pago en línea”: lleva a “Mi cuenta”.", 7, 8, 2, 28.0, "qw", "dev", false], [5, "Mejorar visibilidad y ubicación de íconos de redes sociales.", 7, 8, 2, 28.0, "qw", "dis", true], [6, "Rediseñar la card de Contacto: centrar contenido, diferenciar iconos visualmente, agregar WhatsApp y corregir enlace de 'contacto' mal redirigido.", 7, 8, 2, 28.0, "qw", "amb", true], [7, "Mostrar de forma anticipada los requisitos necesarios para la contraseña (ej. longitud mínima, uso de mayúsculas, símbolos, etc.) antes de comenzar a escribir y posibilidad de ver la contraseña.", 8, 9, 3, 24.0, "qw", "dis", true], [8, "Optimizar el menú hamburguesa (ej: Registrate más visible) para resolver errores de despliegue.", 7, 9, 3, 21.0, "qw", "dis", true], [9, "Ajustar diseño de cards \"encontra lo que estas buscando\" / \"nuestros producots\"", 9, 9, 4, 20.25, "qw", "dis", false], [10, "Activar funcionalidad de “guardar carrito” y habilitar sección de carritos guardados para usuarios logueados.", 8, 9, 4, 18.0, "tac", "dev", false], [11, "Incluir mensajes de \"sin resultados\" en búsquedas vacías o filtros que devuelvan nulo.", 6, 8, 3, 16.0, "tac", "dis", false], [12, "Agregar indicadores de carga (loaders) en acciones críticas: navegación, filtros, envío de formularios.", 8, 8, 4, 16.0, "tac", "dis", false], [13, "Rediseñar el header para jerarquizar íconos y menús desplegables con estados activos, hover y clic.", 8, 8, 4, 16.0, "tac", "dis", true], [14, "Reforzar uso de grillas, márgenes y jerarquías tipográficas en todas las páginas informativas.", 8, 8, 4, 16.0, "tac", "dis", true], [15, "Rediseñar las cards de “Red de Atención” para jerarquizar información y asegurar que los botones funcionen correctamente.", 8, 9, 5, 14.4, "est", "dis", false], [16, "Rediseñar sección \"Quiénes somos\": unificar estilo de íconos, reducir efectos visuales agresivos y alinear correctamente el texto.", 8, 9, 5, 14.4, "est", "dis", true], [17, "Ajustar estilos de botones para distinguir claramente entre acciones principales y secundarias.", 6, 7, 3, 14.0, "est", "dis", false], [18, "Reajustar menú lateral de \"\"Mi cuenta\"\" para eliminar scroll horizontal, mejorar la visibilidad y hacer clickeable toda la fila.", 7, 8, 4, 14.0, "est", "dis", false], [19, "Corregir el bug de loading infinito en filtro de productos", 7, 8, 4, 14.0, "est", "dev", false], [20, "Agregar columna o indicador de disponibilidad para evitar clicks en productos sin stock.", 7, 8, 4, 14.0, "est", "dis", true], [21, "Reorganizar secciones de Servicios: establecer una estructura modular clara (columna doble, texto + imagen) y corregir efecto hover muy invasivo.", 6, 7, 3, 14.0, "est", "dis", false], [22, "En ficha de producto: añadir imágenes reales, reducir espacio vacío y mejorar el botón de acción visible desde el inicio.", 9, 9, 6, 13.5, "est", "amb", true], [23, "Rediseñar grilla de productos con separadores claros, header sticky y legibilidad mejorada.", 8, 8, 5, 12.8, "est", "dis", true], [24, "Optimizar carruseles: sumar flechas laterales y controles visuales más accesibles.", 7, 7, 4, 12.25, "est", "dis", true], [25, "Incluir sección de “carrito abandonado” visible para usuarios logueados, con CTA para retomar la compra.", 6, 8, 4, 12.0, "est", "dis", false], [26, "Reestructurar sección Contenido Destacado y sus subsecciones: mejorar jerarquía, actualizar contenido y asegurar consistencia visual.", 9, 9, 7, 11.57, "est", "dis", false], [27, "Reajustar todas las secciones en mobile ya que no son completamente responsive, no están optimizadas en pantallas tan pequeñas", 9, 9, 9, 10.1, "est", "amb", true]];
  const PL = { qw: ['QUICK WIN', 'li'], tac: ['TÁCTICA', 'vi'], est: ['ESTRUCTURAL', 'pk'] };
  const iceBody = $('#iceBody');
  iceBody.innerHTML = ICE.map(r =>
    '<tr data-p="' + r[6] + '"><td class="n">' + String(r[0]).padStart(2, '0') + '</td><td>' + esc(r[1]) + (r[8] ? ' <span class="tag m" title="Tiene wireframe o mockup">WF</span>' : '') + '</td><td class="n">' + r[2] + '</td><td class="n">' + r[3] + '</td><td class="n">' + r[4] + '</td><td class="t">' + String(r[5]).replace('.', ',') + '</td>' +
    '<td><span class="tag c-' + PL[r[6]][1] + '">' + PL[r[6]][0] + '</span></td><td><span class="tag m">' + AL[r[7]] + '</span></td></tr>').join('');
  const icePager = pager(iceBody, $('#iceCount'), $('#iceMore'), 'MEJORAS', 5);
  $$('.chip', $('#fIce')).forEach(b => b.addEventListener('click', () => {
    $$('.chip', $('#fIce')).forEach(o => o.setAttribute('aria-pressed', o === b));
    icePager.set(tr => b.dataset.v === 'all' || tr.dataset.p === b.dataset.v);
  }));
  icePager.set(() => true);

  /* ---- inclinación de las cards ICE ---- */
  if (!RM) $$('.tilt').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = 'perspective(700px) rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 9) + 'deg) translateY(-4px)';
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });

  /* ---- perfiles ---- */
  const PROF = {
    COBRE: ['Explorar el catálogo, ver la ficha del producto, agregarlo al carrito y pagar', 'Catálogo de productos', 'Producción (PROD)'],
    PLATA: ['Crear una cuenta (usuario natural o jurídico) y comprar viendo la invitación a mejorar el plan', 'Creación de usuario', 'Staging (STG)'],
    ORO: ['Gestionar Mi cuenta: pedidos, cotizaciones, cuenta corriente y pago de facturas', 'Mi cuenta', 'Staging (STG)'],
    DIAMANTE: ['Comprar con el plan más alto: negociar el precio, pagar y validar con código de verificación', 'Single de producto', 'Staging (STG)']
  };
  const panel = $('#panel');
  function showProf(k) {
    const d = PROF[k];
    panel.innerHTML = ['TAREA', 'PUNTO DE INICIO', 'AMBIENTE'].map((l, i) => '<div><dt>' + l + '</dt><dd>' + d[i] + '</dd></div>').join('');
  }
  $$('.chip', $('#profiles')).forEach(b => b.addEventListener('click', () => {
    $$('.chip', $('#profiles')).forEach(o => o.setAttribute('aria-pressed', o === b));
    showProf(b.textContent.trim());
  }));
  showProf('COBRE');

  /* ---- visor de flujos: actual vs. nueva ---- */
  const FLOWS = [{"k": "catalogo", "t": "COBRE · CATÁLOGO", "c": "cy", "ev": "USABILIDAD + CLARITY", "l": ["Eliminé el “ojo de preview”: generaba confusión en las pruebas de usabilidad.", "Si el producto no está disponible, el aviso aparece en el catálogo con un CTA, y no recién al intentar agregarlo al carrito.", "Sumé imágenes reales de los productos, sugeridas por los clientes en las pruebas.", "Mejor jerarquía y diferenciación por color para facilitar la navegación."]}, {"k": "single", "t": "COBRE · SINGLE DEL PRODUCTO", "c": "cy", "ev": "CLARITY + USABILIDAD", "l": ["La información pasó a 2 columnas: Clarity mostró que algunos usuarios no llegaban al final de la página.", "Compartir el producto es más visible y hay un CTA que invita a subir de plan para un mejor precio.", "“Información” pasó a llamarse “Ficha técnica” para facilitar el acceso (surgió en las pruebas de usabilidad).", "Carrusel de otros productos con mejor estructura de card y jerarquía visual."]}, {"k": "registro", "t": "PLATA · CREACIÓN DE USUARIO NATURAL", "c": "pk", "ev": "", "l": ["Los requisitos de la contraseña se muestran desde el inicio; antes se indicaban sobre la marcha y generaban retrabajo.", "Botón para visualizar la contraseña.", "Mejor jerarquía visual: las opciones clicables van al lado del mapa para aprovechar el espacio."]}, {"k": "cta", "t": "PLATA · SINGLE DE PRODUCTO (CTA)", "c": "pk", "ev": "", "l": ["Se invita al usuario a mejorar su plan (pasarse a Oro) para obtener un mejor precio."]}, {"k": "vendedores", "t": "ORO · MI CUENTA · VENDEDORES", "c": "vi", "ev": "", "l": ["Búsqueda por nombre para agilizar, pensando en que a futuro puede haber más vendedores y la pantalla debe escalar.", "Diseño mejorado y ícono de WhatsApp actualizado para mantener coherencia visual."]}, {"k": "facturas", "t": "ORO · MI CUENTA · PAGO DE FACTURAS", "c": "vi", "ev": "", "l": ["Diseño limpio, con los menús desplegables en la disposición esperada.", "Se evitan los scrolls innecesarios."]}, {"k": "programas", "t": "ORO · MI CUENTA · PROGRAMAS", "c": "li", "ev": "", "l": ["Mejor jerarquía de la información dentro de las cards.", "Bordes verdes al hacer hover sobre la card.", "Se eliminaron las fechas para no tener que actualizar el sitio constantemente.", "CTA claro para descargar el PDF."]}];
  const IMGS = {"catalogo": ["/casos/ns-agro/img-04.webp", "/casos/ns-agro/img-05.webp"], "single": ["/casos/ns-agro/img-06.webp", "/casos/ns-agro/img-07.webp"], "registro": ["/casos/ns-agro/img-08.webp", "/casos/ns-agro/img-09.webp"], "cta": ["/casos/ns-agro/img-10.webp", "/casos/ns-agro/img-11.webp"], "vendedores": ["/casos/ns-agro/img-12.webp", "/casos/ns-agro/img-13.webp"], "facturas": ["/casos/ns-agro/img-14.webp", "/casos/ns-agro/img-15.webp"], "programas": ["/casos/ns-agro/img-16.webp", "/casos/ns-agro/img-17.webp"]};
  const COL = { cy: 'var(--cyan)', pk: 'var(--pink)', vi: 'var(--violet)', li: 'var(--lime)' };
  const fv = $('#fv'), fvA = $('#fvA'), fvN = $('#fvN');
  function showFlow(k, anim) {
    const f = FLOWS.find(x => x.k === k);
    fv.style.setProperty('--c', COL[f.c]);
    fvA.src = IMGS[k][0]; fvN.src = IMGS[k][1];
    $('#fvT').textContent = f.t;
    const ev = $('#fvE'); ev.textContent = f.ev ? 'EVIDENCIA: ' + f.ev : ''; ev.hidden = !f.ev;
    $('#fvL').innerHTML = f.l.map(t => '<li>' + t + '</li>').join('');
    if (anim && !RM) { fv.classList.remove('swap'); void fv.offsetWidth; fv.classList.add('swap'); }
  }
  $$('.chip', $('#fFlow')).forEach(b => b.addEventListener('click', () => {
    $$('.chip', $('#fFlow')).forEach(o => o.setAttribute('aria-pressed', o === b));
    showFlow(b.dataset.k, true);
  }));
  showFlow('catalogo', false);
  const lb = $('#lb'), lbi = $('img', lb);
  $$('.fv-f button').forEach(b => b.addEventListener('click', () => { lbi.src = $('img', b).src; lb.classList.add('on'); }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });
})();
}
