"use client";

/**
 * GallerySection.tsx — Lemanjá
 *
 * Layout edge-to-edge inspirado en Odd Ritual.
 * Dimensiones reales de las imágenes:
 *   gallery-1.jpg → 1920×2880  (2:3  portrait)
 *   gallery-2.jpg → 1920×1080  (16:9 landscape)
 *   gallery-3.jpg → 1920×2483  (≈4:5 portrait)
 *
 * Hover effect:
 *   - Imagen se atenúa levemente (opacity 1 → 0.72)
 *   - Aparece frase izquierda + frase derecha superpuestas
 *   - El Y de las frases sigue el cursor dentro de la foto (DOM directo, sin re-render)
 */

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";

/* ─────────────────────────────────────────────
   Variantes de reveal (scroll-driven)
───────────────────────────────────────────── */
const wrapperVariants: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

const imageVariants: Variants = {
  hidden: { scale: 1.1 },
  visible: {
    scale: 1.0,
    transition: { duration: 1.35, ease: [0.16, 1, 0.3, 1] },
  },
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

/* ─────────────────────────────────────────────
   Props del item individual
───────────────────────────────────────────── */
interface GalleryItemProps {
  src: string;
  alt: string;
  /** Etiqueta superior — ahora en Playfair Display */
  label: string;
  labelDelay: number;
  revealDelay: number;
  /** Relación de aspecto CSS (ej. "2/3", "16/9", "4/5") */
  aspectRatio: string;
  /** Frase que aparece a la izquierda al hacer hover */
  phraseLeft: string;
  /** Frase que aparece a la derecha al hacer hover */
  phraseRight: string;
}

/* ─────────────────────────────────────────────
   GalleryItem
───────────────────────────────────────────── */
function GalleryItem({
  src,
  alt,
  label,
  labelDelay,
  revealDelay,
  aspectRatio,
  phraseLeft,
  phraseRight,
}: GalleryItemProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  /* Refs para mover los textos en DOM directo (sin re-render) */
  const phraseLeftRef  = useRef<HTMLSpanElement>(null);
  const phraseRightRef = useRef<HTMLSpanElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  /* Scroll reveal */
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-8% 0px" });
  const wrapperCtrl = useAnimation();
  const imageCtrl   = useAnimation();
  const labelCtrl   = useAnimation();

  useEffect(() => {
    if (!isInView) return;
    labelCtrl.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: labelDelay },
    });
    const t = setTimeout(() => {
      wrapperCtrl.start("visible");
      imageCtrl.start("visible");
    }, revealDelay * 1000);
    return () => clearTimeout(t);
  }, [isInView, labelCtrl, wrapperCtrl, imageCtrl, labelDelay, revealDelay]);

  /* ── Mouse tracking — actualiza DOM directo para máxima fluidez ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const rawY  = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedY = Math.min(Math.max(rawY, 6), 94);
    if (phraseLeftRef.current)  phraseLeftRef.current.style.top  = `${clampedY}%`;
    if (phraseRightRef.current) phraseRightRef.current.style.top = `${clampedY}%`;
  };

  return (
    <div ref={sectionRef} style={{ display: "flex", flexDirection: "column", gap: "0.6rem", width: "100%" }}>

      {/* ── Etiqueta — Playfair Display Italic, Deep Ocean ── */}
      <motion.div
        variants={labelVariants}
        initial="hidden"
        animate={labelCtrl}
      >
        <span
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "clamp(0.85rem, 1.1vw, 1.05rem)",
            letterSpacing: "0.04em",
            color: "#2C365A",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      </motion.div>

      {/* ── Contenedor de imagen con reveal + hover ── */}
      <motion.div
        variants={wrapperVariants}
        initial="hidden"
        animate={wrapperCtrl}
        ref={imgContainerRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          overflow: "hidden",
          position: "relative",
          width: "100%",
          aspectRatio,
          backgroundColor: "#C4BCB0",
          cursor: "default",
        }}
      >
        {/* Imagen */}
        {!imgError ? (
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={imageCtrl}
            style={{
              position: "absolute",
              inset: "-6%",
              width: "112%",
              height: "112%",
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              quality={92}
              sizes="(max-width: 640px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              onError={() => setImgError(true)}
            />
          </motion.div>
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#2C365A", opacity: 0.3 }}>
              {src}
            </span>
          </div>
        )}

        {/* ── Overlay oscuro sutil — aparece al hover ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            backgroundColor: "rgba(20, 25, 42, 0.28)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        />

        {/* ── Frase izquierda — sigue cursor en Y ── */}
        <span
          ref={phraseLeftRef}
          style={{
            position: "absolute",
            left: "clamp(0.75rem, 1.5vw, 1.25rem)",
            zIndex: 11,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(0.7rem, 1vw, 0.9rem)",
            color: "#EEE8DF",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
            textShadow: "0 1px 8px rgba(44,54,90,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {phraseLeft}
        </span>

        {/* ── Frase derecha — sigue cursor en Y ── */}
        <span
          ref={phraseRightRef}
          style={{
            position: "absolute",
            right: "clamp(0.75rem, 1.5vw, 1.25rem)",
            zIndex: 11,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
            fontFamily: "var(--font-jetbrains), 'Space Mono', monospace",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "clamp(0.6rem, 0.85vw, 0.75rem)",
            color: "#EEE8DF",
            letterSpacing: "0.18em",
            lineHeight: 1.2,
            textTransform: "uppercase",
            textShadow: "0 1px 8px rgba(44,54,90,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {phraseRight}
        </span>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GALERÍA PRINCIPAL
───────────────────────────────────────────── */
export default function GallerySection() {
  return (
    <section
      aria-label="Galería — El mar en tres miradas"
      style={{
        backgroundColor: "#EEE8DF",
        width: "100%",
        paddingLeft:   "clamp(0.75rem, 1.5vw, 1.5rem)",
        paddingRight:  "clamp(0.75rem, 1.5vw, 1.5rem)",
        paddingTop:    "clamp(1.5rem, 3vw, 2.5rem)",
        paddingBottom: "clamp(3rem, 5vw, 5rem)",
      }}
    >
      {/*
        Grid 3 columnas con proporciones Odd Ritual: 47fr / 23fr / 27fr
        Cada imagen tiene su aspect-ratio real → no hay crop vertical,
        el scroll cubre la altura extra si la necesita.
      */}
      <div
        className="gallery-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "47fr 23fr 27fr",
          gap: "clamp(10px, 1.2vw, 18px)",
          alignItems: "start",
          maxWidth: "100%",
        }}
      >
        {/* ── Col 1: 2:3 portrait (waterfall) ── */}
        <GalleryItem
          src="/gallery-1.jpg"
          alt="El mar — Lemanjá, fotografía de olas y agua"
          label="El Mar"
          labelDelay={0}
          revealDelay={0.05}
          aspectRatio="2/3"
          phraseLeft="el agua que espera"
          phraseRight="[ explorar ]"
        />

        {/* ── Col 2: mostrada en 3/4 portrait (object-fit: cover centra el frame) ── */}
        <div style={{ paddingTop: "clamp(0px, 0.5vw, 0.5rem)" }}>
          <GalleryItem
            src="/gallery-2.jpg"
            alt="La corriente — Lemanjá, fotografía de paisaje marino"
            label="La Corriente"
            labelDelay={0.1}
            revealDelay={0.2}
            aspectRatio="3/4"
            phraseLeft="entre montañas"
            phraseRight="[ ver más ]"
          />
        </div>

        {/* ── Col 3: 4:5 portrait (beach couple) ── */}
        <div style={{ paddingTop: "clamp(0px, 0.3vw, 0.3rem)" }}>
          <GalleryItem
            src="/gallery-3.jpg"
            alt="La profundidad — Lemanjá, fotografía del océano"
            label="La Profundidad"
            labelDelay={0.18}
            revealDelay={0.32}
            aspectRatio="4/5"
            phraseLeft="la marea llama"
            phraseRight="[ descubrir ]"
          />
        </div>
      </div>

      {/* Mobile: apilado vertical */}
      <style>{`
        @media (max-width: 640px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .gallery-grid > div {
            padding-top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
