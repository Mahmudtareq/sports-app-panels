import { uploadFile } from "@/actions/file/fileUploadActions";

interface UploadResult {
  imageId: string;
  url: string;
}

interface UploadResponse {
  status: boolean;
  message: string;
  data: {
    single: UploadResult | null;
    multiple: UploadResult[] | null;
    all: UploadResult[];
  };
}

/**
 * Upload a single file and return imageId and url
 */
export async function uploadSingleFile(
  file: File
): Promise<UploadResult | null> {
  try {
    const formData = new FormData();
    formData.append("images", file);

    const response: UploadResponse = await uploadFile(formData);

    if (response.status && response.data?.single) {
      return response.data.single;
    }

    console.error("Upload failed:", response.message);
    return null;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

/**
 * Upload multiple files and return array of imageIds and urls
 */
export async function uploadMultipleFiles(
  files: File[]
): Promise<UploadResult[]> {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response: UploadResponse = await uploadFile(formData);

    if (response.status && response.data?.all) {
      return response.data.all;
    }

    console.error("Upload failed:", response.message);
    return [];
  } catch (error) {
    console.error("Error uploading files:", error);
    return [];
  }
}

/**
 * Upload files with progress callback (optional)
 */
export async function uploadFilesWithProgress(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadResult[]> {
  try {
    if (onProgress) onProgress(0);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    if (onProgress) onProgress(50);

    const response: UploadResponse = await uploadFile(formData);

    if (onProgress) onProgress(100);

    if (response.status && response.data?.all) {
      return response.data.all;
    }

    return [];
  } catch (error) {
    console.error("Error uploading files:", error);
    return [];
  }
}
