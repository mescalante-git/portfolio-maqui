import { ImageResponse } from "next/og";

/* Imagen que aparece al compartir el link (WhatsApp, LinkedIn, Slack…). Se genera una vez al publicar. */

export const alt = "Macarena Escalante · UX/UI & Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Trae sólo las letras que usamos de Space Mono, desde Google Fonts */
async function spaceMono(weight: 400 | 700, text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Space+Mono:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

const NAME = ["MACARENA", "ESCALANTE"];
const LEAD = "Hago que lo complejo se vuelva simple de usar.";
const ROLES: [string, string, string][] = [
  ["UX/UI DESIGNER", "#8E0A70", "#FF70DE"],
  ["PRODUCT DESIGNER", "#7332FE", "#A57BFF"],
];
const TAGS: [string, string][] = [
  ["UX RESEARCH", "#63E2FF"],
  ["DESIGN SYSTEMS", "#7CFFC2"],
  ["PRODUCTO", "#A57BFF"],
  ["DISEÑO CON IA", "#8197FF"],
];

export default async function Image() {
  const all = NAME.join(" ") + LEAD + ROLES.map((r) => r[0]).join("") + TAGS.map((t) => t[0]).join("") + "BUENOS AIRES · REMOTO_/";
  const [bold, regular] = await Promise.all([spaceMono(700, all), spaceMono(400, all)]);
  const fonts = [
    ...(bold ? [{ name: "Space Mono", data: bold, weight: 700 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "Space Mono", data: regular, weight: 400 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#050505",
          backgroundImage:
            "radial-gradient(circle at 82% 10%, rgba(142,10,112,0.5) 0%, rgba(5,5,5,0) 45%), radial-gradient(circle at 8% 95%, rgba(115,50,254,0.42) 0%, rgba(5,5,5,0) 45%)",
          fontFamily: "Space Mono",
          color: "#FAFAFA",
          position: "relative",
        }}
      >
        {/* línea vertical del hero (código / diseño) */}
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundImage: "linear-gradient(180deg, #A57BFF, #FB00C1, #05CCF9, #39F99F)",
          }}
        />
        <div style={{ display: "flex", gap: 14 }}>
          {ROLES.map(([t, k, kl]) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 18px",
                border: `2px solid ${k}`,
                color: kl,
                fontSize: 20,
                letterSpacing: 4,
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {NAME.map((n) => (
            <div
              key={n}
              style={{
                display: "flex",
                fontSize: 120,
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: -6,
                textShadow: "0 0 34px rgba(213,7,165,0.85)",
              }}
            >
              {n}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#FAFAFA" }}>{LEAD}</div>
        <div style={{ display: "flex", gap: 12 }}>
          {TAGS.map(([t, c]) => (
            <div
              key={t}
              style={{ display: "flex", padding: "8px 14px", border: `2px solid ${c}`, color: c, fontSize: 18, fontWeight: 700 }}
            >
              {t}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 48, bottom: 36, display: "flex", fontSize: 20, color: "#FF70DE" }}>
          MACARENA_
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
