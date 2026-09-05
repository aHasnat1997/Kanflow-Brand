/**
 * @module TasksService
 *
 * Business logic for task lifecycle: creation (appended at column end),
 * editing, deletion, and cross-column/same-column moves with race-safe transactions.
 * All position math is delegated to {@link task-ordering.util.ts}.
 */
import { Injectable, NotFoundException } from "@nestjs/common";
import type { Task } from "@Kanflow-Brand/types";
import type { CreateTaskDto } from "./dto/create-task.dto";
import type { UpdateTaskDto } from "./dto/update-task.dto";
import type { MoveTaskDto } from "./dto/move-task.dto";
import { TasksRepository } from "./tasks.repository";
import {
  calculateAppendPosition,
  POSITION_GAP,
} from "./task-ordering.util";

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  /**
   * Creates a new task appended at the end of the column.
   *
   * @param columnId - Target column CUID
   * @param dto - Task creation data (title, optional description)
   * @returns The newly created {@link Task}
   */
  async createTask(columnId: string, dto: CreateTaskDto): Promise<Task> {
    const lastPosition = await this.tasksRepository.getLastPosition(columnId);
    const position =
      lastPosition !== null
        ? calculateAppendPosition(lastPosition)
        : POSITION_GAP;

    const task = await this.tasksRepository.create(
      columnId,
      dto.title,
      dto.description ?? null,
      position,
    );

    return this.mapTask(task);
  }

  /**
   * Updates a task's title and/or description.
   *
   * @param id - Task CUID
   * @param dto - Fields to update (all optional via PartialType)
   * @returns The updated {@link Task}
   * @throws {NotFoundException} 404 if the task doesn't exist
   */
  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
    const existing = await this.tasksRepository.findById(id);
    if (!existing) throw new NotFoundException("Task not found");

    const updated = await this.tasksRepository.update(id, {
      title: dto.title,
      description: dto.description,
    });

    return this.mapTask(updated);
  }

  /**
   * Deletes a task.
   *
   * @param id - Task CUID
   * @throws {NotFoundException} 404 if the task doesn't exist
   */
  async deleteTask(id: string): Promise<void> {
    const existing = await this.tasksRepository.findById(id);
    if (!existing) throw new NotFoundException("Task not found");
    await this.tasksRepository.delete(id);
  }

  /**
   * Moves a task to a new column and/or position, recalculating its fractional
   * position based on its new neighbours. Runs inside a transaction to prevent
   * two concurrent moves from producing colliding positions.
   *
   * @param taskId - ID of the task being moved
   * @param dto - Contains `targetColumnId` and `newPosition`
   * @returns The updated {@link Task}
   * @throws {NotFoundException} if the task doesn't exist
   */
  async moveTask(taskId: string, dto: MoveTaskDto): Promise<Task> {
    const existing = await this.tasksRepository.findById(taskId);
    if (!existing) throw new NotFoundException("Task not found");

    const updated = await this.tasksRepository.moveTask(
      taskId,
      dto.targetColumnId,
      dto.newPosition,
    );

    return this.mapTask(updated);
  }

  /**
   * Maps a raw Prisma Task record to the shared {@link Task} type.
   * Keeps the service return types decoupled from Prisma's generated types.
   *
   * @param task - Prisma task record
   * @returns Mapped {@link Task}
   */
  private mapTask(task: {
    id: string;
    columnId: string;
    title: string;
    description: string | null;
    position: number;
    createdAt: Date;
  }): Task {
    return {
      id: task.id,
      columnId: task.columnId,
      title: task.title,
      description: task.description,
      position: task.position,
      createdAt: task.createdAt,
    };
  }
}
