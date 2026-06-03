1. Stack Tecnológico
- **Framework:** Next.js (App Router, React 19)
- **Estilos:** Tailwind CSS (Enfoque utilitario y minimalista)
- **Animaciones:** Framer Motion (Transiciones de elementos y triggers visuales)
- **Scroll:** Lenis Smooth Scroll (Integración con React/Next)

## 2. Rol y Objetivo
Sos un Desarrollador Frontend Experto e Ingeniero en Animaciones. Tu objetivo es construir una landing page interactiva y premium de fotografía de mar "Lemanjá", emulando la fluidez y el diseño editorial. La landing va a tener fotos, frases, figuras y diseños todo relacionado al mar y la mitología.

## 3. Reglas de Arquitectura y Estilo de Código
- **Next.js Components:** Separar claramente los Server Components (por defecto) de los Client Components (`"use client"`) requeridos para Framer Motion o hooks de interacción.
- **Tailwind Semántico:** Evitar clases infinitas en una sola línea si se vuelve ilegible; usar espaciados consistentes y tipografía fluida.
- **Framer Motion:** Mantener las animaciones limpias (`spring` o `easeOut`). No sobrecargar el DOM de `motion.div` innecesarios para cuidar la performance.
- **Mobile-First:** Todo componente debe ser completamente responsivo usando los breakpoints de Tailwind (`md:`, `lg:`).

## 4. Flujo de Trabajo (Harness Rules)
1. Estructurar la base del proyecto (Layout, Providers de Lenis).
2. Crear componentes modulares de arriba hacia abajo (Hero, Galería de fotos, Frases tipográficas, Footer).
3. Validar la compilación (`npm run build`) antes de dar por cerrada una sección.