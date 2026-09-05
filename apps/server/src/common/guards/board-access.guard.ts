import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Request } from "express";
import prisma from "@Kanflow-Brand/db";
import type { AuthUser } from "@Kanflow-Brand/types";

/**
 * Guard that enforces board-level access control.
 *
 * A user may access a board's resources (columns, tasks) only if they are
 * the board owner OR an explicit {@link BoardMember}. Any other user receives
 * `403 Forbidden` — **not** `404`, to avoid leaking board existence.
 *
 * This guard is the single place where board membership is checked.
 * Boards, Columns, and Tasks controllers all reuse it — never duplicate
 * this logic in a service method.
 *
 * Route params checked (in priority order):
 * 1. `boardId` — direct board route
 * 2. `id` — used when the route is `/boards/:id`
 *
 * @throws {NotFoundException} 404 if no `boardId` / `id` param is present
 * @throws {ForbiddenException} 403 if the user is not a member of the board
 */
@Injectable()
export class BoardAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & { user: AuthUser; resolvedBoardId?: string }
    >();

    const user = request.user;
    let boardId = request.params["boardId"];

    if (!boardId && request.params["columnId"]) {
      const column = await prisma.column.findUnique({
        where: { id: request.params["columnId"] },
        select: { boardId: true },
      });
      boardId = column?.boardId;
    }

    if (!boardId && request.params["id"]) {
      const id = request.params["id"];
      if (request.url.match(/\/tasks\//)) {
        const task = await prisma.task.findUnique({
          where: { id },
          select: { column: { select: { boardId: true } } },
        });
        boardId = task?.column?.boardId;
      } else if (request.url.match(/\/columns\//)) {
        const column = await prisma.column.findUnique({
          where: { id },
          select: { boardId: true },
        });
        boardId = column?.boardId;
      } else {
        boardId = id;
      }
    }

    if (!boardId) {
      throw new NotFoundException("Board ID not found in route params");
    }

    const membership = await prisma.boardMember.findFirst({
      where: { boardId: boardId as string, userId: user.id },
    });

    if (!membership) {
      // Return 403, not 404 — do not reveal whether the board exists at all
      throw new ForbiddenException(
        "You do not have access to this board",
      );
    }

    const isAccessRequestEndpoint = request.url.match(/\/access-requests/);

    if (membership.role === "VIEWER") {
      // VIEWER can only make GET requests, except for requesting access (POST)
      if (request.method !== "GET") {
        if (!(request.method === "POST" && isAccessRequestEndpoint)) {
          throw new ForbiddenException("You only have view access to this board");
        }
      }
    }

    if (isAccessRequestEndpoint && (request.method === "PATCH" || request.method === "GET")) {
      // Only OWNER can approve/reject requests or view the list of requests
      if (membership.role !== "OWNER") {
        throw new ForbiddenException("Only the board owner can manage access requests");
      }
    }

    // Attach resolved boardId for downstream use in column/task controllers
    request.resolvedBoardId = boardId as string;

    return true;
  }
}
