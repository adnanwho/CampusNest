"use client";

import PortalNav from "@/components/shared/PortalNav";
import RouteGuard from "@/components/shared/RouteGuard";
import { getStoredUser } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getStoredUser();
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col selection:bg-[#39B86B]/20 selection:text-[#17202A]">
        <PortalNav role="ADMIN" userName={user?.name} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}