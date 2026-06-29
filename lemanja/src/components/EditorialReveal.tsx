"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════
   EditorialReveal.tsx — Lemanjá

   High-impact editorial section: "Scattered to Stacked" cinematic
   scroll animation + brutalist typography with blur reveal.
   
   Style-guide Compliance:
   - Palette: Deep Ocean (#2C365A) background, Cream (#EEE8DF) and Beige (#C4BCB0) text
   - Typography: Playfair Display Italic (Title) and JetBrains Mono (Description)
   - Layout: Rectangular borders, fine dividers, no border-radius.
   ═══════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────── */
const PALETTE = {
  bg:     "#2C365A", // Deep Ocean
  light:  "#EEE8DF", // Cream
  muted:  "#C4BCB0", // Beige
} as const;

/* ── Scroll Keyframes (progress 0→1) ─────────── */
const KEYFRAMES = {
  stack:        [0.0, 0.45],  // Images fly in from scattered positions
  wordReveal:   [0.45, 0.85], // Text reveals after stack
  colorDelay:   0.03,
  colorDur:     0.06,
  description:  [0.75, 0.95],
  decorLine:    [0.40, 0.50],
};

const STACK_IMAGES = ["/18.jpg", "/15.jpg", "/12.jpg"];

const SCATTER_STATES = [
  { x: "12vw", y: "-22vh", rotate: -14, scale: 1.15 }, // Image 0 (Bottom)
  { x: "35vw", y: "15vh",  rotate: 18,  scale: 0.9  }, // Image 1 (Middle)
  { x: "18vw", y: "45vh",  rotate: -8,  scale: 1.05 }, // Image 2 (Top)
];

/* ── Title Config ────────────────────────────── */
interface WordData {
  text: string;
  bold: boolean;
  idx: number;
}

interface LineConfig {
  indent?: string;
  words: WordData[];
}

const TITLE: LineConfig[] = (() => {
  const raw = [
    { texts: ["DONDE"],              bolds: [] as number[], indent: "12%" },
    { texts: ["EL", "MAR", "ESCRIBE"], bolds: [2]                          },
    { texts: ["SU", "MEMORIA"],       bolds: [0, 1]                        },
  ];

  let gi = 0;
  return raw.map((line) => ({
    indent: line.indent,
    words: line.texts.map((t, i) => ({
      text: t,
      bold: line.bolds.includes(i),
      idx: gi++,
    })),
  }));
})();

const WORD_COUNT = TITLE.reduce((sum, l) => sum + l.words.length, 0);

/* ── AnimatedWord (Desktop Scroll-driven) ────── */
function AnimatedWord({
  data,
  progress,
}: {
  data: WordData;
  progress: MotionValue<number>;
}) {
  const [rS, rE] = KEYFRAMES.wordReveal;
  const seg = (rE - rS) / WORD_COUNT;
  const s = rS + data.idx * seg * 0.8;
  const e = Math.min(s + seg * 1.5, rE);

  /* Cinematic Blur & Slide Reveal */
  const y = useTransform(progress, [s, e], ["-110%", "0%"]);
  const blurVal = useTransform(progress, [s, e], [16, 0]);
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`);

  /* Color transition within palette */
  const cS = e + KEYFRAMES.colorDelay;
  const cE = cS + KEYFRAMES.colorDur;
  const final = data.bold ? PALETTE.light : PALETTE.muted;
  const startColor = data.bold ? `${PALETTE.light}3d` : `${PALETTE.muted}3d`; // 24% opacity
  const color = useTransform(progress, [s, cS, cE], [startColor, startColor, final]);

  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden", // clips the slide-down
        verticalAlign: "top",
        padding: "0.06em 0",
        // Override globals.css span rules
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
        fontStyle: "inherit",
        letterSpacing: "inherit",
        lineHeight: "inherit",
        color: "inherit",
      }}
    >
      <motion.span
        style={{
          display: "inline-block",
          y,
          color,
          filter,
          fontWeight: data.bold ? 700 : 400,
          willChange: "transform, color, filter",
          // Override globals.css span rules
          fontFamily: "inherit",
          fontSize: "inherit",
          fontStyle: "inherit",
          letterSpacing: "inherit",
          lineHeight: "inherit",
        }}
      >
        {data.text}
      </motion.span>
    </span>
  );
}

/* ── StackImage Component ────────────────────── */
function StackImage({ index, progress, src }: { index: number, progress: MotionValue<number>, src: string }) {
  const state = SCATTER_STATES[index];
  
  // Transform from scattered chaotic state to perfectly stacked (0,0,0,1)
  const x = useTransform(progress, KEYFRAMES.stack, [state.x, "0vw"]);
  const y = useTransform(progress, KEYFRAMES.stack, [state.y, "0vh"]);
  const rotate = useTransform(progress, KEYFRAMES.stack, [state.rotate, 0]);
  const scale = useTransform(progress, KEYFRAMES.stack, [state.scale, 1]);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        x,
        y,
        rotate,
        scale,
        willChange: "transform",
        backgroundColor: PALETTE.muted,
        border: `4px solid ${PALETTE.light}`, // Polaroid style border
        boxShadow: "none",
      }}
    >
      <Image
        src={src}
        alt={`Océano — Lemanjá ${index + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 30vw"
        quality={85}
        priority={index === 0}
        style={{ objectFit: "cover" }}
      />
    </motion.div>
  );
}

export default function EditorialReveal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* ── Desktop Motion Mappings ── */
  const descOp = useTransform(p, KEYFRAMES.description, [0, 1]);
  const descY = useTransform(p, KEYFRAMES.description, [25, 0]);
  const lineOp = useTransform(p, KEYFRAMES.decorLine, [0, 0.45]);

  /* ── Mobile Motion Variants ── */
  const mobileWordVariants = {
    hidden: { 
      y: "-110%",
      filter: "blur(12px)",
      opacity: 0.24,
    },
    visible: {
      y: "0%",
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  } as const;

  return (
    <section
      ref={ref}
      className="editorial-section"
      style={{
        position: "relative",
        backgroundColor: PALETTE.bg,
      }}
    >
      {/* Top divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: `${PALETTE.muted}22`,
          zIndex: 10,
        }}
      />

      {/* ── Sticky viewport ── */}
      <div className="editorial-sticky">
        
        {/* ══════════════════════════════════════════════════════════
            DESKTOP LAYOUT (Sticky, Scroll-driven)
            ══════════════════════════════════════════════════════════ */}
        <div className="editorial-desktop-container" style={{ paddingTop: "6vh" }}>
          
          {/* Image Stack Column */}
          <div
            style={{
              width: "48%",
              height: "80vh",
              position: "relative",
              flexShrink: 0,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Centered Anchor Container for Cards */}
            <div style={{ position: "relative", width: "60%", aspectRatio: "3/4" }}>
              {STACK_IMAGES.map((src, index) => (
                <StackImage key={index} index={index} progress={p} src={src} />
              ))}
            </div>
          </div>

          {/* Typography / Content Column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "4%",
              paddingRight: "2%",
              zIndex: 2, // Texts stay below the scattered images initially
            }}
          >
            {/* Top decorative line */}
            <motion.div
              style={{
                width: 52,
                height: 1,
                backgroundColor: PALETTE.light,
                opacity: lineOp,
                marginBottom: "clamp(1.5rem, 2.5vw, 3rem)",
              }}
            />

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(3.5rem, 6.2vw, 7.5rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                margin: 0,
                color: PALETTE.light,
              }}
            >
              {TITLE.map((line, li) => (
                <span
                  key={li}
                  style={{
                    display: "block",
                    paddingLeft: line.indent ?? 0,
                    marginBottom: li < TITLE.length - 1 ? "0.06em" : 0,
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    fontStyle: "inherit",
                    letterSpacing: "inherit",
                    lineHeight: "inherit",
                    color: "inherit",
                  }}
                >
                  {line.words.map((w, wi) => (
                    <span
                      key={w.idx}
                      style={{
                        display: "inline-block",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        fontWeight: "inherit",
                        fontStyle: "inherit",
                        letterSpacing: "inherit",
                        lineHeight: "inherit",
                        color: "inherit",
                      }}
                    >
                      <AnimatedWord data={w} progress={p} />
                      {wi < line.words.length - 1 && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "0.22em",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            fontWeight: "inherit",
                            fontStyle: "inherit",
                          }}
                        />
                      )}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            {/* Description */}
            <motion.p
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(1.05rem, 1.35vw, 1.5rem)",
                lineHeight: 1.6,
                color: PALETTE.muted,
                opacity: descOp,
                y: descY,
                marginTop: "clamp(1.8rem, 3vw, 3rem)",
                maxWidth: "85%",
                letterSpacing: "-0.01em",
                willChange: "transform, opacity",
              }}
            >
              Cada imagen captura un fragmento de lo infinito —
              espuma, horizonte y silencio. Un archivo visual donde
              el océano escribe su propia historia, libre de tiempo.
            </motion.p>

            {/* Bottom decorative line */}
            <motion.div
              style={{
                width: 28,
                height: 1,
                backgroundColor: PALETTE.light,
                opacity: useTransform(
                  p,
                  [KEYFRAMES.description[1], KEYFRAMES.description[1] + 0.04],
                  [0, 0.3]
                ),
                marginTop: "clamp(1.5rem, 2.5vw, 2.5rem)",
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            MOBILE LAYOUT (Sequential reveal)
            ══════════════════════════════════════════════════════════ */}
        <div className="editorial-mobile-container">
          
          {/* Mobile Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/5",
              marginBottom: "2.5rem",
            }}
          >
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)", filter: "blur(10px)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)", filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor: PALETTE.muted,
              }}
            >
              <motion.div
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                <Image
                  src={STACK_IMAGES[2]} 
                  alt="Océano — Lemanjá"
                  fill
                  sizes="90vw"
                  quality={85}
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Text Content */}
          <div>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              transition={{ staggerChildren: 0.08 }}
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 8vw, 3.2rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                margin: 0,
                color: PALETTE.light,
              }}
            >
              {TITLE.map((line, li) => (
                <span
                  key={li}
                  style={{
                    display: "block",
                    paddingLeft: line.indent ? "8%" : 0,
                    marginBottom: "0.1em",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    fontStyle: "inherit",
                    color: "inherit",
                  }}
                >
                  {line.words.map((w, wi) => (
                    <span
                      key={w.idx}
                      style={{
                        display: "inline-block",
                        marginRight: "0.22em",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        fontWeight: "inherit",
                        fontStyle: "inherit",
                        color: "inherit",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          overflow: "hidden",
                          verticalAlign: "top",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          fontWeight: "inherit",
                          fontStyle: "inherit",
                          color: "inherit",
                        }}
                      >
                        <motion.span
                          variants={mobileWordVariants}
                          style={{
                            display: "inline-block",
                            fontWeight: w.bold ? 700 : 400,
                            color: w.bold ? PALETTE.light : PALETTE.muted,
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            fontStyle: "inherit",
                          }}
                        >
                          {w.text}
                        </motion.span>
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </motion.h2>

            {/* Mobile Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 0.85, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(0.95rem, 4.5vw, 1.15rem)",
                lineHeight: 1.6,
                color: PALETTE.muted,
                marginTop: "1.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              Cada imagen captura un fragmento de lo infinito —
              espuma, horizonte y silencio. Un archivo visual donde
              el océano escribe su propia historia, libre de tiempo.
            </motion.p>
          </div>
        </div>

      </div>

      {/* ── Responsive styling block ── */}
      <style>{`
        .editorial-section {
          /* Increased height to accommodate the stacking and text reveal */
          height: 450vh;
        }
        .editorial-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .editorial-desktop-container {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 0 3.5%;
          gap: 4.5%;
        }
        .editorial-mobile-container {
          display: none;
        }

        @media (max-width: 767px) {
          .editorial-section {
            height: auto !important;
          }
          .editorial-sticky {
            position: relative !important;
            height: auto !important;
            top: auto !important;
            display: block !important;
          }
          .editorial-desktop-container {
            display: none !important;
          }
          .editorial-mobile-container {
            display: block !important;
            padding: 4.5rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}

