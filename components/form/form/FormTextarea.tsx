"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BadgeAlert } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  requiredMessage?: string;
  min?: number; //  minLength
  max?: number; //  maxLength
  minLength?: number; //  explicit minLength
  maxLength?: number; //  explicit maxLength
  rows?: number;
  className?: string;
  textareaClassName?: string;
  disabled?: boolean;
}

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "",
  defaultValue = "",
  required = false,
  requiredMessage = "This field is required!",
  min,
  max,
  minLength,
  maxLength,
  rows = 4,
  className = "",
  textareaClassName = "",
  disabled = false,
}: FormTextareaProps<T>) {
  const rules = {
    ...(required && { required: requiredMessage }),
    ...(min !== undefined && {
      minLength: { value: min, message: `Minimum ${min} characters required` },
    }),
    ...(max !== undefined && {
      maxLength: { value: max, message: `Maximum ${max} characters allowed` },
    }),
    ...(minLength !== undefined && {
      minLength: {
        value: minLength,
        message: `Minimum ${minLength} characters required`,
      },
    }),
    ...(maxLength !== undefined && {
      maxLength: {
        value: maxLength,
        message: `Maximum ${maxLength} characters allowed`,
      },
    }),
  };
  return (
    <div className={className}>
      <Label className="text-sm font-dm-sans font-medium mb-1 block">
        {label}
        {/*Show * if required */}
        {required && (
          <span className="text-red-500 font-dm-sans font-bold ml-0.5">*</span>
        )}
      </Label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue as any}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Textarea
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              onChange={(e) => {
                field.onChange(e);
              }}
              className={`h-24 rounded-lg text-[16px] font-semibold tracking-[0.5px] font-dm-sans border-gray-200 focus-visible:ring-0 ${
                error
                  ? "focus-visible:ring-red-500 border-red-500"
                  : "focus-visible:ring-primary"
              } ${textareaClassName}`}
              style={{ height: `${rows * 1.5}rem` }}
            />
            {error && (
              <div className="flex items-center mt-2 gap-1">
                <BadgeAlert className="text-red-500 h-4 w-4" />
                <p className="text-red-500 text-xs font-dm-sans font-medium">
                  {error.message}
                </p>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}
