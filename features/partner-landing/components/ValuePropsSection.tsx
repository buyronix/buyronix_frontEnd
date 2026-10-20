"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Store, TrendingUp, ArrowRight } from "lucide-react";

interface ValuePropsSectionProps {
  onOpenRegister: () => void;
}

export function ValuePropsSection({ onOpenRegister }: ValuePropsSectionProps) {
  const points = [
    {
      icon: MapPin,
      title: "Get discovered nearby",
      description:
        "Connect with customers in your neighborhood who are looking for what you sell.",
    },
    {
      icon: Store,
      title: "Your shop, online",
      description:
        "Bring your local reputation and hardware expertise to a digital storefront.",
    },
    {
      icon: TrendingUp,
      title: "More ways to grow",
      description:
        "Turn local demand into new opportunities beyond your shop door.",
    },
  ];

  return (
    <div id="features" className="py-8 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#fefbfc] w-full flex flex-col justify-center">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-12 md:mb-16"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#623ac3] uppercase mb-2 sm:mb-4">
            BUILT AROUND YOUR BUSINESS
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
            Stay local. <br />
            Reach further.
          </h2>
          <p className="mt-2 sm:mt-4 text-xs sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-xl">
            From PC components to everyday electronics, your inventory deserves
            more than passing footfall.
          </p>

          <button
            onClick={onOpenRegister}
            className="group mt-4 sm:mt-6 inline-flex items-center gap-2 text-xs sm:text-base font-semibold text-[#623ac3] hover:text-[#522ea8] transition-colors cursor-pointer"
          >
            <span>Get to know Buyronix</span>
            <ArrowRight className="size-3.5 sm:size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* 3 Value Points with Framer Motion Stagger */}
        <div className="flex flex-col gap-4 sm:gap-8 md:gap-10">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex items-start gap-4 sm:gap-6 group"
              >
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-[#ede9fe] text-[#623ac3] transition-colors group-hover:bg-[#623ac3] group-hover:text-[#ffffff] shadow-xs shadow-black/5">
                  <Icon className="size-5 sm:size-6 stroke-[2]" />
                </div>
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                    {point.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
