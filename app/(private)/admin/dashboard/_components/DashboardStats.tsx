import { Briefcase, Image, MessageSquare, Users } from "lucide-react";
import StatCard from "./StatCard";

interface StatsData {
  story: { total: number; active: number; inactive: number; featured: number };
  category: {
    total: number;
    active: number;
    inactive: number;
    featured?: number;
  };
  testimonial: {
    total: number;
    active: number;
    inactive: number;
    featured?: number;
  };
  gallery: {
    total: number;
    active: number;
    inactive: number;
    featured: number;
  };
}

const DashboardStats = ({ statsData }: { statsData: StatsData }) => {
  const statCards = [
    {
      title: "Story",
      icon: Users,
      data: statsData?.story || "",
      gradient: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Category",
      icon: Briefcase,
      data: statsData?.category || "",
      gradient: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
      bgDark: "dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Testimonials",
      icon: MessageSquare,
      data: statsData?.testimonial || "",
      gradient: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50",
      bgDark: "dark:bg-emerald-950/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Gallery",
      icon: Image,
      data: statsData?.gallery || "",
      gradient: "from-orange-500 to-red-500",
      bgLight: "bg-orange-50",
      bgDark: "dark:bg-orange-950/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];
  return (
    <div className="w-full p-4  min-h-screen">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              icon={card.icon}
              total={card.data.total}
              active={card.data.active}
              inactive={card.data.inactive}
              featured={card.data?.featured}
              gradient={card.gradient}
              bgLight={card.bgLight}
              bgDark={card.bgDark}
              iconColor={card.iconColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
