"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════
   SocialsCarousel.tsx — Lemanjá

   Scroll-driven fan carousel — Lando Norris style.

   Card dimensions: 300 × 500 px (ratio 3:5 portrait)
   Border-radius: 28px (well-rounded corners)

   Hover mechanics (key — replicates Tailwind group-hover pattern):
   - When ANY card is hovered, ALL other cards:
     • shift outward (left cards push left, right cards push right)
     • dim to 75% opacity
   - The hovered card:
     • scales up ~8% from origin-bottom
     • stays at 100% opacity
     • gets z-index boost
   ═══════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────── */
const OCEAN = "#2C365A";
const CREAM = "#EEE8DF";
const BEIGE = "#C4BCB0";

/* ── Card data ───────────────────────────────── */
interface CardData {
  src: string;
  alt: string;
}

const CARDS: CardData[] = [
  { src: "/1.jpg", alt: "Océano azul — Lemanjá" },
  { src: "/2.jpg", alt: "Mar en calma — Lemanjá" },
  { src: "/3.jpg", alt: "Olas al amanecer — Lemanjá" },
  { src: "/5.jpg", alt: "Espuma de ola — Lemanjá" },
  { src: "/6.jpg", alt: "Horizonte marino — Lemanjá" },
  { src: "/7.jpg", alt: "Playa vacía — Lemanjá" },
  { src: "/8.jpg", alt: "Luz sobre el agua — Lemanjá" },
];

/* ── Card dimensions ─────────────────────────── */
const CARD_W = 300;
const CARD_H = 500;
const CARD_RADIUS = 28; // well-rounded

/* ── Fan geometry ────────────────────────────── */
const CENTER   = 3;
const ROT_STEP = 8;    // degrees per step — subtle
const TX_STEP  = 105;  // px lateral per step

/* How far neighbouring cards push apart on hover */
const HOVER_SPREAD = 18; // px per step of distance from hovered card

function getFanValues(idx: number) {
  const offset = idx - CENTER;
  return {
    rotate: offset * ROT_STEP,
    x: offset * TX_STEP,
    zIndex: CARDS.length - Math.abs(offset),
  };
}

