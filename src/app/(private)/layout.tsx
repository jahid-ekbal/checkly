"use client";

import AppSidebar from "@/components/app/AppSidebar";
import PrivateHeader from "@/components/private/Header";
import { SidebarInset, SidebarProvider } from "@/components/shadcnui/sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-dvh">
        <PrivateHeader />
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
