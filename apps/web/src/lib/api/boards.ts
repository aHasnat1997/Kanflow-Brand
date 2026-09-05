import type { BoardWithMembers, BoardDetail } from "@Kanflow-Brand/types";
import { apiFetch } from "./client";

/** Boards API client. */

/**
 * Returns all boards the current user owns or is a member of.
 *
 * @returns Array of {@link BoardWithMembers}
 */
export async function getBoards(): Promise<BoardWithMembers[]> {
  return apiFetch<BoardWithMembers[]>("/boards");
}

/**
 * Returns the full detail of a board including ordered columns and tasks.
 *
 * @param boardId - Board CUID
 * @returns {@link BoardDetail}
 */
export async function getBoardDetail(boardId: string): Promise<BoardDetail> {
  return apiFetch<BoardDetail>(`/boards/${boardId}`);
}

/**
 * Creates a new board and records the creator as OWNER.
 *
 * @param name - Board display name
 * @returns The newly created {@link BoardWithMembers}
 */
export async function createBoard(name: string): Promise<BoardWithMembers> {
  return apiFetch<BoardWithMembers>("/boards", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

/**
 * Shares a board with another user by email address.
 *
 * @param boardId - Board CUID
 * @param email - Email of the user to invite
 * @returns Success message
 */
export async function shareBoard(
  boardId: string,
  email: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/boards/${boardId}/share`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getBoardActivity(boardId: string) {
  return apiFetch<any[]>(`/boards/${boardId}/activity`);
}

export async function getShareToken(boardId: string) {
  return apiFetch<{ token: string }>(`/boards/${boardId}/share-token`);
}

export async function joinViaToken(token: string) {
  return apiFetch<{ boardId: string }>(`/boards/join/${token}`);
}

export async function requestEditAccess(boardId: string) {
  return apiFetch<any>(`/boards/${boardId}/access-requests`, {
    method: "POST",
  });
}

export async function getAccessRequests(boardId: string) {
  return apiFetch<any[]>(`/boards/${boardId}/access-requests`);
}

export async function updateAccessRequest(boardId: string, reqId: string, status: "APPROVED" | "REJECTED") {
  return apiFetch<any>(`/boards/${boardId}/access-requests/${reqId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
