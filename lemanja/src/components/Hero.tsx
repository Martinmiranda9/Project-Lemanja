"use client";

/**
 * Hero.tsx — Lemanjá
 *
 * Fases de scroll:
 * ─────────────────────────────────────────────────────────────
 * FASE 1  (scroll 0 → 100vh):
 *   El panel blureado sube desde el fondo (translateY 100% → 0%).
 *   El UI del hero se desvanece.
 *
 * FASE 2  (scroll = 100vh):
 *   El panel termina de cubrir la imagen (translateY 0%).
 *   El sticky se suelta INSTANTÁNEAMENTE → la nueva sección emerge.
 *
 * Sección total del hero: 200vh
 * Sticky container:       100vh → se desprende en scroll 100vh
 *                         (200vh - 100vh = 100vh de pegado)
 *
 * Tipografía (style-guide):
 *   Títulos/Marca:  Playfair Display Italic
 *   UI/etiquetas:   JetBrains Mono uppercase
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────
   Reloj de Tahití (UTC-10, Polinesia Francesa)
   Tipografía: Playfair Display Italic 400
───────────────────────────────────────────── */
function TahitiClock({ color = "#2C365A" }: { color?: string }) {
  const [time, setTime] = useState({ clock: "00:00:00", ampm: "am" });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const tahiti = new Date(utcMs - 10 * 3600000);
      const rawH = tahiti.getHours();
      const ampm = rawH >= 12 ? "pm" : "am";
      const hh = String(rawH % 12 || 12).padStart(2, "0");
      const mm = String(tahiti.getMinutes()).padStart(2, "0");
      const ss = String(tahiti.getSeconds()).padStart(2, "0");
      setTime({ clock: `${hh}:${mm}:${ss}`, ampm });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span
        style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(1rem, 1.4vw, 1.35rem)",
          color,
          letterSpacing: "0.03em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {time.clock}
      </span>
      <span
        style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(0.6rem, 0.8vw, 0.8rem)",
          color,
          opacity: 0.7,
          lineHeight: 1,
        }}
      >
        {time.ampm}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
