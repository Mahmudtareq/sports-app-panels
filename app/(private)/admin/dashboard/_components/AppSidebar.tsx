"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { adminDashboardMenu } from "@/public/sample-data/navitems-data";
import AppSidebarHeader from "./AppSidebarHeader";
import NavMenuItems from "./NavMenuItems";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader teams={adminDashboardMenu.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMenuItems items={adminDashboardMenu.navMain} />
        {/* <NavProjects projects={adminDashboardMenu.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <AppSidebarFooter user={adminDashboardMenu.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
