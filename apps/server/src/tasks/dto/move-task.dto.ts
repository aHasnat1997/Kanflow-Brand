import { IsString, IsNumber } from "class-validator";

/** DTO for moving a task to a new column and/or position via drag-and-drop. */
export class MoveTaskDto {
  /** The column the task should end up in (may be the same column for reorder). */
  @IsString()
  targetColumnId!: string;

  /**
   * The desired float position within the target column.
   * Calculated by the frontend using the same midpoint algorithm as the server.
   */
  @IsNumber()
  newPosition!: number;
}
