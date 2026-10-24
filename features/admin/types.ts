export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SellerRecord {
  id: string;
  user_id: string;
  shop_name: string;
  gst_number: string;
  mob_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  owner_name: string;
  mob_no: string;
  owner_city: string;
  owner_state: string;
  owner_address: string;
  verification_status: VerificationStatus;
  rejection_reason?: string | null;
  verified_at?: string | null;
  created_at: string;
}

export interface SellersListPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface SellersListCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface SellersListResponse {
  items: SellerRecord[];
  pagination: SellersListPagination;
  counts: SellersListCounts;
}

export interface FetchSellersParams {
  status?: VerificationStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}

export type VerifySellerActionPayload =
  | {
      status: "APPROVED";
    }
  | {
      status: "REJECTED";
      rejection_reason: string;
    };

export interface GoogleSheetsExportPayload {
  status?: VerificationStatus;
  sheetTitle?: string;
  shareWithEmail?: string;
  makePublic?: boolean;
}

export interface GoogleSheetsExportResponse {
  spreadsheetUrl: string;
  totalExported: number;
}

