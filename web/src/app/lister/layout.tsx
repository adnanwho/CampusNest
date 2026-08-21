"use client";

import PortalNav from "@/components/shared/PortalNav";
import RouteGuard from "@/components/shared/RouteGuard";
import { getStoredUser } from "@/lib/api";

export default function ListerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getStoredUser();
  return (
    <RouteGuard allowedRoles={["LISTER"]}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PortalNav role="LISTER" userName={user?.name} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}