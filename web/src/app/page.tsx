"use client";

import { useState } from "react";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import { UserRole } from "@/lib/types";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (selectedRole) {
    return <RoleRedirect role={selectedRole} />;
  }

  return <RoleSwitcher onSelectRole={setSelectedRole} />;
}

function RoleRedirect({ role }: { role: UserRole }) {
  const href = `/${role}`;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Loading {role} portal...</p>
        <a href={href} className="block mt-4 text-indigo-600 hover:underline">
          Click here if not redirected
        </a>
      </div>
    </div>
  );
}
