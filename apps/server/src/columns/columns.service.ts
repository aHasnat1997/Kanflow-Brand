/**
 * @module ColumnsService
 *
 * Business logic for column lifecycle: creation (with position appended at
 * the end), renaming, and deletion. Position ordering is delegated entirely
 * to {@link task-ordering.util.ts}.
 */
import { Injectable, NotFoundException } from "@nestjs/common";
import type { Column } from "@Kanflow-Brand/types";
import type { CreateColumnDto } from "./dto/create-column.dto";
import type { UpdateColumnDto } from "./dto/update-column.dto";
import type { MoveColumnDto } from "./dto/move-column.dto";
import { ColumnsRepository } from "./columns.repository";
import {
  calculateAppendPosition,
  POSITION_GAP,
} from "../tasks/task-ordering.util";

@Injectable()
export class ColumnsService {
  constructor(private readonly columnsRepository: ColumnsRepository) {}

  /**
   * Creates a new column appended at the end of the board's column list.
   * Uses {@link calculateAppendPosition} from the shared ordering util.
   *
   * @param boardId - Board CUID
   * @param dto - Column creation data
   * @returns The newly created {@link Column}
   */
  async createColumn(boardId: string, dto: CreateColumnDto): Promise<Column> {
    const lastPosition = await this.columnsRepository.getLastPosition(boardId);
    // If no columns exist yet, start at POSITION_GAP; otherwise append
    const position =
      lastPosition !== null
        ? calculateAppendPosition(lastPosition)
        : POSITION_GAP;

    const col = await this.columnsRepository.create(boardId, dto.name, position);
    return {
      id: col.id,
      boardId: col.boardId,
      name: col.name,
      position: col.position,
      createdAt: col.createdAt,
    };
  }

  /**
   * Renames an existing column.
   *
   * @param id - Column CUID
   * @param dto - Update data (name is optional via PartialType)
   * @returns The updated {@link Column}
   * @throws {NotFoundException} 404 if the column doesn't exist
   */
  async updateColumn(id: string, dto: UpdateColumnDto): Promise<Column> {
    const existing = await this.columnsRepository.findById(id);
    if (!existing) throw new NotFoundException("Column not found");

    const updated = await this.columnsRepository.update(id, dto.name ?? existing.name);
    return {
      id: updated.id,
      boardId: updated.boardId,
      name: updated.name,
      position: updated.position,
      createdAt: updated.createdAt,
    };
  }

  /**
   * Moves a column to a new position.
   *
   * @param id - Column CUID
   * @param dto - Move data
   * @returns The updated {@link Column}
   * @throws {NotFoundException} 404 if the column doesn't exist
   */
  async moveColumn(id: string, dto: MoveColumnDto): Promise<Column> {
    const existing = await this.columnsRepository.findById(id);
    if (!existing) throw new NotFoundException("Column not found");

    const updated = await this.columnsRepository.moveColumn(
      id,
      dto.newPosition,
    );

    return {
      id: updated.id,
      boardId: updated.boardId,
      name: updated.name,
      position: updated.position,
      createdAt: updated.createdAt,
    };
  }

  /**
   * Deletes a column and all its tasks (cascaded by the database schema).
   *
   * @param id - Column CUID
   * @throws {NotFoundException} 404 if the column doesn't exist
   */
  async deleteColumn(id: string): Promise<void> {
    const existing = await this.columnsRepository.findById(id);
    if (!existing) throw new NotFoundException("Column not found");
    await this.columnsRepository.delete(id);
  }
}
