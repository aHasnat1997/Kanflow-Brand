import type { Task } from "@Kanflow-Brand/types";
import { apiFetch } from "./client";

/** Tasks API client. */

/**
 * Creates a new task appended to a column.
 *
 * @param columnId - Column CUID
 * @param title - Task title
 * @param description - Optional task description
 * @returns The created {@link Task}
 */
export async function createTask(
  columnId: string,
  title: string,
  description?: string,
): Promise<Task> {
  return apiFetch<Task>(`/columns/${columnId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

/**
 * Updates a task's title and/or description.
 *
 * @param taskId - Task CUID
 * @param data - Partial update data
 * @returns The updated {@link Task}
 */
export async function updateTask(
  taskId: string,
  data: { title?: string; description?: string },
): Promise<Task> {
  return apiFetch<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a task.
 *
 * @param taskId - Task CUID
 */
export async function deleteTask(taskId: string): Promise<void> {
  return apiFetch<void>(`/tasks/${taskId}`, { method: "DELETE" });
}

/**
 * Moves a task to a new column and/or position.
 * Called after a drag-and-drop to persist the final position.
 *
 * @param taskId - Task CUID being moved
 * @param targetColumnId - Destination column CUID
 * @param newPosition - New float position within the target column
 * @returns The updated {@link Task}
 */
export async function moveTask(
  taskId: string,
  targetColumnId: string,
  newPosition: number,
): Promise<Task> {
  return apiFetch<Task>(`/tasks/${taskId}/move`, {
    method: "PATCH",
    body: JSON.stringify({ targetColumnId, newPosition }),
  });
}
