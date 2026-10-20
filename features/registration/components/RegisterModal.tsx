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
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { CheckCircle2, Store, ArrowRight, User, MapPin } from "lucide-react";
import { SOUTH_INDIAN_STATES, type SellerRegistrationForm } from "../types";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
}

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
      <DialogContent className="sm:max-w-lg bg-neutral-950 border border-neutral-800 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
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
                closer to nearby buyers with instant local delivery.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="gap-5 py-1">
              {/* Shop Details Section */}
              <FieldSet className="gap-3.5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-800">
                  <Store className="size-4 text-[#e11d48]" />
                  <FieldLegend className="text-xs font-bold uppercase tracking-wider text-white m-0">
                    Shop Details
                  </FieldLegend>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="modal-shopName" className="text-xs font-semibold text-neutral-200">
                      Shop name *
                    </FieldLabel>
                    <Input
                      id="modal-shopName"
                      name="shopName"
                      required
                      placeholder="e.g. Apex Hardware & Tech Hub"
                      value={form.shopName}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, shopName: e.target.value }))
                      }
                      className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="modal-gstNumber" className="text-xs font-semibold text-neutral-200">
                      Gst number *
                    </FieldLabel>
                    <Input
                      id="modal-gstNumber"
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
                      className="h-10 text-sm font-mono uppercase bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="modal-mobNumber" className="text-xs font-semibold text-neutral-200">
                      Mob number *
                    </FieldLabel>
                    <Input
                      id="modal-mobNumber"
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
                      className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="modal-email" className="text-xs font-semibold text-neutral-200">
                      Email *
                    </FieldLabel>
                    <Input
                      id="modal-email"
                      name="email"
                      required
                      type="email"
                      placeholder="e.g. shop@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="modal-address" className="text-xs font-semibold text-neutral-200">
                    Address *
                  </FieldLabel>
                  <Input
                    id="modal-address"
                    name="address"
                    required
                    placeholder="e.g. Shop #12, Commercial Complex, MG Road, Bengaluru"
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                  />
                </Field>
              </FieldSet>

              {/* Location & Pincode Section */}
              <FieldSet className="gap-3.5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-800">
                  <MapPin className="size-4 text-[#e11d48]" />
                  <FieldLegend className="text-xs font-bold uppercase tracking-wider text-white m-0">
                    Location & Pincode
                  </FieldLegend>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="modal-pincode" className="text-xs font-semibold text-neutral-200">
                      Pincode *
                    </FieldLabel>
                    <Input
                      id="modal-pincode"
                      name="pincode"
                      required
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="e.g. 560038"
                      value={form.pincode}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                        }))
                      }
                      className="h-10 text-sm font-mono tracking-wider bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="modal-city" className="text-xs font-semibold text-neutral-200">
                      City / Area
                    </FieldLabel>
                    <Input
                      id="modal-city"
                      name="city"
                      placeholder="e.g. Indiranagar, Bengaluru"
                      value={form.city || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="modal-state" className="text-xs font-semibold text-neutral-200">
                    State *
                  </FieldLabel>
                  <select
                    id="modal-state"
                    name="state"
                    required
                    value={form.state}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, state: e.target.value }))
                    }
                    className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-[#e11d48]"
                  >
                    <option value="" disabled className="bg-neutral-950 text-neutral-500">
                      Select State *
                    </option>
                    {SOUTH_INDIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-neutral-950 text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </Field>
              </FieldSet>

              {/* Owner Details Section */}
              <FieldSet className="gap-3.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-[#e11d48]" />
                    <FieldLegend className="text-xs font-bold uppercase tracking-wider text-white m-0">
                      Owner Details
                    </FieldLegend>
                  </div>

                  {form.address && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, ownerAddress: prev.address }))
                      }
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                    >
                      Same as shop address
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="modal-ownerName" className="text-xs font-semibold text-neutral-200">
                      Owner name *
                    </FieldLabel>
                    <Input
                      id="modal-ownerName"
                      name="ownerName"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={form.ownerName}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, ownerName: e.target.value }))
                      }
                      className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="modal-mobNo" className="text-xs font-semibold text-neutral-200">
                      Mob no *
                    </FieldLabel>
                    <Input
                      id="modal-mobNo"
                      name="mobNo"
                      required
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={form.mobNo}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, mobNo: e.target.value }))
                      }
                      className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="modal-ownerState" className="text-xs font-semibold text-neutral-200">
                      State (Owner) *
                    </FieldLabel>
                    <select
                      id="modal-ownerState"
                      name="ownerState"
                      required
                      value={form.ownerState}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, ownerState: e.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-[#e11d48]"
                    >
                      <option value="" disabled className="bg-neutral-950 text-neutral-500">
                        Select State *
                      </option>
                      {SOUTH_INDIAN_STATES.map((st) => (
                        <option key={st} value={st} className="bg-neutral-950 text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="modal-ownerCity" className="text-xs font-semibold text-neutral-200">
                      City (Owner)
                    </FieldLabel>
                    <Input
                      id="modal-ownerCity"
                      name="ownerCity"
                      placeholder="e.g. Bengaluru"
                      value={form.ownerCity}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, ownerCity: e.target.value }))
                      }
                      className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="modal-ownerAddress" className="text-xs font-semibold text-neutral-200">
                    Address *
                  </FieldLabel>
                  <Input
                    id="modal-ownerAddress"
                    name="ownerAddress"
                    required
                    placeholder="e.g. Flat 302, Green Valley Apartments, Bengaluru"
                    value={form.ownerAddress}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, ownerAddress: e.target.value }))
                    }
                    className="h-10 text-sm bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:bg-neutral-900 focus-visible:border-[#e11d48]"
                  />
                </Field>
              </FieldSet>
            </FieldGroup>

            <DialogFooter className="mt-2 flex-col sm:flex-row gap-2 border-t border-neutral-800 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto text-neutral-400 hover:text-white hover:bg-neutral-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#e11d48] text-white hover:bg-[#c9183d]"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-rose-950/80 text-[#e11d48] border border-rose-500/20">
              <CheckCircle2 className="size-8" />
            </div>
            <span className="text-xs font-bold tracking-wider text-[#e11d48] uppercase">
              Application Received
            </span>
            <DialogTitle className="mt-1 text-2xl font-bold tracking-tight text-white">
              Welcome to Buyronix
            </DialogTitle>
            <p className="mt-2 text-sm text-neutral-300 max-w-xs">
              Thank you for registering <strong className="text-white font-semibold">{form.shopName || "your shop"}</strong>.
              Our local merchant team will contact you within 24 hours to finalize verification.
            </p>
            <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-400">
              Reference Token: <span className="font-mono font-bold text-white text-sm ml-1">{referenceToken}</span>
            </div>
            <Button
              onClick={handleReset}
              className="mt-6 w-full bg-[#e11d48] text-white hover:bg-[#c9183d]"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
