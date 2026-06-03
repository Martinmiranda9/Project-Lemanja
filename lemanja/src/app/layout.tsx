import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/providers/LenisProvider";

/* ─────────────────────────────────────────────
   FUENTES — Google Fonts (Next.js font optimization)
   Playfair Display: Serif italic editorial de alto contraste (títulos)
   JetBrains Mono: Monoespaciada técnica (cuerpo/UI)
───────────────────────────────────────────── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Lemanjá — Premium Mar Photography",
  description:
    "Una experiencia visual inmersiva inspirada en el océano, la espuma de las olas y la mitología de Lemanjá. Fotografía analógica de mar.",
  keywords: ["fotografía", "mar", "Lemanjá", "editorial", "océano", "premium"],
  openGraph: {
    title: "Lemanjá — Premium Mar Photography",
    description:
      "Una experiencia visual inmersiva inspirada en el océano y la mitología de Lemanjá.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        {/*
          LenisProvider es Client Component — envuelve toda la app
          para habilitar smooth scroll global sin interferir con
          los Server Components internos.
        */}
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
