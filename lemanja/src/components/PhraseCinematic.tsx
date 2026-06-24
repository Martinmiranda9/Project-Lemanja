"use client";

/**
 * PhraseCinematic.tsx — Lemanjá
 *
 * Sección tipográfica de impacto post-galería.
 *   Replica la técnica de EditorialReveal (caída desde arriba):
 *
 *   Estructura DOM por palabra:
 *     <span style="overflow:hidden; display:inline-flex">   ← mask
 *       <motion.span style="translateY(-110% → 0%)">       ← fall down
 *         Palabra
 *       </motion.span>
 *     </span>
 *
 *   La palabra empieza desplazada -110% arriba (fuera del mask)
 *   y cae a 0% al scrollear. Cada palabra con stagger.
 *
 * Layout de cuadrantes:
 *   ┌──────────────┬──────────────┐
 *   │  "Donde      │              │
 *   │   termina    │              │
 *   │   la tierra" │              │
 *   ├──────────────┼──────────────┤
 *   │              │  "empieza    │
 *   │              │   la         │
 *   │              │   libertad." │
 *   └──────────────┴──────────────┘
 *
 * Color: ghost (24% opacidad del color final) → color final al aterrizar.
 *
 * Style-guide compliance:
 *   - Playfair Display Italic Bold (700)
 *   - Paleta Organic Marine exclusivamente
 *   - Sin negro puro, sin sombras, esquinas rectas
 */

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────────
   Frase — estructura línea a línea
───────────────────────────────────────────── */
const PHRASE_TOP: string[][] = [
  ["Donde", "termina"],
  ["la", "tierra"],
];

const PHRASE_BOTTOM: string[][] = [
  ["empieza", "la"],
  ["libertad."],
];

/* ─────────────────────────────────────────────
   Pre-cómputo de metadata de palabras
───────────────────────────────────────────── */
type WordEntry = { word: string; lineIdx: number; globalIdx: number };

function buildEntries(lines: string[][], offset: number): WordEntry[] {
  return lines.flatMap((line, li) =>
    line.map((word, wi) => ({
      word,
      lineIdx: li,
      globalIdx: offset + lines.slice(0, li).flat().length + wi,
    }))
  );
}

const TOP_ENTRIES    = buildEntries(PHRASE_TOP, 0);
const BOTTOM_ENTRIES = buildEntries(PHRASE_BOTTOM, PHRASE_TOP.flat().length);
const TOTAL_WORDS    = TOP_ENTRIES.length + BOTTOM_ENTRIES.length; // 7

/* Timing del scroll — alineado con EditorialReveal */
const REVEAL_START = 0.08;
const REVEAL_END   = 0.50;
const COLOR_DELAY  = 0.04;
const COLOR_DUR    = 0.08;

/* ─────────────────────────────────────────────
   AnimatedWord — Técnica EditorialReveal
   overflow:hidden container + translateY(-110% → 0%)
   La palabra cae desde arriba del mask al scrollear.
───────────────────────────────────────────── */
function AnimatedWord({
  word,
  globalIndex,
  scrollYProgress,
}: {
  word: string;
  globalIndex: number;
  scrollYProgress: MotionValue<number>;
}) {
  const span    = REVEAL_END - REVEAL_START;
  const seg     = span / TOTAL_WORDS;
  const s       = REVEAL_START + globalIndex * seg * 0.8;
  const e       = Math.min(s + seg * 1.5, REVEAL_END);

  /* translateY: -110% (oculto arriba del mask) → 0% (posición final) */
  const y = useTransform(
    scrollYProgress,
    [s, e],
    ["-110%", "0%"]
  );

  /* Color: ghost (24% opacidad) → color final post-aterrizaje */
  const cS = e + COLOR_DELAY;
  const cE = cS + COLOR_DUR;
  const color = useTransform(
    scrollYProgress,
    [s, cS, cE],
    ["#EEE8DF3d", "#EEE8DF3d", "#EEE8DF"]
  );

  return (
    /* Outer span = mask con overflow:hidden */
    <span
      style={{
        display: "inline-flex",
        overflow: "hidden",
        verticalAlign: "top",
        padding: "0.06em 0", /* espacio simétrico para caída desde arriba */
        marginRight: "0.22em",
        /* Override globals.css span rules */
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
        fontStyle: "inherit",
        letterSpacing: "inherit",
        lineHeight: "inherit",
        color: "inherit",
      }}
    >
      {/* Inner motion.span = la palabra que se traslada */}
      <motion.span
        style={{
          display: "inline-block",
          y,
          color,
          willChange: "transform, color",
          /* Override globals.css span rules */
          fontFamily: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
          fontStyle: "inherit",
          letterSpacing: "inherit",
          lineHeight: "inherit",
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   PhraseLines — agrupa palabras por línea
───────────────────────────────────────────── */
function PhraseLines({
  entries,
  scrollYProgress,
}: {
  entries: WordEntry[];
  scrollYProgress: MotionValue<number>;
}) {
  const lines = entries.reduce<WordEntry[][]>((acc, entry) => {
    if (!acc[entry.lineIdx]) acc[entry.lineIdx] = [];
    acc[entry.lineIdx].push(entry);
    return acc;
  }, []);

  return (
    <>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "block",
            lineHeight: 0.95,
            marginBottom: li < lines.length - 1 ? "0.08em" : 0,
          }}
        >
          {line.map(({ word, globalIdx }) => (
            <AnimatedWord
              key={globalIdx}
              word={word}
              globalIndex={globalIdx}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   PhraseCinematic — componente principal
───────────────────────────────────────────── */
export default function PhraseCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /*
    Tipografía: Playfair Display Italic Bold 700
    Tamaño grande estilo composites.archi.
    Desktop ~11rem, mobile ~3rem.
  */
  const typo: React.CSSProperties = {
    fontFamily:
      "var(--font-playfair), 'Playfair Display', 'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontWeight: 700,
    fontSize: "clamp(3rem, 9vw, 11rem)",
    letterSpacing: "-0.03em",
    lineHeight: 0.95,
  };

  return (
    <section
      ref={containerRef}
      aria-label="Donde termina la tierra, empieza la libertad"
      style={{
        height: "250vh",
        position: "relative",
      }}
    >
      {/* ── Panel sticky ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >

        {/* ── Video de fondo ── */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 40%",
            display: "block",
            border: "none",
            outline: "none",
            zIndex: 0,
          }}
        >
          <source src="/video_wave.mp4" type="video/mp4" />
        </video>

        {/* ── Overlay Deep Ocean ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(44, 54, 90, 0.52)",
            zIndex: 1,
          }}
        />

        {/* ── CUADRANTE 1: superior izquierdo ── */}
        <div
          style={{
            position: "absolute",
            top: "5vh",
            left: "4vw",
            maxWidth: "55vw",
            zIndex: 2,
            ...typo,
          }}
        >
          <PhraseLines
            entries={TOP_ENTRIES}
            scrollYProgress={scrollYProgress}
          />
        </div>

        {/* ── CUADRANTE 4: inferior derecho ── */}
        <div
          style={{
            position: "absolute",
            bottom: "5vh",
            right: "4vw",
            maxWidth: "55vw",
            zIndex: 2,
            textAlign: "right",
            ...typo,
          }}
        >
          <PhraseLines
            entries={BOTTOM_ENTRIES}
            scrollYProgress={scrollYProgress}
          />
        </div>

        {/* ── Línea decorativa superior ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "rgba(238, 232, 223, 0.18)",
            zIndex: 3,
          }}
        />
      </div>
    </section>
  );
}
