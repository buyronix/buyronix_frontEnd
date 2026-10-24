"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { isJwtAdmin } from "@/lib/jwt";

export function useAdminAuth() {
  const { user, session, accessToken, isLoading, authError, signOut } = useAuth();
  const router = useRouter();

  // Read role info strictly from app_metadata or JWT (never user_metadata)
  const appRole = user?.app_metadata?.role;
  const appRoles = user?.app_metadata?.roles;
  const isAdmin =
    isJwtAdmin(accessToken) ||
    appRole === "admin" ||
    (Array.isArray(appRole) && appRole.includes("admin")) ||
    (Array.isArray(appRoles) && appRoles.includes("admin"));

  // Never allow users without admin access to see the admin page; redirect immediately
  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/");
    }
  }, [isLoading, isAdmin, router]);

  return {
    user,
    session,
    accessToken,
    isLoading,
    authError,
    isAdmin,
    signOut,
  };
}
