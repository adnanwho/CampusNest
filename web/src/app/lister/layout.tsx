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
<<<<<<< HEAD
    <RouteGuard allowedRoles={["lister"]}>
      <div className="min-h-screen bg-slate-50">
        <PortalNav role="lister" userName={user?.name} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </RouteGuard>
=======
    <div className="min-h-screen bg-slate-50">
      <PortalNav role="LISTER" userName="Demo Lister" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
>>>>>>> origin/main
  );
}