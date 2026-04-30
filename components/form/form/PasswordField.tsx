"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormPasswordInputProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BadgeAlert } from "lucide-react";
import { useState } from "react";
import { FieldError, FieldValues, useFormContext } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export default function PasswordField<TFieldValues extends FieldValues>({
  id,
  label = "Password",
  placeholder = "********",
  name,
  rules = {},
  className = "",
  prefix,
}: FormPasswordInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const fieldError = errors?.[name] as FieldError | undefined;

  return (
    <div className="w-full">
      {label && (
        <Label
          htmlFor={id || name}
          className="text-sm font-dm-sans font-medium mb-1 block"
        >
          {label}
        </Label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <div className={`absolute left-3  pointer-events-none`}>{prefix}</div>
        )}
        <Input
          id={id || name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(name, rules)}
          className={cn(
            `h-11 rounded-lg text-[16px] font-semibold tracking-[0.5px] font-mono focus-visible:ring-2  ${
              fieldError
                ? "focus-visible:ring-red-500 "
                : "focus-visible:ring-primary"
            } transition-all w-full pr-9`,
            prefix ? "pl-9" : "",
            className,
          )}
        />

        {/* Password visibility toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {showPassword ? (
            <IoEyeOutline className="h-5 w-5" />
          ) : (
            <IoEyeOffOutline className="h-5 w-5" />
          )}
        </button>
      </div>

      {fieldError && (
        <div className="flex items-center mt-2 gap-1">
          <BadgeAlert className="text-red-500 h-4 w-4" />
          <p className="text-red-500 text-xs">{fieldError.message}</p>
        </div>
      )}
    </div>
  );
}
