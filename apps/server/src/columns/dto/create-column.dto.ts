import { IsString, MinLength, MaxLength } from "class-validator";

/** DTO for creating a new column within a board. */
export class CreateColumnDto {
  /** Display name of the column (e.g. "To Do", "In Progress"). */
  @IsString()
  @MinLength(1, { message: "name must not be empty" })
  @MaxLength(100, { message: "name must be at most 100 characters" })
  name!: string;
}
