"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getContactList(
  page: number,
  limit: number,
  search: string,
) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search: search || "",
    });

    const res = await apiClient(`/api/admin/contact-us?${params.toString()}`, {
      method: "GET",
      tags: ["contact"],
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
        error instanceof Error ? error.message : "Failed to get contact list",
      data: [],
    };
  }
}

export async function contactChangeStatus(id: string, status: boolean) {
  try {
    const res = await apiClient(`/api/admin/contact-us/${id}`, {
      method: "PUT",
      body: { status },
    });

    if (res?.status) {
      updateTag("contact");
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
          : "Failed to update contact status",
      data: [],
    };
  }
}

export async function deleteContact(id: string) {
  try {
    const res = await apiClient(`/api/admin/contact-us/${id}`, {
      method: "DELETE",
    });

    if (res?.status) {
      updateTag("contact");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to delete contact",
      data: [],
    };
  }
}
