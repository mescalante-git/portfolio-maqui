"use client";

import { useRunOnce } from "@/components/caso/useRunOnce";
import { prepareCaseReplay } from "@/lib/replay";
import run from "./interacciones";

export default function Animaciones() {
  useRunOnce(() => {
    const replay = prepareCaseReplay();
    run();
    replay.start();
  });
  return null;
}
