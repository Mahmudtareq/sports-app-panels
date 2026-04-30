import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardProvider from "@/providers/DashboardProvider";
import AppSidebar from "./admin/dashboard/_components/AppSidebar";
import DashboardHeader from "./admin/dashboard/_components/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DashboardProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="overflow-auto h-screen">
            <DashboardHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white dark:bg-[#1c1c1c]">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </DashboardProvider>
    </ThemeProvider>
  );
}
