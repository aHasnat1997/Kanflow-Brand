import { IsEmail, IsString, MinLength } from "class-validator";

/** DTO for user login credentials. */
export class LoginDto {
  /** Email address used during registration. */
  @IsEmail({}, { message: "email must be a valid email address" })
  email!: string;

  /** The user's raw password — compared against the stored bcrypt hash. */
  @IsString()
  @MinLength(1, { message: "password must not be empty" })
  password!: string;
}
