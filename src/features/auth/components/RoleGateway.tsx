import React from "react";
import { StoreIcon, UserIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IllustrationGlobe } from "./IllustrationGlobe";

interface RoleGatewayProps {
  onSelectSeller: () => void;
  onSelectBuyer: () => void;
  onDirectLogin: () => void;
}

export function RoleGateway({
  onSelectSeller,
  onSelectBuyer,
  onDirectLogin,
}: RoleGatewayProps) {
  return (
    <div className="flex w-full flex-1 flex-col justify-between py-2 text-[#111110]">
      {/* Mobile Top Header (< lg) */}
      <header className="flex items-center justify-between w-full pb-4 border-b border-neutral-100 lg:hidden">
        <span className="font-serif font-black tracking-tight text-[22px] text-neutral-900 select-none">
          ritual.biz
        </span>
        <button
          onClick={onDirectLogin}
          type="button"
          className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2">
        {/* Eyebrow Label */}
        <div className="text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-3 select-none">
          Account Type Selection
        </div>

        {/* Heading */}
        <h1 className="font-serif text-[38px] sm:text-[44px] lg:text-[46px] leading-[1.05] font-normal text-neutral-950 italic select-none mb-3">
          are you a seller?
        </h1>

        {/* Description — Desktop */}
        <p className="hidden lg:block text-sm leading-relaxed text-neutral-500 max-w-lg mb-8 select-none">
          Please specify how you intend to use Ritual today. Choose seller mode
          to list products and link bank account details, or proceed as a regular
          buyer.
        </p>

        {/* Description — Mobile */}
        <div className="lg:hidden flex flex-col items-center text-center my-4">
          <p className="text-[10px] tracking-[0.24em] font-medium text-neutral-500 uppercase mb-2 select-none">
            SEVEN MINUTES. ALL YOURS.
          </p>
          <IllustrationGlobe className="size-48 sm:size-56 my-2" />
          <p className="text-xs leading-relaxed text-neutral-600 max-w-[280px] select-none">
            Create a merchant profile to register your business, or continue as a
            buyer to shop directly.
          </p>
        </div>

        {/* Role Cards (Mobile: buttons, Desktop: side-by-side cards) */}
        <div className="mt-4 lg:mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Seller Card */}
          {/* Mobile view button */}
          <Button
            onClick={onSelectSeller}
            size="lg"
            className="h-[52px] w-full rounded-full bg-[#111110] text-white hover:bg-neutral-800 text-[15px] font-medium tracking-tight lg:hidden"
          >
            <span>Yes, I&apos;m a Seller</span>
            <ArrowRightIcon data-icon="inline-end" />
          </Button>

          {/* Desktop view card */}
          <button
            onClick={onSelectSeller}
            type="button"
            className="hidden lg:flex p-6 rounded-2xl bg-[#111110] text-white text-left flex-col justify-between hover:bg-neutral-900 transition-all duration-200 cursor-pointer shadow-md group border border-neutral-900"
          >
            <div className="size-9 rounded-full bg-neutral-800 flex items-center justify-center mb-6 text-white group-hover:scale-105 transition-transform">
              <StoreIcon className="size-4" />
            </div>

            <div>
              <h3 className="font-semibold text-base tracking-tight mb-1 text-white">
                Yes, I am a Seller
              </h3>
              <p className="text-xs text-neutral-400 leading-normal">
                Register business, GSTIN &amp; location
              </p>
            </div>
          </button>

          {/* Buyer Card */}
          {/* Mobile view button */}
          <Button
            variant="outline"
            onClick={onSelectBuyer}
            size="lg"
            className="h-[52px] w-full rounded-full border-neutral-200 text-[#111110] text-[15px] font-medium tracking-tight lg:hidden"
          >
            No, I&apos;m a Buyer
          </Button>

          {/* Desktop view card */}
          <button
            onClick={onSelectBuyer}
            type="button"
            className="hidden lg:flex p-6 rounded-2xl bg-white text-neutral-950 border border-neutral-200/90 text-left flex-col justify-between hover:bg-neutral-50/80 hover:border-neutral-300 transition-all duration-200 cursor-pointer shadow-2xs group"
          >
            <div className="size-9 rounded-full bg-neutral-100 flex items-center justify-center mb-6 text-neutral-800 group-hover:scale-105 transition-transform">
              <UserIcon className="size-4" />
            </div>

            <div>
              <h3 className="font-semibold text-base tracking-tight mb-1 text-neutral-950">
                No, I&apos;m a Buyer
              </h3>
              <p className="text-xs text-neutral-500 leading-normal">
                Simple 1-minute account setup
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Sign-In Link */}
      <div className="pt-6 mt-8 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
        <span>Already registered with us?</span>
        <button
          onClick={onDirectLogin}
          type="button"
          className="font-bold text-neutral-950 hover:underline cursor-pointer tracking-tight"
        >
          Sign In to Account
        </button>
      </div>
    </div>
  );
}
