"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
  variant?: "filled" | "outline";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  iconPosition?: "left" | "right";
  className?: string;
  link?: string; // Add link prop
  external?: boolean; // Add external link prop
}

const GlobalCustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(
  (
    {
      title,
      icon,
      variant = "filled",
      bgColor = "#000000",
      textColor = "#FFFFFF",
      borderColor = "#000000",
      iconPosition = "right",
      className,
      link,
      external = false,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2 md:px-4 md:py-2 px-3.5 py-1.5 cursor-pointer",
      "font-dm-sans font-semibold md:text-[16px] text-[11px] uppercase",
      "transition-all duration-300 ease-in-out",
      "hover:scale-[1.02] active:scale-[0.98]",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "border-[1px] rounded-[2px]",
      className,
    );

    const variantStyles = {
      filled: "border",
      outline: "border bg-transparent",
    };

    // ✅ Hover logic for filled variant
    const style: React.CSSProperties =
      variant === "filled"
        ? {
            backgroundColor: isHovered ? "#FFFFFF" : bgColor,
            color: isHovered ? borderColor : textColor,
            borderColor: borderColor,
          }
        : {
            backgroundColor: "transparent",
            color: textColor,
            borderColor: borderColor,
          };

    const buttonContent = (
      <>
        {iconPosition === "left" && icon}
        <span>{title}</span>
        {iconPosition === "right" && icon}
      </>
    );

    const sharedProps = {
      className: cn(baseStyles, variantStyles[variant]),
      style,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    };

    // If link is provided, render as Link (internal) or <a> (external)
    if (link) {
      if (external) {
        return (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            {...sharedProps}
          >
            {buttonContent}
          </a>
        );
      }

      return (
        <Link href={link} {...sharedProps}>
          {buttonContent}
        </Link>
      );
    }

    // If no link, render as button
    return (
      <button ref={ref} {...sharedProps} {...props}>
        {buttonContent}
      </button>
    );
  },
);

GlobalCustomButton.displayName = "GlobalCustomButton";

export default GlobalCustomButton;
