"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ArrowRight, ArrowUpRight, LogOut, Store, Shield } from "lucide-react";
import { useAuth } from "@/features/auth";
import { isJwtAdmin } from "@/lib/jwt";

interface NavbarProps {
  onOpenRegister: () => void;
}

export function Navbar({ onOpenRegister }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, accessToken, signOut } = useAuth();

  const isAdmin =
    isJwtAdmin(accessToken) ||
    user?.app_metadata?.role === "admin" ||
    (Array.isArray(user?.app_metadata?.role) && user.app_metadata.role.includes("admin")) ||
    (Array.isArray(user?.app_metadata?.roles) && user.app_metadata.roles.includes("admin"));

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/85 backdrop-blur-md border-b border-white/10 py-3 shadow-md"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center text-2xl sm:text-3xl font-extrabold italic tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <span>buyronix</span>
          <span className="not-italic text-[#e11d48] transition-transform group-hover:scale-125 ml-0.5">
            .
          </span>
        </Link>

        {/* Desktop Navigation Links & Register/Portal Button */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium text-white/90">
            <a href="#top" className="transition-colors hover:text-white">
              Home
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              About us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-lg bg-neutral-800 border border-white/20 px-3 py-2 text-xs font-semibold text-neutral-200 shadow-sm transition-all hover:bg-neutral-700 hover:text-white inline-flex items-center gap-1.5"
              >
                <Shield className="size-3.5 text-amber-400" />
                <span>Admin Console</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <Button
                  onClick={onOpenRegister}
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 inline-flex items-center gap-1.5"
                >
                  <Store className="size-4" />
                  <span>My Shop / Registration</span>
                  <ArrowUpRight className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-xs text-neutral-300 hover:text-white hover:bg-white/10 inline-flex items-center gap-1"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign out</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={onOpenRegister}
                className="rounded-lg bg-[#e11d48] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#c9183d] active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>Register your shop</span>
                <ArrowUpRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            onClick={onOpenRegister}
            size="sm"
            className="rounded-lg bg-[#e11d48] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#c9183d] inline-flex items-center gap-1"
          >
            <span>{user ? "My Shop" : "Register"}</span>
            <ArrowUpRight className="size-3" />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open navigation menu"
                  className="size-9 rounded-lg text-white hover:bg-white/10"
                />
              }
            >
              <Menu className="size-5 text-white" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[320px] p-6 bg-neutral-950 text-white border-neutral-800"
            >
              <SheetHeader className="text-left pb-4 border-b border-neutral-800">
                <SheetTitle className="text-xl font-extrabold italic tracking-tight text-white">
                  buyronix<span className="not-italic text-[#e11d48]">.</span>
                </SheetTitle>
              </SheetHeader>

              {user && (
                <div className="py-3 px-1 border-b border-neutral-800/80 mb-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 truncate max-w-[170px]">
                    {user.email}
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    Sign out
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-4 py-6">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-amber-400 transition-colors bg-amber-500/10 border border-amber-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="size-4" />
                      <span>Admin Console</span>
                    </div>
                    <ArrowRight className="size-4" />
                  </Link>
                )}
                <a
                  href="#top"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-200 transition-colors hover:bg-neutral-900"
                >
                  <span>Home</span>
                  <ArrowRight className="size-4 text-neutral-500" />
                </a>
                <a
                  href="#features"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-200 transition-colors hover:bg-neutral-900"
                >
                  <span>About us</span>
                  <ArrowRight className="size-4 text-neutral-500" />
                </a>
                <a
                  href="#benefits"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-200 transition-colors hover:bg-neutral-900"
                >
                  <span>Benefits</span>
                  <ArrowRight className="size-4 text-neutral-500" />
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-200 transition-colors hover:bg-neutral-900"
                >
                  <span>How It Works</span>
                  <ArrowRight className="size-4 text-neutral-500" />
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-200 transition-colors hover:bg-neutral-900"
                >
                  <span>FAQ</span>
                  <ArrowRight className="size-4 text-neutral-500" />
                </a>
              </div>

              <div className="mt-auto pt-6 border-t border-neutral-800">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full rounded-lg bg-[#e11d48] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#c9183d] inline-flex items-center justify-center gap-2"
                >
                  <span>{user ? "View Shop Registration" : "Register your shop"}</span>
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
