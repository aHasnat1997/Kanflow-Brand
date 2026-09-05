import { IsEmail, IsString, MinLength } from "class-validator";

/** DTO for user registration. All fields are validated server-side. */
export class RegisterDto {
  /** Valid email address — must be unique in the system. */
  @IsEmail({}, { message: "email must be a valid email address" })
  email!: string;

  /** Display name shown on boards and in the UI. */
  @IsString()
  @MinLength(1, { message: "name must not be empty" })
  name!: string;

  /** Raw password — will be hashed with bcrypt before storage. */
  @IsString()
  @MinLength(8, { message: "password must be at least 8 characters" })
  password!: string;
}
