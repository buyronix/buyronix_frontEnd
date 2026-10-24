"use client";

import * as React from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SellersListCounts, VerificationStatus } from "../types";

interface AdminStatCardsProps {
  counts: SellersListCounts;
  activeTab: "ALL" | VerificationStatus;
  onSelectTab: (tab: "ALL" | VerificationStatus) => void;
  isLoading?: boolean;
}

export function AdminStatCards({
  counts,
  activeTab,
  onSelectTab,
  isLoading,
}: AdminStatCardsProps) {
  const cards = [
    {
      id: "ALL" as const,
      title: "Total Sellers",
      count: counts.all,
      subtitle: "Registered applications",
      icon: Users,
      badgeText: "All Records",
      cardBorder: "border-border/80",
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      badgeClass: "bg-primary/10 text-primary border-primary/20",
      activeRing: "ring-2 ring-primary border-primary",
    },
    {
      id: "PENDING" as const,
      title: "Pending Review",
      count: counts.pending,
      subtitle: "Action required",
      icon: Clock,
      badgeText: "Action Needed",
      cardBorder: "border-amber-500/30 dark:border-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/10",
      badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      activeRing: "ring-2 ring-amber-500 border-amber-500",
      pulse: counts.pending > 0,
    },
    {
      id: "APPROVED" as const,
      title: "Approved Stores",
      count: counts.approved,
      subtitle: "Verified & Active",
      icon: CheckCircle2,
      badgeText: "Live in app",
      cardBorder: "border-emerald-500/30 dark:border-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10",
      badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      activeRing: "ring-2 ring-emerald-500 border-emerald-500",
    },
    {
      id: "REJECTED" as const,
      title: "Rejected",
      count: counts.rejected,
      subtitle: "Ineligible or failed",
      icon: XCircle,
      badgeText: "Closed",
      cardBorder: "border-rose-500/30 dark:border-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-500/10",
      badgeClass: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
      activeRing: "ring-2 ring-rose-500 border-rose-500",
    },
  ];

  return (
    <div className="w-full">
      {/* 
        Responsive layout:
        Mobile (<1024px): Swipeable horizontal carousel (overflow-x-auto, snap-x)
        Desktop (>=1024px): 4-column grid
      */}
      <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:pb-0 scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeTab === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectTab(card.id)}
              className={`shrink-0 w-[240px] sm:w-[260px] lg:w-auto snap-start cursor-pointer transition-all duration-150 transform active:scale-[0.99] rounded-xl border bg-card p-4 shadow-xs hover:shadow-md ${
                card.cardBorder
              } ${isSelected ? card.activeRing : "hover:border-foreground/20"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </span>

                <div className={`p-2 rounded-lg ${card.iconBg} ${card.iconColor}`}>
                  <Icon className="size-4 shrink-0" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  {isLoading ? (
                    <span className="inline-block w-12 h-8 bg-muted animate-pulse rounded" />
                  ) : (
                    card.count
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {card.pulse && (
                    <span className="relative flex size-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full size-2 bg-amber-500"></span>
                    </span>
                  )}
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-medium ${card.badgeClass}`}>
                    {card.badgeText}
                  </Badge>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{card.subtitle}</span>
                <span
                  className={`inline-flex items-center font-medium transition-colors ${
                    isSelected ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Filter</span>
                  <ArrowRight className="size-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
