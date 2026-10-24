import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isJwtAdmin } from "@/lib/jwt";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Determine base URL respecting reverse proxy headers (e.g. Vercel, Docker, Nginx)
  const isLocalEnv = process.env.NODE_ENV === "development";
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const baseUrl = !isLocalEnv && forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  // Validate next path to avoid open redirect vulnerabilities
  let next = searchParams.get("next") ?? "/register";
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/register";
  }

  // 1. Check if OAuth provider returned an error
  if (error) {
    console.error("OAuth callback error received:", error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}/register?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // 2. Exchange authorization code for PKCE session
  if (code) {
    try {
      const supabase = await createClient();
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError && data?.session) {
        // Read role claims strictly from app_metadata or JWT (never user_metadata)
        const token = data.session.access_token;
        const appRole = data.user?.app_metadata?.role;
        const appRoles = data.user?.app_metadata?.roles;

        const isAdmin =
          isJwtAdmin(token) ||
          appRole === "admin" ||
          (Array.isArray(appRole) && appRole.includes("admin")) ||
          (Array.isArray(appRoles) && appRoles.includes("admin"));

        // If the user is an admin and landed on default register redirect, route them to admin console
        if (isAdmin && (next === "/register" || !searchParams.has("next"))) {
          next = "/admin";
        }

        return NextResponse.redirect(`${baseUrl}${next}`);
      } else if (exchangeError) {
        console.error("Failed to exchange code for session:", exchangeError.message);
        return NextResponse.redirect(
          `${baseUrl}/register?error=${encodeURIComponent(exchangeError.message)}`
        );
      }
    } catch (err: unknown) {
      console.error("Unexpected error in auth callback:", err);
      const message = err instanceof Error ? err.message : "auth_exchange_failed";
      return NextResponse.redirect(
        `${baseUrl}/register?error=${encodeURIComponent(message)}`
      );
    }
  }

  // Fallback redirect if no code or error present
  return NextResponse.redirect(`${baseUrl}${next}`);
}
