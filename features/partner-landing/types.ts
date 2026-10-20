export interface SellerRegistrationForm {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  category: string;
  gstNumber: string;
  pincode: string;
  city: string;
}

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

