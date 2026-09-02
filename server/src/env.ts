import "dotenv/config";

/**
 * Every secret and environment-specific value the server needs lives here.
 * Nothing is ever hard-coded — locally these come from the git-ignored `.env`,
 * in production from the Render dashboard.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. See .env.example.`,
    );
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  appUrl: process.env.APP_URL ?? "http://localhost:5173",
  /** Lazily read so M0/M1 tooling can boot before the DB is wired up. */
  databaseUrl: () => required("DATABASE_URL"),
};

export const isProduction = env.nodeEnv === "production";
