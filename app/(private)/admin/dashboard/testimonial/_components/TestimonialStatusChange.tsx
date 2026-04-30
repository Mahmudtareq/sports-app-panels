"use client";
import { testimonialChangeStatus } from "@/actions/testimonial/testimonialActions";
import { ToastMessage } from "@/components/custom/ToastMessage";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ToggleSwitchProps } from "./types";

export default function TestimonialStatusChange({
  initialStatus,
  testimonialId,
  onStatusChange,
}: ToggleSwitchProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const handleStatusToggle = async (checked: boolean) => {
    const prevStatus = status;
    setStatus(checked);
    setLoading(true);
    const loading = ToastMessage.loading({ title: "Updating status..." });
    try {
      const response = await testimonialChangeStatus(testimonialId, checked);

      if (!response.status) {
        setStatus(prevStatus);
        throw new Error("Failed to update status");
      }

      const newStatus = response.data?.status ?? checked;
      setStatus(newStatus);
      onStatusChange?.(newStatus);

      ToastMessage.success(
        {
          title:
            response?.message || "Testimonial status updated successfully!",
        },
        { id: loading },
      );
    } catch (error: any) {
      setStatus(prevStatus);
      ToastMessage.error(
        { title: "Your session has expired!" },
        { id: loading },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={status}
        onCheckedChange={handleStatusToggle}
        disabled={loading}
        className="cursor-pointer"
      />
      <span className="text-sm">{status ? "Active" : "Inactive"}</span>
    </div>
  );
}
