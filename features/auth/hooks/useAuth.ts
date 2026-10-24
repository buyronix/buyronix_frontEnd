"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const router = useRouter();

  const supabase = React.useMemo(() => {
    try {
      return createClient();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Supabase initialization failed";
      console.error("Failed to initialize Supabase client in useAuth:", msg);
      return null;
    }
  }, []);

  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(() => Boolean(supabase));
  const [authError, setAuthError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    // Fetch initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn("Error fetching initial Supabase session:", error.message);
          setAuthError(error.message);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.error("Unexpected error fetching session:", err);
        setIsLoading(false);
      });

    // Listen to real-time auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      // Invalidate Next.js Server Component router caches on auth state transition
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signInWithGoogle = React.useCallback(
    async (customRedirectTo?: string, prompt: "select_account" | "consent" = "select_account") => {
      if (!supabase) {
        return { error: new Error("Supabase client is not configured") };
      }

      setAuthError(null);
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const defaultRedirect = `${origin}/auth/callback?next=/register`;
      const redirectTo = customRedirectTo || defaultRedirect;

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            queryParams: {
              access_type: "offline",
              prompt,
            },
          },
        });

        if (error) {
          setAuthError(error.message);
          return { error };
        }

        return { error: null };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Google sign-in failed unexpectedly";
        setAuthError(message);
        return { error: new Error(message) };
      }
    },
    [supabase]
  );

  const signOut = React.useCallback(async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.refresh();
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  }, [supabase, router]);

  return {
    user,
    session,
    accessToken: session?.access_token ?? null,
    isLoading,
    authError,
    signInWithGoogle,
    signOut,
  };
}
