"use client";

import { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  showLoader?: boolean;
}

export default function AuthGuard({
  children,
  fallback,
  showLoader = true,
}: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading) {
    if (showLoader) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 size={32} className="animate-spin text-neutral-400" />
        </div>
      );
    }
    return null;
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}
