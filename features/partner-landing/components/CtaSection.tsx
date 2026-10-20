"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

interface CtaSectionProps {
  onOpenRegister: () => void;
}

export function CtaSection({ onOpenRegister }: CtaSectionProps) {
  return (
    <div className="py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 w-full bg-[#fefbfc] flex flex-col justify-center">
      <div className="mx-auto max-w-6xl w-full">
        {/* Banner Card Styled directly from reference */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[28px] sm:rounded-3xl bg-[#16112c] border border-white/10 p-8 sm:p-12 md:p-16 shadow-2xl shadow-black/30"
        >
          <div className="relative z-10 max-w-2xl flex flex-col items-start text-left">
            {/* Title in #ffffff */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#ffffff] leading-[1.15]">
              Own a hardware shop?
            </h2>

            {/* Subtitle in #ffffff */}
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#ffffff]/85 leading-relaxed max-w-xl">
              Get a digital storefront and reach buyers in your area — free to join.
            </p>

            {/* Action Button: White pill button with black shadow */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                onClick={onOpenRegister}
                className="h-11 sm:h-12 rounded-full bg-[#ffffff] text-neutral-900 hover:bg-neutral-100 px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-md shadow-black/20 hover:shadow-lg hover:shadow-black/25 transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Register your shop</span>
                <ArrowRight className="size-4 text-neutral-900" />
              </Button>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#ffffff]/75">
                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-950 text-emerald-400">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>Free to join • Zero setup fee</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
