import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from "express";
import { env } from "@Kanflow-Brand/env/server";
import type { JwtPayload, AuthUser } from "@Kanflow-Brand/types";
import prisma from "@Kanflow-Brand/db";

/**
 * Passport JWT strategy that extracts the token from the `auth_token`
 * httpOnly cookie (never from the Authorization header).
 *
 * After successful verification, `validate()` is called with the decoded
 * payload. The returned value is attached to `req.user` and picked up by
 * the {@link CurrentUser} decorator.
 *
 * @throws {UnauthorizedException} if the token is missing, expired, or the
 *   user no longer exists in the database
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract JWT from the auth_token cookie, not the Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return (req.cookies as Record<string, string>)["auth_token"] ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  /**
   * Called by Passport after the JWT signature is verified.
   * Re-validates the user exists in the database to handle deleted accounts.
   *
   * @param payload - Decoded JWT payload containing sub (user id), email, name
   * @returns The {@link AuthUser} object to attach to `req.user`
   * @throws {UnauthorizedException} if the user no longer exists
   */
  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}
