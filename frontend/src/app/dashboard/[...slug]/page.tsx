"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardCatchAllRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const newPath = pathname.replace("/dashboard", "/admin-dashboard");
    router.replace(newPath);
  }, [pathname, router]);
  
  return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
}
