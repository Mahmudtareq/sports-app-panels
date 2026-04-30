"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getTestimonialList() {
  try {
    const res = await apiClient(`/api/admin/testimonial`, {
      method: "GET",
      tags: ["testimonial"],
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
          : "Failed to get testimonial list",
      data: [],
    };
  }
}

export async function createNewTestimonial(formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/testimonial`, {
      method: "POST",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("testimonial");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create testimonial",
      data: [],
    };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/testimonial/${id}`, {
      method: "PUT",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("testimonial");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update testimonial",
      data: [],
    };
  }
}

export async function shortsTestimonialLists(data: any) {
  try {
    const res = await apiClient("/api/admin/testimonial/sort", {
      method: "PUT",
      body: data,
    });
    if (res?.status) {
      updateTag("testimonial");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to shorts testimonial",
      data: [],
    };
  }
}

export async function testimonialChangeStatus(id: string, status: boolean) {
  try {
    const res = await apiClient(`/api/admin/testimonial/status/${id}`, {
      method: "PUT",
      body: { status },
    });

    if (res?.status) {
      updateTag("testimonial");
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
          : "Failed to update testimonial status",
      data: [],
    };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const res = await apiClient(`/api/admin/testimonial/${id}`, {
      method: "DELETE",
    });

    if (res?.status) {
      updateTag("testimonial");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to delete testimonial",
      data: [],
    };
  }
}
