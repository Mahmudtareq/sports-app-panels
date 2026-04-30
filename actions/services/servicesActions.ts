"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getServices() {
  try {
    const res = await apiClient(`/api/admin/service-gallery`, {
      method: "GET",
      tags: ["services"],
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
        error instanceof Error ? error.message : "Failed to get services list",
      data: [],
    };
  }
}

export async function createNewServices(formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/service-gallery`, {
      method: "POST",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("services");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create services",
      data: [],
    };
  }
}

export async function updateServices(id: string, formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/service-gallery/${id}`, {
      method: "PUT",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("services");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update services",
      data: [],
    };
  }
}

export async function shortsServicesList(data: any) {
  try {
    const res = await apiClient("/api/admin/service-gallery/sort", {
      method: "PUT",
      body: data,
    });
    if (res?.status) {
      updateTag("services");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to shorts services",
      data: [],
    };
  }
}

export async function servicesChangeStatus(id: string, status: boolean) {
  try {
    const res = await apiClient(`/api/admin/service-gallery/status/${id}`, {
      method: "PUT",
      body: { status },
    });

    if (res?.status) {
      updateTag("services");
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
          : "Failed to update services status",
      data: [],
    };
  }
}

export async function deleteServiceGallery(id: string) {
  try {
    const res = await apiClient(`/api/admin/service-gallery/${id}`, {
      method: "DELETE",
    });

    if (res?.status) {
      updateTag("services");
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
          : "Failed to delete services gallery",
      data: [],
    };
  }
}
