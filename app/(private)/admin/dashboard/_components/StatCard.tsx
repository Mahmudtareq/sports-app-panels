import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  total: number;
  active: number;
  inactive: number;
  featured?: number;
  gradient: string;
  bgLight: string;
  bgDark: string;
  iconColor: string;
}

const StatCard = ({
  title,
  icon: Icon,
  total,
  active,
  inactive,
  gradient,
  bgLight,
  bgDark,
  iconColor,
  featured,
}: StatCardProps) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Gradient Background Decoration */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300`}
      />

      <div className="relative p-6">
        {/* Icon Section */}
        <div
          className={`${bgLight} ${bgDark} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          {title}
        </h3>

        {/* Total Count */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {total}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total
          </span>
        </div>

        {/* Active/Inactive Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Active: <span className="font-semibold">{active}</span>
            </span>
          </div>
          {featured && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Featured: <span className="font-semibold">{featured}</span>
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Inactive: <span className="font-semibold">{inactive}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Border Gradient */}
      <div className={`h-1 bg-linear-to-r ${gradient}`} />
    </div>
  );
};

export default StatCard;
