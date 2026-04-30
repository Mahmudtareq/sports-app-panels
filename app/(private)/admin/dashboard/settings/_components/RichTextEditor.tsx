"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import "suneditor/dist/css/suneditor.min.css";

// @ts-ignore
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface IProps {
  label?: string;
  name: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function RichTextEditor({
  label,
  name,
  description,
  required,
  disabled,
  placeholder,
}: IProps) {
  const form = useFormContext();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-2">
          {label && (
            <FieldLabel
              className="font-bold text-sm font-dm-sans mb-1.5"
              htmlFor={field.name}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          <div className="suneditor-wrapper">
            <SunEditor
              setContents={field.value}
              onChange={field.onChange}
              disable={disabled}
              setOptions={{
                buttonList: [
                  ["undo", "redo"],
                  // ["font", "fontSize", "formatBlock"],
                  ["formatBlock"],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                  ],
                  // ["fontColor", "hiliteColor"],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  // ["table", "link", "image"],
                  ["table", "link"],
                  // ["fullScreen", "showBlocks", "codeView"],
                  ["fullScreen"],
                ],
                defaultTag: "p",
                minHeight: "300px",
                showPathLabel: false,
                placeholder: placeholder || "Enter content here...",
              }}
            />
          </div>

          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && (
            <FieldError className="text-left" errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}
