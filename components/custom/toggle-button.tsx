"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import CustomSwitch from "../ui/custom-switch";

const ThemeToggleSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Light label */}
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          isDark ? "text-gray-400" : "text-black"
        )}
      >
        Light
      </span>

      {/* Custom Switch */}
      <CustomSwitch checked={isDark} onCheckedChange={handleToggle} />

      {/* Dark label */}
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          isDark ? "text-white" : "text-gray-500"
        )}
      >
        Dark
      </span>
    </div>
  );
};

export default ThemeToggleSwitch;
