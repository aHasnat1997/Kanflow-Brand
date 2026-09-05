import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { AuthUser, MeResponse, RegisterResponse } from "@Kanflow-Brand/types";
import { env } from "@Kanflow-Brand/env/server";

/** Cookie name used throughout the application. */
const AUTH_COOKIE_NAME = "auth_token";

/** Cookie max-age in seconds — must match JWT expiry. 7 days = 604800s. */
const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/**
 * Handles authentication routes: register, login, logout, and session check.
 * The JWT lives exclusively in an httpOnly cookie — never in the response body.
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user account.
   *
   * @returns 201 with the created user's public profile
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    const user = await this.authService.register(dto);
    return { user };
  }

  /**
   * Authenticates a user and sets the `auth_token` httpOnly cookie on success.
   * The JWT is NOT returned in the response body.
   *
   * @returns 200 with the authenticated user's public profile
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MeResponse> {
    const { token, user } = await this.authService.login(dto.email, dto.password);

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE_SECONDS * 1000,
      path: "/",
    });

    return { user };
  }

  /**
   * Clears the `auth_token` cookie, ending the user's session.
   *
   * @returns 204 No Content
   */
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response): void {
    res.cookie(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }

  /**
   * Returns the currently authenticated user's profile.
   * Used by the frontend on app load to verify session state.
   *
   * @returns 200 with the user's public profile
   * @throws 401 if the cookie is missing or the JWT is invalid/expired
   */
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: AuthUser): Promise<MeResponse> {
    const fullUser = await this.authService.getMe(user);
    return { user: fullUser };
  }
}