export default function Hero() {
  const scrollY = useMotionValue(0);
  const [navbarVisible, setNavbarVisible] = useState(false);

  /* ── Lenis scroll → MotionValue ── */
  useEffect(() => {
    type WL = {
      lenis?: {
        on: (e: string, cb: (d: { scroll: number }) => void) => void;
        off: (e: string, cb: (d: { scroll: number }) => void) => void;
      };
    };

    let cleanup: (() => void) | undefined;

    const connect = () => {
      const lenis = (window as unknown as WL).lenis;
      if (!lenis) {
        const t = setTimeout(connect, 50);
        cleanup = () => clearTimeout(t);
        return;
      }

      const handler = (d: { scroll: number }) => {
        scrollY.set(d.scroll);

        // Navbar visible cuando el panel está completamente arriba:
        // eso ocurre cuando scroll ≥ 1.0 × vh
        const vh = window.innerHeight;
        setNavbarVisible(d.scroll >= vh * 0.9);
      };

      lenis.on("scroll", handler);
      cleanup = () => lenis.off("scroll", handler);
    };

    connect();
    return () => cleanup?.();
  }, [scrollY]);

  /* ── translateY del panel blureado ──────────────────────────────
     FASE 1: scroll 0 → 1×vh  →  panelY 100% → 0%  (sube)
     FASE 2: scroll ≥ 1×vh    →  panelY 0%          (congelado)
  ────────────────────────────────────────────────────────────── */
  const panelY = useTransform(scrollY, (v) => {
    if (typeof window === "undefined") return "100%";
    const vh = window.innerHeight;
    const animEnd = vh * 1.0;
    const progress = Math.min(v / animEnd, 1);
    const y = Math.max(0, 100 - 100 * progress);
    // Evitar decimales que causen hydration mismatch
    return `${Math.round(y)}%`;
  });

  /* ── Opacidad del UI inicial ──
     Se desvanece en el primer 20% del recorrido de la FASE 1
  ─────────────────────────────────────────────────────────── */
  const heroUIOpacity = useTransform(scrollY, (v) => {
    if (typeof window === "undefined") return 1;
    const fadeEnd = window.innerHeight * 0.22;
    return Math.max(0, 1 - v / fadeEnd);
  });

  return (
    <>
      {/* ────────────────────────────────────────────────────────
          NAVBAR — Cream, fixed, aparece en FASE 2
      ──────────────────────────────────────────────────────── */}
      <motion.nav
        aria-label="Navegación principal"
        animate={navbarVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: "#EEE8DF",
          borderBottom: "1px solid rgba(44,54,90,0.10)",
          pointerEvents: navbarVisible ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
            padding: "0 clamp(1.5rem, 4vw, 4rem)",
            maxWidth: 1800,
            margin: "0 auto",
          }}
        >
          {/* Marca */}
          <span
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.3rem, 1.8vw, 1.9rem)",
              color: "#2C365A",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            lemanjá
            <span style={{ fontStyle: "normal", marginLeft: 2, opacity: 0.65 }}>.</span>
          </span>

          {/* Líneas decorativas */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 80, height: 1, backgroundColor: "#2C365A", opacity: 0.75 }} />
            <div style={{ width: 44, height: 1, backgroundColor: "#2C365A", opacity: 0.35 }} />
          </div>

          {/* Reloj + etiqueta */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
            <TahitiClock color="#2C365A" />
          </div>
        </div>
      </motion.nav>

      {/* ────────────────────────────────────────────────────────
          HERO SECTION — 350vh
          Fase 1  (0→100vh):   panel sube
          Fase 2  (100→200vh): panel congelado, imagen blureada
          Fase 3  (200→350vh): sticky se desprende, nueva sección emerge
      ──────────────────────────────────────────────────────── */}
      <section
        style={{ height: "200vh", position: "relative" }}
        aria-label="Lemanjá — Atrapados por la marea"
      >
        {/* Sticky container — se suelta al llegar a scroll = 100vh (200-100=100) */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Imagen full-bleed */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src="/imagen-hero.jpg"
              alt="Lemanjá — Fotografía de mar en Polinesia Francesa"
              fill
              priority
              quality={90}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          {/* Overlay gradiente bottom → top */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "linear-gradient(to top, rgba(44,54,90,0.50) 0%, rgba(44,54,90,0.06) 38%, transparent 100%)",
            }}
          />

          {/* ── UI inicial: lemanjá | líneas | reloj ─────────────
              FASE 1: se desvanece mientras el panel sube
          ──────────────────────────────────────────────────── */}
          <motion.div
            style={{ opacity: heroUIOpacity, position: "absolute", inset: 0, zIndex: 10 }}
          >
            {/* lemanjá. — top-left */}
            <div
              style={{
                position: "absolute",
                top: "clamp(2rem, 2.5vw, 2.8rem)",
                left: "clamp(2rem, 3vw, 3rem)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)",
                  color: "#2C365A",
                  letterSpacing: "0.01em",
                  lineHeight: 1,
                }}
              >
                lemanjá
                <span style={{ fontStyle: "normal", marginLeft: 2, opacity: 0.7 }}>.</span>
              </span>
            </div>

            {/* Líneas — top-center */}
            <div
              style={{
                position: "absolute",
                top: "clamp(2.5rem, 3vw, 3rem)",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 7,
              }}
            >
              <div style={{ width: 120, height: 2, backgroundColor: "#2C365A", opacity: 0.75 }} />
              <div style={{ width: 70, height: 1.5, backgroundColor: "#2C365A", opacity: 0.35 }} />
            </div>

            {/* Reloj — top-right */}
            <div
              style={{
                position: "absolute",
                top: "clamp(2rem, 2.5vw, 2.8rem)",
                right: "clamp(2rem, 3vw, 3rem)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
              }}
            >
              <TahitiClock color="#2C365A" />
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), 'Space Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  color: "#2C365A",
                  opacity: 0.55,
                }}
              >
                Hora local · PF
              </span>
            </div>
          </motion.div>

          {/* ── Frase principal — bottom-left ─────────────────── */}
          <motion.div
            style={{
              opacity: heroUIOpacity,
              position: "absolute",
              bottom: "10%",
              left: "clamp(2rem, 3vw, 3rem)",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                  color: "#EEE8DF",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                Tahití
              </span>
              <span
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                  color: "#EEE8DF",
                  lineHeight: 1,
                  display: "block",
                  opacity: 0.88,
                }}
              >
                el lugar,
              </span>
              <span
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                  color: "#C4BCB0",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                que cura todo
              </span>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────
              PANEL BLUREADO
              FASE 1: translateY 100% → 0%  (sube con el scroll)
              FASE 2: translateY 0%          (congelado, clamp)
              Contenido centrado: PF + título + subtexto
          ──────────────────────────────────────────────────── */}
          <motion.div
            style={{
              y: panelY,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              zIndex: 20,
              backdropFilter: "blur(30px) saturate(1.2) brightness(0.9)",
              WebkitBackdropFilter: "blur(30px) saturate(1.2) brightness(0.9)",
              backgroundColor: "rgba(238, 232, 223, 0.12)",
              borderTop: "1px solid rgba(238, 232, 223, 0.18)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Contenido centrado */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "clamp(1rem, 2vw, 1.75rem)",
                padding: "2rem",
                maxWidth: 720,
                width: "100%",
              }}
            >
              {/* Monograma PF — Playfair Italic Regular */}
              <div
                style={{
                  border: "1px solid rgba(238, 232, 223, 0.5)",
                  borderRadius: "50%",
                  width: "clamp(68px, 7vw, 96px)",
                  height: "clamp(68px, 7vw, 96px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)",
                    color: "#EEE8DF",
                    letterSpacing: "0.1em",
                    lineHeight: 1,
                  }}
                >
                  PF
                </span>
              </div>

              {/* Título — Playfair Italic Bold 700 */}
              <h1
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(1.9rem, 4.2vw, 3.8rem)",
                  color: "#EEE8DF",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Atrapados por la marea
              </h1>

              {/* Separador */}
              <div
                style={{
                  width: 40,
                  height: 1,
                  backgroundColor: "#EEE8DF",
                  opacity: 0.3,
                  flexShrink: 0,
                }}
              />

              {/* Subtexto — Playfair Display Italic Regular 400 (style-guide §3.1 frases líricas) */}
              <p
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
                  color: "#EEE8DF",
                  opacity: 0.72,
                  letterSpacing: "0.01em",
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: 500,
                }}
              >
                Una bitácora visual dedicada a los que buscan perderse
                <br />
                en la inmensidad del agua.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
