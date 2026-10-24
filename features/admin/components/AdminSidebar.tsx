"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  ShieldCheck,
  LogOut,
  Sliders,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User } from "@supabase/supabase-js";

interface AdminSidebarProps {
  currentTab: string;
  onTabChange?: (tab: string) => void;
  pendingCount?: number;
  user?: User | null;
  onSignOut: () => void;
}

export function AdminSidebar({
  currentTab = "sellers",
  pendingCount = 0,
  user,
  onSignOut,
}: AdminSidebarProps) {
  const userEmail = user?.email || "";
  const userName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (userEmail ? userEmail.split("@")[0] : "Admin");

  const navItems = [
    {
      id: "dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      href: "/admin",
      badge: null,
    },
    {
      id: "sellers",
      label: "Seller Verification",
      icon: Store,
      href: "/admin",
      badge: pendingCount > 0 ? pendingCount : null,
      badgeVariant: "amber" as const,
    },
    {
      id: "settings",
      label: "Portal Settings",
      icon: Sliders,
      href: "#settings",
      badge: null,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-border/80 bg-sidebar/80 backdrop-blur-xl z-30 select-none">
      {/* Brand & Console Title */}
      <div className="h-16 px-6 border-b border-border/80 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center text-xl font-extrabold italic tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <span>buyronix</span>
          <span className="not-italic text-[#e11d48] ml-0.5">.</span>
          <span className="ml-2 not-italic text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            Admin
          </span>
        </Link>

        <Link
          href="/"
          target="_blank"
          title="Open Public Partner Site"
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
        >
          <ExternalLink className="size-4" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Management
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {}}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? "bg-primary-foreground text-primary"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System & Verification status callout */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Sparkles className="size-3.5 text-amber-500" />
            <span>Seller Onboarding</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Review GSTIN and business credentials carefully before granting store access.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Audit Trail</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Admin Profile & Sign Out Footer */}
      <div className="p-4 border-t border-border/80 bg-sidebar/90">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-9 rounded-full bg-linear-to-tr from-primary to-neutral-500 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-xs shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-foreground truncate">
              {userName}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {userEmail}
            </div>
          </div>
          <div className="shrink-0">
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-medium"
            >
              <ShieldCheck className="size-2.5 mr-0.5" />
              Role: Admin
            </Badge>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onSignOut}
          className="w-full justify-center text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors h-8"
        >
          <LogOut className="size-3.5 mr-1.5" />
          <span>Sign out</span>
        </Button>
      </div>
    </aside>
  );
}
