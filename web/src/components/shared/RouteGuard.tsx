"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/api";
import type { UserRole } from "@/lib/types";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      const user = getStoredUser();
      if (!user) {
        if (allowedRoles.includes("STUDENT")) {
          router.replace("/register?role=STUDENT");
        } else if (allowedRoles.includes("LISTER")) {
          router.replace("/register?role=LISTER");
        } else {
          router.replace("/login");
        }
        setAuthorized(false);
        return;
      }

      const hasAllowedRole = allowedRoles.some(
        (r) => r.toUpperCase() === user.role.toUpperCase()
      );

      if (!hasAllowedRole) {
        const userRole = user.role.toLowerCase();
        if (userRole === "student" || userRole === "lister" || userRole === "admin") {
          router.replace(`/${userRole}`);
        } else {
          router.replace("/login");
        }
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    });

    return () => {
      isMounted = false;
    };
  }, [router, allowedRoles]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center">
        <div className="w-9 h-9 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold text-[#596573]">Verifying session...</p>
      </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
}
