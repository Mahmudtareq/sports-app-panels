"use server";

import { apiClient } from "@/lib/api-client";

export async function uploadFile(formData: FormData) {
  try {
    const res = await apiClient("/api/admin/file", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to file upload",
      data: null,
    };
  }
}
