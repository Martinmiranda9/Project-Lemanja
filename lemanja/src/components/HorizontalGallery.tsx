"use client";

/**
 * HorizontalGallery.tsx — Lemanjá
 *
 * Galería horizontal scroll-driven inspirada en composites.archi.
 * El scroll vertical mueve las imágenes horizontalmente hacia la izquierda.
 * La imagen más cercana al centro del viewport se agranda sutilmente.
 * Al hover solo aparece el contador (ej. 04 / 10) abajo de la imagen.
 *
 * Mecánica desktop:
 *   height: 400vh  →  300vh de recorrido de scroll
 *   sticky: 100vh
 *   useScroll → useTransform → translateX del track
 *
 * Título central:
 *   Se actualiza dinámicamente con el destino centrado.
 *   AnimatePresence para transición suave entre nombres.
 *
 * Mobile (< 768px):
 *   Scroll horizontal nativo con overflow-x + scroll-snap.
 *   Contador siempre visible. Sin sticky ni scroll-driven.
 *
 * Style-guide:
 *   Playfair Display Italic (títulos) · JetBrains Mono (labels)
 *   Paleta: Cream #EEE8DF · Beige #C4BCB0 · Deep Ocean #2C365A
 *   Sin bordes redondeados · Sin sombras difusas
 */

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────────
   Datos de destinos — Tahití / Polinesia Francesa
───────────────────────────────────────────── */
const DESTINATIONS = [
  { name: "Matira", src: "/1.jpg" },
  { name: "Temae", src: "/2.jpg" },
  { name: "Teahupo'o", src: "/3.jpg" },
  { name: "Fare", src: "/4.jpg" },
  { name: "Tiputa", src: "/5.jpg" },
  { name: "Tuherahera", src: "/6.jpg" },
  { name: "Garuae", src: "/7.jpg" },
  { name: "Avea", src: "/8.jpg" },
  { name: "Papara", src: "/9.jpg" },
  { name: "Rotoava", src: "/10.jpg" },
];

/* ─────────────────────────────────────────────
   Tipos internos
───────────────────────────────────────────── */
interface Dims {
  trackW: number;
  vpW: number;
  cardW: number;
  gap: number;
  padLeft: number;
}

