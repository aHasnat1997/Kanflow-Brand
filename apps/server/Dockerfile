FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS builder
COPY . .
RUN if [ -f bun.lock ]; then DATABASE_URL="postgresql://dummy:password@localhost:5432/dummy" bun install --frozen-lockfile; else DATABASE_URL="postgresql://dummy:password@localhost:5432/dummy" bun install; fi
RUN bun run --filter server build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=builder /app/package.json ./package.json
WORKDIR /app/apps/server
EXPOSE 5000
CMD ["bun", "run", "dist/index.mjs"]
