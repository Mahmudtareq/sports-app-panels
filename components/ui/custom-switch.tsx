"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Circle, MoonIcon, SunMediumIcon } from "lucide-react";

interface CustomSwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  thumbClassName?: string;
}

const CustomSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  CustomSwitchProps
>(({ className, checked, onCheckedChange, thumbClassName, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "peer inline-flex h-[21px] w-[41px] shrink-0 cursor-pointer items-center rounded-full border border-[#1F1F1F] dark:border-[#F9FAFB] shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-gray-900" : "bg-white",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none flex h-5 w-5 rounded-full  shadow-lg ring-0 transition-transform items-center justify-center data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          thumbClassName
        )}
      >
        {checked ? (
          <Circle className="h-5 w-5 text-gray-900 bg-[#F9FAFB] rounded-full border-transparent" />
        ) : (
          // <SunMediumIcon className="h-4 w-4 text-yellow-500" />
          <Circle className="h-5 w-5 text-gray-900 bg-black rounded-full border-transparent" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
});

CustomSwitch.displayName = "CustomSwitch";

export default CustomSwitch;
