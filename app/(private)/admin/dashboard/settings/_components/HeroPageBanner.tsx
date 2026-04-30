"use client";
import { updatePageBanner } from "@/actions/settings/settingsActions";
import { ToastMessage } from "@/components/custom/ToastMessage";
import FileUploadComponent from "@/components/form/FileUploadComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface BannerFormData {
  outletsFiles: FileList | null;
  menu: FileList | null;
  blogsFiles: FileList | null;
}
export default function HeroPageBanner({ pageBanner }: any) {
  const [menuFiles, setMenuFiles] = useState<File[]>([]);
  const [outletsFiles, setOutletsFiles] = useState<File[]>([]);
  const [blogsFiles, setBlogsFiles] = useState<File[]>([]);
  const methods = useForm<BannerFormData>({
    defaultValues: {},
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (pageBanner) {
      reset({});
    } else {
      reset({});
    }
    setBlogsFiles([]);
    setOutletsFiles([]);
    setMenuFiles([]);
  }, [pageBanner, reset]);

  const onSubmit = async (data: BannerFormData) => {
    const loadingToast = ToastMessage.loading({
      title: "Updating general setting...",
    });
    try {
      const formData = new FormData();

      // Add favicon if selected
      if (menuFiles.length > 0) {
        formData.append("menu", menuFiles[0]);
      }
      // Add image if selected
      if (outletsFiles.length > 0) {
        formData.append("outlets", outletsFiles[0]);
      }

      if (blogsFiles.length > 0) {
        formData.append("blogs", blogsFiles[0]);
      }

      const result = await updatePageBanner(formData);

      if (!result.status) {
        ToastMessage.error(
          { title: result?.message || "Failed to save general setting" },
          { id: loadingToast },
        );
        return;
      }

      ToastMessage.success(
        { title: result?.message || "General Setting successfully!" },
        {
          id: loadingToast,
        },
      );
      reset();
      setBlogsFiles([]);
      setOutletsFiles([]);
      setMenuFiles([]);
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
              {/* <FaImage className="h-5 w-5 text-primary" /> */}
              Page Banner Information
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Upload website's Page Banner Image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Information */}

            {/* Branding */}
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label
                    htmlFor="menu"
                    className="dark:text-gray-200 text-base font-medium"
                  >
                    Doctors Banner
                  </Label>
                  <div className="flex items-center gap-2">
                    <FileUploadComponent
                      accept="image"
                      maxSize={15}
                      maxFiles={1}
                      onFilesChange={setMenuFiles}
                      existingImageUrl={
                        pageBanner?.menu ? pageBanner.menu : undefined
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label
                    htmlFor="outletsFiles"
                    className="dark:text-gray-200 text-base font-medium"
                  >
                    Galleries Banner
                  </Label>
                  <div className="flex items-center gap-2">
                    <FileUploadComponent
                      accept="image"
                      maxSize={15}
                      maxFiles={1}
                      onFilesChange={setOutletsFiles}
                      existingImageUrl={
                        pageBanner?.outlets ? pageBanner.outlets : undefined
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label
                    htmlFor="blogsFiles"
                    className="dark:text-gray-200 text-base font-medium"
                  >
                    Services Banner
                  </Label>
                  <div className="flex items-center gap-2">
                    <FileUploadComponent
                      accept="image"
                      maxSize={15}
                      maxFiles={1}
                      onFilesChange={setBlogsFiles}
                      existingImageUrl={
                        pageBanner?.blogs ? pageBanner.blogs : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Updating Banner..." : "Update Banner Settings"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
