import type { Metadata } from "next";
import BODY from "./body";
import Animaciones from "./Animaciones";
import "./caso.css";

export const metadata: Metadata = {
  title: "Resiter · Caso de estudio",
  description: "De un sitio saturado a una arquitectura clara: rediseño web end-to-end para una empresa chilena de gestión de residuos, como única diseñadora.",
};

export default function Caso() {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: BODY }} />
      <Animaciones />
    </>
  );
}
