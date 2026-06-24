"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════
   SocialsCarousel.tsx — Lemanjá

   Scroll-driven fan carousel — Lando Norris style.
   Highly refined responsive geometries & spring animations.
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

/* ── Single animated card ────────────────────── */
function FanCard({
  card,
  idx,
  fanProgress,
  hoveredIdx,
  onMouseEnter,
  onMouseLeave,
  cardW,
  cardH,
  rotStep,
  txStep,
  centerIdx,
  totalCards,
  hoverSpread,
  hoverRotExtra: hoverRotExtraMax,
  hoverLift,
  scaleHover,
  opacityDim,
}: {
  card: CardData;
  idx: number;
  fanProgress: MotionValue<number>;
  hoveredIdx: number | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  cardW: number;
  cardH: number;
  rotStep: number;
  txStep: number;
  centerIdx: number;
  totalCards: number;
  hoverSpread: number;
  hoverRotExtra: number;
  hoverLift: number;
  scaleHover: number;
  opacityDim: number;
}) {
  const isHovered = hoveredIdx === idx;
  const someoneHovered = hoveredIdx !== null;

  function getFanValues(i: number) {
    const offset = i - centerIdx;
    return {
      rotate: offset * rotStep,
      x: offset * txStep,
      zIndex: totalCards - Math.abs(offset),
    };
  }

  const fan = getFanValues(idx);

  /* Scroll-driven base transforms */
  const baseRotate = useTransform(fanProgress, [0, 1], [0, fan.rotate]);
  const baseX = useTransform(fanProgress, [0, 1], [0, fan.x]);

  /* Hover offsets */
  const spreadOffset = (() => {
    if (!someoneHovered || isHovered) return 0;
    const direction = idx < hoveredIdx! ? -1 : 1;
    return direction * hoverSpread;
  })();

  const rotationSpread = (() => {
    if (!someoneHovered || isHovered) return 0;
    const direction = idx < hoveredIdx! ? -1 : 1;
    return direction * hoverRotExtraMax;
  })();

  const targetOpacity = someoneHovered ? (isHovered ? 1.0 : opacityDim) : 1.0;

  /* Animated motion values for hover */
  const hoverScale = useMotionValue(1.0);
  const hoverSpreadX = useMotionValue(0);
  const hoverRotExtra = useMotionValue(0);
  const hoverLiftY = useMotionValue(0);
  const hoverOpacity = useMotionValue(1.0);

  useEffect(() => {
    const SPRING: any = { type: "spring", damping: 22, stiffness: 160, mass: 0.5 };
    const SPRING_SLOW: any = { type: "spring", damping: 25, stiffness: 120, mass: 0.6 };

    const controls = [
      animate(hoverScale.get(), isHovered ? scaleHover : 1.0, {
        ...SPRING,
        onUpdate: (latest) => hoverScale.set(latest),
      }),
      animate(hoverSpreadX.get(), spreadOffset, {
        ...SPRING_SLOW,
        onUpdate: (latest) => hoverSpreadX.set(latest),
      }),
      animate(hoverRotExtra.get(), rotationSpread, {
        ...SPRING_SLOW,
        onUpdate: (latest) => hoverRotExtra.set(latest),
      }),
      animate(hoverLiftY.get(), isHovered ? hoverLift : 0, {
        ...SPRING,
        onUpdate: (latest) => hoverLiftY.set(latest),
      }),
      animate(hoverOpacity.get(), targetOpacity, {
        duration: 0.25,
        ease: "easeInOut",
        onUpdate: (latest) => hoverOpacity.set(latest),
      }),
    ];

    return () => {
      controls.forEach((c) => c.stop());
    };
  }, [isHovered, someoneHovered, spreadOffset, rotationSpread, targetOpacity, scaleHover, hoverLift, opacityDim]);

  /* Combined base + hover transforms */
  const combinedRotate = useTransform(
    [baseRotate, hoverRotExtra],
    ([r, hr]) => (r as number) + (hr as number)
  );
  const combinedX = useTransform(
    [baseX, hoverSpreadX],
    ([tx, htx]) => (tx as number) + (htx as number)
  );

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fan-card"
      style={{
        position: "absolute",
        width: cardW,
        height: cardH,
        overflow: "hidden",
        cursor: "pointer",
        rotate: combinedRotate,
        x: combinedX,
        y: hoverLiftY,
        scale: hoverScale,
        opacity: hoverOpacity,
        zIndex: isHovered ? 100 : fan.zIndex,
        transformOrigin: "center bottom",
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
          priority={idx === centerIdx}
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
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Background: Deep Ocean → Cream */
  const bgColor = useTransform(scrollYProgress, [0, 0.38], [OCEAN, CREAM]);

  /* Fan opens between 5% – 55% */
  const fanProgress = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);

  /* Title reveal - Removed scroll-driven opacity to keep title present forever */

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

  /* Geometry & responsiveness configurations */
  const displayedCards = isMobile ? CARDS.slice(1, 6) : CARDS;
  const centerIdx = Math.floor(displayedCards.length / 2);

  const cardW = isMobile ? 200 : 280;
  const cardH = isMobile ? 320 : 440;
  const rotStep = isMobile ? 4 : 5; // Gentle arch (5 degrees on desktop, 4 on mobile)
  const txStep = isMobile ? 70 : 120; // Wider lateral spread (120px on desktop, 70px on mobile)

  const hoverSpread = isMobile ? 25 : 50;
  const hoverRotExtra = isMobile ? 2 : 4;
  const hoverLift = isMobile ? -12 : -22;
  const scaleHover = isMobile ? 1.10 : 1.14;
  const opacityDim = isMobile ? 0.70 : 0.65;

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
            opacity: 1, // Always visible
            y: 0,       // Always in position
            textAlign: "center",
            marginBottom: "clamp(1.5rem, 3.5vh, 3rem)",
            willChange: "transform, opacity",
            zIndex: 10,
          }}
        >
          {/* Camera icon */}
          <motion.div
            style={{ opacity: 1, marginBottom: "0.5rem" }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ margin: "0 auto", display: "block" }}
            >
              <path
                d="M5 14C5 12.343 6.343 11 8 11h3.5l2-4h13l2 4H35c1.657 0 3 1.343 3 3v16c0 1.657-1.343 3-3 3H8c-1.657 0-3-1.343-3-3V14z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: OCEAN }}
                className="opacity-45"
              />
              <circle
                cx="20"
                cy="22"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.6"
                style={{ color: OCEAN }}
                className="opacity-45"
              />
            </svg>
          </motion.div>



          {/* Line 1 — Bold */}
          <motion.h2
            style={{
              fontFamily:
                "var(--font-serif), 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)",
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
                "var(--font-serif), 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)",
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
            width: cardW,
            height: cardH,
            overflow: "visible",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          {mounted &&
            displayedCards.map((card, idx) => (
              <FanCard
                key={card.src}
                card={card}
                idx={idx}
                fanProgress={fanProgress}
                hoveredIdx={hoveredIdx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                cardW={cardW}
                cardH={cardH}
                rotStep={rotStep}
                txStep={txStep}
                centerIdx={centerIdx}
                totalCards={displayedCards.length}
                hoverSpread={hoverSpread}
                hoverRotExtra={hoverRotExtra}
                hoverLift={hoverLift}
                scaleHover={scaleHover}
                opacityDim={opacityDim}
              />
            ))}
        </div>
      </div>
    </motion.section>
  );
}
