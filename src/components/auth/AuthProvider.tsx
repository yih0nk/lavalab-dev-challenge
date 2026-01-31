"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import AuthModal from "./AuthModal";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state
  const { user, isLoading } = useAuth();
  const syncCart = useCartStore((state) => state.syncWithServer);
  const syncWishlist = useWishlistStore((state) => state.syncWithServer);

  // Sync cart and wishlist when user logs in
  useEffect(() => {
    if (user && !isLoading) {
      syncCart(user.id);
      syncWishlist(user.id);
    }
  }, [user, isLoading, syncCart, syncWishlist]);

  return (
    <>
      {children}
      <AuthModal />
    </>
  );
}
