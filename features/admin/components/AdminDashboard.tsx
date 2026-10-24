"use client";

import * as React from "react";
import {
  FileSpreadsheet,
  Download,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAdminSellers } from "../hooks/useAdminSellers";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { AdminMobileHeader } from "./AdminMobileHeader";
import { AdminStatCards } from "./AdminStatCards";
import { AdminStatusTabs } from "./AdminStatusTabs";
import { AdminSellersTable } from "./AdminSellersTable";
import { AdminSellerMobileCard } from "./AdminSellerMobileCard";
import { AdminSellerDetailSheet } from "./AdminSellerDetailSheet";
import { AdminRejectDialog } from "./AdminRejectDialog";
import { AdminExportModal } from "./AdminExportModal";
import { AdminEmptyState } from "./AdminEmptyState";

export function AdminDashboard() {
  const {
    user,
    accessToken,
    isLoading: isAuthLoading,
    isAdmin,
    signOut,
  } = useAdminAuth();

  const {
    sellers,
    pagination,
    counts,
    isLoading: isSellersLoading,
    isFetching,
    error,
    refetch,
    activeTab,
    handleTabChange,
    searchInput,
    setSearchInput,
    setPage,
    handleResetFilters,
    selectedSeller,
    setSelectedSeller,
    rejectingSeller,
    setRejectingSeller,
    isExportModalOpen,
    setIsExportModalOpen,
    isCsvDownloading,
    handleApprove,
    handleOpenRejectDialog,
    handleConfirmReject,
    handleDownloadCsv,
    isVerifying,
  } = useAdminSellers(accessToken);

  // Auth Loading State
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-medium">
          Verifying administrative credentials...
        </span>
      </div>
    );
  }

  // Never allow users without access to see the admin page
  if (!isAdmin) {
    return null;
  }

  const hasFilters = Boolean(activeTab !== "ALL" || searchInput.trim());

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex">
      {/* Desktop Fixed Sidebar */}
      <AdminSidebar
        currentTab="sellers"
        pendingCount={counts.pending}
        user={user}
        onSignOut={signOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Desktop Top Bar */}
        <AdminTopBar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onRefresh={refetch}
          isFetching={isFetching}
          onOpenGoogleSheetsExport={() => setIsExportModalOpen(true)}
          onDownloadCsv={handleDownloadCsv}
          isCsvDownloading={isCsvDownloading}
          pendingCount={counts.pending}
        />

        {/* Mobile Header with Hamburger Navigation Sheet */}
        <AdminMobileHeader
          currentTab="sellers"
          pendingCount={counts.pending}
          user={user}
          onSignOut={signOut}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onOpenGoogleSheetsExport={() => setIsExportModalOpen(true)}
          onDownloadCsv={handleDownloadCsv}
          isCsvDownloading={isCsvDownloading}
        />

        {/* Page Main Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Seller Verification & Management
                </h1>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px] font-medium"
                >
                  Live Pipeline
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Review, verify GSTIN, search registered hardware stores, and export seller records.
              </p>
            </div>

            {/* Quick Export action buttons for desktop & tablet */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
                className="text-xs font-semibold gap-1.5 h-8 bg-background border-border/80"
              >
                <FileSpreadsheet className="size-3.5 text-emerald-600" />
                <span>Google Sheets</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCsv}
                disabled={isCsvDownloading}
                className="text-xs font-semibold gap-1.5 h-8 bg-background border-border/80"
              >
                <Download className="size-3.5 text-primary" />
                <span>CSV</span>
              </Button>
            </div>
          </div>

          {/* 4 Stat Cards Row (Desktop Grid + Mobile Swipeable Carousel) */}
          <AdminStatCards
            counts={counts}
            activeTab={activeTab}
            onSelectTab={handleTabChange}
            isLoading={isSellersLoading}
          />

          {/* Status Tabs Row with Count Badges */}
          <AdminStatusTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={counts}
          />

          {/* Error Banner if Query Failed */}
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>
                  {error instanceof Error ? error.message : "Failed to load sellers."}
                </span>
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={() => refetch()}
                className="h-7 text-xs"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Desktop Table View (>= 1024px) */}
          <div className="hidden lg:block">
            <AdminSellersTable
              sellers={sellers}
              pagination={pagination}
              isLoading={isSellersLoading}
              onSelectSeller={(seller) => setSelectedSeller(seller)}
              onApproveSeller={handleApprove}
              onOpenRejectDialog={handleOpenRejectDialog}
              onPageChange={setPage}
              hasFilters={hasFilters}
              onResetFilters={handleResetFilters}
              isVerifying={isVerifying}
            />
          </div>

          {/* Mobile Card-Based List (< 1024px) */}
          <div className="lg:hidden space-y-3">
            {isSellersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border/80 bg-card space-y-3"
                  >
                    <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                    <div className="h-7 w-full bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : sellers.length === 0 ? (
              <div className="rounded-xl border border-border/80 bg-card">
                <AdminEmptyState
                  hasFilters={hasFilters}
                  onResetFilters={handleResetFilters}
                />
              </div>
            ) : (
              sellers.map((seller) => (
                <AdminSellerMobileCard
                  key={seller.id}
                  seller={seller}
                  onSelect={(s) => setSelectedSeller(s)}
                  onApprove={handleApprove}
                  onReject={handleOpenRejectDialog}
                  isVerifying={isVerifying}
                />
              ))
            )}

            {/* Mobile Pagination */}
            {sellers.length > 0 && (
              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground select-none">
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={pagination.page <= 1 || isSellersLoading}
                    onClick={() => setPage(pagination.page - 1)}
                    className="h-8 px-2.5"
                  >
                    <ChevronLeft className="size-3.5 mr-0.5" />
                    <span>Prev</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={
                      pagination.page >= pagination.totalPages || isSellersLoading
                    }
                    onClick={() => setPage(pagination.page + 1)}
                    className="h-8 px-2.5"
                  >
                    <span>Next</span>
                    <ChevronRight className="size-3.5 ml-0.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Slide-over Drawer / Bottom Sheet for Seller Details */}
      <AdminSellerDetailSheet
        seller={selectedSeller}
        isOpen={Boolean(selectedSeller)}
        onClose={() => setSelectedSeller(null)}
        onApprove={handleApprove}
        onReject={handleOpenRejectDialog}
        isVerifying={isVerifying}
      />

      {/* Reject Modal Dialog with Mandatory Reason */}
      <AdminRejectDialog
        seller={rejectingSeller}
        isOpen={Boolean(rejectingSeller)}
        onClose={() => setRejectingSeller(null)}
        onConfirmReject={handleConfirmReject}
        isVerifying={isVerifying}
      />

      {/* Export to Google Sheets Modal */}
      <AdminExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentStatusFilter={activeTab}
        accessToken={accessToken}
      />
    </div>
  );
}
