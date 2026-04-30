import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  label: string;
  description: string;
}

export default function FormSwitch({ name, label, description }: IProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between border p-4 rounded-lg">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="cursor-pointer"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
