"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getCategoriesList() {
  try {
    const res = await apiClient(`/api/admin/category`, {
      method: "GET",
      tags: ["categories"],
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
        error instanceof Error
          ? error.message
          : "Failed to get categories list",
      data: [],
    };
  }
}

export async function createCategory(data: any) {
  try {
    const res = await apiClient("/api/admin/category", {
      method: "POST",
      body: data,
    });
    if (res?.status) {
      updateTag("categories");
    }
    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create category",
      data: null,
    };
  }
}

export async function updateCategory(slug: string, data: any) {
  try {
    const res = await apiClient(`/api/admin/category/${slug}`, {
      method: "PUT",
      body: data,
    });

    if (res?.status) {
      updateTag("categories");
      updateTag("stories");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update category",
      data: null,
    };
  }
}

export async function deleteCategory(slug: string) {
  try {
    const res = await apiClient(`/api/admin/category/${slug}`, {
      method: "DELETE",
    });

    if (res?.status) {
      updateTag("categories");
      updateTag("stories");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to delete category",
      data: null,
    };
  }
}

export async function shortsCategoryTable(data: { sortedIds: string[] }) {
  try {
    const res = await apiClient("/api/admin/category/sort", {
      method: "PUT",
      body: data,
    });
    if (res?.status) {
      updateTag("categories");
      updateTag("stories");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to shorts category",
      data: null,
    };
  }
}

export async function changeCategoryStatus(id: string, status: boolean) {
  try {
    const res = await apiClient(`/api/admin/category/status/${id}`, {
      method: "PUT",
      body: { status },
    });

    if (res?.status) {
      updateTag("categories");
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
          : "Failed to update category status",
      data: null,
    };
  }
}

export async function getSingleCategory(slug: string) {
  try {
    const res = await apiClient(`/api/admin/category/${slug}`, {
      method: "GET",
      tags: ["categories"],
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
        error instanceof Error ? error.message : "Failed to get category list",
      data: {},
    };
  }
}
