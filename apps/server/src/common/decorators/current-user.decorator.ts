import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthUser } from "@Kanflow-Brand/types";

/**
 * Parameter decorator that extracts the currently authenticated user
 * from the Express request object.
 *
 * Passport's `JwtStrategy.validate()` attaches the user to `req.user`
 * after successful JWT verification.
 *
 * @example
 * ```ts
 * @Get('me')
 * getMe(@CurrentUser() user: AuthUser) { ... }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    return request.user;
  },
);
