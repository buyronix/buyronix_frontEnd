"use client";

import * as React from "react";
import type { SellersListCounts, VerificationStatus } from "../types";

interface AdminStatusTabsProps {
  activeTab: "ALL" | VerificationStatus;
  onTabChange: (tab: "ALL" | VerificationStatus) => void;
  counts: SellersListCounts;
}

export function AdminStatusTabs({
  activeTab,
  onTabChange,
  counts,
}: AdminStatusTabsProps) {
  const tabs = [
    {
      id: "ALL" as const,
      label: "All Sellers",
      count: counts.all,
      badgeColor: "bg-muted text-foreground",
    },
    {
      id: "PENDING" as const,
      label: "Pending Review",
      count: counts.pending,
      badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30",
    },
    {
      id: "APPROVED" as const,
      label: "Approved",
      count: counts.approved,
      badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
    },
    {
      id: "REJECTED" as const,
      label: "Rejected",
      count: counts.rejected,
      badgeColor: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30",
    },
  ];

  return (
    <div className="border-b border-border/80">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-lg transition-all ${
                isActive
                  ? "text-foreground font-semibold bg-muted shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded-full font-mono ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : tab.badgeColor
                }`}
              >
                {tab.count}
              </span>

              {isActive && (
                <span className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full -mb-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

