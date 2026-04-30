import { ButtonProps } from "@/lib/types";
import { cn } from "@/lib/utils";

const CustomButton = ({
  children,
  type = "button",
  disabled = false,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "px-6 sm:px-8 py-3 rounded-[10px] text-[15px] font-dm-sans font-bold cursor-pointer",
        "bg-[#1F1F1F] dark:bg-[#5A3A3A]",
        "text-[#F9FAFB] dark:text-[#E8E8E8]",
        "hover:bg-primary dark:hover:bg-[#B71C1C]",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",
        "transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "whitespace-nowrap",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default CustomButton;

// Usage examples:

// Example 1: Default button (uses all base styles)
// <Button type="submit" disabled={isSubmitting}>
//   {isSubmitting ? "Subscribing..." : "Subscribe"}
// </Button>

// Example 2: Override specific styles
// <Button className="bg-blue-500 hover:bg-blue-600">
//   Custom Color
// </Button>

// Example 3: Add additional styles
// <Button className="w-full mt-4">
//   Full Width Button
// </Button>

// Example 4: Change padding and text
// <Button className="px-4 py-2 text-sm">
//   Small Button
// </Button>

// Example 5: Completely custom button
// <Button className="bg-red-500 text-white rounded-full px-10">
//   Custom Button
// </Button>
