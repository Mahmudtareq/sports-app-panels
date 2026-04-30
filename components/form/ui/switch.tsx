"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border shadow-xs transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
        // Active state - orange/primary background
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        // Inactive state - gray background
        "data-[state=unchecked]:bg-gray-200 data-[state=unchecked]:border-gray-300",
        "dark:data-[state=unchecked]:bg-gray-700 dark:data-[state=unchecked]:border-gray-600",
        // Focus styles
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          // Checked state - white thumb
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=checked]:bg-white",
          // Unchecked state - white/light thumb
          "data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-white",
          "dark:data-[state=unchecked]:bg-gray-300"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
