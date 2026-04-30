"use client";

import { deleteTestimonial } from "@/actions/testimonial/testimonialActions";
import { ToastMessage } from "@/components/custom/ToastMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTableState } from "@/store/useTableStore";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DeleteModalProps } from "./types";

export default function TestimonialDeleteModal({
  trigger,
  testimonialId,
  title = "Are you absolutely sure?",
  description,
  itemName,
}: DeleteModalProps) {
  const tableId = "services";
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { handleRefresh } = useTableState(tableId);

  const defaultDescription = itemName
    ? `This will permanently delete the testimonial List. Any content associated with this testimonial will also be permanently removed. This action cannot be undone.`
    : "This will permanently delete this testimonial and any associated content. This action cannot be undone.";

  const handleDelete = async () => {
    setIsDeleting(true);

    const loadingToast = ToastMessage.loading({
      title: "Deleting testimonial...",
    });
    try {
      const response = await deleteTestimonial(testimonialId);
      // Check if response indicates success
      if (!response?.status) {
        ToastMessage.error(
          {
            title: response?.message || "Failed to delete testimonial",
          },
          { id: loadingToast },
        );
        setIsDeleting(false);
        return;
      }

      ToastMessage.success(
        {
          title: response?.message || "Testimonial deleted successfully!",
        },
        { id: loadingToast },
      );

      // Close modal on success
      setIsDeleting(false);
      setOpen(false);
      handleRefresh();
    } catch (error: any) {
      ToastMessage.error(
        {
          title: error.message || "Failed to delete Testimonial",
        },
        { id: loadingToast },
      );
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="rounded-sm font-dm-sans font-medium"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 rounded-sm text-white font-dm-sans font-medium"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
