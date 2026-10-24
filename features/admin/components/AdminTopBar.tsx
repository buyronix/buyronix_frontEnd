"use client";

import * as React from "react";
import {
  Search,
  X,
  Bell,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface AdminTopBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isFetching?: boolean;
  onOpenGoogleSheetsExport: () => void;
  onDownloadCsv: () => void;
  isCsvDownloading?: boolean;
  pendingCount?: number;
}

export function AdminTopBar({
  searchValue,
  onSearchChange,
  onRefresh,
  isFetching,
  onOpenGoogleSheetsExport,
  onDownloadCsv,
  isCsvDownloading,
  pendingCount = 0,
}: AdminTopBarProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut (⌘K or Ctrl+K) to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="hidden lg:flex h-16 px-6 border-b border-border/80 bg-background/80 backdrop-blur-md items-center justify-between sticky top-0 z-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground select-none">
        <span className="flex items-center gap-1 text-foreground/80 font-semibold">
          <Shield className="size-3.5 text-primary" />
          <span>Admin</span>
        </span>
        <ChevronRight className="size-3.5 text-muted-foreground/60" />
        <span>Sellers</span>
        <ChevronRight className="size-3.5 text-muted-foreground/60" />
        <span className="text-foreground font-semibold">Verification Requests</span>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative group">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search shop, owner, GSTIN, phone..."
            className="pl-9 pr-14 h-9 bg-muted/40 border-border/80 focus-visible:bg-background rounded-lg text-xs transition-all shadow-xs"
          />
          {searchValue ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-background border border-border rounded shadow-2xs pointer-events-none">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Refresh / Live Sync Button */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                onClick={onRefresh}
                disabled={isFetching}
                aria-label="Refresh sellers list"
                className="size-8 rounded-lg border-border/80 bg-background hover:bg-muted"
              />
            }
          >
            <RefreshCw
              className={`size-3.5 text-muted-foreground ${
                isFetching ? "animate-spin text-primary" : ""
              }`}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <span>{isFetching ? "Syncing data..." : "Refresh sellers"}</span>
          </TooltipContent>
        </Tooltip>

        {/* Notifications Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Notifications"
                className="relative size-8 rounded-lg border-border/80 bg-background hover:bg-muted"
              />
            }
          >
            <Bell className="size-3.5 text-muted-foreground" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-background animate-pulse">
                {pendingCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/60">
              <span className="text-xs font-semibold text-foreground">Notifications</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {pendingCount} Pending
              </span>
            </div>
            <div className="py-2 px-1 space-y-1">
              {pendingCount > 0 ? (
                <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="size-3 text-amber-500" />
                    <span>{pendingCount} sellers awaiting review</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Immediate verification required to enable catalog publishing.
                  </p>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  All seller verifications are up to date!
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Export Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1.5 px-3 rounded-lg text-xs font-semibold shadow-xs"
              />
            }
          >
            <Download className="size-3.5" />
            <span>Export</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 py-1">
                Export Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onOpenGoogleSheetsExport}
                className="cursor-pointer gap-2 px-2 py-1.5 text-xs rounded-md"
              >
                <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">Export to Google Sheets</span>
                  <span className="text-[10px] text-muted-foreground">
                    Creates or updates online spreadsheet
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onDownloadCsv}
                disabled={isCsvDownloading}
                className="cursor-pointer gap-2 px-2 py-1.5 text-xs rounded-md mt-1"
              >
                <FileText className="size-4 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">Download CSV</span>
                  <span className="text-[10px] text-muted-foreground">
                    Direct raw tabular stream (.csv)
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

