"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SellerRecord, VerificationStatus } from "../types";

interface AdminSellerMobileCardProps {
  seller: SellerRecord;
  onSelect: (seller: SellerRecord) => void;
  onApprove: (seller: SellerRecord) => void;
  onReject: (seller: SellerRecord) => void;
  isVerifying?: boolean;
}

export function AdminSellerMobileCard({
  seller,
  onSelect,
  onApprove,
  onReject,
  isVerifying,
}: AdminSellerMobileCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyGst = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(seller.gst_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-semibold gap-1 px-1.5 py-0.5"
          >
            <CheckCircle2 className="size-2.5" />
            <span>APPROVED</span>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[10px] font-semibold gap-1 px-1.5 py-0.5"
          >
            <XCircle className="size-2.5" />
            <span>REJECTED</span>
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold gap-1 px-1.5 py-0.5"
          >
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>PENDING</span>
          </Badge>
        );
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      onClick={() => onSelect(seller)}
      className="rounded-xl border border-border/80 bg-card p-4 shadow-xs hover:border-foreground/20 transition-all active:scale-[0.99] cursor-pointer"
    >
      {/* Header: Shop Name + Status Badge */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-foreground truncate flex items-center gap-1.5">
            <Building2 className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{seller.shop_name}</span>
          </h4>
          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">
              {seller.city}, {seller.state}
            </span>
          </div>
        </div>

        <div className="shrink-0">{getStatusBadge(seller.verification_status)}</div>
      </div>

      {/* Body: GSTIN, Owner, Mobile */}
      <div className="space-y-1.5 py-2 border-y border-border/50 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">GSTIN:</span>
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded border border-border/60">
            <span>{seller.gst_number}</span>
            <button
              type="button"
              onClick={handleCopyGst}
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Owner:</span>
          <span className="font-medium text-foreground">{seller.owner_name}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Contact:</span>
          <a
            href={`tel:${seller.mob_number}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-primary font-mono text-[11px] font-medium"
          >
            <Phone className="size-3" />
            <span>{seller.mob_number}</span>
          </a>
        </div>
      </div>

      {/* Footer: Date & Actions */}
      <div className="mt-3 flex items-center justify-between pt-1">
        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Calendar className="size-3" />
          <span>{formatDate(seller.created_at)}</span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {seller.verification_status === "PENDING" && (
            <>
              <Button
                variant="default"
                size="xs"
                onClick={() => onApprove(seller)}
                disabled={isVerifying}
                className="h-7 px-2 text-[11px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="size-3" />
                <span className="sr-only">Approve</span>
              </Button>
              <Button
                variant="destructive"
                size="xs"
                onClick={() => onReject(seller)}
                disabled={isVerifying}
                className="h-7 px-2 text-[11px] rounded-lg"
              >
                <XCircle className="size-3" />
                <span className="sr-only">Reject</span>
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="xs"
            onClick={() => onSelect(seller)}
            className="h-7 px-2.5 text-xs rounded-lg font-medium"
          >
            <span>Review</span>
            <ChevronRight className="size-3 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
