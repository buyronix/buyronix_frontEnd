"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Building2,
  User,
  Phone,
  Mail,
  FileCheck,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SellerRecord, VerificationStatus } from "../types";

interface AdminSellerDetailSheetProps {
  seller: SellerRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (seller: SellerRecord) => void;
  onReject: (seller: SellerRecord) => void;
  isVerifying?: boolean;
}

export function AdminSellerDetailSheet({
  seller,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isVerifying,
}: AdminSellerDetailSheetProps) {
  const [copiedGst, setCopiedGst] = React.useState(false);

  if (!seller) return null;

  const handleCopyGst = () => {
    navigator.clipboard.writeText(seller.gst_number);
    setCopiedGst(true);
    setTimeout(() => setCopiedGst(false), 1500);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-semibold gap-1 px-2.5 py-1"
          >
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span>APPROVED</span>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-xs font-semibold gap-1 px-2.5 py-1"
          >
            <XCircle className="size-3.5 text-rose-600" />
            <span>REJECTED</span>
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs font-semibold gap-1 px-2.5 py-1"
          >
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>PENDING REVIEW</span>
          </Badge>
        );
    }
  };

  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="data-[side=right]:sm:max-w-xl data-[side=right]:md:max-w-2xl w-full p-0 flex flex-col justify-between overflow-hidden shadow-2xl bg-card border-l border-border"
      >
        {/* Sticky Sheet Header */}
        <div className="p-6 border-b border-border/80 bg-muted/30">
          <div className="flex items-start justify-between gap-4 pr-6">
            <div>
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                Seller ID: {seller.id.slice(0, 8)}...
              </div>
              <SheetTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Building2 className="size-5 text-primary shrink-0" />
                <span>{seller.shop_name}</span>
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-1">
                Submitted on {formatTimestamp(seller.created_at)}
              </SheetDescription>
            </div>

            <div className="shrink-0">{getStatusBadge(seller.verification_status)}</div>
          </div>
        </div>

        {/* Scrollable Body with Detailed Side-by-Side Shop vs Owner Info */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Rejection Alert if Status is REJECTED */}
          {seller.verification_status === "REJECTED" && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200">
              <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                <ShieldAlert className="size-4 text-rose-600" />
                <span>Application Rejected</span>
              </div>
              <p className="text-xs leading-relaxed">
                {seller.rejection_reason || "No explicit reason was recorded."}
              </p>
              {seller.verified_at && (
                <div className="text-[10px] text-muted-foreground mt-2">
                  Rejected on {formatTimestamp(seller.verified_at)}
                </div>
              )}
            </div>
          )}

          {/* Approved Info if Status is APPROVED */}
          {seller.verification_status === "APPROVED" && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                <FileCheck className="size-4 text-emerald-600" />
                <span>Verified Business Store</span>
              </div>
              <p className="text-xs leading-relaxed">
                This store has been approved and its catalog is active for nearby buyers.
              </p>
              {seller.verified_at && (
                <div className="text-[10px] text-muted-foreground mt-2">
                  Approved on {formatTimestamp(seller.verified_at)}
                </div>
              )}
            </div>
          )}

          {/* Side-by-Side Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shop Details Column */}
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground border-b border-border/60 pb-2">
                <Building2 className="size-4 text-primary" />
                <span>Shop Information</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Store Name</span>
                  <span className="font-semibold text-foreground">{seller.shop_name}</span>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">GSTIN</span>
                  <div className="inline-flex items-center gap-1.5 mt-0.5 bg-background px-2 py-1 rounded font-mono text-xs border border-border">
                    <span className="font-semibold">{seller.gst_number}</span>
                    <button
                      type="button"
                      onClick={handleCopyGst}
                      className="text-muted-foreground hover:text-foreground p-0.5"
                      title="Copy GSTIN"
                    >
                      {copiedGst ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Shop Contact</span>
                  <a
                    href={`tel:${seller.mob_number}`}
                    className="font-mono text-primary font-medium hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="size-3 text-muted-foreground" />
                    <span>{seller.mob_number}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Shop Email</span>
                  <a
                    href={`mailto:${seller.email}`}
                    className="text-foreground hover:underline inline-flex items-center gap-1 mt-0.5 break-all"
                  >
                    <Mail className="size-3 text-muted-foreground shrink-0" />
                    <span>{seller.email}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Shop Physical Address</span>
                  <p className="text-foreground mt-0.5 leading-snug">{seller.address}</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {seller.city}, {seller.state} — {seller.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Owner Details Column */}
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground border-b border-border/60 pb-2">
                <User className="size-4 text-primary" />
                <span>Owner Information</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Owner Full Name</span>
                  <span className="font-semibold text-foreground">{seller.owner_name}</span>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Owner Direct Mobile</span>
                  <a
                    href={`tel:${seller.mob_no}`}
                    className="font-mono text-primary font-medium hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="size-3 text-muted-foreground" />
                    <span>{seller.mob_no}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Residential Location</span>
                  <span className="font-medium text-foreground">
                    {seller.owner_city}, {seller.owner_state}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Residential Address</span>
                  <p className="text-foreground mt-0.5 leading-snug">
                    {seller.owner_address || "Same as shop address"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Verification Checklist */}
          <div className="p-4 rounded-xl border border-border/80 bg-background space-y-2.5">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Admin Verification Checklist</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Govt GSTIN Portal
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600 shrink-0" />
                <span>GSTIN format valid (15 digits alphanumeric)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600 shrink-0" />
                <span>State code matches registered shop address ({seller.state})</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600 shrink-0" />
                <span>Contact phone verified with OTP</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <a
                href={`https://services.gst.gov.in/services/searchtp`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>Verify GSTIN on Official GST Portal</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 border-t border-border/80 bg-muted/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs"
          >
            Close
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {seller.verification_status !== "APPROVED" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onApprove(seller)}
                disabled={isVerifying}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="size-4" />
                <span>Approve</span>
              </Button>
            )}

            {seller.verification_status !== "REJECTED" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReject(seller)}
                disabled={isVerifying}
                className="w-full sm:w-auto text-xs font-semibold gap-1.5"
              >
                <XCircle className="size-4" />
                <span>Reject</span>
              </Button>
            )}

            {seller.verification_status === "APPROVED" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(seller)}
                disabled={isVerifying}
                className="w-full sm:w-auto text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 gap-1.5"
              >
                <XCircle className="size-3.5" />
                <span>Revoke Approval</span>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
