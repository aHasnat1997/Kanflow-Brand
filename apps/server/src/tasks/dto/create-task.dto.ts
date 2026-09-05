import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";

/** DTO for creating a new task within a column. */
export class CreateTaskDto {
  /** The task title — displayed as the card headline. */
  @IsString()
  @MinLength(1, { message: "title must not be empty" })
  @MaxLength(500, { message: "title must be at most 500 characters" })
  title!: string;

  /** Optional longer description for the task. */
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: "description must be at most 5000 characters" })
  description?: string;
}
