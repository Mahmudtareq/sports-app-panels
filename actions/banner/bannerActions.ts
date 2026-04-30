"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getBanner(sectionName: string) {
  try {
    const params = new URLSearchParams({
      sectionName,
    });
    const res = await apiClient(`/api/admin/banner?${params.toString()}`, {
      method: "GET",
      tags: ["banner"],
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
        error instanceof Error ? error.message : "Failed to get banner list",
      data: [],
    };
  }
}

export async function createBanner(formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/banner`, {
      method: "POST",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("banner");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create banner",
      data: [],
    };
  }
}

export async function updateBanner(id: string, formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/banner/${id}`, {
      method: "PUT",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("banner");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update banner",
      data: [],
    };
  }
}

export async function shortsBannerList(data: any) {
  try {
    const res = await apiClient("/api/admin/banner/sort", {
      method: "PUT",
      body: data,
    });
    if (res?.status) {
      updateTag("banner");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to shorts banner",
      data: [],
    };
  }
}

export async function bannerChangeStatus(id: string, status: boolean) {
  try {
    const res = await apiClient(`/api/admin/banner/status/${id}`, {
      method: "PUT",
      body: { status },
    });

    if (res?.status) {
      updateTag("banner");
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
          : "Failed to update banner status",
      data: [],
    };
  }
}

export async function deleteBanner(id: string) {
  try {
    const res = await apiClient(`/api/admin/banner/${id}`, {
      method: "DELETE",
    });

    if (res?.status) {
      updateTag("banner");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to delete banner",
      data: [],
    };
  }
}
