import "reflect-metadata";
import cookieParser from "cookie-parser";
import { env } from "@Kanflow-Brand/env/server";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ---------------------------------------------------------------------------
  // CORS — credentials:true required for httpOnly cookie to be sent cross-origin
  // ---------------------------------------------------------------------------
  app.enableCors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  // ---------------------------------------------------------------------------
  // Cookie parser — required for passport-jwt cookieExtractor
  // ---------------------------------------------------------------------------
  app.use(cookieParser());

  // ---------------------------------------------------------------------------
  // Global validation pipe — rejects bad input with 400, strips unknown fields
  // ---------------------------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ---------------------------------------------------------------------------
  // Global exception filter — ensures consistent { statusCode, message, error }
  // ---------------------------------------------------------------------------
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port} (env: ${env.NODE_ENV})`);
}

bootstrap();
