export interface DecodedJwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  app_metadata?: {
    provider?: string;
    providers?: string[];
    role?: string | string[];
    roles?: string[];
    [key: string]: unknown;
  };
  user_metadata?: {
    [key: string]: unknown;
  };
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Decodes a JWT token without requiring external libraries.
 * Works seamlessly in both Node.js (Server Components / SSR) and Browser environments.
 */
export function decodeJwt(token?: string | null): DecodedJwtPayload | null {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    let jsonString: string;
    if (typeof window === "undefined") {
      jsonString = Buffer.from(base64, "base64").toString("utf-8");
    } else {
      jsonString = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    }

    return JSON.parse(jsonString) as DecodedJwtPayload;
  } catch (err) {
    console.warn("Failed to decode JWT token:", err);
    return null;
  }
}

/**
 * Determines whether the JWT token grants admin privileges.
 * Directly reads claims from the JWT payload itself:
 * - app_metadata.role === 'admin'
 * - app_metadata.roles includes 'admin'
 * - role === 'admin'
 */
export function isJwtAdmin(token?: string | null): boolean {
  const payload = decodeJwt(token);
  if (!payload) return false;

  const appRole = payload.app_metadata?.role;
  const appRoles = payload.app_metadata?.roles;

  if (appRole === "admin") return true;
  if (Array.isArray(appRole) && appRole.includes("admin")) return true;
  if (Array.isArray(appRoles) && appRoles.includes("admin")) return true;
  if (payload.role === "admin") return true;

  return false;
}

