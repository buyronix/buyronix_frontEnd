"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowUpRight } from "lucide-react";

interface CtaSectionProps {
  onOpenRegister: () => void;
}

export function CtaSection({ onOpenRegister }: CtaSectionProps) {
  return (
    <div className="py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden bg-neutral-950 text-white w-full flex flex-col justify-center">
      {/* Background glow accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-0 flex justify-center overflow-hidden blur-3xl opacity-25"
      >
        <div className="h-[280px] w-[500px] bg-gradient-to-tr from-[#e11d48] to-rose-400 rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#e11d48] uppercase mb-4 sm:mb-6"
        >
          LET’S GROW, TOGETHER
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15]"
        >
          Your neighborhood is waiting.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 sm:mt-5 text-base sm:text-xl text-neutral-400"
        >
          Take the next step for your hardware business.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-4"
        >
          <Button
            onClick={onOpenRegister}
            className="h-12 sm:h-14 rounded-lg bg-[#e11d48] hover:bg-[#c9183d] px-8 sm:px-10 text-base font-semibold text-white shadow-lg shadow-rose-950/60 transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Register your shop</span>
            <ArrowUpRight className="size-4.5" />
          </Button>

          {/* Guarantee / Seller reassurance */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 mt-2">
            <span className="flex size-4 items-center justify-center rounded-full bg-emerald-950 text-emerald-400">
              <Check className="size-2.5 stroke-[3]" />
            </span>
            <span>Built for local hardware sellers</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
