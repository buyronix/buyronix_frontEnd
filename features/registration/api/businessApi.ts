import type {
  RegisterBusinessPayload,
  ResubmitBusinessPayload,
  StatusCheckResult,
  RegisterResult,
} from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type { StatusCheckResult, RegisterResult };

/**
 * Checks if the authenticated seller already has a registered business application.
 * Corresponds to GET /api/v1/businesses/my-status
 */
export async function fetchBusinessStatus(
  accessToken: string
): Promise<StatusCheckResult> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/businesses/my-status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      return { found: false };
    }

    if (res.ok) {
      const json = await res.json();
      return {
        found: true,
        status: json.data?.status,
        details: json.data?.details,
      };
    }

    const errJson = await res.json().catch(() => ({}));
    return {
      found: false,
      error: errJson.message || `Failed to fetch status (HTTP ${res.status})`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    console.warn("Backend API not reachable at", API_BASE, message);
    return {
      found: false,
      offline: true,
    };
  }
}

/**
 * Submits new business registration to the backend.
 * Corresponds to POST /api/v1/businesses/register
 *
 * Headers:
 * - Content-Type: application/json
 * - Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
 *
 * Expected Request Body: flat JSON, camelCase, with shop & owner sections
 */
export async function submitBusinessRegistration(
  accessToken: string,
  payload: RegisterBusinessPayload
): Promise<RegisterResult> {
  const requestBody: RegisterBusinessPayload = {
    shopName: payload.shopName.trim(),
    gstNumber: payload.gstNumber.trim().toUpperCase(),
    mobNumber: payload.mobNumber.trim(),
    email: payload.email.trim().toLowerCase(),
    address: payload.address.trim(),
    pincode: payload.pincode.trim(),
    state: payload.state.trim(),
    city: payload.city.trim(),
    ownerName: payload.ownerName.trim(),
    mobNo: payload.mobNo.trim(),
    ownerState: payload.ownerState.trim(),
    ownerCity: payload.ownerCity.trim(),
    ownerAddress: payload.ownerAddress.trim(),
  };

  try {
    const res = await fetch(`${API_BASE}/api/v1/businesses/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const json = await res.json().catch(() => ({}));

    if (res.status === 201 || (res.status === 200 && json.status === "ok")) {
      return {
        success: true,
        statusCode: 201,
        message:
          json.message ||
          "Business registration submitted successfully and is pending review.",
        data: json.data,
      };
    }

    if (res.status === 409) {
      return {
        success: false,
        statusCode: 409,
        isConflict: true,
        message:
          json.message ||
          "A business registration already exists for this account or GSTIN.",
      };
    }

    if (res.status === 400) {
      return {
        success: false,
        statusCode: 400,
        message:
          json.message ||
          "Validation failed. Please correct the highlighted fields.",
        errors: json.errors || [],
      };
    }

    return {
      success: false,
      statusCode: res.status,
      message: json.message || `Submission failed with HTTP ${res.status}`,
      errors: json.errors || [],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    console.warn("Backend API offline or unreachable:", message);
    return {
      success: false,
      statusCode: 503,
      message: `Backend API unreachable at ${API_BASE}. ${message}`,
      errors: [],
    };
  }
}

/**
 * Resubmits or updates business details when rejected or revisions needed.
 * Corresponds to PUT /api/v1/businesses/resubmit
 *
 * Headers:
 * - Content-Type: application/json
 * - Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
 */
export async function resubmitBusinessRegistration(
  accessToken: string,
  updates: ResubmitBusinessPayload
): Promise<RegisterResult> {
  const requestBody: ResubmitBusinessPayload = {};

  if (updates.shopName !== undefined) requestBody.shopName = updates.shopName.trim();
  if (updates.gstNumber !== undefined) requestBody.gstNumber = updates.gstNumber.trim().toUpperCase();
  if (updates.mobNumber !== undefined) requestBody.mobNumber = updates.mobNumber.trim();
  if (updates.email !== undefined) requestBody.email = updates.email.trim().toLowerCase();
  if (updates.address !== undefined) requestBody.address = updates.address.trim();
  if (updates.pincode !== undefined) requestBody.pincode = updates.pincode.trim();
  if (updates.state !== undefined) requestBody.state = updates.state.trim();
  if (updates.city !== undefined) requestBody.city = updates.city.trim();
  if (updates.ownerName !== undefined) requestBody.ownerName = updates.ownerName.trim();
  if (updates.mobNo !== undefined) requestBody.mobNo = updates.mobNo.trim();
  if (updates.ownerState !== undefined) requestBody.ownerState = updates.ownerState.trim();
  if (updates.ownerCity !== undefined) requestBody.ownerCity = updates.ownerCity.trim();
  if (updates.ownerAddress !== undefined) requestBody.ownerAddress = updates.ownerAddress.trim();

  try {
    const res = await fetch(`${API_BASE}/api/v1/businesses/resubmit`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const json = await res.json().catch(() => ({}));

    if (res.status === 200 || res.ok) {
      return {
        success: true,
        statusCode: 200,
        message:
          json.message ||
          "Business details updated successfully and resubmitted for verification.",
        data: json.data,
      };
    }

    if (res.status === 409) {
      return {
        success: false,
        statusCode: 409,
        isConflict: true,
        message:
          json.message ||
          "GSTIN conflicts with another registered business.",
      };
    }

    if (res.status === 400) {
      return {
        success: false,
        statusCode: 400,
        message:
          json.message ||
          "Validation failed on resubmission. Please review the highlighted fields.",
        errors: json.errors || [],
      };
    }

    return {
      success: false,
      statusCode: res.status,
      message: json.message || `Resubmission failed with HTTP ${res.status}`,
      errors: json.errors || [],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    console.warn("Backend API offline or unreachable:", message);
    return {
      success: false,
      statusCode: 503,
      message: `Backend API unreachable at ${API_BASE}. ${message}`,
      errors: [],
    };
  }
}
