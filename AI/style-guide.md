# Guía de Estilo Visual: Landing Mar "Lemanjá" (Premium Photography)

Este documento define la identidad visual, estética y pautas de UI/UX que la IA debe seguir estrictamente. El diseño se inspira en webs editoriales premium de Awwwards (ej. Odd Ritual, Reverie Safaris), fusionando el minimalismo de alta gama con el misticismo del mar, la fotografía analógica y la mitología de Lemanjá.

## 1. Concepto y Enfoque Estético
* **Temática:** La inmensidad del océano, la espuma de las olas, la arena y el contraste místico de las profundidades marinas a través de una estética fotográfica y analógica limpia.
* **Estilo:** Minimalismo Editorial de Alta Gama con toques Neo-Brutalistas sutiles (líneas de división ultra-finas, grillas asimétricas, tipografía técnica en contraste con Serif clásica).
* **Filosofía:** El espacio en blanco (o espacio vacío texturizado) es sagrado. Las secciones deben respirar con paddings drásticos (`py-24 md:py-32`) para simular un libro de fotografía o una galería física de arte.

## 2. Paleta de Colores (Organic Marine Gallery)
Inspirada en tonos orgánicos de costa, arena húmeda y agua profunda. Los agentes deben usar estos códigos HEX exactos de forma consistente.

* **Fondo Principal (Canvas / Cream):** `#EEE8DF` (Tono crema suave, emula el papel editorial o la espuma de mar al sol).
* **Tono Secundario / Transiciones (Beige):** `#C4BCB0` (Arena húmeda / Gris orgánico. Ideal para secciones intermedias, tarjetas o bloques mutados).
* **Color de Contraste y Profundidad (Deep Ocean):** `#2C365A` (Azul marino denso y místico. Utilizado para el texto principal sobre fondo claro, bloques de sección de alto impacto visual, elementos de UI clave, líneas decorativas y elementos de overlay sobre imagen).
* **Texto Principal (sobre Cream/Beige):** `#2C365A` (El azul profundo actúa como el color de lectura principal para mantener la sofisticación).
* **Texto Invertido (sobre bloques Deep Ocean):** `#EEE8DF` (Blanco crema para legibilidad en áreas oscuras).

## 3. Tipografía y Sistema Editorial
Fuerte contraste entre la fluidez lírica/editorial y la precisión técnica del desarrollo.

### 3.1 Fuente Principal — Playfair Display Italic
Toda la tipografía de marca, titulación y frases se usa **obligatoriamente en itálica**. Se diferencia el peso según el rol del texto:

| Rol | Peso | Uso |
|---|---|---|
| **Títulos / H1 / Impacto** | `font-weight: 700` (Bold) | Nombres de destino, palabras protagonistas, títulos de sección principales |
| **Subtítulos / H2 / Énfasis** | `font-weight: 600` (Semi-bold) | Segunda línea de frases, subtítulos editoriales, énfasis medio |
| **Frases líricas / H3 / Recesivo** | `font-weight: 400` (Regular) | Frases ideológicas, citas, palabras de menor jerarquía, texto que "se retira" visualmente |
| **Marca / Nombre "lemanjá."** | `font-weight: 400` (Regular Italic) | Logotipo en esquina, tamaño `clamp(1.5rem, 2.2vw, 2.2rem)` |

* *Fuente:* `Playfair Display` (Google Fonts, importada en `layout.tsx`).
* *Fallback:* `Cormorant Garamond`, `Bodoni Moda`, `serif`.
* *Regla para títulos principales (Bold):* `font-serif italic font-bold tracking-tight leading-none text-[#EEE8DF]` (sobre imagen) o `text-[#2C365A]` (sobre fondo cream).
* *Regla para frases líricas (Regular):* `font-serif italic font-normal tracking-tight text-[#C4BCB0]` (atenuado, recesivo).

### 3.2 Fuente Secundaria — JetBrains Mono / Space Mono
Para cuerpo, data técnica, UI, navegación, etiquetas y el reloj.

* *Fuentes:* `JetBrains Mono` (cargada) o `Space Mono`.
* *Regla base:* `font-mono text-xs uppercase tracking-widest text-[#2C365A]/80`.
* *Uso específico:* Navegación, etiquetas (`UTC−10`), datos de foto, botones.

