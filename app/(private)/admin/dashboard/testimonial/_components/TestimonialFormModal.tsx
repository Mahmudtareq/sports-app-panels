"use client";

import {
  createNewTestimonial,
  updateTestimonial,
} from "@/actions/testimonial/testimonialActions";
import { ToastMessage } from "@/components/custom/ToastMessage";
import FileUploadComponent from "@/components/form/FileUploadComponent";
import { FormTextarea } from "@/components/form/FormTextarea";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTableState } from "@/store/useTableStore";
import { Plus, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormDataTypes, FormModalProps } from "./types";

export default function TestimonialFormModal({
  testimonial,
  isEditMode = false,
}: FormModalProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState<string>("");
  const [isExistingImageRemoved, setIsExistingImageRemoved] = useState(false);
  const methods = useForm<FormDataTypes>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      authorName: "",
      authorRole: "",
      quote: "",
      status: true,
    },
  });

  const tableId = "testimonial";
  const { handleRefresh } = useTableState(tableId);

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  // Reset form when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      if (isEditMode && testimonial) {
        reset({
          authorName: testimonial.authorName || "",
          authorRole: testimonial.authorRole || "",
          quote: testimonial.quote || "",
        });
      } else {
        reset({
          authorName: "",
          authorRole: "",
          quote: "",
        });
      }
      setImageFiles([]);
      setImageError("");
      setIsExistingImageRemoved(false);
    }
  }, [isDialogOpen, testimonial, isEditMode, reset]);

  const onSubmit = async (data: FormDataTypes) => {
    const hasExistingImage = testimonial?.image && !isExistingImageRemoved;
    const hasNewImage = imageFiles.length > 0;
    if (!hasExistingImage && !hasNewImage) {
      setImageError("Image is required");
      return;
    }
    // Validate image only for add mode
    if (!isEditMode && imageFiles.length === 0) {
      ToastMessage.error({ title: "Please upload an image!" });
      return;
    }
    const loadingToast = ToastMessage.loading({
      title: isEditMode
        ? "Updating testimonial..."
        : "Adding new testimonial...",
    });

    try {
      const formData = new FormData();
      formData.append("authorName", data.authorName);
      formData.append("authorRole", data.authorRole);
      formData.append("quote", data.quote);

      // Add image if selected
      if (imageFiles.length > 0) {
        formData.append("image", imageFiles[0]);
      }

      const result = isEditMode
        ? await updateTestimonial(testimonial?._id || "", formData)
        : await createNewTestimonial(formData);

      if (!result.status) {
        ToastMessage.error(
          {
            title: result.message || "Failed to save testimonial services",
          },
          { id: loadingToast },
        );
        return;
      }

      ToastMessage.success(
        {
          title:
            result?.message ||
            (isEditMode
              ? "Testimonial updated successfully!"
              : "Testimonial added successfully!"),
        },
        { id: loadingToast },
      );
      handleRefresh();
      setIsDialogOpen(false);
      reset();
      setImageFiles([]);
    } catch (error: any) {
      ToastMessage.error(
        {
          title: "Your session has expired!",
        },
        { id: loadingToast },
      );
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button
            variant={`outline`}
            className="flex items-center dark:hover:bg-primary dark:hover:text-white"
          >
            <SquarePen className="h-4 w-4 dark:hover:text-white" />
          </Button>
        ) : (
          <Button
            size="sm"
            className=" text-white font-medium rounded-sm font-dm-sans h-9 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-white" />
            Add New Testimonial
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the testimonial details below."
              : "Fill in the details to create a new testimonial."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <InputField
              name="authorName"
              label="Author Name"
              placeholder="Isabelle Moreau"
              required
              min={3}
              max={25}
            />
            <InputField
              name="authorRole"
              label="AuthorRole"
              placeholder="Creative Director"
              required
              min={3}
              max={20}
            />
            {/* Short Description */}
            <FormTextarea
              name="quote"
              control={control}
              label="Message"
              placeholder="I have an amazing photography session with team Momento"
              required
              min={15}
              max={600}
            />

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-dm-sans font-medium mb-2">
                Photography Image{" "}
                <span className="text-red-500  font-bold ml-0.5">*</span>
              </label>
              <FileUploadComponent
                accept="image"
                maxSize={10}
                maxFiles={1}
                onFilesChange={(files) => {
                  setImageFiles(files);
                  if (files.length > 0) setImageError("");
                }}
                existingImageUrl={
                  isEditMode && testimonial?.image
                    ? testimonial.image
                    : undefined
                }
                onRemoveExisting={() => {
                  setIsExistingImageRemoved(true);
                  setImageError("Image is required");
                }}
                error={imageError}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="rounded-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-sm text-white cursor-pointer font-dm-sans font-medium"
              >
                {isSubmitting ? (
                  <>{isEditMode ? "Updating..." : "Adding..."}</>
                ) : isEditMode ? (
                  "Update Testimonial"
                ) : (
                  "Add Testimonial"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
