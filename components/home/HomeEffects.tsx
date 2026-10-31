"use client";

import { useEffect } from "react";
import { setupReveal, setupTitleGlitch } from "@/lib/fx";
import { periodicTitleGlitch, replayPre } from "@/lib/replay";

/** Efectos globales de la home: apariciones al hacer scroll y glitch de los títulos.
 *  Va al final de la página para que las secciones ya estén escuchando el evento "revealed". */
export default function HomeEffects() {
  useEffect(() => {
    const a = setupReveal();
    const b = setupTitleGlitch();
    /* al volver a una sección: la línea de tiempo y los subrayados se vuelven a dibujar */
    const c = replayPre([...document.querySelectorAll("#tl, .uline[data-go]")]);
    /* títulos: glitch suave cada 12 s mientras están a la vista */
    const d = periodicTitleGlitch(".sec-title.glitch, .ct-t");
    return () => {
      a();
      b();
      c();
      d();
    };
  }, []);
  return null;
}
