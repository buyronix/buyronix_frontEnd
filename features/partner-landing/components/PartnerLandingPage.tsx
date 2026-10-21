"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { BenefitsSection } from "./BenefitsSection";
import { ValuePropsSection } from "./ValuePropsSection";
import { StepsSection } from "./StepsSection";
import { FaqSection } from "./FaqSection";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";

export function PartnerLandingPage() {
  const router = useRouter();

  const handleOpenRegister = () => {
    router.push("/register");
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col selection:bg-rose-100 selection:text-rose-900"
    >
      {/* Top Floating Glassmorphism Navbar */}
      <Navbar onOpenRegister={handleOpenRegister} />

      <main className="w-full flex-1">
        {/* Section 0: Cinematic Dark Hero */}
        <section id="hero" className="w-full bg-neutral-950 scroll-mt-16">
          <HeroSection onOpenRegister={handleOpenRegister} />
        </section>

        {/* Section 1: Benefits & 3 Core Pillar Cards */}
        <section id="benefits" className="w-full bg-white dark:bg-black scroll-mt-16">
          <BenefitsSection />
        </section>
        {/* Section 3: Onboarding Steps */}
        <section id="how-it-works" className="w-full bg-white dark:bg-black scroll-mt-16">
          <StepsSection />
        </section>

        {/* Section 4: FAQ Accordion */}
        <section id="faq" className="w-full bg-neutral-50 dark:bg-neutral-900 scroll-mt-16">
          <FaqSection />
        </section>

        {/* Section 5: Closing CTA & Footer */}
        <section id="register" className="w-full bg-neutral-950 text-white scroll-mt-16">
          <CtaSection onOpenRegister={handleOpenRegister} />
          <Footer onOpenRegister={handleOpenRegister} />
        </section>
      </main>
    </div>
  );
}
