"use client";

import React, { useState } from "react";
import { AuthScreen } from "../types";
import { RoleGateway } from "./RoleGateway";
import { SellerLoginForm } from "./SellerLoginForm";
import { BuyerLoginForm } from "./BuyerLoginForm";
import { SellerRegisterForm } from "./SellerRegisterForm";
import { IllustrationGlobe } from "./IllustrationGlobe";
import { Badge } from "@/components/ui/badge";

export function AuthContainer() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>("gateway");

  return (
    <div className="flex min-h-[100dvh] w-full bg-[#FAFAF8] text-[#111110] font-sans">
      {/* Responsive layout: vertical flow on mobile, 12-col grid on lg+ */}
      <div className="flex w-full flex-1 flex-col lg:grid lg:grid-cols-12 min-h-[100dvh]">
        {/* Left Atelier Branding Panel (Visible on Desktop lg+, Hidden on Mobile) */}
        <aside className="hidden lg:flex lg:col-span-5 bg-[#F4F4F0] border-r border-neutral-200/80 p-10 xl:p-14 flex-col justify-between select-none">
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <span className="font-serif font-black tracking-tight text-2xl text-neutral-950">
              ritual
            </span>
            <Badge
              variant="outline"
              className="text-[10px] tracking-widest font-mono uppercase text-neutral-500 bg-white/40 border-neutral-300/80 rounded-full px-2 py-0.5"
            >
              DESKTOP
            </Badge>
          </div>

          {/* Center Branding Content */}
          <div className="my-auto max-w-md py-6">
            <h1 className="font-serif text-4xl xl:text-5xl leading-[1.05] tracking-tight font-normal text-neutral-950 mb-4">
              seven minutes. <br />
              <span className="font-serif italic font-normal text-neutral-800">
                all yours.
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-neutral-500 mb-8 max-w-sm">
              Experience frictionless onboarding for both consumers and
              registered business sellers. Verified GST verification with
              automated location positioning.
            </p>

            <div className="flex w-full items-center justify-center my-6">
              <IllustrationGlobe className="w-56 h-56 xl:w-64 xl:h-64" />
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-xs text-neutral-400 pt-6 border-t border-neutral-200/70">
            <span>© 2026 Ritual Inc.</span>
            <a
              href="#privacy"
              className="hover:text-neutral-900 transition-colors"
            >
              Privacy &amp; Terms
            </a>
          </div>
        </aside>

        {/* Main Form Surface */}
        <main className="flex-1 lg:col-span-7 bg-white p-6 sm:p-10 md:p-12 xl:p-16 flex flex-col justify-between min-h-[100dvh]">
          {/* Active Screen Container */}
          <div className="flex-1 flex flex-col justify-center max-w-xl w-full mx-auto my-auto">
            {currentScreen === "gateway" && (
              <RoleGateway
                onSelectSeller={() => setCurrentScreen("seller-login")}
                onSelectBuyer={() => setCurrentScreen("buyer-login")}
                onDirectLogin={() => setCurrentScreen("seller-login")}
              />
            )}

            {currentScreen === "seller-login" && (
              <SellerLoginForm
                onBack={() => setCurrentScreen("gateway")}
                onSwitchToBuyer={() => setCurrentScreen("buyer-login")}
                onSwitchToRegister={() => setCurrentScreen("seller-register")}
              />
            )}

            {currentScreen === "buyer-login" && (
              <BuyerLoginForm
                onBack={() => setCurrentScreen("gateway")}
                onSwitchToSeller={() => setCurrentScreen("seller-login")}
              />
            )}

            {currentScreen === "seller-register" && (
              <SellerRegisterForm
                onBack={() => setCurrentScreen("seller-login")}
                onSwitchToLogin={() => setCurrentScreen("seller-login")}
              />
            )}
          </div>

          {/* Footer for Form Screen */}
          <footer className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 select-none">
            <span>Secure Encrypted Session</span>
            <span>ritual.biz &bull; 2026</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