/* ─────────────────────────────────────────────
   HorizontalCard — tarjeta individual con escala
   dinámica según proximidad al centro del viewport.
   Solo muestra el contador (ej. 04 / 10) en hover.
───────────────────────────────────────────── */
function HorizontalCard({
  destination,
  index,
  scrollYProgress,
  getDims,
}: {
  destination: (typeof DESTINATIONS)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
  getDims: () => Dims;
}) {
  const [hovered, setHovered] = useState(false);

  /* ── Scale: más cerca del centro → más grande ── */
  const scale = useTransform(scrollYProgress, (p) => {
    const d = getDims();
    if (d.vpW === 0 || d.cardW === 0) return 1;
    const maxScroll = Math.max(0, d.trackW - d.vpW);
    const currentX = -p * maxScroll;
    const cardLeft = d.padLeft + index * (d.cardW + d.gap);
    const cardCenter = cardLeft + d.cardW / 2 + currentX;
    const vpCenter = d.vpW / 2;
    const distance = Math.abs(cardCenter - vpCenter);
    const maxDist = d.vpW * 0.55;
    const t = Math.max(0, 1 - distance / maxDist);
    return 1 + 0.08 * t * t;
  });

  return (
    <motion.div
      className="hz-card"
      style={{ scale }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Imagen ── */}
      <Image
        src={destination.src}
        alt={`${destination.name} — Polinesia Francesa`}
        fill
        quality={90}
        sizes="(max-width: 768px) 80vw, 42vw"
        style={{
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 2,
        }}
      />

      {/* ── Placeholder (visible detrás de la imagen mientras carga) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
            color: "#2C365A",
            opacity: 0.18,
            letterSpacing: "-0.01em",
          }}
        >
          {destination.name}
        </span>
      </div>

      {/* ── Contador — bottom-right en hover ── */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(0.75rem, 1.5vw, 1.25rem)",
          right: "clamp(0.75rem, 1.5vw, 1.25rem)",
          zIndex: 10,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains), 'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: "#EEE8DF",
            opacity: 0.55,
            textShadow: "0 1px 6px rgba(44,54,90,0.4)",
          }}
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(DESTINATIONS.length).padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   HorizontalGallery — componente principal
───────────────────────────────────────────── */
export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dims = useRef<Dims>({ trackW: 0, vpW: 0, cardW: 0, gap: 0, padLeft: 0 });
  const prevIdxRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  /* ── Medir dimensiones del track y tarjetas ── */
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const children = trackRef.current.children;
      if (children.length === 0) return;

      const first = children[0] as HTMLElement;
      const cardW = first.offsetWidth;

      const gap =
        children.length > 1
          ? (children[1] as HTMLElement).offsetLeft -
            first.offsetLeft -
            cardW
          : 0;

      const computedStyle = getComputedStyle(trackRef.current);
      const padLeft = parseFloat(computedStyle.paddingLeft) || 0;

      dims.current = {
        trackW: trackRef.current.scrollWidth,
        vpW: window.innerWidth,
        cardW,
        gap: Math.max(gap, 0),
        padLeft,
      };
    };

    measure();
    const t = setTimeout(measure, 200);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ── Scroll progress de la sección ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ── translateX horizontal — scroll vertical → movimiento horizontal ── */
  const x = useTransform(scrollYProgress, (p) => {
    const { trackW, vpW } = dims.current;
    if (vpW === 0) return 0;
    return -p * Math.max(0, trackW - vpW);
  });

  /* ── Índice del destino centrado (MotionValue) ── */
  const centeredIndex = useTransform(scrollYProgress, (p) => {
    const d = dims.current;
    if (d.vpW === 0 || d.cardW === 0) return 0;
    const maxScroll = Math.max(0, d.trackW - d.vpW);
    const currentX = -p * maxScroll;
    const vpCenter = d.vpW / 2;

    let closestIdx = 0;
    let closestDist = Infinity;

    for (let i = 0; i < DESTINATIONS.length; i++) {
      const cardLeft = d.padLeft + i * (d.cardW + d.gap);
      const cardCenter = cardLeft + d.cardW / 2 + currentX;
      const dist = Math.abs(cardCenter - vpCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }
    return closestIdx;
  });

  /* ── Actualizar activeIdx solo cuando cambia el destino centrado ── */
  useEffect(() => {
    const unsubscribe = centeredIndex.on("change", (idx) => {
      const rounded = Math.round(idx);
      if (
        rounded !== prevIdxRef.current &&
        rounded >= 0 &&
        rounded < DESTINATIONS.length
      ) {
        prevIdxRef.current = rounded;
        setActiveIdx(rounded);
      }
    });
    return unsubscribe;
  }, [centeredIndex]);

  const getDims = () => dims.current;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          DESKTOP — Galería scroll-driven horizontal
      ══════════════════════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="hz-desktop"
        aria-label="Destinos — Polinesia Francesa"
        style={{
          height: "400vh",
          position: "relative",
          backgroundColor: "#EEE8DF",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Línea decorativa superior ── */}
          <div
            aria-hidden="true"
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#2C365A",
              opacity: 0.08,
              flexShrink: 0,
            }}
          />

          {/* ── Header de sección — centrado arriba de las fotos ── */}
          <div
            style={{
              padding:
                "calc(72px + clamp(1rem, 2vh, 2.5rem)) clamp(2rem, 3vw, 3rem) clamp(1rem, 1.5vh, 2rem)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "clamp(0.5rem, 1vw, 0.8rem)",
              flexShrink: 0,
            }}
          >
            {/* Título grande — cambia con el destino centrado */}
            <div style={{ minHeight: "clamp(3rem, 7vw, 5.5rem)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily:
                      "var(--font-playfair), 'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 700,
                    fontSize: "clamp(2rem, 5vw, 4.5rem)",
                    color: "#2C365A",
                    lineHeight: 1.15,
                    letterSpacing: "-0.03em",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  {DESTINATIONS[activeIdx].name}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Track de imágenes horizontal ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <motion.div
              ref={trackRef}
              style={{
                x,
                display: "flex",
                gap: "clamp(8px, 1vw, 16px)",
                paddingLeft: "clamp(2rem, 3vw, 3rem)",
                paddingRight: "clamp(2rem, 3vw, 3rem)",
                willChange: "transform",
                position: "relative",
              }}
            >
              {DESTINATIONS.map((dest, i) => (
                <HorizontalCard
                  key={i}
                  destination={dest}
                  index={i}
                  scrollYProgress={scrollYProgress}
                  getDims={getDims}
                />
              ))}
            </motion.div>
          </div>

          {/* ── Línea decorativa inferior ── */}
          <div
            aria-hidden="true"
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#2C365A",
              opacity: 0.08,
              flexShrink: 0,
            }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MOBILE — Scroll horizontal nativo con snap
      ══════════════════════════════════════════════════════════ */}
      <section
        className="hz-mobile"
        aria-label="Destinos — Polinesia Francesa"
        style={{
          backgroundColor: "#EEE8DF",
          paddingTop: "clamp(3rem, 6vw, 5rem)",
          paddingBottom: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        {/* Track scrollable */}
        <div
          className="hz-mobile-track"
          style={{
            display: "flex",
            gap: "0.75rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {DESTINATIONS.map((dest, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: "80vw",
                aspectRatio: "3/2",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#C4BCB0",
                scrollSnapAlign: "center",
              }}
            >
              {/* Imagen */}
              <Image
                src={dest.src}
                alt={`${dest.name} — Polinesia Francesa`}
                fill
                quality={85}
                sizes="80vw"
                style={{ objectFit: "cover", zIndex: 2 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />

              {/* Placeholder */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "var(--font-playfair), 'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 600,
                    fontSize: "1.3rem",
                    color: "#2C365A",
                    opacity: 0.18,
                  }}
                >
                  {dest.name}
                </span>
              </div>

              {/* Contador mobile — siempre visible */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  right: "1rem",
                  zIndex: 10,
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "var(--font-jetbrains), 'Space Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    color: "#EEE8DF",
                    opacity: 0.45,
                    textShadow: "0 1px 4px rgba(44,54,90,0.5)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(DESTINATIONS.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Estilos responsivos ── */}
      <style>{`
        /* ── Tarjeta horizontal — desktop ── */
        .hz-card {
          flex-shrink: 0;
          width: 42vw;
          aspect-ratio: 3 / 2;
          position: relative;
          overflow: hidden;
          background-color: #C4BCB0;
          cursor: default;
        }

        @media (max-width: 1024px) and (min-width: 768px) {
          .hz-card {
            width: 55vw;
          }
        }

        /* ── Desktop / Mobile toggle ── */
        .hz-mobile {
          display: none;
        }
        .hz-desktop {
          display: block;
        }

        @media (max-width: 767px) {
          .hz-desktop {
            display: none !important;
          }
          .hz-mobile {
            display: block;
          }
        }

        /* ── Ocultar scrollbar en mobile ── */
        .hz-mobile-track {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hz-mobile-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
