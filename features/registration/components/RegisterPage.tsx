"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
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
  ChevronLeft,
  Lock,
} from "lucide-react";
import { SOUTH_INDIAN_STATES, type SellerRegistrationForm } from "../types";

const initialForm: SellerRegistrationForm = {
  ownerName: "",
  mobNo: "",
  ownerAddress: "",
  ownerState: "",
  ownerCity: "",
  shopName: "",
  gstNumber: "",
  mobNumber: "",
  email: "",
  address: "",
  pincode: "",
  state: "",
  city: "",
};

interface FormErrors {
  ownerName?: string;
  mobNo?: string;
  ownerAddress?: string;
  ownerState?: string;
  ownerCity?: string;
  shopName?: string;
  gstNumber?: string;
  mobNumber?: string;
  email?: string;
  address?: string;
  pincode?: string;
  state?: string;
}

export function RegisterPage() {
  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);
  const [form, setForm] = React.useState<SellerRegistrationForm>(initialForm);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [referenceToken, setReferenceToken] = React.useState("");

  // Check completion of Step 1 (Owner Details)
  const isOwnerComplete = Boolean(
    form.ownerName.trim() &&
      form.mobNo.trim() &&
      form.ownerAddress.trim() &&
      form.ownerState.trim()
  );

  // Check completion of Step 2 (Business Details)
  const isBusinessComplete = Boolean(
    form.shopName.trim() &&
      form.gstNumber.trim() &&
      form.mobNumber.trim() &&
      form.email.trim() &&
      form.email.includes("@") &&
      form.address.trim() &&
      form.pincode.trim().length === 6 &&
      form.state.trim()
  );

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }
    if (!form.mobNo.trim()) {
      newErrors.mobNo = "Owner mobile number is required";
    }
    if (!form.ownerState.trim()) {
      newErrors.ownerState = "Please select a state";
    }
    if (!form.ownerAddress.trim()) {
      newErrors.ownerAddress = "Owner address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.shopName.trim()) {
      newErrors.shopName = "Business / shop name is required";
    }
    if (!form.gstNumber.trim()) {
      newErrors.gstNumber = "GST number is required";
    }
    if (!form.mobNumber.trim()) {
      newErrors.mobNumber = "Business mobile number is required";
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      newErrors.email = "Valid email address is required";
    }
    if (!form.address.trim()) {
      newErrors.address = "Business address is required";
    }
    if (!form.pincode.trim() || form.pincode.length < 6) {
      newErrors.pincode = "Valid 6-digit pincode is required";
    }
    if (!form.state.trim()) {
      newErrors.state = "Please select a state";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep1()) {
      return;
    }
    setErrors({});
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    // Console log the submitted details
    console.log("Seller registration form submitted:", form);
    console.log({
      "Owner name": form.ownerName,
      "Mob no": form.mobNo,
      "State (Owner)": form.ownerState,
      "City (Owner)": form.ownerCity,
      "Address (Owner)": form.ownerAddress,
      "Shop name": form.shopName,
      "Gst number": form.gstNumber,
      "Mob number": form.mobNumber,
      "Email": form.email,
      "Address": form.address,
      "Pincode": form.pincode,
      "State": form.state,
      "City": form.city,
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
    setErrors({});
    setCurrentStep(1);
  };

  const handleFieldChange = (field: keyof SellerRegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCopyOwnerAddressToShop = () => {
    setForm((prev) => ({
      ...prev,
      address: prev.ownerAddress || prev.address,
      state: prev.ownerState || prev.state,
      city: prev.ownerCity || prev.city,
    }));
    setErrors((prev) => ({
      ...prev,
      address: undefined,
      state: undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-[#fefbfc] text-neutral-900 flex flex-col selection:bg-[#623ac3]/15 selection:text-[#623ac3]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-[#fefbfc]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          <Link
            href="/"
            className="group flex items-center text-2xl sm:text-3xl font-extrabold italic tracking-tight text-neutral-900 transition-opacity hover:opacity-90"
          >
            <span>buy</span><span className="text-[#623ac3]">ronix</span><span className="text-[#623ac3]">.</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors py-2 px-3 rounded-lg hover:bg-neutral-100"
          >
            <ArrowLeft className="size-4" data-icon="inline-start" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {!submitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Register Your Hardware Shop - Hidden on mobile, visible on lg+ */}
              <div className="hidden lg:flex lg:col-span-5 lg:sticky lg:top-28 flex-col justify-center gap-6 order-1">
                <div>
                  <Badge
                    variant="outline"
                    className="border-[#623ac3]/30 bg-[#ede9fe] text-[#623ac3] font-semibold gap-1.5 py-1 px-3 mb-3.5 uppercase tracking-wider text-xs"
                  >
                    <Store className="size-3.5" data-icon="inline-start" />
                    <span>Partner with Buyronix</span>
                  </Badge>

                  <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.12]">
                    Register Your <br className="hidden sm:inline" />
                    <span className="text-[#623ac3]">Hardware Shop</span>
                  </h1>

                  <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
                    Join verified neighborhood hardware sellers and bring your inventory
                    closer to nearby buyers with instant local delivery.
                  </p>
                </div>

                {/* Value Cards in High-Contrast Dark Theme */}
                <div className="flex flex-col gap-3.5 pt-1">
                  <div className="flex items-start gap-3.5 rounded-xl border border-neutral-200/90 bg-white p-4 shadow-sm shadow-black/5 hover:border-neutral-300 transition-colors">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] text-[#623ac3] border border-[#623ac3]/20">
                      <Clock className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-neutral-900">Instant Local Delivery</h2>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        Nearby fleet riders pick up orders straight from your counter and deliver in 30–45 mins.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-xl border border-neutral-200/90 bg-white p-4 shadow-sm shadow-black/5 hover:border-neutral-300 transition-colors">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] text-[#623ac3] border border-[#623ac3]/20">
                      <ShieldCheck className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-neutral-900">GST Verified Network</h2>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        Build customer trust and enable seamless business tax invoice input credits (ITC).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-xl border border-neutral-200/90 bg-white p-4 shadow-sm shadow-black/5 hover:border-neutral-300 transition-colors">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] text-[#623ac3] border border-[#623ac3]/20">
                      <CreditCard className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-neutral-900">Fast Merchant Settlements</h2>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        Direct bank account payouts settled seamlessly on each completed sale.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-100/60 p-4 text-xs text-neutral-600">
                  Need onboarding assistance? Our merchant team will guide you through verification and catalog setup within 24 hours.
                </div>
              </div>

              {/* Right Column: Two-Step Entry (Owner details first -> Business details next) */}
              <div className="w-full max-w-xl mx-auto lg:max-w-none lg:col-span-7 flex flex-col gap-6 order-2">
                {/* Form Progress Bar at the Top */}
                <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-lg shadow-black/5">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-[#623ac3] text-[#ffffff] text-xs font-bold shadow-xs shadow-black/10">
                        {currentStep}
                      </span>
                      <span className="text-neutral-900 text-sm font-semibold">
                        {currentStep === 1
                          ? "Step 1 of 2: Owner Details"
                          : "Step 2 of 2: Business Details"}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-neutral-200 bg-neutral-100 text-neutral-700 font-mono text-xs px-2.5 py-0.5"
                    >
                      {currentStep === 1 ? "50% Complete" : "100% Complete"}
                    </Badge>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                    <div
                      className="h-full bg-gradient-to-r #623ac3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: currentStep === 1 ? "50%" : "100%" }}
                    />
                  </div>

                  {/* Step Buttons / Navigation Tabs */}
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-neutral-100 text-xs">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {isOwnerComplete ? (
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span
                          className={`size-2 rounded-full shrink-0 ${
                            currentStep === 1 ? "bg-[#623ac3]" : "bg-neutral-300"
                          }`}
                        />
                      )}
                      <span
                        className={
                          isOwnerComplete
                            ? "text-emerald-400 font-medium truncate"
                            : currentStep === 1
                            ? "text-[#623ac3] font-semibold truncate"
                            : "text-neutral-400 truncate"
                        }
                      >
                        1. Owner Details
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) {
                          setCurrentStep(2);
                        }
                      }}
                      className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {isBusinessComplete ? (
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span
                          className={`size-2 rounded-full shrink-0 ${
                            currentStep === 2 ? "bg-[#623ac3]" : "bg-neutral-300"
                          }`}
                        />
                      )}
                      <span
                        className={
                          isBusinessComplete
                            ? "text-emerald-400 font-medium truncate"
                            : currentStep === 2
                            ? "text-[#623ac3] font-semibold truncate"
                            : "text-neutral-400 truncate"
                        }
                      >
                        2. Business Details
                      </span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <AnimatePresence mode="wait">
                    {currentStep === 1 ? (
                      /* STEP 1: OWNER DETAILS ENTRY */
                      <motion.div
                        key="step1-owner"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-6"
                      >
                        <Card className="rounded-2xl border border-neutral-200/90 bg-white p-0 shadow-xl shadow-black/5 ring-0 overflow-hidden">
                          <CardHeader className="border-b border-neutral-100 p-5 sm:p-6 bg-neutral-50/50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="flex size-9 items-center justify-center rounded-xl bg-[#ede9fe] text-[#623ac3] border border-[#623ac3]/20">
                                <User className="size-5" />
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-lg sm:text-xl font-bold text-neutral-900">
                                    Owner Details
                                  </CardTitle>
                                  <Badge
                                    variant="outline"
                                    className="border-neutral-200 bg-neutral-100 text-neutral-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
                                  >
                                    Step 1 of 2
                                  </Badge>
                                </div>
                                <CardDescription className="text-xs text-neutral-500 mt-0.5">
                                  Personal contact information & residential address of the proprietor
                                </CardDescription>
                              </div>
                            </div>

                            {isOwnerComplete && (
                              <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs hidden sm:inline-flex items-center gap-1">
                                <CheckCircle2 className="size-3" />
                                <span>Complete</span>
                              </Badge>
                            )}
                          </CardHeader>

                          <CardContent className="p-5 sm:p-7">
                            <FieldGroup className="gap-5">
                              <FieldSet className="gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Field data-invalid={!!errors.ownerName}>
                                    <FieldLabel
                                      htmlFor="ownerName"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      Owner name *
                                    </FieldLabel>
                                    <Input
                                      id="ownerName"
                                      name="ownerName"
                                      required
                                      placeholder="e.g. Ramesh Patel"
                                      value={form.ownerName}
                                      onChange={(e) =>
                                        handleFieldChange("ownerName", e.target.value)
                                      }
                                      aria-invalid={!!errors.ownerName}
                                      className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                    {errors.ownerName && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.ownerName}
                                      </FieldError>
                                    )}
                                  </Field>

                                  <Field data-invalid={!!errors.mobNo}>
                                    <FieldLabel
                                      htmlFor="mobNo"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      Mob no *
                                    </FieldLabel>
                                    <Input
                                      id="mobNo"
                                      name="mobNo"
                                      required
                                      type="tel"
                                      placeholder="e.g. +91 98765 43210"
                                      value={form.mobNo}
                                      onChange={(e) =>
                                        handleFieldChange("mobNo", e.target.value)
                                      }
                                      aria-invalid={!!errors.mobNo}
                                      className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                    {errors.mobNo && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.mobNo}
                                      </FieldError>
                                    )}
                                  </Field>
                                </div>

                                {/* South Indian States Only for Owner State */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Field data-invalid={!!errors.ownerState}>
                                    <FieldLabel
                                      htmlFor="ownerState"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      State (Owner) *
                                    </FieldLabel>
                                    <select
                                      id="ownerState"
                                      name="ownerState"
                                      required
                                      value={form.ownerState}
                                      onChange={(e) =>
                                        handleFieldChange("ownerState", e.target.value)
                                      }
                                      aria-invalid={!!errors.ownerState}
                                      className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs shadow-black/5 focus-visible:outline-none focus-visible:border-[#623ac3] focus-visible:ring-2 focus-visible:ring-[#623ac3]/25"
                                    >
                                      <option
                                        value=""
                                        disabled
                                        className="bg-neutral-950 text-neutral-500"
                                      >
                                        Select State *
                                      </option>
                                      {SOUTH_INDIAN_STATES.map((st) => (
                                        <option
                                          key={st}
                                          value={st}
                                          className="bg-white text-neutral-900"
                                        >
                                          {st}
                                        </option>
                                      ))}
                                    </select>
                                    {errors.ownerState && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.ownerState}
                                      </FieldError>
                                    )}
                                  </Field>

                                  <Field>
                                    <FieldLabel
                                      htmlFor="ownerCity"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      City / Town (Owner)
                                    </FieldLabel>
                                    <Input
                                      id="ownerCity"
                                      name="ownerCity"
                                      placeholder="e.g. Bengaluru / Chennai"
                                      value={form.ownerCity}
                                      onChange={(e) =>
                                        handleFieldChange("ownerCity", e.target.value)
                                      }
                                      className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                  </Field>
                                </div>

                                <Field data-invalid={!!errors.ownerAddress}>
                                  <FieldLabel
                                    htmlFor="ownerAddress"
                                    className="text-xs font-semibold text-neutral-200"
                                  >
                                    Address *
                                  </FieldLabel>
                                  <Input
                                    id="ownerAddress"
                                    name="ownerAddress"
                                    required
                                    placeholder="e.g. Flat 302, Green Valley Apartments, Koramangala"
                                    value={form.ownerAddress}
                                    onChange={(e) =>
                                      handleFieldChange("ownerAddress", e.target.value)
                                    }
                                    aria-invalid={!!errors.ownerAddress}
                                    className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                  />
                                  {errors.ownerAddress && (
                                    <FieldError className="text-xs text-red-400">
                                      {errors.ownerAddress}
                                    </FieldError>
                                  )}
                                </Field>
                              </FieldSet>
                            </FieldGroup>
                          </CardContent>
                        </Card>

                        {/* Step 1 Action: Next button */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-xs text-neutral-400 text-center sm:text-left">
                            <Lock className="size-4 text-violet-400 shrink-0" />
                            <span>
                              Step 1 of 2: Continue to enter your hardware shop & GST details.
                            </span>
                          </div>

                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full sm:w-auto min-w-[200px] rounded-xl bg-[#623ac3] py-3.5 px-6 text-sm font-semibold text-[#ffffff] shadow-lg shadow-black/15 transition-all hover:bg-[#522ea8] hover:shadow-xl hover:shadow-black/20 active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2"
                          >
                            <span>Next: Business Details</span>
                            <ArrowRight className="size-4" data-icon="inline-end" />
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      /* STEP 2: BUSINESS DETAILS ENTRY */
                      <motion.div
                        key="step2-business"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-6"
                      >
                        <Card className="rounded-2xl border border-neutral-200/90 bg-white p-0 shadow-xl shadow-black/5 ring-0 overflow-hidden">
                          <CardHeader className="border-b border-neutral-100 p-5 sm:p-6 bg-neutral-50/50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="flex size-9 items-center justify-center rounded-xl bg-[#ede9fe] text-[#623ac3] border border-[#623ac3]/20">
                                <Building2 className="size-5" />
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-lg sm:text-xl font-bold text-neutral-900">
                                    Business Details
                                  </CardTitle>
                                  <Badge
                                    variant="outline"
                                    className="border-neutral-200 bg-neutral-100 text-neutral-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
                                  >
                                    Step 2 of 2
                                  </Badge>
                                </div>
                                <CardDescription className="text-xs text-neutral-500 mt-0.5">
                                  Hardware shop name, GSTIN, and local delivery fulfillment address
                                </CardDescription>
                              </div>
                            </div>

                            {isBusinessComplete && (
                              <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs hidden sm:inline-flex items-center gap-1">
                                <CheckCircle2 className="size-3" />
                                <span>Complete</span>
                              </Badge>
                            )}
                          </CardHeader>

                          <CardContent className="p-5 sm:p-7">
                            <FieldGroup className="gap-5">
                              <FieldSet className="gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Field data-invalid={!!errors.shopName}>
                                    <FieldLabel
                                      htmlFor="shopName"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      Shop name *
                                    </FieldLabel>
                                    <Input
                                      id="shopName"
                                      name="shopName"
                                      required
                                      placeholder="e.g. Apex Hardware & Tech Hub"
                                      value={form.shopName}
                                      onChange={(e) =>
                                        handleFieldChange("shopName", e.target.value)
                                      }
                                      aria-invalid={!!errors.shopName}
                                      className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                    {errors.shopName && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.shopName}
                                      </FieldError>
                                    )}
                                  </Field>

                                  <Field data-invalid={!!errors.gstNumber}>
                                    <FieldLabel
                                      htmlFor="gstNumber"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      Gst number *
                                    </FieldLabel>
                                    <Input
                                      id="gstNumber"
                                      name="gstNumber"
                                      required
                                      placeholder="e.g. 29AAAAA0000A1Z5"
                                      value={form.gstNumber}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          "gstNumber",
                                          e.target.value.toUpperCase()
                                        )
                                      }
                                      aria-invalid={!!errors.gstNumber}
                                      className="h-10 text-sm font-mono uppercase bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                    {errors.gstNumber && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.gstNumber}
                                      </FieldError>
                                    )}
                                  </Field>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Field data-invalid={!!errors.mobNumber}>
                                    <FieldLabel
                                      htmlFor="mobNumber"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      Mob number *
                                    </FieldLabel>
                                    <Input
                                      id="mobNumber"
                                      name="mobNumber"
                                      required
                                      type="tel"
                                      placeholder="e.g. +91 98765 43210"
                                      value={form.mobNumber}
                                      onChange={(e) =>
                                        handleFieldChange("mobNumber", e.target.value)
                                      }
                                      aria-invalid={!!errors.mobNumber}
                                      className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                    {errors.mobNumber && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.mobNumber}
                                      </FieldError>
                                    )}
                                  </Field>

                                  <Field data-invalid={!!errors.email}>
                                    <FieldLabel
                                      htmlFor="email"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      Email *
                                    </FieldLabel>
                                    <Input
                                      id="email"
                                      name="email"
                                      required
                                      type="email"
                                      placeholder="e.g. shop@example.com"
                                      value={form.email}
                                      onChange={(e) =>
                                        handleFieldChange("email", e.target.value)
                                      }
                                      aria-invalid={!!errors.email}
                                      className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                    {errors.email && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.email}
                                      </FieldError>
                                    )}
                                  </Field>
                                </div>

                                <Field data-invalid={!!errors.address}>
                                  <div className="flex items-center justify-between">
                                    <FieldLabel
                                      htmlFor="address"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      Address *
                                    </FieldLabel>
                                    {form.ownerAddress && (
                                      <button
                                        type="button"
                                        onClick={handleCopyOwnerAddressToShop}
                                        className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
                                      >
                                        Same as owner address
                                      </button>
                                    )}
                                  </div>
                                  <Input
                                    id="address"
                                    name="address"
                                    required
                                    placeholder="e.g. Shop #12, Commercial Complex, MG Road, Bengaluru"
                                    value={form.address}
                                    onChange={(e) =>
                                      handleFieldChange("address", e.target.value)
                                    }
                                    aria-invalid={!!errors.address}
                                    className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                  />
                                  {errors.address && (
                                    <FieldError className="text-xs text-red-400">
                                      {errors.address}
                                    </FieldError>
                                  )}
                                </Field>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <Field data-invalid={!!errors.pincode}>
                                    <FieldLabel
                                      htmlFor="pincode"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      Pincode *
                                    </FieldLabel>
                                    <Input
                                      id="pincode"
                                      name="pincode"
                                      required
                                      type="text"
                                      inputMode="numeric"
                                      maxLength={6}
                                      placeholder="e.g. 560038"
                                      value={form.pincode}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          "pincode",
                                          e.target.value.replace(/\D/g, "").slice(0, 6)
                                        )
                                      }
                                      aria-invalid={!!errors.pincode}
                                      className="h-10 text-sm font-mono tracking-wider bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                    {errors.pincode && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.pincode}
                                      </FieldError>
                                    )}
                                  </Field>

                                  <Field data-invalid={!!errors.state}>
                                    <FieldLabel
                                      htmlFor="state"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      State *
                                    </FieldLabel>
                                    <select
                                      id="state"
                                      name="state"
                                      required
                                      value={form.state}
                                      onChange={(e) =>
                                        handleFieldChange("state", e.target.value)
                                      }
                                      aria-invalid={!!errors.state}
                                      className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs shadow-black/5 focus-visible:outline-none focus-visible:border-[#623ac3] focus-visible:ring-2 focus-visible:ring-[#623ac3]/25"
                                    >
                                      <option
                                        value=""
                                        disabled
                                        className="bg-neutral-950 text-neutral-500"
                                      >
                                        Select State *
                                      </option>
                                      {SOUTH_INDIAN_STATES.map((st) => (
                                        <option
                                          key={st}
                                          value={st}
                                          className="bg-white text-neutral-900"
                                        >
                                          {st}
                                        </option>
                                      ))}
                                    </select>
                                    {errors.state && (
                                      <FieldError className="text-xs text-red-400">
                                        {errors.state}
                                      </FieldError>
                                    )}
                                  </Field>

                                  <Field>
                                    <FieldLabel
                                      htmlFor="city"
                                      className="text-xs font-semibold text-neutral-200"
                                    >
                                      City / Area
                                    </FieldLabel>
                                    <Input
                                      id="city"
                                      name="city"
                                      placeholder="e.g. Indiranagar"
                                      value={form.city || ""}
                                      onChange={(e) =>
                                        handleFieldChange("city", e.target.value)
                                      }
                                      className="h-10 text-sm bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 shadow-xs shadow-black/5 focus-visible:bg-neutral-950 focus-visible:border-[#623ac3] focus-visible:ring-[#623ac3]/25"
                                    />
                                  </Field>
                                </div>

                                <FieldDescription className="text-xs text-neutral-400">
                                  Orders from buyers located within your pincode radius are automatically matched to your shop counter for instant local delivery.
                                </FieldDescription>
                              </FieldSet>
                            </FieldGroup>
                          </CardContent>
                        </Card>

                        {/* Step 2 Actions: Back and Submit buttons */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevStep}
                            className="w-full sm:w-auto border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 shadow-xs shadow-black/5 inline-flex items-center gap-1.5"
                          >
                            <ChevronLeft className="size-4" data-icon="inline-start" />
                            <span>Back: Owner Details</span>
                          </Button>

                          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <span className="text-[11px] text-neutral-400 hidden lg:inline">
                              Secure 256-bit encrypted submission
                            </span>
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full sm:w-auto min-w-[200px] rounded-xl bg-[#623ac3] py-3.5 px-6 text-sm font-semibold text-[#ffffff] shadow-lg shadow-black/15 transition-all hover:bg-[#522ea8] hover:shadow-xl hover:shadow-black/20 active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? (
                                <span>Submitting Details...</span>
                              ) : (
                                <>
                                  <span>Submit Registration</span>
                                  <ArrowRight className="size-4" data-icon="inline-end" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          ) : (
            /* Success / Application Received View in Dark Theme */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-md"
            >
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[#ede9fe] text-[#623ac3] border border-[#623ac3]/20">
                <CheckCircle2 className="size-9" />
              </div>

              <span className="text-xs font-bold tracking-wider text-[#623ac3] uppercase">
                Application Received
              </span>

              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                Welcome to Buyronix
              </h1>

              <p className="mt-3 text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
                Thank you for registering{" "}
                <strong className="text-neutral-900 font-semibold">
                  {form.shopName || "your shop"}
                </strong>
                . Our local merchant onboarding team will contact you within 24 hours to finalize verification and connect your counter to nearby buyers.
              </p>

              <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-400 max-w-xs mx-auto">
                Reference Token:{" "}
                <span className="font-mono font-bold text-neutral-900 text-sm ml-1">
                  {referenceToken}
                </span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 shadow-xs shadow-black/5"
                >
                  Register Another Shop
                </Button>
                <Link href="/">
                  <Button className="w-full sm:w-auto bg-[#623ac3] text-[#ffffff] hover:bg-[#522ea8] shadow-md shadow-black/15">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer in Dark Theme */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        © 2026 Buyronix Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
}
