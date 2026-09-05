import { env } from "@Kanflow-Brand/env/web";
import type { ApiError } from "@Kanflow-Brand/types";

/**
 * Custom error class for API failures. Carries the structured error body
 * from the server's global exception filter.
 */
export class ApiClientError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly error: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Core fetch wrapper used by every resource-specific API module.
 * Handles:
 * - Prepending the server base URL from the validated env
 * - Sending `credentials: 'include'` so the httpOnly auth cookie is always attached
 * - Parsing error responses into {@link ApiClientError}
 *
 * @param path - URL path (e.g. `/auth/me` — note the leading slash)
 * @param init - Standard `RequestInit` options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws {ApiClientError} on non-2xx responses
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${env.NEXT_PUBLIC_SERVER_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let errorBody: ApiError;
    try {
      errorBody = (await response.json()) as ApiError;
    } catch {
      errorBody = {
        statusCode: response.status,
        message: response.statusText,
        error: "UnknownError",
      };
    }
    throw new ApiClientError(
      errorBody.statusCode,
      errorBody.message,
      errorBody.error,
    );
  }

  // 204 No Content — no body to parse
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
