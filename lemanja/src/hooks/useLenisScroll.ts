"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, MotionValue } from "framer-motion";

/**
 * useLenisScroll — Hook para sincronizar Framer Motion con Lenis
 *
 * Retorna un MotionValue que se actualiza en tiempo real con el
 * progreso del scroll de Lenis. Permite conectar useTransform()
 * de Framer Motion para efectos parallax, fade, etc.
 *
 * Uso:
 *   const scrollY = useLenisScroll();
 *   const y = useTransform(scrollY, [0, 1000], [0, -100]);
 *
 * Compatible con:
 * - Lenis 1.3.x
 * - Framer Motion 12.x
 * - React 19
 */
export function useLenisScroll() {
  const scrollY = useMotionValue(0);

  useEffect(() => {
    type WindowWithLenis = {
      lenis?: {
        on: (event: string, cb: (e: { scroll: number }) => void) => void;
        off: (event: string, cb: (e: { scroll: number }) => void) => void;
      };
    };

    const lenis = (window as unknown as WindowWithLenis).lenis;
    if (!lenis) return;

    const onScroll = (e: { scroll: number }) => {
      scrollY.set(e.scroll);
    };

    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [scrollY]);

  return scrollY;
}

/**
 * useParallax — Hook para efecto parallax ligero en imágenes
 *
 * Parámetros:
 * @param scrollY  - MotionValue del scroll (de useLenisScroll)
 * @param inputRange  - Rango de scroll en px [start, end]
 * @param strength    - Intensidad del parallax (default: 80px)
 *
 * Uso:
 *   const scrollY = useLenisScroll();
 *   const y = useParallax(scrollY, [0, 500], 60);
 *   <motion.div style={{ y }} />
 */
export function useParallax(
  scrollY: MotionValue<number>,
  inputRange: [number, number],
  strength = 80
): MotionValue<number> {
  return useTransform(scrollY, inputRange, [0, -strength]);
}
