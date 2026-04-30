import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IoAlertCircle } from "react-icons/io5";
import type { PhoneInputProps } from "react-phone-input-2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const labelStyles = {
  size: {
    sm: "text-xs mb-1",
    md: "text-sm mb-1.5",
    lg: "text-sm mb-1.5",
    xl: "text-base mb-2",
  },
};

const inputStyles = {
  base: "block peer !w-full focus:outline-none focus-visible:ring-primary focus-visible:ring-2 transition duration-200 disabled:!bg-gray-100 disabled:!text-gray-500 disabled:placeholder:!text-gray-400 disabled:!cursor-not-allowed disabled:!border-gray-200",
  error:
    "!border-red hover:enabled:!border-red focus:enabled:!border-red focus:!ring-red",
  size: {
    sm: "py-1 !text-xs !h-8 !leading-[32px]",
    md: "py-2 !text-sm !h-10 !leading-[40px]",
    lg: "py-2 !text-base !h-12 !leading-[48px]",
    xl: "py-2.5 !text-base !h-14 !leading-[56px]",
  },
  rounded: {
    none: "!rounded-none",
    sm: "!rounded-sm",
    md: "!rounded-md",
    lg: "!rounded-lg",
    pill: "!rounded-full",
  },
  variant: {
    flat: "!border-0 focus:ring-2 placeholder:!opacity-90 read-only:focus:!ring-0 !bg-primary-lighter/70 hover:enabled:!bg-primary-lighter/90 focus:!ring-primary/30 !text-primary-dark",
    outline:
      "!bg-transparent focus:ring-[0.6px] !border !border-muted read-only:!border-muted read-only:focus:!ring-0 placeholder:!text-gray-500 hover:!border-primary focus:!border-primary focus:!ring-primary",
    text: "!border-0 focus:ring-2 !bg-transparent hover:!text-primary-dark focus:!ring-primary/30 !text-primary",
  },
};

const buttonStyles = {
  base: "!border-0 !bg-transparent !static [&>.selected-flag]:!absolute [&>.selected-flag]:!top-[1px] [&>.selected-flag]:!bottom-[1px] [&>.selected-flag]:!left-[1px] [&>.selected-flag.open]:!bg-transparent [&>.selected-flag:hover]:!bg-transparent [&>.selected-flag:focus]:!bg-transparent",
  size: {
    sm: "[&>.selected-flag]:!h-[30px]",
    md: "[&>.selected-flag]:!h-[38px]",
    lg: "[&>.selected-flag]:!h-[46px]",
    xl: "[&>.selected-flag]:!h-[54px]",
  },
};

const dropdownStyles = {
  base: "!shadow-xl  !text-sm !max-h-[216px] !w-full !my-1.5 !bg-gray-50 dark:!bg-gray-900 [&>.no-entries-message]:!text-center [&>.divider]:!border-muted",
  rounded: {
    none: "!rounded-sm",
    sm: "!rounded",
    md: "!rounded-md",
    lg: "!rounded-lg",
    pill: "!rounded-xl",
  },
  searchBox:
    "!pr-2.5 !bg-gray-50 dark:!bg-gray-900  [&>.search-box]:!w-full [&>.search-box]:!m-0 [&>.search-box]:!px-3 [&>.search-box]:!py-1 [&>.search-box]:!text-sm [&>.search-box]:!capitalize [&>.search-box]:!h-10 [&>.search-box]:!leading-[36px] [&>.search-box]:!rounded-[4px] [&>.search-box]:!bg-transparent [&>.search-box]:!border-gray-400 [&>.search-box:focus]:!border-primary [&>.search-box:focus]:!ring-0 [&>.search-box]:placeholder:!text-gray-500",
  highlightListColor:
    "[&>li.country.highlight]:!bg-primary [&>li.country:hover]:!bg-primary [&>li.country:hover]:!text-white [&>li.country.highlight]:!text-white",
};

const clearIconStyles = {
  base: "absolute right-2 group-hover/phone-number:visible group-hover/phone-number:translate-x-0 group-hover/phone-number:opacity-100",
  position: {
    sm: "top-[9px]",
    md: "top-3",
    lg: "top-4",
    xl: "top-5",
  },
};

export interface PhoneNumberProps
  extends Omit<
    PhoneInputProps,
    | "inputClass"
    | "buttonClass"
    | "containerClass"
    | "dropdownClass"
    | "searchClass"
    | "enableSearch"
    | "disableSearchIcon"
  > {
  label?: React.ReactNode;
  error?: string;
  size?: keyof typeof inputStyles.size;
  rounded?: keyof typeof inputStyles.rounded;
  variant?: keyof typeof inputStyles.variant;
  color?: keyof typeof inputStyles.variant;
  clearable?: boolean;
  enableSearch?: boolean;
  onClear?: (event: React.MouseEvent) => void;
  labelClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  searchClassName?: string;
  helperClassName?: string;
  errorClassName?: string;
  helperText?: React.ReactNode;
  className?: string;
  touched?: boolean;
  name: string;
  value?: string;
  onPhoneChange?: (value: string, data: any) => void; // Add this
}

const PhoneNumber = ({
  size = "md",
  rounded = "md",
  variant = "outline",
  label,
  helperText,
  clearable,
  onClear,
  enableSearch,
  labelClassName,
  inputClassName,
  buttonClassName,
  dropdownClassName,
  searchClassName,
  helperClassName,
  errorClassName,
  className,
  name,
  value,
  onPhoneChange,
  ...props
}: PhoneNumberProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const errorMsg = errors?.[name]?.message as string | undefined;

  return (
    <div className={cn("", className)}>
      {label && (
        <label
          className={cn(
            "block font-medium",
            labelStyles.size[size],
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <div className="group/phone-number relative flex items-center">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <PhoneInput
              {...field}
              value={field.value || ""}
              onChange={(value, data) => {
                setValue(name, value, { shouldValidate: true });
                // Call the custom callback if provided
                if (onPhoneChange) {
                  onPhoneChange(value, data);
                }
              }}
              inputClass={cn(
                inputStyles.base,
                inputStyles.size[size],
                inputStyles.rounded[rounded],
                inputStyles.variant[variant],
                errorMsg && inputStyles.error,
                inputClassName
              )}
              buttonClass={cn(
                buttonStyles.base,
                buttonStyles.size[size],
                buttonClassName
              )}
              dropdownClass={cn(
                dropdownStyles.base,
                dropdownStyles.rounded[rounded],
                dropdownStyles.highlightListColor,
                dropdownClassName
              )}
              searchClass={dropdownStyles.searchBox}
              enableSearch={enableSearch}
              disableSearchIcon
              {...props}
            />
          )}
        />

        {clearable && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setValue(name, "", { shouldValidate: true });
              if (onPhoneChange) {
                onPhoneChange("", { dialCode: "" });
              }
              if (onClear) {
                onClear(e);
              }
            }}
            className={cn(
              "absolute right-2 opacity-0 group-hover/phone-number:opacity-100 cursor-pointer"
              //   clearIconStyles.position[size]
            )}
          >
            ✕
          </button>
        )}
      </div>

      {errorMsg && (
        <Button className={helperClassName}>
          <span className="flex items-center gap-x-1 text-red-500">
            <IoAlertCircle className="text-lg" />
            <span>{errorMsg}</span>
          </span>
        </Button>
      )}

      {helperText && !errorMsg && (
        <p className={helperClassName}>{helperText}</p>
      )}
    </div>
  );
};

PhoneNumber.displayName = "PhoneNumber";

export default PhoneNumber;
