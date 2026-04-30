"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getGalleries() {
  try {
    const res = await apiClient(`/api/admin/gallery`, {
      method: "GET",
      tags: ["gallery"],
      cache: "force-cache",
    });
    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to get gallery list",
      data: [],
    };
  }
}

export async function createNewGallery(formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/gallery`, {
      method: "POST",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("gallery");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create gallery",
      data: [],
    };
  }
}

export async function updateGallery(id: string, formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/gallery/${id}`, {
      method: "PUT",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("gallery");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update gallery",
      data: [],
    };
  }
}

export async function shortsGalleryList(data: any) {
  try {
    const res = await apiClient("/api/admin/gallery/sort", {
      method: "PUT",
      body: data,
    });
    if (res?.status) {
      updateTag("gallery");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to shorts gallery",
      data: [],
    };
  }
}

export async function galleryChangeStatus(id: string, status: boolean) {
  try {
    const res = await apiClient(`/api/admin/gallery/status/${id}`, {
      method: "PUT",
      body: { status },
    });

    if (res?.status) {
      updateTag("gallery");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update gallery status",
      data: [],
    };
  }
}

export async function deleteGallery(id: string) {
  try {
    const res = await apiClient(`/api/admin/gallery/${id}`, {
      method: "DELETE",
    });

    if (res?.status) {
      updateTag("gallery");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to delete gallery",
      data: [],
    };
  }
}
