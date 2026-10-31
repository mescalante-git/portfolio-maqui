"use client";

import { useEffect } from "react";
import { setupReveal, setupTitleGlitch } from "@/lib/fx";

/** Efectos globales de la home: apariciones al hacer scroll y glitch de los títulos.
 *  Va al final de la página para que las secciones ya estén escuchando el evento "revealed". */
export default function HomeEffects() {
  useEffect(() => {
    const a = setupReveal();
    const b = setupTitleGlitch();
    return () => {
      a();
      b();
    };
  }, []);
  return null;
}
