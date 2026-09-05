import { IsNumber } from "class-validator";

/** DTO for moving a column to a new position. */
export class MoveColumnDto {
  /** The new float position for the column. */
  @IsNumber()
  newPosition!: number;
}
