import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool } from "./index";

/**
 * Stable, arbitrary key. Two instances booting at once take this lock in turn,
 * so only one applies the migrations and the other waits, then finds nothing
 * left to do.
 */
const MIGRATION_LOCK_ID = 47112026;

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * `drizzle/` is committed and ships with the deploy, but where it sits
 * relative to this file differs between `tsx` (server/src/db) and the bundled
 * production build (dist/server).
 */
function findMigrationsFolder(): string | null {
  const candidates = [
    path.resolve(process.cwd(), "drizzle"),
    path.resolve(here, "../../../drizzle"),
    path.resolve(here, "../../drizzle"),
  ];
  return candidates.find((dir) => existsSync(dir)) ?? null;
}

/**
 * Bring the database up to date before serving traffic.
 *
 * Render's free tier can't run a pre-deploy step, so migrations otherwise rely
 * on someone having put `db:migrate` in the build command. When that's missed
 * the service starts perfectly well and then fails every sign-up with
 * "relation \"user\" does not exist" — so do it here, where it can't be
 * skipped. Re-running is a no-op: drizzle records what it has applied.
 */
export async function runMigrations(): Promise<void> {
  const migrationsFolder = findMigrationsFolder();
  if (!migrationsFolder) {
    throw new Error(
      "Could not find the drizzle/ migrations folder. It is committed to the " +
        "repo — check it was included in the deploy.",
    );
  }

  // The advisory lock is session-scoped, so it has to be taken and released on
  // the same connection that runs the migrations — not borrowed from the pool
  // per statement.
  const client = await pool.connect();
  try {
    await client.query("select pg_advisory_lock($1)", [MIGRATION_LOCK_ID]);
    await migrate(drizzle(client), { migrationsFolder });
  } finally {
    await client
      .query("select pg_advisory_unlock($1)", [MIGRATION_LOCK_ID])
      .catch(() => {
        /* Releasing is best-effort; the lock dies with the connection. */
      });
    client.release();
  }
}
