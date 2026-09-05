import { Injectable } from "@nestjs/common";
import prisma from "@Kanflow-Brand/db";
import { BoardsGateway } from "./boards.gateway";

@Injectable()
export class ActivityLoggerService {
  constructor(private readonly boardsGateway: BoardsGateway) {}

  /**
   * Logs an activity to the database and broadcasts it via WebSocket.
   */
  async logAndBroadcast(
    boardId: string,
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    details?: any,
  ) {
    // 1. Fetch user to get name for the toast broadcast
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.name || "Someone";

    // 2. Save to DB
    const log = await prisma.activityLog.create({
      data: {
        boardId,
        userId,
        action,
        entityType,
        entityId,
        details: details ?? undefined,
      },
    });

    // 3. Broadcast to WebSocket room
    // For toasts
    this.boardsGateway.broadcastToBoard(boardId, "activity", {
      id: log.id,
      userName,
      action,
      entityType,
      details,
      createdAt: log.createdAt,
    });
  }

  /**
   * Retrieves the recent activity logs for a board.
   */
  async getLogs(boardId: string, limit = 50) {
    const logs = await prisma.activityLog.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      details: log.details,
      createdAt: log.createdAt,
      user: log.user ? { name: log.user.name, email: log.user.email } : null,
    }));
  }
}
