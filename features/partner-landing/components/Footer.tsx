"use client";

import * as React from "react";
import Link from "next/link";

interface FooterProps {
  onOpenRegister: () => void;
}

export function Footer({ onOpenRegister }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 bg-[#fefbfc] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between gap-10 sm:gap-12 pb-12 border-b border-neutral-200">
          {/* Brand & Purpose */}
          <div className="flex flex-col gap-3 max-w-md">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-neutral-900"
            >
              <span>buy</span>
              <span className="text-[#623ac3]">ronix</span>
              <span className="text-[#623ac3]">.</span>
            </Link>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Local expertise. A wider reach.
              <br />
              Building the next chapter of neighborhood hardware retail.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-[0.16em] text-neutral-900 uppercase">
              EXPLORE BUYRONIX
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600">
              <a
                href="#top"
                className="hover:text-[#623ac3] transition-colors"
              >
                Home
              </a>
              <a
                href="#features"
                className="hover:text-[#623ac3] transition-colors"
              >
                About us
              </a>
              <button
                type="button"
                onClick={onOpenRegister}
                className="hover:text-[#623ac3] transition-colors cursor-pointer text-left font-medium"
              >
                Become a seller
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© Buyronix. All rights reserved.</p>
          <p>Made for neighborhood businesses.</p>
        </div>
      </div>
    </footer>
  );
}
