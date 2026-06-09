import Hero from "@/components/Hero";
import GallerySection from "@/components/GallerySection";
import PhraseCinematic from "@/components/PhraseCinematic";
import HorizontalGallery from "@/components/HorizontalGallery";
import EditorialReveal from "@/components/EditorialReveal";
import SocialsCarousel from "@/components/SocialsCarousel";

/**
 * page.tsx — Lemanjá
 *
 * Estructura:
 *  <Hero />              — 200vh: imagen + panel blur scroll-driven + navbar
 *  <GallerySection />    — Layout asimétrico de 3 imágenes (Odd Ritual style)
 *  <PhraseCinematic />   — 250vh: frase tipográfica scroll-driven sobre video de mar
 *  <HorizontalGallery /> — 400vh: galería horizontal scroll-driven (composites.archi style)
 *  <EditorialReveal />   — 250vh: imagen editorial + título brutalist word-by-word reveal
 *  <SocialsCarousel />   — 320vh: fan card carousel scroll-driven (Lando Norris style)
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <GallerySection />
      <PhraseCinematic />
      <HorizontalGallery />
      <EditorialReveal />
      <SocialsCarousel />
    </main>
  );
}
