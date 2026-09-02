import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env";
import * as schema from "./schema";
import { sslConfig } from "./ssl";

const connectionString = env.databaseUrl();

export const pool = new Pool({
  connectionString,
  ssl: sslConfig(connectionString),
});

export const db = drizzle(pool, { schema });

export { schema };
