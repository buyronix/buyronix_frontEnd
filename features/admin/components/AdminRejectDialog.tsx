"use client";

import * as React from "react";
import { AlertCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SellerRecord } from "../types";

interface AdminRejectDialogProps {
  seller: SellerRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (reason: string) => void;
  isVerifying?: boolean;
}

const PRE_CANNED_REASONS = [
  "Invalid GSTIN: State code or checksum mismatch",
  "Contact information unreachable after multiple calls",
  "Address unverifiable on map or commercial registry",
  "Incomplete or inconsistent business documentation",
];

function RejectForm({
  seller,
  onClose,
  onConfirmReject,
  isVerifying,
}: {
  seller: SellerRecord;
  onClose: () => void;
  onConfirmReject: (reason: string) => void;
  isVerifying?: boolean;
}) {
  const [reason, setReason] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 5) {
      setError("Reason for rejection must be at least 5 characters long.");
      return;
    }
    setError(null);
    onConfirmReject(trimmed);
  };

  const handleSelectQuickReason = (text: string) => {
    setReason(text);
    setError(null);
  };

  const isValid = reason.trim().length >= 5;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 my-2">
      {/* Quick Pre-canned Reason Chips */}
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
          Quick Pre-canned Reasons
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRE_CANNED_REASONS.map((text, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectQuickReason(text)}
              className="text-left text-[11px] px-2.5 py-1 rounded-md bg-muted/70 hover:bg-muted text-foreground border border-border/70 transition-colors"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Reason Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor="rejection-reason"
            className="font-semibold text-foreground flex items-center gap-1"
          >
            <span>Rejection Reason</span>
            <span className="text-rose-500">*</span>
          </label>
          <span
            className={`font-mono text-[11px] ${
              reason.trim().length >= 5
                ? "text-muted-foreground"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {reason.trim().length}/5 min chars
          </span>
        </div>

        <textarea
          id="rejection-reason"
          rows={4}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (e.target.value.trim().length >= 5) setError(null);
          }}
          placeholder={`State specific reason for rejecting ${seller.shop_name}...`}
          className="w-full text-xs rounded-lg border border-input bg-background p-3 outline-none focus:border-ring focus:ring-2 focus:ring-ring/40 transition-all resize-none shadow-xs"
        />

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isVerifying}
          className="text-xs"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="destructive"
          size="sm"
          disabled={!isValid || isVerifying}
          className="text-xs font-semibold gap-1.5"
        >
          <XCircle className="size-3.5" />
          <span>{isVerifying ? "Rejecting..." : "Confirm Rejection"}</span>
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AdminRejectDialog({
  seller,
  isOpen,
  onClose,
  onConfirmReject,
  isVerifying,
}: AdminRejectDialogProps) {
  if (!seller) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-6 bg-card border border-border shadow-xl">
        <DialogHeader>
          <div className="size-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-2">
            <XCircle className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Reject Seller Application
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Rejecting application for{" "}
            <span className="font-semibold text-foreground">{seller.shop_name}</span>.
            The seller will receive this reason to correct and resubmit their details.
          </DialogDescription>
        </DialogHeader>

        <RejectForm
          key={seller.id}
          seller={seller}
          onClose={onClose}
          onConfirmReject={onConfirmReject}
          isVerifying={isVerifying}
        />
      </DialogContent>
    </Dialog>
  );
}
