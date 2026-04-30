"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import DashboardThemingChange from "./DashboardThemingChange";
import UserMenu from "./UserMenu";

export default function DashboardHeader() {
  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-[#1D1C1C]  dark:border-b border-gray-500">
      <header className="h-16 flex justify-between items-center px-6 shadow-sm ">
        <SidebarTrigger className="-ml-1 size-10 dark:hover:bg-primary dark:hover:text-white hover:bg-primary hover:text-white  border cursor-pointer" />
        <div className="flex items-center gap-2 md:gap-4">
          <DashboardThemingChange />
          <UserMenu />
        </div>
      </header>
    </div>
  );
}
