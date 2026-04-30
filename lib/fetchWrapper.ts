import { auth, signOut } from "@/app/api/auth/[...nextauth]/auth";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

type FetchOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  tags?: string[];
  cache?: "force-cache" | "no-store";
  isFormData?: boolean;
  revalidate?: number | false;
};

// ✅ Standard response shape for all calls
type ApiResponse<TResponse> =
  | { ok: true; data: TResponse }
  | { ok: false; message: string; data: [] };

export async function fetchWrapper<TResponse = any, TBody = undefined>(
  url: string,
  options: FetchOptions<TBody> = {},
): Promise<ApiResponse<TResponse>> {
  const {
    method = "GET",
    body,
    tags,
    cache,
    isFormData = false,
    revalidate,
  } = options;

  try {
    const session = await auth();
    const token = session?.token;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!isFormData && body) {
      headers["Content-Type"] = "application/json";
    }

    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

    const fetchOptions: RequestInit = {
      method,
      headers,
      body: isFormData
        ? (body as any)
        : body
          ? JSON.stringify(body)
          : undefined,
    };

    if (isMutation) {
      fetchOptions.cache = "no-store";
    } else {
      if (cache) fetchOptions.cache = cache;
      if (tags || revalidate !== undefined) {
        fetchOptions.next = {
          ...(tags && { tags }),
          ...(revalidate !== undefined && { revalidate }),
        };
      }
    }

    const res = await fetch(`${baseURL}${url}`, fetchOptions);

    if (!res.ok) {
      // ✅ 401 — sign out and redirect INSIDE apiClient
      // NEXT_REDIRECT propagates up naturally since no catch below will swallow it
      if (res.status === 401) {
        await signOut({ redirect: false });
        redirect(routes.publicRoutes.adminLogin); // throws NEXT_REDIRECT — bubbles up freely
      }

      // ✅ All other errors — return as object, never throw
      let message = `HTTP error! status: ${res.status}`;
      try {
        const errorData = await res.json();
        message = errorData.message || message;
      } catch {
        const text = await res.text();
        message = text || message;
      }

      return { ok: false, message, data: [] };
    }

    const data = await res.json();
    return { ok: true, data }; // ✅ success
  } catch (error) {
    // ✅ Only re-throw redirect — everything else becomes a return value
    if ((error as any)?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error; // must propagate so Next.js can process it
    }

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { ok: false, message, data: [] }; // ✅ network errors etc — return, never throw
  }
}
