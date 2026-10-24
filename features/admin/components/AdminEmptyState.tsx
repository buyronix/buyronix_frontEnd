"use client";

import * as React from "react";
import { Store, SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export function AdminEmptyState({
  hasFilters,
  onResetFilters,
}: AdminEmptyStateProps) {
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
      <div className="size-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center mb-4 text-muted-foreground shadow-2xs">
        {hasFilters ? (
          <SearchX className="size-8 stroke-[1.5]" />
        ) : (
          <Store className="size-8 stroke-[1.5]" />
        )}
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1">
        {hasFilters ? "No matching sellers found" : "No seller registrations yet"}
      </h3>

      <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {hasFilters
          ? "We couldn't find any seller records matching your current filter criteria or search keyword."
          : "When hardware store owners register on Buyronix, their verification requests will appear here for review."}
      </p>

      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="rounded-lg text-xs font-medium gap-1.5 h-8"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset all filters</span>
        </Button>
      )}
    </div>
  );
}
