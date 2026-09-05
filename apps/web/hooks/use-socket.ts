import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export const useSocket = (boardId: string, onActivity?: () => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!boardId) return;

    // Connect to WebSocket server
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinBoard", boardId);
    });

    socket.on("activity", (data: any) => {
      // Show toast notification
      toast(`${data.userName} ${data.action}`);

      // Call callback to refresh data
      if (onActivity) {
        onActivity();
      }
    });

    return () => {
      socket.emit("leaveBoard", boardId);
      socket.disconnect();
    };
  }, [boardId, onActivity]);

  return socketRef.current;
};
