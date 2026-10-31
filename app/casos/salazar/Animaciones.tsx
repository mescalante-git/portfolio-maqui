"use client";

import { useRunOnce } from "@/components/caso/useRunOnce";
import run from "./interacciones";

export default function Animaciones() {
  useRunOnce(run);
  return null;
}
