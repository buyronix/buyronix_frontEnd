"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  LogOut,
  Store,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BusinessStatusResponse, BusinessFullDetails } from "../types";

interface BusinessStatusCardProps {
  status: BusinessStatusResponse;
  details?: BusinessFullDetails;
  onRefresh: () => void;
  onSignOut: () => void;
  onResubmit?: () => void;
  isRefreshing?: boolean;
}

export function BusinessStatusCard({
  status,
  details,
  onRefresh,
  onSignOut,
  onResubmit,
  isRefreshing = false,
}: BusinessStatusCardProps) {
  const isPending = status.verification_status === "PENDING";
  const isApproved = status.verification_status === "APPROVED";
  const isRejected = status.verification_status === "REJECTED";

  const shopName =
    status.shop_name ||
    details?.shop_name ||
    (details as { business_name?: string })?.business_name ||
    "Hardware Store";

  const shopMobile =
    details?.mob_number ||
    (details as { mobile_number?: string })?.mobile_number;

  const shopAddress =
    details?.address ||
    (details as { address_line?: string })?.address_line;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
      >
        {/* Status Header Icon & Badges */}
        <div className="flex flex-col items-center text-center">
          {isPending && (
            <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-950/70 border border-amber-500/30 text-amber-400 mb-4 shadow-lg shadow-amber-900/20">
              <Clock className="size-8 animate-pulse" />
            </div>
          )}

          {isApproved && (
            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-900/20">
              <CheckCircle2 className="size-8" />
            </div>
          )}

          {isRejected && (
            <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-950/70 border border-rose-500/30 text-rose-400 mb-4 shadow-lg shadow-rose-900/20">
              <AlertCircle className="size-8" />
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Merchant Application Status
            </span>
            {isPending && (
              <Badge className="bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[11px] font-semibold">
                Under Review
              </Badge>
            )}
            {isApproved && (
              <Badge className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
                Approved Partner
              </Badge>
            )}
            {isRejected && (
              <Badge className="bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[11px] font-semibold">
                Needs Correction
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isPending && "Your Store Application is Under Review"}
            {isApproved && "Welcome to Buyronix Partner Network!"}
            {isRejected && "Action Required: Registration Revision"}
          </h1>

          <p className="mt-2.5 text-sm text-neutral-300 max-w-lg leading-relaxed">
            {isPending &&
              "Our merchant desk is verifying your GSTIN and storefront details. Most verifications complete within 24 hours."}
            {isApproved &&
              "Your store has been verified and approved. Your counter inventory is now live for buyers in your local delivery area."}
            {isRejected &&
              "Our review team noticed some issues with your submission. Please see the review feedback below to update and resubmit."}
          </p>
        </div>

        {/* Rejection Note if Rejected */}
        {isRejected && status.rejection_reason && (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 sm:p-5 text-sm text-rose-200">
            <div className="flex items-center gap-2 font-semibold text-rose-300 mb-1">
              <AlertCircle className="size-4" />
              <span>Review Feedback from Buyronix Admin:</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 pl-6 leading-relaxed">
              &quot;{status.rejection_reason}&quot;
            </p>
          </div>
        )}

        {/* Submitted Store Summary Card */}
        <div className="mt-7 rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-3.5 text-xs text-neutral-300">
          <div className="flex items-center gap-1.5 text-neutral-400 font-semibold text-[11px] uppercase tracking-wider pb-1 border-b border-neutral-800/80">
            <Store className="size-3.5 text-[#e11d48]" />
            <span>Shop Details</span>
          </div>

          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <span className="text-neutral-400 font-medium">Shop / Trade Name</span>
            <span className="font-semibold text-white text-sm">{shopName}</span>
          </div>

          {details?.gst_number && (
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <span className="text-neutral-400 font-medium">GSTIN</span>
              <span className="font-mono text-white font-medium">
                {details.gst_number}
              </span>
            </div>
          )}

          {shopMobile && (
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <span className="text-neutral-400 font-medium">Shop Mobile</span>
              <span className="font-mono text-neutral-200">{shopMobile}</span>
            </div>
          )}

          {details?.email && (
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <span className="text-neutral-400 font-medium">Shop Email</span>
              <span className="text-neutral-200">{details.email}</span>
            </div>
          )}

          {shopAddress && (
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <span className="text-neutral-400 font-medium">Shop Address</span>
              <span className="text-neutral-200 text-right max-w-[240px] truncate">
                {shopAddress}
                {details?.city ? `, ${details.city}` : ""}
                {details?.pincode ? ` (${details.pincode})` : ""}
              </span>
            </div>
          )}

          {(details?.owner_name || details?.mob_no || details?.owner_address) && (
            <>
              <div className="flex items-center gap-1.5 text-neutral-400 font-semibold text-[11px] uppercase tracking-wider pt-2 pb-1 border-b border-neutral-800/80">
                <User className="size-3.5 text-[#e11d48]" />
                <span>Owner Details</span>
              </div>

              {details?.owner_name && (
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                  <span className="text-neutral-400 font-medium">Proprietor Name</span>
                  <span className="text-neutral-200 font-medium">{details.owner_name}</span>
                </div>
              )}

              {details?.mob_no && (
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                  <span className="text-neutral-400 font-medium">Owner Mobile</span>
                  <span className="font-mono text-neutral-200">{details.mob_no}</span>
                </div>
              )}

              {details?.owner_address && (
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                  <span className="text-neutral-400 font-medium">Residential Address</span>
                  <span className="text-neutral-200 text-right max-w-[240px] truncate">
                    {details.owner_address}
                    {details?.owner_city ? `, ${details.owner_city}` : ""}
                  </span>
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-neutral-400 font-medium">Application ID</span>
            <span className="font-mono text-neutral-400 text-[11px] truncate max-w-[200px]">
              {status.id}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 hover:text-white inline-flex items-center gap-2"
          >
            <RefreshCw
              className={`size-4 ${isRefreshing ? "animate-spin text-rose-500" : ""}`}
            />
            <span>{isRefreshing ? "Checking..." : "Refresh Status"}</span>
          </Button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {isRejected && onResubmit && (
              <Button
                type="button"
                onClick={onResubmit}
                className="bg-[#e11d48] text-white hover:bg-[#c9183d] inline-flex items-center gap-1.5"
              >
                <span>Edit & Resubmit</span>
                <ArrowRight className="size-4" />
              </Button>
            )}

            {isApproved && (
              <Link href="/">
                <Button className="bg-[#e11d48] text-white hover:bg-[#c9183d] inline-flex items-center gap-1.5">
                  <span>Enter Merchant Portal</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={onSignOut}
              className="text-neutral-400 hover:text-white hover:bg-neutral-800/60 inline-flex items-center gap-1.5 text-xs"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
