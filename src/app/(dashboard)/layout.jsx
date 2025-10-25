"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { DashboardNav } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
export default function Layout({ children }) {
  return (
    <div>
      <AnonAadhaarProvider _useTestAadhaar={false}>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex flex-col min-h-screen w-screen bg-muted">
          <DashboardNav />
          {children}
        </main>
      </SidebarProvider>
      </AnonAadhaarProvider>
    </div>
  );
}