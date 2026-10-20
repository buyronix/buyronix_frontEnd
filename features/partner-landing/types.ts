export type { SellerRegistrationForm } from "@/features/registration";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BenefitCard {
  title: string;
  description: string;
  tagline: string;
  iconName: "clock" | "shield-check" | "credit-card";
}
