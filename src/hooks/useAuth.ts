"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { getClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Module-level flags shared across all hook instances
let isInitialLoad = true;
let hasShownWelcome = false;
let hasShownSignOut = false;

export function useAuth() {
  const {
    user,
    session,
    isLoading,
    setUser,
    setSession,
    setIsLoading,
    reset,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const supabase = getClient();

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
        // Mark initial load as complete after a short delay
        setTimeout(() => {
          isInitialLoad = false;
        }, 1000);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Only show welcome toast for actual sign-ins, not session restoration
        if (event === "SIGNED_IN" && !isInitialLoad && !hasShownWelcome) {
          hasShownWelcome = true;
          hasShownSignOut = false;
          toast.success("Welcome back!");
          // Reset after a delay so it can show again on next sign-in
          setTimeout(() => {
            hasShownWelcome = false;
          }, 5000);
        } else if (event === "SIGNED_OUT" && !hasShownSignOut) {
          hasShownSignOut = true;
          hasShownWelcome = false;
          toast.success("Signed out successfully");
          // Reset after a delay so it can show again on next sign-out
          setTimeout(() => {
            hasShownSignOut = false;
          }, 5000);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsLoading]);

  // Sign in with email and password
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const supabase = getClient();

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        return { data, error: null };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to sign in";
        toast.error(message);
        return { data: null, error };
      }
    },
    []
  );

  // Sign up with email and password
  const signUpWithEmail = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const supabase = getClient();

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user && !data.session) {
          toast.success("Check your email to confirm your account");
        }

        return { data, error: null };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to sign up";
        toast.error(message);
        return { data: null, error };
      }
    },
    []
  );

  // Sign in with Google OAuth
  const signInWithGoogle = useCallback(async () => {
    const supabase = getClient();

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign in with Google";
      toast.error(message);
      return { data: null, error };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    const supabase = getClient();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      reset();
      return { error: null };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign out";
      toast.error(message);
      return { error };
    }
  }, [reset]);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    const supabase = getClient();

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success("Check your email for the password reset link");
      return { data, error: null };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send reset email";
      toast.error(message);
      return { data: null, error };
    }
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
}
