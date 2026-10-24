"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Copy,
  Check,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminEmptyState } from "./AdminEmptyState";
import type {
  SellerRecord,
  SellersListPagination,
  VerificationStatus,
} from "../types";

interface AdminSellersTableProps {
  sellers: SellerRecord[];
  pagination: SellersListPagination;
  isLoading?: boolean;
  onSelectSeller: (seller: SellerRecord) => void;
  onApproveSeller: (seller: SellerRecord) => void;
  onOpenRejectDialog: (seller: SellerRecord) => void;
  onPageChange: (page: number) => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  isVerifying?: boolean;
}

export function AdminSellersTable({
  sellers,
  pagination,
  isLoading,
  onSelectSeller,
  onApproveSeller,
  onOpenRejectDialog,
  onPageChange,
  hasFilters,
  onResetFilters,
  isVerifying,
}: AdminSellersTableProps) {
  const [copiedGstId, setCopiedGstId] = React.useState<string | null>(null);

  const handleCopyGst = (e: React.MouseEvent, gst: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(gst);
    setCopiedGstId(id);
    setTimeout(() => setCopiedGstId(null), 1500);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[11px] font-semibold gap-1 px-2 py-0.5"
          >
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>APPROVED</span>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[11px] font-semibold gap-1 px-2 py-0.5"
          >
            <XCircle className="size-3 text-rose-600" />
            <span>REJECTED</span>
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px] font-semibold gap-1 px-2 py-0.5"
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
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border/80 bg-muted/20">
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="divide-y divide-border/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                <div className="h-3 w-28 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-28 bg-muted animate-pulse rounded hidden sm:block" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="w-full rounded-xl border border-border/80 bg-card shadow-xs">
        <AdminEmptyState
          hasFilters={hasFilters}
          onResetFilters={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-foreground">
          <thead className="bg-muted/50 border-b border-border/80 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                Shop Details
              </th>
              <th scope="col" className="px-4 py-3.5">
                GSTIN
              </th>
              <th scope="col" className="px-4 py-3.5">
                Owner
              </th>
              <th scope="col" className="px-4 py-3.5">
                Contact
              </th>
              <th scope="col" className="px-4 py-3.5">
                Location
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Submitted
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {sellers.map((seller) => {
              const isCopied = copiedGstId === seller.id;

              return (
                <tr
                  key={seller.id}
                  onClick={() => onSelectSeller(seller)}
                  className="group hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  {/* Shop Details */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                      <span>{seller.shop_name}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {seller.city}, {seller.state}
                    </div>
                  </td>

                  {/* GSTIN */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded font-mono text-[11px] border border-border/60">
                      <span>{seller.gst_number}</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyGst(e, seller.gst_number, seller.id)}
                        title="Copy GSTIN"
                        className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                      >
                        {isCopied ? (
                          <Check className="size-3 text-emerald-600" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-medium text-foreground">{seller.owner_name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {seller.owner_city || seller.city}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <a
                        href={`tel:${seller.mob_number}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-foreground hover:text-primary inline-flex items-center gap-1 font-mono transition-colors"
                      >
                        <Phone className="size-3 text-muted-foreground" />
                        <span>{seller.mob_number}</span>
                      </a>
                      <a
                        href={`mailto:${seller.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 truncate max-w-[150px] transition-colors"
                      >
                        <Mail className="size-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{seller.email}</span>
                      </a>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3.5 max-w-[180px]">
                    <div className="truncate text-[11px] text-foreground" title={seller.address}>
                      {seller.address}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      PIN: {seller.pincode}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge(seller.verification_status)}
                  </td>

                  {/* Submitted Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground text-[11px]">
                    {formatDate(seller.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    <div
                      className="inline-flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onSelectSeller(seller)}
                        className="h-7 px-2 text-[11px] rounded-md gap-1"
                      >
                        <Eye className="size-3" />
                        <span>Review</span>
                      </Button>

                      {seller.verification_status === "PENDING" && (
                        <>
                          <Button
                            variant="default"
                            size="xs"
                            onClick={() => onApproveSeller(seller)}
                            disabled={isVerifying}
                            className="h-7 px-2 text-[11px] rounded-md bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                          >
                            <CheckCircle2 className="size-3" />
                            <span>Approve</span>
                          </Button>

                          <Button
                            variant="destructive"
                            size="xs"
                            onClick={() => onOpenRejectDialog(seller)}
                            disabled={isVerifying}
                            className="h-7 px-2 text-[11px] rounded-md gap-1"
                          >
                            <XCircle className="size-3" />
                            <span>Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground select-none">
        <div>
          Showing{" "}
          <span className="font-semibold text-foreground">
            {sellers.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">
            {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground font-mono">
            {pagination.totalItems}
          </span>{" "}
          sellers
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            disabled={pagination.page <= 1 || isLoading}
            onClick={() => onPageChange(pagination.page - 1)}
            className="h-7 px-2 rounded-md"
          >
            <ChevronLeft className="size-3.5 mr-0.5" />
            <span>Previous</span>
          </Button>

          <span className="px-2 text-xs font-mono font-medium text-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            size="xs"
            disabled={pagination.page >= pagination.totalPages || isLoading}
            onClick={() => onPageChange(pagination.page + 1)}
            className="h-7 px-2 rounded-md"
          >
            <span>Next</span>
            <ChevronRight className="size-3.5 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
