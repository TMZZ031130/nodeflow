import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NuqsAdapter>{children}</NuqsAdapter>
      </SidebarInset>
    </SidebarProvider>
  );
}
