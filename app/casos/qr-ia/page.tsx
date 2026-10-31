import type { Metadata } from "next";
import BODY from "./body";
import Animaciones from "./Animaciones";
import "./caso.css";

export const metadata: Metadata = {
  title: "QR IA · Caso de estudio",
  description: "Cómo convertí una sección de IA que funcionaba sin diseño en un sistema de reportes para RE/MAX, en cuatro días.",
};

export default function Caso() {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: BODY }} />
      <Animaciones />
    </>
  );
}
