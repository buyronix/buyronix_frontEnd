"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  Store,
  Sliders,
  LogOut,
  ExternalLink,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { User } from "@supabase/supabase-js";

interface AdminMobileHeaderProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  pendingCount?: number;
  user?: User | null;
  onSignOut: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenGoogleSheetsExport: () => void;
  onDownloadCsv: () => void;
  isCsvDownloading?: boolean;
}

export function AdminMobileHeader({
  currentTab,
  pendingCount = 0,
  user,
  onSignOut,
  searchValue,
  onSearchChange,
  onOpenGoogleSheetsExport,
  onDownloadCsv,
  isCsvDownloading,
}: AdminMobileHeaderProps) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  const userEmail = user?.email || "";
  const userName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (userEmail ? userEmail.split("@")[0] : "Admin");

  const isSellersActive = currentTab === "sellers" || !currentTab;

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/80">
      {/* Top Bar Row */}
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2.5">
          {/* Hamburger Menu Sheet Trigger */}
          <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open Admin Navigation Menu"
                  className="size-9 rounded-lg"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="left" className="w-[85vw] max-w-xs p-0 flex flex-col justify-between">
              <div>
                <SheetHeader className="p-4 border-b border-border/80 flex flex-row items-center justify-between">
                  <SheetTitle className="text-left font-extrabold italic text-lg tracking-tight">
                    <span>buyronix</span>
                    <span className="text-[#e11d48]">.</span>
                    <span className="ml-1.5 not-italic text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      Admin
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Nav Links */}
                <div className="p-4 space-y-2">
                  <button
                    onClick={() => setIsNavOpen(false)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isSellersActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Store className="size-4.5" />
                      <span>Sellers Review</span>
                    </div>
                    {pendingCount > 0 && (
                      <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-primary-foreground text-primary">
                        {pendingCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setIsNavOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    <LayoutDashboard className="size-4.5" />
                    <span>Overview Dashboard</span>
                  </button>

                  <button
                    onClick={() => setIsNavOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    <Sliders className="size-4.5" />
                    <span>Settings & Security</span>
                  </button>

                  <div className="pt-4 border-t border-border/60">
                    <Link
                      href="/"
                      target="_blank"
                      className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <span>Public Partner Site</span>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Profile & Logout Footer */}
              <div className="p-4 border-t border-border/80 bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{userName}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {userEmail}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsNavOpen(false);
                    onSignOut();
                  }}
                  className="w-full justify-center text-xs text-destructive hover:bg-destructive/10 h-8"
                >
                  <LogOut className="size-3.5 mr-1.5" />
                  <span>Sign out</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Brand Logo */}
          <div className="flex items-center">
            <span className="font-extrabold italic text-lg tracking-tight">
              buyronix<span className="text-[#e11d48]">.</span>
            </span>
            <Badge variant="secondary" className="ml-1.5 text-[9px] px-1 py-0">
              Admin
            </Badge>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsSearchExpanded((prev) => !prev)}
            aria-label="Toggle search input"
            className="size-8 rounded-lg"
          >
            <Search className="size-4 text-muted-foreground" />
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Export Menu"
                  className="size-8 rounded-lg"
                />
              }
            >
              <Download className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1.5">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 py-1">
                  Export Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onOpenGoogleSheetsExport}
                  className="cursor-pointer gap-2 px-2 py-1.5 text-xs rounded-md"
                >
                  <FileSpreadsheet className="size-4 text-emerald-600" />
                  <span>Google Sheets</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDownloadCsv}
                  disabled={isCsvDownloading}
                  className="cursor-pointer gap-2 px-2 py-1.5 text-xs rounded-md"
                >
                  <FileText className="size-4 text-primary" />
                  <span>Download CSV</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Collapsible Mobile Search Row */}
      {isSearchExpanded && (
        <div className="px-4 pb-3 pt-1 border-t border-border/40 bg-muted/20">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search shop, owner, GSTIN..."
              className="pl-9 pr-8 h-9 text-xs rounded-lg bg-background"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
