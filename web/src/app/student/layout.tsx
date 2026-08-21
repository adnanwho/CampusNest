import PortalNav from "@/components/shared/PortalNav";
import { goldenProfiles } from "@/lib/data";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = goldenProfiles[0];
  return (
    <div className="min-h-screen bg-slate-50">
      <PortalNav role="STUDENT" userName={profile.name} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
