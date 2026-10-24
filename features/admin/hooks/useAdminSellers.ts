"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAdminSellers,
  verifySeller,
  downloadSellersCsv,
  downloadBusinessesPdf,
} from "../api/adminApi";
import type {
  SellerRecord,
  SellersListResponse,
  VerificationStatus,
  VerifySellerActionPayload,
} from "../types";

export function useAdminSellers(accessToken?: string | null) {
  const queryClient = useQueryClient();

  // Filters state
  const [activeTab, setActiveTab] = React.useState<"ALL" | VerificationStatus>("ALL");
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  // Debounce search input by 300ms
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Modals and sheets state
  const [selectedSeller, setSelectedSeller] = React.useState<SellerRecord | null>(null);
  const [rejectingSeller, setRejectingSeller] = React.useState<SellerRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [isCsvDownloading, setIsCsvDownloading] = React.useState<boolean>(false);
  const [isPdfDownloading, setIsPdfDownloading] = React.useState<boolean>(false);

  // Query key
  const queryKey = React.useMemo(
    () => [
      "admin",
      "sellers",
      {
        status: activeTab,
        search: debouncedSearch,
        page,
        limit,
      },
    ],
    [activeTab, debouncedSearch, page, limit]
  );

  // TanStack Query
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<SellersListResponse>({
    queryKey,
    queryFn: () =>
      fetchAdminSellers(
        {
          status: activeTab,
          search: debouncedSearch,
          page,
          limit,
        },
        accessToken
      ),
    placeholderData: (previousData) => previousData,
  });

  // Verify Seller Mutation with Optimistic Updates
  const verifyMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: VerifySellerActionPayload;
      sellerName: string;
    }) => {
      return verifySeller(id, payload, accessToken);
    },
    onMutate: async ({ id, payload, sellerName }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admin", "sellers"] });

      // Snapshot previous data for rollback
      const previousData = queryClient.getQueryData<SellersListResponse>(queryKey);

      // Optimistically update the list cache
      if (previousData) {
        const updatedItems = previousData.items.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              verification_status: payload.status,
              rejection_reason:
                payload.status === "REJECTED" ? payload.rejection_reason : null,
              verified_at: new Date().toISOString(),
            };
          }
          return item;
        });

        // Recalculate optimistic counts
        const previousItem = previousData.items.find((i) => i.id === id);
        const oldStatus = previousItem?.verification_status;
        const newStatus = payload.status;

        const newCounts = { ...previousData.counts };
        if (oldStatus && oldStatus !== newStatus) {
          if (oldStatus === "PENDING") newCounts.pending = Math.max(0, newCounts.pending - 1);
          if (oldStatus === "APPROVED") newCounts.approved = Math.max(0, newCounts.approved - 1);
          if (oldStatus === "REJECTED") newCounts.rejected = Math.max(0, newCounts.rejected - 1);

          if (newStatus === "APPROVED") newCounts.approved += 1;
          if (newStatus === "REJECTED") newCounts.rejected += 1;
        }

        queryClient.setQueryData<SellersListResponse>(queryKey, {
          ...previousData,
          items: updatedItems,
          counts: newCounts,
        });
      }

      // Optimistically update selected seller if currently open in sheet
      if (selectedSeller && selectedSeller.id === id) {
        setSelectedSeller((prev) =>
          prev
            ? {
                ...prev,
                verification_status: payload.status,
                rejection_reason:
                  payload.status === "REJECTED" ? payload.rejection_reason : null,
                verified_at: new Date().toISOString(),
              }
            : null
        );
      }

      return { previousData, sellerName };
    },
    onError: (err, _variables, context) => {
      // Rollback to previous state
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(
        `Failed to update verification status: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    },
    onSuccess: (_result, variables) => {
      if (variables.payload.status === "APPROVED") {
        toast.success(`Shop "${variables.sellerName}" has been approved successfully.`);
      } else {
        toast.error(`Shop "${variables.sellerName}" has been rejected.`);
      }
      // Invalidate queries so all tabs get fresh counts
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
    },
  });

  const handleApprove = React.useCallback(
    (seller: SellerRecord) => {
      verifyMutation.mutate({
        id: seller.id,
        sellerName: seller.shop_name,
        payload: { status: "APPROVED" },
      });
    },
    [verifyMutation]
  );

  const handleOpenRejectDialog = React.useCallback((seller: SellerRecord) => {
    setRejectingSeller(seller);
  }, []);

  const handleConfirmReject = React.useCallback(
    (reason: string) => {
      if (!rejectingSeller) return;
      verifyMutation.mutate(
        {
          id: rejectingSeller.id,
          sellerName: rejectingSeller.shop_name,
          payload: { status: "REJECTED", rejection_reason: reason },
        },
        {
          onSettled: () => {
            setRejectingSeller(null);
          },
        }
      );
    },
    [rejectingSeller, verifyMutation]
  );

  const handleDownloadCsv = React.useCallback(async () => {
    try {
      setIsCsvDownloading(true);
      await downloadSellersCsv(
        activeTab === "ALL" ? undefined : activeTab,
        accessToken
      );
      toast.success("CSV download started: buyronix-sellers.csv");
    } catch (err) {
      toast.error("Failed to download CSV.");
      console.error(err);
    } finally {
      setIsCsvDownloading(false);
    }
  }, [activeTab, accessToken]);

  const handleDownloadPdf = React.useCallback(async () => {
    try {
      setIsPdfDownloading(true);
      await downloadBusinessesPdf(
        activeTab === "ALL" ? undefined : activeTab,
        accessToken
      );
      toast.success("PDF report downloaded successfully.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download PDF report.";
      toast.error(message);
      console.error(err);
    } finally {
      setIsPdfDownloading(false);
    }
  }, [activeTab, accessToken]);

  const handleTabChange = React.useCallback((tab: "ALL" | VerificationStatus) => {
    setActiveTab(tab);
    setPage(1);
  }, []);

  const handleResetFilters = React.useCallback(() => {
    setActiveTab("ALL");
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  }, []);

  return {
    sellers: data?.items ?? [],
    pagination: data?.pagination ?? { page: 1, limit, totalItems: 0, totalPages: 1 },
    counts: data?.counts ?? { all: 0, pending: 0, approved: 0, rejected: 0 },
    isLoading,
    isFetching,
    error,
    refetch,
    // Filter controls
    activeTab,
    handleTabChange,
    searchInput,
    setSearchInput,
    page,
    setPage,
    limit,
    setLimit,
    handleResetFilters,
    // Modals & Actions
    selectedSeller,
    setSelectedSeller,
    rejectingSeller,
    setRejectingSeller,
    isExportModalOpen,
    setIsExportModalOpen,
    isCsvDownloading,
    isPdfDownloading,
    handleApprove,
    handleOpenRejectDialog,
    handleConfirmReject,
    handleDownloadCsv,
    handleDownloadPdf,
    isVerifying: verifyMutation.isPending,
  };
}
