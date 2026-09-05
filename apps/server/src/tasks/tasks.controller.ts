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
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { MoveTaskDto } from "./dto/move-task.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BoardAccessGuard } from "../common/guards/board-access.guard";
import { ActivityLoggerService } from "../boards/activity-logger.service";
import type { Task, AuthUser } from "@Kanflow-Brand/types";

/**
 * HTTP interface for task management within columns.
 * {@link BoardAccessGuard} enforces membership — applied once at class level.
 *
 * Note: For column-scoped routes (`/columns/:columnId/tasks`), the guard reads
 * the column's `boardId` by resolving through the column. For task-scoped
 * routes (`/tasks/:id`), the guard resolves the board via the task → column → board chain.
 */
@Controller()
@UseGuards(JwtAuthGuard, BoardAccessGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly activityLogger: ActivityLoggerService,
  ) {}

  /** Creates a new task appended to the column. */
  @Post("columns/:columnId/tasks")
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Param("columnId") columnId: string,
    @Body() dto: CreateTaskDto,
    @Req() req: Request & { user: AuthUser; resolvedBoardId: string },
  ): Promise<Task> {
    const task = await this.tasksService.createTask(columnId, dto);
    await this.activityLogger.logAndBroadcast(
      req.resolvedBoardId,
      req.user.id,
      "created a task",
      "Task",
      task.id,
      { title: task.title },
    );
    return task;
  }

  /** Updates a task's title and/or description. */
  @Patch("tasks/:id")
  async updateTask(
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request & { user: AuthUser; resolvedBoardId: string },
  ): Promise<Task> {
    const task = await this.tasksService.updateTask(id, dto);
    await this.activityLogger.logAndBroadcast(
      req.resolvedBoardId,
      req.user.id,
      "updated a task",
      "Task",
      task.id,
      { title: task.title },
    );
    return task;
  }

  /** Deletes a task. */
  @Delete("tasks/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(
    @Param("id") id: string,
    @Req() req: Request & { user: AuthUser; resolvedBoardId: string },
  ): Promise<void> {
    await this.tasksService.deleteTask(id);
    await this.activityLogger.logAndBroadcast(
      req.resolvedBoardId,
      req.user.id,
      "deleted a task",
      "Task",
      id,
    );
  }

  /**
   * Moves a task to a new column and/or position (drag-and-drop endpoint).
   * Optimistic UI update on the frontend; this persists the final position.
   */
  @Patch("tasks/:id/move")
  async moveTask(
    @Param("id") id: string,
    @Body() dto: MoveTaskDto,
    @Req() req: Request & { user: AuthUser; resolvedBoardId: string },
  ): Promise<Task> {
    const task = await this.tasksService.moveTask(id, dto);
    await this.activityLogger.logAndBroadcast(
      req.resolvedBoardId,
      req.user.id,
      "moved a task",
      "Task",
      task.id,
      { title: task.title },
    );
    return task;
  }
}
