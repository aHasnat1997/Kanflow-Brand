import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { ColumnsService } from "./columns.service";
import { CreateColumnDto } from "./dto/create-column.dto";
import { UpdateColumnDto } from "./dto/update-column.dto";
import { MoveColumnDto } from "./dto/move-column.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BoardAccessGuard } from "../common/guards/board-access.guard";
import { ActivityLoggerService } from "../boards/activity-logger.service";
import type { Column, AuthUser } from "@Kanflow-Brand/types";

/**
 * HTTP interface for column management within boards.
 * {@link BoardAccessGuard} is applied to every route — board membership
 * is checked automatically, no per-method duplication needed.
 */
@Controller()
@UseGuards(JwtAuthGuard, BoardAccessGuard)
export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly activityLogger: ActivityLoggerService,
  ) {}

  /** Creates a new column appended to the board. */
  @Post("boards/:boardId/columns")
  @HttpCode(HttpStatus.CREATED)
  async createColumn(
    @Param("boardId") boardId: string,
    @Body() dto: CreateColumnDto,
    @Req() req: Request & { user: AuthUser; resolvedBoardId: string },
  ): Promise<Column> {
    const col = await this.columnsService.createColumn(boardId, dto);
    await this.activityLogger.logAndBroadcast(
      req.resolvedBoardId,
      req.user.id,
      "created a column",
      "Column",
      col.id,
      { name: col.name },
    );
    return col;
  }

  /** Renames a column. */
  @Patch("columns/:id")
  async updateColumn(
    @Param("id") id: string,
    @Body() dto: UpdateColumnDto,
    @Req() req: Request & { user: AuthUser; resolvedBoardId: string },
  ): Promise<Column> {
    const col = await this.columnsService.updateColumn(id, dto);
    await this.activityLogger.logAndBroadcast(
      req.resolvedBoardId,
      req.user.id,
      "updated a column",
      "Column",
      col.id,
      { name: col.name },
    );
    return col;
  }

  /** Deletes a column and all its tasks. */
  @Delete("columns/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteColumn(
    @Param("id") id: string,
    @Req() req: Request & { user: AuthUser; resolvedBoardId: string },
  ): Promise<void> {
    await this.columnsService.deleteColumn(id);
    await this.activityLogger.logAndBroadcast(
      req.resolvedBoardId,
      req.user.id,
      "deleted a column",
      "Column",
      id,
    );
  }

  /** Moves a column to a new position. */
  @Patch("columns/:id/move")
  async moveColumn(
    @Param("id") id: string,
    @Body() dto: MoveColumnDto,
    @Req() req: Request & { user: AuthUser; resolvedBoardId: string },
  ): Promise<Column> {
    const col = await this.columnsService.moveColumn(id, dto);
    await this.activityLogger.logAndBroadcast(
      req.resolvedBoardId,
      req.user.id,
      "moved a column",
      "Column",
      col.id,
      { name: col.name },
    );
    return col;
  }
}
