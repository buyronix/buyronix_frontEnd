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
import { CheckCircle2, Store, ArrowRight, User } from "lucide-react";
import type { SellerRegistrationForm } from "../types";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
}

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

export function RegisterModal({
  open,
  onOpenChange,
}: RegisterModalProps) {
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
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setReferenceToken("");
    setForm(initialForm);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex size-7 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                  <Store className="size-4" />
                </span>
                <span className="text-xs font-semibold tracking-wider text-rose-600 uppercase">
                  Partner with Buyronix
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Register Your Hardware Shop
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-500">
                Join verified neighborhood hardware sellers and bring your inventory
                closer to nearby buyers with instant local delivery.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 py-1">
              {/* Shop Details Section */}
              <div className="flex items-center gap-2 pb-1 border-b border-neutral-100 dark:border-neutral-800">
                <Store className="size-4 text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Shop Details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="shopName"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
                    className="h-10 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="gstNumber"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
                    className="h-10 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="mobNumber"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
                    className="h-10 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="address"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
                  className="h-10 text-sm"
                />
              </div>

              {/* Owner Details Section */}
              <div className="flex items-center justify-between pt-2 pb-1 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Owner Details
                  </span>
                </div>
                {form.address && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, ownerAddress: prev.address }))
                    }
                    className="text-[11px] font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Same as shop address
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="ownerName"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
                      setForm((prev) => ({ ...prev, ownerName: e.target.value }))
                    }
                    className="h-10 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="mobNo"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ownerAddress"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
                    setForm((prev) => ({ ...prev, ownerAddress: e.target.value }))
                  }
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <DialogFooter className="mt-2 flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto text-neutral-500"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <CheckCircle2 className="size-8" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-rose-600 uppercase">
              Application Received
            </span>
            <DialogTitle className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Welcome to Buyronix
            </DialogTitle>
            <p className="mt-2 text-sm text-neutral-500 max-w-xs">
              Thank you for registering <strong className="text-neutral-800 dark:text-neutral-200">{form.shopName || "your shop"}</strong>.
              Our local merchant team will contact you within 24 hours to finalize verification.
            </p>
            <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
              Reference Token: <span className="font-mono font-bold text-neutral-900 dark:text-white">{referenceToken}</span>
            </div>
            <Button
              onClick={handleReset}
              className="mt-6 w-full bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
