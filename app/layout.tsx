import type { Metadata, Viewport } from "next";
import { Montserrat, Space_Grotesk, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/* Tipografía del producto de QR Solutions: sólo se usa en las recreaciones del caso QR IA */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
  preload: false,
});

const SITE_URL = "https://macarena-escalante.vercel.app";
const TITLE = "Macarena Escalante · UX/UI & Product Designer";
const DESCRIPTION =
  "Hago que lo complejo se vuelva simple de usar. Diseñadora UX/UI y de producto en Buenos Aires: research, design systems y diseño con IA.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Macarena Escalante" },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Macarena Escalante",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${spaceMono.variable} ${spaceGrotesk.variable} ${montserrat.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
