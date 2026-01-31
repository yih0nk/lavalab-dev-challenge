import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalView: "login" | "signup";
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  openAuthModal: (view?: "login" | "signup") => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: "login" | "signup") => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthModalOpen: false,
  authModalView: "login",

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setIsLoading: (isLoading) => set({ isLoading }),

  openAuthModal: (view = "login") =>
    set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthModalView: (view) => set({ authModalView: view }),

  reset: () =>
    set({
      user: null,
      session: null,
      isLoading: false,
      isAuthModalOpen: false,
      authModalView: "login",
    }),
}));
