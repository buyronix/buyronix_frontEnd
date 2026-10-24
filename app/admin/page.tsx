import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard — Seller Verification | Buyronix",
  description: "Review, verify, and manage seller registration applications for Buyronix.",
};

// Next.js 16 (Cache Components / PPR): Opt out of instant prerendering
// to allow dynamic request-time rendering with await connection().
export const instant = false;

export default async function AdminPage() {
  // Prerendering stops here: Signals to Next.js 16 that session validation
  // and token expiry checks (Date.now()) only execute at request time.
  await connection();

  const supabase = await createClient();

  // In Server Components, ALWAYS use getUser() instead of getSession().
  // getUser() cryptographically validates the JWT against the Supabase Auth server.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  // Authorization decision: Strictly inspect app_metadata (never user_metadata).
  // Per Supabase security practices, app_metadata is server-controlled.
  const appRole = user.app_metadata?.role;
  const appRoles = user.app_metadata?.roles;
  const isAdmin =
    appRole === "admin" ||
    (Array.isArray(appRole) && appRole.includes("admin")) ||
    (Array.isArray(appRoles) && appRoles.includes("admin"));

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminDashboard />;
}
