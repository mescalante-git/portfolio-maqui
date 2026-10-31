import type { Metadata } from "next";
import BODY from "./body";
import Animaciones from "./Animaciones";
import "./caso.css";

export const metadata: Metadata = {
  title: "Salazar · Caso de estudio",
  description: "Challenge UX/UI de 120 horas: benchmark, evaluación heurística y una propuesta mobile más clara para un sitio automotriz.",
};

export default function Caso() {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: BODY }} />
      <Animaciones />
    </>
  );
}
