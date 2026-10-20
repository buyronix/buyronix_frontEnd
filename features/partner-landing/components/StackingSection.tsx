"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StackingSectionProps {
  children: React.ReactNode;
  index: number;
  total?: number;
  className?: string;
  id?: string;
  bgColor?: string;
}

export function StackingSection({
  children,
  index,
  total = 6,
  className = "",
  id,
  bgColor = "bg-white dark:bg-black",
}: StackingSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Monitor this section's progress as it scrolls
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const isLast = index === total - 1;

  // Subtle 3D scale down as the next section slides over this one
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <section
      ref={containerRef}
      id={id}
      className={`scroll-mt-16 relative md:sticky md:top-0 w-full min-h-fit md:min-h-[100dvh] flex flex-col justify-center overflow-visible md:overflow-hidden ${
        index > 0
          ? "rounded-t-[28px] sm:rounded-t-[44px] shadow-[0_-25px_60px_rgba(0,0,0,0.22)] border-t border-neutral-200/80 dark:border-neutral-800"
          : ""
      } ${bgColor} ${className}`}
      style={{
        zIndex: (index + 1) * 10,
      }}
    >
      <motion.div
        style={isLast ? undefined : { scale, y }}
        className="w-full origin-top"
      >
        {children}
      </motion.div>
    </section>
  );
}
