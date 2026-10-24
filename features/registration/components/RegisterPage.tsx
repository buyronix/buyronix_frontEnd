"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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
  MapPin,
  TrendingUp,
  Loader2,
  LogOut,
  AlertCircle,
  Copy,
  RotateCcw,
} from "lucide-react";
import { useAuth, SellerAuthGateway } from "@/features/auth";
import { isJwtAdmin } from "@/lib/jwt";
import {
  INDIAN_STATES,
  INDIAN_GSTIN_REGEX,
  INDIAN_PINCODE_REGEX,
  isValidIndianPhone,
  type RegisterBusinessPayload,
  type StatusCheckResult,
} from "../types";
import {
  fetchBusinessStatus,
  submitBusinessRegistration,
  resubmitBusinessRegistration,
} from "../api/businessApi";
import { BusinessStatusCard } from "./BusinessStatusCard";

const initialForm: RegisterBusinessPayload = {
  shopName: "",
  gstNumber: "",
  mobNumber: "",
  email: "",
  address: "",
  pincode: "",
  state: "",
  city: "",
  ownerName: "",
  mobNo: "",
  ownerState: "",
  ownerCity: "",
  ownerAddress: "",
};

type FormErrors = Partial<Record<keyof RegisterBusinessPayload, string>> & {
  general?: string;
  conflict?: string;
};

