"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function StepsSection() {
  const steps = [
    {
      step: "01",
      title: "Browse nearby shops",
      description:
        "Discover verified neighborhood tech & hardware stores right in your area.",
    },
    {
      step: "02",
      title: "Order from a verified seller",
      description:
        "Direct checkout with GST invoicing, genuine warranty, and secure payments.",
    },
    {
      step: "03",
      title: "Get it in under an hour",
      description:
        "Speedy local dispatch from the shop shelf directly to your hands or desk.",
    },
  ];

  return (
    <div id="how-it-works" className="py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 w-full bg-[#fefbfc] flex flex-col justify-center">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 md:mb-16"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#623ac3] uppercase mb-2 sm:mb-3">
            YOUR JOURNEY STARTS HERE
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
            From local shelf to your desk in 3 steps
          </h2>
        </motion.div>

        {/* 3 Step Cards in Midnight Violet with Black Shadows & #ffffff text/numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 lg:gap-8 items-stretch w-full">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="w-full h-full"
            >
              <div className="h-full w-full rounded-3xl bg-[#191331] border border-white/10 p-7 sm:p-9 flex flex-col justify-between shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/35 hover:border-white/20 transition-all duration-300 min-h-[220px] sm:min-h-[260px] relative overflow-hidden group">
                {/* Step Number in #ffffff */}
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#ffffff] font-sans select-none mb-6">
                  {item.step}
                </span>

                {/* Step Content in #ffffff */}
                <div className="flex flex-col gap-2 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#ffffff] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#ffffff]/85 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
