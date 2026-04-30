import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
}

export function MultiSelectField({
  control,
  name,
  label,
  placeholder = "Select...",
  options,
  disabled = false,
  required = false,
}: MultiSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Clear search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={
        required
          ? {
              validate: (value) =>
                (Array.isArray(value) && value.length > 0) ||
                `${label} is required`,
            }
          : undefined
      }
      render={({ field, fieldState: { error } }) => {
        const selectedValues = field.value || [];

        // Get selected options details
        const selectedOptions = options.filter((opt) =>
          selectedValues.includes(opt.value),
        );

        const handleToggle = (optionValue: string) => {
          const newValues = selectedValues.includes(optionValue)
            ? selectedValues.filter((val: string) => val !== optionValue)
            : [...selectedValues, optionValue];

          field.onChange(newValues);
        };

        const handleRemove = (optionValue: string) => {
          const newValues = selectedValues.filter(
            (val: string) => val !== optionValue,
          );
          field.onChange(newValues);
        };

        return (
          <div className="space-y-3">
            <label className="text-sm font-medium font-dm-sans">
              {label}{" "}
              {required && (
                <span className="text-red-500 ml-0.5  font-bold">*</span>
              )}
            </label>

            <div className="relative" ref={dropdownRef}>
              {/* Selected items display */}
              <div
                className={`min-h-10.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
              >
                {selectedOptions.length === 0 ? (
                  <span className="text-muted-foreground">{placeholder}</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md"
                      >
                        <span className="text-xs">{option.label}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(option.value);
                          }}
                          className="hover:bg-primary/20 rounded"
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown options */}
              {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md">
                  {/* Search Input */}
                  <div className="p-2 border-b sticky top-0 bg-popover">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-11"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="max-h-60 overflow-auto">
                    {filteredOptions.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        {searchTerm
                          ? "No services found"
                          : "No options available"}
                      </div>
                    ) : (
                      filteredOptions.map((option) => {
                        const isSelected = selectedValues.includes(
                          option.value,
                        );

                        return (
                          <div
                            key={option.value}
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary transition-colors ${
                              isSelected ? "" : ""
                            }`}
                            onClick={() => handleToggle(option.value)}
                          >
                            <Input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-4 w-4 cursor-pointer"
                            />
                            <span className="text-sm">{option.label}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Selected count info */}
                  {selectedValues.length > 0 && (
                    <div className="p-2 border-t bg-muted/50 text-xs text-muted-foreground text-center">
                      {selectedValues.length} service
                      {selectedValues.length !== 1 ? "s" : ""} selected
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
