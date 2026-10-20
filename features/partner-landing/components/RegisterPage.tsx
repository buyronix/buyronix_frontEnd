"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Store,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  Building2,
} from "lucide-react";
import type { SellerRegistrationForm } from "../types";

const initialForm: SellerRegistrationForm = {
  shopName: "",
  gstNumber: "",
  mobNumber: "",
  email: "",
  address: "",
  ownerName: "",
  mobNo: "",
  ownerAddress: "",
};

export function RegisterPage() {
  const [form, setForm] = React.useState<SellerRegistrationForm>(initialForm);
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [referenceToken, setReferenceToken] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Console log the submitted details
    console.log("Seller registration form submitted:", form);
    console.log({
      "Shop name": form.shopName,
      "Gst number": form.gstNumber,
      "Mob number": form.mobNumber,
      "Email": form.email,
      "Address": form.address,
      "Owner name": form.ownerName,
      "Mob no": form.mobNo,
      "Address (Owner)": form.ownerAddress,
    });

    setIsSubmitting(true);
    const token = `BYX-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceToken(token);

    // Simulate instant onboarding request submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setReferenceToken("");
    setForm(initialForm);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-rose-500/20 selection:text-rose-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          <Link
            href="/"
            className="group flex items-center text-2xl sm:text-3xl font-extrabold italic tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span>buyronix</span>
            <span className="not-italic text-[#e11d48] transition-transform group-hover:scale-125 ml-0.5">
              .
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-neutral-900"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {!submitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Context & Partner Perks */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5 flex flex-col gap-6"
              >
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-rose-400 uppercase mb-3">
                    <Store className="size-3.5" />
                    <span>Partner with Buyronix</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Register Your <br className="hidden sm:inline" />
                    <span className="text-[#e11d48]">Hardware Shop</span>
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
                    Join verified neighborhood hardware sellers and bring your inventory
                    closer to nearby buyers with instant local delivery.
                  </p>
                </div>

                {/* Value Cards */}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-start gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-950/60 text-[#e11d48]">
                      <Clock className="size-4" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Instant Local Delivery</h2>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Nearby fleet riders pick up orders straight from your counter.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-950/60 text-[#e11d48]">
                      <ShieldCheck className="size-4" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">GST Verified Network</h2>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Build customer trust and enable business tax invoice credits.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-950/60 text-[#e11d48]">
                      <CreditCard className="size-4" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Fast Merchant Settlements</h2>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Direct bank account payouts settled seamlessly on each order.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-neutral-800 p-4 text-xs text-neutral-400">
                  Need onboarding assistance? Our merchant team will guide you through verification and catalog setup within 24 hours.
                </div>
              </motion.div>

              {/* Right Column: Registration Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-7"
              >
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                  <div className="border-b border-neutral-800 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-white">Shop Registration Form</h2>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                      Please enter your shop and owner details below to register.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Section 1: Shop Details */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-neutral-800">
                        <Building2 className="size-4 text-[#e11d48]" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                          Shop Details
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="shopName"
                            className="text-xs font-medium text-neutral-300"
                          >
                            Shop name *
                          </label>
                          <Input
                            id="shopName"
                            name="shopName"
                            required
                            placeholder="e.g. Apex Hardware & Tech Hub"
                            value={form.shopName}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, shopName: e.target.value }))
                            }
                            className="h-10 text-sm bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-rose-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="gstNumber"
                            className="text-xs font-medium text-neutral-300"
                          >
                            Gst number *
                          </label>
                          <Input
                            id="gstNumber"
                            name="gstNumber"
                            required
                            placeholder="e.g. 29AAAAA0000A1Z5"
                            value={form.gstNumber}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                gstNumber: e.target.value.toUpperCase(),
                              }))
                            }
                            className="h-10 text-sm font-mono uppercase bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-rose-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="mobNumber"
                            className="text-xs font-medium text-neutral-300"
                          >
                            Mob number *
                          </label>
                          <Input
                            id="mobNumber"
                            name="mobNumber"
                            required
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={form.mobNumber}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                mobNumber: e.target.value,
                              }))
                            }
                            className="h-10 text-sm bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-rose-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="email"
                            className="text-xs font-medium text-neutral-300"
                          >
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            required
                            type="email"
                            placeholder="e.g. shop@example.com"
                            value={form.email}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="h-10 text-sm bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-rose-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="address"
                          className="text-xs font-medium text-neutral-300"
                        >
                          Address *
                        </label>
                        <Input
                          id="address"
                          name="address"
                          required
                          placeholder="e.g. Shop #12, Commercial Complex, MG Road, Bengaluru"
                          value={form.address}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, address: e.target.value }))
                          }
                          className="h-10 text-sm bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-rose-500"
                        />
                      </div>
                    </div>

                    {/* Section 2: Owner Details */}
                    <div className="flex flex-col gap-3 pt-2">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-[#e11d48]" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                            Owner Details
                          </span>
                        </div>
                        {form.address && (
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                ownerAddress: prev.address,
                              }))
                            }
                            className="text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                          >
                            Same as shop address
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="ownerName"
                            className="text-xs font-medium text-neutral-300"
                          >
                            Owner name *
                          </label>
                          <Input
                            id="ownerName"
                            name="ownerName"
                            required
                            placeholder="e.g. Ramesh Patel"
                            value={form.ownerName}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                ownerName: e.target.value,
                              }))
                            }
                            className="h-10 text-sm bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-rose-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="mobNo"
                            className="text-xs font-medium text-neutral-300"
                          >
                            Mob no *
                          </label>
                          <Input
                            id="mobNo"
                            name="mobNo"
                            required
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={form.mobNo}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, mobNo: e.target.value }))
                            }
                            className="h-10 text-sm bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-rose-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="ownerAddress"
                          className="text-xs font-medium text-neutral-300"
                        >
                          Address *
                        </label>
                        <Input
                          id="ownerAddress"
                          name="ownerAddress"
                          required
                          placeholder="e.g. Flat 302, Green Valley Apartments, Bengaluru"
                          value={form.ownerAddress}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              ownerAddress: e.target.value,
                            }))
                          }
                          className="h-10 text-sm bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-rose-500"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-[#e11d48] py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-[#c9183d] hover:shadow-xl active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <span>Submit Registration</span>
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                      <p className="text-[11px] text-neutral-500 text-center mt-3">
                        By submitting, you agree to Buyronix merchant terms and onboarding verification.
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Success / Application Received View */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 sm:p-12 text-center backdrop-blur-md shadow-2xl"
            >
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-rose-950/70 text-[#e11d48] border border-rose-500/20">
                <CheckCircle2 className="size-9" />
              </div>

              <span className="text-xs font-semibold tracking-wider text-[#e11d48] uppercase">
                Application Received
              </span>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                Welcome to Buyronix
              </h1>

              <p className="mt-3 text-sm text-neutral-400 leading-relaxed max-w-md mx-auto">
                Thank you for registering{" "}
                <strong className="text-white font-semibold">
                  {form.shopName || "your shop"}
                </strong>
                . Our local merchant onboarding team will contact you within 24 hours to finalize verification and connect your counter to nearby buyers.
              </p>

              <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-xs text-neutral-400 max-w-xs mx-auto">
                Reference Token:{" "}
                <span className="font-mono font-bold text-white text-sm ml-1">
                  {referenceToken}
                </span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800"
                >
                  Register Another Shop
                </Button>
                <Link href="/">
                  <Button className="w-full sm:w-auto bg-[#e11d48] text-white hover:bg-[#c9183d]">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        © 2026 Buyronix Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
}