/* ── Single animated card ────────────────────── */
function FanCard({
  card,
  idx,
  fanProgress,
  hoveredIdx,
  onMouseEnter,
  onMouseLeave,
}: {
  card: CardData;
  idx: number;
  fanProgress: MotionValue<number>;
  hoveredIdx: number | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const fan = getFanValues(idx);
  const isHovered = hoveredIdx === idx;
  const someoneHovered = hoveredIdx !== null;

  /* Scroll-driven: stacked → fanned */
  const rotate = useTransform(fanProgress, [0, 1], [0, fan.rotate]);
  const x = useTransform(fanProgress, [0, 1], [0, fan.x]);

  /*
   * Hover spread: when a card is hovered, other cards push outward.
   * Cards to the left of the hovered card shift LEFT (negative),
   * cards to the right shift RIGHT (positive).
   * The hovered card itself stays in place.
   */
  const spreadOffset = (() => {
    if (!someoneHovered || isHovered) return 0;
    const direction = idx < hoveredIdx! ? -1 : 1;
    const distance = Math.abs(idx - hoveredIdx!);
    return direction * HOVER_SPREAD * distance;
  })();

  /*
   * Opacity: group-hover pattern
   * All cards dim to 75% when someone is hovered,
   * only the hovered card stays at 100%.
   */
  const targetOpacity = someoneHovered ? (isHovered ? 1.0 : 0.75) : 1.0;

  /*
   * Scale: hovered card grows ~8% from origin-bottom.
   * Very slow spring for organic feel.
   */
  const SPRING = { damping: 45, stiffness: 55, mass: 1.4 };

  const hoverScale = useSpring(isHovered ? 1.08 : 1.0, SPRING);
  const hoverSpreadX = useSpring(spreadOffset, SPRING);
  const hoverOpacity = useSpring(targetOpacity, { damping: 40, stiffness: 80 });

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        borderRadius: CARD_RADIUS,
        overflow: "hidden",
        cursor: "pointer",
        rotate,
        x,
        translateX: hoverSpreadX,
        scale: hoverScale,
        opacity: hoverOpacity,
        zIndex: isHovered ? 100 : fan.zIndex,
        transformOrigin: "center bottom", // scale grows from base
        willChange: "transform, opacity",
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Image
          src={card.src}
          alt={card.alt}
          fill
          sizes="(max-width: 768px) 85vw, 300px"
          quality={90}
          style={{ objectFit: "cover" }}
        />

        {/* Subtle vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(44,54,90,0.30) 0%, transparent 45%)",
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Main section ────────────────────────────── */
export default function SocialsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Background: Deep Ocean → Cream */
  const bgColor = useTransform(scrollYProgress, [0, 0.38], [OCEAN, CREAM]);

  /* Fan opens between 5% – 55% */
  const fanProgress = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);

  /* Title reveal */
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.20], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.0, 0.20], [36, 0]);
  const iconOpacity = useTransform(scrollYProgress, [0.0, 0.16], [0, 1]);

  /* Title colour: cream → ocean as bg lightens */
  const titleColor = useTransform(
    scrollYProgress,
    [0.04, 0.36],
    [CREAM, OCEAN]
  );
  const subtitleColor = useTransform(
    scrollYProgress,
    [0.04, 0.36],
    ["rgba(238,232,223,0.72)", BEIGE]
  );

  /* Bottom label */
  const captionOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.50],
    [0, 0.45]
  );
  const captionY = useTransform(scrollYProgress, [0.32, 0.50], [14, 0]);
  const captionColor = useTransform(
    scrollYProgress,
    [0.04, 0.38],
    [BEIGE, OCEAN]
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "320vh",
        backgroundColor: bgColor,
      }}
    >
      {/* ── Sticky viewport ─────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* ── Title ────────────────────── */}
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
            textAlign: "center",
            marginBottom: "clamp(1.2rem, 2.5vh, 2rem)",
            willChange: "transform, opacity",
            zIndex: 10,
          }}
        >
          {/* Camera icon */}
          <motion.div
            style={{ opacity: iconOpacity, marginBottom: "0.5rem" }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ margin: "0 auto", display: "block" }}
            >
              <path
                d="M5 14C5 12.343 6.343 11 8 11h3.5l2-4h13l2 4H35c1.657 0 3 1.343 3 3v16c0 1.657-1.343 3-3 3H8c-1.657 0-3-1.343-3-3V14z"
                stroke={OCEAN}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.45}
              />
              <circle
                cx="20"
                cy="22"
                r="5.5"
                stroke={OCEAN}
                strokeWidth="1.4"
                opacity={0.45}
              />
            </svg>
          </motion.div>

          {/* Line 1 — Bold */}
          <motion.h2
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 3.2vw, 3.2rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: titleColor,
              margin: 0,
            }}
          >
            El mar en
          </motion.h2>

          {/* Line 2 — Regular, recessed */}
          <motion.h2
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 3.2vw, 3.2rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: subtitleColor,
              margin: 0,
            }}
          >
            cada instante
          </motion.h2>
        </motion.div>

        {/* ── Fan deck ─────────────────── */}
        <div
          style={{
            position: "relative",
            width: CARD_W,
            height: CARD_H,
            overflow: "visible",
            flexShrink: 0,
          }}
        >
          {CARDS.map((card, idx) => (
            <FanCard
              key={card.src}
              card={card}
              idx={idx}
              fanProgress={fanProgress}
              hoveredIdx={hoveredIdx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </div>

        {/* ── Bottom label ─────────────── */}
        <motion.p
          style={{
            opacity: captionOpacity,
            y: captionY,
            color: captionColor,
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginTop: "clamp(1.2rem, 2.5vh, 2rem)",
            willChange: "transform, opacity",
            zIndex: 10,
          }}
        >
          Fotografía de mar — Lemanjá
        </motion.p>
      </div>
    </motion.section>
  );
}
