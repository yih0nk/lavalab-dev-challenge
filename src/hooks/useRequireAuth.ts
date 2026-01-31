"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { useAuthModal } from "./useAuthModal";

interface UseRequireAuthOptions {
    redirectTo?: string;
    showModal?: boolean;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
    const { redirectTo, showModal = true } = options;
    const { user, isLoading, isAuthenticated } = useAuth();
    const { showLogin } = useAuthModal();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            if (redirectTo) {
                router.push(redirectTo);
            } else if (showModal) {
                showLogin();
            }
        }
    }, [isLoading, isAuthenticated, redirectTo, showModal, router, showLogin]);

    return {
        user,
        isLoading,
        isAuthenticated,
    };
}
