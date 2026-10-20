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
import { CheckCircle2, Store, ArrowRight } from "lucide-react";
import type { SellerRegistrationForm } from "../types";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
}

const initialForm: SellerRegistrationForm = {
  shopName: "",
  ownerName: "",
  phone: "",
  email: "",
  category: "PC Components & Peripherals",
  gstNumber: "",
  pincode: "",
  city: "",
};

export function RegisterModal({
  open,
  onOpenChange,
  defaultCategory,
}: RegisterModalProps) {
  const [form, setForm] = React.useState<SellerRegistrationForm>({
    ...initialForm,
    category: defaultCategory || initialForm.category,
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [referenceToken, setReferenceToken] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="shopName"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Shop Name *
                </label>
                <Input
                  id="shopName"
                  required
                  placeholder="e.g. Apex Hardware & Tech Hub"
                  value={form.shopName}
                  onChange={(e) =>
                    setForm({ ...form, shopName: e.target.value })
                  }
                  className="h-10 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="ownerName"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Owner / Contact Name *
                  </label>
                  <Input
                    id="ownerName"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={form.ownerName}
                    onChange={(e) =>
                      setForm({ ...form, ownerName: e.target.value })
                    }
                    className="h-10 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Phone / WhatsApp *
                  </label>
                  <Input
                    id="phone"
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="category"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Primary Hardware Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-background px-3 py-2 text-sm text-neutral-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 dark:border-neutral-800 dark:text-neutral-100"
                >
                  <option value="PC Components & Peripherals">
                    PC Components & Peripherals
                  </option>
                  <option value="Everyday Electronics & Cables">
                    Everyday Electronics & Cables
                  </option>
                  <option value="Power Tools & Industrial Hardware">
                    Power Tools & Industrial Hardware
                  </option>
                  <option value="Networking & Smart Home Gear">
                    Networking & Smart Home Gear
                  </option>
                  <option value="Electrical Supplies & Fixtures">
                    Electrical Supplies & Fixtures
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="gstNumber"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    GSTIN Number (Optional)
                  </label>
                  <Input
                    id="gstNumber"
                    placeholder="22AAAAA0000A1Z5"
                    value={form.gstNumber}
                    onChange={(e) =>
                      setForm({ ...form, gstNumber: e.target.value.toUpperCase() })
                    }
                    className="h-10 text-sm font-mono uppercase"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="city"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    City / Neighborhood *
                  </label>
                  <Input
                    id="city"
                    required
                    placeholder="e.g. Indiranagar, Bengaluru"
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="h-10 text-sm"
                  />
                </div>
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
