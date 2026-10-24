"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GoogleSignInButton } from "./GoogleSignInButton";
import {
  ShieldCheck,
  Store,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SellerAuthGatewayProps {
  onSignInWithGoogle: () => Promise<unknown>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function SellerAuthGateway({
  onSignInWithGoogle,
  isLoading = false,
  errorMessage = null,
}: SellerAuthGatewayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl"
      >
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-neutral-500/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Context & Information */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs px-2.5 py-1 flex items-center gap-1.5"
              >
                <Store className="size-3.5 text-rose-400" />
                <span>Seller Onboarding</span>
              </Badge>
              <Badge
                variant="outline"
                className="border-neutral-700 bg-neutral-800/60 text-neutral-300 text-xs px-2.5 py-1"
              >
                Step 0 · Identity Verification
              </Badge>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Sign in with Google to start shop registration
              </h1>
              <p className="hidden sm:block mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
                To safeguard the Buyronix marketplace and establish verified merchant ownership,
                sellers must authenticate with Google before registering their storefront.
              </p>
            </div>
          </div>

          {/* Right Column: Google Sign-in Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-6 sm:p-7 shadow-xl">
              <div className="text-center mb-6">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#e11d48] mb-3">
                  <Lock className="size-6 text-rose-500" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  Continue with Google
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Authenticate your seller account to access the registration form.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <GoogleSignInButton
                  onSignIn={onSignInWithGoogle}
                  isLoading={isLoading}
                  className="w-full py-3.5 text-sm"
                  label="Sign up with Google"
                />

                <div className="flex items-center gap-2 text-[11px] text-neutral-400 justify-center">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span>Supabase OAuth 2.0 256-bit encrypted session</span>
                </div>
              </div>

              <div className="mt-6 border-t border-neutral-800/80 pt-4 text-center">
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  By continuing, you agree to the{" "}
                  <span className="text-neutral-400 underline underline-offset-2">
                    Buyronix Merchant Terms
                  </span>{" "}
                  and{" "}
                  <span className="text-neutral-400 underline underline-offset-2">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
