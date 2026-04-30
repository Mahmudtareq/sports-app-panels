import { routes } from "@/config/routes";
import { Frame, LayoutDashboard, PieChart, Settings2 } from "lucide-react";
import { FaFootball } from "react-icons/fa6";

export const adminDashboardMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Xoom Sports",
      logo: FaFootball,
      // plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: routes.privateRoutes.admin.dashboard,
      icon: LayoutDashboard,
    },

    {
      title: "Settings",
      url: routes.privateRoutes.admin.settings,
      icon: Settings2,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export const navItems = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "ABOUT",
    href: "/about",
  },
  {
    label: "GALLERY",
    href: "/gallery",
  },
  {
    label: "STORIES",
    href: "/stories",
  },
  {
    label: "Contact",
    href: "/lets-connect",
  },
];
