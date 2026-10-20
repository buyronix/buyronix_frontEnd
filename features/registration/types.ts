export const SOUTH_INDIAN_STATES = [
  "Andhra Pradesh",
  "Karnataka",
  "Kerala",
  "Puducherry",
  "Tamil Nadu",
  "Telangana",
] as const;

export type SouthIndianState = (typeof SOUTH_INDIAN_STATES)[number];

export interface SellerRegistrationForm {
  ownerName: string;
  mobNo: string;
  ownerAddress: string;
  ownerState: string;
  ownerCity: string;
  shopName: string;
  gstNumber: string;
  mobNumber: string;
  email: string;
  address: string;
  pincode: string;
  state: string;
  // Optional compatibility fields
  city?: string;
  phone?: string;
  category?: string;
  shopAddress?: string;
  ownerMobile?: string;
  ownerPincode?: string;
}
