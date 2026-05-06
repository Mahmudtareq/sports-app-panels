import { routes } from "@/config/routes";
import { LayoutDashboard, Settings2, User } from "lucide-react";
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
      title: "Subscription",
      url: routes.privateRoutes.admin.subscription,
      icon: User,
    },
    {
      title: "Settings",
      url: routes.privateRoutes.admin.settings,
      icon: Settings2,
    },
  ],
};
