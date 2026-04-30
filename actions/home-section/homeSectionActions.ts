"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getHomeSection(sectionName: string) {
  try {
    const res = await apiClient(`/api/admin/home-section/name/${sectionName}`, {
      method: "GET",
      tags: ["home-service"],
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

export async function updateHomeSection(data: any) {
  try {
    const res = await apiClient(`/api/admin/home-section`, {
      method: "POST",
      body: data,
      //   isFormData: false,
    });

    if (res?.status) {
      updateTag("home-service");
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
          : "Failed to create home-service",
      data: [],
    };
  }
}
