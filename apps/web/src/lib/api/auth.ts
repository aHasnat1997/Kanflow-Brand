import type { User, MeResponse, RegisterResponse } from "@Kanflow-Brand/types";
import { apiFetch } from "./client";

/** Auth API client — register, login, logout, session check. */

/**
 * Registers a new user account.
 *
 * @param email - User's email address
 * @param name - Display name
 * @param password - Raw password (min 8 chars)
 * @returns The created {@link User}
 */
export async function register(
  email: string,
  name: string,
  password: string,
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  });
}

/**
 * Authenticates with email and password. On success, the server sets
 * the `auth_token` httpOnly cookie — no token is returned in the body.
 *
 * @param email - User's email
 * @param password - Raw password
 * @returns The authenticated {@link User} profile
 */
export async function login(email: string, password: string): Promise<MeResponse> {
  return apiFetch<MeResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Ends the current session by clearing the auth cookie server-side.
 */
export async function logout(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

/**
 * Fetches the currently authenticated user's profile.
 * Throws {@link ApiClientError} with statusCode 401 if not authenticated.
 *
 * @returns The current {@link User}
 */
export async function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/auth/me");
}
