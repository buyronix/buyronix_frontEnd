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
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between items-center text-center px-4 pt-24 pb-6 sm:pt-32 sm:pb-8 overflow-hidden bg-neutral-950 select-none">
      {/* Background Image & Dark Mask Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <Image
          src="/hero-bg.png"
          alt="Hardware store background"
          fill
          priority
          className="object-cover object-center sm:object-[center_35%]"
        />
        {/* Dark mask overlays for high contrast and cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/55" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
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
          <span>buy</span>
          <span className="text-[#a78bfa]">ronix</span>
          <span className="not-italic text-[#a78bfa]">.</span>
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
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-300 uppercase">
            NEW | USED | REFURBISHED
          </span>
        </motion.p>

        {/* Purple Hero CTA Button with Black Shadow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 sm:mt-8"
        >
          <Button
            onClick={onOpenRegister}
            className="h-11 sm:h-12 rounded-full bg-[#623ac3] px-7 sm:px-8 text-sm sm:text-base font-semibold text-[#ffffff] shadow-lg shadow-black/30 transition-all hover:bg-[#522ea8] hover:shadow-xl hover:shadow-black/40 hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Buy now</span>
            <ArrowUpRight className="size-4.5 text-[#ffffff]" />
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

