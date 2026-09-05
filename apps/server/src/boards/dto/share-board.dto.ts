import { IsEmail } from "class-validator";

/** DTO for sharing a board with another user by email. */
export class ShareBoardDto {
  /** Email of the user to invite as a MEMBER. */
  @IsEmail({}, { message: "email must be a valid email address" })
  email!: string;
}
