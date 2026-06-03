# Progreso del Proyecto — Lemanjá

Este documento registra los hitos alcanzados, el estado actual de la interfaz y las tareas pendientes para futuras iteraciones estéticas y funcionales.

---

## 1. Qué Hicimos

### Iteración 1 — Rediseño del Hero (Inspiración en Odd Ritual)
* **Imagen Full-Bleed:** Restauramos la imagen a pantalla completa con `object-cover` sin encuadres ni escalas reducidas para máximo impacto visual.
* **Overlay de Contraste:** Gradiente vertical sutil de azul profundo a transparente en la parte inferior para garantizar legibilidad óptima.
* **Identidad de Marca:** Ubicamos **"lemanjá."** en el margen superior izquierdo, en color **Deep Ocean (#2C365A)**, con estilo itálico elegante y peso delicado.
* **Detalles Neo-Brutalistas:** Insertamos líneas divisorias ultra-finas arriba-centro en tono **Deep Ocean (#2C365A)** (opacidades 0.75 y 0.35).
* **Frase Ideológica:** Implementamos el bloque tipográfico en el margen inferior izquierdo en 3 renglones jerárquicos.
* **Migración Tipográfica:** Reemplazamos `Cormorant Garamond` por **`Playfair Display`** en `layout.tsx`, `globals.css` y `style-guide.md`.

### Iteración 2 — Sistema Tipográfico y Refinamiento del Hero
* **Jerarquía Tipográfica de Pesos:** Se establece el sistema de pesos para Playfair Display Italic:
  * `font-weight: 700` (Bold) → Títulos principales / palabras protagonistas (ej: *"Tahití"*).
  * `font-weight: 500–600` (Medium / Semi-bold) → Subtítulos y énfasis editorial (ej: *"el lugar,"*).
  * `font-weight: 400` (Regular) → Frases líricas, citas, elementos recesivos (ej: *"que cura todo"*).
  * `font-weight: 400` (Regular) → Nombre de marca **"lemanjá."** con tamaño aumentado.
* **Marca agrandada:** El logotipo **"lemanjá."** en top-left pasó de `clamp(0.95rem, 1.2vw, 1.2rem)` a `clamp(1.5rem, 2.2vw, 2.2rem)` para darle mayor presencia visual.
* **Líneas decorativas a Deep Ocean:** Las líneas top-center cambiaron a **Deep Ocean `#2C365A`** (opacidades 0.75 y 0.35).
* **Reloj de Tahití (Polinesia Francesa):** Se agregó en el margen superior derecho un reloj en vivo con hora local de Tahití (UTC−10), con actualización por segundo, en Playfair Display Italic Regular.

### Iteración 3 — Scroll-Driven Hero (Inspiración en Reverie Safaris)
* **Panel Blureado Scroll-Driven:** Implementamos un panel con `backdrop-filter: blur(30px)` que sube desde la parte inferior del viewport al hacer scroll. Usa `useMotionValue` + `useTransform` de Framer Motion alimentados por los eventos `scroll` de **Lenis** directamente (más preciso que `useScroll` de Framer Motion que no detecta Lenis).
* **Mecánica de 2 fases:**
  * **Fase 1** (scroll 0 → 100vh): Panel sube de `translateY: 100%` → `0%`. UI del hero (lemanjá, líneas, reloj, frase) se desvanece progresivamente.
  * **Fase 2** (scroll = 100vh): El panel termina de cubrir la imagen. El sticky se suelta instantáneamente y la siguiente sección emerge.
* **Monograma PF + Frase centrada:** Dentro del panel blureado aparece el círculo con las iniciales **PF** (Polinesia Francesa), el título *"Atrapados por la marea"* y el subtexto *"Una bitácora visual dedicada a los que buscan perderse en la inmensidad del agua."* — todo en **Playfair Display Italic** siguiendo la jerarquía del style-guide.
* **Navbar Cream Scroll-Driven:** Al completarse el blur, aparece con `fade-in` un navbar fijo en fondo **Cream (#EEE8DF)** con borde inferior sutil. Contiene: `lemanjá.` (izquierda) | líneas decorativas (centro) | reloj de Tahití (derecha) — todo en **Deep Ocean (#2C365A)**.
* **Sección placeholder:** Se agregó una sección en blanco (`#EEE8DF`) después del hero para recibir el contenido futuro.
* **Hero `200vh`:** La sección tiene `height: 200vh`. El sticky container es `100vh`. El sticky se suelta en exactamente `100vh` de scroll — el mismo instante en que el panel termina de subir — logrando transición cero-latencia a la siguiente sección.

---

## 2. Dónde Estamos
* **Hero Completo:** El componente `Hero.tsx` está íntegro con scroll-driven animations via Lenis + Framer Motion.
* **Navbar Funcional:** Aparece automáticamente con scroll, en fondo cream con Deep Ocean, sin parpadeos.
* **Estructura de Página:** `page.tsx` tiene `<Hero />` seguido de una sección placeholder lista para recibir contenido.
* **Tokens Sincronizados:** Variables de color y tipografía centralizadas en `globals.css`.
* **Compilación Limpia:** No hay errores TypeScript ni de build. Solo warnings menores de hidratación de Framer Motion (inofensivos).

---

## 3. Próximos Pasos (Pendientes)

### UI / Navbar
* [x] **Quitar "Hora local · PF"** del navbar sticky — se eliminó la etiqueta, queda solo el reloj limpio.

### Nuevas Secciones (Lenis + Framer Motion)
* [ ] **Sección Galería:** Grid asimétrico de fotos de mar (Polinesia, Tahití). Reveal de imágenes con `overflow-hidden` + `scale 1.15 → 1.0` al hacer scroll. Integrar con Lenis `useScrollOffset`.
* [ ] **Sección Frase Editorial:** Bloque de texto tipográfico de alto impacto, centrado, con fondo Deep Ocean. Ej: *"El mar no te pide permiso."*
* [ ] **Sección Filosofía/Sobre:** Layout asimétrico `grid-cols-12`, imagen flotante + texto en dos columnas. Fade-in con Framer Motion al entrar al viewport.
* [ ] **Footer:** Marca `lemanjá.` centrada, enlaces mínimos, línea decorativa superior, color Deep Ocean sobre Cream.

### Refinamientos Técnicos
* [ ] Evaluar agregar `ScrollTrigger`-style reveals a las secciones nuevas usando `useInView` de Framer Motion + Lenis.
* [ ] Revisar performance en mobile (Lenis + `backdrop-filter` pueden ser pesados en dispositivos bajos).
* [ ] Validar con `npm run build` antes de cerrar cada sección nueva.
