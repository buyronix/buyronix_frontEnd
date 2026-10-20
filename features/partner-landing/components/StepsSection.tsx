"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function StepsSection() {
  const steps = [
    {
      step: "01",
      title: "Tell us about your shop",
      description:
        "Add your shop, owner and bank details in the seller registration form.",
    },
    {
      step: "02",
      title: "Get your business verified",
      description:
        "Shop and GST verification help build a trusted local marketplace.",
    },
    {
      step: "03",
      title: "Connect with local buyers",
      description:
        "Once onboarded, showcase your products and reach nearby customers.",
    },
  ];

  return (
    <div id="how-it-works" className="py-8 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full bg-white dark:bg-black flex flex-col justify-center">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-12 md:mb-16"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#e11d48] uppercase mb-2 sm:mb-4">
            YOUR JOURNEY STARTS HERE
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
            A simple start to something bigger.
          </h2>
        </motion.div>

        {/* 3 Process Steps with Stagger Animation */}
        <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800 border-y border-neutral-100 dark:border-neutral-800">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="py-4 sm:py-7 md:py-9 flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-8 group"
            >
              {/* Step Number in distinct soft coral/rose */}
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-rose-400 group-hover:text-[#e11d48] transition-colors select-none font-mono"
              >
                {item.step}
              </motion.span>

              {/* Step Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
