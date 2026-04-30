"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { FaFootballBall } from "react-icons/fa";

export default function AppSidebarHeader({ teams }: any) {
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  return (
    <SidebarMenu>
      {/* <Link href={`/`}> */}
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-transparent  active:bg-transparent hover:shadow-none hover:text-black dark:hover:text-white active:text-black"
        >
          <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-sm  ">
            <FaFootballBall className="size-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight ">
            <span className="truncate text-[24px] font-bold font-dm-sans">
              {activeTeam.name}
            </span>
          </div>
          {/* <ChevronsUpDown className="ml-auto" /> */}
        </SidebarMenuButton>
      </SidebarMenuItem>
      {/* </Link> */}
    </SidebarMenu>
  );
}
