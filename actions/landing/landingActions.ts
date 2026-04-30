"use server";

import { apiClient } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getHomeBanner() {
  try {
    const res = await apiClient(`/api/public/banner`, {
      method: "GET",
      tags: ["banner"],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to get getBanner list",
      data: [],
    };
  }
}
export async function getHomeServiceGallery() {
  try {
    const res = await apiClient(`/api/public/service-gallery`, {
      method: "GET",
      tags: ["services"],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get services sections list",
      data: [],
    };
  }
}
export async function getHomeTestimonial() {
  try {
    const res = await apiClient(`/api/public/testimonial`, {
      method: "GET",
      tags: ["testimonial"],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get services testimonial list",
      data: [],
    };
  }
}

export async function getHomeGalleryList(isFeatured: boolean, limit: number) {
  try {
    const params = new URLSearchParams();

    params.set("isFeatured", String(isFeatured));
    params.set("limit", String(limit));

    const res = await apiClient(`/api/public/gallery?${params.toString()}`, {
      method: "GET",
      tags: ["gallery"],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to get gallery list",
      data: [],
    };
  }
}
export async function getHomeServicesList(page: number, limit: number) {
  try {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await apiClient(`/api/services?${params.toString()}`, {
      method: "GET",
      tags: ["services"],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get all services list",
      data: [],
    };
  }
}

export async function getHomeTestimonialList() {
  try {
    const res = await apiClient(`/api/testimonial`, {
      method: "GET",
      tags: ["testimonial"],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
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

export async function createLetsContact(data: any) {
  try {
    const res = await apiClient("/api/contact-us", {
      method: "POST",
      body: data,
      // isFormData: true,
    });
    if (res?.status) {
      updateTag("contact-us");
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create contact us",
      data: null,
    };
  }
}

export async function getAllSettingsDetails(context: string) {
  try {
    const res = await apiClient(`/api/public/settings?context=${context}`, {
      method: "GET",
      tags: ["settings"],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get general setting data",
      data: null,
    };
  }
}

// -----------------
export async function getHomeShowcaseSection(sectionName: string) {
  try {
    const res = await apiClient(
      `/api/public/home-section/name/${sectionName}`,
      {
        method: "GET",
        tags: ["home-service"],
        cache: "force-cache",
      },
    );
    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to get home section",
      data: [],
    };
  }
}
export async function getHomeStoriesSection() {
  try {
    const res = await apiClient(`/api/public/story`, {
      method: "GET",
      tags: ["stories"],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to get home stories",
      data: [],
    };
  }
}

export async function createContact(data: any) {
  try {
    const res = await apiClient(`/api/public/contact-us`, {
      method: "POST",
      body: data,
      // isFormData: true,
    });

    if (res?.status) {
      updateTag("contact");
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create contact",
      data: [],
    };
  }
}

export async function getSingleStories(slug: string) {
  try {
    const res = await apiClient(`/api/public/story/${slug}`, {
      method: "GET",
      tags: ["stories"],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to get home section",
      data: [],
    };
  }
}

export async function getCategories() {
  try {
    const res = await apiClient(`/api/public/category`, {
      method: "GET",
      tags: ["categories"],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      status: false,
      message:
        error instanceof Error ? error.message : "Failed to get categories",
      data: [],
    };
  }
}

export async function getGalleryByCategory(category: string) {
  try {
    const res = await apiClient(`/api/public/gallery?category=${category}`, {
      method: "GET",
      tags: ["gallery"],
      cache: "force-cache",
    });
    // Return normalized response
    return {
      ok: res.status || false,
      status: res.status || false,
      message: res.message || "",
      data: res.data || null,
    };
  } catch (error) {
    return {
      ok: false,
      status: false,
      message:
        error instanceof Error ? error.message : "Failed to get gallery data",
      data: null,
    };
  }
}

export async function getTeams() {
  try {
    const res = await apiClient(`/api/public/team`, {
      method: "GET",
      tags: ["teams"],
      cache: "force-cache",
    });

    return {
      ok: res.status || false,
      status: res.status || false,
      message: res.message || "",
      data: res.data || [],
    };
  } catch (error) {
    return {
      ok: false,
      status: false,
      message: error instanceof Error ? error.message : "Failed to get teams",
      data: [],
    };
  }
}
