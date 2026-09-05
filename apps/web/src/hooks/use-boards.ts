"use client";

import { useState, useEffect, useCallback } from "react";
import type { BoardWithMembers } from "@Kanflow-Brand/types";
import { getBoards, createBoard as apiCreateBoard } from "@/lib/api/boards";

interface UseBoards {
  boards: BoardWithMembers[];
  isLoading: boolean;
  error: string | null;
  createBoard: (name: string) => Promise<BoardWithMembers>;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching and managing the user's board list.
 * Fetches on mount; exposes `createBoard` which updates the local list optimistically.
 */
export function useBoards(): UseBoards {
  const [boards, setBoards] = useState<BoardWithMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    setError(null);
    try {
      const data = await getBoards();
      setBoards(data);
    } catch {
      setError("Failed to load boards");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBoards();
  }, [fetchBoards]);

  const createBoard = useCallback(async (name: string): Promise<BoardWithMembers> => {
    const board = await apiCreateBoard(name);
    setBoards((prev) => [board, ...prev]);
    return board;
  }, []);

  return { boards, isLoading, error, createBoard, refresh: fetchBoards };
}
