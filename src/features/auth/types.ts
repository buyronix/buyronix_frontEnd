export type UserRole = "seller" | "buyer";

export type AuthScreen = "gateway" | "seller-login" | "buyer-login" | "seller-register";

export interface AuthState {
  screen: AuthScreen;
  selectedRole?: UserRole;
  email: string;
  rememberMe: boolean;
  isLoading: boolean;
  errorMessage?: string;
}

