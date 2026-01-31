"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuthModal() {
    const {
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
    } = useAuthStore();

    const showLogin = useCallback(() => {
        openAuthModal("login");
    }, [openAuthModal]);

    const showSignup = useCallback(() => {
        openAuthModal("signup");
    }, [openAuthModal]);

    const switchToLogin = useCallback(() => {
        setAuthModalView("login");
    }, [setAuthModalView]);

    const switchToSignup = useCallback(() => {
        setAuthModalView("signup");
    }, [setAuthModalView]);

    return {
        isOpen: isAuthModalOpen,
        view: authModalView,
        open: openAuthModal,
        close: closeAuthModal,
        showLogin,
        showSignup,
        switchToLogin,
        switchToSignup,
    };
}