export function RegisterPage() {
  const {
    user,
    accessToken,
    isLoading: isAuthLoading,
    authError,
    signInWithGoogle,
    signOut,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");
  const effectiveAuthError = oauthErrorDescription || oauthError || authError;

  // If user is an admin, redirect to admin page by default
  React.useEffect(() => {
    const appRole = user?.app_metadata?.role;
    const appRoles = user?.app_metadata?.roles;
    const isAdmin =
      isJwtAdmin(accessToken) ||
      appRole === "admin" ||
      (Array.isArray(appRole) && appRole.includes("admin")) ||
      (Array.isArray(appRoles) && appRoles.includes("admin"));

    if (isAdmin) {
      router.replace("/admin");
    }
  }, [accessToken, user, router]);

  const [form, setForm] = React.useState<RegisterBusinessPayload>(initialForm);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Sync checkboxes for auto-filling
  const [sameAsShopMobile, setSameAsShopMobile] = React.useState(false);
  const [sameAsShopAddress, setSameAsShopAddress] = React.useState(false);

  // Status check for authenticated seller
  const [statusResult, setStatusResult] = React.useState<StatusCheckResult | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = React.useState<boolean>(false);

  // Resubmission mode when application was rejected
  const [isResubmitMode, setIsResubmitMode] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState<string | null>(null);

  // Sync Google user profile details into the form
  React.useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      setForm((prev) => {
        if (prev.email && prev.ownerName) return prev;
        return {
          ...prev,
          email: prev.email || user.email || "",
          ownerName:
            prev.ownerName ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "",
        };
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  // Check if authenticated seller already has a registered business
  const checkStatus = React.useCallback(async () => {
    if (!accessToken) return;
    setIsCheckingStatus(true);
    try {
      const result = await fetchBusinessStatus(accessToken);
      setStatusResult(result);
      if (result.found && result.status?.verification_status !== "REJECTED") {
        setIsResubmitMode(false);
      }
    } catch (err) {
      console.error("Failed to check business status:", err);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [accessToken]);

  React.useEffect(() => {
    if (!user || !accessToken) {
      return;
    }

    let isCancelled = false;
    fetchBusinessStatus(accessToken).then((result) => {
      if (!isCancelled) {
        setStatusResult(result);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [user, accessToken]);

  // Handler to initiate resubmission when rejected
  const handleStartResubmit = React.useCallback(() => {
    if (!statusResult?.details && !statusResult?.status) return;

    const details = statusResult.details;
    const status = statusResult.status;

    setForm({
      shopName:
        details?.shop_name ||
        status?.shop_name ||
        (details as { business_name?: string })?.business_name ||
        "",
      gstNumber: details?.gst_number || "",
      mobNumber:
        details?.mob_number ||
        (details as { mobile_number?: string })?.mobile_number ||
        "",
      email: details?.email || user?.email || "",
      address:
        details?.address ||
        (details as { address_line?: string })?.address_line ||
        "",
      pincode: details?.pincode || "",
      state: details?.state || "",
      city: details?.city || "",
      ownerName: details?.owner_name || user?.user_metadata?.full_name || "",
      mobNo: details?.mob_no || details?.mob_number || "",
      ownerState: details?.owner_state || details?.state || "",
      ownerCity: details?.owner_city || details?.city || "",
      ownerAddress: details?.owner_address || details?.address || "",
    });

    setRejectionReason(status?.rejection_reason || null);
    setIsResubmitMode(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [statusResult, user]);

  // Handler to cancel resubmission and return to status card
  const handleCancelResubmit = () => {
    setIsResubmitMode(false);
    setErrors({});
  };

  // Section 1 validation: Shop Details
  const isShopComplete = Boolean(
    form.shopName.trim().length >= 2 &&
      INDIAN_GSTIN_REGEX.test(form.gstNumber.trim().toUpperCase()) &&
      isValidIndianPhone(form.mobNumber) &&
      form.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
      form.address.trim().length >= 3 &&
      INDIAN_PINCODE_REGEX.test(form.pincode.trim()) &&
      form.state.trim() &&
      form.city.trim().length >= 2
  );

  // Section 2 validation: Owner Details
  const isOwnerComplete = Boolean(
    form.ownerName.trim().length >= 2 &&
      isValidIndianPhone(form.mobNo) &&
      form.ownerState.trim() &&
      form.ownerCity.trim().length >= 2 &&
      form.ownerAddress.trim().length >= 3
  );

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};

    // Section 1: Shop Details
    if (!form.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    } else if (form.shopName.trim().length < 2) {
      newErrors.shopName = "Shop name must be at least 2 characters";
    }

    if (!form.gstNumber.trim()) {
      newErrors.gstNumber = "GSTIN is required";
    } else if (!INDIAN_GSTIN_REGEX.test(form.gstNumber.trim().toUpperCase())) {
      newErrors.gstNumber =
        "Valid 15-character GSTIN is required (e.g. 29AAAAA0000A1Z5)";
    }

    if (!form.mobNumber.trim()) {
      newErrors.mobNumber = "Shop mobile number is required";
    } else if (!isValidIndianPhone(form.mobNumber)) {
      newErrors.mobNumber =
        "Enter a valid 10-digit Indian phone (e.g. +91 98765 43210 or 9876543210)";
    }

    if (!form.email.trim()) {
      newErrors.email = "Shop email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.address.trim()) {
      newErrors.address = "Shop address is required";
    } else if (form.address.trim().length < 3) {
      newErrors.address = "Shop address must be at least 3 characters";
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = "6-digit Indian PIN code is required";
    } else if (!INDIAN_PINCODE_REGEX.test(form.pincode.trim())) {
      newErrors.pincode = "Must be a valid 6-digit Indian PIN (e.g. 560038)";
    }

    if (!form.state.trim()) {
      newErrors.state = "Please select a state";
    }

    if (!form.city.trim()) {
      newErrors.city = "City / Locality is required";
    } else if (form.city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters";
    }

    // Section 2: Owner Details
    if (!form.ownerName.trim()) {
      newErrors.ownerName = "Owner full name is required";
    } else if (form.ownerName.trim().length < 2) {
      newErrors.ownerName = "Owner name must be at least 2 characters";
    }

    if (!form.mobNo.trim()) {
      newErrors.mobNo = "Owner mobile number is required";
    } else if (!isValidIndianPhone(form.mobNo)) {
      newErrors.mobNo =
        "Enter a valid 10-digit Indian phone (e.g. +91 98765 43210 or 9876543210)";
    }

    if (!form.ownerState.trim()) {
      newErrors.ownerState = "Owner state is required";
    }

    if (!form.ownerCity.trim()) {
      newErrors.ownerCity = "Owner city is required";
    } else if (form.ownerCity.trim().length < 2) {
      newErrors.ownerCity = "Owner city must be at least 2 characters";
    }

    if (!form.ownerAddress.trim()) {
      newErrors.ownerAddress = "Owner residential address is required";
    } else if (form.ownerAddress.trim().length < 3) {
      newErrors.ownerAddress = "Owner address must be at least 3 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const token = accessToken || "";
      const result = isResubmitMode
        ? await resubmitBusinessRegistration(token, form)
        : await submitBusinessRegistration(token, form);

      if (result.success) {
        setSubmitted(true);
        setIsResubmitMode(false);
        // Refresh status in background
        checkStatus();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result.isConflict) {
        setErrors({
          conflict:
            result.message ||
            "A business registration already exists for this account or GSTIN.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result.errors && result.errors.length > 0) {
        const fieldErrors: FormErrors = {};
        result.errors.forEach((err) => {
          fieldErrors[err.field as keyof RegisterBusinessPayload] = err.message;
        });
        setErrors({
          ...fieldErrors,
          general:
            result.message ||
            "Validation failed. Please correct the highlighted fields below.",
        });
        // Scroll to the first errored field
        const firstField = result.errors[0]?.field;
        if (firstField) {
          const el = document.getElementById(firstField);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
          }
        }
      } else {
        setErrors({
          general:
            result.message ||
            "Failed to submit registration. Please verify details and try again.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during submission.";
      setErrors({
        general: message,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsResubmitMode(false);
    setSameAsShopMobile(false);
    setSameAsShopAddress(false);
    setForm({
      ...initialForm,
      email: user?.email || "",
      ownerName: user?.user_metadata?.full_name || "",
    });
    setErrors({});
  };

  const handleFieldChange = (
    field: keyof RegisterBusinessPayload,
    value: string
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // If "Same as shop mobile" is active and shop mobile changes, keep owner mobile in sync
      if (field === "mobNumber" && sameAsShopMobile) {
        next.mobNo = value;
      }
      // If "Same as shop address" is active and shop address changes, keep owner address in sync
      if (field === "address" && sameAsShopAddress) {
        next.ownerAddress = value;
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Toggle "Same as shop mobile"
  const handleToggleSameMobile = (checked: boolean) => {
    setSameAsShopMobile(checked);
    if (checked) {
      setForm((prev) => ({
        ...prev,
        mobNo: prev.mobNumber,
      }));
      setErrors((prev) => ({ ...prev, mobNo: undefined }));
    }
  };

  // Toggle or auto-fill "Same as shop address"
  const handleCopyShopAddressToOwner = () => {
    setSameAsShopAddress(true);
    setForm((prev) => ({
      ...prev,
      ownerAddress: prev.address || prev.ownerAddress,
      ownerState: prev.state || prev.ownerState,
      ownerCity: prev.city || prev.ownerCity,
    }));
    setErrors((prev) => ({
      ...prev,
      ownerAddress: undefined,
      ownerState: undefined,
      ownerCity: undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-rose-500/20 selection:text-rose-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          <Link
            href="/"
            className="group flex items-center text-2xl sm:text-3xl font-extrabold italic tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span>buyronix</span>
            <span className="not-italic text-[#e11d48] transition-transform group-hover:scale-125 ml-0.5">
              .
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 inline-flex items-center gap-1.5"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-neutral-900"
            >
              <ArrowLeft className="size-4" data-icon="inline-start" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
        {/* State 1: Checking Authentication Session */}
        {isAuthLoading ? (
          <div className="mx-auto max-w-md py-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-950/60 border border-rose-500/20 text-[#e11d48]">
              <Loader2 className="size-7 animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Verifying Seller Credentials...
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Connecting to Supabase Auth session
              </p>
            </div>
          </div>
        ) : !user ? (
          /* State 2: Unauthenticated Seller -> Show Google Auth Gateway */
          <SellerAuthGateway
            onSignInWithGoogle={() => signInWithGoogle()}
            isLoading={false}
            errorMessage={effectiveAuthError}
          />
        ) : isCheckingStatus ? (
          /* State 3: Checking if registered business exists for this user */
          <div className="mx-auto max-w-md py-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800 text-rose-500">
              <Loader2 className="size-7 animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Checking Merchant Profile...
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Fetching existing business registrations
              </p>
            </div>
          </div>
        ) : statusResult?.found && statusResult.status && !isResubmitMode && !submitted ? (
          /* State 4: User already has registered a business (PENDING / APPROVED / REJECTED) */
          <BusinessStatusCard
            status={statusResult.status}
            details={statusResult.details}
            onRefresh={checkStatus}
            onSignOut={signOut}
            onResubmit={handleStartResubmit}
            isRefreshing={isCheckingStatus}
          />
        ) : (
          /* State 5: Authenticated Seller Registration Form (New or Resubmission) */
          <div className="mx-auto max-w-7xl">
            {!submitted ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Brand & Value Props */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col justify-center gap-8 order-1"
                >
                  <div>
                    <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#e11d48] uppercase mb-3">
                      {isResubmitMode
                        ? "APPLICATION REVISION"
                        : "BUILT AROUND YOUR BUSINESS"}
                    </p>

                    <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                      {isResubmitMode ? (
                        <>
                          Update details. <br className="hidden sm:inline" />
                          <span className="text-[#e11d48]">Resubmit shop.</span>
                        </>
                      ) : (
                        <>
                          Stay local. <br className="hidden sm:inline" />
                          <span className="text-[#e11d48]">Reach further.</span>
                        </>
                      )}
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
                      {isResubmitMode
                        ? "Review the admin feedback, make necessary corrections to your shop or owner details, and resubmit for priority verification."
                        : "From PC components to everyday electronics, your inventory deserves more than passing footfall. Register in under 3 minutes."}
                    </p>
                  </div>

                  {/* Value Points */}
                  <div className="flex flex-col gap-6 pt-1">
                    {[
                      {
                        icon: MapPin,
                        title: "Get discovered nearby",
                        description:
                          "Connect with customers in your neighborhood looking for what you sell.",
                      },
                      {
                        icon: Store,
                        title: "Your shop, online",
                        description:
                          "Bring your local reputation and hardware expertise to a digital storefront.",
                      },
                      {
                        icon: TrendingUp,
                        title: "Fast verification",
                        description:
                          "Our merchant onboarding team verifies your GSTIN within 24 hours.",
                      },
                    ].map((point, index) => {
                      const Icon = point.icon;
                      return (
                        <motion.div
                          key={point.title}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                          className="flex items-start gap-4 group"
                        >
                          <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-rose-950/80 text-[#e11d48] border border-rose-500/20 transition-colors group-hover:border-rose-500/50 group-hover:bg-[#e11d48] group-hover:text-white">
                            <Icon className="size-5 sm:size-6 stroke-[2]" />
                          </div>
                          <div className="flex flex-col gap-1 pt-0.5">
                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                              {point.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                              {point.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Right Column: Registration Form */}
                <div className="lg:col-span-7 flex flex-col gap-6 order-2">
                  {/* Google Authenticated Seller Info Header */}
                  <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-3.5">
                      {user.user_metadata?.avatar_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Google Seller Avatar"
                          className="size-11 rounded-full border border-neutral-700 object-cover"
                        />
                      ) : (
                        <div className="size-11 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold text-base">
                          {(user.user_metadata?.full_name || user.email || "S")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {user.user_metadata?.full_name || "Merchant"}
                          </span>
                          <Badge className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 font-semibold">
                            Google Verified
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={signOut}
                        className="text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/80"
                      >
                        Switch Account
                      </Button>
                    </div>
                  </div>

                  {/* Resubmission Rejection Notice Banner */}
                  {isResubmitMode && rejectionReason && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-rose-500/40 bg-rose-950/50 p-5 shadow-lg backdrop-blur-md text-sm text-rose-200 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
                          <AlertCircle className="size-5 shrink-0 text-rose-400" />
                          <span>Admin Review Feedback (Revision Needed):</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelResubmit}
                          className="text-xs text-neutral-400 hover:text-white"
                        >
                          Cancel Revision
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-200 pl-7 leading-relaxed font-mono bg-neutral-950/60 p-3 rounded-xl border border-rose-500/20">
                        &quot;{rejectionReason}&quot;
                      </p>
                      <p className="text-[11px] text-rose-300 pl-7">
                        Pre-filled with your previous submission. Update any inaccurate fields and click Resubmit below.
                      </p>
                    </motion.div>
                  )}

                  {/* 409 Conflict Banner with Link to Check Status */}
                  {errors.conflict && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-5 shadow-lg backdrop-blur-md text-sm text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="size-5 shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-300 text-sm">
                            Application Already Registered
                          </p>
                          <p className="text-xs text-neutral-300 mt-1">
                            {errors.conflict}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={checkStatus}
                        className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shrink-0"
                      >
                        Check Current Status
                      </Button>
                    </motion.div>
                  )}

                  {/* General Error Banner */}
                  {errors.general && !errors.conflict && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-200 flex items-start gap-2.5">
                      <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  {/* Form Container */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* ========================================================
                        SECTION 1: SHOP DETAILS
                        ======================================================== */}
                    <Card className="rounded-2xl border-neutral-800 bg-neutral-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
                      <CardHeader className="p-5 sm:p-7 border-b border-neutral-800/80 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-950/80 text-[#e11d48] border border-rose-500/20">
                            <Store className="size-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base sm:text-lg font-bold text-white">
                                Section 1: Shop Details
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="border-neutral-700 bg-neutral-950/70 text-neutral-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
                              >
                                Store Info
                              </Badge>
                            </div>
                            <CardDescription className="text-xs text-neutral-400 mt-0.5">
                              Official trade name, GSTIN & verified storefront location
                            </CardDescription>
                          </div>
                        </div>

                        {isShopComplete && (
                          <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs hidden sm:inline-flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            <span>Complete</span>
                          </Badge>
                        )}
                      </CardHeader>

                      <CardContent className="p-5 sm:p-7">
                        <FieldGroup className="gap-5">
                          <FieldSet className="gap-4">
                            {/* Shop Name & GSTIN */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field data-invalid={!!errors.shopName}>
                                <FieldLabel
                                  htmlFor="shopName"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  Shop Name *
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
                                  className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.shopName && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.shopName}
                                  </FieldError>
                                )}
                              </Field>

                              <Field data-invalid={!!errors.gstNumber}>
                                <FieldLabel
                                  htmlFor="gstNumber"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  GSTIN (15 Characters) *
                                </FieldLabel>
                                <Input
                                  id="gstNumber"
                                  name="gstNumber"
                                  required
                                  maxLength={15}
                                  placeholder="e.g. 29AAAAA0000A1Z5"
                                  value={form.gstNumber}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "gstNumber",
                                      e.target.value.toUpperCase()
                                    )
                                  }
                                  aria-invalid={!!errors.gstNumber}
                                  className="h-10 text-sm font-mono uppercase bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.gstNumber && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.gstNumber}
                                  </FieldError>
                                )}
                              </Field>
                            </div>

                            {/* Shop Mobile & Shop Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field data-invalid={!!errors.mobNumber}>
                                <FieldLabel
                                  htmlFor="mobNumber"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  Shop Mobile *
                                </FieldLabel>
                                <Input
                                  id="mobNumber"
                                  name="mobNumber"
                                  required
                                  type="tel"
                                  placeholder="e.g. +91 98765 43210 or 9876543210"
                                  value={form.mobNumber}
                                  onChange={(e) =>
                                    handleFieldChange("mobNumber", e.target.value)
                                  }
                                  aria-invalid={!!errors.mobNumber}
                                  className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.mobNumber && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.mobNumber}
                                  </FieldError>
                                )}
                              </Field>

                              <Field data-invalid={!!errors.email}>
                                <FieldLabel
                                  htmlFor="email"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  Shop Email *
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
                                  className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.email && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.email}
                                  </FieldError>
                                )}
                              </Field>
                            </div>

                            {/* Shop Address */}
                            <Field data-invalid={!!errors.address}>
                              <FieldLabel
                                htmlFor="address"
                                className="text-xs font-semibold text-neutral-200"
                              >
                                Shop Address (Street, Complex, Door #) *
                              </FieldLabel>
                              <Input
                                id="address"
                                name="address"
                                required
                                placeholder="e.g. Shop #12, Commercial Complex, MG Road"
                                value={form.address}
                                onChange={(e) =>
                                  handleFieldChange("address", e.target.value)
                                }
                                aria-invalid={!!errors.address}
                                className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                              />
                              {errors.address && (
                                <FieldError className="text-xs text-rose-400">
                                  {errors.address}
                                </FieldError>
                              )}
                            </Field>

                            {/* Pincode, City / Locality, State */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <Field data-invalid={!!errors.pincode}>
                                <FieldLabel
                                  htmlFor="pincode"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  Pincode (6 Digits) *
                                </FieldLabel>
                                <Input
                                  id="pincode"
                                  name="pincode"
                                  required
                                  maxLength={6}
                                  placeholder="e.g. 560038"
                                  value={form.pincode}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "pincode",
                                      e.target.value.replace(/\D/g, "")
                                    )
                                  }
                                  aria-invalid={!!errors.pincode}
                                  className="h-10 text-sm font-mono bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.pincode && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.pincode}
                                  </FieldError>
                                )}
                              </Field>

                              <Field data-invalid={!!errors.city}>
                                <FieldLabel
                                  htmlFor="city"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  City / Locality *
                                </FieldLabel>
                                <Input
                                  id="city"
                                  name="city"
                                  required
                                  placeholder="e.g. Indiranagar / Bengaluru"
                                  value={form.city}
                                  onChange={(e) =>
                                    handleFieldChange("city", e.target.value)
                                  }
                                  aria-invalid={!!errors.city}
                                  className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.city && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.city}
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
                                  className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-[#e11d48] focus-visible:ring-2 focus-visible:ring-[#e11d48]/25"
                                >
                                  <option
                                    value=""
                                    disabled
                                    className="bg-neutral-950 text-neutral-500"
                                  >
                                    Select State *
                                  </option>
                                  {INDIAN_STATES.map((st) => (
                                    <option
                                      key={st}
                                      value={st}
                                      className="bg-neutral-950 text-white"
                                    >
                                      {st}
                                    </option>
                                  ))}
                                </select>
                                {errors.state && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.state}
                                  </FieldError>
                                )}
                              </Field>
                            </div>
                          </FieldSet>
                        </FieldGroup>
                      </CardContent>
                    </Card>

                    {/* ========================================================
                        SECTION 2: OWNER DETAILS
                        ======================================================== */}
                    <Card className="rounded-2xl border-neutral-800 bg-neutral-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
                      <CardHeader className="p-5 sm:p-7 border-b border-neutral-800/80 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-950/80 text-[#e11d48] border border-rose-500/20">
                            <User className="size-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base sm:text-lg font-bold text-white">
                                Section 2: Owner Details
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="border-neutral-700 bg-neutral-950/70 text-neutral-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
                              >
                                Proprietor
                              </Badge>
                            </div>
                            <CardDescription className="text-xs text-neutral-400 mt-0.5">
                              Proprietor identification & official residential address
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
                            {/* Owner Name & Owner Mobile */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field data-invalid={!!errors.ownerName}>
                                <FieldLabel
                                  htmlFor="ownerName"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  Owner Full Name *
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
                                  className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.ownerName && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.ownerName}
                                  </FieldError>
                                )}
                              </Field>

                              <Field data-invalid={!!errors.mobNo}>
                                <div className="flex items-center justify-between">
                                  <FieldLabel
                                    htmlFor="mobNo"
                                    className="text-xs font-semibold text-neutral-200"
                                  >
                                    Owner Mobile *
                                  </FieldLabel>
                                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-neutral-400 hover:text-white select-none">
                                    <input
                                      type="checkbox"
                                      checked={sameAsShopMobile}
                                      onChange={(e) =>
                                        handleToggleSameMobile(e.target.checked)
                                      }
                                      className="size-3.5 rounded border-neutral-700 bg-neutral-950 text-[#e11d48] accent-[#e11d48]"
                                    />
                                    <span>Same as shop mobile</span>
                                  </label>
                                </div>
                                <Input
                                  id="mobNo"
                                  name="mobNo"
                                  required
                                  type="tel"
                                  placeholder="e.g. +91 98765 43210 or 9876543210"
                                  value={form.mobNo}
                                  onChange={(e) => {
                                    setSameAsShopMobile(false);
                                    handleFieldChange("mobNo", e.target.value);
                                  }}
                                  aria-invalid={!!errors.mobNo}
                                  className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.mobNo && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.mobNo}
                                  </FieldError>
                                )}
                              </Field>
                            </div>

                            {/* Owner Residential Address */}
                            <Field data-invalid={!!errors.ownerAddress}>
                              <div className="flex items-center justify-between">
                                <FieldLabel
                                  htmlFor="ownerAddress"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  Owner Residential Address *
                                </FieldLabel>
                                {form.address && (
                                  <button
                                    type="button"
                                    onClick={handleCopyShopAddressToOwner}
                                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <Copy className="size-3" />
                                    <span>Same as shop address</span>
                                  </button>
                                )}
                              </div>
                              <Input
                                id="ownerAddress"
                                name="ownerAddress"
                                required
                                placeholder="e.g. Flat 302, Green Valley Apartments, Koramangala"
                                value={form.ownerAddress}
                                onChange={(e) => {
                                  setSameAsShopAddress(false);
                                  handleFieldChange("ownerAddress", e.target.value);
                                }}
                                aria-invalid={!!errors.ownerAddress}
                                className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                              />
                              {errors.ownerAddress && (
                                <FieldError className="text-xs text-rose-400">
                                  {errors.ownerAddress}
                                </FieldError>
                              )}
                            </Field>

                            {/* Owner City & Owner State */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field data-invalid={!!errors.ownerCity}>
                                <FieldLabel
                                  htmlFor="ownerCity"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  Owner City *
                                </FieldLabel>
                                <Input
                                  id="ownerCity"
                                  name="ownerCity"
                                  required
                                  placeholder="e.g. Bengaluru"
                                  value={form.ownerCity}
                                  onChange={(e) =>
                                    handleFieldChange("ownerCity", e.target.value)
                                  }
                                  aria-invalid={!!errors.ownerCity}
                                  className="h-10 text-sm bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-950 focus-visible:border-[#e11d48] focus-visible:ring-[#e11d48]/25"
                                />
                                {errors.ownerCity && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.ownerCity}
                                  </FieldError>
                                )}
                              </Field>

                              <Field data-invalid={!!errors.ownerState}>
                                <FieldLabel
                                  htmlFor="ownerState"
                                  className="text-xs font-semibold text-neutral-200"
                                >
                                  Owner State *
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
                                  className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-[#e11d48] focus-visible:ring-2 focus-visible:ring-[#e11d48]/25"
                                >
                                  <option
                                    value=""
                                    disabled
                                    className="bg-neutral-950 text-neutral-500"
                                  >
                                    Select State *
                                  </option>
                                  {INDIAN_STATES.map((st) => (
                                    <option
                                      key={st}
                                      value={st}
                                      className="bg-neutral-950 text-white"
                                    >
                                      {st}
                                    </option>
                                  ))}
                                </select>
                                {errors.ownerState && (
                                  <FieldError className="text-xs text-rose-400">
                                    {errors.ownerState}
                                  </FieldError>
                                )}
                              </Field>
                            </div>
                          </FieldSet>
                        </FieldGroup>
                      </CardContent>
                    </Card>

                    {/* Submit Actions Footer Card */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-neutral-400 flex items-center gap-2">
                        {isResubmitMode ? (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancelResubmit}
                            className="text-neutral-400 hover:text-white text-xs inline-flex items-center gap-1.5"
                          >
                            <RotateCcw className="size-3.5" />
                            <span>Cancel Revision</span>
                          </Button>
                        ) : (
                          <span>
                            Protected submission via Supabase JWT
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto min-w-[220px] rounded-xl bg-[#e11d48] py-3.5 px-6 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-[#c9183d] hover:shadow-rose-600/40 active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              <span>
                                {isResubmitMode
                                  ? "Submitting Revisions..."
                                  : "Submitting Application..."}
                              </span>
                            </>
                          ) : (
                            <>
                              <span>
                                {isResubmitMode
                                  ? "Update & Resubmit Application"
                                  : "Submit Registration"}
                              </span>
                              <ArrowRight className="size-4" data-icon="inline-end" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* Success / Application Received View (status: PENDING) */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-md"
              >
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-rose-950/70 text-[#e11d48] border border-rose-500/30">
                  <CheckCircle2 className="size-9" />
                </div>

                <span className="text-xs font-bold tracking-wider text-[#e11d48] uppercase">
                  Application Under Review
                </span>

                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Welcome to Buyronix
                </h1>

                <p className="mt-3 text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
                  Thank you for registering{" "}
                  <strong className="text-white font-semibold">
                    {form.shopName || "your shop"}
                  </strong>
                  . Our merchant verification desk is reviewing your GSTIN and storefront details. Most applications are approved within 24 hours.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  >
                    Register Another Shop
                  </Button>
                  <Button
                    onClick={checkStatus}
                    variant="outline"
                    className="border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  >
                    View Application Status
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
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        © 2026 Buyronix Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
}
