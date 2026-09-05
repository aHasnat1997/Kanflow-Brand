import type { Column } from "@Kanflow-Brand/types";
import { apiFetch } from "./client";

/** Columns API client. */

/**
 * Creates a new column appended to a board.
 *
 * @param boardId - Board CUID
 * @param name - Column display name
 * @returns The created {@link Column}
 */
export async function createColumn(boardId: string, name: string): Promise<Column> {
  return apiFetch<Column>(`/boards/${boardId}/columns`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

/**
 * Renames a column.
 *
 * @param columnId - Column CUID
 * @param name - New display name
 * @returns The updated {@link Column}
 */
export async function updateColumn(columnId: string, name: string): Promise<Column> {
  return apiFetch<Column>(`/columns/${columnId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

/**
 * Deletes a column and all its tasks.
 *
 * @param columnId - Column CUID
 */
export async function deleteColumn(columnId: string): Promise<void> {
  return apiFetch<void>(`/columns/${columnId}`, { method: "DELETE" });
}

/**
 * Moves a column to a new position.
 *
 * @param columnId - Column CUID
 * @param newPosition - New position for the column
 */
export async function moveColumn(columnId: string, newPosition: number): Promise<Column> {
  return apiFetch<Column>(`/columns/${columnId}/move`, {
    method: "PATCH",
    body: JSON.stringify({ newPosition }),
  });
}
