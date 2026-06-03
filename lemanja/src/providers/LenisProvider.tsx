"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * LenisProvider — Smooth Scroll Global Provider
 *
 * Inicializa Lenis Smooth Scroll con opciones optimizadas para la estética
 * editorial de Lemanjá (movimiento fluido tipo agua, no rápido).
 *
 * Compatible con:
 * - Lenis 1.3.x
 * - Framer Motion 12.x (useMotionValue para scroll-driven animations)
 * - React 19 / Next.js 16 App Router
 *
 * Se mantiene como "use client" ya que requiere acceso al DOM y RAF.
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,          // Duración fluida — emula el agua
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,   // Ligero — más suave
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Exponer lenis globalmente para uso en hooks personalizados
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // RAF loop — integrado con Framer Motion
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
