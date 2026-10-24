"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import {
  CheckCircle2,
  Store,
  ArrowRight,
  User,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Copy,
} from "lucide-react";
import { useAuth, GoogleSignInButton } from "@/features/auth";
import {
  INDIAN_STATES,
  INDIAN_GSTIN_REGEX,
  INDIAN_PINCODE_REGEX,
  isValidIndianPhone,
  type RegisterBusinessPayload,
} from "../types";
import { submitBusinessRegistration } from "../api/businessApi";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
}

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

export function RegisterModal({
  open,
  onOpenChange,
}: RegisterModalProps) {
  const { user, accessToken, signInWithGoogle } = useAuth();
  const [form, setForm] = React.useState<RegisterBusinessPayload>(initialForm);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sameAsShopMobile, setSameAsShopMobile] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        email: prev.email || user.email || "",
        ownerName:
          prev.ownerName ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "",
      }));
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  const handleFieldChange = (
    field: keyof RegisterBusinessPayload,
    value: string
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "mobNumber" && sameAsShopMobile) {
        next.mobNo = value;
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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

  const handleCopyShopAddress = () => {
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

  const validate = (): boolean => {
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
      newErrors.gstNumber = "Valid 15-character GSTIN is required (e.g. 29AAAAA0000A1Z5)";
    }

    if (!form.mobNumber.trim()) {
      newErrors.mobNumber = "Shop mobile number is required";
    } else if (!isValidIndianPhone(form.mobNumber)) {
      newErrors.mobNumber = "Enter a valid 10-digit Indian phone (e.g. +91 98765 43210)";
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
      newErrors.city = "City is required";
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
      newErrors.mobNo = "Enter a valid 10-digit Indian phone (e.g. +91 98765 43210)";
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await submitBusinessRegistration(accessToken || "", form);
      if (res.success) {
        setSubmitted(true);
      } else if (res.isConflict) {
        setErrors({
          conflict:
            res.message ||
            "A business registration already exists for this account or GSTIN.",
        });
      } else if (res.errors && res.errors.length > 0) {
        const fieldErrors: FormErrors = {};
        res.errors.forEach((err) => {
          fieldErrors[err.field as keyof RegisterBusinessPayload] = err.message;
        });
        setErrors({
          ...fieldErrors,
          general: res.message || "Please correct the highlighted fields.",
        });
      } else {
        setErrors({
          general: res.message || "Registration failed. Please check the fields.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSameAsShopMobile(false);
    setForm({
      ...initialForm,
      email: user?.email || "",
      ownerName: user?.user_metadata?.full_name || "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-neutral-950 border border-neutral-800 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-rose-950/80 text-[#e11d48] border border-rose-500/20">
                  <Store className="size-4" />
                </span>
                <span className="text-xs font-bold tracking-wider text-[#e11d48] uppercase">
                  Partner with Buyronix
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white">
                Register Your Hardware Shop
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-400">
                Join verified neighborhood hardware sellers and bring your inventory
                closer to nearby buyers with fast verification.
              </DialogDescription>
            </DialogHeader>

            {/* Google Authentication Gateway / User Badge */}
            {!user ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-rose-400" />
                  <span className="text-xs font-semibold text-white">
                    Google Sign-In Required for Sellers
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Please sign in with Google to authenticate merchant identity before submitting registration.
                </p>
                <GoogleSignInButton
                  onSignIn={() => signInWithGoogle()}
                  label="Sign in with Google to continue"
                  className="w-full"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5">
                    Google Verified
                  </Badge>
                  <span className="text-neutral-300 truncate max-w-[200px]">
                    {user.email}
                  </span>
                </div>
              </div>
            )}

            {errors.conflict && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-950/40 p-3 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{errors.conflict}</span>
              </div>
            )}

            {errors.general && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            {user && (
              <FieldGroup className="gap-5 py-1">
                {/* SECTION 1: SHOP DETAILS */}
                <FieldSet className="gap-3.5">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-800">
                    <Store className="size-4 text-[#e11d48]" />
                    <FieldLegend className="text-xs font-bold uppercase tracking-wider text-white m-0">
                      Section 1: Shop Details
                    </FieldLegend>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field data-invalid={!!errors.shopName}>
                      <FieldLabel htmlFor="modal-shopName" className="text-xs font-semibold text-neutral-200">
                        Shop Name *
                      </FieldLabel>
                      <Input
                        id="modal-shopName"
                        name="shopName"
                        required
                        placeholder="e.g. Apex Hardware & Tech Hub"
                        value={form.shopName}
                        onChange={(e) =>
                          handleFieldChange("shopName", e.target.value)
                        }
                        aria-invalid={!!errors.shopName}
                        className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.shopName && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.shopName}
                        </FieldError>
                      )}
                    </Field>

                    <Field data-invalid={!!errors.gstNumber}>
                      <FieldLabel htmlFor="modal-gstNumber" className="text-xs font-semibold text-neutral-200">
                        GSTIN *
                      </FieldLabel>
                      <Input
                        id="modal-gstNumber"
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
                        className="h-9 text-xs font-mono uppercase bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.gstNumber && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.gstNumber}
                        </FieldError>
                      )}
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field data-invalid={!!errors.mobNumber}>
                      <FieldLabel htmlFor="modal-mobNumber" className="text-xs font-semibold text-neutral-200">
                        Shop Mobile *
                      </FieldLabel>
                      <Input
                        id="modal-mobNumber"
                        name="mobNumber"
                        required
                        type="tel"
                        placeholder="e.g. +91 98765 43210 or 9876543210"
                        value={form.mobNumber}
                        onChange={(e) =>
                          handleFieldChange("mobNumber", e.target.value)
                        }
                        aria-invalid={!!errors.mobNumber}
                        className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.mobNumber && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.mobNumber}
                        </FieldError>
                      )}
                    </Field>

                    <Field data-invalid={!!errors.email}>
                      <FieldLabel htmlFor="modal-email" className="text-xs font-semibold text-neutral-200">
                        Shop Email *
                      </FieldLabel>
                      <Input
                        id="modal-email"
                        name="email"
                        required
                        type="email"
                        placeholder="e.g. shop@example.com"
                        value={form.email}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        aria-invalid={!!errors.email}
                        className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.email && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.email}
                        </FieldError>
                      )}
                    </Field>
                  </div>

                  <Field data-invalid={!!errors.address}>
                    <FieldLabel htmlFor="modal-address" className="text-xs font-semibold text-neutral-200">
                      Shop Address *
                    </FieldLabel>
                    <Input
                      id="modal-address"
                      name="address"
                      required
                      placeholder="e.g. Shop #12, Commercial Complex, MG Road"
                      value={form.address}
                      onChange={(e) =>
                        handleFieldChange("address", e.target.value)
                      }
                      aria-invalid={!!errors.address}
                      className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                    />
                    {errors.address && (
                      <FieldError className="text-[11px] text-rose-400">
                        {errors.address}
                      </FieldError>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field data-invalid={!!errors.pincode}>
                      <FieldLabel htmlFor="modal-pincode" className="text-xs font-semibold text-neutral-200">
                        Pincode *
                      </FieldLabel>
                      <Input
                        id="modal-pincode"
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
                        className="h-9 text-xs font-mono bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.pincode && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.pincode}
                        </FieldError>
                      )}
                    </Field>

                    <Field data-invalid={!!errors.city}>
                      <FieldLabel htmlFor="modal-city" className="text-xs font-semibold text-neutral-200">
                        City / Locality *
                      </FieldLabel>
                      <Input
                        id="modal-city"
                        name="city"
                        required
                        placeholder="e.g. Indiranagar"
                        value={form.city}
                        onChange={(e) =>
                          handleFieldChange("city", e.target.value)
                        }
                        aria-invalid={!!errors.city}
                        className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.city && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.city}
                        </FieldError>
                      )}
                    </Field>

                    <Field data-invalid={!!errors.state}>
                      <FieldLabel htmlFor="modal-state" className="text-xs font-semibold text-neutral-200">
                        State *
                      </FieldLabel>
                      <select
                        id="modal-state"
                        name="state"
                        required
                        value={form.state}
                        onChange={(e) =>
                          handleFieldChange("state", e.target.value)
                        }
                        aria-invalid={!!errors.state}
                        className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white focus-visible:outline-none focus-visible:border-[#e11d48] focus-visible:ring-1 focus-visible:ring-[#e11d48]"
                      >
                        <option value="" disabled className="bg-neutral-950 text-neutral-500">
                          Select State *
                        </option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st} className="bg-neutral-950 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.state}
                        </FieldError>
                      )}
                    </Field>
                  </div>
                </FieldSet>

                {/* SECTION 2: OWNER DETAILS */}
                <FieldSet className="gap-3.5 pt-2 border-t border-neutral-800">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-800">
                    <User className="size-4 text-[#e11d48]" />
                    <FieldLegend className="text-xs font-bold uppercase tracking-wider text-white m-0">
                      Section 2: Owner Details
                    </FieldLegend>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field data-invalid={!!errors.ownerName}>
                      <FieldLabel htmlFor="modal-ownerName" className="text-xs font-semibold text-neutral-200">
                        Owner Full Name *
                      </FieldLabel>
                      <Input
                        id="modal-ownerName"
                        name="ownerName"
                        required
                        placeholder="e.g. Ramesh Patel"
                        value={form.ownerName}
                        onChange={(e) =>
                          handleFieldChange("ownerName", e.target.value)
                        }
                        aria-invalid={!!errors.ownerName}
                        className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.ownerName && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.ownerName}
                        </FieldError>
                      )}
                    </Field>

                    <Field data-invalid={!!errors.mobNo}>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="modal-mobNo" className="text-xs font-semibold text-neutral-200">
                          Owner Mobile *
                        </FieldLabel>
                        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-neutral-400 hover:text-white select-none">
                          <input
                            type="checkbox"
                            checked={sameAsShopMobile}
                            onChange={(e) =>
                              handleToggleSameMobile(e.target.checked)
                            }
                            className="size-3 rounded border-neutral-700 bg-neutral-950 text-[#e11d48] accent-[#e11d48]"
                          />
                          <span>Same as shop mobile</span>
                        </label>
                      </div>
                      <Input
                        id="modal-mobNo"
                        name="mobNo"
                        required
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={form.mobNo}
                        onChange={(e) => {
                          setSameAsShopMobile(false);
                          handleFieldChange("mobNo", e.target.value);
                        }}
                        aria-invalid={!!errors.mobNo}
                        className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.mobNo && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.mobNo}
                        </FieldError>
                      )}
                    </Field>
                  </div>

                  <Field data-invalid={!!errors.ownerAddress}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="modal-ownerAddress" className="text-xs font-semibold text-neutral-200">
                        Owner Residential Address *
                      </FieldLabel>
                      {form.address && (
                        <button
                          type="button"
                          onClick={handleCopyShopAddress}
                          className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <Copy className="size-2.5" />
                          <span>Same as shop address</span>
                        </button>
                      )}
                    </div>
                    <Input
                      id="modal-ownerAddress"
                      name="ownerAddress"
                      required
                      placeholder="e.g. Flat 302, Green Valley Apartments, Koramangala"
                      value={form.ownerAddress}
                      onChange={(e) =>
                        handleFieldChange("ownerAddress", e.target.value)
                      }
                      aria-invalid={!!errors.ownerAddress}
                      className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                    />
                    {errors.ownerAddress && (
                      <FieldError className="text-[11px] text-rose-400">
                        {errors.ownerAddress}
                      </FieldError>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field data-invalid={!!errors.ownerCity}>
                      <FieldLabel htmlFor="modal-ownerCity" className="text-xs font-semibold text-neutral-200">
                        Owner City *
                      </FieldLabel>
                      <Input
                        id="modal-ownerCity"
                        name="ownerCity"
                        required
                        placeholder="e.g. Bengaluru"
                        value={form.ownerCity}
                        onChange={(e) =>
                          handleFieldChange("ownerCity", e.target.value)
                        }
                        aria-invalid={!!errors.ownerCity}
                        className="h-9 text-xs bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                      {errors.ownerCity && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.ownerCity}
                        </FieldError>
                      )}
                    </Field>

                    <Field data-invalid={!!errors.ownerState}>
                      <FieldLabel htmlFor="modal-ownerState" className="text-xs font-semibold text-neutral-200">
                        Owner State *
                      </FieldLabel>
                      <select
                        id="modal-ownerState"
                        name="ownerState"
                        required
                        value={form.ownerState}
                        onChange={(e) =>
                          handleFieldChange("ownerState", e.target.value)
                        }
                        aria-invalid={!!errors.ownerState}
                        className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white focus-visible:outline-none focus-visible:border-[#e11d48] focus-visible:ring-1 focus-visible:ring-[#e11d48]"
                      >
                        <option value="" disabled className="bg-neutral-950 text-neutral-500">
                          Select State *
                        </option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st} className="bg-neutral-950 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                      {errors.ownerState && (
                        <FieldError className="text-[11px] text-rose-400">
                          {errors.ownerState}
                        </FieldError>
                      )}
                    </Field>
                  </div>
                </FieldSet>
              </FieldGroup>
            )}

            <DialogFooter className="mt-3 gap-2 flex-col-reverse sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              >
                Cancel
              </Button>
              {user && (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#e11d48] text-white hover:bg-[#c9183d] inline-flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Registration</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        ) : (
          /* Submission Success State */
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-rose-950/80 text-[#e11d48] border border-rose-500/20">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider text-[#e11d48] uppercase">
                Application Received
              </span>
              <DialogTitle className="text-xl font-bold tracking-tight text-white mt-1">
                Thank You for Registering
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-300 mt-2 max-w-sm mx-auto">
                Thank you for registering <strong className="text-white font-semibold">{form.shopName || "your shop"}</strong>.
                Our local merchant onboarding team will verify your GSTIN and storefront details within 24 hours.
              </DialogDescription>
            </div>

            <Button
              onClick={handleReset}
              className="mt-2 w-full bg-[#e11d48] text-white hover:bg-[#c9183d]"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
