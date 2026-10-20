export interface SellerRegistrationForm {
  shopName: string;
  gstNumber: string;
  mobNumber: string;
  email: string;
  address: string;
  ownerName: string;
  mobNo: string;
  ownerAddress: string;
  // Optional compatibility fields
  phone?: string;
  category?: string;
  pincode?: string;
  city?: string;
  shopAddress?: string;
  ownerMobile?: string;
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
