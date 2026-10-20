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
import { Menu, ArrowRight, ArrowUpRight, Zap } from "lucide-react";

interface NavbarProps {
  onOpenRegister: () => void;
}

export function Navbar({ onOpenRegister }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

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
          ? "bg-[#fefbfc]/95 backdrop-blur-md border-b border-neutral-200/80 py-3 shadow-md shadow-black/5"
          : "bg-[#fefbfc] py-4 sm:py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Styled with icon & #623ac3 ronix accent */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-95"
        >
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-[#623ac3] text-white shadow-xs shadow-black/10">
            <Zap className="size-4 sm:size-4.5 fill-white text-white" />
          </div>
          <span className="font-semibold text-neutral-900">
            Buy <span className="text-[#623ac3] font-bold transition-colors">ronix</span>
          </span>
        </Link>

        {/* Desktop Navigation Links & Register Button */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-2 text-sm font-medium">
            <a
              href="#top"
              className="rounded-full bg-[#ede9fe] text-[#623ac3] font-semibold px-4 py-1.5 shadow-xs shadow-black/5 transition-colors hover:bg-[#e4ddfc]"
            >
              Home
            </a>
            <a
              href="#benefits"
              className="px-3 py-1.5 text-neutral-600 transition-colors hover:text-neutral-950"
            >
              Benefits
            </a>
            <a
              href="#features"
              className="px-3 py-1.5 text-neutral-600 transition-colors hover:text-neutral-950"
            >
              About us
            </a>
            <a
              href="#how-it-works"
              className="px-3 py-1.5 text-neutral-600 transition-colors hover:text-neutral-950"
            >
              How it works
            </a>
          </nav>

          <Button
            onClick={onOpenRegister}
            className="rounded-full bg-[#623ac3] px-5 py-2.5 text-sm font-semibold text-[#ffffff] shadow-md shadow-black/15 transition-all hover:bg-[#522ea8] hover:shadow-lg hover:shadow-black/20 active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Register your shop</span>
            <ArrowUpRight className="size-4 text-[#ffffff]" />
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            onClick={onOpenRegister}
            size="sm"
            className="rounded-full bg-[#623ac3] px-3.5 py-1.5 text-xs font-semibold text-[#ffffff] shadow-xs shadow-black/10 hover:bg-[#522ea8] inline-flex items-center gap-1"
          >
            <span>Register</span>
            <ArrowUpRight className="size-3 text-[#ffffff]" />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open navigation menu"
                  className="size-9 rounded-lg text-neutral-900 hover:bg-neutral-100"
                />
              }
            >
              <Menu className="size-5 text-neutral-900" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-6 bg-[#fefbfc] text-neutral-900 border-neutral-200 shadow-2xl shadow-black/20">
              <SheetHeader className="text-left pb-4 border-b border-neutral-200">
                <SheetTitle className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#623ac3] text-white shadow-xs shadow-black/10">
                    <Zap className="size-3.5 fill-white text-white" />
                  </div>
                  <span>Buy <span className="text-[#623ac3]">ronix</span></span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3 py-6">
                <a
                  href="#top"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                >
                  <span>Home</span>
                  <ArrowRight className="size-4 text-[#623ac3]" />
                </a>
                <a
                  href="#benefits"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                >
                  <span>Benefits</span>
                  <ArrowRight className="size-4 text-[#623ac3]" />
                </a>
                <a
                  href="#features"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                >
                  <span>About us</span>
                  <ArrowRight className="size-4 text-[#623ac3]" />
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                >
                  <span>How It Works</span>
                  <ArrowRight className="size-4 text-[#623ac3]" />
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                >
                  <span>FAQ</span>
                  <ArrowRight className="size-4 text-[#623ac3]" />
                </a>
              </div>

              <div className="mt-auto pt-6 border-t border-neutral-200">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full rounded-full bg-[#623ac3] py-3 text-sm font-semibold text-[#ffffff] shadow-md shadow-black/15 hover:bg-[#522ea8] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Register your shop</span>
                  <ArrowUpRight className="size-4 text-[#ffffff]" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
