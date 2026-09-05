import { Injectable } from "@nestjs/common";
import prisma from "@Kanflow-Brand/db";
import type {
  Column as PrismaColumn,
} from "@Kanflow-Brand/db";

/**
 * Repository for Column persistence operations.
 * All Prisma calls for Column are here — services never touch Prisma directly.
 */
@Injectable()
export class ColumnsRepository {
  /**
   * Returns all columns in a board, ordered by position ascending.
   *
   * @param boardId - Board CUID
   * @returns Ordered array of columns
   */
  async findAllByBoard(boardId: string): Promise<PrismaColumn[]> {
    return prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
    });
  }

  /**
   * Finds a column by its CUID.
   *
   * @param id - Column CUID
   * @returns Column record or `null`
   */
  async findById(id: string): Promise<PrismaColumn | null> {
    return prisma.column.findUnique({ where: { id } });
  }

  /**
   * Returns the highest position value among a board's columns.
   * Used to calculate the append position for a new column.
   *
   * @param boardId - Board CUID
   * @returns The max position value, or `null` if the board has no columns
   */
  async getLastPosition(boardId: string): Promise<number | null> {
    const result = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    return result?.position ?? null;
  }

  /**
   * Creates a new column with the given position.
   *
   * @param boardId - Board CUID
   * @param name - Column display name
   * @param position - Float position for ordering
   * @returns The newly created column
   */
  async create(boardId: string, name: string, position: number): Promise<PrismaColumn> {
    return prisma.column.create({ data: { boardId, name, position } });
  }

  /**
   * Updates a column's name.
   *
   * @param id - Column CUID
   * @param name - New display name
   * @returns The updated column
   */
  async update(id: string, name: string): Promise<PrismaColumn> {
    return prisma.column.update({ where: { id }, data: { name } });
  }

  /**
   * Deletes a column and all its tasks (cascade via Prisma schema).
   *
   * @param id - Column CUID
   */
  async delete(id: string): Promise<void> {
    await prisma.column.delete({ where: { id } });
  }

  /**
   * Returns all position values for a board's columns, sorted ascending.
   * Used by the rebalance check in the service.
   *
   * @param boardId - Board CUID
   * @returns Array of position numbers
   */
  async getAllPositions(boardId: string): Promise<number[]> {
    const cols = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
      select: { position: true },
    });
    return cols.map((c) => c.position);
  }

  /**
   * Batch-updates positions for all columns in a board by their ID.
   * Used during rebalancing.
   *
   * @param updates - Array of `{ id, position }` tuples
   */
  async updatePositions(updates: Array<{ id: string; position: number }>): Promise<void> {
    await prisma.$transaction(
      updates.map(({ id, position }) =>
        prisma.column.update({ where: { id }, data: { position } }),
      ),
    );
  }

  /**
   * Moves a column to a new position atomically inside a transaction.
   *
   * @param id - Column CUID to move
   * @param newPosition - New float position within the board
   * @returns The updated column record
   */
  async moveColumn(id: string, newPosition: number): Promise<PrismaColumn> {
    return prisma.$transaction(async (tx) => {
      return tx.column.update({
        where: { id },
        data: { position: newPosition },
      });
    });
  }
}
