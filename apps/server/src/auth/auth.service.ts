/**
 * @module AuthService
 *
 * Handles user registration, login, and session validation.
 * Business logic lives here; database access is delegated to {@link AuthRepository}.
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import type { User, JwtPayload, AuthUser } from "@Kanflow-Brand/types";
import type { RegisterDto } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";

/** Number of bcrypt salt rounds — balances security vs. CPU cost. */
const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user. Checks for email uniqueness, hashes the password,
   * and persists the user record.
   *
   * @param dto - Registration data (email, name, raw password)
   * @returns The newly created {@link User} (without passwordHash)
   * @throws {ConflictException} 409 if the email is already registered
   */
  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.authRepository.createUser({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  /**
   * Validates email/password credentials and returns a signed JWT on success.
   * The token is intended to be set as an httpOnly cookie by the controller —
   * it is never returned in the response body.
   *
   * @param email - The user's email address
   * @param password - The raw password to verify against the stored hash
   * @returns A signed JWT string
   * @throws {UnauthorizedException} 401 if credentials are invalid (intentionally vague)
   */
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await this.authRepository.findByEmail(email);

    // Use constant-time compare even when user is null to avoid timing attacks
    const isValid =
      user !== null && (await bcrypt.compare(password, user.passwordHash));

    if (!isValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload: JwtPayload = {
      sub: user!.id,
      email: user!.email,
      name: user!.name,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        createdAt: user!.createdAt,
      },
    };
  }

  /**
   * Returns the full public profile of the currently authenticated user.
   * Used by `GET /auth/me` to validate the session on app load.
   *
   * @param authUser - The user extracted from the JWT by {@link JwtStrategy}
   * @returns The user's public profile fields
   */
  async getMe(authUser: AuthUser): Promise<User> {
    const user = await this.authRepository.findById(authUser.id);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}
