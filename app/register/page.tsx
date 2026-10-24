import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterPage } from "@/features/registration";

export const metadata: Metadata = {
  title: "Register Your Shop — Buyronix Partner",
  description:
    "Join verified neighborhood hardware sellers and bring your inventory closer to nearby buyers with instant local delivery.",
};

export default function Register() {
  return (
    <Suspense fallback={null}>
      <RegisterPage />
    </Suspense>
  );
}
