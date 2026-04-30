"use client";

import { updateAdminProfile } from "@/actions/adminProfile/adminProfileActions";
import { ToastMessage } from "@/components/custom/ToastMessage";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useAdminProfile from "@/store/useAdminProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ImSpinner9 } from "react-icons/im";
import z from "zod";

const adminFrontendProfileSchema = z.object({
  name: z.string("name must be string!").min(1, "Required!").trim(),
  email: z.string().nullable(),
});

type AdminProfilesFormValues = z.infer<typeof adminFrontendProfileSchema>;

interface ProfileChangeModalProps {
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
}

export default function EditProfileModal({
  editModalOpen,
  setEditModalOpen,
}: ProfileChangeModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { adminData, fetchAdminData } = useAdminProfile();

  const token = session?.token;

  const form = useForm<AdminProfilesFormValues>({
    resolver: zodResolver(adminFrontendProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Reset form and loading state when modal opens
  useEffect(() => {
    if (editModalOpen && adminData) {
      form.reset({
        name: adminData?.name || "",
        email: adminData?.email || "",
      });
      setLoading(false);
    }
  }, [editModalOpen, adminData, form]);

  const onSubmit = async (data: AdminProfilesFormValues) => {
    setLoading(true);

    const payload = {
      name: data.name,
    };
    const loadingToast = ToastMessage.loading({
      title: "Profile Updating......",
    });

    try {
      const response = await updateAdminProfile(payload);

      if (!response.status) {
        throw new Error(response?.message || "Failed to update profile");
      }

      ToastMessage.success(
        {
          title: response?.message || "Profile Update successfully!",
        },
        { id: loadingToast },
      );
      form.reset();

      await fetchAdminData(token as string);

      setEditModalOpen(false);
      setLoading(false);
      form.reset();
    } catch (error: any) {
      ToastMessage.error(
        {
          title: "Your session has expired!",
        },
        { id: loadingToast },
      );
    }
  };

  const handleCancel = () => {
    form.reset();
    setLoading(false);
    setEditModalOpen(false);
  };

  // Reset loading state when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setLoading(false);
      form.reset();
    }
    setEditModalOpen(open);
  };
  return (
    <Dialog open={editModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Update Admin Profile</DialogTitle>
          <DialogDescription>Change admin name</DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <InputField
                name="name"
                label="Name"
                required
                prefix={<User size={16} />}
                rules={{ required: "Required!" }}
              />
              <InputField
                name="email"
                label="Email"
                prefix={<Mail size={16} />}
                className="cursor-not-allowed"
                rules={{ disabled: true }}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-sm font-dm-sans"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
                className="rounded-sm text-white font-dm-sans"
              >
                {loading ? (
                  <span className="flex items-center ">
                    Profile Updating
                    <ImSpinner9 className="ml-2 transition-all animate-spin duration-300" />
                  </span>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
