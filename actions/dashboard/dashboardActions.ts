"use server";

import { apiClient } from "@/lib/api-client";

export async function getDashboardStats() {
  try {
    const res = await apiClient(`/api/admin/dashboard/stats`, {
      method: "GET",
      //cache: "force-cache",
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
          : "Failed to get dashboard stats",
      data: [],
    };
  }
}
