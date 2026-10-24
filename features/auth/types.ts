import type { User, Session } from "@supabase/supabase-js";

export interface SellerUserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

