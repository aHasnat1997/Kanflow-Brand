import { IsString, MinLength, MaxLength } from "class-validator";

/** DTO for creating a new board. */
export class CreateBoardDto {
  /** The display name for the board. */
  @IsString()
  @MinLength(1, { message: "name must not be empty" })
  @MaxLength(100, { message: "name must be at most 100 characters" })
  name!: string;
}
