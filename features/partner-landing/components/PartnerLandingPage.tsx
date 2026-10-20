"use client";

import * as React from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { BenefitsSection } from "./BenefitsSection";
import { ValuePropsSection } from "./ValuePropsSection";
import { StepsSection } from "./StepsSection";
import { FaqSection } from "./FaqSection";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";
import { RegisterModal } from "./RegisterModal";
import { StackingSection } from "./StackingSection";

export function PartnerLandingPage() {
  const [registerOpen, setRegisterOpen] = React.useState(false);

  const handleOpenRegister = () => {
    setRegisterOpen(true);
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col selection:bg-rose-100 selection:text-rose-900"
    >
      {/* Top Floating Glassmorphism Navbar */}
      <Navbar onOpenRegister={handleOpenRegister} />

      <main className="relative w-full flex-1">
        {/* Slide 0: Cinematic Dark Hero */}
        <StackingSection
          index={0}
          total={6}
          id="hero"
          bgColor="bg-neutral-950"
        >
          <HeroSection onOpenRegister={handleOpenRegister} />
        </StackingSection>

        {/* Slide 1: Benefits & 3 Core Pillar Cards */}
        <StackingSection
          index={1}
          total={6}
          id="benefits"
          bgColor="bg-white dark:bg-black"
        >
          <BenefitsSection />
        </StackingSection>

        {/* Slide 2: Built Around Your Business (Value Props) */}
        <StackingSection
          index={2}
          total={6}
          id="features"
          bgColor="bg-neutral-50 dark:bg-neutral-900"
        >
          <ValuePropsSection onOpenRegister={handleOpenRegister} />
        </StackingSection>

        {/* Slide 3: Onboarding Steps */}
        <StackingSection
          index={3}
          total={6}
          id="how-it-works"
          bgColor="bg-white dark:bg-black"
        >
          <StepsSection />
        </StackingSection>

        {/* Slide 4: FAQ Accordion */}
        <StackingSection
          index={4}
          total={6}
          id="faq"
          bgColor="bg-neutral-50 dark:bg-neutral-900"
        >
          <FaqSection />
        </StackingSection>

        {/* Slide 5: Closing CTA & Footer */}
        <StackingSection
          index={5}
          total={6}
          id="register"
          bgColor="bg-neutral-950 text-white"
        >
          <CtaSection onOpenRegister={handleOpenRegister} />
          <Footer onOpenRegister={handleOpenRegister} />
        </StackingSection>
      </main>

      {/* Interactive Shop Registration Modal */}
      <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  );
}
