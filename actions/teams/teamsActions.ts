"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getTeamsList() {
  try {
    const res = await apiClient(`/api/admin/team`, {
      method: "GET",
      tags: ["teams"],
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
        error instanceof Error ? error.message : "Failed to get teams list",
      data: [],
    };
  }
}

export async function createNewTeam(formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/team`, {
      method: "POST",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("teams");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create teams",
      data: [],
    };
  }
}

export async function updateTeams(id: string, formData: FormData) {
  try {
    const res = await apiClient(`/api/admin/team/${id}`, {
      method: "PUT",
      body: formData,
      isFormData: true,
    });

    if (res?.status) {
      updateTag("teams");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update teams",
      data: [],
    };
  }
}

export async function shortsTeamLists(data: any) {
  try {
    const res = await apiClient("/api/admin/team/sort", {
      method: "PUT",
      body: data,
    });

    if (res?.status) {
      updateTag("teams");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to shorts teams",
      data: [],
    };
  }
}

export async function teamChangeStatus(id: string, status: boolean) {
  try {
    const res = await apiClient(`/api/admin/team/status/${id}`, {
      method: "PUT",
      body: { status },
    });

    if (res?.status) {
      updateTag("teams");
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
          : "Failed to update teams status",
      data: [],
    };
  }
}

export async function deleteTeam(id: string) {
  try {
    const res = await apiClient(`/api/admin/team/${id}`, {
      method: "DELETE",
    });

    if (res?.status) {
      updateTag("teams");
    }

    return res;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to delete team list",
      data: [],
    };
  }
}
