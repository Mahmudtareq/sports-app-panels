"use client";

import { compressImages } from "@/lib/compressImages";
import { Check, File, Loader2, Upload, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

// types
interface FileUploadProps {
  accept?: "image" | "file" | string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
  existingImageUrl?: string;
  existingImages?: string[];
  onRemoveExisting?: (index?: number) => void;
  compressTo?: number; // Target MB after compression (default: 2)
  enableCompression?: boolean; // Toggle compression (default: true for images)
  compressThresholdMB?: number; // Only compress if file exceeds this MB (default: 1)
}

interface UploadedFile {
  file: File;
  preview?: string;
  id: string;
  originalSize?: number; // Track original size for UI feedback
  compressed?: boolean;
}

const IMAGE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getAcceptString = (accept: string): string => {
  if (accept === "image") return IMAGE_TYPES.join(",");
  if (accept === "file") return "*/*";
  return accept;
};

const isImageFile = (file: File) => file.type.startsWith("image/");

const isAllowedImageType = (file: File) =>
  IMAGE_TYPES.some((type) => file.type.startsWith(type));

const UploadMultipleFilePreview = ({
  accept = "file",
  maxSize = 5,
  maxFiles = 5,
  onFilesChange,
  className = "",
  disabled = false,
  existingImageUrl,
  existingImages = [],
  onRemoveExisting,
  compressTo = 2,
  compressThresholdMB = 1,
  enableCompression = true,
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [displayExistingImages, setDisplayExistingImages] = useState<string[]>(
    [],
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize existing images
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setDisplayExistingImages(existingImages);
      setUploadedFiles([]);
    } else if (existingImageUrl) {
      setDisplayExistingImages([existingImageUrl]);
      setUploadedFiles([]);
    } else {
      setDisplayExistingImages([]);
      setUploadedFiles([]);
    }
  }, [existingImages, existingImageUrl]);

  const totalFiles = uploadedFiles.length + displayExistingImages.length;
  const isUploadDisabled = disabled || totalFiles >= maxFiles;

  const validateFile = (file: File): string | null => {
    // For images with compression enabled, skip size validation (compression handles it)
    const shouldSkipSizeCheck = accept === "image" && enableCompression;

    if (!shouldSkipSizeCheck && file.size > maxSize * 1024 * 1024) {
      return `${file.name} exceeds ${maxSize}MB limit`;
    }

    if (accept === "image") {
      if (!isImageFile(file)) return `${file.name} is not an image file`;
      if (!isAllowedImageType(file))
        return `${file.name} must be PNG, JPG, JPEG, SVG or WebP`;
    }

    return null;
  };

  const generatePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!isImageFile(file)) return resolve(undefined);

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || isUploadDisabled) return;

      const newErrors: string[] = [];

      if (totalFiles + files.length > maxFiles) {
        setErrors([`Maximum ${maxFiles} files allowed`]);
        return;
      }

      // Validate files first (type check, non-image size check)
      const validFiles: File[] = [];
      for (const file of Array.from(files)) {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        if (validFiles.length === 0) return;
      } else {
        setErrors([]);
      }

      // Compress images if enabled
      const shouldCompress = accept === "image" && enableCompression;
      let processedFiles = validFiles;

      if (shouldCompress) {
        setIsCompressing(true);
        try {
          processedFiles = await compressImages(
            validFiles,
            compressTo,
            1920,
            compressThresholdMB,
          );
        } catch (err) {
          console.error("Compression error:", err);
          // Fall back to originals if compression fails
          processedFiles = validFiles;
        } finally {
          setIsCompressing(false);
        }
      }

      // Generate previews and build UploadedFile objects
      const validUploads: UploadedFile[] = [];
      for (let i = 0; i < processedFiles.length; i++) {
        const file = processedFiles[i];
        const originalSize = validFiles[i]?.size;
        const preview = await generatePreview(file);
        validUploads.push({
          file,
          preview,
          id: crypto.randomUUID(),
          originalSize,
          compressed:
            shouldCompress &&
            originalSize !== undefined &&
            file.size < originalSize,
        });
      }

      if (validUploads.length > 0) {
        const updatedFiles = [...uploadedFiles, ...validUploads];
        setUploadedFiles(updatedFiles);
        onFilesChange?.(updatedFiles.map((f) => f.file));
      }
    },
    [
      uploadedFiles,
      maxFiles,
      totalFiles,
      isUploadDisabled,
      onFilesChange,
      accept,
      maxSize,
      enableCompression,
      compressTo,
      compressThresholdMB,
    ],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (isUploadDisabled) return;

      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, isUploadDisabled],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    const newFiles = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(newFiles);
    setErrors([]);
    onFilesChange?.(newFiles.map((f) => f.file));
  };

  const removeExistingImage = (index: number) => {
    const newImages = displayExistingImages.filter((_, i) => i !== index);
    setDisplayExistingImages(newImages);
    onRemoveExisting?.(index);
  };

  const openFileDialog = () => {
    if (!isUploadDisabled) {
      inputRef.current?.click();
    }
  };

  const showImagePreviews =
    accept === "image" &&
    (uploadedFiles.length > 0 || displayExistingImages.length > 0);

  return (
    <div className={`w-full ${className}`}>
      {/* Drop Zone */}
      {!isUploadDisabled && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } ${
            isUploadDisabled
              ? "opacity-50 cursor-not-allowed bg-gray-100"
              : "cursor-pointer hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={getAcceptString(accept)}
            onChange={handleChange}
            multiple={maxFiles > 1}
            disabled={isUploadDisabled}
          />

          <div className="flex flex-col items-center gap-2">
            <div
              className={`p-3 rounded-full ${
                dragActive ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Upload
                className={`w-8 h-8 ${
                  dragActive ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accept === "image" ? "Images only" : "Any file type"} •{" "}
                {accept === "image" && enableCompression
                  ? `Auto-compressed to ${compressTo}MB if over ${compressThresholdMB}MB`
                  : `Max ${maxSize}MB`}{" "}
                • Up to {maxFiles} files ({totalFiles}/{maxFiles} used)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Compression Spinner */}
      {isCompressing && (
        <div className="mt-3 flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2.5">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Compressing image(s) to under {compressTo}MB…</span>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-1">
          {errors.map((error, idx) => (
            <div
              key={idx}
              className="text-sm text-red-600 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Image Previews Grid */}
      {showImagePreviews && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Images ({totalFiles}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Existing Images */}
            {displayExistingImages.map((imageUrl, index) => (
              <div
                key={`existing-${index}`}
                className="relative rounded-lg overflow-hidden border-2 border-gray-200 aspect-square"
              >
                <img
                  src={imageUrl}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExistingImage(index);
                      }}
                      disabled={disabled}
                      className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors disabled:opacity-50"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-white">
                    <p className="text-xs font-medium">Existing Image</p>
                  </div>
                </div>
              </div>
            ))}

            {/* New Uploaded Images */}
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="relative rounded-lg overflow-hidden border-2 border-green-200 aspect-square"
              >
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <File className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                {/* Compressed badge */}
                {uploadedFile.compressed && (
                  <div className="absolute top-2 left-2 bg-indigo-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-tight">
                    Compressed
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start">
                    <div className="bg-green-500 p-1 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(uploadedFile.id);
                      }}
                      disabled={disabled}
                      className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors disabled:opacity-50"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-white">
                    <p className="text-xs font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs opacity-90">
                      {formatFileSize(uploadedFile.file.size)}
                      {uploadedFile.compressed && uploadedFile.originalSize && (
                        <span className="opacity-70 ml-1">
                          (was {formatFileSize(uploadedFile.originalSize)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-Image Files List */}
      {accept !== "image" && uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center shrink-0">
                  <File className="w-6 h-6 text-gray-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>

                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(uploadedFile.id);
                  }}
                  disabled={disabled}
                  className="shrink-0 p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                  type="button"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMultipleFilePreview;
