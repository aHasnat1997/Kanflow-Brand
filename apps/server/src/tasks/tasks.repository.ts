import { Injectable } from "@nestjs/common";
import prisma from "@Kanflow-Brand/db";
import type {
  Task as PrismaTask,
} from "@Kanflow-Brand/db";

/**
 * Repository for Task persistence operations.
 * All Prisma calls for Task are isolated here — services never touch Prisma directly.
 */
@Injectable()
export class TasksRepository {
  /**
   * Returns all tasks in a column, ordered by position ascending.
   *
   * @param columnId - Column CUID
   * @returns Ordered array of tasks
   */
  async findAllByColumn(columnId: string): Promise<PrismaTask[]> {
    return prisma.task.findMany({
      where: { columnId },
      orderBy: { position: "asc" },
    });
  }

  /**
   * Finds a task by its CUID.
   *
   * @param id - Task CUID
   * @returns Task record or `null`
   */
  async findById(id: string): Promise<PrismaTask | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  /**
   * Returns the highest position value in a column.
   *
   * @param columnId - Column CUID
   * @returns Max position value or `null` if the column is empty
   */
  async getLastPosition(columnId: string): Promise<number | null> {
    const result = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    return result?.position ?? null;
  }

  /**
   * Creates a new task at the given position.
   *
   * @param columnId - Column CUID
   * @param title - Task title
   * @param description - Optional description
   * @param position - Float position for ordering
   * @returns The newly created task
   */
  async create(
    columnId: string,
    title: string,
    description: string | null,
    position: number,
  ): Promise<PrismaTask> {
    return prisma.task.create({
      data: { columnId, title, description, position },
    });
  }

  /**
   * Updates a task's title and/or description.
   *
   * @param id - Task CUID
   * @param data - Fields to update (partial)
   * @returns The updated task
   */
  async update(
    id: string,
    data: { title?: string; description?: string | null },
  ): Promise<PrismaTask> {
    return prisma.task.update({ where: { id }, data });
  }

  /**
   * Deletes a task by its CUID.
   *
   * @param id - Task CUID
   */
  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }

  /**
   * Moves a task to a new column and position atomically inside a transaction.
   * The transaction prevents two concurrent moves from producing colliding positions.
   *
   * @param id - Task CUID to move
   * @param targetColumnId - Destination column CUID
   * @param newPosition - New float position within the target column
   * @returns The updated task record
   */
  async moveTask(
    id: string,
    targetColumnId: string,
    newPosition: number,
  ): Promise<PrismaTask> {
    return prisma.$transaction(async (tx) => {
      return tx.task.update({
        where: { id },
        data: { columnId: targetColumnId, position: newPosition },
      });
    });
  }

  /**
   * Returns all position values for a column's tasks, sorted ascending.
   *
   * @param columnId - Column CUID
   * @returns Array of position numbers
   */
  async getAllPositions(columnId: string): Promise<number[]> {
    const tasks = await prisma.task.findMany({
      where: { columnId },
      orderBy: { position: "asc" },
      select: { position: true },
    });
    return tasks.map((t) => t.position);
  }
}
