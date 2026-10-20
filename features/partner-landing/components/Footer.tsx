"use client";

import * as React from "react";
import Link from "next/link";

interface FooterProps {
  onOpenRegister: () => void;
}

export function Footer({ onOpenRegister }: FooterProps) {
  return (
    <footer className="border-t border-neutral-100 bg-white dark:border-neutral-800 dark:bg-black pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between gap-10 sm:gap-12 pb-12 border-b border-neutral-100 dark:border-neutral-800">
          {/* Brand & Purpose */}
          <div className="flex flex-col gap-3 max-w-md">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
            >
              <span>buyronix</span>
              <span className="text-[#e11d48]">.</span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">
              Local expertise. A wider reach.
              <br />
              Building the next chapter of neighborhood hardware retail.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-[0.16em] text-neutral-800 uppercase dark:text-neutral-200">
              EXPLORE BUYRONIX
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
              <a
                href="#top"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#features"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                About us
              </a>
              <button
                type="button"
                onClick={onOpenRegister}
                className="hover:text-[#e11d48] dark:hover:text-rose-400 transition-colors cursor-pointer text-left font-medium"
              >
                Become a seller
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 dark:text-neutral-500">
          <p>© Buyronix. All rights reserved.</p>
          <p>Made for neighborhood businesses.</p>
        </div>
      </div>
    </footer>
  );
}
