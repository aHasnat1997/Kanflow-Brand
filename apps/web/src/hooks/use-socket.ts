import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

/**
 * Connects to the WebSocket server for a specific board.
 * Listens for "activity" events and calls the onUpdate callback.
 * 
 * @param boardId - The ID of the board to listen to
 * @param onUpdate - Callback fired when a relevant update is received
 */
export function useSocket(boardId: string, onUpdate: () => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!boardId) return;

    const socketUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace("/api", "");
    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true, // Needed if cookies are required for auth
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinBoard", boardId);
    });

    socket.on("activity", (data) => {
      // Refresh the board data when any activity occurs on this board
      onUpdate();
    });

    socket.on("boardUpdate", (data) => {
      // Refresh the board data when board details (members, access requests) change
      onUpdate();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [boardId, onUpdate]);

  return socketRef.current;
}
