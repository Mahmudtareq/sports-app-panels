"use client";
import { updateMetadata } from "@/actions/settings/settingsActions";
import { ToastMessage } from "@/components/custom/ToastMessage";
import FileUploadComponent from "@/components/form/FileUploadComponent";
import InputField from "@/components/form/InputField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface MetadataFormData {
  title: string;
  applicationName: string;
  description: string;
  keywords: string;
  openGraphImage: FileList | null;
}
export default function MetadataSettings({ metadata }: any) {
  const [openGraphImageFile, setOpenGraphImage] = useState<File[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const methods = useForm<MetadataFormData>({
    defaultValues: {
      title: "",
      applicationName: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (metadata) {
      reset({
        title: metadata.title || "",
        applicationName: metadata.applicationName || "",
        description: metadata.description || "",
      });

      // Set keywords if they exist
      if (metadata.keywords && Array.isArray(metadata.keywords)) {
        setKeywords(metadata.keywords);
      } else if (metadata.keywords && typeof metadata.keywords === "string") {
        setKeywords(metadata.keywords.split(",").map((k: string) => k.trim()));
      }
    } else {
      reset({
        title: "",
        applicationName: "",
        description: "",
      });
      setKeywords([]);
    }
    setOpenGraphImage([]);
  }, [metadata, reset]);

  const handleAddKeyword = () => {
    const trimmedKeyword = keywordInput.trim();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
      setKeywords([...keywords, trimmedKeyword]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const onSubmit = async (data: MetadataFormData) => {
    const loadingToast = ToastMessage.loading({
      title: "Updating metadata setting...",
    });
    try {
      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("applicationName", data.applicationName || "");
      formData.append("description", data.description || "");

      // Add keywords as array items
      keywords.forEach((keyword, index) => {
        formData.append(`keywords[${index}]`, keyword);
      });

      // Add openGraphImage if selected
      if (openGraphImageFile.length > 0) {
        formData.append("openGraphImage", openGraphImageFile[0]);
      }

      const result = await updateMetadata(formData);

      if (!result.status) {
        ToastMessage.error(
          {
            title: result.message || "Failed to save metadata setting",
          },
          { id: loadingToast },
        );
        return;
      }

      ToastMessage.success(
        { title: result.message || "Metadata setting updated successfully!" },
        {
          id: loadingToast,
        },
      );

      reset();
      setOpenGraphImage([]);
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
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <FaFileCode className="h-5 w-5 text-primary" /> */}
              Metadata Information
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Configure your website's metadata information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="title"
                  label="Meta Title"
                  placeholder="title"
                  rules={{ required: "Required!" }}
                />

                <InputField
                  name="applicationName"
                  label="Application Name"
                  placeholder="bakery"
                  rules={{
                    required: "Required!",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="dark:text-gray-200">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    className="dark:bg-gray-700 h-50 dark:border-gray-600 dark:text-white"
                    {...register("description", { required: "Required!" })}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="logo" className="dark:text-gray-200">
                    OpenGraph Image
                  </Label>
                  <div className="flex items-center gap-2">
                    <FileUploadComponent
                      accept="image"
                      maxSize={15}
                      maxFiles={1}
                      onFilesChange={setOpenGraphImage}
                      existingImageUrl={
                        metadata?.openGraphImage
                          ? metadata.openGraphImage
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Keywords Field */}
              <div className="space-y-2">
                <Label htmlFor="keywords" className="dark:text-gray-200">
                  Keywords
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a keyword and press Enter"
                      className="flex h-11 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0   disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Button
                      type="button"
                      onClick={handleAddKeyword}
                      disabled={keywordInput.trim().length === 0}
                      variant="outline"
                      className="dark:bg-gray-700 dark:border-gray-600 h-11 dark:text-white cursor-pointer disabled:cursor-not-allowed"
                    >
                      Add Keyword
                    </Button>
                  </div>

                  {/* Keywords Display */}
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md dark:border-gray-600 dark:bg-gray-700 my-3">
                      {keywords.map((keyword, index) => (
                        <Badge
                          variant="outline"
                          key={index}
                          className="flex items-center border dark:border-gray-600  gap-1.5 px-3 py-1.5 font-medium capitalize text-sm "
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(index)}
                            className="text-red-600 rounded-sm hover:text-red-600 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
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
            {isSubmitting ? "Updating Metadata..." : "Update Metadata Settings"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
