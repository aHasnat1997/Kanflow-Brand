import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    /** Secret used to sign and verify JWTs. Must be at least 32 characters. */
    JWT_SECRET: z.string().min(32),
    /** JWT expiry duration string (e.g. '7d', '24h'). Defaults to 7 days. */
    JWT_EXPIRES_IN: z.string().default("7d"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
