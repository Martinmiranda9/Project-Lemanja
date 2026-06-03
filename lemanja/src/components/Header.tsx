"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Header — Editorial Navigation Overlay
 *
 * Minimalist header styled after Odd Ritual:
 * - Completely flat layout
 * - Centered logo in Cormorant Serif
 * - Left/Right technical navigation links in JetBrains Mono
 * - Straight edges, ultra-thin borders
 */
export default function Header() {
  const linkVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="absolute top-0 left-0 w-full z-50 border-b border-ocean/10 bg-transparent"
    >
      <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
        
        {/* Navigation Links - Left */}
        <nav className="hidden md:flex items-center gap-8">
          <motion.div variants={linkVariants} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
            <Link href="#galeria" className="font-mono text-xs uppercase tracking-widest text-ocean/80 hover:text-ocean transition-colors">
              Galería
            </Link>
          </motion.div>
          <motion.div variants={linkVariants} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
            <Link href="#filosofia" className="font-mono text-xs uppercase tracking-widest text-ocean/80 hover:text-ocean transition-colors">
              Filosofía
            </Link>
          </motion.div>
        </nav>

        {/* Center Logo - Editorial Serif */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex-1 md:flex-none text-center"
        >
          <Link href="/" className="font-serif italic text-2xl md:text-3xl font-medium tracking-tight text-ocean">
            Lemanjá
          </Link>
        </motion.div>

        {/* Navigation Links - Right */}
        <div className="flex items-center gap-8">
          <motion.div 
            variants={linkVariants} 
            initial="initial" 
            animate="animate" 
            transition={{ delay: 0.5 }}
            className="hidden md:block"
          >
            <Link href="#contacto" className="font-mono text-xs uppercase tracking-widest text-ocean/80 hover:text-ocean transition-colors">
              Contacto
            </Link>
          </motion.div>
          
          <motion.button 
            variants={linkVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
            className="border border-ocean/30 hover:border-ocean hover:bg-ocean hover:text-cream px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ocean transition-all rounded-none"
          >
            Menú
          </motion.button>
        </div>

      </div>
    </motion.header>
  );
}
