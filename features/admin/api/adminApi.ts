import { createClient } from "@/lib/supabase/client";
import type {
  SellerRecord,
  SellersListResponse,
  FetchSellersParams,
  VerifySellerActionPayload,
  GoogleSheetsExportPayload,
  GoogleSheetsExportResponse,
} from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * A. Fetch Sellers List with Filters & Tab Badges
 * GET /api/v1/businesses/admin/sellers?status={PENDING|APPROVED|REJECTED}&search={term}&page={page}&limit={limit}
 */
export async function fetchAdminSellers(
  params: FetchSellersParams,
  accessToken?: string | null
): Promise<SellersListResponse> {
  const query = new URLSearchParams();
  if (params.status && params.status !== "ALL") {
    query.set("status", params.status);
  }
  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  const endpoint = `${API_BASE}/api/v1/businesses/admin/sellers${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(endpoint, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.message || `Failed to fetch sellers list (HTTP ${res.status})`
    );
  }

  const json = await res.json();
  if (json.data && Array.isArray(json.data.items)) {
    return json.data as SellersListResponse;
  }

  return {
    items: [],
    pagination: {
      page: params.page || 1,
      limit: params.limit || 20,
      totalItems: 0,
      totalPages: 1,
    },
    counts: {
      all: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  };
}

/**
 * B. Fetch Single Seller Details
 * GET /api/v1/businesses/admin/:id
 */
export async function fetchAdminSellerById(
  id: string,
  accessToken?: string | null
): Promise<SellerRecord> {
  const endpoint = `${API_BASE}/api/v1/businesses/admin/${id}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(endpoint, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.message || `Failed to fetch seller details for ${id} (HTTP ${res.status})`
    );
  }

  const json = await res.json();
  const data = json.data || json;
  return data as SellerRecord;
}

/**
 * C. Verify Seller (Approve or Reject)
 * PATCH /api/v1/businesses/admin/:id/verify
 */
export async function verifySeller(
  id: string,
  payload: VerifySellerActionPayload,
  accessToken?: string | null
): Promise<{ success: boolean; data: SellerRecord; message?: string }> {
  const endpoint = `${API_BASE}/api/v1/businesses/admin/${id}/verify`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.message || `Failed to verify seller ${id} (HTTP ${res.status})`
    );
  }

  const json = await res.json();
  return {
    success: true,
    data: json.data,
    message: json.message,
  };
}

/**
 * D. Export to Google Sheets
 * POST /api/v1/businesses/admin/export/google-sheets
 */
export async function exportToGoogleSheets(
  payload: GoogleSheetsExportPayload,
  accessToken?: string | null
): Promise<GoogleSheetsExportResponse> {
  const endpoint = `${API_BASE}/api/v1/businesses/admin/export/google-sheets`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.message || `Google Sheets export failed (HTTP ${res.status})`
    );
  }

  const json = await res.json();
  if (json.data?.spreadsheetUrl) {
    return json.data as GoogleSheetsExportResponse;
  }

  throw new Error("Invalid response format received from export endpoint.");
}

/**
 * E. Direct CSV Download
 * GET /api/v1/businesses/admin/export/csv?status={APPROVED|PENDING|REJECTED}
 */
export async function downloadSellersCsv(
  status?: string,
  accessToken?: string | null
): Promise<void> {
  const query = status && status !== "ALL" ? `?status=${status}` : "";
  const endpoint = `${API_BASE}/api/v1/businesses/admin/export/csv${query}`;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(endpoint, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.message || `CSV download failed (HTTP ${res.status})`
    );
  }

  const blob = await res.blob();
  triggerBlobDownload(blob, "buyronix-sellers.csv");
}

/**
 * F. Direct PDF Report Download
 * GET /api/v1/businesses/admin/export/pdf?status={APPROVED|PENDING|REJECTED}
 */
export async function downloadBusinessesPdf(
  status?: string,
  accessToken?: string | null
): Promise<void> {
  let token = accessToken;
  if (!token && typeof window !== "undefined") {
    try {
      const supabase = createClient();
      const session = (await supabase.auth.getSession()).data.session;
      token = session?.access_token;
    } catch {
      // ignore
    }
  }

  if (!token) {
    throw new Error("You must be logged in as an administrator to export data.");
  }

  const query = status && status !== "ALL" ? `?status=${encodeURIComponent(status)}` : "";
  const endpoint = `${API_BASE}/api/v1/businesses/admin/export/pdf${query}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to download PDF report.");
  }

  // Handle binary PDF blob and trigger browser download
  const blob = await response.blob();
  const dateStr = new Date().toISOString().split("T")[0];
  const fileStatus = status && status !== "ALL" ? `${status.toLowerCase()}-` : "";
  const filename = `buyronix-businesses-${fileStatus}${dateStr}.pdf`;

  triggerBlobDownload(blob, filename);
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
