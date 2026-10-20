"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Instant delivery",
      description:
        "From your shelf to their doorstep. Local delivery designed for customers who need their hardware now.",
      tag: "LESS WAITING. MORE SELLING.",
    },
    {
      icon: CheckCircle2,
      title: "GST verified shops",
      description:
        "Stand out as a trusted local business in a marketplace built around GST verified sellers.",
      tag: "YOUR BUSINESS. VERIFIED.",
    },
    {
      icon: ShieldCheck,
      title: "Secure payments",
      description:
        "A payment experience designed to give buyers confidence and sellers peace of mind.",
      tag: "CONFIDENCE IN EVERY ORDER.",
    },
  ];

  return (
    <div className="w-full bg-[#fefbfc] py-12 sm:py-20 md:py-28 flex flex-col justify-center">
      {/* Main Benefits Content */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-3 sm:mb-4"
          >
            <span className="text-xs sm:text-sm font-bold tracking-[0.22em] text-[#623ac3] uppercase">
               Find near , Find best.
            </span>
          </motion.div>

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.18]">
              connecting buyers <br className="hidden sm:inline" />
              <span className="text-[#623ac3]"> empowering sellers.</span>
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
             experience the smooth ordering and fast delivery
            </p>
          </motion.div>

          {/* 3 Cards: 1-column on mobile, 3-column grid on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 lg:gap-8 items-stretch w-full">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="w-full h-full"
                >
                  <Card className="group relative h-full w-full rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 md:p-9 flex flex-col justify-between shadow-sm shadow-black/5 transition-all duration-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-black/10 min-h-0 md:min-h-[360px]">
                    <div>
                      {/* Icon Container */}
                      <div className="mb-4 sm:mb-6 md:mb-8 flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#ede9fe] text-[#623ac3] transition-colors group-hover:bg-[#623ac3] group-hover:text-[#ffffff] shadow-xs shadow-black/5">
                        <Icon className="size-6 stroke-[2]" />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                          {benefit.title}
                        </h3>
                        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Tagline */}
                    <div className="pt-6 sm:pt-7 md:pt-8 border-t border-neutral-100 mt-6 sm:mt-8">
                      <span className="text-xs font-bold tracking-[0.18em] text-[#623ac3] uppercase">
                        {benefit.tag}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
