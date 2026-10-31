import type { Metadata } from "next";
import BODY from "./body";
import Animaciones from "./Animaciones";
import "./caso.css";

export const metadata: Metadata = {
  title: "NS Agro · Caso de estudio",
  description: "Investigación con datos y priorización estratégica para el e-commerce de un distribuidor del agro: 72 hallazgos convertidos en 27 mejoras.",
};

export default function Caso() {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: BODY }} />
      <Animaciones />
    </>
  );
}
