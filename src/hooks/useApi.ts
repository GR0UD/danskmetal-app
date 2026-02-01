"use client";

import { useCallback } from "react";
import { getAuthToken, deleteAuthToken } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  requireAuth?: boolean;
  showErrorToast?: boolean;
}

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  ok: boolean;
}

export function useApi() {
  const router = useRouter();

  const fetchApi = useCallback(
    async <T = unknown>(
      endpoint: string,
      options: FetchOptions = {},
    ): Promise<FetchResult<T>> => {
      const {
        method = "GET",
        body,
        requireAuth = false,
        showErrorToast = false,
      } = options;

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (requireAuth) {
          const token = await getAuthToken();
          if (!token) {
            router.push("/");
            return { data: null, error: "Ikke logget ind", ok: false };
          }
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (response.status === 401 && requireAuth) {
          await deleteAuthToken();
          router.push("/");
          return { data: null, error: "Session udløbet", ok: false };
        }

        const data = await response.json();

        if (!data.ok) {
          const errorMessage = data.message || "Der opstod en fejl";
          if (showErrorToast) {
            toast.error(errorMessage);
          }
          return { data: null, error: errorMessage, ok: false };
        }

        return { data: data as T, error: null, ok: true };
      } catch {
        const errorMessage = "Kunne ikke forbinde til serveren";
        if (showErrorToast) {
          toast.error(errorMessage);
        }
        return { data: null, error: errorMessage, ok: false };
      }
    },
    [router],
  );

  return { fetchApi, API_URL };
}
