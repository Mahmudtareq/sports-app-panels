"use client";

import { updateCloudinary } from "@/actions/settings/settingsActions";
import { ToastMessage } from "@/components/custom/ToastMessage";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CloudinaryData {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
  secureUrlBase: string;
}
export default function CloudinarySettings({ cloudinary }: any) {
  const methods = useForm<CloudinaryData>({
    defaultValues: {
      cloudName: "",
      apiKey: "",
      apiSecret: "",
      folder: "",
      secureUrlBase: "",
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (cloudinary) {
      reset({
        cloudName: cloudinary.cloudName || "",
        apiKey: cloudinary.apiKey || "",
        apiSecret: cloudinary.apiSecret || "",
        folder: cloudinary.folder || "",
        secureUrlBase: cloudinary.secureUrlBase || "",
      });
    } else {
      reset({
        cloudName: "",
        apiKey: "",
        apiSecret: "",
        folder: "",
        secureUrlBase: "",
      });
    }
  }, [cloudinary, reset]);

  const onSubmit = async (data: CloudinaryData) => {
    const loadingToast = ToastMessage.loading({
      title: "Updating cloudinary setting...",
    });
    try {
      const payload = {
        ...data,
      };

      const result = await updateCloudinary(payload);
      if (!result.status) {
        ToastMessage.error(
          {
            title: result.message || "Failed to save cloudinary setting",
          },
          { id: loadingToast },
        );
        return;
      }

      ToastMessage.success(
        { title: result?.message || "cloudinary Setting successfully!" },
        {
          id: loadingToast,
        },
      );

      reset();
    } catch (error: any) {
      ToastMessage.error(
        { title: "Your session has expired!" },
        { id: loadingToast },
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700  ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <SiCloudinary className="h-5 w-5 text-primary" /> */}
              Cloudinary Information
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Configure your website's Cloudinary Information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  name="cloudName"
                  label="Cloud Name"
                  placeholder="dhfjuyr1425"
                  rules={{ required: "Required!" }}
                />
                <InputField
                  name="apiKey"
                  label="Api Key"
                  placeholder="124578544444d"
                  rules={{ required: "Required!" }}
                />
                <InputField
                  name="folder"
                  label="Folder Name"
                  placeholder="cafe-store"
                  rules={{ required: "Required!" }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="apiSecret"
                  label="Api Secret"
                  placeholder="xDKs00e1qaK"
                  rules={{ required: "Required!" }}
                />

                <InputField
                  name="secureUrlBase"
                  label="SecureUrl Base"
                  placeholder="https://res.cloudinary.com/dkvuz6kbm/i"
                  rules={{ required: "Required!" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 cursor-pointer text-white rounded-sm"
          >
            <Save className="h-4 w-4" />
            {isSubmitting
              ? "Updating Cloudinary..."
              : "Update Cloudinary Settings"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
