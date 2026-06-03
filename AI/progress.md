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
* **Hero `200vh`:** La sección tiene `height: 200vh`. El sticky container is `100vh`. El sticky se suelta en exactamente `100vh` de scroll.

### Iteración 4 — Galería Asimétrica (Style-guide de Odd Ritual)
* **Componente `GallerySection.tsx`:** Implementamos una cuadrícula de tres columnas asimétricas con tres imágenes seleccionadas de mar/estilo de vida polinesio.
* **Espaciado Editorial:** Amplios márgenes (`py-24 md:py-32`) y líneas divisorias Neo-Brutalistas muy finas para separar las secciones estéticamente.
* **Esquinas Rectas:** Respetamos estrictamente la regla de esquinas rectas sin bordear (`rounded-none`) y sin sombras difusas.

### Iteración 5 — Frase Cinematográfica (Video Scroll-Driven)
* **Componente `PhraseCinematic.tsx`:** Creado para actuar de nexo de alto impacto. La sección mide `250vh` de scroll.
* **Video de Fondo Sticky:** Un video atmosférico de olas gigantes (`video_wave.mp4`) permanece fijo en pantalla mientras el usuario hace scroll.
* **Transiciones de Texto:** Una frase tipográfica de alto impacto (*"El mar cura todo / libre de memoria / libre de tiempo"*) se desplaza de abajo hacia arriba de forma suave con opacidad progresiva, quedando perfectamente legible sobre el video mediante un filtro oscuro superpuesto.

### Iteración 6 — Galería Horizontal Scroll-Driven (Inspiración en composites.archi)
* **Componente `HorizontalGallery.tsx`:** Galería que mapea el scroll vertical a un movimiento horizontal de track.
* **Carga de Imágenes Propias**: Modificado para usar las 10 imágenes reales provistas por el usuario (`/1.jpg` a `/10.jpg`).
* **Nombres Reales de Destinos**: Asignamos locaciones auténticas de la Polinesia Francesa (como **Matira**, **Temae**, **Teahupo'o**, **Fare**, **Tiputa**, etc.).
* **Título Centrado y Ajustado**: Centramos horizontalmente el nombre del destino activo sobre el track de fotos. Bajamos el título agregando padding para evitar cualquier solapamiento o corte visual superior.
* **Diseño Ultra-Limpio (Sin Hover Cliché)**:
  * Eliminamos por completo el overlay de color oscuro en hover sobre las imágenes.
  * Quitamos los títulos y subtítulos del hover de las tarjetas.
  * Mantuvimos únicamente el contador numérico minimalista (ej: `03 / 10`) en tipografía *JetBrains Mono*, apareciendo en la esquina inferior derecha al pasar el ratón.
  * En mobile, el contador queda siempre visible en la parte inferior de cada tarjeta y el scroll horizontal funciona de forma nativa mediante scroll-snap.

---

## 2. Dónde Estamos
* **Secuencia Completa de Landing Page:** `page.tsx` integra exitosamente la siguiente experiencia secuencial:
  1. `<Hero />` (Scroll-driven panel blur)
  2. `<GallerySection />` (Asymmetric layout)
  3. `<PhraseCinematic />` (Ocean video scroll-driven text)
  4. `<HorizontalGallery />` (Cleaned-up horizontal scroll gallery)
* **Estética Premium Unificada:** Todos los componentes utilizan exclusivamente la paleta orgánica (Cream, Beige, Deep Ocean), fuentes tipográficas definidas (`Playfair Display Italic` y `JetBrains Mono`), líneas neo-brutalistas delgadas y cero bordes redondeados.
* **Compilación Verificada:** `npm run build` pasa con éxito sin ningún error de TypeScript.

---

## 3. Próximos Pasos (Pendientes)

### Footer e Interacciones Finales
* [ ] **Footer:** Crear un pie de página minimalista que cierre la experiencia con la marca `lemanjá.` centrada y enlaces mínimos.
* [ ] **Optimización Mobile:** Ajustar rendimiento de los filtros de desenfoque (`backdrop-filter`) en pantallas pequeñas si se detecta lag.
