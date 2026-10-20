"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpRight } from "lucide-react";

interface HeroSectionProps {
  onOpenRegister: () => void;
}

export function HeroSection({ onOpenRegister }: HeroSectionProps) {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center text-center px-4 pt-20 pb-6 sm:pt-36 sm:pb-12 overflow-hidden bg-neutral-950 bg-cover bg-center select-none"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      {/* Background Image & Gradient Scrim Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt="Hardware shopkeeper with customer"
          fill
          priority
          className="object-cover object-center sm:object-[center_35%]"
        />
        {/* Multi-layered dark gradients for readability and contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      </div>

      {/* Top spacer to center content nicely */}
      <div aria-hidden="true" className="relative z-10 h-4 sm:h-8" />

      {/* Center Content with Framer Motion Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Hero Italic Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold italic tracking-tight text-white leading-none drop-shadow-md"
        >
          <span>buyronix</span>
          <span className="not-italic text-[#e11d48]">.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-3 sm:mt-5 text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight text-white drop-shadow-sm"
        >
         buy your electronics
        </motion.h2>

        {/* Explanatory Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-neutral-200 font-light drop-shadow-sm"
        >
      experience the smooth ordering and fast delivery!   
      <br className="mt-2" />
      NEW | USED | REFURBISHED     
        </motion.p>

        {/* Red Hero CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 sm:mt-8"
        >
          <Button
            onClick={onOpenRegister}
            className="h-11 sm:h-12 rounded-lg bg-[#e11d48] px-7 sm:px-8 text-sm sm:text-base font-semibold text-white shadow-lg shadow-rose-950/50 transition-all hover:bg-[#c9183d] hover:shadow-xl hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Buy now</span>
            <ArrowUpRight className="size-4.5" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Bouncing Discover the opportunity link at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.6 }}
        className="relative z-10 mt-12 sm:mt-16"
      >
        <a
          href="#benefits"
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-300 transition-colors hover:text-white animate-bounce cursor-pointer select-none drop-shadow-sm"
        >
          <span>Discover the opportunity</span>
          <ChevronDown className="size-4" />
        </a>
      </motion.div>
    </div>
  );
}

