"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getStoriesLists(
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

    const res = await apiClient(`/api/admin/story?${params.toString()}`, {
      method: "GET",
      tags: ["stories"],
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
        error instanceof Error ? error.message : "Failed to get stories list",
      data: [],
    };
  }
}

export async function storiesChangeStatus(id: string, status: boolean) {
  try {
    const res = await apiClient(`/api/admin/story/status/${id}`, {
      method: "PUT",
      body: { status },
      cache: "no-store",
    });

    if (res?.status) {
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
        error instanceof Error
          ? error.message
          : "Failed to update stories status",
      data: [],
    };
  }
}

export async function deleteStories(id: string) {
  try {
    const res = await apiClient(`/api/admin/story/${id}`, {
      method: "DELETE",
    });

    if (res?.status) {
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
        error instanceof Error ? error.message : "Failed to delete stories",
      data: [],
    };
  }
}

export async function createNewStories(data: any) {
  try {
    const res = await apiClient(`/api/admin/story`, {
      method: "POST",
      body: data,
      // isFormData: true,
    });

    if (res?.status) {
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
        error instanceof Error ? error.message : "Failed to create new stories",
      data: [],
    };
  }
}

export async function updateStories(id: string, data: any) {
  try {
    const res = await apiClient(`/api/admin/story/${id}`, {
      method: "PUT",
      body: data,
      // isFormData: true,
    });

    if (res?.status) {
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
        error instanceof Error ? error.message : "Failed to update stories",
      data: [],
    };
  }
}

// export async function shortsTeamLists(data: any) {
//   try {
//     const res = await apiClient("/api/admin/team/sort", {
//       method: "PUT",
//       body: data,
//     });
//     if (res?.status) {
//       updateTag("teams");
//     }

//     return res;
//   } catch (error) {
//     return {
//       ok: false,
//       message:
//         error instanceof Error ? error.message : "Failed to shorts teams",
//       data: [],
//     };
//   }
// }

export async function getStoryById(id: string) {
  try {
    const res = await apiClient(`/api/admin/story/${id}`, {
      method: "GET",
      tags: ["stories"],
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
        error instanceof Error ? error.message : "Failed to get story list",
      data: [],
    };
  }
}
