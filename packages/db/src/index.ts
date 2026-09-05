import { env } from "@Kanflow-Brand/env/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "../prisma/generated/client";

// Setup pg connection pool
const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
export * from "../prisma/generated/client";
