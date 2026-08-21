"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, logout } from "@/lib/api";
import type { UserRole } from "@/lib/types";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/");
      return;
    }
    if (!allowedRoles.some((r) => r.toUpperCase() === user.role.toUpperCase())) {
      logout();
      router.replace("/");
      return;
    }
    setAuthorized(true);
    setChecking(false);
  }, [router, allowedRoles]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
}
