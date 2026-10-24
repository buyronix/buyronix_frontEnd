export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const SOUTH_INDIAN_STATES = [
  "Andhra Pradesh",
  "Karnataka",
  "Kerala",
  "Puducherry",
  "Tamil Nadu",
  "Telangana",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];
export type SouthIndianState = (typeof SOUTH_INDIAN_STATES)[number];

export type BusinessVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

/**
 * Expected request body for POST /api/v1/businesses/register
 * Flat JSON, camelCase, with shop & owner sections
 */
export interface RegisterBusinessPayload {
  // Shop Information
  shopName: string;
  gstNumber: string;
  mobNumber: string;
  email: string;
  address: string;
  pincode: string;
  state: string;
  city: string;

  // Owner Information
  ownerName: string;
  mobNo: string;
  ownerState: string;
  ownerCity: string;
  ownerAddress: string;
}

/**
 * Request body for PUT /api/v1/businesses/resubmit
 */
export type ResubmitBusinessPayload = Partial<RegisterBusinessPayload>;

/**
 * Backwards compatibility alias for the registration form
 */
export type SellerRegistrationForm = RegisterBusinessPayload;

/**
 * Normalized status response returned by GET /api/v1/businesses/my-status
 */
export interface BusinessStatusResponse {
  id: string;
  shop_name: string;
  verification_status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason?: string | null;
  verified_at?: string | null;
  created_at: string;
}

/**
 * Detailed business entity returned from database/backend
 */
export interface BusinessFullDetails {
  id: string;
  user_id: string;
  shop_name: string;
  gst_number: string;
  mob_number: string;
  email: string;
  address: string;
  pincode: string;
  state: string;
  city: string;
  owner_name: string;
  mob_no: string;
  owner_state: string;
  owner_city: string;
  owner_address: string;
  verification_status: BusinessVerificationStatus;
  rejection_reason?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
  created_at: string;
  updated_at: string;

  // Backwards compatibility for legacy field names
  business_name?: string;
  mobile_number?: string;
  address_line?: string;
  bank_holder_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
}

export interface StatusCheckResult {
  found: boolean;
  status?: BusinessStatusResponse;
  details?: BusinessFullDetails;
  offline?: boolean;
  error?: string;
}

export interface FieldValidationError {
  field: string;
  message: string;
}

export interface RegisterResult {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: BusinessStatusResponse | BusinessFullDetails | Record<string, unknown>;
  errors?: FieldValidationError[];
  isConflict?: boolean;
}

// Regex patterns & validation helpers
export const INDIAN_GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const INDIAN_PINCODE_REGEX = /^[1-9][0-9]{5}$/;

/**
 * Validates Indian mobile numbers, accommodating optional +91/0 prefix and formatting (spaces/dashes).
 * Permits '+91 98765 43210', '9876543210', '+919876543210'.
 */
export function isValidIndianPhone(val: string): boolean {
  if (!val) return false;
  const digits = val.replace(/^(\+91|0)/, "").replace(/[\s\-()]/g, "");
  return /^[6-9]\d{9}$/.test(digits);
}
