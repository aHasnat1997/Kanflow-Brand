"use client";

import { useState, useEffect, useCallback } from "react";
import type { BoardDetail, ColumnWithTasks, Task } from "@Kanflow-Brand/types";
import { getBoardDetail } from "@/lib/api/boards";
import { moveTask as apiMoveTask } from "@/lib/api/tasks";
import { calculateMidpointPosition, calculateAppendPosition, POSITION_GAP } from "@/lib/ordering";

interface UseBoard {
  board: BoardDetail | null;
  isLoading: boolean;
  error: string | null;
  moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => Promise<void>;
  moveColumn: (columnId: string, targetIndex: number) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching a single board's full detail (columns + tasks).
 * Handles optimistic task moves: updates local state immediately on drop,
 * calls the API, and rolls back on failure.
 *
 * @param boardId - Board CUID
 */
export function useBoard(boardId: string): UseBoard {
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    setError(null);
    try {
      const data = await getBoardDetail(boardId);
      setBoard(data);
    } catch {
      setError("Failed to load board");
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    void fetchBoard();
  }, [fetchBoard]);

  /**
   * Moves a task optimistically — updates local state first, then persists.
   * Rolls back to the previous state if the API call fails.
   */
  const moveTask = useCallback(
    async (
      taskId: string,
      sourceColumnId: string,
      targetColumnId: string,
      targetIndex: number,
    ): Promise<void> => {
      if (!board) return;

      // --- Snapshot for rollback ---
      const previousBoard = board;

      // --- Calculate new position ---
      const targetColumn = board.columns.find((c) => c.id === targetColumnId);
      if (!targetColumn) return;

      // Filter out the task being moved (so it doesn't affect position calc)
      const remainingTasks = targetColumn.tasks.filter(
        (t) => !(t.id === taskId && sourceColumnId === targetColumnId),
      );
      const positions = remainingTasks.map((t) => t.position);
      const newPosition = calculateInsertPosition(positions, targetIndex);

      // --- Optimistic update ---
      setBoard((prev) => {
        if (!prev) return prev;

        const taskToMove = prev.columns
          .flatMap((c) => c.tasks)
          .find((t) => t.id === taskId);

        if (!taskToMove) return prev;

        const movedTask: Task = { ...taskToMove, columnId: targetColumnId, position: newPosition };

        const updatedColumns: ColumnWithTasks[] = prev.columns.map((col) => {
          if (col.id === sourceColumnId && col.id !== targetColumnId) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
          }
          if (col.id === targetColumnId) {
            const tasksWithoutMoved = col.tasks.filter((t) => t.id !== taskId);
            const newTasks = [...tasksWithoutMoved];
            newTasks.splice(targetIndex, 0, movedTask);
            return { ...col, tasks: newTasks.map((t, i) => ({ ...t, position: (i + 1) * POSITION_GAP })) };
          }
          return col;
        });

        return { ...prev, columns: updatedColumns };
      });

      // --- Persist ---
      try {
        await apiMoveTask(taskId, targetColumnId, newPosition);
      } catch {
        // Roll back to snapshot on failure
        setBoard(previousBoard);
      }
    },
    [board],
  );

  const moveColumn = useCallback(
    async (columnId: string, targetIndex: number): Promise<void> => {
      if (!board) return;

      const previousBoard = board;

      const columnsWithoutMoved = board.columns.filter((c) => c.id !== columnId);
      const positions = columnsWithoutMoved.map((c) => c.position);
      const newPosition = calculateInsertPosition(positions, targetIndex);

      setBoard((prev) => {
        if (!prev) return prev;
        const colToMove = prev.columns.find((c) => c.id === columnId);
        if (!colToMove) return prev;

        const newCols = [...prev.columns.filter((c) => c.id !== columnId)];
        newCols.splice(targetIndex, 0, { ...colToMove, position: newPosition });
        
        return { ...prev, columns: newCols };
      });

      try {
        const { moveColumn: apiMoveColumn } = await import("@/lib/api/columns");
        await apiMoveColumn(columnId, newPosition);
      } catch {
        setBoard(previousBoard);
      }
    },
    [board],
  );

  return { board, isLoading, error, moveTask, moveColumn, refresh: fetchBoard };
}

/**
 * Calculates the insert position for a task at a target index within a sorted position array.
 * Mirrors the server-side logic in task-ordering.util.ts.
 */
function calculateInsertPosition(positions: number[], targetIndex: number): number {
  if (positions.length === 0) return POSITION_GAP;
  if (targetIndex <= 0) return (positions[0] ?? POSITION_GAP) / 2;
  if (targetIndex >= positions.length) return calculateAppendPosition(positions[positions.length - 1] ?? 0);
  return calculateMidpointPosition(positions[targetIndex - 1] ?? 0, positions[targetIndex] ?? 0);
}
