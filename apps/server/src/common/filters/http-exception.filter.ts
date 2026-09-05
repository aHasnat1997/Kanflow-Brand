import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import type { ApiError } from "@Kanflow-Brand/types";

/**
 * Global exception filter that converts any thrown {@link HttpException} (or
 * unknown error) into a standardised JSON error body matching {@link ApiError}.
 *
 * Registered globally in `src/index.ts` so every controller benefits
 * automatically — no per-controller error handling needed.
 *
 * Response shape:
 * ```json
 * { "statusCode": 403, "message": "Forbidden", "error": "Forbidden" }
 * ```
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message =
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as Record<string, unknown>)["message"] ??
            exception.message;

      const errorBody: ApiError = {
        statusCode: status,
        message: Array.isArray(message) ? message.join(", ") : String(message),
        error: exception.name.replace("Exception", ""),
      };

      response.status(status).json(errorBody);
    } else {
      // Unexpected / unhandled error — mask the details in production
      const errorBody: ApiError = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
        error: "InternalServerError",
      };
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorBody);
    }
  }
}
