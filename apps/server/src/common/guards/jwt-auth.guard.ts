import { Injectable, type ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Observable } from "rxjs";

/**
 * Guard that validates the `auth_token` httpOnly cookie via the `jwt` Passport strategy.
 *
 * Apply to any controller route that requires an authenticated user.
 * On failure returns `401 Unauthorized`.
 *
 * @example
 * ```ts
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthUser) { ... }
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