## 4. Elementos UI Fijos del Hero

### 4.1 Marca — "lemanjá." (top-left)
* **Color:** `#2C365A` (Deep Ocean).
* **Tamaño:** `clamp(1.5rem, 2.2vw, 2.2rem)` — visible y con presencia, sin dominar.
* **Peso:** Regular Italic (400).
* **Posición:** `top-8 left-8 md:top-10 md:left-12`.

### 4.2 Líneas Decorativas Neo-Brutalistas (top-center)
* **Color:** `#2C365A` (Deep Ocean) — NO Beige/Cream.
* **Opacidades:** Línea superior `0.75`, línea inferior `0.35`.
* **Dimensiones:** `80px × 1px` y `44px × 1px`, gap `6px`.

### 4.3 Reloj de Tahití / Polinesia Francesa (top-right)
* **Zona horaria:** UTC−10 (calculado manualmente sin librerías de zona).
* **Formato:** `HH:MM:SS` (actualización cada segundo, `tabular-nums`).
* **Tipografía:** Playfair Display Italic Regular (`font-weight: 400`), `clamp(1rem, 1.4vw, 1.35rem)`.
* **Etiqueta:** JetBrains Mono, `0.55rem`, uppercase, `tracking-[0.18em]`, opacidad `0.55`.
* **Color:** `#2C365A` (Deep Ocean).
* **Implementación:** Client Component (`"use client"`) con `useEffect` e `useState`.

## 5. Layout Asimétrico y Estructura de Componentes
* **Grillas Orgánicas:** Evitar layouts predecibles. Usar `grid grid-cols-1 md:grid-cols-12` con desfases (`col-span` asimétricos) para que las imágenes y las frases se superpongan o floten orgánicamente sobre el fondo crema.
* **Bordes y Divisiones:** Estética Neo-Brutalista sutil. Usar líneas finas para delimitar áreas de UI o marcar el fin de una sección. Clase base: `border-t border-[#2C365A]/20`. No usar sombras difusas (`box-shadow`).
* **Ángulos:** Esquinas completamente rectas (`rounded-none`). No redondear botones ni contenedores de imágenes para mantener el impacto editorial y sobrio de las referencias.

## 6. Pautas de Animación (Framer Motion)
Las animaciones deben ser fluidas, emulando el movimiento del agua (suaves pero pesadas, no tipo "app de micro-interacciones rápidas").

* **Transiciones (Transitions):** Usar configuraciones `easeOut` prolongadas o `spring` con alto amortiguamiento (`damping: 25`, `stiffness: 100`).
* **Reveal de Imágenes:** Implementar efectos de revelado usando contenedores con `overflow-hidden`. La imagen interna debe iniciar con un `scale: 1.15` y pasar a `1.0` mientras el contenedor se despliega al hacer scroll.
* **Scroll-Driven Interactions:** Sincronizar elementos que reaccionen sutilmente al scroll (efecto parallax muy leve en las imágenes utilizando `useScroll` y `useTransform` de Framer Motion) aprovechando la integración con Lenis.

## 7. Restricciones Críticas para la IA
* **PROHIBIDO:** Usar componentes pre-armados comerciales (estilo Material, Shadcn genérico o esquinas redondeadas). Todo debe ser custom, utilitario y minimalista.
* **PROHIBIDO:** Usar negros puros (`#000000`) o blancos puros estridentes. Toda la interfaz debe moverse dentro de la armonía de la paleta Cream, Beige y Deep Ocean.
* **PROHIBIDO:** Usar el color Beige (`#C4BCB0`) para líneas decorativas del Hero — esas líneas deben ser Deep Ocean.
* **OBLIGATORIO:** Respetar la separación de Client Components (`"use client"`) solo donde Framer Motion, el reloj u otros hooks de Lenis lo requieran, manteniendo la estructura limpia y optimizada para React 19.
* **OBLIGATORIO:** Aplicar siempre la jerarquía tipográfica de pesos (Bold → Semi-bold → Regular) para reforzar la profundidad editorial.